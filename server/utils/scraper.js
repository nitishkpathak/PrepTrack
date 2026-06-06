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
            query questionContent($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                content
              }
            }
          `,
          variables: { titleSlug: slug }
        })
      });
      const data = await response.json();
      const content = data.data?.question?.content;
      if (content) {
        description = cleanHtml(content, link);
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
