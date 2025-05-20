export function mock<D>(data: D, delay = 1000) {
  return () => {
    return new Promise<D>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, delay);
    });
  };
}
