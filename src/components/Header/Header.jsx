import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiShutDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Mainlogo from "../../assets/Images/mainlogo.png";
import EodLogo from "../../assets/Images/eodLogo.png";
import RoomLogo from "../../assets/Images/roomLogo.png";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";
import { useGetUserDetailsById } from "../../hooks/userManagement";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

function Header() {
  const type = useSelector((state) => state.profile.type);
  const menu = useSelector((state) => state.menu.menu);
  const { mutate } = useLogoutUser(type);
  const role = useSelector((state) => state.profile.role);
  const userId = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  const { data, isLoading } = useGetUserDetailsById(userId, type);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Navbar className={`navbar${menu}`} collapseOnSelect expand="lg">
      <Container className="container">
        <Link to="/ticket/receivedTicket" className="brandlogo">
          {menu === 1 && <img src={Mainlogo} className="headerlogo" alt="" />}
          {menu === 2 && <img src={RoomLogo} className="headerlogo" alt="" />}
          {menu === 3 && <img src={EodLogo} className="headerlogo" alt="" />}
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
              <Link className="linktag" to="/eod/eodlist">
                EOD
              </Link>
            )}
            {role === 1 && menu === 1 && (
              <Link className="linktag" to="/ticket/receivedTicket">
                Received Ticket
              </Link>
            )}
            {role === 3 && menu === 3 && (
              <Link className="linktag" to={"/eod/managereodview"}>
                EOD
              </Link>
            )}
            {role === 3 && menu === 1 && (
              <Link className="linktag" to="/ticket/manageticket">
                Manage Ticket
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 1 && (
              <Link className="linktag" to="/ticket/mytickets">
                My Ticket
              </Link>
            )}
            {role === 3 && menu === 1 && (
              <Link className="linktag" to="/ticket/receivedTicket">
                Received Ticket
              </Link>
            )}
            {role === 2 && (
              <Link className="linktag" to={"/admin/dashboard"}>
                Dashboard
              </Link>
            )}
            {role === 2 && (
              <Link className="linktag" to={"/admin/user"}>
                User
              </Link>
            )}
            {role === 2 && (
              <Link className="linktag" to={"/admin/group"}>
                Manage Group
              </Link>
            )}
            {role === 2 && (
              <Link className="linktag" to={"/admin/room"}>
                Room
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 2 && (
              <Link className="linktag" to={"/room/rooms"}>
                Room Book
              </Link>
            )}
            {(role === 1 || role === 3) && menu === 2 && (
              <Link className="linktag" to={"/room/myroombookings"}>
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
