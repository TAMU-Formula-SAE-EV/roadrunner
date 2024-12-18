import { GridItem } from "../../widgets/types";
import { GRID_COLUMNS, GRID_ROWS, GridOperationState } from "../consts";


/*Gets the preview location for widget during operation assuming
no collisions with other widgets */
const getNaiveDragPreview: (operation: GridOperationState, hoverPosition: {x: number, y: number}) => GridItem = (operation, {x, y}) => {

    let updatedPreview: GridItem = operation.preview ? { ...operation.preview,  x, y} 
        : {h: operation.widget.h, w: operation.widget.w, x, y};

    //check grid bounds
    updatedPreview.x = (updatedPreview.x + updatedPreview.w <= GRID_COLUMNS) ? updatedPreview.x : GRID_COLUMNS - updatedPreview.w;
    updatedPreview.y = (updatedPreview.y + updatedPreview.h <= GRID_ROWS) ? updatedPreview.y : GRID_ROWS - updatedPreview.h;

    return updatedPreview;
}

export default getNaiveDragPreview;