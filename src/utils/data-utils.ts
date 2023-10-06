const JSONstringifyWithFunctions = (obj) =>
  JSON.stringify(obj, (key, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });
