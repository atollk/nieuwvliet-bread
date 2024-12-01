export interface Account {
    id: number;
    name: string;
    picture: string;
}

export interface OrderItem {
    id: number;
    image: string;
    name: string;
    description: string;
    orderAmount?: number;
}
