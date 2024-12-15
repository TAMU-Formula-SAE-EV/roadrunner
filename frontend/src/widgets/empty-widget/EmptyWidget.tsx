import React from "react";
import { FormProps, RESIZE_HANDLES, WIDGET_TYPE, WidgetConfig, WidgetComponentProps, WidgetType } from "../types";

//defines all the additional configuration settings for the widget
export interface EmptyWidgetConfig extends WidgetConfig {}

//defines the widget component itself
//styling, resizing, editing all handled elsewhere
const EmptyWidgetComponent: React.FC<WidgetComponentProps<EmptyWidgetConfig>> = ({ id, config, }) => {
    return <>Empty Widget!</>;
}; 

//form to update the widget's configuration
//the form doesn't directly update the config, instead it uses the setConfigState
//to update a temporary state. This temporary state is either discarded or pushed
//depending on how the user exits the form (see Widget.tsx)
const EmptyWidgetForm: React.FC<FormProps<EmptyWidgetConfig>> = ({config, setConfigState}) => {
    return <>Empty form!</>
}

const defaultConfig = {
    //title which is seen in the menu before adding to grid
    title: "empty widget!", 
    //default dimensions when adding to grid
    w: 2, 
    h: 2, 
    //the resize handles which appear when selected
    availableHandles: RESIZE_HANDLES,
    //identifying type 
    type: WIDGET_TYPE.EMPTY
}

const EmptyWidget: WidgetType<EmptyWidgetConfig> = {
    Component: EmptyWidgetComponent, 
    Form: EmptyWidgetForm,
    defaultConfig
}

export default EmptyWidget;