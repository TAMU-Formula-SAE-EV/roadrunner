import React from "react";
import { FormProps, RESIZE_HANDLES, WidgetConfig, WidgetComponentProps, WidgetType } from "../../types";
import { DATASTREAM, datastreams } from "../../../shared-types";
import { useData } from "../../../data-provider/DataProvider";

export interface GridDisplayConfig extends WidgetConfig {
    rows: DATASTREAM[][];
}

const GridDisplayComponent: React.FC<WidgetComponentProps<GridDisplayConfig>> = ({ id, config }) => {
    
    const { rows } = config;
    const { data } = useData();
    
    return (
        <>
            {rows.map((column: DATASTREAM[], columnIndex: number) => (
                <div key={columnIndex}>
                    {column.map((datakey: DATASTREAM, dataIndex: number) => {
                        return (
                            <p key={`${columnIndex}-${dataIndex}`}>
                                {datakey} : {data[datakey]?.value || '-'}
                            </p>
                        );
                    })}
                </div>
            ))}
        </>
    );
};



const GridDisplayForm: React.FC<FormProps<GridDisplayConfig>> = ({config, setConfigState}) => {
    return <>Empty form!</>
};

//the widget's default configuration
const defaultConfig = {
    //title which is seen in the menu before adding to grid
    title: "Grid Display", 
    //default dimensions when adding to grid
    w: 2, 
    h: 2, 
    //the resize handles which appear when selected
    availableHandles: RESIZE_HANDLES,
    rows: [[datastreams[0]]]
};

const GridDisplay: WidgetType<GridDisplayConfig> = {
    Component: GridDisplayComponent, 
    Form: GridDisplayForm,
    defaultConfig,
    typeId: 2
};

export default GridDisplay;