import { DropTargetMonitor } from "react-dnd";
import { GRID_COLUMNS, GRID_ROWS, GridPosition, Monitor } from "../consts";

const getHoverPosition: (monitor: Monitor) => GridPosition | undefined = (monitor) => {
    const gridElement = document.querySelector(".grid-container");
    if (!gridElement) return;
    
    const gridRect = gridElement.getBoundingClientRect();
    const cellWidth = gridRect.width / GRID_COLUMNS;
    const cellHeight = gridRect.height / GRID_ROWS;
    
    const clientOffset = monitor.getClientOffset();
    if (!clientOffset) return;
    
    const x = Math.floor((clientOffset.x - gridRect.left) / cellWidth);
    const y = Math.floor((clientOffset.y - gridRect.top) / cellHeight);
    
    return { x, y }
};

export default getHoverPosition;