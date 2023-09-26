import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiShutDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Mainlogo from "../../assets/Images/mainlogo.png";
import EodLogo from "../../assets/Images/eodLogo.png";
import RoomLogo from "../../assets/Images/roomLogo.png";
import DokoInt from "../../assets/Images/AdminDokoint.png";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";
import { useGetUserDetailsById } from "../../hooks/userManagement";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const type = useSelector((state) => state.profile.type);
  const menu = useSelector((state) => state.menu.menu);
  const { mutate } = useLogoutUser(type);
  const role = useSelector((state) => state.profile.role);
  const userId = localStorage.getItem("allMasterId");
  const { data, isLoading } = useGetUserDetailsById(userId, type);
  let location = useLocation();
  const [activeStep, setActiveStep] = useState(
    location.pathname.split("/").pop()
  );
  useEffect(() => {
    setActiveStep(location.pathname.split("/").pop());
  }, [location]);

  if (isLoading) {
    return <Loader />;
  }
  function headerNavigation(menu, role) {
    var navigation = "";
    if (menu === 1 && role === 3) {
      navigation = "/ticket/receivedTicket";
    }
    if (menu === 1 && role === 1) {
      navigation = "/ticket/receivedTicket";
    }
    if (menu === 2 && role === 3) {
      navigation = "/room/rooms";
    }
    if (menu === 2 && role === 1) {
      navigation = "/room/rooms";
    }
    if (menu === 3 && role === 1) {
      navigation = "/eod/eodlist";
    }
    if (menu === 3 && role === 3) {
      navigation = "/eod/managereodview";
    }
    if (menu === 0 && role === 2) {
      navigation = "/admin/dashboard";
    }
    return navigation;
  }

  return (
    <Navbar className={`navbar${menu}`} collapseOnSelect expand="lg">
      <Container className="container">
        <Link to={headerNavigation(menu, role)} className="brandlogo">
          {menu === 1 && <img src={Mainlogo} className="headerlogo" alt="" />}
          {menu === 2 && <img src={RoomLogo} className="headerlogo" alt="" />}
          {menu === 3 && <img src={EodLogo} className="headerlogo" alt="" />}
          {menu === 0 && <img src={DokoInt} className="headerlogo" alt="" />}
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          <GiHamburgerMenu />
        </Navbar.Toggle>
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>
            {(role === 1 || role === 3) && (
              <Link className="linktag" to="/menu">
                Menu
              </Link>
            )}
            {role === 1 && menu === 3 && (
              <Link
                className={`linktag ${
                  activeStep === "eodlist" ||
                  activeStep === "eodstatus" ||
                  location.pathname.split("/")[2] === "eodstatus"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to="/eod/eodlist"
              >
                EOD
              </Link>
            )}
            {role === 1 && menu === 1 && (
              <Link
                className={`linktag ${
                  activeStep === "receivedTicket" ||
                  location.pathname.split("/")[2] === "dashboard"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to="/ticket/receivedTicket"
              >
                Received Ticket
              </Link>
            )}
            {role === 3 && menu === 3 && (
              <Link
                className={`linktag ${
                  activeStep === "managereodview"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to={"/eod/managereodview"}
              >
                EOD
              </Link>
            )}
            {role === 3 && menu === 1 && (
              <Link
                className={`linktag ${
                  activeStep === "manageticket" ||
                  location.pathname.split("/")[2] === "updatemanageticket"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to="/ticket/manageticket"
              >
                Manage Ticket
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 1 && (
              <Link
                className={`linktag ${
                  activeStep === "mytickets" || activeStep === "addticket"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to="/ticket/mytickets"
              >
                My Ticket
              </Link>
            )}
            {role === 3 && menu === 1 && (
              <Link
                className={`linktag ${
                  activeStep === "receivedTicket"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to="/ticket/receivedTicket"
              >
                Received Ticket
              </Link>
            )}
            {role === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "dashboard" ? "activeStep" : "inactiveStep"
                }`}
                to={"/admin/dashboard"}
              >
                Dashboard
              </Link>
            )}
            {role === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "user" ? "activeStep" : "inactiveStep"
                }`}
                to={"/admin/user"}
              >
                User
              </Link>
            )}
            {role === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "group" ? "activeStep" : "inactiveStep"
                }`}
                to={"/admin/group"}
              >
                Manage Group
              </Link>
            )}
            {role === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "room" ? "activeStep" : "inactiveStep"
                }`}
                to={"/admin/room"}
              >
                Room
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "rooms" ||
                  location.pathname.split("/")[2] === "roombookingdetails"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to={"/room/rooms"}
              >
                Room Book
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 2 && (
              <Link
                className={`linktag ${
                  activeStep === "myroombookings"
                    ? "activeStep"
                    : "inactiveStep"
                }`}
                to={"/room/myroombookings"}
              >
                My Bookings
              </Link>
            )}

            <Nav.Item className="d-flex gap-2">
              <div className="hellotextdiv">
                <span className="linktags">Hello</span>
                <span
                  className="linktags"
                  style={{ textTransform: "capitalize" }}
                >
                  {data && data.fullName}
                </span>
              </div>
            </Nav.Item>

            <button className="logoutbtn" onClick={() => mutate()}>
              <RiShutDownLine
                style={{ color: "#ffff", fontSize: "20px", fontWeight: "bold" }}
              />
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
