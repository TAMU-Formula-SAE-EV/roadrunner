
import { GridOperationPayload, GRID_OPERATION } from "../../grid/consts";
import { WidgetConfig } from "../types";
import {useDrag} from "react-dnd";

interface WidgetSpawnerProps {
    config: WidgetConfig;
    onDragStart?: () => void;
    children: React.ReactNode;
}

const WidgetSpawner: React.FC<WidgetSpawnerProps> = ({ config, onDragStart, children }) => {
    
    const [{ isDragging }, drag] = useDrag({
        type: "NEW_WIDGET",
        item: () => {
          return { 
            config,
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