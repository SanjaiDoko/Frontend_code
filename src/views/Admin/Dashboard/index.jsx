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
              
              <h1>{groupList.filter((e) => e.status === 1).length}</h1>
              <h5>Active Groups</h5>
            </div>
          </div>
        </div>
        <div className="container">
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt}>Groups</h1>
          </div>
          <div className={styles.groupcards}>
            <div className={`${styles.groupcard} ${styles.item}`}>
              <div className={styles.headergroup}>
                <h5>Teams</h5>
              </div>
              <div className={styles.groupcontent}>
                <h5>Manager By : ABC</h5>
                <h5>Users : ABC</h5>
              </div>
            </div>
            <div className={`${styles.groupcard} ${styles.item}`}>
              <div className={styles.headergroup}>
                <h5>Teams</h5>
              </div>
              <div className={styles.groupcontent}>
                <h5>Manager By : ABC</h5>
                <h5>Users : ABC</h5>
              </div>
            </div>
            <div className={`${styles.groupcard} ${styles.item}`}>
              <div className={styles.headergroup}>
                <h5>Teams</h5>
              </div>
              <div className={styles.groupcontent}>
                <h5>Manager By : ABC</h5>
                <h5>Users : ABC</h5>
              </div>
            </div>
            <div className={`${styles.groupcard} ${styles.item}`}>
              <div className={styles.headergroup}>
                <h5>Toatl Users</h5>
              </div>
              <div className={styles.groupcontent}>
                <h5>Manager By : ABC</h5>
                <h5>Users : ABC</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
