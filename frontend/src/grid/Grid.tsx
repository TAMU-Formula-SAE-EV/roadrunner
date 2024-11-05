import GridLayout, { Layout } from "react-grid-layout";
import { useEffect, useRef, useState } from "react";
import { Widget, WidgetConfig } from "../widgets/types";
import "./styles.css";
import "react-grid-layout/css/styles.css";
import { DEBUG } from "../utils/debug";
import { getWidgetComponent } from "../widgets/utils/getWidgetComponent";
import { useWidgets } from "../widgets/hooks/WidgetContext";
import BasicDisplay from "../widgets/basic-display/BasicDisplay";

interface GridProps {
  setBackgroundBlur: (state: boolean) => void;
  incomingWidget: WidgetConfig | null;
}

const Grid: React.FC<GridProps> = ({setBackgroundBlur, incomingWidget}) => {
  const {widgets, setWidgets, addWidget, deleteWidget} = useWidgets();
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const widgetID = useRef<number>(0);
  
  const [gridWidth, setGridWidth] = useState<number>(0);
  const [enabled, setEnabled] = useState<boolean>(true);
  const gridContainerRef = useRef<HTMLDivElement>(null);


  //updates grid width based on container
  useEffect(() => {
    if (gridContainerRef.current) {
      const updateGridWidth = () => {
        if (gridContainerRef.current) {
          setGridWidth(gridContainerRef.current.offsetWidth);
        }
      };
      updateGridWidth();
      const resizeObserver = new ResizeObserver(() => {
        updateGridWidth();
      });

      resizeObserver.observe(gridContainerRef.current);
      return () => {
        if (gridContainerRef.current) {
          resizeObserver.unobserve(gridContainerRef.current);
        }
      };
    }
  }, []);

  const handleDrop = (widget: Widget) => {
    const droppedWidget = {
      ...widget,
      w: incomingWidget ? incomingWidget.h : 1,
      h: incomingWidget ? incomingWidget.w : 1, 
      config: incomingWidget || BasicDisplay.defaultConfig,
      i: String(widgetID.current), 
      resizeHandles: []
    };
    widgetID.current += 1;
    addWidget(droppedWidget);
  };

  const handleSelectedWidgetChange = (newSelectedWidget: Widget | null ): void => {

    console.log("handle selected widget called");

    if (newSelectedWidget !== null) {

      const updatedWidget: Widget = {
        ...newSelectedWidget,
        resizeHandles: newSelectedWidget.config.availableHandles,
        isResizable: true
      }
  
      const temp = widgets.map((w) => {
        if (w === newSelectedWidget) return updatedWidget;
        else return {...w, resizeHandles: [], isResizable: false}
      });
  
      setWidgets(temp);

    } else {
      const temp = widgets.map((w) => {
        return {...w, resizeHandles: [], isResizable: false}
      });
  
      setWidgets(temp);
    }

    setSelectedWidget(newSelectedWidget); 
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.i);
      return layoutItem
        ? { ...widget, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h }
        : widget;
    });

    setWidgets(updatedWidgets);
  };


  var layout: Widget[] = widgets;
  if (!enabled) layout = layout.map((w) => {return {...w, isDraggable: false}});

  console.log("widgets: ", widgets);
  console.log("selected Widget", selectedWidget);

  return (
    <div ref={gridContainerRef} className={"grid-container " + (DEBUG ? "debug " : "")}>
      {gridWidth > 0 && (
        <GridLayout
          className="layout"
          layout={layout}
          cols={16}
          rowHeight={gridWidth / 16 - 10}
          width={gridWidth} 
          isDraggable={enabled}
          isResizable={enabled}
          isDroppable={enabled}
          onLayoutChange={handleLayoutChange}
          compactType={null}
          isBounded={true}
          onDrag={() => setBackgroundBlur(true)}
          onDragStop={() => {setBackgroundBlur(false); setSelectedWidget(null)}}
          onResizeStart={() => setBackgroundBlur(true)}
          onResizeStop={() => setBackgroundBlur(false)}
          onDrop={(_, widget: Widget) => {setBackgroundBlur(false); handleDrop(widget);}}
          style={{ width: "100%", height: "100%" }}
          
        >
          {widgets.map((widget) => (
            <div key={widget.i} onClick={() => { handleSelectedWidgetChange(widget); setBackgroundBlur(false); }}>
              {getWidgetComponent(widget.config, widget.i, widget.i === selectedWidget?.i, setEnabled)}
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
};

export default Grid;
