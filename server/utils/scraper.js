/**
 * Scraper Utility
 * 
 * Yeh file external coding platforms (LeetCode aur GeeksforGeeks) se 
 * problem description fetch karne aur HTML ko clean text me convert karne ke liye hai.
 */

/**
 * HTML cleaning function:
 * Script aur style tags ko remove karta hai, aur relative links ko absolute URLs me convert karta hai.
 * 
 * @param {string} html - Scraped page se mila raw HTML string.
 * @param {string} link - Original problem link (LeetCode / GeeksforGeeks).
 * @returns {string} - Clean kiya hua HTML text.
 */
const cleanHtml = (html, link) => {
  if (!html) return "";
  
  let text = html;

  // 1. Remove script and style tags to prevent code execution
  text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");
  text = text.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");

  // 2. Rewrite relative src URLs to absolute URLs in img/iframe/source tags
  text = text.replace(/src=["'](\/[^"']+)["']/gi, (match, path) => {
    if (link && link.includes("leetcode.com")) {
      return `src="https://leetcode.com${path}"`;
    } else if (link && link.includes("geeksforgeeks.org")) {
      return `src="https://www.geeksforgeeks.org${path}"`;
    }
    return match;
  });

  // 3. Rewrite relative href URLs to absolute URLs in anchor tags
  text = text.replace(/href=["'](\/[^"']+)["']/gi, (match, path) => {
    if (link && link.includes("leetcode.com")) {
      return `href="https://leetcode.com${path}"`;
    } else if (link && link.includes("geeksforgeeks.org")) {
      return `href="https://www.geeksforgeeks.org${path}"`;
    }
    return match;
  });

  return text.trim();
};

/**
 * Problem description scraper:
 * Link recognize karke correct platform (LeetCode/GFG) ke rules use karke content retrieve karta hai.
 * 
 * @param {string} link - Coding platform link (e.g. LeetCode / GeeksforGeeks).
 * @returns {Promise<string>} - Formatted problem statement notes.
 */
const scrapeProblemDescription = async (link) => {
  if (!link) return "";

  const url = new URL(link);
  let description = "";

  // CASE 1: LeetCode Problem Extraction
  if (url.hostname.includes("leetcode.com")) {
    const match = url.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
    if (match && match[1]) {
      const slug = match[1]; // Problem title slug (e.g. "two-sum")
      
      // LeetCode ke official GraphQL endpoint se question text target karo
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({
          query: `
            query questionData($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                content
                topicTags {
                  name
                }
                hints
                similarQuestions
              }
            }
          `,
          variables: { titleSlug: slug }
        })
      });
      const data = await response.json();
      const question = data.data?.question;
      const content = question?.content;
      if (content) {
        description = cleanHtml(content, link);

        // 1. Topic Tags
        if (question.topicTags && question.topicTags.length > 0) {
          const tagsHtml = question.topicTags
            .map(tag => `<span style="background-color: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 5px; display: inline-block; font-weight: 500;">#${tag.name}</span>`)
            .join("");
          description += `<div style="margin-top: 20px; border-top: 1px dashed #e5e7eb; padding-top: 12px;"><strong>Topic Tags:</strong><div style="margin-top: 6px;">${tagsHtml}</div></div>`;
        }

        // 2. Similar Questions
        if (question.similarQuestions) {
          try {
            const similar = JSON.parse(question.similarQuestions);
            if (similar && similar.length > 0) {
              const linksHtml = similar
                .map(q => `<li style="margin-bottom: 5px;"><a href="https://leetcode.com/problems/${q.titleSlug}" target="_blank" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${q.title}</a> <span style="font-size: 11px; font-weight: 600; color: ${q.difficulty === 'Easy' ? '#10b981' : q.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'}">(${q.difficulty})</span></li>`)
                .join("");
              description += `<div style="margin-top: 15px;"><strong>Similar Questions:</strong><ul style="margin-top: 6px; list-style-type: disc; padding-left: 20px;">${linksHtml}</ul></div>`;
            }
          } catch (e) {
            console.error("Error parsing similar questions:", e);
          }
        }

        // 3. Hints (Collapsible details element)
        if (question.hints && question.hints.length > 0) {
          const hintsHtml = question.hints
            .map((hint, idx) => `
              <details style="margin-top: 8px; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; background-color: #fafafa; cursor: pointer;">
                <summary style="font-weight: 650; font-size: 12px; color: #4b5563; outline: none;">💡 Hint ${idx + 1}</summary>
                <p style="margin-top: 6px; font-size: 12.5px; color: #1f2937; line-height: 1.5; cursor: text;">${hint}</p>
              </details>
            `)
            .join("");
          description += `<div style="margin-top: 15px; margin-bottom: 10px;"><strong>Hints:</strong>${hintsHtml}</div>`;
        }
      }
    }
  }
  // CASE 2: GeeksforGeeks Problem Extraction
  else if (url.hostname.includes("geeksforgeeks.org")) {
    const response = await fetch(link, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    const html = await response.text();
 
    // 1. Pehle page ke SSR component state script script id="__NEXT_DATA__" ko search aur parse karo
    const scriptMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      try {
        const data = JSON.parse(scriptMatch[1]);
        const probData = data.props?.pageProps?.initialState?.problemData?.allData?.probData;
        if (probData && probData.problem_question) {
          description = cleanHtml(probData.problem_question, link);
        }
      } catch (e) {
        console.error("Error parsing __NEXT_DATA__ GFG script:", e);
      }
    }
 
    // 2. Fallback check: Agar client-side rendering structure badal gaya hai, HTML class problem-statement scrape karo
    if (!description) {
      const match = html.match(/<div class="problem-statement">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        description = cleanHtml(match[1], link);
      }
    }
  }

  return description;
};

module.exports = {
  cleanHtml,
  scrapeProblemDescription,
};
