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
      <div className={styles.subDiv}>
        <h3 style={{ marginTop: "1em" }}>Received Ticket </h3>
        <button onClick={() => setPopup(true)} className={styles.addTicketBtn}>
          Add Ticket
        </button>
      </div>
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
