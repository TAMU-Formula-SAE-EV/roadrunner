import { DropTargetMonitor } from "react-dnd";
import { GridItem, Widget, WidgetConfig } from "../widgets/types";

export const GRID_COLUMNS = 16;
export const GRID_ROWS = 8;

export type Monitor = DropTargetMonitor<{
    id: number;
    w: number;
    h: number;
    type?: string;
    config: WidgetConfig;
}, unknown>

export type GridState = {
  layout: Widget[];
  draggedWidget: Widget | null;
  resizedWidget: Widget | null;
  preview: GridItem;
}
