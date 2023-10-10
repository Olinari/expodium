export const getPageDetails = () => {
  const pageTitle = document.title;

  const getMetaContent = (name: string) => {
    const element = document.querySelector(`meta[name='${name}']`);
    return element ? element.getAttribute("content") : null;
  };
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