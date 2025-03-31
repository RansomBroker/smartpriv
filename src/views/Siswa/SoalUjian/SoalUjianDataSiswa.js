import { useState } from "react";
import { Card } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";

export default function SoalUjianDataSiswa() {
    const { kelas } = useParams()
    const [datas, setDatas] = useState([])

    return (<>
        <h3>Soal Ujian Kelas {kelas}</h3>
        <div className="my-5">
            {
                datas.map((v, k) => {
                    return <Card className="mb-2">
                        <Card.Body>
                            <p className="fs-small">{v.mapel}</p>
                            <h5>{v.judul}</h5>
                            <a href={v.link} className="stretched-link"></a>
                        </Card.Body>
                    </Card>
                })
            }
        </div>
    </>);
}