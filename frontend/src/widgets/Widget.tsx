import { useDrag } from "react-dnd";
import { Widget as Widget_t } from "./types";
import { getWidgetComponent } from "./utils/getWidgetComponent";
import ResizeHandle from "./utils/ResizeHandle";
import React from "react";

interface WidgetProps {
  widget: Widget_t;
  selected?: boolean;
  onDragStart: () => void;
}

export const Widget: React.FC<WidgetProps> = ({
  widget,
  onDragStart,
  selected,
}) => {
  const { availableHandles } = widget.config;

  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      onDragStart();
      return {
        id: widget.id,
        type: "WIDGET",
        w: widget.w,
        h: widget.h,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Map each handle to its CSS position
  const handlePositions: Record<string, React.CSSProperties> = {
    n: { top: 0, left: "50%", transform: "translate(-50%, -50%)" },
    s: { bottom: 0, left: "50%", transform: "translate(-50%, 50%)" },
    e: { right: 0, top: "50%", transform: "translate(50%, -50%)" },
    w: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
    ne: { top: 0, right: 0, transform: "translate(50%, -50%)" },
    nw: { top: 0, left: 0, transform: "translate(-50%, -50%)" },
    se: { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
    sw: { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
  };

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

      {selected &&
        availableHandles.map((handle) => (
          <div style={{
            position: "absolute",
            ...handlePositions[handle],
          }}
          key={handle}>
            <ResizeHandle
              key={`${widget.id}-${handle}`}
              id={widget.id}
              handle={handle}
            />
          </div>
        ))}
    </div>
  );
};

export default Widget;
