const cache = new Map();
const pendingPromises = new Map();

export const useSuspense = (asyncFunction, args) => {
  const key = JSON.stringify({ asyncFunction, args });

  if (cache.has(key)) return cache.get(key);

  if (!pendingPromises.has(key)) {
    const promise = asyncFunction(...args)
      .then((result) => {
        cache.set(key, result);
        pendingPromises.delete(key);
      })
      .catch((err) => {
        cache.set(key, err);
        pendingPromises.delete(key);
        throw err;
      });

    pendingPromises.set(key, promise);
  }

  throw pendingPromises.get(key);
};

export const invalidateCache = (asyncFunction, args = []) => {
  const key = JSON.stringify({ asyncFunction, args });
  cache.delete(key);
  pendingPromises.delete(key);
};
