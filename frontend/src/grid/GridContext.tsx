import { createContext, useContext, useEffect, useRef, useState } from "react";
import { GridItem, Widget, WidgetConfig, WidgetType } from "../widgets/types";
import { LAYOUT_STORAGE_KEY } from "../consts";


/*
    Manages global state of widget grid/layout
*/

interface WidgetLayoutProps {
    children: React.ReactNode;
};

interface WidgetLayoutType {
    layout: Widget<any>[];
    setLayout: (widgets: Widget<any>[]) => void;
    editConfig: (id: number, newConfig: WidgetConfig) => void;
    deleteWidget: (id: number) => void;
    addWidget: (gridItem: GridItem, typeId: number, config: WidgetConfig) => void;
    moveWidget: (id: number, newPosition: {x: number, y: number}) => void;
    getNewId: () => number;
};

export const WidgetLayoutContext = createContext<WidgetLayoutType>(
    {
        layout: [], 
        setLayout: () => {},
        editConfig: () => {},
        deleteWidget: () => {}, 
        addWidget: () => {}, 
        moveWidget: () => {}, 
        getNewId: () => -1
    });

const WidgetLayoutProvider: React.FC<WidgetLayoutProps> = ({children}) => {
    
    const nextWidgetId = useRef<number>(1);
    
    //retrieve existing layout from local storage
    const [layout, setLayout] = useState<Widget<any>[]>(() => {
        const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
        return savedLayout ? JSON.parse(savedLayout) : [];
    });

    useEffect(() => {
        //save layout to storage
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
        

        //find next id
        //(Need to constantly load the next id bc we may 
        //load a template with overlapping ids)
        let highestWidgetId = -1;
        layout.forEach((w: Widget<any>) => {
            highestWidgetId = (w.id > highestWidgetId) ? w.id : highestWidgetId; 
        });
        nextWidgetId.current = highestWidgetId + 1;
    }, [layout]);

    const editConfig = <T extends WidgetConfig>(id: number, newConfig: T) => {
        setLayout(layout.map((widget: Widget<any>) => {if (widget.id === id) return {...widget, config: newConfig}; else return widget;}));
    };

    const deleteWidget = (id: number) => {
        setLayout(layout.filter((widget: Widget<any>) => {return widget.id !== id}));
    };

    const addWidget = <T extends WidgetConfig>(gridItem: GridItem, typeId: number, newConfig: T) => {
        const newWidget: Widget<T> = {...gridItem, config: newConfig, id: nextWidgetId.current, typeId};
        setLayout([...layout, newWidget]);
    };

    const moveWidget = (id: number, newPosition: {x: number, y: number}) => {
        setLayout(layout.map((widget: Widget<any>) => {if (widget.id === id) return {...widget, ...newPosition}; else return widget;}));
    };

    const getNewId = () => {
        return nextWidgetId.current++;
    };

    return <WidgetLayoutContext.Provider value={{layout, setLayout, editConfig, deleteWidget, addWidget, moveWidget, getNewId}}>{children}</WidgetLayoutContext.Provider>;

};

export const useWidgetLayout = () => {
    const context = useContext(WidgetLayoutContext);
    if (!context) {
        if (!context) {
            throw new Error("tried to access widget layout without the proper context!!!");
        }
    }

    return context;
}

export default WidgetLayoutProvider;