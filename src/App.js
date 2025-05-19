import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./libs/auth";
import AbsensiAdmin from "./views/Admin/Absensi/AbsensiAdmin";
import AbsensiGuru from "./views/Guru/Absensi/AbsensiGuru";
import AdminDashboard from "./views/Admin/Dashboard/AdminDashboard";
import GuruDashboard from "./views/Guru/Dashboard/GuruDashboard";
import GuruData from "./views/Admin/Guru/GuruData";
import GuruForm from "./views/Admin/Guru/GuruForm";
import SiswaData from "./views/Admin/Siswa/SiswaData";
import SiswaForm from "./views/Admin/Siswa/SiswaForm";
import SoalUjian from "./views/Admin/SoalUjian/SoalUjian";
import SoalUjianData from "./views/Admin/SoalUjian/SoalUjianData";
import SoalUjianForm from "./views/Admin/SoalUjian/SoalUjianForm";
import { AdminLayout } from "./views/Admin/AdminLayout";
import Homepage from "./views/Homepage";
import Login from "./views/Login";
import { SiswaLayout } from "./views/Siswa/SiswaLayout";
import SiswaDashboard from "./views/Siswa/Dashboard/SiswaDashboard";
import SoalUjianDataSiswa from "./views/Siswa/SoalUjian/SoalUjianDataSiswa";
import SoalUjianSiswa from "./views/Siswa/SoalUjian/SoalUjianSiswa";
import { AbsensiRekapSiswa } from "./views/Siswa/Absensi/AbsensiRekapSiswa";
import { PrestasiRekapSiswa } from "./views/Siswa/Prestasi/PrestasiRekapSiswa";
//import PrestasiRekapSiswa from './views/Siswa/PrestasiRekapSiswa';
import PrestasiForm from "./views/Admin/Prestasi/PrestasiForm";
import PrestasiData from "./views/Admin/Prestasi/PrestasiData";
import GuruProfile from "./views/Admin/Guru/GuruProfile";
import { GuruLayout } from "./views/Guru/GuruLayout";
//import PenilaianPieChart from "./PenilaianPieChart";

// Protected Route component
function ProtectedRoute({ children, allowedLevels }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  // For protected routes, redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedLevels && !allowedLevels.includes(user.level)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Login Route component
function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If already logged in, go to dashboard
  if (user) {
    if (user.level === "siswa") {
      return <Navigate to="/siswa/dashboard" replace />;
    } else if (user.level === "guru") {
      return <Navigate to="/guru/dashboard" replace />;
    } else {
      return <Navigate to="/office/dashboard" replace />;
    }
  }

  return <Login />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginRoute />} />
      
      {/* Protected routes */}
      <Route
        path="/office/*"
        element={
          <ProtectedRoute allowedLevels={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="dashboard/guru" element={<GuruDashboard />} />
        <Route path="prestasi_siswa/add" element={<PrestasiForm />} />
        <Route path="prestasi_siswa" element={<PrestasiData />} />
        <Route path="guru/add" element={<GuruForm />} />
        <Route path="guru/edit/:id" element={<GuruForm />} />
        <Route path="guru" element={<GuruData />} />
        <Route path="siswa/add" element={<SiswaForm />} />
        <Route path="siswa/edit/:id" element={<SiswaForm />} />
        <Route path="siswa" element={<SiswaData />} />
        <Route path="absensi" element={<AbsensiAdmin />} />
        <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
        <Route path="soal_ujian" element={<SoalUjian />} />
        <Route path="prestasi_siswa/edit/:id" element={<PrestasiForm />} />
      </Route>

      <Route
        path="/guru/*"
        element={
          <ProtectedRoute allowedLevels={["guru"]}>
            <GuruLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<GuruDashboard />} />
        <Route path="guru" element={<GuruProfile />} />
        <Route path="siswa/add" element={<SiswaForm />} />
        <Route path="siswa/edit/:id" element={<SiswaForm />} />
        <Route path="siswa" element={<SiswaData />} />
        <Route path="absensi" element={<AbsensiGuru />} />
        <Route path="prestasi_siswa/add" element={<PrestasiForm />} />
        <Route path="prestasi_siswa/edit/:id" element={<PrestasiForm />} />
        <Route path="prestasi_siswa" element={<PrestasiData />} />
        <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
        <Route path="soal_ujian" element={<SoalUjian />} />
      </Route>

      <Route
        path="/siswa/*"
        element={
          <ProtectedRoute allowedLevels={["siswa"]}>
            <SiswaLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SiswaDashboard />} />
        <Route path="absensi" element={<AbsensiRekapSiswa />} />
        <Route path="rekap_prestasi" element={<PrestasiRekapSiswa />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianDataSiswa />} />
        <Route path="soal_ujian" element={<SoalUjianSiswa />} />
      </Route>

      {/* Redirect unknown routes to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
