export interface Account {
    readonly id: number;
    readonly name: string;
    readonly picture: string;
}

export interface OrderItem {
    readonly id: number;
    readonly image: string;
    readonly name: string;
    readonly description: string;
    readonly orderAmount?: number;
}