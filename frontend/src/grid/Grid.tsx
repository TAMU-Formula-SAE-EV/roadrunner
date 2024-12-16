import React, { useState } from 'react';
import { Widget as WidgetComponent } from '../widgets/Widget';
import { GRID_COLUMNS, GRID_ROWS, GridOperation } from "./consts";
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
  const [gridOperation, setGridOperation] = useState<GridOperation | null>(null);

  //used to show/hide edit and resize buttons when a particular
  //widget is clicked
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);

  //get references to handle resize/drag operations
  const resizeRef = useResizeRef(gridOperation, setGridOperation);
  const dropRef = useDropRef(gridOperation, setGridOperation);

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

      {/* render global widget layout if not currently doing a grid operation*/}
      {!gridOperation &&
        layout.map(widget => (
          <div 
            key={widget.id}
            style={{
              gridColumnStart: widget.x + 1,
              gridRowStart: widget.y + 1,
              gridColumnEnd: widget.x + widget.w + 1,
              gridRowEnd: widget.y + widget.h + 1,
            }}
            onClick={() => setSelectedWidgetId(widget.id)}
          >
            <WidgetComponent 
              widget={widget}
              selected={selectedWidgetId === widget.id}
            />
          </div>
      ))}

      {/* if in the middle of a drag/resize operation, display temp widget locations
      instead of what's in the global state */}
      {gridOperation?.layout.map(widget => (
          <div 
          key={widget.id}
          style={{
            gridColumnStart: widget.x + 1,
            gridRowStart: widget.y + 1,
            gridColumnEnd: widget.x + widget.w + 1,
            gridRowEnd: widget.y + widget.h + 1,
          }}
        >
          <WidgetComponent 
            widget={widget}
            selected={false}
          />
        </div>
      ))}

      {/* render the drop/resize preview location*/}
      {gridOperation?.preview && (
        <div 
          style={{
            width: "100%",
            height: "100%",
            position: 'relative',
            gridColumnStart: gridOperation.preview.x + 1,
            gridRowStart: gridOperation.preview.y + 1,
            gridColumnEnd: gridOperation.preview.x + gridOperation.preview.w + 1,
            gridRowEnd: gridOperation.preview.y + gridOperation.preview.h + 1,
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            border: '2px dashed blue',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}

      {/*Can't unmount a widget during an operation! Otherwise the dragged item
      will cease to exist!!! So we are sneaky (make it invisible) */}
      {gridOperation?.widget && (
          <div 
          key={gridOperation.widget.id}
          style={{
            gridColumnStart: 1,
            gridRowStart: 1,
            gridColumnEnd: 2,
            gridRowEnd: 2,
            opacity: 0
          }}
        >
          <WidgetComponent 
            widget={gridOperation.widget}
            selected={false}
          />
        </div>
      )}
    </div>
  );
};

export default Grid;