import { OpenAIService } from "@src/services/open-ai";

import { minify } from "html-minifier";

const openAI = new OpenAIService();

export const actions = {
  click: (selector: string) => {
    document.querySelector<HTMLElement>(selector).click();
  },
  navigate: (fullWebAdressIncludingHttps) => {
    window.location.href = fullWebAdressIncludingHttps;
  },

  "reload the page": () => {
    location.reload();
  },

  explainThePage: async () => {
    const page = document.querySelector("html").outerHTML;
    console.log(
      await openAI.explainCode({ code: getMinifiedSemanticHTML(page) })
    );
  },
} as const;

function getMinifiedSemanticHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove script and style elements
  doc.querySelectorAll("script, style").forEach((el) => el.remove());

  // For each element, remove all attributes except for aria-label
  doc.querySelectorAll("*").forEach((element) => {
    for (let attr of Array.from(element.attributes)) {
      if (attr.name !== "aria-label") {
        element.removeAttribute(attr.name);
      }
    }
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
