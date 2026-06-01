/**
 * Scraper Utility
 * 
 * Yeh file external coding platforms (LeetCode aur GeeksforGeeks) se 
 * problem description fetch karne aur HTML ko clean text me convert karne ke liye hai.
 */

/**
 * HTML cleaning function:
 * HTML tags (p, div, br, strong, code, etc.) ko clean readable plain text / markdown tags me convert karta hai.
 * 
 * @param {string} html - Scraped page se mila raw HTML string.
 * @returns {string} - Clean kiya hua markdown-like text.
 */
const cleanHtml = (html) => {
  if (!html) return "";
  
  let text = html;

  // 1. Block level HTML tags (p, div, br, li, header tags) ko newlines me replace karo
  text = text.replace(/<(p|div|br|li|h1|h2|h3|h4|h5|h6)[^>]*>/gi, "\n");
  text = text.replace(/<\/p>|<\/div>|<\/li>/gi, "\n");
  
  // 2. Bold / Italic / Code inline styles ko markdown equivalents (** , * , `) me convert karo
  text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // 3. Baaki bache saare HTML tag wrappers ko strip/remove karo
  text = text.replace(/<[^>]*>/g, "");

  // 4. HTML entity codes (&nbsp;, &lt;, &gt;, etc.) ko clean kar ke simple readability text me parse karo
  const entities = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&middot;": "·",
    "&ndash;": "–",
    "&mdash;": "—",
    "&#39;": "'",
    "&le;": "≤",
    "&ge;": "≥",
    "&lt;=": "≤",
    "&gt;=": "≥",
  };
  for (const [entity, value] of Object.entries(entities)) {
    text = text.replaceAll(entity, value);
  }

  // 5. Continuous multi-line newlines ko collapse karke strictly double newlines (\n\n) use karo
  text = text.replace(/\n\s*\n\s*\n+/g, "\n\n");
  
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
        description = cleanHtml(content);
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
          description = cleanHtml(probData.problem_question);
        }
      } catch (e) {
        console.error("Error parsing __NEXT_DATA__ GFG script:", e);
      }
    }

    // 2. Fallback check: Agar client-side rendering structure badal gaya hai, HTML class problem-statement scrape karo
    if (!description) {
      const match = html.match(/<div class="problem-statement">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        description = cleanHtml(match[1]);
      }
    }
  }

  return description;
};

module.exports = {
  cleanHtml,
  scrapeProblemDescription,
};
