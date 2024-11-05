import { DataPayload, RecentData } from "./types";
import { DATASTREAM } from "../shared-types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface DataProviderProps {
    children: React.ReactNode;
};

interface DataContextType {
    data: RecentData;
    timeSeriesData: Record<string, {values: number[], timestamps: number[]}>;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<RecentData>({});
    const timeSeriesDataRef = useRef<Record<string, {values: number[], timestamps: number[]}>>({});

    useEffect(() => {
        const socket = io("http://localhost:5000"); // TODO: Make the port a constant/env var

        socket.on('id', (newData: DataPayload) => {

            const {key, value, timestamp} = newData;

            if (!timeSeriesDataRef.current[key]) timeSeriesDataRef.current[key] = {values: [], timestamps: []};

            timeSeriesDataRef.current[key].values.push(value);
            timeSeriesDataRef.current[key].timestamps.push(value);

            setData((prevData) => ({
                ...prevData,
                [key]: { value: value, timestamp: timestamp },
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <DataContext.Provider value={{ data, timeSeriesData: timeSeriesDataRef.current }}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("tried to get data without proper context (make sure you are using DataProvider)");
    }
    return context;
};

export default DataProvider;