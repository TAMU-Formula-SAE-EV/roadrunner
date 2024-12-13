import { GridItem, Widget } from "../../widgets/types";
import { GridState, Monitor } from "../consts";
import getUpdatedWidgetPosition from "./getUpdatedHoverPosition";

const handleWidgetMoveHover = (
  hoverPosition: { x: number; y: number },
  layout: Widget[],
  preview: GridItem
): { layout: Widget[]; preview: GridItem } => {
  // TODO: handle collisions
  return { layout, preview: { ...preview, ...hoverPosition } };
};

export default handleWidgetMoveHover;
