import { WidgetConfig } from "../../../widgets/types";
import WidgetSpawner from "../../../widgets/utils/WidgetSpawner";
import { MENU_STATE, MenuEntry } from "../types";
import {MenuItem} from "../MenuItem";


const renderMenuEntry = (entry: MenuEntry<any>, setMenuState: (state: MENU_STATE) => void, onWidgetSpawn: () => void): JSX.Element => {
    
    if (entry.redirect !== undefined) {
        const redirect = entry.redirect;
        return (
            <div onClick={() => setMenuState(redirect.onClickState)}>
                <MenuItem title={redirect.label}></MenuItem>
            </div>
        );
    } else if (entry.widget !== undefined) {
        const {config, typeId} = entry.widget;
        return (
            <div>
                <WidgetSpawner config={config} typeId={typeId} onDragStart={onWidgetSpawn}>
                    <MenuItem title={config.title}></MenuItem>
                </WidgetSpawner>
            </div>
        );
    } else {
        return <></>; 
    }
};

export default renderMenuEntry;
