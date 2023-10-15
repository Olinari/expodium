import React, { createContext, useContext, useState, ReactNode } from "react";

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

  const updateUiHelperControls = (data: any) => {
    // Update state with new image data (predictions)
    setElements(data);
  };

  const offset = 8 as const;

  return (
    <UiHelpersContext.Provider value={{ updateUiHelperControls }}>
      <>
        {elementsData.map((pred, index) => {
          const width = offset + pred.width;
          const height = offset + pred.height;
          const top = pred.y - 0.5 * pred.height - offset / 2;
          const left = pred.x - 0.5 * pred.width - offset / 2;
          return (
            <div
              key={index}
              style={{
                border: "2px solid red",
                position: "absolute",
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: 10000,
              }}
              data-element={pred.class}
            />
          );
        })}
      </>
      {children}
    </UiHelpersContext.Provider>
  );
};
