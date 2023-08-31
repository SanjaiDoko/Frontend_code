import styles from "./index.module.css";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import { useState } from "react";
import AddTicket from "./AddTicket";

function Dashboard() {
  const [popup, setPopup] = useState(null);
  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return setPopup(null);
    }
    setPopup(null);
  };

  return (
    <div className={styles.mainDiv}>
      <h1 onClick={() => setPopup(true)}>hello world</h1>
      <RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
        <AddTicket
          onCloseButtonClick={() => setPopup(null)}
          setPopup={setPopup}
        />
      </RightDrawer>
    </div>
  );
}

export default Dashboard;
