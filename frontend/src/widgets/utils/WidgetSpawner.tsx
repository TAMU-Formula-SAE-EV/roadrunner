
import { GridOperationPayload, GRID_OPERATION } from "../../grid/consts";
import { WidgetConfig, WidgetType } from "../types";
import {useDrag} from "react-dnd";

interface WidgetSpawnerProps<Config extends WidgetConfig> {
    config: Config;
    typeId: number;
    onDragStart?: () => void;
    children: React.ReactNode;
}

const WidgetSpawner: React.FC<WidgetSpawnerProps<any>> = ({ config, typeId, onDragStart, children }) => {
    
    const [{ isDragging }, drag] = useDrag({
        type: "NEW_WIDGET",
        item: () => {
          return { 
            config,
            typeId,
            operation: GRID_OPERATION.MOVE
          } as GridOperationPayload<WidgetConfig>;
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
          }),
      });
    
    
    return (
        <div
            className="widget-spawner"
            draggable={true}
            ref={drag}
            onDragStart={onDragStart}
        >
            {!isDragging && children}
        </div>
    );
};

export default WidgetSpawner;