import { Image, Dropdown } from "react-bootstrap";
import { useAuth } from "../libs/auth";

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 p-4">
      <h2 className="h4 fw-bold"></h2>
      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Search Here"
          className="form-control me-3"
        />
        <i className="fas fa-envelope text-muted me-3"></i>
        <i className="fas fa-bell text-muted me-3"></i>

        {/* Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="d-flex align-items-center border-0 bg-transparent shadow-none"
          >
            <Image
              src="/assets/images/user.jpg"
              className="rounded-circle me-2"
              height={30}
              width={30}
              alt="User"
            />
            <div className="text-start">
              <p className="mb-0 fw-bold">{user?.nama || 'User'}</p>
              <p className="mb-0 small text-muted">{user?.level || 'User'}</p>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar; 