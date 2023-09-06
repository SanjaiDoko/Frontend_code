import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
// import { useLogoutUser, useProfileData } from "../../hooks/userAuthManagement";
// import { convertFirstLettersAsUpperCase } from "../../helper";
import Mainlogo from "../../assets/Images/mainlogo.png";
// import { CircularProgress } from "@mui/material";
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

  // const { data: userData, isLoading } = useProfileData(id, role);

  // function checkArrayAndReturnName(userData) {
  // 	if (userData != null) {
  // 		return Array.isArray(userData)
  // 			? convertFirstLettersAsUpperCase(userData[0].fullName)
  // 			: convertFirstLettersAsUpperCase(userData.fullName);
  // 	} else {
  // 		return "";
  // 	}
  // }

  if (isLoading) {
    return <Loader />;
  }

  console.log(data, "dddddd");

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
                <NavDropdown>
                  <NavDropdown.Item
                    className="dropdownlink"
                    onClick={() => mutate()}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
