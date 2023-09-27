import styles from "./index.module.css";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import { useNavigate } from "react-router";

function AdminDashboard() {
  const { data: groupList, isLoading: groupLoading } = useGetAllGroups();
  const { data: userList, isLoading: userLoading } = useGetAllUsers();
  const navigate = useNavigate();

  if (userLoading || groupLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.maindiv}>
      <div>
        <div className="container">
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt}>Overview</h1>
          </div>
          <div className={styles.gridcontainer}>
            <div
              onClick={() => navigate("/admin/group")}
              className={`${styles.griditem} ${styles.item}`}
            >
              <h1>{groupList.length}</h1>
              <h5>Total Groups</h5>
            </div>
            <div
              onClick={() => navigate("/admin/user")}
              className={`${styles.griditem} ${styles.item}`}
            >
              <h1>{userList.length}</h1>
              <h5>Total Users</h5>
            </div>
            <div
              onClick={() => navigate("/admin/group")}
              className={`${styles.griditem} ${styles.item}`}
            >
              <h1>{groupList.filter((e) => e.status == 1).length}</h1>
              <h5>Active Groups</h5>
            </div>
          </div>
        </div>
        <div className="container">
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt} style={{ marginTop: "10px" }}>
              Groups
            </h1>
          </div>
          {groupList.length > 0 ? (
            <div className={styles.groupcards}>
              {groupList
                .filter((e) => e.status == 1)
                .map((e, i) => {
                  return (
                    <>
                      <div
                        key={i}
                        className={`${styles.groupcard} ${styles.item}`}
                      >
                        <div className={styles.headergroup}>
                          <h5
                            style={{
                              textTransform: "capitalize",
                              textAlign: "center",
                            }}
                          >
                            {e.name}
                          </h5>
                        </div>
                        <div className={styles.groupcontent}>
                          <div
                            className={styles.manager}
                            style={{ marginBottom: "10px" }}
                          >
                            <h5>Group Manager</h5>
                            <h5>{e.managedBy.name}</h5>
                          </div>
                          <div className={styles.tickets}>
                            <h5 style={{ textAlign: "center" }}>Tickets</h5>
                            <div className={styles.manager}>
                              <h5>Total Tickets</h5>
                              <h5>{e.totalTicket}</h5>
                            </div>
                            <div className={styles.manager}>
                              <h5>Open Tickets</h5>
                              <h5>{e.openTicket + e.inProgressTicket}</h5>
                            </div>
                            <div className={styles.manager}>
                              <h5>Completed </h5>
                              <h5>{e.completedTicket}</h5>
                            </div>
                            <div className={styles.manager}>
                              <h5>Rejected </h5>
                              <h5>{e.rejectedTicket}</h5>
                            </div>
                          </div>
                          <div className={styles.userNamediv}>
                            <h5>Group Members</h5>
                            <h4>
                              {e.users.map((data) => data.fullName).join(",")}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          ) : (
            <div className={styles.nogroup}>
              <h4>No Groups Find!</h4>
              <h4>Hurry Up... Go and Create The Group</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
