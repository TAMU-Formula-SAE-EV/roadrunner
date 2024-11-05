import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import { FormProps, WidgetConfig } from "../types";
import { useWidgets } from "../hooks/WidgetContext";

interface WidgetWrapperProps<T extends WidgetConfig> {
    selected: boolean;
    i : string;
    config: T;
    Form: React.FC<FormProps<T>>;
    setGridEnabled: (enabled: boolean) => void;
    children?: React.ReactNode;
}

const WidgetWrapper = <ConfigType extends WidgetConfig>({
    selected,
    i,
    config,
    Form,
    setGridEnabled, 
    children
}: WidgetWrapperProps<ConfigType>) => {
    const [formActive, setFormActive] = useState<boolean>(false);
    const [configState, setConfigState] = useState<ConfigType>(config);

    useEffect(() => {
        if (!formActive) setGridEnabled(true);
    }, [formActive]); 

    useEffect(() => {
        return () => {
            setGridEnabled(true);
        };
    }, []); 

    useEffect(() => {
        console.log('config state', configState);
    }, [configState]);

    const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setGridEnabled(false);
        setFormActive(true);
    };

     const handleSaveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setGridEnabled(true);
        setFormActive(false); 
        editConfig(i, configState)
     }

    const {deleteWidget, editConfig} = useWidgets();

    const renderModalWithOverlay = () => (
        <>
            <div className="fullscreen-overlay"></div>
            <div className="modal-content">
                <button className="close-button" onClick={() => setFormActive(false)}>Close</button>
                <Form config={configState} setConfigState={setConfigState} />
                <button onClick={handleSaveButtonClick}>Save</button>
                <button onClick={() => deleteWidget(i)}>delete</button>
            </div>
        </>
    );

    return (
        <div className="widget-wrapper-container">
            {selected && (
                <>
                    <button onClick={handleEditButtonClick} >edit!</button>
                </>
            )}
            {children}
            {formActive && ReactDOM.createPortal(renderModalWithOverlay(), document.body)}
        </div>
    );
};

export default WidgetWrapper;
