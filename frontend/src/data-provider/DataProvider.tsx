import { DataPayload, DATASOURCE, RecentData } from "./types";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

interface DataProviderProps {
    children: React.ReactNode;
};

interface DataContextType {
    data: RecentData;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<RecentData>({});

    useEffect(() => {
        const socket = io("http://localhost:5000"); // TODO: Make the port a constant/env var

        socket.on('id', (newData: DataPayload) => {

            setData((prevData) => ({
                ...prevData,
                [newData.key]: { value: newData.value, timestamp: newData.timestamp },
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("tried to get data without proper context (make sure you are using DataProvider)");
    }
    return context;
};

export default DataProvider;