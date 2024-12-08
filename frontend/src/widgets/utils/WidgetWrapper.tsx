import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import { FormProps, WidgetConfig } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTimes } from "@fortawesome/free-solid-svg-icons";

interface WidgetWrapperProps<T extends WidgetConfig> {
    i : number;
    config: T;
    Form: React.FC<FormProps<T>>;
    children?: React.ReactNode;
}

const WidgetWrapper = <ConfigType extends WidgetConfig>({
    i,
    config,
    Form,
    children
}: WidgetWrapperProps<ConfigType>) => {
    const [formActive, setFormActive] = useState<boolean>(false);
    const [configState, setConfigState] = useState<ConfigType>(config);


    //TODO
    const selected = false;


    useEffect(() => {
        console.log('config state', configState);
    }, [configState]);

    const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setFormActive(true);
    };

     const handleSaveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setFormActive(false); 
        //editConfig(i, configState)
     }


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
                <button onClick={() => {/*deleteWidget(i)*/}}>delete</button>
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
