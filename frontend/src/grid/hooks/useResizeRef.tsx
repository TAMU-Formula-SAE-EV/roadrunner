import { ConnectDropTarget, useDrop } from "react-dnd";
import { GridState } from "../consts";
import { useWidgetLayout } from "../GridContext";
import { GridItem, ResizeHandle, Widget, WidgetConfig } from "../../widgets/types";
import getHoverPosition from "../utils/getHoverPosition";
import getWidgetResizePreview from "../utils/getWidgetResizePreview";


/*
    handles widget resize operation logic
*/


const useResizeRef: (tempGridState: GridState | null, setTempGridState: (newState: GridState | null) => void) => ConnectDropTarget = 
    (
        tempGridState,
        setTempGridState,
    ) => {

    const {layout, setLayout, getNewId} = useWidgetLayout();
            
        
    const [, resize] = useDrop({
        accept: ["RESIZE"],
        hover: (item: {id: number, handle: ResizeHandle}, monitor) => {
        const gridPosition = getHoverPosition(monitor); 
        if (!gridPosition) throw new Error("could not get updated position for resize hover");

        if (!tempGridState) {
            const resizedWidget = layout.find((w: Widget) => {return w.id === item.id});
            if (!resizedWidget) throw new Error("attempting to resize non-existant widget");

            setTempGridState({
            layout: layout.filter((w: Widget) => {return w.id !== item.id}), 
            draggedWidget: null, 
            resizedWidget,
            preview: resizedWidget as GridItem
            });
        } else {
            const originalPosition = layout.find((w: Widget) => {return w.id === item.id});
            if (!originalPosition) throw new Error("cannot find original position"); 
            setTempGridState({
            ...tempGridState,
            ...getWidgetResizePreview(gridPosition, tempGridState.layout, tempGridState.preview, item.handle, originalPosition),
            })
        }
        }, 
        drop: (item: {id: number, handle: ResizeHandle}, monitor) => {
        setLayout(layout.map((w: Widget) => {if (w.id === item.id) return {...w, ...tempGridState?.preview}; else return w;}))
        setTempGridState(null);
        }, 
    });

    return resize;
} 


export default useResizeRef;