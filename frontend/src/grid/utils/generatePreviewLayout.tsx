import { GridItem, Widget } from "../../widgets/types";
import { GridState, Monitor } from "../consts";
import getUpdatedWidgetPosition from "./getHoverPosition";

const generatePreviewLayout = (
  hoverPosition: { x: number; y: number },
  layout: Widget[],
  preview: GridItem
): { layout: Widget[]; preview: GridItem } => {
  // TODO: handle collisions
  return { layout, preview: { ...preview, ...hoverPosition } };
};

export default generatePreviewLayout;
