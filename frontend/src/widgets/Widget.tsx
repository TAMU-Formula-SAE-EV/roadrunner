import { useDrag } from "react-dnd";
import { Widget as Widget_t, WidgetConfig } from "./types";
import { getWidgetType } from "./utils/getWidgetType";
import ResizeHandle from "./utils/ResizeHandle";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import { useWidgetLayout } from "../grid/GridContext";
import ReactDOM from "react-dom";

/*
  Handles universal widget behavior: 
  - style
  - resize handles
  - drag behavior
  - edit button
  - spawn edit form
  - render widget contents
*/

// map each handle to its CSS position
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

interface WidgetProps {
  widget: Widget_t;
  selected?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  widget,
  selected,
}) => {

  const { id, config } = widget;
  const { availableHandles } = config;
  const {editConfig, deleteWidget} = useWidgetLayout();
  const WidgetType = getWidgetType(widget.config);

  const [formActive, setFormActive] = useState<boolean>(false);

  //temporary, uncommitted config state
  const [configState, setConfigState] = useState<WidgetConfig>(config);

  useEffect(() => {console.log(formActive)}, [formActive]);

  const [_, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      const d = {
        id: widget.id,
        type: "WIDGET",
        w: widget.w,
        h: widget.h,
        config,
      };
      console.log(d);
      return d;
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    setFormActive(true);
  };
  
  const handleSaveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    editConfig(id, configState);
    setTimeout(() => setFormActive(false), 50);
  };
  
  
  const renderForm = () => (
    <>
      <div className="fullscreen-overlay"></div>
      <div className="modal-content">
        <button className="generic-button close-button" onClick={() => {setFormActive(false); setConfigState(config)}}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <br />
        <WidgetType.Form config={configState} setConfigState={setConfigState} />
        <br />
        <br />
        <button onClick={handleSaveButtonClick}>Save</button>
        <button onClick={() => {deleteWidget(id)}}>delete</button>
      </div>
    </>);

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

      {/* The actual Widget contents*/}
      {
        <WidgetType.Component id={id} config={widget.config} />
      }
      

      {/* Show handles and edit button when selected */}
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
              <FontAwesomeIcon icon={faEllipsisVertical} onClick={handleEditClick}/>
          </button>
        }

        {/* If form is active, render */}
        {formActive && 
          renderForm()
        }
    </div>
  );
};

export default Widget;
