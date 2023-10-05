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
} as const;
