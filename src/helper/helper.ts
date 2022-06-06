export const getTodaysDate = (): string => {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
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

export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const API = 'http://192.168.0.114:6464'