import { ConnectDropTarget, useDrop } from "react-dnd";
import { GridOperation, WIDGET_OPERATION } from "../consts";
import { useWidgetLayout } from "../GridContext";
import { GridItem, ResizeHandle, Widget, WidgetConfig } from "../../widgets/types";
import getHoverPosition from "../utils/getHoverPosition";
import getNaiveResizePreview from "../utils/getNaiveResizePreview";
import generatePreviewLayout from "../utils/generatePreviewLayout";


/*
    handles widget resize operation logic
*/


const useResizeRef: (tempGridState: GridOperation | null, setTempGridState: (newState: GridOperation | null) => void) => ConnectDropTarget = 
    (
        gridOperation,
        setGridOperation,
    ) => {

    const {layout, setLayout, getNewId} = useWidgetLayout();
            
        
    const [, resize] = useDrop({
        accept: ["RESIZE"],
        hover: (item: {id: number, handle: ResizeHandle}, monitor) => {
        const gridPosition = getHoverPosition(monitor); 
        if (!gridPosition) throw new Error("could not get updated position for resize hover");

        if (!gridOperation) {
            const resizedWidget = layout.find((w: Widget) => {return w.id === item.id});
            if (!resizedWidget) throw new Error("attempting to resize non-existant widget");

            setGridOperation({
                layout: layout.filter((w: Widget) => {return w.id !== item.id}), 
                widget: resizedWidget, 
                preview: resizedWidget as GridItem,
                operation: WIDGET_OPERATION.RESIZE, 
                handle: item.handle
            });
        } else {
            const originalPosition = layout.find((w: Widget) => {return w.id === item.id});
            if (!originalPosition) throw new Error("cannot find original position"); 
            setGridOperation({
                ...gridOperation,
                ...generatePreviewLayout(layout, gridOperation, monitor)
            })
        }
        }, 
        drop: (item: {id: number, handle: ResizeHandle}, monitor) => {
            
            if (!gridOperation) throw new Error("attemped to drop resize while operation is null!!");
            const previewLayout = generatePreviewLayout(layout, gridOperation, monitor);
            const newLayout = [...previewLayout.layout, {...gridOperation.widget, ...previewLayout.preview }]

            setLayout(newLayout);
            setGridOperation(null);
        }, 
    });

    return resize;
} 


export default useResizeRef;