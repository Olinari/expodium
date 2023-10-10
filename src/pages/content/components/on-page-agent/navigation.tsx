import { useEffect } from "react";
import _ from "lodash";

export function useScrollController(onscroll: (any) => void) {
  const handleScroll = _.debounce(onscroll, 3000);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);
}
