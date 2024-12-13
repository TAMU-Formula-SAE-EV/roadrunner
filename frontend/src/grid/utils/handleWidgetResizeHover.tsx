import { GridItem, ResizeHandle, Widget } from "../../widgets/types";
import { GridState } from "../consts";

const handleWidgetResizeHover = (hoverPosition: {x: number, y: number}, layout: Widget[], preview: GridItem, handle: ResizeHandle, originalPosition: GridItem) :
    {layout: Widget[], preview: GridItem} => {

        let updatedPreview = preview;

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

        if (handle === 'e' || handle === 'se' || handle === 'sw') {
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
        
        //TODO: Handle collisions
        return {layout, preview: updatedPreview};
    }

export default handleWidgetResizeHover;