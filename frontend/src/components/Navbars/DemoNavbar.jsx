import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, Container } from "reactstrap";

function Header(props) {
  const sidebarToggle = React.useRef();
  const location = useLocation();

  const getBrand = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const matchingRoute = props.routes.find((route) =>
      pathname.startsWith(route.layout + route.path)
    );
    return matchingRoute?.name || "Voting System";
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  return (
    <Navbar color="dark" expand="lg">
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>

        <button
          className="btn btn-dark btn-sm"
          onClick={(e) => {
            props.logout(e);
          }}
        >
          Log out
        </button>
      </Container>
    </Navbar>
  );
}

export default Header;
