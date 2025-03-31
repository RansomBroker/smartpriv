import { Image, Container, Row, Col, Card } from "react-bootstrap";

function Navbar() {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="h4 fw-bold">Dashboard</h2>
      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Search Here"
          className="form-control me-3"
        />
        <i className="fas fa-envelope text-muted me-3"></i>
        <i className="fas fa-bell text-muted me-3"></i>
        <div className="d-flex align-items-center">
          <Image
            src="/assets/images/user.jpg"
            className="rounded-circle me-2"
            height={30}
            width={30}
            alt="User"
          />
          <div>
            <p className="mb-0 fw-bold">Fetty A A</p>
            <p className="mb-0 small text-muted">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
