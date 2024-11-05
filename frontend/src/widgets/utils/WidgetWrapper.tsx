import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import { FormProps, WidgetConfig } from "../types";
import { useWidgets } from "../hooks/WidgetContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTimes } from "@fortawesome/free-solid-svg-icons";

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
                <button className="generic-button close-button" onClick={() => setFormActive(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <br />
                <Form config={configState} setConfigState={setConfigState} />
                <br />
                <br />
                <button onClick={handleSaveButtonClick}>Save</button>
                <button onClick={() => deleteWidget(i)}>delete</button>
            </div>
        </>
    );

    return (
        <div className="widget-wrapper-container">
            {selected && (
                <>
                    <button className="generic-button edit-button" onClick={handleEditButtonClick} >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                </>
            )}
            {children}
            {formActive && ReactDOM.createPortal(renderModalWithOverlay(), document.body)}
        </div>
    );
};

export default WidgetWrapper;
