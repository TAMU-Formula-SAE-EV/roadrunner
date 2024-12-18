import { WidgetType } from "../types";
import BasicDisplay from "./basic-display/BasicDisplay";
import EmptyWidget from "./empty-widget/EmptyWidget";

interface WidgetTypeRegistry {
    [key: number]: WidgetType<any>;
};

export const widgetTypeRegistry: WidgetTypeRegistry = {
    [BasicDisplay.typeId]: BasicDisplay,
    [EmptyWidget.typeId]: EmptyWidget
};