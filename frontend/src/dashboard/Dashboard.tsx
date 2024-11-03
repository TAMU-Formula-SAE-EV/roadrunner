import { useEffect, useRef, useState } from "react";
import NavBar from "./navbar/NavBar";
import "./styles.css";
import Grid from "../grid/Grid";
import Menu from "./menu/Menu";
import { MENU_STATE } from "./menu/types";
import { WidgetConfig } from "../widgets/types";

const ANIMATION_DURATION = 300;

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [inMenu, setInMenu] = useState<boolean>(false);
  const [backgroundBlur, setBackgroundBlur] = useState<boolean>(false);
  const [menuState, setMenuState] = useState<MENU_STATE>(MENU_STATE.DEFAULT);

  const [incomingWidget, setIncomingWidget] = useState<WidgetConfig | null>(null);

  // Close the menu after animation, allowing time for state reset
  useEffect(() => {
    if (!inMenu) {
      const timeout = setTimeout(() => {
        setMenuState(MENU_STATE.DEFAULT);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [inMenu]);

  const handleWidgetSpawn = (widgetPreset: WidgetConfig) => {
    setInMenu(false);
    setIncomingWidget(widgetPreset);
  };

  return (
    <div className={"dashboard-container " + (inMenu ? "in-menu " : "") + (backgroundBlur ? "background-blur" : "")}>
        {
            <Menu state={menuState} setMenuState={setMenuState} handleWidgetSpawn={handleWidgetSpawn} />
        }
      <div className="dashboard-contents" onClick={() => (inMenu ? setInMenu(false) : null)}>
        <Grid incomingWidget={incomingWidget} setBackgroundBlur={setBackgroundBlur} />
        <NavBar changeMenuState={() => setInMenu(true)} />
      </div>
    </div>
  );
};

export default Dashboard;
