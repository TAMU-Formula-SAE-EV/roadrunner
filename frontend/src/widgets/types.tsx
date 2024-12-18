import { Layout } from "react-grid-layout";

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

export interface Widget<Config extends WidgetConfig> extends GridItem {
    id: number;
    config: Config;
    //the widget type
    typeId: number;
}

export interface WidgetConfig {
    //title which shows up in menu
    title: string;
    //appear when resizing widget
    availableHandles: ResizeHandle[];
    //starting dimensions
    h: number;
    w: number;
    //max dimensions
    maxH?: number;
    maxW?: number;
}

export interface FormProps<T extends WidgetConfig> {
    //the current config
    config: T;
    //
    setConfigState: (t: T) => void;
};

export interface WidgetType<ConfigType extends WidgetConfig> {
    Component: React.FC<WidgetComponentProps<ConfigType>>;
    Form: React.FC<FormProps<ConfigType>>;
    defaultConfig: ConfigType;
    typeId: number;
}

export interface WidgetComponentProps<Config extends WidgetConfig> {
    //uniquely identifies the widget (should correspond to Widget.i)
    id: number;
    //the widget's config
    config: Config;
};

