import styles from "./index.module.css";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";

function AdminDashboard() {
  const { data: groupList, isLoading: groupLoading } = useGetAllGroups();
  const { data: userList, isLoading: userLoading } = useGetAllUsers();

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
            <div className={`${styles.griditem} ${styles.item1}`}>
              <h1>{groupList.length}</h1>
              <h5>Total Groups</h5>
            </div>
            <div className={`${styles.griditem} ${styles.item}`}>
              <h1>{userList.length}</h1>
              <h5>Total Users</h5>
            </div>
            <div className={`${styles.griditem} ${styles.item}`}>
              <h1>{groupList.filter((e) => e.status == 1).length}</h1>
              <h5>Active Groups</h5>
            </div>
          </div>
        </div>
        <div className="container">
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt}>Groups</h1>
          </div>
          <div className={styles.groupcards}>
            {groupList.map((e, i) => {
              return (
                <>
                  <div key={i} className={`${styles.groupcard} ${styles.item}`}>
                    <div className={styles.headergroup}>
                      <h5>Group Name: {e.name}</h5>
                    </div>
                    <div className={styles.groupcontent}>
                      <h5>Manager By : {e.managedBy.name}</h5>
                      <div className={styles.userNamediv}>
                        <h5>
                          Users :
                          {e.users.map((data) => {
                            return <p>{data.fullName}</p>;
                          })}
                        </h5>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
