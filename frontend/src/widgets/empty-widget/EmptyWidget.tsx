import React from "react";
import { FormProps, RESIZE_HANDLES, WIDGET_TYPE, WidgetConfig, WidgetProps, WidgetType } from "../types";


export interface EmptyWidgetConfig extends WidgetConfig {}

interface EmptyWidgetProps extends WidgetProps {
    config: EmptyWidgetConfig;
}

const EmptyWidgetComponent: React.FC<EmptyWidgetProps> = ({ i, config, }) => {
    return <>Empty Widget!</>;
}; 

const EmptyWidgetForm: React.FC<FormProps<EmptyWidgetConfig>> = ({}) => {
    return <>Empty form!</>
}

const defaultConfig = {
    title: "empty widget!", 
    w: 2, 
    h: 2, 
    availableHandles: RESIZE_HANDLES, 
    type: WIDGET_TYPE.EMPTY
}

const EmptyWidget: WidgetType<EmptyWidgetProps, EmptyWidgetConfig> = {
    Component: EmptyWidgetComponent, 
    Form: EmptyWidgetForm,
    defaultConfig
}

export default EmptyWidget;