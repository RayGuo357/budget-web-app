export type Items = { id: number, money: number, note: string };

export interface IBudgetList {
    getName(): string;
    getIsExpenses(): boolean;
    getItems(): Items[];
    getNumItems(): number;

    setName(name: string): void;

    addItem(item: Items): boolean;
    removeItem(item: Items): boolean;
}

export class BudgetList implements IBudgetList {
    private name: string;
    private isExpenses: boolean;
    private items: Items[];

    constructor(name: string, isExpenses: boolean, items: Items[] = []) {
        this.name = name;
        this.isExpenses = isExpenses;
        this.items = items;
    }

    getName(): string {
        return this.name;
    };

    getIsExpenses(): boolean {
        return this.isExpenses;
    };

    getItems(): Items[] {
        return this.items;
    };

    getNumItems(): number {
        return this.items.length;
    }

    setName(name: string): void {
        this.name = name;
    };

    addItem(item: Items): boolean {
        let current: number = this.items.length;
        this.items.push(item);
        return this.items.length > current;
    };

    removeItem(item: Items): boolean {
        let current: number = this.items.length;
        let newItems: Items[] = [];
        this.items.forEach((e) => {
            if (e.id !== item.id) newItems.push(e)
        });
        this.items = newItems;
        return this.items.length < current;
    };
}