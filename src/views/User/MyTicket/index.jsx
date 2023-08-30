import styles from "./index.module.css";
import Booked from "../../../components/MyTicketCards/index";
import { useGetAllTicketById } from "../../../hooks/ticketHooks";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");
  const { data, isloading } = useGetAllTicketById(id);

  if (isloading) {
    return <p>Loading....</p>;
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.subDiv}>
        <h3 style={{ marginTop: "1em" }}>My Ticket </h3>
      </div>
      <div className={styles.ticketDiv}>
        <Booked data={data} />
      </div>
    </div>
  );
}

export default Dashboard;
