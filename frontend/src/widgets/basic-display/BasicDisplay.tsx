import { ChangeEvent, useState } from "react";
import { useData } from "../../data-provider/DataProvider";
import { WidgetComponentProps, WidgetConfig, FormProps, WidgetType, RESIZE_HANDLES } from "../types";
import { WIDGET_TYPE } from "../types";
import { DATASTREAM, datastreams } from "../../shared-types";


// define all the configurable options unique to this widget type
export interface BasicDisplayConfig extends WidgetConfig {
    dataKey: DATASTREAM;
}

//component which defines the widget (and its behavior)
const BasicDisplayComponent: React.FC<WidgetComponentProps<BasicDisplayConfig>> = ({ id, config }) => {
    const { data } = useData();
    const value = data[config.dataKey] ? data[config.dataKey].value : null;

    return <>{config.dataKey}: {value}</>;
};


//defines form which edits the configurable settings
const BasicDisplayForm: React.FC<FormProps<BasicDisplayConfig>> = ({setConfigState, config}) => {


    // Handle changes to the selected datastream type
    const handleDataKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newDataKey = event.target.value as DATASTREAM;

        setConfigState({ ...config, dataKey: newDataKey } as BasicDisplayConfig);
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

//define the default configuration
const defaultConfig = {
    title: "Basic Display",
    w: 1, 
    h: 1,
    availableHandles: RESIZE_HANDLES,
    type: WIDGET_TYPE.BASIC_DISPLAY,
    dataKey: "speed"
} as BasicDisplayConfig;

const BasicDisplay: WidgetType<BasicDisplayConfig> = {
    Component: BasicDisplayComponent,
    Form: BasicDisplayForm,
    defaultConfig
}

export default BasicDisplay;