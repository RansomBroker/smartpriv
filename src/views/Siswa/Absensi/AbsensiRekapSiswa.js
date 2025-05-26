import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../libs/auth";
import axios from "axios";

// Helper to get current YYYY-MM
const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export function AbsensiRekapSiswa() {
  const { user: loggedInUser, loading: authLoading } = useAuth();

  const [selectedMonthYear, setSelectedMonthYear] = useState(
    getCurrentYearMonth()
  );
  const [allMyPresensiData, setAllMyPresensiData] = useState([]);

  // Data for the table: one entry for each day of the selected month
  const [daysInMonthViewData, setDaysInMonthViewData] = useState([]);
  // Summary for the selected month
  const [monthlySummary, setMonthlySummary] = useState({
    hadir: 0,
    izin: 0,
    sakit: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch all presensi data for the logged-in user
  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      setIsLoading(true);
      axios
        .get("/api/presensi")
        .then((response) => {
          const myData = response.data.filter(
            (p) => p.userId === loggedInUser.id
          );
          setAllMyPresensiData(myData);
        })
        .catch((error) => {
          console.error("Error fetching my presensi data:", error);
          setAllMyPresensiData([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [loggedInUser]);

  // Process data for table display and monthly summary when selectedMonthYear or allMyPresensiData changes
  useEffect(() => {
    if (selectedMonthYear && allMyPresensiData) {
      const [year, monthNum] = selectedMonthYear.split("-").map(Number);
      const numDays = getDaysInMonth(year, monthNum);
      const newDaysInMonthViewData = [];
      let hadirCount = 0;
      let izinCount = 0;
      let sakitCount = 0;

      for (let day = 1; day <= numDays; day++) {
        const dayData = {
          dayOfMonth: day,
          h: false,
          i: false,
          s: false,
          absent_by: null,
        };
        // Find if there's an attendance record for this specific day
        const recordForDay = allMyPresensiData.find((p) => {
          const presensiDate = new Date(p.absensiDate);
          return (
            presensiDate.getFullYear() === year &&
            presensiDate.getMonth() + 1 === monthNum &&
            presensiDate.getDate() === day
          );
        });

        if (recordForDay) {
          if (recordForDay.status === "H") dayData.h = true;
          if (recordForDay.status === "I") dayData.i = true;
          if (recordForDay.status === "S") dayData.s = true;
          dayData.absent_by = recordForDay.absent_by?.name || "N/A";
        }
        newDaysInMonthViewData.push(dayData);
      }
      setDaysInMonthViewData(newDaysInMonthViewData);

      // Calculate monthly summary from all records in that month
      const recordsThisMonth = allMyPresensiData.filter((p) => {
        const presensiDate = new Date(p.absensiDate);
        return (
          presensiDate.getFullYear() === year &&
          presensiDate.getMonth() + 1 === monthNum
        );
      });
      hadirCount = recordsThisMonth.filter((p) => p.status === "H").length;
      izinCount = recordsThisMonth.filter((p) => p.status === "I").length;
      sakitCount = recordsThisMonth.filter((p) => p.status === "S").length;
      setMonthlySummary({
        hadir: hadirCount,
        izin: izinCount,
        sakit: sakitCount,
      });
    } else {
      setDaysInMonthViewData([]);
      setMonthlySummary({ hadir: 0, izin: 0, sakit: 0 });
    }
  }, [allMyPresensiData, selectedMonthYear]);

  if (authLoading || isLoading) {
    return (
      <div
        className="p-4 d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        Loading absensi data...
      </div>
    );
  }
  if (!loggedInUser || !loggedInUser.id) {
    return (
      <div className="p-4">
        <p>
          User tidak terautentikasi atau data tidak ditemukan. Silakan login
          kembali.
        </p>
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
        <Col md="5">
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
                {daysInMonthViewData.map((dayEntry) => (
                  <tr key={dayEntry.dayOfMonth}>
                    <td>{dayEntry.dayOfMonth}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={dayEntry.h}
                        disabled
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={dayEntry.i}
                        disabled
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={dayEntry.s}
                        disabled
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Tidak ada data absensi untuk ditampilkan pada bulan ini.</p>
          )}
        </Col>
        <Col md="7">
          <Card className="mb-2">
            <Card.Body>
              <div className="d-flex flex-column align-items-center">
                <h5>Total Hadir</h5>
                <h4 className="fw-bold">{monthlySummary.hadir}</h4>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <div className="d-flex flex-column align-items-center">
                <h5>Total Izin</h5>
                <h4 className="fw-bold">{monthlySummary.izin}</h4>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <div className="d-flex flex-column align-items-center">
                <h5>Total Sakit</h5>
                <h4 className="fw-bold">{monthlySummary.sakit}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
