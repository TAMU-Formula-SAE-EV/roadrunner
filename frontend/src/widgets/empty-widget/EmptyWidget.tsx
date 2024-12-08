import { FormProps, WIDGET_TYPE, WidgetConfig, WidgetProps, WidgetType } from "../types";
import WidgetWrapper from "../utils/WidgetWrapper";


export interface EmptyWidgetConfig extends WidgetConfig {}

interface EmptyWidgetProps extends WidgetProps {
    config: EmptyWidgetConfig;
}

const EmptyWidget: WidgetType<EmptyWidgetProps, FormProps<EmptyWidgetConfig>, EmptyWidgetConfig> = ({ i, config, }) => {
    return <WidgetWrapper i={i} config={config} Form={EmptyWidget.Form}>Empty Widget!</WidgetWrapper>;
}; 

const EmptyWidgetForm: React.FC<FormProps<EmptyWidgetConfig>> = ({}) => {
    return <>Empty form!</>
}
EmptyWidget.Form = EmptyWidgetForm;

EmptyWidget.defaultConfig = {
    title: "empty widget!", 
    w: 2, 
    h: 2, 
    availableHandles: ['n', 's', 'e', 'w'], 
    type: WIDGET_TYPE.EMPTY
}

export default EmptyWidget;