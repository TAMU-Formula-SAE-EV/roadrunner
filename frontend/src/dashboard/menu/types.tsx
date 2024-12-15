import BasicDisplay, { BasicDisplayConfig } from "../../widgets/basic-display/BasicDisplay";
import EmptyWidget from "../../widgets/empty-widget/EmptyWidget";
import { RESIZE_HANDLES, WidgetConfig } from "../../widgets/types";
import { WIDGET_TYPE } from "../../widgets/types";

export enum MENU_STATE { DEFAULT, GRAPHS, DIALS }

export interface MenuEntry<Config extends WidgetConfig> {
    redirect?: {icon: String, label: String, onClickState: MENU_STATE},
    widget?: Config;
};
export interface MenuContents<Config extends WidgetConfig> {contents: MenuEntry<Config>[]};

export const DEFAULT_MENU_CONTENTS: MenuContents<any> = {
    contents: [
        {redirect: {icon: "", label: "graphs", onClickState: MENU_STATE.GRAPHS}},
        {redirect: {icon: "", label: "dials", onClickState: MENU_STATE.DIALS}}, ]
};

export const GRAPHS_CONTENTS: MenuContents<any> = {
    contents: [
        {widget: BasicDisplay.defaultConfig},
        {widget: EmptyWidget.defaultConfig}, 
    ]
};

export const DIALS_CONTENTS: MenuContents<any> = {
    contents: [
    ]
};

export const MENU_STATE_MAP: Record<MENU_STATE, MenuContents<any>> = {
    [MENU_STATE.DEFAULT]: DEFAULT_MENU_CONTENTS, 
    [MENU_STATE.DIALS]: DIALS_CONTENTS,
    [MENU_STATE.GRAPHS]: GRAPHS_CONTENTS
};