import { OpenAIService } from "@src/services/open-ai";
import { getEncodedHtmlObject } from "@pages/content/components/expodium-helper/cleanup-html";

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
    const code = getEncodedHtmlObject(page);

    await openAI.summarizePage({ code });
  },
} as const;
