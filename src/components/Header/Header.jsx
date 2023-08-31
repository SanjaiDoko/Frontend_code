import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
// import { useLogoutUser, useProfileData } from "../../hooks/userAuthManagement";
// import { convertFirstLettersAsUpperCase } from "../../helper";
import logo from "../../assets/Images/AllMastersHeaderLogo.png";
// import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";

function Header() {
  const { mutate } = useLogoutUser();
  const role = useSelector((state) => state.profile.role);

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

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container className="container">
        <Link to="/home" className="brandlogo">
          <img src={logo} className="headerlogo" alt="" />
          AllMasters
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
                Dashboard
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
              <NavDropdown.Item className="linktag" onClick={() => mutate()}>
                Logout
              </NavDropdown.Item>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
