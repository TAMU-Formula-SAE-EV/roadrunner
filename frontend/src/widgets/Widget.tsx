import { useDrag } from "react-dnd";
import { Widget as Widget_t } from "./types";
import { getWidgetType } from "./utils/getWidgetType";
import ResizeHandle from "./utils/ResizeHandle";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

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

  const [_, drag] = useDrag({
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

  const WidgetType = getWidgetType(widget.config);

  return (
    <div
      ref={drag}
      className={"widget-wrapper-container"}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        position: "relative",
      }}
    >
      {
        <WidgetType.Component config={widget.config}></WidgetType.Component>
      }

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
        

        { selected &&
          <button className="generic-button edit-button" onClick={() => {}} style={{position: "absolute", right: 0, top: 0}}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        }
    </div>
  );
};

export default Widget;
