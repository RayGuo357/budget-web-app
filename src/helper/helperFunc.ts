export const getTodaysDate = (): string => {
    return `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`
}

export const getCircularReplacer = (): any => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };