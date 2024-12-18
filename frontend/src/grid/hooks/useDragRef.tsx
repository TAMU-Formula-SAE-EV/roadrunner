import { ConnectDropTarget, useDrop } from "react-dnd";
import { GridOperationState, GridOperationPayload, GRID_OPERATION, GridPosition } from "../consts";
import { useWidgetLayout } from "../GridContext";
import { GridItem, Widget, WidgetConfig } from "../../widgets/types";
import getHoverPosition from "../utils/getHoverPosition";
import generatePreviewLayout from "../utils/generatePreviewLayout";
import { useRef } from "react";


/*
    handles widget drag hover/drop logic
*/


const useDragRef: (gridOperation: GridOperationState | null, setGridOperation: (newState: GridOperationState | null) => void) => ConnectDropTarget = 
    (
        gridOperation,
        setGridOperation,
    ) => {

    const {layout, setLayout, getNewId} = useWidgetLayout();
    const hoverPosition = useRef<GridPosition | null>(null);
        
    const [, drag] = useDrop({
        accept: ["WIDGET", "NEW_WIDGET", "RESIZE"],
        hover: (payload: GridOperationPayload<any>, monitor) => {

        //if it's a new operation, need to make the operation state ...
        if (!gridOperation) {
            const { id, config, handle, operation, typeId } = payload;

            const existingWidget = layout.find((w: Widget<any>) => w.id === id);
            const widget: Widget<any> = existingWidget || 
                {x: 0, y: 0, id: getNewId(), config, h: config.h, w: config.w, typeId};

            setGridOperation({
                layout: layout.filter((w: Widget<any>) => w.id !== (existingWidget ? existingWidget.id : widget.id)),
                widget,
                preview: existingWidget ? existingWidget as GridItem : null,
                operation,
                handle
            });


        }else{
            
            const updatedHoverPosition = getHoverPosition(monitor);

            if (updatedHoverPosition !== undefined && updatedHoverPosition !== hoverPosition.current) {
                hoverPosition.current = updatedHoverPosition;
                setGridOperation({
                    ...gridOperation, 
                    ...generatePreviewLayout(layout, gridOperation, updatedHoverPosition)
                });
            };
        }
        
        },
        drop: (_, monitor) => {
            if (!gridOperation) throw new Error("attemped to drop resize/move while operation is null!!");
            
            const currentHoverPosition = getHoverPosition(monitor);
            if (!currentHoverPosition) throw new Error("could not get drop position");

            const previewLayout = generatePreviewLayout(layout, gridOperation, currentHoverPosition);
            
            const newLayout = 
                [...previewLayout.layout, {...gridOperation.widget, ...previewLayout.preview }];
            
            hoverPosition.current = null;

            //if the preview is null, return to the existing state
            if (gridOperation.preview) setLayout(newLayout);
            setGridOperation(null);
        }, 


    });

    return drag;
} 


export default useDragRef;