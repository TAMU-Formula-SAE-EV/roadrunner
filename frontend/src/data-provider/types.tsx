

export interface DataPayload {
    timestamp: number,
    key: string;
    value: number;
}

export type RecentData = {
    [key: string]: {value: number, timestamp: number};
}