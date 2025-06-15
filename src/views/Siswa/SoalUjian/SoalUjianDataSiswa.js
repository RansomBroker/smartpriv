import React from "react";

const SoalUjianDataSiswa = ({ soalList }) => {
  // Group soal by kelas
  const groupedSoal = soalList.reduce((acc, soal) => {
    const kelas = soal.kelas || "Lainnya"; // Handle cases where kelas might be undefined
    if (!acc[kelas]) {
      acc[kelas] = [];
    }
    acc[kelas].push(soal);
    return acc;
  }, {});

  // Sort kelas keys if they are numeric
  const sortedKelasKeys = Object.keys(groupedSoal).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b); // Fallback for non-numeric or mixed keys
  });

  if (soalList.length === 0) {
    return <p>Belum ada soal ujian yang tersedia untukmu saat ini.</p>;
  }

  return (
    <div>
      {sortedKelasKeys.map((kelas) => (
        <div key={kelas} className="mb-4">
          <h4 className="mb-3">Kelas {kelas}</h4>
          {groupedSoal[kelas].length === 0 ? (
            <p>Tidak ada soal untuk kelas ini.</p>
          ) : (
            <div className="list-group">
              {groupedSoal[kelas].map((soal) => (
                <a
                  key={soal.id}
                  href={soal.link_soal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{soal.judul}</h5>
                  </div>
                  <p className="mb-1 text-muted">
                    Klik untuk mengerjakan soal.
                  </p>
                  {/* <small>Link: {soal.link_soal}</small> */}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SoalUjianSiswa = () => {
  const siswa = {
    username: "azkayla",
    password: "@STUDENTs1",
    courses: [
      { id: 216, nama: "Matematika" },
      { id: 217, nama: "IPA" },
      { id: 218, nama: "Bahasa Indonesia" },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tugas yang Harus Dikerjakan</h2>
      <div className="space-y-3">
        {siswa.courses.map((course) => (
          <form
            key={course.id}
            action="https://smartprivate.web.id/login/index.php"
            method="post"
            target="_blank"
          >
            <input type="hidden" name="username" value={siswa.username} />
            <input type="hidden" name="password" value={siswa.password} />
            <input type="hidden" name="rememberusername" value="1" />
            <input
              type="hidden"
              name="redirect"
              value={`https://smartprivate.web.id/course/section.php?id=${course.id}`}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Masuk ke {course.nama}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
};


export default SoalUjianDataSiswa;
