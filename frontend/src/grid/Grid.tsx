import { useState, createContext, useContext } from "react";
import { Widget, WidgetConfig } from "../widgets/types";
import "./styles.css";
import "react-grid-layout/css/styles.css";
import {useDrag, useDrop} from "react-dnd";
import {Widget as WidgetComponent} from "../widgets/Widget";
import EmptyWidget from "../widgets/empty-widget/EmptyWidget";

const GRID_COLUMNS = 16; 
const GRID_ROWS = 8;

interface GridProps {
  setBackgroundBlur: (state: boolean) => void;
  incomingWidget: WidgetConfig | null;
}

interface GridContextType {
  selectedWidgetId: number | null;
  deleteWidget: (id: number) => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("missing proper context");
  }
  return context;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur, incomingWidget}) => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {config: EmptyWidget.defaultConfig, id: 1, x: 0, y: 0},
    {config: EmptyWidget.defaultConfig, id: 2, x: 1, y: 1}
  ]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);

  const deleteWidget = (id: number) => {
    setWidgets(widgets?.filter((widget) => widget.id !== id));
  };

  const [, drop] = useDrop({
    accept: "WIDGET",
    drop: (draggedWidget: { id: number }, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (!offset) return;

      const gridElement = document.querySelector(".grid-container");
      if (!gridElement) return;

      const gridRect = gridElement.getBoundingClientRect();
      const cellWidth = gridRect.width / GRID_COLUMNS;
      const cellHeight = gridRect.height / GRID_ROWS;

      const x = Math.floor((offset.x - gridRect.left) / cellWidth);
      const y = Math.floor((offset.y - gridRect.top) / cellHeight);

      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === draggedWidget.id ? { ...widget, x, y } : widget
        )
      );
    }
  });

  return <GridContext.Provider value={{deleteWidget, selectedWidgetId}}>
    <div
        ref={drop}
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          gap: "2px",
          position: "relative",
        }}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              gridColumnStart: widget.x + 1,
              gridRowStart: widget.y + 1,
              gridColumnEnd: widget.x + 2,
              gridRowEnd: widget.y + 2,
              position: "relative"
            }}
          >
            <WidgetComponent key={widget.id} widget={widget}/>
          </div>
        ))}
    </div>
  </GridContext.Provider>;
};

export default Grid;
