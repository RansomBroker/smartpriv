import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export function AdminLayout() {
  const [navItems] = useState([
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
      to: "/office/rapot_siswa",
      image: "/assets/images/prestasi.png",
      text: "Rapot Siswa",
    },
  ]);

  // Sidebar terbuka secara default
  const [showSidebar, setShowSidebar] = useState(true);
  // Sidebar dalam keadaan expanded secara default
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    console.log(showSidebar, collapsed);
    setShowSidebar(!showSidebar);
  };

  const toggleCollapse = () => {
    console.log(showSidebar, collapsed);
    setCollapsed(!collapsed);
  };

  // Helper untuk mendeteksi perangkat mobile
  const isMobile = () => window.innerWidth < 768;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {showSidebar && (
        <div
          className="bg-white"
          style={{
            width: collapsed ? "70px" : "250px",
            borderRight: "1px solid #ddd",
            transition: "width 0.3s",
          }}
        >
          <Sidebar
            logoSrc="/assets/images/smart_private.png"
            navItems={navItems}
            onLinkClick={() => {
              // Hanya sembunyikan sidebar saat perangkat mobile
              if (isMobile()) {
                setShowSidebar(false);
              }
            }}
            collapsed={collapsed}
          />
          <div className="text-center mb-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleCollapse}
              style={{ padding: "0.25rem 0.5rem" }}
            >
              {collapsed ? ">>" : "<<"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex-grow-1">
        <Navbar />
        <div className="p-4">
          {/* Tombol toggle hanya muncul untuk perangkat mobile */}
          <Button
            variant="primary"
            onClick={toggleSidebar}
            className="mb-3 d-md-none"
          >
            {showSidebar ? "Tutup Sidebar" : "Buka Sidebar"}
          </Button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
