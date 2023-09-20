import styles from "./index.module.css";
import { GiTicket } from "react-icons/gi";
import { PiOfficeChairBold } from "react-icons/pi";
import { MdWorkHistory } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { HiNewspaper } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import MenuHeader from "../../../components/MenuHeader";
import { useSelector } from "react-redux";

function LandingPage() {
  const navigate = useNavigate();
  const role = useSelector((state) => state.profile.role);
  return (
    <div>
      <MenuHeader />
      <div className="container">
        <div className={styles.maindiv}>
          <div className={styles.cardwrap}>
            <div className={`${styles.cardheader} ${styles.one}`}>
              <FaHandshake className={styles.icons} />
            </div>
            <div className={styles.cardcontent}>
              <h1 className={styles.cardtitle}>Sales</h1>
              <p className={styles.cardtext}>
                A successful sales team is not a group of individuals; it{"'"}s
                a well-coordinated orchestra playing to the tune of customer
                satisfaction.
              </p>
              <button className={`${styles.cardbtn} ${styles.one}`}>
                Click
              </button>
            </div>
          </div>
          <div className={styles.cardwrap}>
            <div className={`${styles.cardheader} ${styles.two}`}>
              <GiTicket className={styles.icons} />
            </div>
            <div className={styles.cardcontent}>
              <h1 className={styles.cardtitle}>Ticket</h1>
              <p className={styles.cardtext}>
                Issuing a ticket at the right price is like opening a door to an
                unforgettable experience, ensuring both customers and organizers
                find value.
              </p>
              <button
                onClick={() => navigate("/user/mytickets")}
                className={`${styles.cardbtn} ${styles.two}`}
              >
                Click
              </button>
            </div>
          </div>
          <div className={styles.cardwrap}>
            <div className={`${styles.cardheader} ${styles.three}`}>
              <PiOfficeChairBold className={styles.icons} />
            </div>
            <div className={styles.cardcontent}>
              <h1 className={styles.cardtitle}>Room</h1>
              <p className={styles.cardtext}>
                A conference room is more than just four walls; it{"'"}s where
                ideas are born, decisions are made, and visions take shape.
              </p>
              <button
                onClick={() => navigate("/user/rooms")}
                className={`${styles.cardbtn} ${styles.three}`}
              >
                Click
              </button>
            </div>
          </div>
          <div className={styles.cardwrap}>
            <div className={`${styles.cardheader} ${styles.four}`}>
              <MdWorkHistory className={styles.icons} />
            </div>
            <div className={styles.cardcontent}>
              <h1 className={styles.cardtitle}>EOD</h1>
              <p className={styles.cardtext}>
                As the day gently folds into night, let your heart be lightened
                by the knowledge that tomorrow is a new canvas awaiting your
                masterpiece.
              </p>
              <button
                onClick={() => {
                  role === 3
                    ? navigate("/user/managereodview")
                    : navigate("/user/eodlist");
                }}
                className={`${styles.cardbtn} ${styles.four}`}
              >
                Click
              </button>
            </div>
          </div>
          <div className={styles.cardwrap}>
            <div className={`${styles.cardheader} ${styles.five}`}>
              <HiNewspaper className={styles.icons} />
            </div>
            <div className={styles.cardcontent}>
              <h1 className={styles.cardtitle}>Requirement</h1>
              <p className={styles.cardtext}>
                Innovation thrives in the face of new requirements; it{"'"}s
                where creativity shines.
              </p>
              <button className={`${styles.cardbtn} ${styles.five}`}>
                Click
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerdiv}>
        <div className="container">
          <h4 className={styles.footertxt}>
            2023 © TicketLy, All Rights Reserved
          </h4>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
