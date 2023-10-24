import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

import { useChatContext } from "@pages/content/components/on-page-agent/chat-provider";
import {
  getHTMLElmentFromRect,
  removeRedundatRects,
  sortIntoMatrix,
} from "@src/utils/webpage-utils";
import { parseJsonFromResponse } from "@src/utils/data-utils";

interface UiHelpersContextType {
  updateUiHelperControls: (data: any) => void;
  selectedDomElement: HTMLElement;
  selectedElementDetails: any;
}

const UiHelpersContext = createContext<UiHelpersContextType | undefined>(
  undefined
);

export const useUiHelpersContext = (): UiHelpersContextType => {
  return useContext(UiHelpersContext);
};

interface UiHelpersProviderProps {
  children: ReactNode;
}

export const UiHelpersProvider = ({ children }: UiHelpersProviderProps) => {
  const [elementsData, setElements] = useState([]);
  const [selectedElementIndex, setSelctedElementIndex] = useState([0, 0]);
  const [selectedDomElement, setSelectedDomElement] =
    useState<HTMLElement>(null);
  const [selectedElementDetails, setSelectedElementDetails] = useState(null);

  const updateUiHelperControls = (data: any) => {
    setElements(sortIntoMatrix(removeRedundatRects(data)));
  };

  const { promptChatWithElement } = useChatContext();

  const offset = 8 as const;

  const navigateUIElements = useCallback(
    async (event) => {
      let [row, col] = selectedElementIndex;
      let domElement;
      let markup;
      let rect;
      let elementDetails;
      const element = elementsData[row][col];

      switch (event.key) {
        case "a": // Left
          col = Math.max(0, col - 1);
          break;
        case "s": // Down
          row = Math.min(elementsData.length - 1, row + 1);
          col = Math.min(elementsData[row].length - 1, col); // adjust column if the next row has fewer items
          break;
        case "d": // Right
          col = Math.min(elementsData[row].length - 1, col + 1);
          break;
        case "w": // Up
          row = Math.max(0, row - 1);
          col = Math.min(elementsData[row].length - 1, col); // adjust column if the previous row has fewer items
          break;

        case "Enter":
          domElement = getHTMLElmentFromRect(
            element.x - 0.5 * element.width,
            element.y - 0.5 * element.height,
            element.width,
            element.height,
            element.tag
          );

          markup = domElement.innerHTML;

          rect = {
            x: element.x * 2 - element.width,
            y: element.y * 2 - element.height,
            width: element.width * 2,
            height: element.height * 2,
          };
          elementDetails = await promptChatWithElement(rect, markup);
          elementDetails = parseJsonFromResponse(elementsData);
          setSelectedElementDetails(elementDetails);
          setSelectedDomElement(domElement);
          break;
        default:
          return;
      }

      setSelctedElementIndex([row, col]);
    },
    [selectedElementIndex, elementsData]
  );

  useEffect(() => {
    document.addEventListener("keydown", navigateUIElements);
    return () => document.removeEventListener("keydown", navigateUIElements);
  }, [navigateUIElements]);

  return (
    <UiHelpersContext.Provider
      value={{
        updateUiHelperControls,
        selectedDomElement,
        selectedElementDetails,
      }}
    >
      <>
        {elementsData.map((row, y) => {
          return row.map((element, x) => {
            const width = offset + element.width;
            const height = offset + element.height;
            const top = element.y - 0.5 * element.height - offset / 2;
            const left = element.x - 0.5 * element.width - offset / 2;
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  border:
                    selectedElementIndex[0] === y &&
                    selectedElementIndex[1] === x
                      ? "2px solid blue"
                      : "2px solid transparent",
                  position: "absolute",
                  top: `${top}px`,
                  left: `${left}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  zIndex: 10000,
                }}
                data-slicerra={true}
                data-index={element.id}
                data-element={element.class}
              />
            );
          });
        })}
      </>
      {children}
    </UiHelpersContext.Provider>
  );
};
