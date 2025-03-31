import { Badge, Card, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import SweetAlert2 from "react-sweetalert2";

export default function SoalUjianData() {
    const {kelas} = useParams()
    const [datas, setDatas] = useState([])
    const [swalProps, setSwalProps] = useState({
        show: false,
        onConfirmHandle: {}
    })

    const submitDelete = () => {
    }

    const handleConfirmDelete = () => {
        setSwalProps({
            show: true,
            title: 'Konfirmasi',
            text: 'Yakin akan hapus data ini',
            icon: 'question',
            showCancelButton: true,
            onConfirmHandle: submitDelete
        })
    }

    const columns = [
        {
            name: 'No',
            cell: (row, index) => (index + 1),
        },
        {
            name: 'Judul',
            selector: row => row.judul
        },
        {
            name: 'Link',
            selector: row => row.link
        },
        {
            name: 'Aksi',
            cell: (row, idx) => <div className="d-flex gap-1">
                <Badge><Pencil /></Badge>
                <Badge onClick={() => handleConfirmDelete(row.id)} bg="danger"><Trash /></Badge>
            </div>
        }
    ];

    const rows = [
        {
            id: 1,
            judul: 'Cara memb',
            link: 'lorem'
        }
    ]

    return (<>
        <SweetAlert2 {...swalProps}
            onConfirm={swalProps.onConfirmHandle}
        />
        <Card>
            <Card.Body className="p-4">
                <div className="d-flex flex-row justify-content-between">
                    <h3>Soal Ujian Kelas {kelas}</h3>
                    <div>
                        <Link to={`/office/soal_ujian/${kelas}/add`} className="btn btn-outline-dark px-3"><Plus /> Add</Link>
                    </div>
                </div>

                <div className="my-5">
                    <DataTable
                        columns={columns}
                        data={rows}
                        persistTableHead
                    />
                </div>

            </Card.Body>
        </Card>
    </>);
}