import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Widget, WidgetConfig, GridItem } from '../widgets/types';
import { Widget as WidgetComponent } from '../widgets/Widget';
import EmptyWidget from '../widgets/empty-widget/EmptyWidget';
import { GRID_COLUMNS, GRID_ROWS } from "./consts";
import "./styles.css";
import getUpdatedWidgetPosition from './utils/getUpdatedWidgetPosition';
import { useWidgetLayout } from './GridContext';

interface GridProps {
  setBackgroundBlur: (blur: boolean) => void;
}

type GridState = {
  layout: Widget[];
  draggedWidget: Widget | null;
  preview: GridItem | null;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur}) => {

  const initialWidgets: Widget[] = [
    {config: EmptyWidget.defaultConfig, h: 1, id: 1, w: 1, x: 0, y: 0}, 
    {config: EmptyWidget.defaultConfig, h: 1, id: 2, w: 1, x: 1, y: 1}
  ];
  
  //accesses and modifies global state
  const {layout, setLayout, addWidget, moveWidget} = useWidgetLayout();

  //temporary grid state which is reflected to the user 
  //overrides actual state visual during drag/resize operations
  const [tempGridState, setTempGridState] = useState<GridState | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);


  /* todo, remove this*/
  useEffect(() => {
    console.log("setting the initial layout!!");
    setLayout(initialWidgets);
  }, []);

  const [, drop] = useDrop({
    accept: ["WIDGET", "NEW_WIDGET"],
    hover: (item: { w: number, h: number, config: WidgetConfig, type: string}, monitor) => {

      //if it's a new widget, need to update the gridState and create the new widget ...
      if (!tempGridState) {

        const updatedPosition = getUpdatedWidgetPosition(monitor); 
        if (!updatedPosition) throw new Error("could not get updated position for new widget");

        const {x, y} = updatedPosition;

        //set a temporary id, a new one will be selected when droppe
        const newWidget: Widget = {...item, x, y, id: -1};
        onDragStart(newWidget);
        
      }else{
        //otherwise we simply update the preview position
        const updatedPosition = getUpdatedWidgetPosition(monitor); 
        if (updatedPosition) {
          const {x, y} = updatedPosition;
          const newPreview: GridItem = {x, y, h: item.h, w: item.w};
          if (tempGridState?.preview !== newPreview) {
            setTempGridState({
              ...tempGridState, 
              preview: newPreview
            });
          }
        }
      }
      
    },
    drop: (item: { w: number; h: number; config: WidgetConfig; type: string}, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const position = getUpdatedWidgetPosition(monitor);
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
    
      if (item.type === "NEW_WIDGET") 
        addWidget({...updatedWidget}, updatedWidget.config);
      else if (item.type === "WIDGET")
        moveWidget(updatedWidget.id, {x, y});

      setTempGridState(null);
    }, 

  });

  const onDragStart = useCallback((widget: Widget) => {
    setTempGridState({
      layout: layout.filter((w: Widget) => {return w.id !== widget.id}),
      draggedWidget: widget,
      preview: widget as GridItem
    });
  }, [layout, tempGridState]);

  const commitLayout = useCallback(() => {
    setTempGridState(null);
  }, []);

  return (
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
      onClick={() => setSelectedWidgetId(null)}
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
            onDragStart={() => onDragStart(widget)}
            onDragCommit={commitLayout}
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