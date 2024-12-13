import BasicDisplay, { BasicDisplayConfig } from "../basic-display/BasicDisplay";
import EmptyWidget, { EmptyWidgetConfig } from "../empty-widget/EmptyWidget";
import { WIDGET_TYPE, WidgetConfig, WidgetProps, WidgetType } from "../types";


export const getWidgetType: (config: WidgetConfig) => WidgetType<any, any> = (config: WidgetConfig) => {
    const widgetType = config.type;
    
    if (widgetType === WIDGET_TYPE.BASIC_DISPLAY) {
        return BasicDisplay;
    }
    else if (widgetType === WIDGET_TYPE.EMPTY) {
        return EmptyWidget;
    }
    else {
        return BasicDisplay;
    }
};