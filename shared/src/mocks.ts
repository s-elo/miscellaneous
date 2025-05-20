export function mockRequest<T, P = unknown>(
  data: T,
  delay = 1000,
  response: (param?: P) => T = () => data,
) {
  return (param?: P) => {
    return new Promise<T>((resolve) => {
      setTimeout(() => {
        resolve(response(param));
      }, delay);
    });
  };
}
