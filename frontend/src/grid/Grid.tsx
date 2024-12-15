import React, { useState } from 'react';
import { Widget as WidgetComponent } from '../widgets/Widget';
import { GRID_COLUMNS, GRID_ROWS, GridState } from "./consts";
import "./styles.css";
import { useWidgetLayout } from './GridContext';
import useDropRef from './hooks/useDropRef';
import useResizeRef from './hooks/useResizeRef';

interface GridProps {
  setBackgroundBlur: (blur: boolean) => void;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur}) => {
  
  //accesses global widget layout state
  //hidden from the user during drag/resize operations
  const {layout} = useWidgetLayout();

  //overrides actual layout state visual during drag/resize operations
  const [tempGridState, setTempGridState] = useState<GridState | null>(null);

  //used to show/hide edit and resize buttons when a particular
  //widget is clicked
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);

  //get references to handle resize/drag operations
  const resizeRef = useResizeRef(tempGridState, setTempGridState);
  const dropRef = useDropRef(tempGridState, setTempGridState);

  return (
    <div 
      ref={(node) => {
        resizeRef(node);
        dropRef(node);
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