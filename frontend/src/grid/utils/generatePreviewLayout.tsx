import { GridItem, Widget } from "../../widgets/types";
import { GRID_COLUMNS, GRID_ROWS, GridOperationState, Monitor, GRID_OPERATION, GridPosition } from "../consts";
import getHoverPosition from "./getHoverPosition";
import getNaiveDragPreview from "./getNaiveDragPreview";
import getNaiveResizePreview from "./getNaiveResizePreview";

/*
  - Takes in the current global layout, the operation, and drag monitor as inputs
  - returns a valid layout to be displayed to the user during a drag/resize operation
*/

const doesCollide = (a: GridItem, b: GridItem): boolean => {
  return !(
    a.x >= b.x + b.w ||
    a.x + a.w <= b.x ||
    a.y >= b.y + b.h ||
    a.y + a.h <= b.y
  );
};

const layoutCollides = (layout: GridItem[], item: GridItem): boolean => {
  return layout.some((g: GridItem) => doesCollide(g, item));
};

const generatePreviewLayout = (
  currentLayout: Widget<any>[],
  operation: GridOperationState, 
  hoverPosition: GridPosition,
): { layout: Widget<any>[]; preview: GridItem | null } => {

  //get global widget layout (and remove the widget we are moving/resizing)
  const layout = currentLayout.filter((w: Widget<any>) => {return w.id !== operation.widget.id});

  //get the preview assuming no collisions
  const naivePreview: GridItem = operation.operation === GRID_OPERATION.MOVE ? getNaiveDragPreview(operation, hoverPosition) : 
    getNaiveResizePreview(operation, hoverPosition);

  //if there are no collisions, return
  const collides: Widget<any>[] = [];
  const noCollides: Widget<any>[] = [];
  layout.forEach((w: Widget<any>) => {if (doesCollide(w, naivePreview)) collides.push(w); else noCollides.push(w)});
  if (collides.length === 0) {
    return {layout, preview: naivePreview};
  }

  //TEMP: 
  // - GIVE COLLIDING WIDGETS THE NEXT AVAILABLE SPOT (GREEDY)
  // - IF THIS DOESN'T WORK, REVERT TO PREVIOUS LAYOUT
  //TODO: 
  // - MOVE COLLIDING WIDGETS AROUND THE NAIVE PREVIEW 
  //    - TRY TO KEEP THEM CLOSE TO THEIR ORIGINAL POSITION
  // - IF THIS DOESN'T WORK, EITHER MOVE/SQUEEZE PREVIEW
  // - IF THIS STILL DOESN'T WORK, REVERT TO PREVIOUS LAYOUT
  //
  // - note: if the widget started out on the grid there should ALWAYS 
  //  be a backup spot for it. 
  
  let updatedLayout: Widget<any>[] = [...noCollides];
  collides.forEach((c_widget: Widget<any>) => {
    for (let x = 0; x <= GRID_COLUMNS; x++) {
      for (let y = 0; y <= GRID_ROWS; y++) {
        if (!layoutCollides(updatedLayout, {...c_widget, x, y})) {
          updatedLayout.push({...c_widget, x, y});
          return;
        }
      }
    }
  });

  if (updatedLayout.length === layout.length) {
    return {layout: updatedLayout, preview: naivePreview};
  } else {
    return {layout: operation.layout, preview: operation.preview};
  }

};

export default generatePreviewLayout;
