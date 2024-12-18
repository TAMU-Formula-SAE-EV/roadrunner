import { ChangeEvent, useState } from "react";
import { useData } from "../../../data-provider/DataProvider";
import { WidgetComponentProps, WidgetConfig, FormProps, WidgetType, RESIZE_HANDLES } from "../../types";
import { DATASTREAM, datastreams } from "../../../shared-types";
import DatasteamSelect from "../../form_components/DatastreamSelect";


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
    return (
        <div>
            <DatasteamSelect datastream={config.dataKey} setDataStream={(key: DATASTREAM) => {setConfigState({ ...config, dataKey: key })}} />
        </div>
    );
};

//define the default configuration
const defaultConfig = {
    title: "Basic Display",
    w: 1, 
    h: 1,
    availableHandles: RESIZE_HANDLES,
    dataKey: "speed"
} as BasicDisplayConfig;

const BasicDisplay: WidgetType<BasicDisplayConfig> = {
    Component: BasicDisplayComponent,
    Form: BasicDisplayForm,
    defaultConfig,
    typeId: 0,
}

export default BasicDisplay;