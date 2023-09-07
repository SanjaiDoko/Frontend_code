import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiShutDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Mainlogo from "../../assets/Images/mainlogo.png";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";
import { useGetUserDetailsById } from "../../hooks/userManagement";
import Loader from "../Loader/Loader";

function Header() {
  const type = useSelector((state) => state.profile.type);
  const { mutate } = useLogoutUser(type);
  const role = useSelector((state) => state.profile.role);
  const userId = localStorage.getItem("allMasterId");

  const { data, isLoading } = useGetUserDetailsById(userId, type);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container className="container">
        <Link to="/home" className="brandlogo">
          <img src={Mainlogo} className="headerlogo" alt="" />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          <GiHamburgerMenu />
        </Navbar.Toggle>
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>
            {role === 1 && (
              <Link className="linktag" to="/user/dashboard">
                Received Ticket
              </Link>
            )}
            {role === 3 && (
              <Link className="linktag" to="/user/manageticket">
                Manage Ticket
              </Link>
            )}
            {(role === 1 || role === 3) && (
              <Link className="linktag" to="/user/mytickets">
                My Ticket
              </Link>
            )}
            {role === 3 && (
              <Link className="linktag" to="/user/dashboard">
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

            <Nav.Item className="d-flex gap-2">
              <div className="hellotextdiv">
                <span className="linktag">Hello</span>
                <span className="linktag">{data && data.fullName}</span>
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
