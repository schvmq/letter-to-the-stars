export type Star = {
    id: string;
    message: string;
    createdAt: string;
    x: number;
    y: number;
    size: number;
    brightness: number;
    shape: 'circle' | 'diamond' | 'star';
};