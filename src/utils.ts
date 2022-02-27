export const capitalize = <T extends string>(string: T): Capitalize<T> => {
  return (string[0].toUpperCase() + string.slice(1)) as any;
};
