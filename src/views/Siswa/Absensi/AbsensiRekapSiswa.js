// src/components/siswa/absensi/AbsensiRekapSiswa.jsx

import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../../libs/auth";

// API base URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.smartprivate.web.id"
    : "";

// Helper: get current year and month in YYYY-MM format
const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

// Helper: get number of days in a given month
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export function AbsensiRekapSiswa() {
  const { user: loggedInUser, loading: authLoading } = useAuth();

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentYearMonth());
  const [allMyPresensiData, setAllMyPresensiData] = useState([]);
  const [daysInMonthViewData, setDaysInMonthViewData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    hadir: 0,
    izin: 0,
    sakit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch presensi data for logged-in user
  useEffect(() => {
    if (loggedInUser?.id) {
      setIsLoading(true);
      axios
        .get(`${API_BASE_URL}/api/presensi`)
        .then((response) => {
          const myData = response.data.filter(
            (p) => p.userId === loggedInUser.id
          );
          setAllMyPresensiData(myData);
        })
        .catch((error) => {
          console.error("Error fetching presensi:", error);
          setAllMyPresensiData([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [loggedInUser]);

  // Process view data and summary whenever month or data changes
  useEffect(() => {
    if (!selectedMonthYear || !allMyPresensiData) return;

    const [year, month] = selectedMonthYear.split("-").map(Number);
    const numDays = getDaysInMonth(year, month);

    const newDaysView = [];
    let hadir = 0,
      izin = 0,
      sakit = 0;

    for (let day = 1; day <= numDays; day++) {
      const entry = {
        dayOfMonth: day,
        h: false,
        i: false,
        s: false,
        absent_by: null,
      };

      const record = allMyPresensiData.find((p) => {
        const d = new Date(p.absensiDate);
        return d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
      });

      if (record) {
        if (record.status === "H") entry.h = true;
        if (record.status === "I") entry.i = true;
        if (record.status === "S") entry.s = true;
        entry.absent_by = record.absent_by?.name || "N/A";
      }

      newDaysView.push(entry);
    }

    const recordsThisMonth = allMyPresensiData.filter((p) => {
      const d = new Date(p.absensiDate);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    hadir = recordsThisMonth.filter((p) => p.status === "H").length;
    izin = recordsThisMonth.filter((p) => p.status === "I").length;
    sakit = recordsThisMonth.filter((p) => p.status === "S").length;

    setDaysInMonthViewData(newDaysView);
    setMonthlySummary({ hadir, izin, sakit });
  }, [allMyPresensiData, selectedMonthYear]);

  if (authLoading || isLoading) {
    return (
      <div className="p-4 d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        Loading absensi data...
      </div>
    );
  }

  if (!loggedInUser?.id) {
    return (
      <div className="p-4">
        <p>User tidak terautentikasi. Silakan login kembali.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Pilih Bulan Rekap</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <h3 className="fw-bolder mb-3">
        Absensi Saya -{" "}
        {new Date(selectedMonthYear + "-01").toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      <Row>
        <Col md={5}>
          {daysInMonthViewData.length > 0 ? (
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>H</th>
                  <th>I</th>
                  <th>S</th>
                </tr>
              </thead>
              <tbody>
                {daysInMonthViewData.map((day) => (
                  <tr key={day.dayOfMonth}>
                    <td>{day.dayOfMonth}</td>
                    <td>
                      <Form.Check type="checkbox" checked={day.h} disabled />
                    </td>
                    <td>
                      <Form.Check type="checkbox" checked={day.i} disabled />
                    </td>
                    <td>
                      <Form.Check type="checkbox" checked={day.s} disabled />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Tidak ada data absensi bulan ini.</p>
          )}
        </Col>

        <Col md={7}>
          <Card className="mb-2">
            <Card.Body className="text-center">
              <h5>Total Hadir</h5>
              <h4 className="fw-bold">{monthlySummary.hadir}</h4>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body className="text-center">
              <h5>Total Izin</h5>
              <h4 className="fw-bold">{monthlySummary.izin}</h4>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <h5>Total Sakit</h5>
              <h4 className="fw-bold">{monthlySummary.sakit}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}