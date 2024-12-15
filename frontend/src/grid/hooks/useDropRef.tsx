import { ConnectDropTarget, useDrop } from "react-dnd";
import { GridState } from "../consts";
import { useWidgetLayout } from "../GridContext";
import { GridItem, Widget, WidgetConfig } from "../../widgets/types";
import getHoverPosition from "../utils/getHoverPosition";
import generatePreviewLayout from "../utils/generatePreviewLayout";


/*
    handles widget drag hover/drop logic
*/


const useDropRef: (tempGridState: GridState | null, setTempGridState: (newState: GridState | null) => void) => ConnectDropTarget = 
    (
        tempGridState,
        setTempGridState,
    ) => {

    const {layout, setLayout, getNewId} = useWidgetLayout();
        
    const [, drop] = useDrop({
        accept: ["WIDGET", "NEW_WIDGET"],
        hover: (item: { w: number, h: number, config: WidgetConfig, id?: number}, monitor) => {

        const gridPosition = getHoverPosition(monitor); 
        if (!gridPosition) throw new Error("could not get updated position for drag");

        //if it's a new drag, need to update the gridState ...
        if (!tempGridState) {

            const {x, y} = gridPosition;
            const id = (item.id !== undefined) ? item.id : getNewId();
            
            const newWidget: Widget = {...item, x, y, id};

            setTempGridState({
                layout: layout.filter((w: Widget) => {return w.id !== newWidget.id}),
                resizedWidget: null,
                draggedWidget: newWidget,
                preview: newWidget as GridItem
            }); 

        }else{
            setTempGridState({
            ...tempGridState, 
            ...generatePreviewLayout(gridPosition, tempGridState.layout, tempGridState.preview)
            })
        }
        
        },
        drop: (item: { w: number; h: number; config: WidgetConfig, id?: number}, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) return;

            const position = getHoverPosition(monitor);
            if (!position) throw new Error("could not get position for dropped widget");

            const {x, y} = position;

            // find the dragged widget
            if (!tempGridState?.draggedWidget) throw new Error("dropped while null");

            // create updated widget with new position
            const updatedWidget = {
                ...tempGridState.draggedWidget,
                x,
                y
            };

            const updatedGridLayout = [...tempGridState.layout, updatedWidget];
            setLayout(updatedGridLayout);
            setTempGridState(null);
        }, 

    });

    return drop;
} 


export default useDropRef;