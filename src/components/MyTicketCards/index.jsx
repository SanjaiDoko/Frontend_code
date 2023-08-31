/* eslint-disable react/prop-types */
import moment from "moment";
import styles from "./index.module.css";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
// import EditTicket from "./EditTicket/EditTicket";
import { useState } from "react";

function Booked({ data }) {
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

  const editHandle = () => {
    setPopup(true);
  };

  return (
    <div>
      <div>
        <RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
          {/* <EditTicket myTicketData={data} setPopup={setPopup} editId={editId} /> */}
        </RightDrawer>
      </div>
      <div className={styles.myTicketDiv}>
        {data &&
          data.map((e, i) => {
            return (
              <div key={i}>
                <div
                  className={`${styles.detailcon} ${
                    styles.selectedCard + " is-selected"
                  }`}
                >
                  <h5 className={styles.heading}>Ticket Details</h5>
                  <div className={styles.vessel}>
                    <div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Issue Name</h5>
                        <h1 className={styles.vesselval}>{e.issueName}</h1>
                      </div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Type</h5>
                        <h1 className={styles.vesselval}>{e.type}</h1>
                      </div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Start Date</h5>
                        <h1 className={styles.vesselval}>
                          {moment(e.startTime).format("DD-MM-YYYY")}
                        </h1>
                      </div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>End Date</h5>
                        <h1 className={styles.vesselval}>
                          {moment(e.endTime).format("DD-MM-YYYY")}
                        </h1>
                      </div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Actual End Date</h5>
                        <h1 className={styles.vesselval}>
                          {moment(e.actualEndTime).format("DD-MM-YYYY")}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.vessel} border-top border-1 border-black bg-white`}
                  >
                    <div className="bg-white">
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Managed By</h5>
                        <h1 className={styles.vesselval}>{e.managedBy}</h1>
                      </div>

                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Time Log</h5>
                        <h1 className={styles.vesselval}>{e.timeLog}</h1>
                      </div>
                      <div className={styles.costheadingdiv}>
                        <h5 className={styles.vesseltxt}>Created At</h5>
                        <h1 className={styles.vesselval}>
                          {moment(e.createdAt).format("DD-MM-YYYY")}
                        </h1>
                      </div>
                    </div>
                    <div className={styles.booknowdiv}>
                      <div>
                        <button
                          className={styles.booknowbtn}
                          onClick={() => editHandle(e._id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Booked;
