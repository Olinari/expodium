export const actions = {
  click: (selector: string) => {
    document.querySelector<HTMLButtonElement>(selector).click();
  },
  navigate: (to) => {
    window.location = to;
  },

  "reload the page": () => {
    location.reload();
  },
};
