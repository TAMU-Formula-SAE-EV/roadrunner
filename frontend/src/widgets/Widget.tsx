import { useDrag } from "react-dnd";
import { WidgetConfig, Widget as Widget_t } from "./types";
import { getWidgetComponent } from "./utils/getWidgetComponent";

interface WidgetProps {
    widget: Widget_t;
}

export const Widget: React.FC<WidgetProps> = ({widget}) => {

    const [, drag] = useDrag({
        type: 'WIDGET', 
        item: {id: widget.id}
    });

    return (
        <div
          ref={drag} 
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
        >
          {getWidgetComponent(widget.config, widget.id)}
        </div>
      );
};
