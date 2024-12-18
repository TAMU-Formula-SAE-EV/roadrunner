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

export enum GRID_OPERATION { RESIZE, MOVE };

export type GridOperationState = {
  //a temporary layout that complies with our new widget size/location
  layout: Widget[];
  //the widget we are either dragging or resizing
  widget: Widget;
  //the visual projection of the widget onto the grid
  //(could be null if say, the grid is full and we are trying
  //to add a new widget)
  preview: GridItem | null;
  //which operation are we doing?
  operation: GRID_OPERATION;
  //what resize handle are we using? (assuming it is a resize operation)
  handle: ResizeHandle | undefined;
}

export type GridOperationPayload<Config extends WidgetConfig> = {
  id?: number;
  config: Config;
  handle?: ResizeHandle;
  operation: GRID_OPERATION
}


export type GridPosition = {x: number, y: number};