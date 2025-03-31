import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Image, Container, Row, Col, Card } from "react-bootstrap";
import Navbar from "../../components/Navbar";

export function AdminLayout() {
  const [NavList] = useState([
    {
      to: "/office/dashboard",
      image: "/assets/images/dashboard.png",
      text: "Dashboard",
    },
    { to: "/office/guru", image: "/assets/images/guru_.png", text: "Guru" },
    { to: "/office/siswa", image: "/assets/images/siswa_.png", text: "Siswa" },
    {
      to: "/office/absensi",
      image: "/assets/images/absensi.png",
      text: "Absensi",
    },
    {
      to: "/office/soal_ujian",
      image: "/assets/images/ujian.png",
      text: "Soal Ujian",
    },
    {
      to: "/office/prestasi_siswa",
      image: "/assets/images/prestasi.png",
      text: "Prestasi Siswa",
    },
  ]);

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="bg-white p-4 min-vh-100">
          <div className="d-flex align-items-center mb-4">
            <Image src={`/assets/images/smart_private.png`} fluid />
          </div>
          <nav>
            <ul className="nav flex-column">
              {NavList.map((nav, index) => (
                <li key={index} className="nav-item mb-3">
                  <NavLink
                    to={nav.to}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <Image
                      src={nav.image}
                      className="me-2"
                      height={20}
                      width={20}
                      alt={nav.text}
                    />
                    {nav.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </Col>

        {/* Main Content */}
        <Col md={9} className="p-4">
          <Navbar />
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
