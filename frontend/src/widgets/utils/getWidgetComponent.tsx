import BasicDisplay, { BasicDisplayConfig } from "../basic-display/BasicDisplay";
import EmptyWidget, { EmptyWidgetConfig } from "../empty-widget/EmptyWidget";
import { WIDGET_TYPE, WidgetConfig } from "../types";


export const getWidgetComponent: (config: WidgetConfig, i: number) => JSX.Element = (config: WidgetConfig, i: number) => {
    const widgetType = config.type;
    
    if (widgetType === WIDGET_TYPE.BASIC_DISPLAY) {
        return <BasicDisplay i={i} config={config as BasicDisplayConfig} />
    }
    else if (widgetType === WIDGET_TYPE.EMPTY) {
        return <EmptyWidget i={i} config={config as EmptyWidgetConfig} />
    }
    else {
        return <BasicDisplay i={i} config={config as BasicDisplayConfig} />
    }
};