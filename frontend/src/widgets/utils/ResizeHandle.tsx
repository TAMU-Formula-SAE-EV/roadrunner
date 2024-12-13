import { useDrag } from "react-dnd";
import { ResizeHandle as ResizeHandle_t } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowUp, 
    faArrowDown, 
    faArrowLeft, 
    faArrowRight 
} from "@fortawesome/free-solid-svg-icons";

interface ResizeHandleProps {
    id: number;
    handle: ResizeHandle_t;
}

const handleIcons: Record<ResizeHandle_t, { icon: any; rotation?: number }> = {
    n: { icon: faArrowUp },
    s: { icon: faArrowDown },
    e: { icon: faArrowRight },
    w: { icon: faArrowLeft },
    ne: { icon: faArrowUp, rotation: 45 },
    nw: { icon: faArrowUp, rotation: -45 },
    se: { icon: faArrowDown, rotation: -45 },
    sw: { icon: faArrowDown, rotation: 45 },
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ id, handle }) => {
    const [_, drag] = useDrag({
        type: 'RESIZE',
        item: () => ({ id, handle }),
    });

    const { icon, rotation } = handleIcons[handle];

    return (
        <div className="resize-handle" ref={drag}>
            <FontAwesomeIcon icon={icon} transform={{ rotate: rotation }} />
        </div>
    );
};

export default ResizeHandle;
