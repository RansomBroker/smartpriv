// Navbar.js
import { useEffect, useState } from "react";
import { Image, Dropdown } from "react-bootstrap";
import { useAuth } from "../libs/auth"; // pastikan path-nya sesuai
import axios from "axios";

const MOODLE_URL = "https://smartprivate.web.id";

function Navbar() {
  const { user, logout } = useAuth();
  const [sesskey, setSesskey] = useState(null);

  // Ambil sesskey setelah login Moodle
  useEffect(() => {
    const fetchSesskey = async () => {
      try {
        const res = await axios.get(`${MOODLE_URL}/my/`, {
          withCredentials: true,
        });

        const html = res.data;
        const match = html.match(/"sesskey":"([^"]+)"/);
        const foundSesskey = match ? match[1] : null;

        if (foundSesskey) {
          setSesskey(foundSesskey);
        } else {
          console.warn("Sesskey tidak ditemukan.");
        }
      } catch (error) {
        console.error("Gagal mengambil sesskey Moodle:", error);
      }
    };

    fetchSesskey();
  }, []);

  const handleLogout = async () => {
    try {
      if (sesskey) {
        await axios.get(`${MOODLE_URL}/login/logout.php?sesskey=${sesskey}`, {
          withCredentials: true,
        });
        console.log("Berhasil logout dari Moodle.");
      } else {
        console.warn("Sesskey belum tersedia. Tidak bisa logout dari Moodle.");
      }
    } catch (error) {
      console.error("Error logging out from Moodle:", error);
    }

    // Logout dari app utama
    await logout();
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 p-4">
      <h2 className="h4 fw-bold">Dashboard</h2>

      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Search Here"
          className="form-control me-3"
        />
        <i className="fas fa-envelope text-muted me-3"></i>
        <i className="fas fa-bell text-muted me-3"></i>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="d-flex align-items-center border-0 bg-transparent shadow-none"
          >
            <Image
              src={user?.foto || "/assets/images/user.jpg"}
              className="rounded-circle me-2"
              height={30}
              width={30}
              alt="User"
            />
            <div className="text-start">
              <p className="mb-0 fw-bold">{user?.name || user?.username}</p>
              <p className="mb-0 small text-muted text-capitalize">
                {user?.level || "Level tidak diketahui"}
              </p>
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
