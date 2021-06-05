export const printf = (format: string, ...args: any[]): string => {
  var i = 0;
  return format.replace(/%s/g, function () {
    const arg = args[i++];
    const type = typeof arg;
    if (type === "function") {
      return arg();
    } else if (type === "string") {
      return arg;
    } else {
      return String(arg);
    }
  });
};
