import { ChangeEvent, useEffect, useRef } from "react";
import { useData } from "../../data-provider/DataProvider";
import { WidgetProps, WidgetConfig, FormProps, RESIZE_HANDLES, WidgetType } from "../types";
import WidgetWrapper from "../utils/WidgetWrapper";
import { WIDGET_TYPE } from "../types";
import { DATASTREAM, datastreams } from "../../shared-types";

// Define all the configurable options unique to this widget type
export interface RecentValuesConfig extends WidgetConfig {
    dataKey: DATASTREAM;
}

// Specify the particular configuration type 
interface RecentValuesProps extends WidgetProps {
    config: RecentValuesConfig;
}

// Component which defines the widget (and its behavior)
const RecentValues: WidgetType<RecentValuesProps, FormProps<RecentValuesConfig>, RecentValuesConfig> = ({ selected, i, config, setGridEnabled }) => {
    const { timeSeriesData } = useData(); // Access the timeSeriesData from the context

    const entries = timeSeriesData[config.dataKey] ? timeSeriesData[config.dataKey].values.slice(-5) : [];

    return (
        <WidgetWrapper selected={selected} config={config} Form={RecentValues.Form} i={i} setGridEnabled={setGridEnabled}>
            <h3>{config.dataKey} Recent Values: </h3>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>
                        {entry}
                    </li>
                ))}
            </ul>
        </WidgetWrapper>
    );
};

// Defines form which edits the configurable settings
const RecentValuesForm: React.FC<FormProps<RecentValuesConfig>> = ({ setConfigState, config }) => {
    // Handle changes to the selected datastream type
    const handleDataKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newDataKey = event.target.value as DATASTREAM;
        setConfigState({ ...config, dataKey: newDataKey } as RecentValuesConfig);
    };

    return (
        <div>
            <label htmlFor="dataKeySelect">Select Data Stream:</label>
            <select
                id="dataKeySelect"
                value={config.dataKey}
                onChange={handleDataKeyChange}
            >
                {datastreams.map((datastream) => (
                    <option key={datastream} value={datastream}>
                        {datastream}
                    </option>
                ))}
            </select>
        </div>
    );
};
RecentValues.Form = RecentValuesForm;

// Define the default configuration
RecentValues.defaultConfig = {
    title: "recent values",
    w: 1,
    h: 1,
    availableHandles: RESIZE_HANDLES,
    type: WIDGET_TYPE.RECENT_VALUES,
    dataKey: "speed"
} as RecentValuesConfig;

export default RecentValues;
