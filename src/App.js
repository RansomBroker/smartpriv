import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AbsensiForm from "./views/Admin/Absensi/AbsensiForm";
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
import PrestasiForm from "./views/Admin/Prestasi/PrestasiForm";
import PrestasiData from "./views/Admin/Prestasi/PrestasiData";
import GuruProfile from "./views/Admin/Guru/GuruProfile";
import { GuruLayout } from "./views/Guru/GuruLayout";

function App() {
  const level = localStorage.getItem("level");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/office" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dashboard/guru" element={<GuruDashboard />} />
          <Route path="prestasi_siswa/add" element={<PrestasiForm />} />
          <Route path="prestasi_siswa" element={<PrestasiData />} />
          <Route path="guru/add" element={<GuruForm />} />
          <Route path="guru" element={<GuruData />} />
          <Route path="siswa/add" element={<SiswaForm />} />
          <Route path="siswa" element={<SiswaData />} />
          <Route path="absensi" element={<AbsensiForm />} />
          <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
          <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
          <Route path="soal_ujian" element={<SoalUjian />} />
        </Route>
        <Route path="/guru" element={<GuruLayout />}>
          <Route path="dashboard" element={<GuruDashboard />} />
          <Route path="prestasi_siswa/add" element={<PrestasiForm />} />
          <Route path="prestasi_siswa" element={<PrestasiData />} />
          <Route path="guru/add" element={<GuruForm />} />
          <Route path="guru" element={<GuruProfile />} />
          <Route path="siswa/add" element={<SiswaForm />} />
          <Route path="siswa" element={<SiswaData />} />
          <Route path="absensi" element={<AbsensiForm />} />
          <Route path="soal_ujian/:kelas/add" element={<SoalUjianForm />} />
          <Route path="soal_ujian/:kelas" element={<SoalUjianData />} />
          <Route path="soal_ujian" element={<SoalUjian />} />
        </Route>
        <Route path="/siswa" element={<SiswaLayout />}>
          <Route path="dashboard" element={<SiswaDashboard />} />
          <Route path="absensi" element={<AbsensiRekapSiswa />} />
          <Route path="soal_ujian/:kelas" element={<SoalUjianDataSiswa />} />
          <Route path="soal_ujian" element={<SoalUjianSiswa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
