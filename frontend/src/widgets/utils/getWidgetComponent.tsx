import BasicDisplay, { BasicDisplayConfig } from "../basic-display/BasicDisplay";
import EmptyWidget, { EmptyWidgetConfig } from "../empty-widget/EmptyWidget";
import { WIDGET_TYPE, WidgetConfig } from "../types";


export const getWidgetComponent: (config: WidgetConfig, i: string, selected: boolean, setGraphEnabled: (enabled: boolean) => void) => JSX.Element = (config: WidgetConfig, i: string,selected: boolean, setGraphEnabled: (enabled: boolean) => void) => {
    const widgetType = config.type;
    
    if (widgetType === WIDGET_TYPE.BASIC_DISPLAY) {
        return <BasicDisplay selected={selected} i={i} setGridEnabled={setGraphEnabled} config={config as BasicDisplayConfig} />
    }
    else if (widgetType === WIDGET_TYPE.EMPTY) {
        return <EmptyWidget selected={selected} i={i} setGridEnabled={setGraphEnabled} config={config as EmptyWidgetConfig} />
    }
    else {
        return <BasicDisplay selected={selected} i={i} setGridEnabled={setGraphEnabled} config={config as BasicDisplayConfig} />
    }
};