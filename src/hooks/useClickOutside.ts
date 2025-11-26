import { useEffect, useRef, RefObject } from "react";

interface UseClickOutsideProps {
  callback: (isOutside: boolean, event: MouseEvent) => void;
  excludeRefs?: RefObject<HTMLElement>[];
}

const useClickOutside = ({ callback, excludeRefs = [] }: UseClickOutsideProps): RefObject<HTMLElement> => {
  const rootEleRef = useRef<HTMLElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    let flag = false;
    if (rootEleRef.current && !rootEleRef.current.contains(event.target as Node)) {
      flag = true;
      if (excludeRefs) {
        excludeRefs.forEach((ref) => {
          if (ref.current && ref.current.contains(event.target as Node)) {
            flag = false;
          }
        });
      }
    }
    callback(flag, event);
  };

  useEffect(() => {
    // element click event maybe bubbling here sometimes, that will cause some error, so set capture to true.
    document.addEventListener("click", handleClickOutside, { capture: true });
    document.addEventListener("touchstart", handleClickOutside, { capture: true });
    return () => {
      document.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
      document.removeEventListener("touchstart", handleClickOutside, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootEleRef;
};

export { useClickOutside };
