export type DataType = {labels: string[], datasets: {label: string, data: number[], backgroundColor: string[], borderColor: string[], borderWidth: number}[]}

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

export const generatePayload = (labels: string[] = [], data: number[] = []): DataType => {
    return {
        labels: labels,
        datasets: [
            {
                label: '$ of Income',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }
}

export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const sumArray = (arr: number[]) => {
    return arr.reduce((a, b) => a + b, 0)
}

export const API = 'http://192.168.0.5:6464'