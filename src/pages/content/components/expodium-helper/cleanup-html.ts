function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function removeEmptyTags(element) {
  const children = Array.from(element.children);

  for (let child of children) {
    removeEmptyTags(child);
    if (child.childNodes.length === 0 || child.textContent.trim() === "") {
      child.remove();
    }
  }
}

function encodeHtml(page: Document): string {
  function encodeElement(el: Element): string {
    let result = "";
    const nodeName = el.nodeName.toLowerCase();

    switch (nodeName) {
      case "div":
        result += "d";
        break;
      case "p":
        result += "p";
        break;
      case "a":
        result += "a";
        if (el.hasAttribute("href")) {
          result += `(${el.getAttribute("href")})`;
        }
        break;
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        result += "h";
        break;
      default:
        result += nodeName[0];
        break;
    }

    // Only get the direct text content of the element, excluding child nodes
    let directTextContent = Array.from(el.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((textNode) => textNode.textContent)
      .join("")
      .trim();
    if (directTextContent) {
      result += `:${directTextContent}`;
    }

    const children = Array.from(el.children);
    if (children.length) {
      result += "{";
      children.forEach((child) => {
        result += encodeElement(child);
      });
      result += "}";
    }

    return result;
  }

  return encodeElement(page);
}
function getCleanHtml(html): string {
  const parser = new DOMParser();
  const page = parser.parseFromString(
    document.querySelector("html").innerHTML,
    "text/html"
  );

  const unwantedSelectors = [
    "script",
    "style",
    "link",
    "meta",
    "noscript",
    "svg",
    "iframe",
  ];
  unwantedSelectors.forEach((selector) => {
    page.querySelectorAll(selector).forEach((node) => node.remove());
  });

  page.querySelectorAll("*").forEach((el) => {
    if (!isElementInViewport(el)) {
      el.remove();
    }
    [...el.attributes].forEach((attr) => {
      if (!(attr.name.startsWith("aria-") || attr.name.startsWith("id"))) {
        el.removeAttribute(attr.name);
      }
    });
  });

  removeEmptyTags(page);

  return page;
}

export function getEncodedHtmlObject(): string {
  const cleaned = getCleanHtml(document.querySelector("body"));
  const encoded = encodeHtml(cleaned);
  console.log(encoded);
  return encoded;
}
