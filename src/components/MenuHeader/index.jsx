import styles from "./index.module.css";
import { RiShutDownLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";


function MenuHeader() {
    const type = useSelector((state) => state.profile.type);
    const { mutate } = useLogoutUser(type);
  return (
    <div className={styles.maindiv}>
      <div className="container">
        <div className={styles.headercontent}>
          <h1 className={styles.dokotools}>Doko Tools</h1>
          <button className={styles.logoutbtn} onClick={() => mutate()}>
            Log Out
            <RiShutDownLine
              style={{ color: "#000", fontSize: "20px", fontWeight: "bold" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
export default MenuHeader;
