import BasicDisplay, { BasicDisplayConfig } from "../../widgets/widget_types/basic-display/BasicDisplay";
import EmptyWidget from "../../widgets/widget_types/empty-widget/EmptyWidget";
import { RESIZE_HANDLES, WidgetConfig, WidgetType } from "../../widgets/types";
import GridDisplay from "../../widgets/widget_types/grid-display/GridDisplay";

export enum MENU_STATE { DEFAULT, GRAPHS, DIALS }

export interface MenuEntry<Config extends WidgetConfig> {
    redirect?: {icon: String, label: String, onClickState: MENU_STATE},
    widget?: {config: Config, typeId: number};
};
export interface MenuContents<Config extends WidgetConfig> {contents: MenuEntry<Config>[]};

export const DEFAULT_MENU_CONTENTS: MenuContents<any> = {
    contents: [
        {redirect: {icon: "", label: "graphs", onClickState: MENU_STATE.GRAPHS}},
        {redirect: {icon: "", label: "dials", onClickState: MENU_STATE.DIALS}}, ]
};

export const GRAPHS_CONTENTS: MenuContents<any> = {
    contents: [
        {widget: {config: BasicDisplay.defaultConfig, typeId: BasicDisplay.typeId}},
        {widget: {config: EmptyWidget.defaultConfig, typeId: EmptyWidget.typeId}}, 
        {widget: {config: GridDisplay.defaultConfig, typeId: GridDisplay.typeId}}
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