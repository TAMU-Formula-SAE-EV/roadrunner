import { Layout } from "react-grid-layout";

//add new enum with each widget type
export enum WIDGET_TYPE {EMPTY, BASIC_DISPLAY};

export type ResizeHandle = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
export const RESIZE_HANDLES: ResizeHandle[] = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

export interface Widget extends Layout {
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
    i: string;
    //whether or not the widget is selected
    selected: boolean;
    //the widget's config
    config: WidgetConfig;
    //enable/disable the grid when we enter/exit the form
    setGridEnabled: (enabled: boolean) => void;
};

export interface FormProps<T extends WidgetConfig> {

    //the current config
    config: T;
    //
    setConfigState: (t: T) => void;
};

export interface WidgetType<WidgetProps, FormProps, ConfigType> extends React.FC<WidgetProps> {
    Form: React.FC<FormProps>;
    defaultConfig: ConfigType;
}