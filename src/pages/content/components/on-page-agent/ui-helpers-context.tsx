import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import _ from "lodash";
import { getMostOverlappedElement } from "@src/utils/webpage-utils";

interface UiHelpersContextType {
  updateUiHelperControls: (data: any) => void;
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

  const updateUiHelperControls = (data: any) => {
    setElements(sortIntoMatrix(removeRedundatRects(data)));
  };

  const offset = 8 as const;

  const navigate = useCallback(
    (event) => {
      let [row, col] = selectedElementIndex;

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
        default:
          return; // If other keys are pressed, don't do anything
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
                onClick={() =>
                  console.log(
                    getMostOverlappedElement(
                      left,
                      top,
                      width,
                      height,
                      element.tag
                    )
                  )
                }
                key={`${x}-${y}`}
                style={{
                  border:
                    selectedElementIndex[0] === y &&
                    selectedElementIndex[1] === x
                      ? "2px solid blue"
                      : "2px solid transparentw",
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

function calculateOverlap(a, b) {
  const x_overlap = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  );
  const y_overlap = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  );
  const overlapArea = x_overlap * y_overlap;
  return overlapArea / (a.width * a.height);
}

function mergeRectangles(a, b) {
  return {
    class: a.class + "|" + b.class,

    confidence: Math.max(a.confidence, b.confidence), // Taking the max confidence for simplicity
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x),
    height: Math.max(a.y + a.height, b.y + b.height) - Math.min(a.y, b.y),
    id: a.id,
  };
}

const removeRedundatRects = (data) => {
  const reducedData = [...data];
  for (let i = 0; i < reducedData.length; i++) {
    reducedData[i].index = _.uniqueId;
    for (let j = i + 1; j < reducedData.length; j++) {
      if (calculateOverlap(reducedData[i], reducedData[j]) > 0.8) {
        const merged = mergeRectangles(reducedData[i], reducedData[j]);
        reducedData[i] = merged; // Replace i-th obj with merged obj
        reducedData.splice(j, 1); // Remove j-th obj
        j--;
      }
    }
  }

  return reducedData;
};

function sortIntoMatrix(points, deltaY = 40) {
  // Sort primarily by y, then by x
  points.sort((a, b) => a.y - b.y || a.x - b.x);

  const rows = [];
  let currentRow = [points[0]];

  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i].y - points[i - 1].y) <= deltaY) {
      currentRow.push(points[i]);
    } else {
      // Sort the current row by x-values before pushing to the rows array
      currentRow.sort((a, b) => a.x - b.x);
      rows.push(currentRow);
      currentRow = [points[i]];
    }
  }

  // Don't forget the last row
  if (currentRow.length) {
    currentRow.sort((a, b) => a.x - b.x);
    rows.push(currentRow);
  }

  return rows;
}
