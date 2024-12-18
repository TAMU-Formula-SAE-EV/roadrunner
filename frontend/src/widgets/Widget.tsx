import { useDrag } from "react-dnd";
import { ResizeHandle as ResizeHandle_t, Widget as Widget_t, WidgetConfig } from "./types";
import ResizeHandle from "./utils/ResizeHandle";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import { useWidgetLayout } from "../grid/GridContext";
import { GRID_OPERATION } from "../grid/consts";
import { widgetTypeRegistry } from "./widget_types/widgetTypeRegistery";

/*
  Handles universal widget behavior: 
  - style
  - resize handles
  - drag behavior
  - resize behavoir
  - edit button
  - spawn edit form
  - render widget contents
*/

interface WidgetProps<Config extends WidgetConfig>{
  widget: Widget_t<Config>;
  selected?: boolean;
}

export const Widget: React.FC<WidgetProps<any>> = ({
  widget,
  selected,
}) => {

  const { id, config, typeId } = widget;
  const WidgetType = widgetTypeRegistry[typeId];
  const { availableHandles } = config;
  const {editConfig, deleteWidget} = useWidgetLayout();

  const [formActive, setFormActive] = useState<boolean>(false);

  //temporary, uncommitted config state
  //pushed or discarded depending on how user exits edit form
  const [configState, setConfigState] = useState<WidgetConfig>(config);

  const [_, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      return {
        ...widget, 
        operation: GRID_OPERATION.MOVE
      };
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    console.log("edit button clicked!!!!");
    setFormActive(true);
  };
  
  const handleSaveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    editConfig(id, configState);
    setFormActive(false);
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
        <button onClick={() => {deleteWidget(id)}}>Delete</button>
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
        availableHandles.map((handle: ResizeHandle_t) => (
            <ResizeHandle
              key={`${widget.id}-${handle}`}
              id={widget.id}
              handle={handle}
              config={config}
              typeId={typeId}
            />
        ))}
        

      { selected &&
        <button 
          className="generic-button edit-button" 
          onClick={handleEditClick} 
          style={{position: "absolute", right: 0, top: 0}}
        >
          <FontAwesomeIcon icon={faEllipsisVertical}/>
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
