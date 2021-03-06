/* eslint-disable no-unused-expressions */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as antd from 'antd';
import {SearchOutlined, DeleteOutlined} from '@ant-design/icons';

import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import axios from 'axios';
import {
    Modal,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tab
} from 'react-bootstrap';
import {Link, StaticRouter, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';
import {
    DANGKYHIENTANG_CLOSE_VIEWDETAIL,
    DANGKYHIENTANG_CLOSE_VIEWEDIT,
    DANGKYHIENTANG_EDIT_CLOSE,
    DANGKYHIENTANG_SEARCH_SAVE,
    DANGKYHIENTANG_CHANGESTATUS_CLOSE
} from '@app/store/ActionType/DangKyHienTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong,
    RenderTenTinh,
    RenderTenQuanhuyen,
    RenderTenXaphuong
} from '@modules/Common/LoadDiachi';
import ReactLoading from 'react-loading';
import * as KQXetNghiemVGBService from '@app/services/KQXetNghiemHienVGBService';
import * as KQXetNghiemVGCService from '@app/services/KQXetNghiemHienVGCService';
import KQXetNghiemVGBAdm from './KQXetNghiemHienVGBAdm';
import KQXetNghiemVGCAdm from './KQXetNghiemHienVGCAdm';

import AdminSecsionHead from '../AdminSecsionHead';
import DangKyHienEditAdm from './DangKyHienEditAdm';
import DangKyHienCreateAdm from './DangKyHienCreateAdm';
import DangKyHienSearchAdm from './DangKyHienSearchAdm';

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
const DangKyHienDetailAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {
        entityObj,
        showDetailModal,
        onCloseEntityModal,
        setshowDetailModal
    } = props;

    const {TabPane} = Tabs;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;

    function RenderTabKQXN() {
        const [DataKQVGB, setDataKQVGB] = useState({});
        const [DataKQVGC, setDataKQVGC] = useState({});

        const [showCreateKQVGB, setshowCreateKQVGB] = useState();
        const [entityObjKQVGB, setEntityObjKQVGB] = useState([]);
        const [showCreateKQVGC, setshowCreateKQVGC] = useState();
        const [entityObjKQVGC, setEntityObjKQVGC] = useState([]);
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
        const LoadData = () => {
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
        };
        useEffect(() => {
            let isUnmount = false;

            LoadData();

            return () => {
                isUnmount = true;
            };
        }, []);

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

        const columns = [
            {
                title: 'STT',
                key: 'STT',
                render: (text, record, index) => <div>dsd</div>
            },
            {
                title: 'Ng??y th???c hi???n',
                key: 'NgayThucHien',
                render: (text, record, index) => (
                    <div>
                        {CommonUtility.ShowDateVN(record.NgayXetNghiemVGB)}
                    </div>
                )
            },
            {
                title: 'Vi??n gan B',
                key: 'ViemGanB',
                render: (text, record, index) => {
                    record.CoBiVGB === true ? 'D????ng t??nh' : '??m t??nh';
                }
            },
            {
                title: '??inh l?????ng HBV-DNA(copies/ml)',
                key: 'DInhLuong',
                render: (text, record, index) => {
                    record.KetQuaCopiesVGB;
                }
            },
            {
                title: 'B??? vi??m gan',
                key: 'BiViemGan',
                render: (text, record, index) => <div>{record.BiBaoGioVGB}</div>
            },
            {
                title: '??i???u Tr???',
                key: 'DieuTri',
                render: (text, record, index) => (
                    <div>{record.CoDieuTriVGB === true ? 'C??' : 'Kh??ng'}</div>
                )
            },
            {
                title: 'Thu???c ??i???u tr???',
                key: 'ThuocDieuTri',
                render: (text, record, index) => (
                    <div>{record.ThuocDieuTriVGB}</div>
                )
            },
            {
                title: 'Ng??y b???t ?????u ??i???u tr???',
                key: 'NgayBatDau',
                render: (text, record, index) => (
                    <div>
                        {' '}
                        {CommonUtility.ShowDateVN(record.NgayBatDauDieuTriVGB)}
                    </div>
                )
            },
            {
                title: 'Ng??y k???t th??c ??i???u tr???',
                key: 'NgayKetThuc',
                render: (text, record, index) => (
                    <div>
                        {CommonUtility.ShowDateVN(record.NgayKetThucDieuTriVGB)}
                    </div>
                )
            }
        ];
        return (
            <>
                <Table
                    rowKey="Id"
                    columns={columns}
                    bordered
                    title={() => 'K???t qu??? x??t nghi???m vi??m gan B'}
                    dataSource={entityObjKQVGB}
                />
                {/* <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <KQXetNghiemVGBAdm
                                        showCreateKQVGB={showCreateKQVGB}
                                        DataKQVGB={DataKQVGB}
                                        setshowCreateKQVGB={setshowCreateKQVGB}
                                        // setisload={setisload}
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
                    </div> */}
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
                                    // setisload={setisload}
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
                                                    K???t qu??? x??t nghi???m vi??m gan
                                                    C
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
                                                <th scope="col">Vi??m gan C</th>
                                                <th scope="col">
                                                    ?????nh l?????ng HBV-DNA
                                                    (copies/ml)
                                                </th>
                                                <th scope="col">B??? vi??m gan</th>
                                                <th scope="col">??i???u tr???</th>
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
                                                        const indx = key + 1;
                                                        return (
                                                            <tr>
                                                                <td>{indx}</td>
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
                {/* </div> */}
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
    const DetailModal = () => (
        <>
            <Drawer
                title="Chi ti???t ????ng k?? hi???n t???ng"
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
                    <TabPane tab="Th??ng tin c?? b???n" key="1">
                        <Descriptions
                            title="Th??ng tin chi ti???t"
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
                            <Descriptions.Item label="H??? v?? t??n">
                                {entityObj.HoTen}
                            </Descriptions.Item>
                            <Descriptions.Item label="M?? s??? ">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gi???i t??nh">
                                {entityObj.GioiTinhTxt}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chi???u cao">
                                {entityObj.ChieuCao &&
                                    `${entityObj.ChieuCao} Cm`}
                            </Descriptions.Item>
                            <Descriptions.Item label="C??n n???ng">
                                {entityObj.CanNang && `${entityObj.CanNang} Kg`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??m m??u ABO">
                                {entityObj.NhomMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nh??m m??u RH">
                                {entityObj.NhomMau1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??m sinh">
                                {entityObj.NamSinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ng??y ????ng k??">
                                {CommonUtility.ShowDateVN(entityObj.NgayDK)}
                            </Descriptions.Item>
                            <Descriptions.Item label="N??m ????ng k??">
                                {entityObj.NamDK}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi ch??">
                                {entityObj.GhiChu}
                            </Descriptions.Item>
                            <Descriptions.Item label="??i???n tho???i">
                                {entityObj.SoDienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" ??i???n tho???i Kh??c">
                                {entityObj.SoDienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch??? th?????ng tr??">
                                {entityObj.DiaChi}
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
                            <Descriptions.Item label="?????a ch??? nh???n th??? ????ng k??">
                                {entityObj.DiaChiNhanTheDangKy}
                                {entityObj.TenXaNhanThe !== null ? ', ' : ''}
                                {entityObj.TenXaNhanThe !== null
                                    ? entityObj.TenXaNhanThe
                                    : ''}
                                {entityObj.TenHuyenNhanThe !== null ? ', ' : ''}
                                {entityObj.TenHuyenNhanThe !== null
                                    ? entityObj.TenHuyenNhanThe
                                    : ''}
                                {entityObj.TenTinhNhanThe !== null ? ', ' : ''}
                                {entityObj.TenTinhNhanThe !== null
                                    ? entityObj.TenTinhNhanThe
                                    : ''}
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
                            <Descriptions.Item label="N??i c??ng t??c(n???u c??)">
                                {entityObj.NoiCongTac}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="B??? ph???n c?? th??? t??nh nguy???n s???
                                                 hi???n sau khi ch???t"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Than}
                                            />
                                            Th???n
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Gan}
                                            />
                                            Gan
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.TuyTang}
                                            />
                                            T???y t???ng
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Tim}
                                            />
                                            Tim
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Phoi}
                                            />
                                            Ph???i
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Ruot}
                                            />
                                            Ru???t
                                        </td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Da}
                                            />
                                            Da
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.GiacMac}
                                            />
                                            Gi??c m???c
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Xuong}
                                            />
                                            Chi th???
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.MachMau}
                                            />
                                            M???ch m??u
                                        </td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.VanTim}
                                            />
                                            Van tim
                                        </td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.ChiThe}
                                            />
                                            Chi th???
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Di nguy???n v??? vi???c x??? l?? c?? th???
                                          sau khi hi???n m?? t???ng)"
                            >
                                {entityObj.DiNguyen}
                                {entityObj.DiNguyenKhac !== null ? ', ' : ''}
                                {entityObj.DiNguyenKhac !== null
                                    ? entityObj.DiNguyenKhac
                                    : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="K???t qu??? x??t nghi???m HLA" key="2">
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
                    <TabPane tab="K???t qu??? x??t nghi???m" key="3">
                        <>
                            <RenderTabKQXN />
                        </>
                    </TabPane>
                    <TabPane tab="????ng k?? b???n g???c" key="4">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                        {/* <Descriptions
                            title="????n ????ng k?? b???n g???c"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item>
                                
                            </Descriptions.Item>
                        </Descriptions> */}
                    </TabPane>
                    <TabPane tab="L???ch s??? x??? l??" key="5">
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

    return (
        <>
            <DetailModal />
        </>
    );
};

export default DangKyHienDetailAdm;
