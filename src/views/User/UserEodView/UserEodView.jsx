import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import { useGetEodDetailsById } from "../../../hooks/eodHooks";
import Loader from "../../../components/Loader/Loader";
import moment from "moment/moment";

const UserEodView = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetEodDetailsById(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className={styles.mainDiv}>
        <h3>EOD Details</h3>
        <div className={styles.eodList}>
          <div className={styles.eoddatdiv}>
            <span style={{ fontWeight: "bold" }}>Date :{"  "}</span>
            <span>{moment(data[0]?.eodDate).format("DD-MM-YYYY")}</span>
          </div>
          <div>
            <div>
              <table className={styles.table}>
                <tr>
                  <th className={styles.col1}>S.No</th>
                  <th className={styles.col2}>Task Description</th>
                  <th className={styles.col3}>Hours</th>
                </tr>
                {data && data[0].eodSummary.map((e, index) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <tr>
                      <td className={styles.col1}>{index + 1}</td>
                      <td className={styles.col2}>{e.taskDescription}</td>
                      <td className={styles.col3}>{e.hours} Hrs</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEodView;
