export const actions = {
  click: (element: HTMLElement) => {
    element.click();
  },
  navigate: (fullWebAdressIncludingHttps) => {
    window.location.href = fullWebAdressIncludingHttps;
  },
  "reload the page": () => {
    location.reload();
  },
} as const;
