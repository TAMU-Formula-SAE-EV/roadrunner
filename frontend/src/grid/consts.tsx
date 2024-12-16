import { DropTargetMonitor } from "react-dnd";
import { GridItem, ResizeHandle, Widget, WidgetConfig } from "../widgets/types";

export const GRID_COLUMNS = 16;
export const GRID_ROWS = 8;

export type Monitor = DropTargetMonitor<{
    id: number;
    w: number;
    h: number;
    type?: string;
    config: WidgetConfig;
}, unknown>

export enum WIDGET_OPERATION { RESIZE, MOVE };

export type GridOperation = {
  //a temporary layout that complies with our new widget size/location
  layout: Widget[];
  //the widget we are either dragging or resizing
  widget: Widget;
  //the visual projection of the widget onto the grid
  preview: GridItem;
  //which operation are we doing?
  operation: WIDGET_OPERATION;
  //what resize handle are we using? (assuming it is a resize operation)
  handle: ResizeHandle | undefined;
}
