import * as tf from "@tensorflow/tfjs";
import { LinearRegression, setBackend } from "scikitjs";

export function dotProduct(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error(
      "Arrays must have the same length to calculate the dot product."
    );
  }

  let result = 0;
  for (let i = 0; i < arr1.length; i++) {
    result += arr1[i] * arr2[i];
  }

  return result;
}

export const dummmyRegression = async () => {
  console.log("#4");
  setBackend(tf);

  // Perform a linear regression
  const X = [
    [2, 3],
    [1, 4],
    [5, 7],
  ];
  const y = [10, 14, 20];

  const lr = new LinearRegression();
  await lr.fit(X, y);

  console.log(lr.coef);
};
