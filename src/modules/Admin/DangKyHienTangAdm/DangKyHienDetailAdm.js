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
                title: 'Xác nhận xóa?',
                message: 'Bạn chắc chắn muốn xóa bỏ kết quả viêm gan B này.',
                buttons: [
                    {
                        label: 'Xác nhận',
                        onClick: () => {
                            KQXetNghiemVGBService.DeleteEntity(idKQ).then(
                                (x) => {
                                    LoadData();
                                }
                            );
                        }
                    },
                    {
                        label: 'Đóng',
                        onClick: () => {}
                    }
                ]
            });
        };
        const DeleteVGCAction = (idKQ) => {
            confirmAlert({
                title: 'Xác nhận xóa?',
                message: 'Bạn chắc chắn muốn xóa bỏ kết quả viêm gan C này.',
                buttons: [
                    {
                        label: 'Xác nhận',
                        onClick: () => {
                            KQXetNghiemVGCService.DeleteEntity(idKQ).then(
                                (x) => {
                                    LoadData();
                                }
                            );
                        }
                    },
                    {
                        label: 'Đóng',
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
                title: 'Ngày thực hiện',
                key: 'NgayThucHien',
                render: (text, record, index) => (
                    <div>
                        {CommonUtility.ShowDateVN(record.NgayXetNghiemVGB)}
                    </div>
                )
            },
            {
                title: 'Viên gan B',
                key: 'ViemGanB',
                render: (text, record, index) => {
                    record.CoBiVGB === true ? 'Dương tính' : 'Âm tính';
                }
            },
            {
                title: 'Đinh lượng HBV-DNA(copies/ml)',
                key: 'DInhLuong',
                render: (text, record, index) => {
                    record.KetQuaCopiesVGB;
                }
            },
            {
                title: 'Bị viêm gan',
                key: 'BiViemGan',
                render: (text, record, index) => <div>{record.BiBaoGioVGB}</div>
            },
            {
                title: 'Điều Trị',
                key: 'DieuTri',
                render: (text, record, index) => (
                    <div>{record.CoDieuTriVGB === true ? 'Có' : 'Không'}</div>
                )
            },
            {
                title: 'Thuốc điều trị',
                key: 'ThuocDieuTri',
                render: (text, record, index) => (
                    <div>{record.ThuocDieuTriVGB}</div>
                )
            },
            {
                title: 'Ngày bắt đầu điều trị',
                key: 'NgayBatDau',
                render: (text, record, index) => (
                    <div>
                        {' '}
                        {CommonUtility.ShowDateVN(record.NgayBatDauDieuTriVGB)}
                    </div>
                )
            },
            {
                title: 'Ngày kết thúc điều trị',
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
                    title={() => 'Kết quả xét nghiệm viêm gan B'}
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
                                        Tạo mới kết quả viêm gan B
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
                                                        Kết quả xét nghiệm viêm
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
                                                        Ngày thực hiện
                                                    </th>
                                                    <th scope="col">
                                                        Viêm gan B
                                                    </th>
                                                    <th scope="col">
                                                        Định lượng HBV-DNA
                                                        (copies/ml)
                                                    </th>
                                                    <th scope="col">
                                                        Bị viêm gan
                                                    </th>
                                                    <th scope="col">
                                                        Điều trị
                                                    </th>
                                                    <th scope="col">
                                                        Thuốc điều trị
                                                    </th>
                                                    <th scope="col">
                                                        Ngày bắt đầu điều trị
                                                    </th>
                                                    <th scope="col">
                                                        Ngày kết thúc điều trị
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
                                                                                                Sửa
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
                                                                                                Xóa
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
                                                                            ? 'Dương tính'
                                                                            : 'Âm tính'}
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
                                                                            ? 'Có'
                                                                            : 'Không'}
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
                                                            Không có dữ liệu
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
                                    Tạo mới kết quả viêm gan C
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
                                                    Kết quả xét nghiệm viêm gan
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
                                                    Ngày thực hiện
                                                </th>
                                                <th scope="col">Viêm gan C</th>
                                                <th scope="col">
                                                    Định lượng HBV-DNA
                                                    (copies/ml)
                                                </th>
                                                <th scope="col">Bị viêm gan</th>
                                                <th scope="col">Điều trị</th>
                                                <th scope="col">
                                                    Thuốc điều trị
                                                </th>
                                                <th scope="col">
                                                    Ngày bắt đầu điều trị
                                                </th>
                                                <th scope="col">
                                                    Ngày kết thúc điều trị
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
                                                                                            Sửa
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
                                                                                            Xóa
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
                                                                        ? 'Dương tính'
                                                                        : 'Âm tính'}
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
                                                                        ? 'Có'
                                                                        : 'Không'}
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
                                                        Không có dữ liệu
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
                title="Chi tiết đăng ký hiến tạng"
                placement="right"
                size="large"
                onClose={() => setshowDetailModal(false)}
                visible={showDetailModal}
                extra={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Space>
                        <Button onClick={() => setshowDetailModal(false)}>
                            Đóng
                        </Button>
                    </Space>
                }
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Thông tin cơ bản" key="1">
                        <Descriptions
                            title="Thông tin chi tiết"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="Ảnh">
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
                            <Descriptions.Item label="Họ và tên">
                                {entityObj.HoTen}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã số ">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {entityObj.GioiTinhTxt}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chiều cao">
                                {entityObj.ChieuCao &&
                                    `${entityObj.ChieuCao} Cm`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cân nặng">
                                {entityObj.CanNang && `${entityObj.CanNang} Kg`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm máu ABO">
                                {entityObj.NhomMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm máu RH">
                                {entityObj.NhomMau1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm sinh">
                                {entityObj.NamSinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đăng ký">
                                {CommonUtility.ShowDateVN(entityObj.NgayDK)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm đăng ký">
                                {entityObj.NamDK}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">
                                {entityObj.GhiChu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                {entityObj.SoDienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Điện thoại Khác">
                                {entityObj.SoDienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ thường trú">
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
                            <Descriptions.Item label="Địa chỉ nhận thẻ đăng ký">
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
                            <Descriptions.Item label="Ảnh CMND mặt trước">
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
                            <Descriptions.Item label="Ảnh CMND mặt sau">
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
                            <Descriptions.Item label="CMND/CCCD/Hộ chiếu">
                                {entityObj.SoCMND}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày cấp">
                                {CommonUtility.ShowDateVN(entityObj.NgayCap)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nơi cấp">
                                {entityObj.NoiCap}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghề nghiệp">
                                {entityObj.NgheNghiep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghề nghiệp bổ sung">
                                {entityObj.NgheNhiepBoSung}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nơi công tác(nếu có)">
                                {entityObj.NoiCongTac}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Bộ phận cơ thể tình nguyện sẽ
                                                 hiến sau khi chết"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Than}
                                            />
                                            Thận
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
                                            Tụy tạng
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
                                            Phổi
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Ruot}
                                            />
                                            Ruột
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
                                            Giác mạc
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.Xuong}
                                            />
                                            Chi thể
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={entityObj.MachMau}
                                            />
                                            Mạch máu
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
                                            Chi thể
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Di nguyện về việc xử lý cơ thể
                                          sau khi hiến mô tạng)"
                            >
                                {entityObj.DiNguyen}
                                {entityObj.DiNguyenKhac !== null ? ', ' : ''}
                                {entityObj.DiNguyenKhac !== null
                                    ? entityObj.DiNguyenKhac
                                    : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Kết quả xét nghiệm HLA" key="2">
                        <Descriptions
                            title="Kết quả xét nghiệm HLA"
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
                    <TabPane tab="Kết quả xét nghiệm" key="3">
                        <>
                            <RenderTabKQXN />
                        </>
                    </TabPane>
                    <TabPane tab="Đăng ký bản gốc" key="4">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                        {/* <Descriptions
                            title="Đơn đăng ký bản gốc"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item>
                                
                            </Descriptions.Item>
                        </Descriptions> */}
                    </TabPane>
                    <TabPane tab="Lịch sử xử lý" key="5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Người cập nhật</th>

                                    <th>Tiêu đề</th>
                                    <th>Nội dung</th>
                                    <th>Ghi chú</th>
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
                                        <td colSpan={5}>Không có dữ liệu</td>
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
