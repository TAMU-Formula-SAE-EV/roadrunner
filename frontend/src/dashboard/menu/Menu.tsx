import { useState } from "react";
import { MENU_STATE, MENU_STATE_MAP, MenuContents, MenuEntry } from "./types";
import renderMenuEntry from "./utils/renderMenuEntry";
import { WidgetConfig } from "../../widgets/types";


interface MenuProps {
    state: MENU_STATE;
    setMenuState: (state: MENU_STATE) => void;
    handleWidgetSpawn: (widgetPreset: WidgetConfig) => void;  
}

const Menu: React.FC<MenuProps> = ({state, setMenuState, handleWidgetSpawn}) => {

    const menuContents: MenuContents<any> = MENU_STATE_MAP[state];

    return (
        <div className="menu-container">
            {menuContents.contents.map((entry: MenuEntry<any>, index) => 
                <div key={index}>
                    {renderMenuEntry(entry, setMenuState, handleWidgetSpawn)}
                </div>
            )}
        </div>
    );
}


export default Menu;