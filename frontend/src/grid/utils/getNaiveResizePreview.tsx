import { GridItem, ResizeHandle, Widget } from "../../widgets/types";
import { GRID_COLUMNS, GRID_ROWS, GridOperation } from "../consts";


/*Gets the preview location for widget during operation assuming
no collisions with other widgets */
const getNaiveResizePreview = (operation: GridOperation, hoverPosition: {x: number, y: number}) :
    GridItem => {

        let updatedPreview = operation.preview;
        const originalPosition = operation.widget;
        const {handle, preview} = operation;

        if (!handle) throw new Error("Handle undefined during resize");
        
        if (handle === 'n' || handle === 'ne' || handle === 'nw') {
            const displacement = (hoverPosition.y - originalPosition.y - originalPosition.h);
            
            if (displacement < 0) {
                
                preview.h += ((preview.y) - hoverPosition.y);
                preview.y -= ((preview.y) - hoverPosition.y);
            }
        }

        if (handle === 's' || handle === 'se' || handle === 'sw') {

            const displacement = (hoverPosition.y - originalPosition.y);
            
            if (displacement > 0) {
                preview.h -= ((preview.y + preview.h) - hoverPosition.y);
            }

        }

        if (handle === 'e' || handle === 'se' || handle === 'ne') {
            const displacement = (hoverPosition.x - originalPosition.x);
            
            if (displacement > 0) {
                preview.w -= ((preview.x + preview.w) - hoverPosition.x);
            }
        }

        if (handle === 'w' || handle === 'nw' || handle === "sw") {
            const displacement = (hoverPosition.x - originalPosition.x - originalPosition.w);
            
            if (displacement < 0) {
                
                preview.w += ((preview.x) - hoverPosition.x);
                preview.x -= ((preview.x) - hoverPosition.x);
            }
        }
        

        //check grid bounds
        updatedPreview.x = (updatedPreview.x >= 0) ? updatedPreview.x : 0;
        updatedPreview.y = (updatedPreview.y >= 0) ? updatedPreview.y : 0;
        updatedPreview.w = (updatedPreview.w + updatedPreview.x <= GRID_COLUMNS) ? updatedPreview.w : GRID_COLUMNS - updatedPreview.x;
        updatedPreview.h = (updatedPreview.h + updatedPreview.y <= GRID_ROWS) ? updatedPreview.h : GRID_COLUMNS - updatedPreview.y;

        return updatedPreview;
    }

export default getNaiveResizePreview;