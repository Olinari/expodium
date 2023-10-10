import { useEffect, useRef, useState } from "react";

export function useScrollController(onscroll: (any) => void) {
  const [isScrolling, setIsScrolling] = useState(false);
  const hasScrolledDownRef = useRef(false);
  const hasScrolledUpRef = useRef(false);

  const scrollWindow = (direction: "up" | "down") => {
    const scrollAmount =
      direction === "down" ? window.innerHeight : -window.innerHeight;
    window.scrollBy({
      top: scrollAmount,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleKeyPress = async (event: KeyboardEvent) => {
    event.preventDefault();
    if (isScrolling) return;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      setIsScrolling(true);

      if (event.key === "ArrowDown") {
        if (hasScrolledDownRef.current) {
          scrollWindow("down");
        } else {
          hasScrolledDownRef.current = true;
        }
      } else if (event.key === "ArrowUp") {
        if (hasScrolledUpRef.current) {
          scrollWindow("up");
        } else {
          hasScrolledUpRef.current = true;
        }
      }

      onscroll(() => setIsScrolling(false));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isScrolling]);
}
