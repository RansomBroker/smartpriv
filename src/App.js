import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import RapotRekapSiswa from "./views/Siswa/Rapot/RapotRekapSiswa";
import RapotGuru from "./views/Guru/Rapot/RapotGuru";
import RapotForm from "./views/Admin/Rapot/RapotForm";
import RapotData from "./views/Admin/Rapot/RapotData";
import GuruProfile from "./views/Admin/Guru/GuruProfile";
import { GuruLayout } from "./views/Guru/GuruLayout";
import SoalUjianEditForm from "./views/Admin/SoalUjian/SoalUjianEditForm";
//import PenilaianPieChart from "./PenilaianPieChart";

// Protected Route component
function ProtectedRoute({ children, allowedLevels }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading state but don't redirect
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!loading && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user level not allowed, redirect to appropriate dashboard
  if (!loading && allowedLevels && !allowedLevels.includes(user.level)) {
    if (user.level === "siswa") {
      return <Navigate to="/siswa/dashboard" replace />;
    } else if (user.level === "guru") {
      return <Navigate to="/guru/dashboard" replace />;
    } else {
      return <Navigate to="/office/dashboard" replace />;
    }
  }

  return children;
}

// Login Route component
function LoginRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If authenticated, redirect to the saved path or appropriate dashboard
  if (!loading && user) {
    if (from !== "/" && from !== "/login") {
      return <Navigate to={from} replace />;
    }

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
        <Route path="rapot_siswa/add" element={<RapotForm />} />
        <Route path="rapot_siswa" element={<RapotData />} />
        <Route path="guru/add" element={<GuruForm />} />
        <Route path="guru/edit/:id" element={<GuruForm />} />
        <Route path="guru" element={<GuruData />} />
        <Route path="siswa/add" element={<SiswaForm />} />
        <Route path="siswa/edit/:id" element={<SiswaForm />} />
        <Route path="siswa" element={<SiswaData />} />
        <Route path="absensi" element={<AbsensiAdmin />} />
        <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
        <Route
          path="soal_ujian/:kelas/edit/:id"
          element={<SoalUjianEditForm />}
        />
        <Route path="soal_ujian" element={<SoalUjian />} />
        <Route path="rapot_siswa/edit/:id" element={<RapotForm />} />
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
        <Route path="rapot_siswa/add" element={<RapotForm />} />
        <Route path="rapot_siswa/edit/:id" element={<RapotForm />} />
        <Route path="rapot_siswa" element={<RapotData />} />
        <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
        <Route
          path="soal_ujian/:kelas/edit/:id"
          element={<SoalUjianEditForm />}
        />
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
        <Route path="rekap_rapot" element={<RapotRekapSiswa />} />
        <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
        <Route path="soal_ujian" element={<SoalUjian />} />
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
