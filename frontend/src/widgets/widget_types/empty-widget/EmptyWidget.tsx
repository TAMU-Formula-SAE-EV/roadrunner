import React from "react";
import { FormProps, RESIZE_HANDLES, WIDGET_TYPE, WidgetConfig, WidgetComponentProps, WidgetType } from "../../types";

//defines all the additional configuration settings for the widget
export interface EmptyWidgetConfig extends WidgetConfig {
    //in this case we have nothing to add!

    //example fields you might want to include:
    //  - what data source is the component listening to?
    //  - what text labels does it display to the users?
    //  - colors
    //  - anything else needed to uniquely define the component's behavior and appearance
    // (remember, the config is saved as a part of a json template. If the user loads a template, 
    // the json needs to be able to hold all the information necassary to recreate the widget's appearance
    // and behavior!!!!)
}

//defines the widget component itself
//styling, resizing, editing all handled elsewhere (see Widget.tsx)
const EmptyWidgetComponent: React.FC<WidgetComponentProps<EmptyWidgetConfig>> = ({ id, config, }) => {
    return <>Empty Widget!</>;
}; 

//form to update the widget's configuration
//the form doesn't directly update the config, instead it uses the setConfigState
//to update a temporary state. This temporary state is either discarded or pushed
//depending on how the user exits the form (see Widget.tsx)
const EmptyWidgetForm: React.FC<FormProps<EmptyWidgetConfig>> = ({config, setConfigState}) => {
    return <>Empty form!</>
};

//the widget's default configuration
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
};

const EmptyWidget: WidgetType<EmptyWidgetConfig> = {
    Component: EmptyWidgetComponent, 
    Form: EmptyWidgetForm,
    defaultConfig,
    typeId: 1
};

export default EmptyWidget;