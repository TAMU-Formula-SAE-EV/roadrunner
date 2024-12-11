import { createContext, useContext, useEffect, useRef, useState } from "react";
import { GridItem, Widget, WidgetConfig } from "../widgets/types";

interface WidgetLayoutProps {
    children: React.ReactNode;
};

interface WidgetLayoutType {
    layout: Widget[];
    setLayout: (widgets: Widget[]) => void;
    editConfig: (id: number, newConfig: WidgetConfig) => void;
    deleteWidget: (id: number) => void;
    addWidget: (gridItem: GridItem, config: WidgetConfig) => void;
    moveWidget: (id: number, newPosition: {x: number, y: number}) => void;
};

export const WidgetLayoutContext = createContext<WidgetLayoutType>(
    {
        layout: [], 
        setLayout: () => {},
        editConfig: () => {},
        deleteWidget: () => {}, 
        addWidget: () => {}, 
        moveWidget: () => {}
    });

const WidgetLayoutProvider: React.FC<WidgetLayoutProps> = ({children}) => {
    
    const nextWidgetId = useRef<number>(0);
    const [layout, setLayout] = useState<Widget[]>([]);

    useEffect(() => {
        let highestWidgetId = -1;
        layout.forEach((w: Widget) => {
            highestWidgetId = (w.id > highestWidgetId) ? w.id : highestWidgetId; 
        });
        nextWidgetId.current = highestWidgetId + 1;
    }, [layout]);

    const editConfig = <T extends WidgetConfig>(id: number, newConfig: T) => {
        setLayout(layout.map((widget: Widget) => {if (widget.id === id) return {...widget, config: newConfig}; else return widget;}));
    };

    const deleteWidget = (id: number) => {
        setLayout(layout.filter((widget: Widget) => {return widget.id !== id}));
    };

    const addWidget = <T extends WidgetConfig>(gridItem: GridItem, newConfig: T) => {
        const newWidget: Widget = {...gridItem, config: newConfig, id: nextWidgetId.current};
        setLayout([...layout, newWidget]);
    };

    const moveWidget = (id: number, newPosition: {x: number, y: number}) => {
        setLayout(layout.map((widget: Widget) => {if (widget.id === id) return {...widget, ...newPosition}; else return widget;}));
    };

    return <WidgetLayoutContext.Provider value={{layout, setLayout, editConfig, deleteWidget, addWidget, moveWidget}}>{children}</WidgetLayoutContext.Provider>;

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