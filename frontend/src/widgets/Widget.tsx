import { useDrag } from "react-dnd";
import { WidgetConfig, Widget as Widget_t } from "./types";
import { getWidgetComponent } from "./utils/getWidgetComponent";
import { useEffect, useRef } from "react";

interface WidgetProps {
  widget: Widget_t;
  onDragStart: () => void;
  onDragCommit: () => void;
}

export const Widget: React.FC<WidgetProps> = ({ 
  widget, 
  onDragStart,  
  onDragCommit, 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      onDragStart();
      return { 
        id: widget.id, 
        type: "WIDGET", 
        w: widget.w, 
        h: widget.h 
      };
    },
    end: (item, monitor) => {
        onDragCommit();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

  });

  return (
    <div
      ref={drag} 
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        position: "relative",
      }}
    >
      {getWidgetComponent(widget.config, widget.id)}
    </div>
  );
};