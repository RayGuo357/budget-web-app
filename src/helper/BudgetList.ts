export type Items = { id: number, money: number, note: string };

export interface IBudgetList {
    getName(): string;
    getIsExpenses(): boolean;
    getItem(id: number): Items | null;
    getItems(): Items[];
    getNumItems(): number;
    getTotal(): number;

    setName(name: string): void;
    setTotal(money: number): void;

    addItem(item: Items): boolean;
    removeItem(id: number): boolean;
}

export class BudgetList implements IBudgetList {
    private name: string;
    private isExpenses: boolean;
    private items: Items[];
    private total: number;

    constructor(name: string, isExpenses: boolean, items: Items[] = [], total: number = 0) {
        this.name = name;
        this.isExpenses = isExpenses;
        this.items = items;
        this.total = total;
    }

    getName(): string {
        return this.name;
    };

    getIsExpenses(): boolean {
        return this.isExpenses;
    };

    getItem(id: number): Items | null {
        this.items.forEach((e) => {
            console.log(e.id, id, e.id === id, e)
            if (e.id === id) {
                return e
            };
        });
        return null;
    }

    getItems(): Items[] {
        return this.items;
    };

    getNumItems(): number {
        return this.items.length;
    }

    getTotal(): number {
        return this.total;
    }

    setName(name: string): void {
        this.name = name;
    };

    setTotal(money: number): void {
        this.total += money;
    }

    addItem(item: Items): boolean {
        let current: number = this.items.length;
        this.items.push(item);
        this.setTotal(item.money)
        return this.items.length > current;
    };

    removeItem(id: number): boolean {
        let current: number = this.items.length;
        let newItems: Items[] = [];
        this.items.forEach((e) => {
            if (e.id !== id) {
                newItems.push(e)
            } else {
                this.setTotal(-e.money)
            }
        });
        this.items = newItems;
        return this.items.length < current;
    };
}