const getMetaContent = (name: string) => {
  const element = document.querySelector(`meta[name='${name}']`);
  return element ? element.getAttribute("content") : null;
};

export const getPageDetails = () => {
  const pageTitle = document.title;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const metaTitle = getMetaContent("title");
  const metaDescription = getMetaContent("description");
  const metaViewport = getMetaContent("viewport");
  const pageURL = window.location.href;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const maxScrollableDistance = scrollHeight - clientHeight;
  const scrollPercentage = ((scrollTop / maxScrollableDistance) * 100).toFixed(
    2
  );
  return {
    "Page Title": pageTitle || "Not available",
    "Meta Title": metaTitle || "Not available",
    "Meta Description": metaDescription || "Not available",
    "Meta Viewport": metaViewport || "Not available",
    "Page URL": pageURL || "Not available",
    "Scroll Position": `${scrollTop || "Not available"}px`,
    "Scroll Percentage": `${scrollPercentage || "Not available"}`,
  };
};

export function getByText(text, node = document.body) {
  const textNodes = Array.from(node.querySelectorAll("*")).filter(
    (el: HTMLElement) =>
      el.textContent.includes(text) || text.includes(el.textContent)
  );

  if (textNodes.length === 0) {
    console.error(`No node found with text: ${text}`);
    return;
  }

  if (textNodes.length > 1) {
    console.error(`Multiple nodes found with text: ${text}`);
    return;
  }

  return textNodes[0];
}

export function getMostOverlappedElement(x, y, width, height, tag) {
  const rectArea = width * height;

  let maxScore = -Infinity;
  let mostOverlappedElement = null;

  // Get all elements within the bounding rectangle
  const elements = document.elementsFromPoint(x + width / 2, y + height / 2);

  for (const el of elements) {
    const elRect = el.getBoundingClientRect();

    const x_overlap = Math.max(
      0,
      Math.min(x + width, elRect.right) - Math.max(x, elRect.left)
    );
    const y_overlap = Math.max(
      0,
      Math.min(y + height, elRect.bottom) - Math.max(y, elRect.top)
    );

    const overlapArea = x_overlap * y_overlap;
    const elArea = elRect.width * elRect.height;
    const sizeDifference = Math.abs(rectArea - elArea);

    // Calculate a score which is the overlap area minus a penalty for size difference
    const score = overlapArea - sizeDifference * 0.1;

    if (score > maxScore && !el.getAttribute("data-slicerra")) {
      maxScore = score;
      mostOverlappedElement = el;
      el.setAttribute("data-element-type", tag);
    }
  }

  return mostOverlappedElement;
}
