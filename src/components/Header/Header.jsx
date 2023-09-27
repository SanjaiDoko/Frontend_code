import "./index.css";
import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiShutDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Mainlogo from "../../assets/Images/mainlogo.png";
import { useSelector } from "react-redux";
import { useLogoutUser } from "../../hooks/logout";
import { useGetUserDetailsById } from "../../hooks/userManagement";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

function Header() {
  const type = useSelector((state) => state.profile.type);
  const { mutate } = useLogoutUser(type);
  const role = useSelector((state) => state.profile.role);
  const userId = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  // const { data, isLoading } = useGetUserDetailsById(userId, type);
  const site = 2;


  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container className="container">
        <Link to="/user/dashboard" className="brandlogo">
          <img src={Mainlogo} className="headerlogo" alt="" />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          <GiHamburgerMenu />
        </Navbar.Toggle>
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          {site === 1 ? (
            <Nav>
                {role !== 2 && (
                <Link className="linktag" to="/menu">
                  Menu
                </Link>
              )}
              {role === 1 && (
                <Link className="linktag" to="/user/eodlist">
                  Add
                </Link>
              )}
              {role === 1 && (
                <Link className="linktag" to="/user/dashboard">
                  Received Ticket
                </Link>
              )}
              {role === 3 && (
                <Link className="linktag" to={"/user/managereodview"}>
                  EOD
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
              {role === 2 && (
                <Link className="linktag" to={"/admin/room"}>
                  Room
                </Link>
              )}
              <Nav.Item className="linktag">
                {(role === 1 || role === 3) && (
                  <NavDropdown title="Room" id="basic-nav-dropdown">
                    <NavDropdown.Item
                      className="dropdownlink"
                      onClick={() => {
                        navigate("/user/rooms");
                      }}
                    >
                      Room Book
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      className="dropdownlink"
                      onClick={() => {
                        navigate("/user/myroombookings");
                      }}
                    >
                      My Bookings
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav.Item>

              {/* <Nav.Item className="d-flex gap-2">
                <div className="hellotextdiv">
                  <span className="linktags">Hello</span>
                  <span
                    className="linktags"
                    style={{ textTransform: "capitalize" }}
                  >
                    {data && data.fullName}
                  </span>
                </div>
              </Nav.Item> */}

              <button className="logoutbtn" onClick={() =>{window.location.replace("/login");localStorage.clear()} }>
                <RiShutDownLine
                  style={{
                    color: "#ffff",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              </button>
            </Nav>
          ) : (
            <Nav>
              {(role === 1 || role === 3) && (
                <Link className="linktag" to="/user/mydemocall">
                  My Demo Calls
                </Link>
              )}
              {role === 1 && (
                <Link className="linktag" to="/user/assginedsalescall">
                  My Sales Calls
                </Link>
              )}
              {role === 1 && (
                <Link className="linktag" to="/user/democall">
                  Assigned Demo Calls
                </Link>
              )}
              {role === 3 && (
                <Link className="linktag" to={"/user/company"}>
                  Companies
                </Link>
              )}
              {role === 3 && (
                <Link className="linktag" to="/user/employee">
                  Employees
                </Link>
              )}
              {role === 3 && (
                <Link className="linktag" to="/user/salescall">
                  Sales Call
                </Link>
              )}
              {role === 3 && (
                <Link className="linktag" to="/user/managerdemo">
                  Demo Call
                </Link>
              )}
              
              <button className="logoutbtn" onClick={() =>{window.location.replace("/login") ; localStorage.clear()}}>
                <RiShutDownLine
                  style={{
                    color: "#ffff",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              </button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
