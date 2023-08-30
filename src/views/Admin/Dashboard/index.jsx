import styles from "./index.module.css";

function AdminDashboard() {
  return (
    <div className={styles.maindiv}>
      <div>
        <div className="container">
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt}>Overview</h1>
          </div>
          <div className={styles.gridcontainer}>
            <div className={`${styles.griditem} ${styles.item1}`}>
              <div className={styles.logodiv}>{/* <Tick /> */}</div>
              <h1>11</h1>
              <h5>Total Groups</h5>
            </div>
            <div className={`${styles.griditem} ${styles.item}`}>
              <div className={styles.logodiv}>{/* <Prebookingicon /> */}</div>
              <h1>11</h1>
              <h5>Toatl Users</h5>
            </div>
            <div className={`${styles.griditem} ${styles.item}`}>
              <div className={styles.logodiv}>{/* <Box /> */}</div>
              <h1>11</h1>
              <h5>Active Groups</h5>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.detailsCarddiv}>
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
