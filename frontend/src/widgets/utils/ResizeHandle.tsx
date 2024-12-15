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

// map each handle to its CSS position
const handlePositions: Record<string, React.CSSProperties> = {
  n: { top: 0, left: "50%", transform: "translate(-50%, -50%)" },
  s: { bottom: 0, left: "50%", transform: "translate(-50%, 50%)" },
  e: { right: 0, top: "50%", transform: "translate(50%, -50%)" },
  w: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  ne: { top: 0, right: 0, transform: "translate(50%, -50%)" },
  nw: { top: 0, left: 0, transform: "translate(-50%, -50%)" },
  se: { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
  sw: { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
};

//map each handle to its icon
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
        <div className="resize-handle" ref={drag} key={handle} style={{position: "absolute", ...handlePositions[handle]}}>
            <FontAwesomeIcon icon={icon} transform={{ rotate: rotation }} />
        </div>
    );
};

export default ResizeHandle;
