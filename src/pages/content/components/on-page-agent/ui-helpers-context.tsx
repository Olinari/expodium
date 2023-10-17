import React, { createContext, useContext, useState, ReactNode } from "react";
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
  const [selectedElementIndex, setSelctedElementIndex] = useState(0);

  const updateUiHelperControls = (data: any) => {
    setElements(
      reduce(
        data
          .sort((a, b) => {
            return a.y - b.y; // sort by x first (left to right)
          })
          .sort((a, b) => a.x - b.x)
      )
    );
  };

  const offset = 8 as const;

  return (
    <UiHelpersContext.Provider value={{ updateUiHelperControls }}>
      <>
        {elementsData.map((element, index) => {
          console.log(selectedElementIndex, index);
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
              key={index}
              style={{
                border:
                  selectedElementIndex === index
                    ? "2px solid blue"
                    : "2px solid red",
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

const reduce = (data) => {
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
