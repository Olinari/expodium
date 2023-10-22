import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

import { useChatContext } from "@pages/content/components/on-page-agent/chat-provider";
import { removeRedundatRects, sortIntoMatrix } from "@src/utils/webpage-utils";

interface UiHelpersContextType {
  updateUiHelperControls: (data: any) => void;
}

const UiHelpersContext = createContext<UiHelpersContextType | undefined>(
  undefined
);

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useUiHelpersContext = (): UiHelpersContextType => {
  return useContext(UiHelpersContext);
};

interface UiHelpersProviderProps {
  children: ReactNode;
}

export const UiHelpersProvider = ({ children }: UiHelpersProviderProps) => {
  const [elementsData, setElements] = useState([]);
  const [selectedElementIndex, setSelctedElementIndex] = useState([0, 0]);

  const updateUiHelperControls = (data: any) => {
    setElements(sortIntoMatrix(removeRedundatRects(data)));
  };

  const { promptChatWithElement } = useChatContext();

  const offset = 8 as const;

  const navigate = useCallback(
    (event) => {
      let [row, col] = selectedElementIndex;

      const element = elementsData[row][col];

      console.log(event.key);

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
          promptChatWithElement(element);

          break;
        default:
          return;
      }

      setSelctedElementIndex([row, col]);
    },
    [selectedElementIndex, elementsData]
  );

  useEffect(() => {
    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [navigate]);

  return (
    <UiHelpersContext.Provider value={{ updateUiHelperControls }}>
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
