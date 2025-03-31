import { Image } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export function SiswaLayout({ component }) {

    const NavList = [
        {
            to: '/siswa/dashboard',
            image: '/assets/images/dashboard.png',
            text: 'Dashboard',
        },
        {
            to: '/siswa/absensi',
            image: '/assets/images/absensi.png',
            text: 'Absensi',
        },
        {
            to: '/siswa/soal_ujian',
            image: '/assets/images/ujian.png',
            text: 'Soal Ujian',
        },
    ]

    return <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 p-0">
                <div className="d-flex flex-column align-items-center align-items-sm-start p-0 text-white min-vh-100">
                    <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-5 d-none d-sm-inline"></span>
                    </a>
                    <ul className="nav flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">

                        <li className="nav-item p-3">
                            <Image src={`/assets/images/smart_private.png`} fluid />
                        </li>
                        {
                            NavList.map((v, k) => {
                                return <li className="nav-item">
                                    <NavLink
                                        to={v.to}
                                        className={({ isActive, isPending }) =>
                                            isActive ? "nav-link align-middle active" : "nav-link align-middle"
                                        }
                                    >

                                        <Image src={v.image} fluid />
                                        <span className="ms-1 d-none d-sm-inline">{v.text}</span>
                                    </NavLink>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
            <div class="col py-3 px-0">
                <div className="bg-grey rounded py-3 main-content">
                    <div className="px-3 my-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </div>
}
