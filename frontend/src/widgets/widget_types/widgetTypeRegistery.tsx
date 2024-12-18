import { WidgetType } from "../types";
import BasicDisplay from "./basic-display/BasicDisplay";
import EmptyWidget from "./empty-widget/EmptyWidget";
import GridDisplay from "./grid-display/GridDisplay";

interface WidgetTypeRegistry {
    [key: number]: WidgetType<any>;
};

export const widgetTypeRegistry: WidgetTypeRegistry = {
    [BasicDisplay.typeId]: BasicDisplay, //0
    [EmptyWidget.typeId]: EmptyWidget, //1
    [GridDisplay.typeId]: GridDisplay //2
};