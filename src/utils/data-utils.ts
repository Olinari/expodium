import { element } from "prop-types";

export const JSONstringifyWithFunctions = (obj) =>
  JSON.stringify(obj, (key, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });

export const parseJsonFromResponse = (element) => {
  let elementDetails;
  elementDetails = element.split("```")[1];
  elementDetails = elementDetails.replaceAll("\r\n", "");
  elementDetails = elementDetails.replaceAll("json", "");
  return JSON.parse(elementDetails);
};
