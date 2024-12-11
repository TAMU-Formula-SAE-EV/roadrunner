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
  draggedWidget: Widget | null;
  preview: GridItem | null;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur}) => {

  const initialWidgets: Widget[] = [
    {config: EmptyWidget.defaultConfig, h: 1, id: 1, w: 1, x: 0, y: 0}, 
    {config: EmptyWidget.defaultConfig, h: 1, id: 2, w: 1, x: 1, y: 1}
  ];

  const {layout, setLayout, addWidget, moveWidget} = useWidgetLayout();
  const [gridState, setGridState] = useState<GridState>({
    draggedWidget: null,
    preview: null,
  });

  useEffect(() => {
    console.log("setting the initial layout!!");
    setLayout(initialWidgets);
  }, []);

  const [, drop] = useDrop({
    accept: ["WIDGET", "NEW_WIDGET"],
    hover: (item: { w: number, h: number, config: WidgetConfig, type: string}, monitor) => {

      //if it's a new widget, need to update the gridState and create the new widget ...
      if (gridState.draggedWidget === null) {

        const updatedPosition = getUpdatedWidgetPosition(monitor); 
        if (!updatedPosition) throw new Error("could not get updated position for new widget");

        const {x, y} = updatedPosition;

        const newWidget: Widget = {...item, x, y, id: -1};
        onDragStart(newWidget);
        
      }else{
        //otherwise we simply update the preview position
        const updatedPosition = getUpdatedWidgetPosition(monitor); 
        if (updatedPosition) {
          const {x, y} = updatedPosition;
          const newPreview: GridItem = {x, y, h: item.h, w: item.w};
          if (gridState.preview !== newPreview) {
            setGridState(prev => ({
              ...prev,
              preview: newPreview
            }));
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
      if (!gridState.draggedWidget) throw new Error("dropped while null");

      // create updated widget with new position
      const updatedWidget = {
        ...gridState.draggedWidget,
        x,
        y
      };

      
      if (item.type === "NEW_WIDGET") 
        addWidget({...updatedWidget}, updatedWidget.config);
      else if (item.type === "WIDGET")
        moveWidget(updatedWidget.id, {x, y});

      setGridState({
          draggedWidget: null,
          preview: null,
      });
    }, 

  });

  const onDragStart = useCallback((widget: Widget) => {
    setGridState(prev => ({
      ...prev,
      draggedWidget: widget,
      preview: widget as GridItem
    }));
  }, []);

  const commitLayout = useCallback(() => {
    setGridState(prev => ({
      draggedWidget: null,
      preview: null,
    }));
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
    >
      {layout.map(widget => (
        <div 
          key={widget.id}
          style={{
            gridColumnStart: widget.x + 1,
            gridRowStart: widget.y + 1,
            gridColumnEnd: widget.x + widget.w + 1,
            gridRowEnd: widget.y + widget.h + 1,
            opacity: gridState.draggedWidget?.id === widget.id ? 0.5 : 1
          }}
        >
          <WidgetComponent 
            widget={widget}
            onDragStart={() => onDragStart(widget)}
            onDragCommit={commitLayout}
          />
        </div>
      ))}
      {gridState.preview && gridState.draggedWidget && (
        <div 
          style={{
            width: "100%",
            height: "100%",
            position: 'relative',
            gridColumnStart: gridState.preview.x + 1,
            gridRowStart: gridState.preview.y + 1,
            gridColumnEnd: gridState.preview.x + gridState.preview.w + 1,
            gridRowEnd: gridState.preview.y + gridState.preview.h + 1,
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