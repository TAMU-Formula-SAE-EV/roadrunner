import { DataPayload, RecentData } from "./types";
import { DATASTREAM } from "../shared-types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { processData } from 'downsample-lttb';


const COMPRESSION_FACTOR = .75;
//30 seconds
const COMPRESSION_INTERVAL = 30000;

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
    //used to store incoming data while data compression is taking place
    const dataBufferRef = useRef<Record<string, { values: number[], timestamps: number[] }>>({});
    //flag to mark if data compression is taking place
    const isCompressingRef = useRef<boolean>(false);


    useEffect(() => {
        const socket = io("http://localhost:5000"); // TODO: Make the port a constant/env var

        socket.on('id', (newData: DataPayload) => {

            const {key, value, timestamp} = newData;

            if (isCompressingRef.current) {
                if (!dataBufferRef.current[key]) dataBufferRef.current[key] = { values: [], timestamps: [] };
                dataBufferRef.current[key].values.push(value);
                dataBufferRef.current[key].timestamps.push(timestamp);
            } else {
                if (!timeSeriesDataRef.current[key]) timeSeriesDataRef.current[key] = {values: [], timestamps: []};
                timeSeriesDataRef.current[key].values.push(value);
                timeSeriesDataRef.current[key].timestamps.push(timestamp);
                
            }

            setData((prevData) => ({
                ...prevData,
                [key]: { value: value, timestamp: timestamp },
            }));
        });

        //every COmPRESSION_INTERVAL, compress the data by compression factor   
        const compressionInterval = setInterval(() => {
            isCompressingRef.current = true;
            for (const key in timeSeriesDataRef.current) {
                const { values, timestamps } = timeSeriesDataRef.current[key];
                if (timestamps.length > 10) {
                    const combinedData = timestamps.map((t, i) => [t, values[i]]);
                    const downsampledData = processData(combinedData, timestamps.length * COMPRESSION_FACTOR);

                    // separate the downsampled data back into values and timestamps
                    timeSeriesDataRef.current[key].values = downsampledData.map((point: [number, number]) => point[1]);
                    timeSeriesDataRef.current[key].timestamps = downsampledData.map((point: [number, number]) => point[0]);
                    console.log("after compression size: ", timeSeriesDataRef.current[key].timestamps.length);
                }
            }

            // append buffered data to the time series data
            for (const key in dataBufferRef.current) {
                if (!timeSeriesDataRef.current[key]) timeSeriesDataRef.current[key] = { values: [], timestamps: [] };
                timeSeriesDataRef.current[key].values.push(...dataBufferRef.current[key].values);
                timeSeriesDataRef.current[key].timestamps.push(...dataBufferRef.current[key].timestamps);
            }

            //reset the buffer
            dataBufferRef.current = {};
            isCompressingRef.current = false;
        }, COMPRESSION_INTERVAL);


        

        return () => {
            socket.disconnect();
            clearInterval(compressionInterval);
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