import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Widget, WidgetConfig, GridItem, ResizeHandle } from '../widgets/types';
import { Widget as WidgetComponent } from '../widgets/Widget';
import EmptyWidget from '../widgets/empty-widget/EmptyWidget';
import { GRID_COLUMNS, GRID_ROWS, GridState } from "./consts";
import "./styles.css";
import getUpdatedHoverPosition from './utils/getUpdatedHoverPosition';
import { useWidgetLayout } from './GridContext';
import handleWidgetMoveHover from './utils/handleWidgetMoveHover';
import { assert } from 'console';
import handleWidgetResizeHover from './utils/handleWidgetResizeHover';

interface GridProps {
  setBackgroundBlur: (blur: boolean) => void;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur}) => {


  //temporary!!! just for testing
  const initialWidgets: Widget[] = [
    {config: EmptyWidget.defaultConfig, h: 1, id: 1, w: 1, x: 0, y: 0}, 
    {config: EmptyWidget.defaultConfig, h: 1, id: 2, w: 1, x: 1, y: 1}
  ];
  
  //accesses and modifies global state
  //hidden from the user during drag/resize operations
  const {layout, setLayout, addWidget, moveWidget} = useWidgetLayout();

  //temporary grid state which is reflected to the user 
  //overrides actual state visual during drag/resize operations
  const [tempGridState, setTempGridState] = useState<GridState | null>(null);

  //used to show/hide edit and resize buttons
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);

  /* todo, remove this*/
  useEffect(() => {
    console.log("setting the initial layout!!");
    setLayout(initialWidgets);
  }, []);

  useEffect(() => {
    console.log(tempGridState);
  }, [tempGridState]);

  const [, resize] = useDrop({
    accept: ["RESIZE"],
    hover: (item: {id: number, handle: ResizeHandle}, monitor) => {
      const gridPosition = getUpdatedHoverPosition(monitor); 
      if (!gridPosition) throw new Error("could not get updated position for resize hover");

      if (!tempGridState) {
        const resizedWidget = layout.find((w: Widget) => {return w.id === item.id});
        if (!resizedWidget) throw new Error("attempting to resize non-existant widget");

        setTempGridState({
          layout: layout.filter((w: Widget) => {return w.id !== item.id}), 
          draggedWidget: null, 
          resizedWidget,
          preview: resizedWidget as GridItem
        });
      } else {
        const originalPosition = layout.find((w: Widget) => {return w.id === item.id});
        if (!originalPosition) throw new Error("cannot find original position"); 
        setTempGridState({
          ...tempGridState,
          ...handleWidgetResizeHover(gridPosition, tempGridState.layout, tempGridState.preview, item.handle, originalPosition),
        })
      }
    }, 
    drop: (item: {id: number, handle: ResizeHandle}, monitor) => {
      setLayout(layout.map((w: Widget) => {if (w.id === item.id) return {...w, ...tempGridState?.preview}; else return w;}))
      setTempGridState(null);
    }, 
  });

  const [, drop] = useDrop({
    accept: ["WIDGET", "NEW_WIDGET"],
    hover: (item: { w: number, h: number, config: WidgetConfig}, monitor) => {

      const gridPosition = getUpdatedHoverPosition(monitor); 
      if (!gridPosition) throw new Error("could not get updated position for drag");

      //if it's a new drag, need to update the gridState ...
      if (!tempGridState) {

        if (monitor.getItemType() === "NEW_WIDGET") {
          const {x, y} = gridPosition;
          
          const newWidget: Widget = {...item, x, y, id: -1};
          onMoveDragStart(newWidget);

        } else if (monitor.getItemType() === "RESIZE") {

        };
        
      }else{
        setTempGridState({
          ...tempGridState, 
          ...handleWidgetMoveHover(gridPosition, tempGridState.layout, tempGridState.preview)
        })
      }
      
    },
    drop: (item: { w: number; h: number; config: WidgetConfig}, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const position = getUpdatedHoverPosition(monitor);
      if (!position) throw new Error("could not get position for dropped widget");

      const {x, y} = position;

      // find the dragged widget
      if (!tempGridState?.draggedWidget) throw new Error("dropped while null");

      // create updated widget with new position
      const updatedWidget = {
        ...tempGridState.draggedWidget,
        x,
        y
      };
    
      if (monitor.getItemType() === "NEW_WIDGET") 
        addWidget({...updatedWidget}, updatedWidget.config);
      else if (monitor.getItemType() === "WIDGET")
        moveWidget(updatedWidget.id, {x, y});

      setTempGridState(null);
    }, 

  });

  const onMoveDragStart = useCallback((widget: Widget) => {
    setTempGridState({
      layout: layout.filter((w: Widget) => {return w.id !== widget.id}),
      resizedWidget: null,
      draggedWidget: widget,
      preview: widget as GridItem
    });
  }, [layout, tempGridState]);

  return (
    <div 
      ref={(node) => {
        resize(node);
        drop(node);
      }}
      className="grid-container"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        gap: "2px",
        position: "relative",
      }}
    >

      {/* render widgets (make them invisible if during a drop/resize operation)*/}
      {layout.map(widget => (
        <div 
          key={widget.id}
          style={{
            gridColumnStart: widget.x + 1,
            gridRowStart: widget.y + 1,
            gridColumnEnd: widget.x + widget.w + 1,
            gridRowEnd: widget.y + widget.h + 1,
            opacity: tempGridState ? 0 : 1
          }}
          onClick={() => setSelectedWidgetId(widget.id)}
        >
          <WidgetComponent 
            widget={widget}
            onDragStart={() => onMoveDragStart(widget)}
            selected={selectedWidgetId === widget.id}
          />
        </div>
      ))}

      {/* if in the middle of a drop/resize operation, display temp widget locations*/}
      {tempGridState?.layout.map(widget => (
        <div 
          key={`${widget.id}-temp-location`}
          style={{
            gridColumnStart: widget.x + 1,
            gridRowStart: widget.y + 1,
            gridColumnEnd: widget.x + widget.w + 1,
            gridRowEnd: widget.y + widget.h + 1,
            backgroundColor: "grey"
          }}
        />
      ))}

      {/* render the drop/resize preview */}
      {tempGridState?.preview && (
        <div 
          style={{
            width: "100%",
            height: "100%",
            position: 'relative',
            gridColumnStart: tempGridState.preview.x + 1,
            gridRowStart: tempGridState.preview.y + 1,
            gridColumnEnd: tempGridState.preview.x + tempGridState.preview.w + 1,
            gridRowEnd: tempGridState.preview.y + tempGridState.preview.h + 1,
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            border: '2px dashed blue',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}
    </div>
  );
};

export default Grid;