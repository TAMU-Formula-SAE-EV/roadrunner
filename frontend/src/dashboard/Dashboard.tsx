import { useEffect, useState } from "react";
import NavBar from "./navbar/NavBar";
import "./styles.css";
import Grid from "../grid/Grid";
import Menu from "./menu/Menu";
import { MENU_STATE } from "./menu/types";

const ANIMATION_DURATION = 300;

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [inMenu, setInMenu] = useState<boolean>(false);
  const [backgroundBlur, setBackgroundBlur] = useState<boolean>(false);
  const [menuState, setMenuState] = useState<MENU_STATE>(MENU_STATE.DEFAULT);

  // close the menu after animation, allowing time for state reset
  useEffect(() => {
    if (!inMenu) {
      const timeout = setTimeout(() => {
        setMenuState(MENU_STATE.DEFAULT);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [inMenu]);

  return (
    <div className={"dashboard-container " + (inMenu ? "in-menu " : "") + (backgroundBlur ? "background-blur" : "")}>
        {
            <Menu state={menuState} setMenuState={setMenuState} onWidgetSpawn={() => setInMenu(false)} />
        }
      <div className="dashboard-contents" onClick={() => (inMenu ? setInMenu(false) : null)}>
        <Grid setBackgroundBlur={setBackgroundBlur} />
        <NavBar changeMenuState={() => setInMenu(true)} />
      </div>
    </div>
  );
};

export default Dashboard;
