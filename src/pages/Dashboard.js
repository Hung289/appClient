import React, {useState, useEffect, useCallback, useRef} from 'react';
import {connect, useDispatch} from 'react-redux';
import * as Constant from '@app/Constant';
import {toast} from 'react-toastify';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import * as CommonUtility from '@modules/Common/CommonUtility';
import SmallBox from '../components/small-box/SmallBox';
import * as ActionTypes from '../store/actions';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const isMountedRef = useRef(null);
    const [dataDashboard, setDatahboardDas] = useState({});
    const [lstPhieuHien, setLstPhieuHien] = useState([]);
    const [lstPhieuChoGhep, setLstPhieuChoGhep] = useState([]);
    const [lstBieuDoGhep, setlstBieuDoGhep] = useState([]);
    const [lstBieuDoHien, setlstBieuDoHien] = useState([]);

    const dispatch = useDispatch();
    const checklogin = useCallback(() =>
        dispatch({type: ActionTypes.LOGOUT_USER})
    );
    const InitDataOfDashboard = async () => {
        await fetch(`${Constant.PathServer}/api/Dashboard/GetDataDashboard`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
            .then((response) => response.json())
            .then((json) => {
                // function checklogin
                if (json.ErrorCode === 401) {
                    checklogin();
                }
                if (json.Status) {
                    if (isMountedRef.current) {
                        setDatahboardDas(json.Data);
                        setLstPhieuHien(json.Data.phieuDangKyHiens);
                        setLstPhieuChoGhep(json.Data.phieuDangKyChoGhepThans);
                        setlstBieuDoGhep(json.Data.DataBieuDo);
                        setlstBieuDoHien(json.Data.DataBieuDoHien);
                    }
                } else {
                    toast.error(json.MessageError);
                }
            });
    };

    useEffect(() => {
        isMountedRef.current = true;
        InitDataOfDashboard();
        // eslint-disable-next-line no-return-assign
        return () => (isMountedRef.current = false);
    }, []);
    const GetTuoi = (date) => {
        if (date !== undefined && date != null) {
            const d = new Date();
            return d.getFullYear() - CommonUtility.GetYear(date);
        }
        return '';
    };

    // vẽ biểu đồ
    const datahien = {
        datasets: [
            {
                label: '# of Votes',
                data: lstBieuDoHien.LstCountStatus,
                backgroundColor: lstBieuDoHien.LstColorStatus,

                borderWidth: 0
            }
        ],
        labels: lstBieuDoHien.LstStatus
    };
    const dataghep = {
        datasets: [
            {
                label: '# of Votes',
                data: lstBieuDoGhep.LstCountStatus,
                backgroundColor: lstBieuDoGhep.LstColorStatus,
                borderWidth: 0
            }
        ],
        labels: lstBieuDoGhep.LstStatus
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-sm-6 col768 col-md-3">
                    <div className="info-box">
                        <span className="info-box-icon bg-success elevation-1">
                            <i className="far fa-file-alt" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">Hiến mô tạng</span>
                            <span className="info-box-number">
                                {dataDashboard.AmountDangKyHien}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col768 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-info elevation-1">
                            <i className="far fa-file-alt" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">
                                Chờ ghép mô tạng
                            </span>
                            <span className="info-box-number">
                                {dataDashboard.AmountDangKyGhep}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col768 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-danger elevation-1">
                            <i className="far fa-question-circle" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">
                                Số lượng câu hỏi mới
                            </span>
                            <span className="info-box-number">
                                {dataDashboard.AmountHoiDap}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col768 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-warning elevation-1">
                            <i className="fas fa-users" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">Người dùng</span>
                            <span className="info-box-number">
                                {dataDashboard.AmountAccount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row TableBangNhau">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Hồ sơ đăng ký hiến tạng mới
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Họ tên</th>
                                                    <th>Tuổi</th>
                                                    <th>Giới</th>

                                                    <th>Đăng ký</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lstPhieuHien.map(
                                                    (item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    {key + 1}
                                                                </td>
                                                                <td>
                                                                    {item.HoTen}
                                                                </td>
                                                                <td>
                                                                    {GetTuoi(
                                                                        item.NgaySinh
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.GioiTinh ===
                                                                    1 ? (
                                                                        <i className="fas fa-mars" />
                                                                    ) : (
                                                                        <i className="fas fa-venus" />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {CommonUtility.ShowDateVN(
                                                                        item.CreatedDate
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">
                                Hồ sơ đăng ký ghép tạng mới
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Họ tên</th>
                                                    <th>Tuổi</th>
                                                    <th>Giới</th>

                                                    <th>Đăng ký</th>
                                                    <th>Loại</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lstPhieuChoGhep.map(
                                                    (item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    {key + 1}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.HoTenBN
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {GetTuoi(
                                                                        item.NgaySinh
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.GioiTinh ===
                                                                    1 ? (
                                                                        <i className="fas fa-mars" />
                                                                    ) : (
                                                                        <i className="fas fa-venus" />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {CommonUtility.ShowDateVN(
                                                                        item.CreatedDate
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.TenCoQuan
                                                                    }
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Biểu đồ đăng ký hiến tạng theo trạng thái
                            </div>
                        </div>
                        <div className="">
                            <Doughnut data={datahien} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Biểu đồ đăng ký chờ ghép tạng theo trạng thái
                            </div>
                        </div>
                        <div className="">
                            <Doughnut data={dataghep} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
