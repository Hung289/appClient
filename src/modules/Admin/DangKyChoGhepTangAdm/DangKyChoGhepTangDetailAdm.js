import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as Constant from '@app/Constant';
import {connect} from 'react-redux';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import axios from 'axios';
import {
    Modal,
    // Button,
    // Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    // Tabs,
    Tab
} from 'react-bootstrap';
import {Link, useParams, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import * as KQXetNghiemService from '@app/services/KQXetNghiemService';

import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import ReactLoading from 'react-loading';
import * as KQXetNghiemPRAService from '@app/services/KQXetNghiemPRAService';
import * as KQXetNghiemHLAService from '@app/services/KQXetNghiemHLAService';
import * as KQXetNghiemVGBService from '@app/services/KQXetNghiemVGBService';
import * as KQXetNghiemVGCService from '@app/services/KQXetNghiemVGCService';
import * as antd from 'antd';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';
import AdminSecsionHead from '../AdminSecsionHead';
import KQXetNghiemPRAAdm from './KQXetNghiemPRAAdm';
import KQXetNghiemHLAAdm from './KQXetNghiemHLAAdm';
import KQXetNghiemVGBAdm from './KQXetNghiemVGBAdm';
import KQXetNghiemVGCAdm from './KQXetNghiemVGCAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyChoGhepTangDetailAdm = (props) => {
    const [isload, setisload] = useState(false);

    const {
        Drawer,
        Button,
        Space,
        Form,
        Row,
        Col,
        Tabs,
        Input,
        Radio,
        Select,
        notification,
        Descriptions,
        Table,
        Tag
    } = antd;
    const {TabPane} = Tabs;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    const {showDetailModal, entityObj, setshowDetailModal} = props;

    function RenderTabKQXN() {
        const [DataKQ, setDataKQ] = useState({});
        const [DataKQVGB, setDataKQVGB] = useState({});
        const [DataKQVGC, setDataKQVGC] = useState({});
        const [showCreateKQVGB, setshowCreateKQVGB] = useState();

        const [entityObjKQVGB, setEntityObjKQVGB] = useState({});
        const [showCreateKQVGC, setshowCreateKQVGC] = useState();

        const [entityObjKQVGC, setEntityObjKQVGC] = useState({});

        const [showCreateKQ, setshowCreateKQ] = useState();

        const [entityObjKQ, setEntityObjKQ] = useState({});

        const onCreateVGCEntity = () => {
            setDataKQVGC({IdPhieu: entityObj.Id});
            setshowCreateKQVGC(true);
        };
        const onEditVGCEntity = async (idKq) => {
            KQXetNghiemVGCService.OpenEditModalSV(idKq).then((a) => {
                setDataKQVGC(a.Data);
                setshowCreateKQVGC(true);
            });
        };
        const onCreateVGBEntity = () => {
            setDataKQVGB({IdPhieu: entityObj.Id});
            setshowCreateKQVGB(true);
        };
        const onEditVGBEntity = async (idKq) => {
            KQXetNghiemVGBService.OpenEditModalSV(idKq).then((a) => {
                setDataKQVGB(a.Data);
                setshowCreateKQVGB(true);
            });
        };
        const onCreateEntity = () => {
            setDataKQ({IdPhieu: entityObj.Id});
            setshowCreateKQ(true);
        };
        const onEditEntity = async (idKq) => {
            KQXetNghiemPRAService.OpenEditModalSV(idKq).then((a) => {
                setDataKQ(a.Data);
                setshowCreateKQ(true);
            });
        };

        const LoadData = () => {
            setisload(true);
            // dangKyChoGhepTangService.OpenDetail(id).then((rs) => {
            //     if (rs.Status) {
            //         setEntityObj(rs.Data);
            //     } else {
            //         toast.error(rs.MessageError);
            //         if (rs.ErrorCode === 401) {
            //             props.history.push('/login');
            //         }
            //     }
            // });
            KQXetNghiemPRAService.GetKQXetNghiem(entityObj.Id).then((rs) => {
                if (rs.Status) {
                    setEntityObjKQ(rs.Data);
                } else {
                    toast.error(rs.MessageError);
                    if (rs.ErrorCode === 401) {
                        props.history.push('/login');
                    }
                }
            });
            KQXetNghiemVGBService.GetKQXetNghiem(entityObj.Id).then((rs) => {
                if (rs.Status) {
                    setEntityObjKQVGB(rs.Data);
                } else {
                    toast.error(rs.MessageError);
                    if (rs.ErrorCode === 401) {
                        props.history.push('/login');
                    }
                }
            });
            KQXetNghiemVGCService.GetKQXetNghiem(entityObj.Id).then((rs) => {
                if (rs.Status) {
                    setEntityObjKQVGC(rs.Data);
                } else {
                    toast.error(rs.MessageError);
                    if (rs.ErrorCode === 401) {
                        props.history.push('/login');
                    }
                }
            });
            setisload(false);
        };

        useEffect(() => {
            let isUnmount = false;

            LoadData();

            return () => {
                isUnmount = true;
            };
        }, []);

        const DeletePRAAction = (idKQ) => {
            confirmAlert({
                title: 'X??c nh???n x??a?',
                message: 'B???n ch???c ch???n mu???n x??a b??? k???t qu??? PRA n??y.',
                buttons: [
                    {
                        label: 'X??c nh???n',
                        onClick: () => {
                            KQXetNghiemPRAService.DeleteEntity(idKQ).then(
                                (x) => {
                                    LoadData();
                                }
                            );
                        }
                    },
                    {
                        label: '????ng',
                        onClick: () => {}
                    }
                ]
            });
        };
        const DeleteVGBAction = (idKQ) => {
            confirmAlert({
                title: 'X??c nh???n x??a?',
                message: 'B???n ch???c ch???n mu???n x??a b??? k???t qu??? vi??m gan B n??y.',
                buttons: [
                    {
                        label: 'X??c nh???n',
                        onClick: () => {
                            KQXetNghiemVGBService.DeleteEntity(idKQ).then(
                                (x) => {
                                    LoadData();
                                }
                            );
                        }
                    },
                    {
                        label: '????ng',
                        onClick: () => {}
                    }
                ]
            });
        };
        const DeleteVGCAction = (idKQ) => {
            confirmAlert({
                title: 'X??c nh???n x??a?',
                message: 'B???n ch???c ch???n mu???n x??a b??? k???t qu??? vi??m gan C n??y.',
                buttons: [
                    {
                        label: 'X??c nh???n',
                        onClick: () => {
                            KQXetNghiemVGCService.DeleteEntity(idKQ).then(
                                (x) => {
                                    LoadData();
                                }
                            );
                        }
                    },
                    {
                        label: '????ng',
                        onClick: () => {}
                    }
                ]
            });
        };
        return (
            <>
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <KQXetNghiemVGBAdm
                                        showCreateKQVGB={showCreateKQVGB}
                                        DataKQVGB={DataKQVGB}
                                        setshowCreateKQVGB={setshowCreateKQVGB}
                                        setisload={setisload}
                                        LoadData={LoadData}
                                    />

                                    <Button
                                        variant=""
                                        className="btn btn-primary"
                                        size="sm"
                                        onClick={() => {
                                            setshowCreateKQVGB(true);
                                            onCreateVGBEntity();
                                        }}
                                    >
                                        <i
                                            className="fa fa-plus"
                                            aria-hidden="true"
                                        />
                                        T???o m???i k???t qu??? vi??m gan B
                                    </Button>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="table-responsive">
                                        <table className="table table-hinetNew">
                                            <thead>
                                                <tr>
                                                    <th
                                                        colSpan={12}
                                                        className="center red"
                                                    >
                                                        K???t qu??? x??t nghi???m vi??m
                                                        gan B
                                                    </th>
                                                </tr>
                                            </thead>
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th
                                                        scope="col"
                                                        className="widthColTableMedium"
                                                    >
                                                        Ng??y th???c hi???n
                                                    </th>
                                                    <th scope="col">
                                                        Vi??m gan B
                                                    </th>
                                                    <th scope="col">
                                                        ?????nh l?????ng HBV-DNA
                                                        (copies/ml)
                                                    </th>
                                                    <th scope="col">
                                                        B??? vi??m gan
                                                    </th>
                                                    <th scope="col">
                                                        ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Thu???c ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Ng??y b???t ?????u ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Ng??y k???t th??c ??i???u tr???
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entityObjKQVGB &&
                                                entityObjKQVGB.length > 0 ? (
                                                    entityObjKQVGB.map(
                                                        (itm, key) => {
                                                            const indx =
                                                                key + 1;
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        {indx}
                                                                    </td>
                                                                    <td>
                                                                        <div className="tableBoxMain">
                                                                            <div className="tableBoxMain-label">
                                                                                {CommonUtility.ShowDateVN(
                                                                                    itm.NgayXetNghiemVGB
                                                                                )}
                                                                            </div>
                                                                            <div className="tableBoxMain-btnAction">
                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle
                                                                                        size="sm"
                                                                                        variant=""
                                                                                        className="dropdowTableBtn"
                                                                                    >
                                                                                        <i
                                                                                            className="fa fa-ellipsis-h"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                onEditVGBEntity(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon">
                                                                                                <i className="fas fa-edit" />
                                                                                            </span>
                                                                                            <span>
                                                                                                S???a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                DeleteVGBAction(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon ">
                                                                                                <i className="fas fa-times" />
                                                                                            </span>
                                                                                            <span>
                                                                                                X??a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {itm.CoBiVGB ===
                                                                        true
                                                                            ? 'D????ng t??nh'
                                                                            : '??m t??nh'}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.KetQuaCopiesVGB
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.BiBaoGioVGB
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {itm.CoDieuTriVGB ===
                                                                        true
                                                                            ? 'C??'
                                                                            : 'Kh??ng'}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.ThuocDieuTriVGB
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {CommonUtility.ShowDateVN(
                                                                            itm.NgayBatDauDieuTriVGB
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {CommonUtility.ShowDateVN(
                                                                            itm.NgayKetThucDieuTriVGB
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={12}
                                                            className="center"
                                                        >
                                                            Kh??ng c?? d??? li???u
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <KQXetNghiemVGCAdm
                                        showCreateKQVGC={showCreateKQVGC}
                                        DataKQVGC={DataKQVGC}
                                        setshowCreateKQVGC={setshowCreateKQVGC}
                                        setisload={setisload}
                                        LoadData={LoadData}
                                    />

                                    <Button
                                        variant=""
                                        className="btn btn-primary"
                                        size="sm"
                                        onClick={() => {
                                            setshowCreateKQVGC(true);
                                            onCreateVGCEntity();
                                        }}
                                    >
                                        <i
                                            className="fa fa-plus"
                                            aria-hidden="true"
                                        />
                                        T???o m???i k???t qu??? vi??m gan C
                                    </Button>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="table-responsive">
                                        <table className="table table-hinetNew">
                                            <thead>
                                                <tr>
                                                    <th
                                                        colSpan={12}
                                                        className="center red"
                                                    >
                                                        K???t qu??? x??t nghi???m vi??m
                                                        gan C
                                                    </th>
                                                </tr>
                                            </thead>
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th
                                                        scope="col"
                                                        className="widthColTableMedium"
                                                    >
                                                        Ng??y th???c hi???n
                                                    </th>
                                                    <th scope="col">
                                                        Vi??m gan C
                                                    </th>
                                                    <th scope="col">
                                                        ?????nh l?????ng HBV-DNA
                                                        (copies/ml)
                                                    </th>
                                                    <th scope="col">
                                                        B??? vi??m gan
                                                    </th>
                                                    <th scope="col">
                                                        ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Thu???c ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Ng??y b???t ?????u ??i???u tr???
                                                    </th>
                                                    <th scope="col">
                                                        Ng??y k???t th??c ??i???u tr???
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entityObjKQVGC &&
                                                entityObjKQVGC.length > 0 ? (
                                                    entityObjKQVGC.map(
                                                        (itm, key) => {
                                                            const indx =
                                                                key + 1;
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        {indx}
                                                                    </td>
                                                                    <td>
                                                                        <div className="tableBoxMain">
                                                                            <div className="tableBoxMain-label">
                                                                                {CommonUtility.ShowDateVN(
                                                                                    itm.NgayXetNghiemVGC
                                                                                )}
                                                                            </div>
                                                                            <div className="tableBoxMain-btnAction">
                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle
                                                                                        size="sm"
                                                                                        variant=""
                                                                                        className="dropdowTableBtn"
                                                                                    >
                                                                                        <i
                                                                                            className="fa fa-ellipsis-h"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                onEditVGCEntity(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon">
                                                                                                <i className="fas fa-edit" />
                                                                                            </span>
                                                                                            <span>
                                                                                                S???a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                DeleteVGCAction(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon ">
                                                                                                <i className="fas fa-times" />
                                                                                            </span>
                                                                                            <span>
                                                                                                X??a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {itm.CoBiVGC ===
                                                                        true
                                                                            ? 'D????ng t??nh'
                                                                            : '??m t??nh'}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.KetQuaCopiesVGC
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.BiBaoGioVGC
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {itm.CoDieuTriVGC ===
                                                                        true
                                                                            ? 'C??'
                                                                            : 'Kh??ng'}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.ThuocDieuTriVGC
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {CommonUtility.ShowDateVN(
                                                                            itm.NgayBatDauDieuTriVGC
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {CommonUtility.ShowDateVN(
                                                                            itm.NgayKetThucDieuTriVGC
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={12}
                                                            className="center"
                                                        >
                                                            Kh??ng c?? d??? li???u
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <KQXetNghiemPRAAdm
                                        showCreateKQ={showCreateKQ}
                                        DataKQ={DataKQ}
                                        setshowCreateKQ={setshowCreateKQ}
                                        setisload={setisload}
                                        LoadData={LoadData}
                                    />

                                    <Button
                                        variant=""
                                        className="btn btn-primary"
                                        size="sm"
                                        onClick={() => {
                                            setshowCreateKQ(true);
                                            onCreateEntity();
                                        }}
                                    >
                                        <i
                                            className="fa fa-plus"
                                            aria-hidden="true"
                                        />
                                        T???o m???i k???t qu??? PRA
                                    </Button>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="table-responsive">
                                        <table className="table table-hinetNew">
                                            <thead>
                                                <tr>
                                                    <th
                                                        colSpan={12}
                                                        className="center red"
                                                    >
                                                        K???t qu??? x??t nghi???m PRA
                                                    </th>
                                                </tr>
                                            </thead>
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th
                                                        scope="col"
                                                        className="widthColTableMedium"
                                                    >
                                                        Ng??y th???c hi???n
                                                    </th>
                                                    <th scope="col">
                                                        T??? l??? PRA
                                                    </th>
                                                    <th scope="col">A</th>
                                                    <th scope="col">B</th>
                                                    <th scope="col">DR</th>
                                                    <th scope="col">DQ</th>
                                                    <th scope="col">DP</th>
                                                    <th scope="col">
                                                        L???c huy???t t????ng
                                                    </th>
                                                    <th scope="col">
                                                        Thu???c UCMD
                                                    </th>
                                                    <th scope="col">
                                                        Theo d??i
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entityObjKQ &&
                                                entityObjKQ.length > 0 ? (
                                                    entityObjKQ.map(
                                                        (itm, key) => {
                                                            const indx =
                                                                key + 1;
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        {indx}
                                                                    </td>
                                                                    <td>
                                                                        <div className="tableBoxMain">
                                                                            <div className="tableBoxMain-label">
                                                                                {CommonUtility.ShowDateVN(
                                                                                    itm.PRANgayThucHien
                                                                                )}
                                                                            </div>
                                                                            <div className="tableBoxMain-btnAction">
                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle
                                                                                        size="sm"
                                                                                        variant=""
                                                                                        className="dropdowTableBtn"
                                                                                    >
                                                                                        <i
                                                                                            className="fa fa-ellipsis-h"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                onEditEntity(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon">
                                                                                                <i className="fas fa-edit" />
                                                                                            </span>
                                                                                            <span>
                                                                                                S???a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                        <Dropdown.Item
                                                                                            onClick={() =>
                                                                                                DeletePRAAction(
                                                                                                    itm.Id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <span className="boxIcon ">
                                                                                                <i className="fas fa-times" />
                                                                                            </span>
                                                                                            <span>
                                                                                                X??a
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <>
                                                                            {
                                                                                itm.PRATyLePRALop1
                                                                            }
                                                                            {
                                                                                '% '
                                                                            }
                                                                            -{' '}
                                                                            {
                                                                                itm.PRATyLePRALop2
                                                                            }
                                                                            {
                                                                                '% '
                                                                            }
                                                                        </>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRAA
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRAB
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRADR
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRADQ
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRADP
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRALocHuyetTuong
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRAThuocUCMD
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itm.PRATheoDoi
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={12}
                                                            className="center"
                                                        >
                                                            Kh??ng c?? d??? li???u
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const RenderViewFile = (path) => {
        const type = CommonUtility.GetTypeFile(path);
        if (type === 1) {
            return (
                <>
                    <img
                        src={`${Constant.PathServer}${entityObj.DonDKBanCung}`}
                        alt=""
                        onError={NotFoundUserImage}
                        // className="imgHinhAnhAccount img-thumbnail"
                    />
                </>
            );
        }
        if (type === 2) {
            return (
                <div
                    style={{
                        padding: '10px',
                        margin: '0 auto'
                    }}
                >
                    <embed
                        src={`${Constant.PathServer}${entityObj.DonDKBanCung}`}
                        width="100%"
                        height="500px"
                    />
                </div>
            );
        }
        return <></>;
    };
    // function DetailModal() {
    //     const [keytab, setKey] = useState('KetQuaXetNghiem');
    //     const renderCheckBox = (value) => {
    //         if (value === true || value === 1) {
    //             return <input type="checkbox" disabled checked />;
    //         }
    //         return <input type="checkbox" disabled />;
    //     };
    //     if (
    //         entityObj &&
    //         entityObjKQ &&
    //         entityObjKQHLA &&
    //         entityObjKQVGB &&
    //         entityObjKQVGC
    //     ) {
    //         return (
    //             <>
    //                 <div className="table-responsive">
    //                     {/* <Modal
    //                 show={
    //                     showDetailModal &&
    //                     entityObj.TypePhieuDKGhepTang === 'than'
    //                 }
    //                 dialogClassName="modal-90w"
    //                 onHide={() => setshowDetailModal(false)}
    //             >
    //                 <Modal.Header closeButton>
    //                     <Modal.Title>
    //                         Chi ti???t ????ng k?? ch??? gh??p {entityObj.TenCoQuan}
    //                     </Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body> */}
    //                     <Tabs
    //                         id="controlled-tab-example"
    //                         activeKey={keytab}
    //                         onSelect={(k) => setKey(k)}
    //                         className="mb-3"
    //                     >
    //                         <Tab
    //                             eventKey="KetQuaXetNghiem"
    //                             title="K???t qu??? x??t nghi???m"
    //                         >
    //                             <div>
    //                                 <div className="row">
    //                                     <div className="col-md-12">
    //                                         <div className="card">
    //                                             <div className="card-header p-2">
    //                                                 <KQXetNghiemVGBAdm
    //                                                     showCreateKQVGB={
    //                                                         showCreateKQVGB
    //                                                     }
    //                                                     DataKQVGB={DataKQVGB}
    //                                                     setshowCreateKQVGB={
    //                                                         setshowCreateKQVGB
    //                                                     }
    //                                                     setisload={setisload}
    //                                                     LoadData={LoadData}
    //                                                 />

    //                                                 <Button
    //                                                     variant=""
    //                                                     className="btn btn-primary"
    //                                                     size="sm"
    //                                                     onClick={() => {
    //                                                         setshowCreateKQVGB(
    //                                                             true
    //                                                         );
    //                                                         onCreateVGBEntity();
    //                                                     }}
    //                                                 >
    //                                                     <i
    //                                                         className="fa fa-plus"
    //                                                         aria-hidden="true"
    //                                                     />
    //                                                     T???o m???i k???t qu??? vi??m gan
    //                                                     B
    //                                                 </Button>
    //                                             </div>
    //                                             <div className="card-body nopadding">
    //                                                 <div className="table-responsive">
    //                                                     <table className="table table-hinetNew">
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th
    //                                                                     colSpan={
    //                                                                         12
    //                                                                     }
    //                                                                     className="center red"
    //                                                                 >
    //                                                                     K???t qu???
    //                                                                     x??t
    //                                                                     nghi???m
    //                                                                     vi??m gan
    //                                                                     B
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th>STT</th>
    //                                                                 <th
    //                                                                     scope="col"
    //                                                                     className="widthColTableMedium"
    //                                                                 >
    //                                                                     Ng??y
    //                                                                     th???c
    //                                                                     hi???n
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Vi??m gan
    //                                                                     B
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     ?????nh
    //                                                                     l?????ng
    //                                                                     HBV-DNA
    //                                                                     (copies/ml)
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     B??? vi??m
    //                                                                     gan
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thu???c
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ng??y b???t
    //                                                                     ?????u ??i???u
    //                                                                     tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ng??y k???t
    //                                                                     th??c
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <tbody>
    //                                                             {entityObjKQVGB &&
    //                                                             entityObjKQVGB.length >
    //                                                                 0 ? (
    //                                                                 entityObjKQVGB.map(
    //                                                                     (
    //                                                                         itm,
    //                                                                         key
    //                                                                     ) => {
    //                                                                         const indx =
    //                                                                             key +
    //                                                                             1;
    //                                                                         return (
    //                                                                             <tr>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         indx
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     <div className="tableBoxMain">
    //                                                                                         <div className="tableBoxMain-label">
    //                                                                                             {CommonUtility.ShowDateVN(
    //                                                                                                 itm.NgayXetNghiemVGB
    //                                                                                             )}
    //                                                                                         </div>
    //                                                                                         <div className="tableBoxMain-btnAction">
    //                                                                                             <Dropdown>
    //                                                                                                 <Dropdown.Toggle
    //                                                                                                     size="sm"
    //                                                                                                     variant=""
    //                                                                                                     className="dropdowTableBtn"
    //                                                                                                 >
    //                                                                                                     <i
    //                                                                                                         className="fa fa-ellipsis-h"
    //                                                                                                         aria-hidden="true"
    //                                                                                                     />
    //                                                                                                 </Dropdown.Toggle>
    //                                                                                                 <Dropdown.Menu>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             onEditVGBEntity(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon">
    //                                                                                                             <i className="fas fa-edit" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             S???a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             DeleteVGBAction(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon ">
    //                                                                                                             <i className="fas fa-times" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             X??a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                 </Dropdown.Menu>
    //                                                                                             </Dropdown>
    //                                                                                         </div>
    //                                                                                     </div>
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {itm.CoBiVGB ===
    //                                                                                     true
    //                                                                                         ? 'D????ng t??nh'
    //                                                                                         : '??m t??nh'}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.KetQuaCopiesVGB
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.BiBaoGioVGB
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {itm.CoDieuTriVGB ===
    //                                                                                     true
    //                                                                                         ? 'C??'
    //                                                                                         : 'Kh??ng'}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.ThuocDieuTriVGB
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {CommonUtility.ShowDateVN(
    //                                                                                         itm.NgayBatDauDieuTriVGB
    //                                                                                     )}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {CommonUtility.ShowDateVN(
    //                                                                                         itm.NgayKetThucDieuTriVGB
    //                                                                                     )}
    //                                                                                 </td>
    //                                                                             </tr>
    //                                                                         );
    //                                                                     }
    //                                                                 )
    //                                                             ) : (
    //                                                                 <tr>
    //                                                                     <td
    //                                                                         colSpan={
    //                                                                             12
    //                                                                         }
    //                                                                         className="center"
    //                                                                     >
    //                                                                         Kh??ng
    //                                                                         c??
    //                                                                         d???
    //                                                                         li???u
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             )}
    //                                                         </tbody>
    //                                                     </table>
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="row">
    //                                     <hr />
    //                                     <hr />
    //                                     <hr />
    //                                 </div>
    //                                 <div className="row">
    //                                     <div className="col-md-12">
    //                                         <div className="card">
    //                                             <div className="card-header p-2">
    //                                                 <KQXetNghiemVGCAdm
    //                                                     showCreateKQVGC={
    //                                                         showCreateKQVGC
    //                                                     }
    //                                                     DataKQVGC={DataKQVGC}
    //                                                     setshowCreateKQVGC={
    //                                                         setshowCreateKQVGC
    //                                                     }
    //                                                     setisload={setisload}
    //                                                     LoadData={LoadData}
    //                                                 />

    //                                                 <Button
    //                                                     variant=""
    //                                                     className="btn btn-primary"
    //                                                     size="sm"
    //                                                     onClick={() => {
    //                                                         setshowCreateKQVGC(
    //                                                             true
    //                                                         );
    //                                                         onCreateVGCEntity();
    //                                                     }}
    //                                                 >
    //                                                     <i
    //                                                         className="fa fa-plus"
    //                                                         aria-hidden="true"
    //                                                     />
    //                                                     T???o m???i k???t qu??? vi??m gan
    //                                                     C
    //                                                 </Button>
    //                                             </div>
    //                                             <div className="card-body nopadding">
    //                                                 <div className="table-responsive">
    //                                                     <table className="table table-hinetNew">
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th
    //                                                                     colSpan={
    //                                                                         12
    //                                                                     }
    //                                                                     className="center red"
    //                                                                 >
    //                                                                     K???t qu???
    //                                                                     x??t
    //                                                                     nghi???m
    //                                                                     vi??m gan
    //                                                                     C
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th>STT</th>
    //                                                                 <th
    //                                                                     scope="col"
    //                                                                     className="widthColTableMedium"
    //                                                                 >
    //                                                                     Ng??y
    //                                                                     th???c
    //                                                                     hi???n
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Vi??m gan
    //                                                                     C
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     ?????nh
    //                                                                     l?????ng
    //                                                                     HBV-DNA
    //                                                                     (copies/ml)
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     B??? vi??m
    //                                                                     gan
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thu???c
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ng??y b???t
    //                                                                     ?????u ??i???u
    //                                                                     tr???
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ng??y k???t
    //                                                                     th??c
    //                                                                     ??i???u tr???
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <tbody>
    //                                                             {entityObjKQVGC &&
    //                                                             entityObjKQVGC.length >
    //                                                                 0 ? (
    //                                                                 entityObjKQVGC.map(
    //                                                                     (
    //                                                                         itm,
    //                                                                         key
    //                                                                     ) => {
    //                                                                         const indx =
    //                                                                             key +
    //                                                                             1;
    //                                                                         return (
    //                                                                             <tr>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         indx
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     <div className="tableBoxMain">
    //                                                                                         <div className="tableBoxMain-label">
    //                                                                                             {CommonUtility.ShowDateVN(
    //                                                                                                 itm.NgayXetNghiemVGC
    //                                                                                             )}
    //                                                                                         </div>
    //                                                                                         <div className="tableBoxMain-btnAction">
    //                                                                                             <Dropdown>
    //                                                                                                 <Dropdown.Toggle
    //                                                                                                     size="sm"
    //                                                                                                     variant=""
    //                                                                                                     className="dropdowTableBtn"
    //                                                                                                 >
    //                                                                                                     <i
    //                                                                                                         className="fa fa-ellipsis-h"
    //                                                                                                         aria-hidden="true"
    //                                                                                                     />
    //                                                                                                 </Dropdown.Toggle>
    //                                                                                                 <Dropdown.Menu>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             onEditVGCEntity(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon">
    //                                                                                                             <i className="fas fa-edit" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             S???a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             DeleteVGCAction(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon ">
    //                                                                                                             <i className="fas fa-times" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             X??a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                 </Dropdown.Menu>
    //                                                                                             </Dropdown>
    //                                                                                         </div>
    //                                                                                     </div>
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {itm.CoBiVGC ===
    //                                                                                     true
    //                                                                                         ? 'D????ng t??nh'
    //                                                                                         : '??m t??nh'}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.KetQuaCopiesVGC
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.BiBaoGioVGC
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {itm.CoDieuTriVGC ===
    //                                                                                     true
    //                                                                                         ? 'C??'
    //                                                                                         : 'Kh??ng'}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.ThuocDieuTriVGC
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {CommonUtility.ShowDateVN(
    //                                                                                         itm.NgayBatDauDieuTriVGC
    //                                                                                     )}
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {CommonUtility.ShowDateVN(
    //                                                                                         itm.NgayKetThucDieuTriVGC
    //                                                                                     )}
    //                                                                                 </td>
    //                                                                             </tr>
    //                                                                         );
    //                                                                     }
    //                                                                 )
    //                                                             ) : (
    //                                                                 <tr>
    //                                                                     <td
    //                                                                         colSpan={
    //                                                                             12
    //                                                                         }
    //                                                                         className="center"
    //                                                                     >
    //                                                                         Kh??ng
    //                                                                         c??
    //                                                                         d???
    //                                                                         li???u
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             )}
    //                                                         </tbody>
    //                                                     </table>
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="row">
    //                                     <hr />
    //                                     <hr />
    //                                     <hr />
    //                                 </div>
    //                                 <div className="row">
    //                                     <div className="col-md-12">
    //                                         <div className="card">
    //                                             <div className="card-header p-2">
    //                                                 <KQXetNghiemPRAAdm
    //                                                     showCreateKQ={
    //                                                         showCreateKQ
    //                                                     }
    //                                                     DataKQ={DataKQ}
    //                                                     setshowCreateKQ={
    //                                                         setshowCreateKQ
    //                                                     }
    //                                                     setisload={setisload}
    //                                                     LoadData={LoadData}
    //                                                 />

    //                                                 <Button
    //                                                     variant=""
    //                                                     className="btn btn-primary"
    //                                                     size="sm"
    //                                                     onClick={() => {
    //                                                         setshowCreateKQ(
    //                                                             true
    //                                                         );
    //                                                         onCreateEntity();
    //                                                     }}
    //                                                 >
    //                                                     <i
    //                                                         className="fa fa-plus"
    //                                                         aria-hidden="true"
    //                                                     />
    //                                                     T???o m???i k???t qu??? PRA
    //                                                 </Button>
    //                                             </div>
    //                                             <div className="card-body nopadding">
    //                                                 <div className="table-responsive">
    //                                                     <table className="table table-hinetNew">
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th
    //                                                                     colSpan={
    //                                                                         12
    //                                                                     }
    //                                                                     className="center red"
    //                                                                 >
    //                                                                     K???t qu???
    //                                                                     x??t
    //                                                                     nghi???m
    //                                                                     PRA
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th>STT</th>
    //                                                                 <th
    //                                                                     scope="col"
    //                                                                     className="widthColTableMedium"
    //                                                                 >
    //                                                                     Ng??y
    //                                                                     th???c
    //                                                                     hi???n
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     T??? l???
    //                                                                     PRA
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     A
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     B
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DR
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DQ
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DP
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     L???c
    //                                                                     huy???t
    //                                                                     t????ng
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thu???c
    //                                                                     UCMD
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Theo d??i
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <tbody>
    //                                                             {entityObjKQ &&
    //                                                             entityObjKQ.length >
    //                                                                 0 ? (
    //                                                                 entityObjKQ.map(
    //                                                                     (
    //                                                                         itm,
    //                                                                         key
    //                                                                     ) => {
    //                                                                         const indx =
    //                                                                             key +
    //                                                                             1;
    //                                                                         return (
    //                                                                             <tr>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         indx
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     <div className="tableBoxMain">
    //                                                                                         <div className="tableBoxMain-label">
    //                                                                                             {CommonUtility.ShowDateVN(
    //                                                                                                 itm.PRANgayThucHien
    //                                                                                             )}
    //                                                                                         </div>
    //                                                                                         <div className="tableBoxMain-btnAction">
    //                                                                                             <Dropdown>
    //                                                                                                 <Dropdown.Toggle
    //                                                                                                     size="sm"
    //                                                                                                     variant=""
    //                                                                                                     className="dropdowTableBtn"
    //                                                                                                 >
    //                                                                                                     <i
    //                                                                                                         className="fa fa-ellipsis-h"
    //                                                                                                         aria-hidden="true"
    //                                                                                                     />
    //                                                                                                 </Dropdown.Toggle>
    //                                                                                                 <Dropdown.Menu>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             onEditEntity(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon">
    //                                                                                                             <i className="fas fa-edit" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             S???a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             DeletePRAAction(
    //                                                                                                                 itm.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon ">
    //                                                                                                             <i className="fas fa-times" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             X??a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                 </Dropdown.Menu>
    //                                                                                             </Dropdown>
    //                                                                                         </div>
    //                                                                                     </div>
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     <>
    //                                                                                         {
    //                                                                                             itm.PRATyLePRALop1
    //                                                                                         }
    //                                                                                         {
    //                                                                                             '% '
    //                                                                                         }

    //                                                                                         -{' '}
    //                                                                                         {
    //                                                                                             itm.PRATyLePRALop2
    //                                                                                         }
    //                                                                                         {
    //                                                                                             '% '
    //                                                                                         }
    //                                                                                     </>
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRAA
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRAB
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRADR
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRADQ
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRADP
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRALocHuyetTuong
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRAThuocUCMD
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itm.PRATheoDoi
    //                                                                                     }
    //                                                                                 </td>
    //                                                                             </tr>
    //                                                                         );
    //                                                                     }
    //                                                                 )
    //                                                             ) : (
    //                                                                 <tr>
    //                                                                     <td
    //                                                                         colSpan={
    //                                                                             12
    //                                                                         }
    //                                                                         className="center"
    //                                                                     >
    //                                                                         Kh??ng
    //                                                                         c??
    //                                                                         d???
    //                                                                         li???u
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             )}
    //                                                         </tbody>
    //                                                     </table>
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="row">
    //                                     <hr />
    //                                     <hr />
    //                                     <hr />
    //                                 </div>
    //                                 <div className="row">
    //                                     <div className="col-md-12">
    //                                         <div className="card">
    //                                             <div className="card-header p-2">
    //                                                 <KQXetNghiemHLAAdm
    //                                                     showCreateKQHLA={
    //                                                         showCreateKQHLA
    //                                                     }
    //                                                     DataKQHLA={DataKQHLA}
    //                                                     setshowCreateKQHLA={
    //                                                         setshowCreateKQHLA
    //                                                     }
    //                                                     setisload={setisload}
    //                                                     LoadData={LoadData}
    //                                                 />

    //                                                 <Button
    //                                                     variant=""
    //                                                     className="btn btn-primary"
    //                                                     size="sm"
    //                                                     onClick={() => {
    //                                                         setshowCreateKQHLA(
    //                                                             true
    //                                                         );
    //                                                         onCreateHLAEntity();
    //                                                     }}
    //                                                 >
    //                                                     <i
    //                                                         className="fa fa-plus"
    //                                                         aria-hidden="true"
    //                                                     />
    //                                                     T???o m???i k???t qu??? HLA
    //                                                 </Button>
    //                                             </div>
    //                                             <div className="card-body nopadding">
    //                                                 <div className="table-responsive">
    //                                                     <table className="table table-hinetNew">
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th
    //                                                                     colSpan={
    //                                                                         12
    //                                                                     }
    //                                                                     className="center red"
    //                                                                 >
    //                                                                     K???t qu???
    //                                                                     x??t
    //                                                                     nghi???m
    //                                                                     HLA
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <thead>
    //                                                             <tr>
    //                                                                 <th>STT</th>
    //                                                                 <th scope="col">
    //                                                                     A
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     {' '}
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     B
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DRB1
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DQA1
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     DQB1
    //                                                                 </th>
    //                                                             </tr>
    //                                                         </thead>
    //                                                         <tbody>
    //                                                             {entityObjKQHLA &&
    //                                                             entityObjKQHLA.length >
    //                                                                 0 ? (
    //                                                                 entityObjKQHLA.map(
    //                                                                     (
    //                                                                         itim,
    //                                                                         key
    //                                                                     ) => {
    //                                                                         const indxof =
    //                                                                             key +
    //                                                                             1;
    //                                                                         return (
    //                                                                             <tr>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         indxof
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itim.HLAA
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     <div className="tableBoxMain">
    //                                                                                         <div className="tableBoxMain-btnAction">
    //                                                                                             <Dropdown>
    //                                                                                                 <Dropdown.Toggle
    //                                                                                                     size="sm"
    //                                                                                                     variant=""
    //                                                                                                     className="dropdowTableBtn"
    //                                                                                                 >
    //                                                                                                     <i
    //                                                                                                         className="fa fa-ellipsis-h"
    //                                                                                                         aria-hidden="true"
    //                                                                                                     />
    //                                                                                                 </Dropdown.Toggle>
    //                                                                                                 <Dropdown.Menu>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             onEditHLAEntity(
    //                                                                                                                 itim.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon">
    //                                                                                                             <i className="fas fa-edit" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             S???a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                     <Dropdown.Item
    //                                                                                                         onClick={() =>
    //                                                                                                             DeleteHLAAction(
    //                                                                                                                 itim.Id
    //                                                                                                             )
    //                                                                                                         }
    //                                                                                                     >
    //                                                                                                         <span className="boxIcon">
    //                                                                                                             <i className="fas fa-times" />
    //                                                                                                         </span>
    //                                                                                                         <span>
    //                                                                                                             X??a
    //                                                                                                         </span>
    //                                                                                                     </Dropdown.Item>
    //                                                                                                 </Dropdown.Menu>
    //                                                                                             </Dropdown>
    //                                                                                         </div>
    //                                                                                     </div>
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itim.HLAB
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itim.HLADRB1
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itim.HLADQA1
    //                                                                                     }
    //                                                                                 </td>
    //                                                                                 <td>
    //                                                                                     {
    //                                                                                         itim.HLADQB1
    //                                                                                     }
    //                                                                                 </td>
    //                                                                             </tr>
    //                                                                         );
    //                                                                     }
    //                                                                 )
    //                                                             ) : (
    //                                                                 <tr>
    //                                                                     <td
    //                                                                         colSpan={
    //                                                                             8
    //                                                                         }
    //                                                                         className="center"
    //                                                                     >
    //                                                                         Kh??ng
    //                                                                         c??
    //                                                                         d???
    //                                                                         li???u
    //                                                                     </td>
    //                                                                 </tr>
    //                                                             )}
    //                                                         </tbody>
    //                                                     </table>
    //                                                 </div>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </Tab>
    //                         <Tab eventKey="hanhchanh" title="I. H??nh Ch??nh">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             I. H??nh ch??nh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">???nh</dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.Avatar !== '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.Avatar}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundUserImage
    //                                                         }
    //                                                         className="imgHinhAnhAccount img-thumbnail"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             Tr???ng th??i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {DangKyChoGhepConstant.GetName(
    //                                                 entityObj.Status
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             ???nh CMND m???t tr?????c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ImgCMNDBNMatTruoc !==
    //                                             '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundCMNDImage
    //                                                         }
    //                                                         className="imgCMND"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             ???nh CMND m???t sau
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ImgCMNDBNMatSau !==
    //                                             '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundCMNDImage
    //                                                         }
    //                                                         className="imgCMND"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             H??? v?? t??n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenBN}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             M?? s??? b???nh nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.MaSo}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Gi???i t??nh
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.GioiTinh === 1
    //                                                 ? 'Nam'
    //                                                 : 'N???'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ng??y sinh
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgaySinh
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nh??m m??u ABO/Rh
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NhomMau1 ? (
    //                                                 <>
    //                                                     {entityObj.NhomMau} /{' '}
    //                                                     {entityObj.NhomMau1}
    //                                                 </>
    //                                             ) : (
    //                                                 entityObj.NhomMau
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             B???o hi???m y t???
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BaoHiemYTe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             ??i???n tho???i
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             ??i???n tho???i Kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai1}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">Email</dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.Email}
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             Tr??nh ????? v??n h??a
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TrinhDoVanHoa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngh??? nghi???p
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNghiep}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngh??? nghi???p b??? sung
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNhiepBoSung}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             ?????a ch??? th?????ng tr??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiThuongChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             X??/ Ph?????ng:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Qu???n/ Huy???n:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyen}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             T???nh/ T.Ph???:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             ?????a ch??? t???m tr??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiTamChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             X??/ Ph?????ng:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXatt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Qu???n/ Huy???n:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyentt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             T???nh/ T.Ph???:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinhtt}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Con th??? m???y trong gia ????nh
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LaConThuMay}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             T??nh tr???ng h??n nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TinhTrangHonNhan ===
    //                                             1
    //                                                 ? '???? c?? gia ????nh'
    //                                                 : '?????c th??n'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             H??? t??n V???/Ch???ng
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenVoChong}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             ??i???n tho???i
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">S??? con</dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.CoMayCon} con (
    //                                             {entityObj.SoConTrai} trai,
    //                                             {entityObj.SoConGai} g??i)
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             L???n nh???t sinh n??m
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LonNhatSinhNam}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nh??? nh???t sinh n??m
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NhoNhatSinhNam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="tinhtrangbenhly"
    //                             title="II. T??nh tr???ng b???nh l??"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             II. T??NH TR???NG B???NH L??
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             1. Nguy??n nh??n d???n ?????n t??nh
    //                                             tr???ng b???nh hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.NguyenNhanSuyThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             2. Sinh thi???t th???n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SinhThietThan === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             K???t qu???
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.KetQuaSinhThietThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             3. Ph??t hi???n suy{' '}
    //                                             {entityObj.TenCoQuan}
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayPhatHienSuyThan
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ch???y th???n nh??n t???o/Th???m ph??n
    //                                             ph??c m???c t???
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayCTNTHoacKhamThamPhanBenhLy
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             N??m ph??t hi???n - CTNT tr??? l???i
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {
    //                                                 entityObj.namphathienctnttrolai
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             S??? l???n ch???y th???n m???t tu???n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoLanCTNTTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             V??o ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CTNTVaoNgay === 1
    //                                                 ? 'Ch???n'
    //                                                 : 'L???'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S??? gi??? m???t l???n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoGioTrenLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Chu k??? th???m ph??n ph??c m???c (s???
    //                                             l???n/ng??y)
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChuKyThamPhan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Th???m ph??n ph??c m???c b???ng m??y
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ThamPhanBangMay === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T???i b???nh vi???n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ThamPhanBangMayTaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TruyenMau === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Bao nhi??u ????n v???
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.BaoNhieuDonViMau}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u l???n cu???i v??o th??ng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Thang}
    //                                         </dd>
    //                                         <dt className="col-sm-2">N??m</dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Nam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th???i ??i???m truy???n m??u
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.thoidiemtruyenmau
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u t???i b???nh vi???n
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhVienTruyenMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             ???? gh??p th???n l???n 1 v??o ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.DaGhepLan1Ngay
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T???i b???nh vi???n
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DaGhepLan1TaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-4">
    //                                             Ng?????i cho th???n
    //                                             (cha/m???/anh/ch???/em?)
    //                                         </dt>
    //                                         <dd className="col-sm-8">
    //                                             {entityObj.NguoiChoThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ch???y th???n nh??n t???o tr??? l???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayChayThanTroLai
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ch???n ??o??n suy ch???c n??ng th???n
    //                                             gh??p
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ChuanDoanSuyThanGhep}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ch???y th???n nh??n t???o/Th???m
    //                                             ph??n ph??c m???c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.CTNTHoacKhamThamPhan
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T???i b???nh vi???n
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ChayThanTroLaiTaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             S??? l?????ng n?????c ti???u/24 gi???
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NuocTieu24h === 1
    //                                                 ? 'C??'
    //                                                 : ' Kh??ng c?? n?????c ti???u'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             L?????ng n?????c ti???u/24 gi???
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoLuongNuocTieu24h}{' '}
    //                                             ml/24h
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Chi???u cao
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChieuCao} cm
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             C??n n???ng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CanNang} kg
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??ang s??? d???ng/ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocDangSuDungNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu???c t???o m??u
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocTaoMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??c s?? ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.BacSiDieuTri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             ??i???n tho???i b??c s??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiBacSi}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             4. B???nh l?? k??m theo
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             <table className="tablebophancho">
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.KhongBiViemGan
    //                                                             }
    //                                                         />
    //                                                         Kh??ng b??? vi??m gan
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViA
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi A
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViB
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi B
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViC
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi C
    //                                                     </td>
    //                                                 </tr>
    //                                                 {entityObj.TruocHoacSauLocMau !==
    //                                                 null ? (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             1
    //                                                                 ? 'Vi??m gan tr?????c l???c m??u'
    //                                                                 : ''}
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             2
    //                                                                 ? 'Vi??m gan sau l???c m??u'
    //                                                                 : ''}
    //                                                         </td>
    //                                                     </tr>
    //                                                 ) : (
    //                                                     <tr>
    //                                                         <td> </td>
    //                                                     </tr>
    //                                                 )}
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             ??i???u tr??? vi??m gan t???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTriViemGanTu}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuocTriViemGan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">B??? lao</dt>
    //                                         {entityObj.TruocHoacSauLocMau !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TruocHoacSauLocMau ===
    //                                                 1
    //                                                     ? 'Lao ph???i'
    //                                                     : 'Kh??ng c?? ti???n c??n lao'}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             B??? lao c?? quan kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaoCoQuanKhac}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? lao t???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiLao
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Th???i gian ??i???u tr???/N??i ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {
    //                                                 entityObj.ThoiGianDieuTriAndNoiDieuTri
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? ????i th??o ???????ng
    //                                         </dt>
    //                                         {entityObj.DaiThaoDuong !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaiThaoDuong ===
    //                                                 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">T???</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiDaiThaoDuong
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {
    //                                                 entityObj.ThuocDieuTriDaiThaoDuong
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? t??ng huy???t ??p
    //                                         </dt>
    //                                         {entityObj.TangHuyetAp !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.TangHuyetAp === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">T???</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiTangHuyetAp
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {entityObj.ThuocDieuTri}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B???nh kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh h??nh hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrang}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             5. Ti???n c??n ngo???i khoa
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             C?? ph???u thu???t tr?????c ???? kh??ng
    //                                         </dt>
    //                                         {entityObj.DaPhauThuat !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaPhauThuat === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayThangPhauThuat
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t t???i
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BenhVienPhauThuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t do b???nh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoPhauThuat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh tr???ng hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHienTai}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             6.Th??i quen
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th??i quen nghi???n r?????u
    //                                         </dt>
    //                                         {entityObj.UongRuouBia !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.UongRuouBia === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             S??? l???n/tu???n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLanTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S??? l?????ng tr??n l???n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLuongLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th??i quen h??t thu???c
    //                                         </dt>
    //                                         {entityObj.HutThuoc !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.HutThuoc === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}

    //                                         <dt className="col-sm-2">
    //                                             S??? ??i???u tr??n ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTrenNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             7. Ti???n c??n gia ????nh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         B???nh th???n:{' '}
    //                                                         {entityObj.BiBenhThan ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh lao:{' '}
    //                                                         {entityObj.BiBenhLao ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh ????i th??o ???????ng:{' '}
    //                                                         {entityObj.BiDaiThaoDuong ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>

    //                                                     <td>
    //                                                         B???nh t??ng huy???t ??p:{' '}
    //                                                         {entityObj.BiTangHuyetAp ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh ung th??:{' '}
    //                                                         {entityObj.BiUngThu ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B???nh kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BiBenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S???ng c??ng ?????a ch???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.SongCungDiaChi === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ng?????i th??n b??? b???nh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NguoiThanBiBenh}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh tr???ng hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {
    //                                                 entityObj.TinhTrangBenhNguoiThanHienTai
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             8. Th??ng tin kh??c
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ngo???i t???ng qu??t
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ngoaitongquat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngo???i ti???t ni???u
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ngoaitietnieu}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti???n c??n ngo???i khoa kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.tiencanngoaikhoakhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">THA</dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(entityObj.THA)}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B???nh l?? tim m???ch
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.benhlytimmach
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             B???nh l?? h??? th???ng ???????ng ti???t ni???u
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.benhlyhethongduongtietnieu
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Sinh con m???y l???n
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.sanhconmaylan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Sinh con l???n cu???i v??o n??m
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.sanhconlancuoivaonam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">CAPD</dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(entityObj.CAPD)}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S??? n??m ??i???u tr??? thay th???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.sonamdieutrithaythe}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             N??m b???t ?????u ??i???u tr??? CTNT-TPPM
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.nambatdaudieutri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ch??? s??? BMI
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.chisoBMI}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th???i gian b???o hi???m y t???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.thoigianBHYT}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             N??m ????ng k??
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NamDK}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ????ng k??
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayDKHien
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             N??m sinh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NamSinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ung th??
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.BiUngThu
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.phauthuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">X??? tr???</dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.xatri
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ho?? tr???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.hoatri
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ghi ch??
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.GhiChu}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             9. Ti???n s??? covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nhi???m covid
    //                                         </dt>
    //                                         {entityObj.NhiemCovid !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhiemCovid ===
    //                                                 true
    //                                                     ? 'Kh??ng'
    //                                                     : 'C?? '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             B??? tr?????c khi ti??m
    //                                         </dt>
    //                                         {entityObj.BiTruocTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiTruocTiem ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? sau khi ti??m
    //                                         </dt>
    //                                         {entityObj.BiSauTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiSauTiem ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng covid
    //                                         </dt>
    //                                         {entityObj.CoTrieuChung !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.CoTrieuChung ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng nh???
    //                                         </dt>
    //                                         {entityObj.TrieuChungNhe !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungNhe ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng trung b??nh
    //                                         </dt>
    //                                         {entityObj.TrieuChungtrungBinh !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungtrungBinh ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch??ng n???ng ph???i nh???p vi???n
    //                                         </dt>
    //                                         {entityObj.NhapVien !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhapVien === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Th???i gian n???m vi???n(ng??y)
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThoiGianNamVien}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th??? m??y
    //                                         </dt>
    //                                         {entityObj.ThoMay !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoMay === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Th??? HFNC
    //                                         </dt>
    //                                         {entityObj.ThoHFNC !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoHFNC === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             10. Ti??m vaccine ng???a covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui1
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine2}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui2
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng2}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine3}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui3
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng3}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="kinhte" title="III. Kinh t???">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh t???
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a b???nh nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapBenhNhan ? (
    //                                                 <>
    //                                                     {' '}
    //                                                     {
    //                                                         entityObj.ThuNhapBenhNhan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a V???/Ch???ng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuNhapVoChongBenhNhan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.ThuNhapVoChongBenhNhan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngh??? nghi???p
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapKhac ? (
    //                                                 <>
    //                                                     {entityObj.ThuNhapKhac}{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti???n chu???n b??? cho vi???c gh??p th???n
    //                                             (c?? s???n)
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.TienChuanBiChoViecGhepThan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.TienChuanBiChoViecGhepThan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                             {/* {ChuyenGiaTien(
    //                                                 entityObj.TienChuanBiChoViecGhepThan
    //                                             )}{' '}
    //                                             VND */}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="lydo"
    //                             title="IV. L?? do ????ng k?? ch??? gh??p"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             IV. L?? do ????ng k?? ch??? gh??p th???n
    //                                             t??? ng?????i hi???n ch???t n??o
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-10">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.KhongCoNguoiNhan
    //                                                             }
    //                                                         />
    //                                                         Kh??ng c?? ng?????i hi???n
    //                                                         th???n
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoBiBenh
    //                                                             }
    //                                                         />
    //                                                         Ng?????i hi???n b??? b???nh
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoKhongHoaHopMau
    //                                                             }
    //                                                         />
    //                                                         Ng?????i hi???n kh??ng h??a
    //                                                         h???p nh??m m??u
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>L?? do kh??c : </td>
    //                                                     <td>
    //                                                         {entityObj.LyDoKhac}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="quanhegiadinh"
    //                             title="V. Quan h??? gia ????nh"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             V. Quan h??? gia ????nh
    //                                         </dt>
    //                                         <dd className="col-sm-12">
    //                                             <table className="table table-striped">
    //                                                 <thead>
    //                                                     <tr>
    //                                                         <th>#</th>
    //                                                         <th>Quan h???</th>
    //                                                         <th>H??? t??n</th>
    //                                                         <th>N??m sinh</th>
    //                                                         <th>Nh??m m??u</th>
    //                                                         <th>
    //                                                             S??? ??i???n tho???i
    //                                                         </th>
    //                                                         <th>
    //                                                             L?? do kh??ng hi???n
    //                                                             ???????c
    //                                                         </th>
    //                                                     </tr>
    //                                                 </thead>
    //                                                 <tbody>
    //                                                     {entityObj.QhGd !=
    //                                                         null &&
    //                                                         entityObj.QhGd.map(
    //                                                             (item, key) => {
    //                                                                 return (
    //                                                                     <tr>
    //                                                                         <td>
    //                                                                             {`${
    //                                                                                 key +
    //                                                                                 1
    //                                                                             }`}
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.QuanHeNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.HoTenNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.NamSinhNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.NhomMauNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.DienThoaiNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.LyDoKhongHien
    //                                                                             }
    //                                                                         </td>
    //                                                                     </tr>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                 </tbody>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="FileDK" title="????ng k?? b???n g???c">
    //                             <ListGroup>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <RenderViewFile
    //                                                 path={
    //                                                     entityObj.DonDKBanCung
    //                                                 }
    //                                             />{' '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>

    //                         <Tab eventKey="lichsuxuly" title="L???ch s??? x??? l??">
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Th???i gian</th>
    //                                         <th>Ng?????i c???p nh???t</th>

    //                                         <th>Ti??u ?????</th>
    //                                         <th>N???i dung</th>
    //                                         <th>Ghi ch??</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {entityObj.historyContentDtos ? (
    //                                         entityObj.historyContentDtos.map(
    //                                             (itm) => {
    //                                                 return (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {CommonUtility.ShowDateTimeVN(
    //                                                                 itm.CreatedDate
    //                                                             )}
    //                                                         </td>
    //                                                         <td>
    //                                                             {itm.CreatedBy}
    //                                                         </td>
    //                                                         <td>{itm.Title}</td>
    //                                                         <td>
    //                                                             {itm.Content}
    //                                                         </td>
    //                                                         <td>
    //                                                             {itm.Comment}
    //                                                         </td>
    //                                                     </tr>
    //                                                 );
    //                                             }
    //                                         )
    //                                     ) : (
    //                                         <tr>
    //                                             <td colSpan={5}>
    //                                                 Kh??ng c?? d??? li???u
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="thongbaoxetnghiem"
    //                             title="TB kh??m v?? l??m x??t nghi???m"
    //                         >
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Th???i gian</th>
    //                                         <th>Ng??y h???n</th>
    //                                         <th>L?? do</th>
    //                                         <th>Tr???ng th??i</th>
    //                                         <th>Th???i gian g???i</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {entityObj.henKhams ? (
    //                                         entityObj.henKhams.map((itm) => {
    //                                             return (
    //                                                 <tr>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateTimeVN(
    //                                                             itm.CreatedDate
    //                                                         )}
    //                                                     </td>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateVN(
    //                                                             itm.NgayHen
    //                                                         )}
    //                                                     </td>
    //                                                     <td>{itm.LyDo}</td>
    //                                                     <td>
    //                                                         {itm.IsSent
    //                                                             ? '???? g???i'
    //                                                             : ''}
    //                                                     </td>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateTimeVN(
    //                                                             itm.TimeSent
    //                                                         )}
    //                                                     </td>
    //                                                 </tr>
    //                                             );
    //                                         })
    //                                     ) : (
    //                                         <tr>
    //                                             <td colSpan={5}>
    //                                                 Kh??ng c?? d??? li???u
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                     </Tabs>
    //                     {/* </Modal.Body>
    //                 <Modal.Footer>
    //                     <Button
    //                         variant="secondary"
    //                         onClick={() => setshowDetailModal(false)}
    //                     >
    //                         ????ng
    //                     </Button>
    //                 </Modal.Footer>
    //             </Modal> */}
    //                 </div>
    //             </>
    //         );
    //     }
    //     return <></>;
    // }
    const renderCheckBox = (value) => {
        if (value === true || value === 1) {
            return <input type="checkbox" disabled checked />;
        }
        return <input type="checkbox" disabled />;
    };
    const DetailModal = () => (
        <>
            <Drawer
                // title="Chi ti???t ????ng k?? ch??? gh??p"
                placement="right"
                size="large"
                onClose={() => setshowDetailModal(false)}
                visible={showDetailModal}
                extra={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Space>
                        <Button onClick={() => setshowDetailModal(false)}>
                            ????ng
                        </Button>
                    </Space>
                }
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Th??ng tin chung" key="1">
                        <Descriptions
                            title="H??nh ch??nh"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="???nh">
                                {entityObj.Avatar !== '' ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.Avatar}`}
                                            alt=""
                                            onError={NotFoundUserImage}
                                            className="imgHinhAnhAccount img-thumbnail"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tr???ng th??i">
                                {DangKyChoGhepConstant.GetName(
                                    entityObj.Status
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="???nh CMND m???t tr?????c">
                                {entityObj.ImgCMNDBNMatTruoc !== null ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
                                            alt=""
                                            onError={NotFoundCMNDImage}
                                            className="imgCMND"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="???nh CMND m???t sau">
                                {entityObj.ImgCMNDBNMatSau !== null ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
                                            alt=""
                                            onError={NotFoundCMNDImage}
                                            className="imgCMND"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="H??? v?? t??n">
                                {entityObj.HoTenBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="M?? s??? b???nh nh??n">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gi???i t??nh">
                                {entityObj.GioiTinh === 1 ? 'Nam' : 'N???'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??m m??u ABO/Rh">
                                {entityObj.NhomMau1 ? (
                                    <>
                                        {entityObj.NhomMau} /{' '}
                                        {entityObj.NhomMau1}
                                    </>
                                ) : (
                                    entityObj.NhomMau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???o hi???m y t???">
                                {entityObj.BaoHiemYTe}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i">
                                {entityObj.DienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" ??i???n tho???i Kh??c">
                                {entityObj.DienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tr??nh ????? v??n h??a">
                                {entityObj.TrinhDoVanHoa}
                            </Descriptions.Item>
                            <Descriptions.Item label="CMND/CCCD/H??? chi???u">
                                {entityObj.CMNDBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y c???p">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayCapCMNDBN
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??i c???p">
                                {entityObj.NoiCapCMNDBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p">
                                {entityObj.NgheNghiep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p b??? sung">
                                {entityObj.NgheNhiepBoSung}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch??? th?????ng tr??">
                                {entityObj.DiaChiThuongChu}
                                {entityObj.TenXa !== null ? ', ' : ''}
                                {entityObj.TenXa !== null
                                    ? entityObj.TenXa
                                    : ''}
                                {entityObj.TenHuyen !== null ? ', ' : ''}
                                {entityObj.TenHuyen !== null
                                    ? entityObj.TenHuyen
                                    : ''}
                                {entityObj.TenTinh !== null ? ', ' : ''}
                                {entityObj.TenTinh !== null
                                    ? entityObj.TenTinh
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch??? t???m tr??">
                                {entityObj.DiaChiTamChu}
                                {entityObj.TenXatt !== null ? ', ' : ''}
                                {entityObj.TenXatt !== null
                                    ? entityObj.TenXatt
                                    : ''}
                                {entityObj.TenHuyentt !== null ? ', ' : ''}
                                {entityObj.TenHuyentt !== null
                                    ? entityObj.TenHuyentt
                                    : ''}
                                {entityObj.TenTinhtt !== null ? ', ' : ''}
                                {entityObj.TenTinhtt !== null
                                    ? entityObj.TenTinhtt
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Con th??? m???y trong gia ????nh">
                                {entityObj.LaConThuMay}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh tr???ng h??n nh??n">
                                {entityObj.TinhTrangHonNhan === 1
                                    ? '???? c?? gia ????nh'
                                    : '?????c th??n'}
                            </Descriptions.Item>
                            <Descriptions.Item label="H??? t??n V???/Ch???ng">
                                {entityObj.HoTenVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i">
                                {entityObj.DienThoaiVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Con">
                                {entityObj.CoMayCon >= 1
                                    ? entityObj.CoMayCon
                                    : '0'}{' '}
                                con:{' '}
                                {entityObj.SoConTrai >= 1
                                    ? entityObj.SoConTrai
                                    : '0'}{' '}
                                trai,{' '}
                                {entityObj.SoConGai >= 1
                                    ? entityObj.SoConGai
                                    : '0'}{' '}
                                g??i
                            </Descriptions.Item>
                            <Descriptions.Item label="L???n nh???t sinh n??m">
                                {entityObj.LonNhatSinhNam}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??? nh???t sinh n??m">
                                {entityObj.NhoNhatSinhNam}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Kinh t???"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="Thu nh???p c???a b???nh nh??n">
                                {entityObj.ThuNhapBenhNhan} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nh???p c???a V???/Ch???ng">
                                {entityObj.ThuNhapVoChongBenhNhan} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p v???/ch???ng">
                                {entityObj.NgheNghiepVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nh???p kh??c">
                                {entityObj.ThuNhapKhac} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti???n chu???n b??? cho vi???c gh??p c?? s???n">
                                {entityObj.TienChuanBiChoViecGhepThan} VND
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="L?? do ????ng k?? ch??? gh??p"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item span={2}>
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.KhongCoNguoiNhan
                                                }
                                            />
                                            Kh??ng c?? ng?????i hi???n{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.NguoiChoBiBenh
                                                }
                                            />
                                            Ng?????i hi???n b??? b???nh
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.NguoiChoKhongHoaHopMau
                                                }
                                            />
                                            Ng?????i hi???n kh??ng h??a h???p nh??m m??u
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>L?? do kh??c : </td>
                                        <td>{entityObj.LyDoKhac}</td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="T??nh tr???ng b???nh l??" key="2">
                        <Descriptions
                            title="T??nh tr???ng b???nh l??"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="1.Nguy??n nh??n d???n ?????n t??nh tr???ng b???nh hi???n t???i">
                                {entityObj.NguyenNhanSuyThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="2. Sinh thi???t th???n">
                                {entityObj.SinhThietThan === 1 ? 'C??' : 'Kh??ng'}
                            </Descriptions.Item>
                            <Descriptions.Item label="K???t qu??? sinh thi???t th???n">
                                {entityObj.KetQuaSinhThietThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="3.Th???i gian ph??t hi???n suy gi???m ch???c n??ng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayPhatHienSuyThan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ch???y th???n nh??n t???o/Th???m ph??n ph??c m???c t???">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??m ph??t hi???n - CTNT tr??? l???i">
                                {entityObj.namphathienctnttrolai}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l???n ch???y th???n m???t tu???n">
                                {entityObj.SoLanCTNTTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="V??o ng??y">
                                {entityObj.CTNTVaoNgay === 1 ? 'Ch???n' : 'L???'}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? gi??? m???t l???n">
                                {entityObj.SoGioTrenLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chu k??? th???m ph??n ph??c m???c (s??? l???n/ng??y)">
                                {entityObj.ChuKyThamPhan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???m ph??n ph??c m???c b???ng m??y">
                                {entityObj.ThamPhanBangMay === 1
                                    ? 'C??'
                                    : 'Kh??ng'}
                            </Descriptions.Item>
                            <Descriptions.Item label="T???i b???nh vi???n">
                                {entityObj.ThamPhanBangMayTaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truy???n m??u">
                                {entityObj.TruyenMau === 1 ? 'C??' : 'Kh??ng'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bao nhi??u ????n v???">
                                {entityObj.BaoNhieuDonViMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian truy???n m??u l???n cu???i ">
                                {entityObj.Thang !== null ? 'th??ng ' : ''}
                                {entityObj.Thang}
                                {entityObj.Nam !== null ? ' n??m ' : ''}
                                {entityObj.Nam !== null ? entityObj.Nam : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i ??i???m truy???n m??u">
                                {CommonUtility.ShowDateVN(
                                    entityObj.thoidiemtruyenmau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truy???n m??u t???i b???nh vi???n">
                                {entityObj.BenhVienTruyenMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="???? gh??p th???n l???n 1 v??o ng??y">
                                {CommonUtility.ShowDateVN(
                                    entityObj.DaGhepLan1Ngay
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh vi???n gh??p th???n">
                                {entityObj.DaGhepLan1TaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng?????i cho th???n(cha/m???/anh/ch???/em?)">
                                {entityObj.NguoiChoThan}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Ng??y ch???y th???n nh??n t???o tr??? l???i">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayChayThanTroLai
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ch???n ??o??n suy ch???c n??ng th???n">
                                {entityObj.ChuanDoanSuyThanGhep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ch???y th???n nh??n t???o/Th???m ph??n ph??c m???c">
                                {CommonUtility.ShowDateVN(
                                    entityObj.CTNTHoacKhamThamPhan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="T???i b???nh vi???n">
                                {entityObj.ChayThanTroLaiTaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l?????ng n?????c ti???u/24 gi???">
                                {entityObj.NuocTieu24h === 1
                                    ? 'C??'
                                    : ' Kh??ng c?? n?????c ti???u'}
                            </Descriptions.Item>
                            <Descriptions.Item label="L?????ng n?????c ti???u/24 gi???">
                                {entityObj.SoLuongNuocTieu24h} ml/24h
                            </Descriptions.Item>
                            <Descriptions.Item label="Chi???u cao">
                                {entityObj.ChieuCao} cm
                            </Descriptions.Item>
                            <Descriptions.Item label="C??n n???ng">
                                {entityObj.CanNang} kg
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??ang s??? d???ng/ng??y">
                                {entityObj.ThuocDangSuDungNgay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c t???o m??u">
                                {entityObj.ThuocTaoMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??c s?? ??i???u tr???">
                                {entityObj.BacSiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i b??c s??">
                                {entityObj.DienThoaiBacSi}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="4. B???nh l?? k??m theo"
                                span={2}
                            >
                                <table className="tablebophancho">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.KhongBiViemGan
                                                }
                                            />
                                            Kh??ng b??? vi??m gan
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViA
                                                }
                                            />
                                            Vi??m gan si??u vi A
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViB
                                                }
                                            />
                                            Vi??m gan si??u vi B
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViC
                                                }
                                            />
                                            Vi??m gan si??u vi C
                                        </td>
                                    </tr>
                                    {entityObj.TruocHoacSauLocMau !== null ? (
                                        <tr>
                                            <td>
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Vi??m gan tr?????c l???c m??u'
                                                    : ''}
                                                {entityObj.TruocHoacSauLocMau ===
                                                2
                                                    ? 'Vi??m gan sau l???c m??u'
                                                    : ''}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td> </td>
                                        </tr>
                                    )}
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???u tr??? vi??m gan t???">
                                {entityObj.DieuTriViemGanTu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocTriViemGan}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao">
                                {entityObj.TruocHoacSauLocMau === 1
                                    ? 'Lao ph???i'
                                    : 'Kh??ng c?? ti???n c??n lao'}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao c?? quan kh??c">
                                {entityObj.LaoCoQuanKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao t???">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiLao
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ??i???u tr???/N??i ??i???u tr???">
                                {entityObj.ThoiGianDieuTriAndNoiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? ????i th??o ???????ng">
                                {entityObj.DaiThaoDuong === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ph??t hi???n ????i th??o ???????ng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocDieuTriDaiThaoDuong}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? t??ng huy???t ??p">
                                {entityObj.TangHuyetAp === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ph??t hi???n t??ng huy???t ??p">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiTangHuyetAp
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh kh??c">
                                {entityObj.BenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh h??nh hi???n t???i">
                                {entityObj.TinhTrang}
                            </Descriptions.Item>
                            <Descriptions.Item label="5. Ti???n c??n ngo???i khoa" />
                            <Descriptions.Item label="C?? ph???u thu???t tr?????c ???? kh??ng">
                                {entityObj.DaPhauThuat === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t ng??y">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayThangPhauThuat
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t t???i">
                                {entityObj.BenhVienPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t do b???nh">
                                {entityObj.CoPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh tr???ng hi???n t???i">
                                {entityObj.TinhTrangHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label="6.Th??i quen " />
                            <Descriptions.Item label="Th??i quen nghi???n r?????u">
                                {entityObj.UongRuouBia === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l???n/tu???n">
                                {entityObj.SoLanTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l?????ng tr??n l???n">
                                {entityObj.SoLuongLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th??i quen h??t thu???c">
                                {entityObj.HutThuoc === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label=" S??? ??i???u tr??n ng??y">
                                {entityObj.DieuTrenNgay}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="7. Ti???n c??n gia ????nh"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            B???nh th???n:{' '}
                                            {entityObj.BiBenhThan === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh lao:{' '}
                                            {entityObj.BiBenhLao === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh ????i th??o ???????ng:{' '}
                                            {entityObj.BiDaiThaoDuong === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh t??ng huy???t ??p:{' '}
                                            {entityObj.BiTangHuyetAp === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh ung th??:{' '}
                                            {entityObj.BiUngThu === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh kh??c">
                                {entityObj.BiBenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="S???ng c??ng ?????a ch???">
                                {entityObj.SongCungDiaChi === 1
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng?????i th??n b??? b??nh">
                                {entityObj.NguoiThanBiBenh}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh tr???ng hi???n t???i">
                                {entityObj.TinhTrangBenhNguoiThanHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label="8. Th??ng tin kh??c" />
                            <Descriptions.Item label="Ngo???i t???ng qu??t">
                                {entityObj.ngoaitongquat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngo???i ti???t ni???u">
                                {entityObj.ngoaitietnieu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti???n c??n ngo???i khoa kh??c">
                                {entityObj.tiencanngoaikhoakhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="THA">
                                {entityObj.THA}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh l?? tim m???ch">
                                {entityObj.benhlytimmach}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh l?? h??? th???ng ???????ng ti???t ni???u">
                                {renderCheckBox(
                                    entityObj.benhlyhethongduongtietnieu
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sinh con m???y l???n">
                                {entityObj.sanhconmaylan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sinh con l???n cu???i v??o n??m">
                                {entityObj.sanhconlancuoivaonam}
                            </Descriptions.Item>
                            <Descriptions.Item label="CAPD">
                                {renderCheckBox(entityObj.CAPD)}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? n??m ??i???u tr??? thay th???">
                                {entityObj.sonamdieutrithaythe}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??m b???t ?????u ??i???u tr??? CTNT-TPPM">
                                {entityObj.nambatdaudieutri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ch??? s??? BMI">
                                {entityObj.chisoBMI}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian b???o hi???m y t???">
                                {entityObj.thoigianBHYT}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ????ng k??">
                                {entityObj.NgayDKHien !== null
                                    ? CommonUtility.ShowDateVN(
                                          entityObj.NgayDKHien
                                      )
                                    : entityObj.NamDK}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ung th??">
                                {renderCheckBox(entityObj.BiUngThu)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t">
                                {entityObj.phauthuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="X??? tr???">
                                {renderCheckBox(entityObj.xatri)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ho?? tr???">
                                {renderCheckBox(entityObj.hoatri)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi ch??">
                                {entityObj.GhiChu}
                            </Descriptions.Item>
                            <Descriptions.Item label=" 9. Ti???n s??? covid" />
                            <Descriptions.Item label=" Nhi???m covid">
                                {entityObj.NhiemCovid === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? tr?????c khi ti??m">
                                {entityObj.BiTruocTiem === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? sau khi ti??m">
                                {entityObj.BiSauTiem === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng covid">
                                {entityObj.CoTrieuChung === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng nh???">
                                {entityObj.TrieuChungNhe === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng trung b??nh">
                                {entityObj.TrieuChungtrungBinh === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch??ng n???ng ph???i nh???p vi???n">
                                {entityObj.NhapVien === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian n???m vi???n(ng??y)">
                                {entityObj.ThoiGianNamVien}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th??? m??y">
                                {entityObj.ThoMay === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th??? HFNC">
                                {entityObj.ThoHFNC === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="9. Ti??m vaccine ng???a covid" />
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 1">
                                {entityObj.TiemVaccine}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 1">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui1
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 1">
                                {entityObj.PhanUng}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 2">
                                {entityObj.TiemVaccine2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 2">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui2
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 2">
                                {entityObj.PhanUng2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 3">
                                {entityObj.TiemVaccine3}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 3">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui3
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 3">
                                {entityObj.PhanUng3}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="K???t qu??? x??t nghi???m" key="3">
                        <>
                            <RenderTabKQXN />
                        </>
                    </TabPane>
                    <TabPane tab="K???t qu??? x??t nghi???m HLA" key="4">
                        <Descriptions
                            title="K???t qu??? x??t nghi???m HLA"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item label="HLA - A">
                                {entityObj.LstHLAA != null &&
                                    entityObj.LstHLAA.map((x) => (
                                        <Tag>{x}</Tag>
                                    ))}
                            </Descriptions.Item>
                            <Descriptions.Item label="HLA - B">
                                {entityObj.LstHLAB != null &&
                                    entityObj.LstHLAB.map((x) => (
                                        <Tag>{x}</Tag>
                                    ))}
                            </Descriptions.Item>
                            <Descriptions.Item label="HLA - DRB1">
                                {entityObj.LstHLADRB1 != null &&
                                    entityObj.LstHLADRB1.map((x) => (
                                        <Tag>{x}</Tag>
                                    ))}
                            </Descriptions.Item>
                            <Descriptions.Item label="HLA - DQA1">
                                {entityObj.LstHLADQA1 != null &&
                                    entityObj.LstHLADQA1.map((x) => (
                                        <Tag>{x}</Tag>
                                    ))}
                            </Descriptions.Item>
                            <Descriptions.Item label="HLA - DQB1">
                                {entityObj.LstHLADQB1 != null &&
                                    entityObj.LstHLADQB1.map((x) => (
                                        <Tag>{x}</Tag>
                                    ))}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Quan h??? gia ????nh" key="5">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Quan h???</th>
                                    <th>H??? t??n</th>
                                    <th>N??m sinh</th>
                                    <th>Nh??m m??u</th>
                                    <th>S??? ??i???n tho???i</th>
                                    <th>L?? do kh??ng hi???n ???????c</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.QhGd != null &&
                                    entityObj.QhGd.map((item, key) => {
                                        return (
                                            <tr>
                                                <td>{`${key + 1}`}</td>
                                                <td>{item.QuanHeNguoiThan}</td>
                                                <td>{item.HoTenNguoiThan}</td>
                                                <td>{item.NamSinhNguoiThan}</td>
                                                <td>{item.NhomMauNguoiThan}</td>
                                                <td>
                                                    {item.DienThoaiNguoiThan}
                                                </td>
                                                <td>{item.LyDoKhongHien}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="TB kh??m v?? l??m x??t nghi???m" key="6">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Th???i gian</th>
                                    <th>Ng??y h???n</th>
                                    <th>L?? do</th>
                                    <th>Tr???ng th??i</th>
                                    <th>Th???i gian g???i</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.henKhams ? (
                                    entityObj.henKhams.map((itm) => {
                                        return (
                                            <tr>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.CreatedDate
                                                    )}
                                                </td>
                                                <td>
                                                    {CommonUtility.ShowDateVN(
                                                        itm.NgayHen
                                                    )}
                                                </td>
                                                <td>{itm.LyDo}</td>
                                                <td>
                                                    {itm.IsSent ? '???? g???i' : ''}
                                                </td>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.TimeSent
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>Kh??ng c?? d??? li???u</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="????ng k?? b???n g???c" key="7">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                    </TabPane>
                    <TabPane tab="L???ch s??? x??? l??" key="8">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Th???i gian</th>
                                    <th>Ng?????i c???p nh???t</th>

                                    <th>Ti??u ?????</th>
                                    <th>N???i dung</th>
                                    <th>Ghi ch??</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.historyContentDtos ? (
                                    entityObj.historyContentDtos.map((itm) => {
                                        return (
                                            <tr>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.CreatedDate
                                                    )}
                                                </td>
                                                <td>
                                                    {itm.CreatedBy}-{' '}
                                                    {itm.CreatedID}
                                                </td>
                                                <td>{itm.Title}</td>
                                                <td>{itm.Content}</td>
                                                <td>{itm.Comment}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>Kh??ng c?? d??? li???u</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                </Tabs>
            </Drawer>
        </>
    );

    const DetailModalKhac = () => (
        <>
            <Drawer
                // title="Chi ti???t ????ng k?? ch??? gh??p"
                placement="right"
                size="large"
                onClose={() => setshowDetailModal(false)}
                visible={showDetailModal}
                extra={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Space>
                        <Button onClick={() => setshowDetailModal(false)}>
                            ????ng
                        </Button>
                    </Space>
                }
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Th??ng tin chung" key="1">
                        <Descriptions
                            title="H??nh ch??nh"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="???nh">
                                {entityObj.Avatar !== '' ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.Avatar}`}
                                            alt=""
                                            onError={NotFoundUserImage}
                                            className="imgHinhAnhAccount img-thumbnail"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tr???ng th??i">
                                {DangKyChoGhepConstant.GetName(
                                    entityObj.Status
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="???nh CMND m???t tr?????c">
                                {entityObj.ImgCMNDMatTruoc !== null ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.ImgCMNDMatTruoc}`}
                                            alt=""
                                            onError={NotFoundCMNDImage}
                                            className="imgCMND"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="???nh CMND m???t sau">
                                {entityObj.ImgCMNDMatSau !== null ? (
                                    <>
                                        <img
                                            src={`${Constant.PathServer}${entityObj.ImgCMNDMatSau}`}
                                            alt=""
                                            onError={NotFoundCMNDImage}
                                            className="imgCMND"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="H??? v?? t??n">
                                {entityObj.HoTenBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="M?? s??? b???nh nh??n">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gi???i t??nh">
                                {entityObj.GioiTinh === 1 ? 'Nam' : 'N???'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??m m??u ABO/Rh">
                                {entityObj.NhomMau1 ? (
                                    <>
                                        {entityObj.NhomMau} /{' '}
                                        {entityObj.NhomMau1}
                                    </>
                                ) : (
                                    entityObj.NhomMau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???o hi???m y t???">
                                {entityObj.BaoHiemYTe}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i">
                                {entityObj.DienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" ??i???n tho???i Kh??c">
                                {entityObj.DienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tr??nh ????? v??n h??a">
                                {entityObj.TrinhDoVanHoa}
                            </Descriptions.Item>
                            <Descriptions.Item label="CMND/CCCD/H??? chi???u">
                                {entityObj.SoCMND}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y c???p">
                                {CommonUtility.ShowDateVN(entityObj.NgayCap)}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??i c???p">
                                {entityObj.NoiCap}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p">
                                {entityObj.NgheNghiep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p b??? sung">
                                {entityObj.NgheNhiepBoSung}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch??? th?????ng tr??">
                                {entityObj.DiaChiThuongChu}
                                {entityObj.TenXa !== null ? ', ' : ''}
                                {entityObj.TenXa !== null
                                    ? entityObj.TenXa
                                    : ''}
                                {entityObj.TenHuyen !== null ? ', ' : ''}
                                {entityObj.TenHuyen !== null
                                    ? entityObj.TenHuyen
                                    : ''}
                                {entityObj.TenTinh !== null ? ', ' : ''}
                                {entityObj.TenTinh !== null
                                    ? entityObj.TenTinh
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch??? t???m tr??">
                                {entityObj.DiaChiTamChu}
                                {entityObj.TenXatt !== null ? ', ' : ''}
                                {entityObj.TenXatt !== null
                                    ? entityObj.TenXatt
                                    : ''}
                                {entityObj.TenHuyentt !== null ? ', ' : ''}
                                {entityObj.TenHuyentt !== null
                                    ? entityObj.TenHuyentt
                                    : ''}
                                {entityObj.TenTinhtt !== null ? ', ' : ''}
                                {entityObj.TenTinhtt !== null
                                    ? entityObj.TenTinhtt
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Con th??? m???y trong gia ????nh">
                                {entityObj.LaConThuMay}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh tr???ng h??n nh??n">
                                {entityObj.TinhTrangHonNhan === 1
                                    ? '???? c?? gia ????nh'
                                    : '?????c th??n'}
                            </Descriptions.Item>
                            <Descriptions.Item label="H??? t??n V???/Ch???ng">
                                {entityObj.HoTenVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i">
                                {entityObj.DienThoaiVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Con">
                                {entityObj.CoMayCon} con: {entityObj.SoConTrai}{' '}
                                trai, {entityObj.SoConGai} g??i
                            </Descriptions.Item>
                            <Descriptions.Item label="L???n nh???t sinh n??m">
                                {entityObj.LonNhatSinhNam}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??? nh???t sinh n??m">
                                {entityObj.NhoNhatSinhNam}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Kinh t???"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="Thu nh???p c???a b???nh nh??n">
                                {entityObj.ThuNhapBenhNhan} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nh???p c???a V???/Ch???ng">
                                {entityObj.ThuNhapVoChongBenhNhan} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngh??? nghi???p v???/ch???ng">
                                {entityObj.NgheNghiepVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nh???p kh??c">
                                {entityObj.ThuNhapKhac} VND/Th??ng
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti???n chu???n b??? cho vi???c gh??p c?? s???n">
                                {entityObj.TienChuanBiChoViecGhepThan} VND
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="L?? do ????ng k?? ch??? gh??p"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item span={2}>
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.KhongCoNguoiNhan
                                                }
                                            />
                                            Kh??ng c?? ng?????i hi???n{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.NguoiChoBiBenh
                                                }
                                            />
                                            Ng?????i hi???n b??? b???nh
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.NguoiChoKhongHoaHopMau
                                                }
                                            />
                                            Ng?????i hi???n kh??ng h??a h???p nh??m m??u
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>L?? do kh??c : </td>
                                        <td>{entityObj.LyDoKhac}</td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="T??nh tr???ng b???nh l??" key="2">
                        <Descriptions
                            title="T??nh tr???ng b???nh l??"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="1.Nguy??n nh??n d???n ?????n t??nh tr???ng b???nh hi???n t???i">
                                {entityObj.NguyenNhanSuyThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="2.Th???i gian ph??t hi???n suy gi???m ch???c n??ng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayPhatHienSuyThan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truy???n m??u">
                                {entityObj.TruyenMau === 1 ? 'C??' : 'Kh??ng'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bao nhi??u ????n v???">
                                {entityObj.BaoNhieuDonViMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian truy???n m??u l???n cu???i ">
                                {entityObj.Thang !== null ? 'th??ng ' : ''}
                                {entityObj.Thang}
                                {entityObj.Nam !== null ? ' n??m ' : ''}
                                {entityObj.Nam !== null ? entityObj.Nam : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truy???n m??u t???i b???nh vi???n">
                                {entityObj.BenhVienTruyenMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chi???u cao">
                                {entityObj.ChieuCao} cm
                            </Descriptions.Item>
                            <Descriptions.Item label="C??n n???ng">
                                {entityObj.CanNang} kg
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??ang s??? d???ng/ng??y">
                                {entityObj.ThuocDangSuDungNgay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c t???o m??u">
                                {entityObj.ThuocTaoMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??c s?? ??i???u tr???">
                                {entityObj.BacSiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i b??c s??">
                                {entityObj.DienThoaiBacSi}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="3. B???nh l?? k??m theo"
                                span={2}
                            >
                                <table className="tablebophancho">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.KhongBiViemGan
                                                }
                                            />
                                            Kh??ng b??? vi??m gan
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViA
                                                }
                                            />
                                            Vi??m gan si??u vi A
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViB
                                                }
                                            />
                                            Vi??m gan si??u vi B
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={
                                                    entityObj.ViemGanSieuViC
                                                }
                                            />
                                            Vi??m gan si??u vi C
                                        </td>
                                    </tr>
                                    {entityObj.TruocHoacSauLocMau !== null ? (
                                        <tr>
                                            <td>
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Vi??m gan tr?????c l???c m??u'
                                                    : ''}
                                                {entityObj.TruocHoacSauLocMau ===
                                                2
                                                    ? 'Vi??m gan sau l???c m??u'
                                                    : ''}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td> </td>
                                        </tr>
                                    )}
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???u tr??? vi??m gan t???">
                                {entityObj.DieuTriViemGanTu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocTriViemGan}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao">
                                {entityObj.TruocHoacSauLocMau === 1
                                    ? 'Lao ph???i'
                                    : 'Kh??ng c?? ti???n c??n lao'}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao c?? quan kh??c">
                                {entityObj.LaoCoQuanKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? lao t???">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiLao
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ??i???u tr???/N??i ??i???u tr???">
                                {entityObj.ThoiGianDieuTriAndNoiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? ????i th??o ???????ng">
                                {entityObj.DaiThaoDuong === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ph??t hi???n ????i th??o ???????ng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocDieuTriDaiThaoDuong}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? t??ng huy???t ??p">
                                {entityObj.TangHuyetAp === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian ph??t hi???n t??ng huy???t ??p">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiTangHuyetAp
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu???c ??i???u tr???">
                                {entityObj.ThuocDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh kh??c">
                                {entityObj.BenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh h??nh hi???n t???i">
                                {entityObj.TinhTrang}
                            </Descriptions.Item>
                            <Descriptions.Item label="4. Ti???n c??n ngo???i khoa" />
                            <Descriptions.Item label="C?? ph???u thu???t tr?????c ???? kh??ng">
                                {entityObj.DaPhauThuat === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t ng??y">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayThangPhauThuat
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t t???i">
                                {entityObj.BenhVienPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???u thu???t do b???nh">
                                {entityObj.CoPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="5.Th??i quen nghi???n r?????u">
                                {entityObj.UongRuouBia === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l???n/tu???n">
                                {entityObj.SoLanTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="S??? l?????ng tr??n l???n">
                                {entityObj.SoLuongLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="6.Th??i quen" />
                            <Descriptions.Item label="Th??i quen h??t thu???c">
                                {entityObj.HutThuoc === 1 ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label=" S??? ??i???u tr??n ng??y">
                                {entityObj.DieuTrenNgay}
                            </Descriptions.Item>
                            <Descriptions.Item />
                            <Descriptions.Item
                                label="7. Ti???n c??n gia ????nh"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            B???nh{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                            :{' '}
                                            {entityObj.BiBenhThan === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh lao:{' '}
                                            {entityObj.BiBenhLao === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh ????i th??o ???????ng:{' '}
                                            {entityObj.BiDaiThaoDuong === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh t??ng huy???t ??p:{' '}
                                            {entityObj.BiTangHuyetAp === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                        <td>
                                            B???nh ung th??:{' '}
                                            {entityObj.BiUngThu === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="B???nh kh??c">
                                {entityObj.BiBenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="S???ng c??ng ?????a ch???">
                                {entityObj.SongCungDiaChi === 1
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng?????i th??n b??? b??nh">
                                {entityObj.NguoiThanBiBenh}
                            </Descriptions.Item>
                            <Descriptions.Item label="T??nh tr???ng hi???n t???i">
                                {entityObj.TinhTrangBenhNguoiThanHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" 8. Ti???n s??? covid" />
                            <Descriptions.Item label=" Nhi???m covid">
                                {entityObj.NhiemCovid === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? tr?????c khi ti??m">
                                {entityObj.BiTruocTiem === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="B??? sau khi ti??m">
                                {entityObj.BiSauTiem === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng covid">
                                {entityObj.CoTrieuChung === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng nh???">
                                {entityObj.TrieuChungNhe === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch???ng trung b??nh">
                                {entityObj.TrieuChungtrungBinh === true
                                    ? 'C??'
                                    : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tri???u ch??ng n???ng ph???i nh???p vi???n">
                                {entityObj.NhapVien === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th???i gian n???m vi???n(ng??y)">
                                {entityObj.ThoiGianNamVien}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th??? m??y">
                                {entityObj.ThoMay === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Th??? HFNC">
                                {entityObj.ThoHFNC === true ? 'C??' : 'Kh??ng '}
                            </Descriptions.Item>
                            <Descriptions.Item label="9. Ti??m vaccine ng???a covid" />
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 1">
                                {entityObj.TiemVaccine}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 1">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui1
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 1">
                                {entityObj.PhanUng}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 2">
                                {entityObj.TiemVaccine2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 2">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui2
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 2">
                                {entityObj.PhanUng2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ti??m vaccine ng???a covid m??i 3">
                                {entityObj.TiemVaccine3}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ti??m m??i 3">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui3
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ph???n ???ng sau ti??m m??i 3">
                                {entityObj.PhanUng3}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Quan h??? gia ????nh" key="3">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Quan h???</th>
                                    <th>H??? t??n</th>
                                    <th>N??m sinh</th>
                                    <th>Nh??m m??u</th>
                                    <th>S??? ??i???n tho???i</th>
                                    <th>L?? do kh??ng hi???n ???????c</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.QhGd != null &&
                                    entityObj.QhGd.map((item, key) => {
                                        return (
                                            <tr>
                                                <td>{`${key + 1}`}</td>
                                                <td>{item.QuanHeNguoiThan}</td>
                                                <td>{item.HoTenNguoiThan}</td>
                                                <td>{item.NamSinhNguoiThan}</td>
                                                <td>{item.NhomMauNguoiThan}</td>
                                                <td>
                                                    {item.DienThoaiNguoiThan}
                                                </td>
                                                <td>{item.LyDoKhongHien}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="TB kh??m v?? l??m x??t nghi???m" key="4">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Th???i gian</th>
                                    <th>Ng??y h???n</th>
                                    <th>L?? do</th>
                                    <th>Tr???ng th??i</th>
                                    <th>Th???i gian g???i</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.henKhams ? (
                                    entityObj.henKhams.map((itm) => {
                                        return (
                                            <tr>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.CreatedDate
                                                    )}
                                                </td>
                                                <td>
                                                    {CommonUtility.ShowDateVN(
                                                        itm.NgayHen
                                                    )}
                                                </td>
                                                <td>{itm.LyDo}</td>
                                                <td>
                                                    {itm.IsSent ? '???? g???i' : ''}
                                                </td>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.TimeSent
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>Kh??ng c?? d??? li???u</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="????ng k?? b???n g???c" key="5">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                    </TabPane>
                    <TabPane tab="L???ch s??? x??? l??" key="6">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Th???i gian</th>
                                    <th>Ng?????i c???p nh???t</th>

                                    <th>Ti??u ?????</th>
                                    <th>N???i dung</th>
                                    <th>Ghi ch??</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entityObj.historyContentDtos ? (
                                    entityObj.historyContentDtos.map((itm) => {
                                        return (
                                            <tr>
                                                <td>
                                                    {CommonUtility.ShowDateTimeVN(
                                                        itm.CreatedDate
                                                    )}
                                                </td>
                                                <td>
                                                    {itm.CreatedBy}-{' '}
                                                    {itm.CreatedID}
                                                </td>
                                                <td>{itm.Title}</td>
                                                <td>{itm.Content}</td>
                                                <td>{itm.Comment}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>Kh??ng c?? d??? li???u</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                </Tabs>
            </Drawer>
        </>
    );

    // function DetailModalKhac() {
    //     const [keytab, setKey] = useState('hanhchanh');
    //     if (entityObj) {
    //         return (
    //             <>
    //                 <div className="table-responsive">
    //                     {/* <Modal
    //                 show={
    //                     showDetailModal &&
    //                     entityObj.TypePhieuDKGhepTang !== 'than'
    //                 }
    //                 dialogClassName="modal-90w"
    //                 onHide={() => setshowDetailModal(false)}
    //             >
    //                 <Modal.Header closeButton>
    //                     <Modal.Title>
    //                         Chi ti???t ????ng k?? ch??? gh??p {entityObj.TenCoQuan}
    //                     </Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body> */}
    //                     <Tabs
    //                         id="controlled-tab-example"
    //                         activeKey={keytab}
    //                         onSelect={(k) => setKey(k)}
    //                         className="mb-3"
    //                     >
    //                         <Tab eventKey="hanhchanh" title="I. H??nh Ch??nh">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             I. H??nh ch??nh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">???nh</dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.Avatar !== '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.Avatar}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundUserImage
    //                                                         }
    //                                                         className="imgHinhAnhAccount img-thumbnail"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tr???ng th??i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {DangKyChoGhepConstant.GetName(
    //                                                 entityObj.Status
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             ???nh CMND m???t tr?????c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ImgCMNDBNMatTruoc !==
    //                                             '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundCMNDImage
    //                                                         }
    //                                                         className="imgCMND"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             ???nh CMND m???t sau
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ImgCMNDBNMatSau !==
    //                                             '' ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
    //                                                         alt=""
    //                                                         onError={
    //                                                             NotFoundCMNDImage
    //                                                         }
    //                                                         className="imgCMND"
    //                                                     />
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             H??? v?? t??n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenBN}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             M?? s??? b???nh nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.MaSo}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Gi???i t??nh
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.GioiTinh === 1
    //                                                 ? 'Nam'
    //                                                 : 'N???'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ng??y sinh
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgaySinh
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nh??m m??u ABO/Rh
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NhomMau1 ? (
    //                                                 <>
    //                                                     {entityObj.NhomMau} /{' '}
    //                                                     {entityObj.NhomMau1}
    //                                                 </>
    //                                             ) : (
    //                                                 entityObj.NhomMau
    //                                             )}
    //                                         </dd>

    //                                         <dt className="col-sm-1">
    //                                             B???o hi???m y t???
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BaoHiemYTe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             ??i???n tho???i
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             ??i???n tho???i kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai1}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">Email</dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.Email}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tr??nh ????? v??n h??a
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TrinhDoVanHoa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngh??? nghi???p
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNghiep}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             {' '}
    //                                             Ngh??? nghi???p b??? sung
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNhiepBoSung}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             ?????a ch??? th?????ng tr??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiThuongChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             X??/ Ph?????ng:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Qu???n/ Huy???n:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyen}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             T???nh/T.Ph???:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             ?????a ch??? t???m tr??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiTamChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             X??/ Ph?????ng:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXatt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Qu???n/ Huy???n:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyentt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             T???nh/T.Ph???:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinhtt}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Con th??? m???y trong gia ????nh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaConThuMay}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh tr???ng h??n nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHonNhan ===
    //                                             1
    //                                                 ? '???? c?? gia ????nh'
    //                                                 : '?????c th??n'}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             H??? t??n V???/Ch???ng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.HoTenVoChong}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             ??i???n tho???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DienThoaiVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">C??</dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoMayCon} con (
    //                                             {entityObj.SoConTrai} trai,
    //                                             {entityObj.SoConGai} g??i)
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             L???n nh???t sinh n??m
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LonNhatSinhNam}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nh??? nh???t sinh n??m
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NhoNhatSinhNam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="tinhtrangbenhly"
    //                             title="II. T??nh tr???ng b???nh l??"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             II. T??NH TR???NG B???NH L??
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             1.Nguy??n nh??n d???n ?????n t??nh tr???ng
    //                                             b???nh hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.NguyenNhanSuyThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             2.Ph??t hi???n suy{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayPhatHienSuyThan
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TruyenMau === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Bao nhi??u ????n v???
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.BaoNhieuDonViMau}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u l???n cu???i v??o th??ng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Thang}
    //                                         </dd>
    //                                         <dt className="col-sm-2">N??m</dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Nam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Truy???n m??u t???i b???nh vi???n
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.BenhVienTruyenMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Chi???u cao
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChieuCao} cm
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             C??n n???ng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CanNang} kg
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??ang s??? d???ng/ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocDangSuDungNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu???c t???o m??u
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocTaoMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??c s?? ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.BacSiDieuTri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             ??i???n tho???i b??c s??
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiBacSi}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             3. B???nh l?? k??m theo
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             <table className="tablebophancho">
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.KhongBiViemGan
    //                                                             }
    //                                                         />
    //                                                         Kh??ng b??? vi??m gan
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViA
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi A
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViB
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi B
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViC
    //                                                             }
    //                                                         />
    //                                                         Vi??m gan si??u vi C
    //                                                     </td>
    //                                                 </tr>
    //                                                 {entityObj.TruocHoacSauLocMau !==
    //                                                 null ? (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             1
    //                                                                 ? 'Vi??m gan tr?????c l???c m??u'
    //                                                                 : ''}
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             2
    //                                                                 ? 'Vi??m gan sau l???c m??u'
    //                                                                 : ''}
    //                                                         </td>
    //                                                     </tr>
    //                                                 ) : (
    //                                                     <tr>
    //                                                         <td> </td>
    //                                                     </tr>
    //                                                 )}
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             ??i???u tr??? vi??m gan t???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTriViemGanTu}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuocTriViemGan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">B??? lao</dt>
    //                                         {entityObj.TruocHoacSauLocMau !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TruocHoacSauLocMau ===
    //                                                 1
    //                                                     ? 'Lao ph???i'
    //                                                     : 'Kh??ng c?? ti???n c??n lao'}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             B??? lao c?? quan kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaoCoQuanKhac}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? lao t???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiLao
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Th???i gian ??i???u tr???/N??i ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {
    //                                                 entityObj.ThoiGianDieuTriAndNoiDieuTri
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? ????i th??o ???????ng
    //                                         </dt>
    //                                         {entityObj.DaiThaoDuong !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaiThaoDuong ===
    //                                                 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">T???</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiDaiThaoDuong
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {
    //                                                 entityObj.ThuocDieuTriDaiThaoDuong
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? t??ng huy???t ??p
    //                                         </dt>
    //                                         {entityObj.TangHuyetAp !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.TangHuyetAp === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">T???</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiTangHuyetAp
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thu???c ??i???u tr???
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {entityObj.ThuocDieuTri}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B???nh kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh h??nh hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrang}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             4. Ti???n c??n ngo???i khoa
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             C?? ph???u thu???t tr?????c ???? kh??ng
    //                                         </dt>
    //                                         {entityObj.DaPhauThuat !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaPhauThuat === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayThangPhauThuat
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t t???i
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BenhVienPhauThuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???u thu???t do b???nh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoPhauThuat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh tr???ng hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHienTai}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             5.Th??i quen nghi???n r?????u
    //                                         </dt>
    //                                         {entityObj.UongRuouBia !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.UongRuouBia === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             S??? l???n/tu???n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLanTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S??? l?????ng tr??n l???n
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLuongLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             6.Th??i quen
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th??i quen h??t thu???c
    //                                         </dt>
    //                                         {entityObj.HutThuoc !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.HutThuoc === 1
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}

    //                                         <dt className="col-sm-2">
    //                                             S??? ??i???u tr??n ng??y
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTrenNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             7. Ti???n c??n gia ????nh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         B???nh{' '}
    //                                                         {String(
    //                                                             entityObj.TenCoQuan
    //                                                         ).toLowerCase()}
    //                                                         :{' '}
    //                                                         {entityObj.BiBenhThan ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh lao:{' '}
    //                                                         {entityObj.BiBenhLao ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh ????i th??o ???????ng:{' '}
    //                                                         {entityObj.BiDaiThaoDuong ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>

    //                                                     <td>
    //                                                         B???nh t??ng huy???t ??p:{' '}
    //                                                         {entityObj.BiTangHuyetAp ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                     <td>
    //                                                         B???nh ung th??:{' '}
    //                                                         {entityObj.BiUngThu ===
    //                                                         1
    //                                                             ? 'C??'
    //                                                             : 'Kh??ng '}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B???nh kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BiBenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             S???ng c??ng ?????a ch???
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.SongCungDiaChi === 1
    //                                                 ? 'C??'
    //                                                 : 'Kh??ng '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ng?????i th??n b??? b??nh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NguoiThanBiBenh}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             T??nh tr???ng hi???n t???i
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {
    //                                                 entityObj.TinhTrangBenhNguoiThanHienTai
    //                                             }
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             8. Ti???n s??? covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nhi???m covid
    //                                         </dt>
    //                                         {entityObj.NhiemCovid !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhiemCovid ===
    //                                                 true
    //                                                     ? 'Kh??ng'
    //                                                     : 'C?? '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             B??? tr?????c khi ti??m
    //                                         </dt>
    //                                         {entityObj.BiTruocTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiTruocTiem ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             B??? sau khi ti??m
    //                                         </dt>
    //                                         {entityObj.BiSauTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiSauTiem ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng covid
    //                                         </dt>
    //                                         {entityObj.CoTrieuChung !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.CoTrieuChung ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng nh???
    //                                         </dt>
    //                                         {entityObj.TrieuChungNhe !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungNhe ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch???ng trung b??nh
    //                                         </dt>
    //                                         {entityObj.TrieuChungtrungBinh !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungtrungBinh ===
    //                                                 true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tri???u ch??ng n???ng ph???i nh???p vi???n
    //                                         </dt>
    //                                         {entityObj.NhapVien !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhapVien === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Th???i gian n???m vi???n(ng??y)
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThoiGianNamVien}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Th??? m??y
    //                                         </dt>
    //                                         {entityObj.ThoMay !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoMay === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Th??? HFNC
    //                                         </dt>
    //                                         {entityObj.ThoHFNC !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoHFNC === true
    //                                                     ? 'C??'
    //                                                     : 'Kh??ng '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             9. Ti??m vaccine ng???a covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui1
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine2}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui2
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng2}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti??m vaccine ng???a covid m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine3}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ng??y ti??m m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayTiemMui3
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ph???n ???ng sau ti??m m??i 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng3}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="kinhte" title="III. Kinh t???">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh t???
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a b???nh nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapBenhNhan ? (
    //                                                 <>
    //                                                     {' '}
    //                                                     {
    //                                                         entityObj.ThuNhapBenhNhan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a V???/Ch???ng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuNhapVoChongBenhNhan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.ThuNhapVoChongBenhNhan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngh??? nghi???p
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapKhac ? (
    //                                                 <>
    //                                                     {entityObj.ThuNhapKhac}{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti???n chu???n b??? cho vi???c gh??p{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             (c?? s???n)
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.TienChuanBiChoViecGhepThan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.TienChuanBiChoViecGhepThan
    //                                                     }{' '}
    //                                                     VND/Th??ng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                             {/* {ChuyenGiaTien(
    //                                                 entityObj.TienChuanBiChoViecGhepThan
    //                                             )}{' '}
    //                                             VND */}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         {/* <Tab eventKey="kinhte" title="III. Kinh t???">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh t???
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a b???nh nh??n
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapBenhNhan
    //                                             )}{' '}
    //                                             VND/Th??ng
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p c???a V???/Ch???ng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapVoChongBenhNhan
    //                                             )}{' '}
    //                                             VND/Th??ng
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngh??? nghi???p
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nh???p kh??c
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapKhac
    //                                             )}{' '}
    //                                             VND/Th??ng
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ti???n chu???n b??? cho vi???c gh??p{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             (c?? s???n)
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.TienChuanBiChoViecGhepThan
    //                                             )}{' '}
    //                                             VND
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab> */}
    //                         <Tab
    //                             eventKey="lydo"
    //                             title="IV. L?? do ????ng k?? ch??? gh??p"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             IV. L?? do ????ng k?? ch??? gh??p{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             t??? ng?????i hi???n ch???t n??o
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-10">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.KhongCoNguoiNhan
    //                                                             }
    //                                                         />
    //                                                         Kh??ng c?? ng?????i hi???n{' '}
    //                                                         {String(
    //                                                             entityObj.TenCoQuan
    //                                                         ).toLowerCase()}
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoBiBenh
    //                                                             }
    //                                                         />
    //                                                         Ng?????i hi???n b??? b???nh
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoKhongHoaHopMau
    //                                                             }
    //                                                         />
    //                                                         Ng?????i hi???n kh??ng h??a
    //                                                         h???p nh??m m??u
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>L?? do kh??c : </td>
    //                                                     <td>
    //                                                         {entityObj.LyDoKhac}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="quanhegiadinh"
    //                             title="V. Quan h??? gia ????nh"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             VI. Quan h??? gia ????nh
    //                                         </dt>
    //                                         <dd className="col-sm-12">
    //                                             <table className="table table-striped">
    //                                                 <thead>
    //                                                     <tr>
    //                                                         <th>#</th>
    //                                                         <th>Quan h???</th>
    //                                                         <th>H??? t??n</th>
    //                                                         <th>N??m sinh</th>
    //                                                         <th>Nh??m m??u</th>
    //                                                         <th>
    //                                                             S??? ??i???n tho???i
    //                                                         </th>
    //                                                         <th>
    //                                                             L?? do kh??ng hi???n
    //                                                             ???????c
    //                                                         </th>
    //                                                     </tr>
    //                                                 </thead>
    //                                                 <tbody>
    //                                                     {entityObj.QhGd !=
    //                                                         null &&
    //                                                         entityObj.QhGd.map(
    //                                                             (item, key) => {
    //                                                                 return (
    //                                                                     <tr>
    //                                                                         <td>
    //                                                                             {`${
    //                                                                                 key +
    //                                                                                 1
    //                                                                             }`}
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.QuanHeNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.HoTenNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.NamSinhNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.NhomMauNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.DienThoaiNguoiThan
    //                                                                             }
    //                                                                         </td>
    //                                                                         <td>
    //                                                                             {
    //                                                                                 item.LyDoKhongHien
    //                                                                             }
    //                                                                         </td>
    //                                                                     </tr>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                 </tbody>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="FileDK" title="????ng k?? b???n g???c">
    //                             <ListGroup>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <RenderViewFile
    //                                                 path={
    //                                                     entityObj.DonDKBanCung
    //                                                 }
    //                                             />{' '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="lichsuxuly" title="L???ch s??? x??? l??">
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Th???i gian</th>
    //                                         <th>Ng?????i c???p nh???t</th>

    //                                         <th>Ti??u ?????</th>
    //                                         <th>N???i dung</th>
    //                                         <th>Ghi ch??</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {entityObj.historyContentDtos ? (
    //                                         entityObj.historyContentDtos.map(
    //                                             (itm) => {
    //                                                 return (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {CommonUtility.ShowDateTimeVN(
    //                                                                 itm.CreatedDate
    //                                                             )}
    //                                                         </td>
    //                                                         <td>
    //                                                             {itm.CreatedBy}
    //                                                         </td>
    //                                                         <td>{itm.Title}</td>
    //                                                         <td>
    //                                                             {itm.Content}
    //                                                         </td>
    //                                                         <td>
    //                                                             {itm.Comment}
    //                                                         </td>
    //                                                     </tr>
    //                                                 );
    //                                             }
    //                                         )
    //                                     ) : (
    //                                         <tr>
    //                                             <td colSpan={5}>
    //                                                 Kh??ng c?? d??? li???u
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="thongbaoxetnghiem"
    //                             title="TB kh??m v?? l??m x??t nghi???m"
    //                         >
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Th???i gian</th>
    //                                         <th>Ng??y h???n</th>
    //                                         <th>L?? do</th>
    //                                         <th>Tr???ng th??i</th>
    //                                         <th>Th???i gian g???i</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {entityObj.henKhams ? (
    //                                         entityObj.henKhams.map((itm) => {
    //                                             return (
    //                                                 <tr>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateTimeVN(
    //                                                             itm.CreatedDate
    //                                                         )}
    //                                                     </td>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateVN(
    //                                                             itm.NgayHen
    //                                                         )}
    //                                                     </td>
    //                                                     <td>{itm.LyDo}</td>
    //                                                     <td>
    //                                                         {itm.IsSent
    //                                                             ? '???? g???i'
    //                                                             : ''}
    //                                                     </td>
    //                                                     <td>
    //                                                         {CommonUtility.ShowDateTimeVN(
    //                                                             itm.TimeSent
    //                                                         )}
    //                                                     </td>
    //                                                 </tr>
    //                                             );
    //                                         })
    //                                     ) : (
    //                                         <tr>
    //                                             <td colSpan={5}>
    //                                                 Kh??ng c?? d??? li???u
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                     </Tabs>
    //                     {/* </Modal.Body>
    //                 <Modal.Footer>
    //                     <Button
    //                         variant="secondary"
    //                         onClick={() => setshowDetailModal(false)}
    //                     >
    //                         ????ng
    //                     </Button>
    //                 </Modal.Footer>
    //             </Modal> */}
    //                 </div>
    //             </>
    //         );
    //     }
    //     return <></>;
    // }

    const RenderGioiTinh = (gt) => {
        switch (gt) {
            case 0:
                return 'N???';
            case 1:
                return 'Nam';
            default:
                return '';
        }
    };

    return (
        <>
            {entityObj !== null && entityObj.TypePhieuDKGhepTang === 'than' ? (
                <DetailModal />
            ) : (
                <DetailModalKhac />
            )}
        </>
    );
};

export default DangKyChoGhepTangDetailAdm;
