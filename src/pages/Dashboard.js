/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {connect, useDispatch} from 'react-redux';
import * as Constant from '@app/Constant';

import {toast} from 'react-toastify';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import {Doughnut, Bar} from 'react-chartjs-2';
import {Button, Popover, List, Typography} from 'antd';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {ResponsivePie} from '@nivo/pie';
import SmallBox from '../components/small-box/SmallBox';
import * as ActionTypes from '../store/actions';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const Dashboard = () => {
    const isMountedRef = useRef(null);
    const [dataDashboard, setDatahboardDas] = useState({});
    const [lstPhieuHien, setLstPhieuHien] = useState([]);
    const [lstPhieuChoGhep, setLstPhieuChoGhep] = useState([]);
    const [lstCoQuanMoiDuocHien, setListCoQuanMoiDuocHien] = useState([]);
    const [lstBieuDoGhep, setlstBieuDoGhep] = useState([]);
    const [lstBieuDoHien, setlstBieuDoHien] = useState([]);
    const [lstBieuDoHienTang, setlstBieuDoHienTang] = useState([]);
    const [lstDataHienTangCoQuan, setLstDataHienTangCoQUan] = useState([]);

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
                        setListCoQuanMoiDuocHien(
                            json.Data.danhSachCoQuanMoiHien
                        );
                        setlstBieuDoHienTang(json.Data.DataBieuDoHienTang);
                        setLstDataHienTangCoQUan(json.Data.LstThang);
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

    const Pie = () => {
        let listcolorstatus = [];
        let listcountstatus = [];
        let liststatus = [];

        const dataTest = [];
        if (lstBieuDoHien.length !== 0) {
            listcolorstatus = lstBieuDoHien.LstColorStatus;
            listcountstatus = lstBieuDoHien.LstCountStatus;
            liststatus = lstBieuDoHien.LstStatus;

            listcolorstatus.map((item) =>
                dataTest.push({id: '', label: '', value: '', color: item})
            );

            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < listcountstatus.length; j++) {
                    if (i === j) {
                        element.value = listcountstatus[j];
                    }
                }
            }
            // lstBieuDoHien.LstCountStatus.map((item) => (dataTest.value = item));
            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < liststatus.length; j++) {
                    if (i === j) {
                        element.label = liststatus[j];
                        element.id = liststatus[j];
                    }
                }
            }
        }
        const data = dataTest;
        return (
            <ResponsivePie
                data={data}
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{from: 'color'}}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'ruby'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'c'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'go'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'python'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'scala'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'lisp'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'elixir'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'javascript'
                        },
                        id: 'lines'
                    }
                ]}
                // legends={[
                //     {
                //         anchor: 'bottom',
                //         direction: 'row',
                //         justify: false,
                //         translateX: 0,
                //         translateY: 56,
                //         itemsSpacing: 0,
                //         itemWidth: 80,
                //         itemHeight: 18,
                //         itemTextColor: '#999',
                //         itemDirection: 'top-to-bottom',
                //         itemOpacity: 1,
                //         symbolSize: 18,
                //         symbolShape: 'circle',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemTextColor: '#000'
                //                 }
                //             }
                //         ]
                //     }
                // ]}
            />
        );
    };

    const Pie2 = () => {
        let listcolorstatus = [];
        let listcountstatus = [];
        let liststatus = [];

        const dataTest = [];
        if (lstBieuDoGhep.length !== 0) {
            listcolorstatus = lstBieuDoGhep.LstColorStatus;
            listcountstatus = lstBieuDoGhep.LstCountStatus;
            liststatus = lstBieuDoGhep.LstStatus;

            listcolorstatus.map((item) =>
                dataTest.push({id: '', label: '', value: '', color: item})
            );

            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < listcountstatus.length; j++) {
                    if (i === j) {
                        element.value = listcountstatus[j];
                    }
                }
            }
            // lstBieuDoHien.LstCountStatus.map((item) => (dataTest.value = item));
            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < liststatus.length; j++) {
                    if (i === j) {
                        // element.label = liststatus[j];
                        element.id = liststatus[j];
                    }
                }
            }
        }
        const data = dataTest;

        return (
            <ResponsivePie
                data={data}
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{from: 'color'}}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'ruby'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'c'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'go'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'python'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'scala'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'lisp'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'elixir'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'javascript'
                        },
                        id: 'lines'
                    }
                ]}
                // legends={[
                //     {
                //         anchor: 'bottom',
                //         direction: 'row',
                //         justify: false,
                //         translateX: 0,
                //         translateY: 56,
                //         itemsSpacing: 0,
                //         itemWidth: 80,
                //         itemHeight: 18,
                //         itemTextColor: '#999',
                //         itemDirection: 'top-to-bottom',
                //         itemOpacity: 1,
                //         symbolSize: 18,
                //         symbolShape: 'circle',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemTextColor: '#000'
                //                 }
                //             }
                //         ]
                //     }
                // ]}
            />
        );
    };

    const Pie3 = () => {
        let listcolorstatus = [];
        let listcountstatus = [];
        let liststatus = [];

        const dataTest = [];
        if (lstBieuDoHienTang.length !== 0) {
            listcolorstatus = lstBieuDoHienTang.LstColorStatus;
            listcountstatus = lstBieuDoHienTang.LstCountStatus;
            liststatus = lstBieuDoHienTang.LstStatus;

            listcolorstatus.map((item) =>
                dataTest.push({id: '', label: '', value: '', color: item})
            );

            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < listcountstatus.length; j++) {
                    if (i === j) {
                        element.value = listcountstatus[j];
                    }
                }
            }
            // lstBieuDoHien.LstCountStatus.map((item) => (dataTest.value = item));
            for (let i = 0; i < dataTest.length; i++) {
                const element = dataTest[i];
                for (let j = 0; j < liststatus.length; j++) {
                    if (i === j) {
                        // element.label = liststatus[j];
                        element.id = liststatus[j];
                    }
                }
            }
        }
        const data = dataTest;

        return (
            <ResponsivePie
                data={data}
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                }}
                // arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{from: 'color'}}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'ruby'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'c'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'go'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'python'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'scala'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'lisp'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'elixir'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'javascript'
                        },
                        id: 'lines'
                    }
                ]}
                // legends={[
                //     {
                //         anchor: 'bottom',
                //         direction: 'row',
                //         justify: false,
                //         translateX: 0,
                //         translateY: 56,
                //         itemsSpacing: 0,
                //         itemWidth: 105,
                //         itemHeight: 18,
                //         itemTextColor: '#999',
                //         itemDirection: 'top-to-bottom',
                //         itemOpacity: 1,
                //         symbolSize: 18,
                //         symbolShape: 'circle'
                //         effects: [
                //             {
                //                 on: 'hover',
                //                  style: {
                //                      itemTextColor: '#000'
                //                  }
                //             }
                //          ]
                //     }
                // ]}
            />
        );
    };
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
    const datahientang = {
        datasets: [
            {
                label: '# of Votes',
                data: lstBieuDoHienTang.LstCountStatus,
                backgroundColor: lstBieuDoHienTang.LstColorStatus,

                borderWidth: 0
            }
        ],
        labels: lstBieuDoHienTang.LstStatus
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

    // const options = {
    //     title: {
    //         display: true,
    //         text: 'COVID-19 Cases of Last 3 Months',
    //         fontSize: 15
    //     },
    //     legend: {
    //         display: true,
    //         position: 'bottom'
    //     }
    // };

    // const labels = dataDashboard.DataHienTangCoQuan.LstThang.reverse();

    // const data = {
    //     labels,
    //     datasets: [
    //         {
    //             data: dataDashboard.DataHienTangCoQuan.LstCount.reverse(),
    //             label: 'Số người mới được hiến',
    //             borderColor: '#3333ff',
    //             backgroundColor: '#547db4',
    //             fill: true
    //         }
    //     ]
    // };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-sm-6 col768 col-md-4">
                    <div className="info-box">
                        <span className="info-box-icon bg-success elevation-1">
                            <i className="far fa-file-alt" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">
                                Đăng ký hiến mô tạng
                            </span>
                            <span className="info-box-number">
                                {dataDashboard.AmountDangKyHien}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col768 col-md-4">
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

                <div className="col-12 col-sm-6 col768 col-md-4">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-warning elevation-1">
                            <i className="fas fa-users" />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">
                                Số lượng cơ quan đã được hiến
                            </span>
                            <span className="info-box-number">
                                {dataDashboard.AmountHienTangCoQuan}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row TableBangNhau" style={{marginBottom: '20px'}}>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16 ">
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
                                                    <th>STT</th>
                                                    <th>Họ tên</th>
                                                    <th>Ngày đăng ký</th>
                                                    <th>Cơ Quan hiến</th>
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
                                                                    {item !==
                                                                    null ? (
                                                                        item.HoTen
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {CommonUtility.ShowDateVN(
                                                                        item.CreatedDate
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Popover
                                                                        content={
                                                                            // eslint-disable-next-line react/jsx-wrap-multilines
                                                                            <ul>
                                                                                {!item.ChiThe &&
                                                                                    !item.GiacMac &&
                                                                                    !item.Tim &&
                                                                                    !item.VanTim &&
                                                                                    !item.Da &&
                                                                                    !item.TuyTang &&
                                                                                    !item.Gan &&
                                                                                    !item.Ruot &&
                                                                                    !item.MachMau && (
                                                                                        <div>
                                                                                            Không
                                                                                            có
                                                                                            cơ
                                                                                            quan
                                                                                        </div>
                                                                                    )}
                                                                                {item.ChiThe && (
                                                                                    <li>
                                                                                        Chi
                                                                                        Thể
                                                                                    </li>
                                                                                )}

                                                                                {item.GiacMac && (
                                                                                    <li>
                                                                                        Giác
                                                                                        mạc
                                                                                    </li>
                                                                                )}

                                                                                {item.Tim && (
                                                                                    <li>
                                                                                        Tim
                                                                                    </li>
                                                                                )}

                                                                                {item.VanTim && (
                                                                                    <li>
                                                                                        Van
                                                                                        Tim
                                                                                    </li>
                                                                                )}

                                                                                {item.Da && (
                                                                                    <li>
                                                                                        Da
                                                                                    </li>
                                                                                )}

                                                                                {item.TuyTang && (
                                                                                    <li>
                                                                                        Tụy
                                                                                        Tạng
                                                                                    </li>
                                                                                )}

                                                                                {item.Gan && (
                                                                                    <li>
                                                                                        Gan
                                                                                    </li>
                                                                                )}

                                                                                {item.Ruot && (
                                                                                    <li>
                                                                                        Ruột
                                                                                    </li>
                                                                                )}

                                                                                {item.MachMau && (
                                                                                    <li>
                                                                                        Mạch
                                                                                        máu
                                                                                    </li>
                                                                                )}
                                                                            </ul>
                                                                        }
                                                                        title="Danh sách các bộ phận hiến"
                                                                    >
                                                                        <Button type="primary">
                                                                            Chi
                                                                            tiết
                                                                        </Button>
                                                                    </Popover>
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
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16">
                                Hồ sơ đăng chờ ghép mới
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ tên</th>
                                                    <th>Ngày Đăng ký</th>
                                                    <th>Cơ quan chờ hiến</th>
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
                                                                    {item !==
                                                                    null ? (
                                                                        item.HoTenBN
                                                                    ) : (
                                                                        <></>
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
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16">
                                Danh sách cơ quan mới được hiến
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ tên</th>
                                                    <th>Đăng ký</th>
                                                    <th>Cơ quan hiến</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lstCoQuanMoiDuocHien.map(
                                                    (item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    {key + 1}
                                                                </td>
                                                                <td>
                                                                    {item.phieuDangKyHien !==
                                                                    null ? (
                                                                        <>
                                                                            {
                                                                                item
                                                                                    .phieuDangKyHien
                                                                                    .HoTen
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <></>
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
            {/* <div className="row TableBangNhau" style={{marginBottom: '20px'}}>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Thống kê đăng ký hiến theo trạng thái
                            </div>
                        </div>
                        <div className="">
                            <Pie />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Thống kê đăng ký chờ ghép theo trạng thái
                            </div>
                        </div>
                        <div className="">
                            <Doughnut data={dataghep} />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title ">
                                Thống kê hồ sơ cơ quan hiến theo trạng thái
                            </div>
                        </div>
                        <div className="">
                            <Doughnut data={datahientang} />
                        </div>
                    </div>
                </div>
            </div> */}
            <div
                className="row TableBangNhau"
                style={{marginBottom: '20px', paddingBottom: '20px'}}
            >
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16 ">
                                Thống kê đăng ký hiến theo trạng thái
                            </div>
                        </div>
                        <div
                            className=""
                            style={{width: '100%', height: '300px'}}
                        >
                            {/* <Bar options={options} data={data} /> */}
                            <Pie />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16 ">
                                Thống kê đăng ký chờ ghép hiến theo trạng thái
                            </div>
                        </div>
                        <div
                            className=""
                            style={{width: '100%', height: '300px'}}
                        >
                            {/* <Bar options={options} data={data} /> */}
                            <Pie2 />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title16 ">
                                Thống kê bộ phận hiến theo trạng thái
                            </div>
                        </div>
                        <div
                            className=""
                            style={{width: '100%', height: '300px'}}
                        >
                            {/* <Bar options={options} data={data} /> */}
                            <Pie3 />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
