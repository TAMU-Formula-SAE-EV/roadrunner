import { Layout } from "react-grid-layout";

//add new enum with each widget type
export enum WIDGET_TYPE {EMPTY, BASIC_DISPLAY, RECENT_VALUES};

export type ResizeHandle = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
export const RESIZE_HANDLES: ResizeHandle[] = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

export type GridItem = {
    //coordinates
    x: number;
    y: number;
    //dimensions
    w: number;
    h: number;
}

export interface Widget extends GridItem {
    id: number;
    config: WidgetConfig;
}

export interface WidgetConfig {
    //title which shows up in menu
    title: string;
    //defines widget contents
    type: WIDGET_TYPE;
    //appear when resizing widget
    availableHandles: ResizeHandle[];
    //starting dimensions
    h: number;
    w: number;
    //max dimensions
    maxH?: number;
    maxW?: number;
}

export interface WidgetProps {
    //uniquely identifies the widget (should correspond to Widget.i)
    i: number;
    //the widget's config
    config: WidgetConfig;
};

export interface FormProps<T extends WidgetConfig> {

    //the current config
    config: T;
    //
    setConfigState: (t: T) => void;
};

export interface WidgetType<WidgetProps, ConfigType extends WidgetConfig> {
    Component: React.FC<WidgetProps>;
    Form: React.FC<FormProps<ConfigType>>;
    defaultConfig: ConfigType;
}