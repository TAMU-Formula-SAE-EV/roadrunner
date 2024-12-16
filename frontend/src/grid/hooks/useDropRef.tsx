import { ConnectDropTarget, useDrop } from "react-dnd";
import { GridOperation, WIDGET_OPERATION } from "../consts";
import { useWidgetLayout } from "../GridContext";
import { GridItem, Widget, WidgetConfig } from "../../widgets/types";
import getHoverPosition from "../utils/getHoverPosition";
import generatePreviewLayout from "../utils/generatePreviewLayout";


/*
    handles widget drag hover/drop logic
*/


const useDropRef: (gridOperation: GridOperation | null, setGridOperation: (newState: GridOperation | null) => void) => ConnectDropTarget = 
    (
        gridOperation,
        setGridOperation,
    ) => {

    const {layout, setLayout, getNewId} = useWidgetLayout();
        
    const [, drop] = useDrop({
        accept: ["WIDGET", "NEW_WIDGET"],
        hover: (item: { w: number, h: number, config: WidgetConfig, id?: number, x?: number, y?: number}, monitor) => {

        const gridPosition = getHoverPosition(monitor); 
        if (!gridPosition) throw new Error("could not get updated position for drag");
        const {x, y} = gridPosition;

        //if it's a new drag, need to update the gridState ...
        if (!gridOperation) {

            const id = (item.id !== undefined) ? item.id : getNewId();
            
            const newWidget: Widget = {...item, x, y, id};

            setGridOperation({
                layout: layout.filter((w: Widget) => {return w.id !== newWidget.id}),
                widget: newWidget,
                preview: newWidget as GridItem,
                operation: WIDGET_OPERATION.MOVE, 
                handle: undefined
            }); 

        }else{
            setGridOperation({
                ...gridOperation, 
                ...generatePreviewLayout(layout, gridOperation, monitor)
            })
        }
        
        },
        drop: (item: { w: number; h: number; config: WidgetConfig, id?: number}, monitor) => {
            if (!gridOperation) throw new Error("attemped to drop resize while operation is null!!");
            const previewLayout = generatePreviewLayout(layout, gridOperation, monitor);
            const newLayout = [...previewLayout.layout, {...gridOperation.widget, ...previewLayout.preview }]

            setLayout(newLayout);
            setGridOperation(null);
        }, 


    });

    return drop;
} 


export default useDropRef;