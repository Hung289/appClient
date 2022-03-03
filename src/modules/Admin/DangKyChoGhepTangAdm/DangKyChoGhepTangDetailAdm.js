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
        Table
    } = antd;
    const {TabPane} = Tabs;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    const {showDetailModal, entityObj, setshowDetailModal} = props;

    const [DataKQ, setDataKQ] = useState({});
    const [DataKQHLA, setDataKQHLA] = useState({});
    const [DataKQVGB, setDataKQVGB] = useState({});
    const [DataKQVGC, setDataKQVGC] = useState({});

    const [showCreateKQVGB, setshowCreateKQVGB] = useState();

    const [entityObjKQVGB, setEntityObjKQVGB] = useState({});
    const [showCreateKQVGC, setshowCreateKQVGC] = useState();

    const [entityObjKQVGC, setEntityObjKQVGC] = useState({});

    const [showCreateKQHLA, setshowCreateKQHLA] = useState();

    const [entityObjKQHLA, setEntityObjKQHLA] = useState({});

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
    const onCreateHLAEntity = () => {
        setDataKQHLA({IdPhieu: entityObj.Id});
        setshowCreateKQHLA(true);
    };
    const onEditHLAEntity = async (idKq) => {
        KQXetNghiemHLAService.OpenEditModalSV(idKq).then((a) => {
            setDataKQHLA(a.Data);
            setshowCreateKQHLA(true);
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
        KQXetNghiemHLAService.GetKQXetNghiem(entityObj.Id).then((rs) => {
            if (rs.Status) {
                setEntityObjKQHLA(rs.Data);
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
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ kết quả PRA này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        KQXetNghiemPRAService.DeleteEntity(idKQ).then((x) => {
                            LoadData();
                        });
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteVGBAction = (idKQ) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ kết quả viêm gan B này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        KQXetNghiemVGBService.DeleteEntity(idKQ).then((x) => {
                            LoadData();
                        });
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
                        KQXetNghiemVGCService.DeleteEntity(idKQ).then((x) => {
                            LoadData();
                        });
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DeleteHLAAction = (idKQ) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ kết quả HLA này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        KQXetNghiemHLAService.DeleteEntity(idKQ).then((x) => {
                            LoadData();
                        });
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
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
    //                         Chi tiết đăng ký chờ ghép {entityObj.TenCoQuan}
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
    //                             title="Kết quả xét nghiệm"
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
    //                                                     Tạo mới kết quả viêm gan
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
    //                                                                     Kết quả
    //                                                                     xét
    //                                                                     nghiệm
    //                                                                     viêm gan
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
    //                                                                     Ngày
    //                                                                     thực
    //                                                                     hiện
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Viêm gan
    //                                                                     B
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Định
    //                                                                     lượng
    //                                                                     HBV-DNA
    //                                                                     (copies/ml)
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Bị viêm
    //                                                                     gan
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Điều trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thuốc
    //                                                                     điều trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ngày bắt
    //                                                                     đầu điều
    //                                                                     trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ngày kết
    //                                                                     thúc
    //                                                                     điều trị
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
    //                                                                                                             Sửa
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
    //                                                                                                             Xóa
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
    //                                                                                         ? 'Dương tính'
    //                                                                                         : 'Âm tính'}
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
    //                                                                                         ? 'Có'
    //                                                                                         : 'Không'}
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
    //                                                                         Không
    //                                                                         có
    //                                                                         dữ
    //                                                                         liệu
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
    //                                                     Tạo mới kết quả viêm gan
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
    //                                                                     Kết quả
    //                                                                     xét
    //                                                                     nghiệm
    //                                                                     viêm gan
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
    //                                                                     Ngày
    //                                                                     thực
    //                                                                     hiện
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Viêm gan
    //                                                                     C
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Định
    //                                                                     lượng
    //                                                                     HBV-DNA
    //                                                                     (copies/ml)
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Bị viêm
    //                                                                     gan
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Điều trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thuốc
    //                                                                     điều trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ngày bắt
    //                                                                     đầu điều
    //                                                                     trị
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Ngày kết
    //                                                                     thúc
    //                                                                     điều trị
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
    //                                                                                                             Sửa
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
    //                                                                                                             Xóa
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
    //                                                                                         ? 'Dương tính'
    //                                                                                         : 'Âm tính'}
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
    //                                                                                         ? 'Có'
    //                                                                                         : 'Không'}
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
    //                                                                         Không
    //                                                                         có
    //                                                                         dữ
    //                                                                         liệu
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
    //                                                     Tạo mới kết quả PRA
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
    //                                                                     Kết quả
    //                                                                     xét
    //                                                                     nghiệm
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
    //                                                                     Ngày
    //                                                                     thực
    //                                                                     hiện
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Tỷ lệ
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
    //                                                                     Lọc
    //                                                                     huyết
    //                                                                     tương
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Thuốc
    //                                                                     UCMD
    //                                                                 </th>
    //                                                                 <th scope="col">
    //                                                                     Theo dõi
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
    //                                                                                                             Sửa
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
    //                                                                                                             Xóa
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
    //                                                                         Không
    //                                                                         có
    //                                                                         dữ
    //                                                                         liệu
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
    //                                                     Tạo mới kết quả HLA
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
    //                                                                     Kết quả
    //                                                                     xét
    //                                                                     nghiệm
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
    //                                                                                                             Sửa
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
    //                                                                                                             Xóa
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
    //                                                                         Không
    //                                                                         có
    //                                                                         dữ
    //                                                                         liệu
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
    //                         <Tab eventKey="hanhchanh" title="I. Hành Chánh">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             I. Hành chánh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Ảnh</dt>
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
    //                                             Trạng thái
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
    //                                             Ảnh CMND mặt trước
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
    //                                             Ảnh CMND mặt sau
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
    //                                             Họ và tên
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenBN}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Mã số bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.MaSo}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Giới tính
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.GioiTinh === 1
    //                                                 ? 'Nam'
    //                                                 : 'Nữ'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngày sinh
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
    //                                             Nhóm máu ABO/Rh
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
    //                                             Bảo hiểm y tế
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BaoHiemYTe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Điện thoại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Điện thoại Khác
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
    //                                             Trình độ văn hóa
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TrinhDoVanHoa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNghiep}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Nghề nghiệp bổ sung
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNhiepBoSung}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Địa chỉ thường trú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiThuongChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Xã/ Phường:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Quận/ Huyện:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyen}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tỉnh/ T.Phố:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Địa chỉ tạm trú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiTamChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Xã/ Phường:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXatt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Quận/ Huyện:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyentt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tỉnh/ T.Phố:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinhtt}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Con thứ mấy trong gia đình
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LaConThuMay}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tình trạng hôn nhân
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TinhTrangHonNhan ===
    //                                             1
    //                                                 ? 'Đã có gia đình'
    //                                                 : 'Độc thân'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Họ tên Vợ/Chồng
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenVoChong}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Điện thoại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">Số con</dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.CoMayCon} con (
    //                                             {entityObj.SoConTrai} trai,
    //                                             {entityObj.SoConGai} gái)
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             Lớn nhất sinh năm
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LonNhatSinhNam}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nhỏ nhất sinh năm
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
    //                             title="II. Tình trạng bệnh lý"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             II. TÌNH TRẠNG BỆNH LÝ
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             1. Nguyên nhân dẫn đến tình
    //                                             trạng bệnh hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.NguyenNhanSuyThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             2. Sinh thiết thận
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SinhThietThan === 1
    //                                                 ? 'Có'
    //                                                 : 'Không'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Kết quả
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.KetQuaSinhThietThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             3. Phát hiện suy{' '}
    //                                             {entityObj.TenCoQuan}
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayPhatHienSuyThan
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Chạy thận nhân tạo/Thẩm phân
    //                                             phúc mạc từ
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayCTNTHoacKhamThamPhanBenhLy
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Năm phát hiện - CTNT trở lại
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
    //                                             Số lần chạy thận một tuần
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoLanCTNTTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Vào ngày
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CTNTVaoNgay === 1
    //                                                 ? 'Chẵn'
    //                                                 : 'Lẻ'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Số giờ một lần
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoGioTrenLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Chu kỳ thẩm phân phúc mạc (số
    //                                             lần/ngày)
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChuKyThamPhan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thẩm phân phúc mạc bằng máy
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ThamPhanBangMay === 1
    //                                                 ? 'Có'
    //                                                 : 'Không'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tại bệnh viện
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ThamPhanBangMayTaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Truyền máu
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TruyenMau === 1
    //                                                 ? 'Có'
    //                                                 : 'Không'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Bao nhiêu đơn vị
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.BaoNhieuDonViMau}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truyền máu lần cuối vào tháng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Thang}
    //                                         </dd>
    //                                         <dt className="col-sm-2">Năm</dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Nam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thời điểm truyền máu
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.thoidiemtruyenmau
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truyền máu tại bệnh viện
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhVienTruyenMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Đã ghép thận lần 1 vào ngày
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.DaGhepLan1Ngay
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tại bệnh viện
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DaGhepLan1TaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-4">
    //                                             Người cho thận
    //                                             (cha/mẹ/anh/chị/em?)
    //                                         </dt>
    //                                         <dd className="col-sm-8">
    //                                             {entityObj.NguoiChoThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ngày chạy thận nhân tạo trở lại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayChayThanTroLai
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Chẩn đoán suy chức năng thận
    //                                             ghép
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ChuanDoanSuyThanGhep}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ngày chạy thận nhân tạo/Thẩm
    //                                             phân phúc mạc
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.CTNTHoacKhamThamPhan
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tại bệnh viện
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ChayThanTroLaiTaiBV}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Số lượng nước tiểu/24 giờ
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.NuocTieu24h === 1
    //                                                 ? 'Có'
    //                                                 : ' Không có nước tiểu'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Lượng nước tiểu/24 giờ
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.SoLuongNuocTieu24h}{' '}
    //                                             ml/24h
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Chiều cao
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChieuCao} cm
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Cân nặng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CanNang} kg
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thuốc đang sử dụng/ngày
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocDangSuDungNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thuốc tạo máu
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocTaoMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bác sĩ điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.BacSiDieuTri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Điện thoại bác sĩ
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiBacSi}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             4. Bệnh lý kèm theo
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
    //                                                         Không bị viêm gan
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViA
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi A
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViB
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi B
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViC
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi C
    //                                                     </td>
    //                                                 </tr>
    //                                                 {entityObj.TruocHoacSauLocMau !==
    //                                                 null ? (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             1
    //                                                                 ? 'Viêm gan trước lọc máu'
    //                                                                 : ''}
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             2
    //                                                                 ? 'Viêm gan sau lọc máu'
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
    //                                             Điều trị viêm gan từ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTriViemGanTu}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuocTriViemGan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Bị lao</dt>
    //                                         {entityObj.TruocHoacSauLocMau !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TruocHoacSauLocMau ===
    //                                                 1
    //                                                     ? 'Lao phổi'
    //                                                     : 'Không có tiền căn lao'}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Bị lao cơ quan khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaoCoQuanKhac}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bị lao từ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiLao
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thời gian điều trị/Nơi điều trị
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
    //                                             Bị đái tháo đường
    //                                         </dt>
    //                                         {entityObj.DaiThaoDuong !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaiThaoDuong ===
    //                                                 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">Từ</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiDaiThaoDuong
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
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
    //                                             Bị tăng huyết áp
    //                                         </dt>
    //                                         {entityObj.TangHuyetAp !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.TangHuyetAp === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">Từ</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiTangHuyetAp
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {entityObj.ThuocDieuTri}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bệnh khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình hình hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrang}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             5. Tiền căn ngoại khoa
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Có phẫu thuật trước đó không
    //                                         </dt>
    //                                         {entityObj.DaPhauThuat !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaPhauThuat === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật ngày
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayThangPhauThuat
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật tại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BenhVienPhauThuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật do bệnh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoPhauThuat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình trạng hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHienTai}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             6.Thói quen
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thói quen nghiện rượu
    //                                         </dt>
    //                                         {entityObj.UongRuouBia !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.UongRuouBia === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Số lần/tuần
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLanTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Số lượng trên lần
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLuongLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thói quen hút thuốc
    //                                         </dt>
    //                                         {entityObj.HutThuoc !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.HutThuoc === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}

    //                                         <dt className="col-sm-2">
    //                                             Số điếu trên ngày
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTrenNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             7. Tiền căn gia đình
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         Bệnh thận:{' '}
    //                                                         {entityObj.BiBenhThan ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh lao:{' '}
    //                                                         {entityObj.BiBenhLao ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh đái tháo đường:{' '}
    //                                                         {entityObj.BiDaiThaoDuong ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>

    //                                                     <td>
    //                                                         Bệnh tăng huyết áp:{' '}
    //                                                         {entityObj.BiTangHuyetAp ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh ung thư:{' '}
    //                                                         {entityObj.BiUngThu ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bệnh khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BiBenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Sống cùng địa chỉ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.SongCungDiaChi === 1
    //                                                 ? 'Có'
    //                                                 : 'Không '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Người thân bị bệnh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NguoiThanBiBenh}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình trạng hiện tại
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
    //                                             8. Thông tin khác
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ngoại tổng quát
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ngoaitongquat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngoại tiết niệu
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ngoaitietnieu}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiền căn ngoại khoa khác
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
    //                                             Bệnh lý tim mạch
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.benhlytimmach
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Bệnh lý hệ thống đường tiết niệu
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
    //                                             Sinh con mấy lần
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.sanhconmaylan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Sinh con lần cuối vào năm
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
    //                                             Số năm điều trị thay thế
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.sonamdieutrithaythe}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Năm bắt đầu điều trị CTNT-TPPM
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.nambatdaudieutri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Chỉ số BMI
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.chisoBMI}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thời gian bảo hiểm y tế
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.thoigianBHYT}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Năm đăng ký
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NamDK}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ngày đăng ký
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayDKHien
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Năm sinh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NamSinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ung thư
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.BiUngThu
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.phauthuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Xạ trị</dt>
    //                                         <dd className="col-sm-4">
    //                                             {renderCheckBox(
    //                                                 entityObj.xatri
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Hoá trị
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
    //                                             Ghi chú
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.GhiChu}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             9. Tiền sử covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nhiễm covid
    //                                         </dt>
    //                                         {entityObj.NhiemCovid !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhiemCovid ===
    //                                                 true
    //                                                     ? 'Không'
    //                                                     : 'Có '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Bị trước khi tiêm
    //                                         </dt>
    //                                         {entityObj.BiTruocTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiTruocTiem ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bị sau khi tiêm
    //                                         </dt>
    //                                         {entityObj.BiSauTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiSauTiem ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng covid
    //                                         </dt>
    //                                         {entityObj.CoTrieuChung !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.CoTrieuChung ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng nhẹ
    //                                         </dt>
    //                                         {entityObj.TrieuChungNhe !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungNhe ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng trung bình
    //                                         </dt>
    //                                         {entityObj.TrieuChungtrungBinh !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungtrungBinh ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Triệu chúng nặng phải nhập viện
    //                                         </dt>
    //                                         {entityObj.NhapVien !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhapVien === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Thời gian nằm viện(ngày)
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThoiGianNamVien}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thở máy
    //                                         </dt>
    //                                         {entityObj.ThoMay !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoMay === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Thở HFNC
    //                                         </dt>
    //                                         {entityObj.ThoHFNC !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoHFNC === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             10. Tiêm vaccine ngừa covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 1
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
    //                                             Phản ứng sau tiêm mũi 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine2}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 2
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
    //                                             Phản ứng sau tiêm mũi 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng2}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine3}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 3
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
    //                                             Phản ứng sau tiêm mũi 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng3}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="kinhte" title="III. Kinh tế">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh tế
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập của bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapBenhNhan ? (
    //                                                 <>
    //                                                     {' '}
    //                                                     {
    //                                                         entityObj.ThuNhapBenhNhan
    //                                                     }{' '}
    //                                                     VND/Tháng
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
    //                                             Thu nhập của Vợ/Chồng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuNhapVoChongBenhNhan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.ThuNhapVoChongBenhNhan
    //                                                     }{' '}
    //                                                     VND/Tháng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập khác
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapKhac ? (
    //                                                 <>
    //                                                     {entityObj.ThuNhapKhac}{' '}
    //                                                     VND/Tháng
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
    //                                             Tiền chuẩn bị cho việc ghép thận
    //                                             (có sẵn)
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.TienChuanBiChoViecGhepThan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.TienChuanBiChoViecGhepThan
    //                                                     }{' '}
    //                                                     VND/Tháng
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
    //                             title="IV. Lý do đăng ký chờ ghép"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             IV. Lý do đăng ký chờ ghép thận
    //                                             từ người hiến chết não
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
    //                                                         Không có người hiến
    //                                                         thận
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoBiBenh
    //                                                             }
    //                                                         />
    //                                                         Người hiến bị bệnh
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoKhongHoaHopMau
    //                                                             }
    //                                                         />
    //                                                         Người hiến không hòa
    //                                                         hợp nhóm máu
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>Lý do khác : </td>
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
    //                             title="V. Quan hệ gia đình"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             V. Quan hệ gia đình
    //                                         </dt>
    //                                         <dd className="col-sm-12">
    //                                             <table className="table table-striped">
    //                                                 <thead>
    //                                                     <tr>
    //                                                         <th>#</th>
    //                                                         <th>Quan hệ</th>
    //                                                         <th>Họ tên</th>
    //                                                         <th>Năm sinh</th>
    //                                                         <th>Nhóm máu</th>
    //                                                         <th>
    //                                                             Số điện thoại
    //                                                         </th>
    //                                                         <th>
    //                                                             Lý do không hiến
    //                                                             được
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
    //                         <Tab eventKey="FileDK" title="Đăng ký bản gốc">
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

    //                         <Tab eventKey="lichsuxuly" title="Lịch sử xử lý">
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Thời gian</th>
    //                                         <th>Người cập nhật</th>

    //                                         <th>Tiêu đề</th>
    //                                         <th>Nội dung</th>
    //                                         <th>Ghi chú</th>
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
    //                                                 Không có dữ liệu
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="thongbaoxetnghiem"
    //                             title="TB khám và làm xét nghiệm"
    //                         >
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Thời gian</th>
    //                                         <th>Ngày hẹn</th>
    //                                         <th>Lý do</th>
    //                                         <th>Trạng thái</th>
    //                                         <th>Thời gian gửi</th>
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
    //                                                             ? 'Đã gửi'
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
    //                                                 Không có dữ liệu
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
    //                         Đóng
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
                // title="Chi tiết đăng ký chờ ghép"
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
                    <TabPane tab="Thông tin chung" key="1">
                        <Descriptions
                            title="Hành chánh"
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
                            <Descriptions.Item label="Trạng thái">
                                {DangKyChoGhepConstant.GetName(
                                    entityObj.Status
                                )}
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
                            <Descriptions.Item label="Họ và tên">
                                {entityObj.HoTenBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã số bệnh nhân">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {entityObj.GioiTinh === 1 ? 'Nam' : 'Nữ'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm máu ABO/Rh">
                                {entityObj.NhomMau1 ? (
                                    <>
                                        {entityObj.NhomMau} /{' '}
                                        {entityObj.NhomMau1}
                                    </>
                                ) : (
                                    entityObj.NhomMau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bảo hiểm y tế">
                                {entityObj.BaoHiemYTe}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                {entityObj.DienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Điện thoại Khác">
                                {entityObj.DienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trình độ văn hóa">
                                {entityObj.TrinhDoVanHoa}
                            </Descriptions.Item>
                            <Descriptions.Item label="CMND/CCCD/Hộ chiếu">
                                {entityObj.CMNDBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày cấp">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayCapCMNDBN
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nơi cấp">
                                {entityObj.NoiCapCMNDBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghề nghiệp">
                                {entityObj.NgheNghiep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghệ nghiệp bổ sung">
                                {entityObj.NgheNhiepBoSung}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ thường trú">
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
                            <Descriptions.Item label="Địa chỉ tạm trú">
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
                            <Descriptions.Item label="Con thứ mấy trong gia đình">
                                {entityObj.LaConThuMay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình trạng hôn nhân">
                                {entityObj.TinhTrangHonNhan === 1
                                    ? 'Đã có gia đình'
                                    : 'Độc thân'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Họ tên Vợ/Chồng">
                                {entityObj.HoTenVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
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
                                gái
                            </Descriptions.Item>
                            <Descriptions.Item label="Lớn nhất sinh năm">
                                {entityObj.LonNhatSinhNam}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhỏ nhất sinh năm">
                                {entityObj.NhoNhatSinhNam}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Kinh tế"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="Thu nhập của bệnh nhân">
                                {entityObj.ThuNhapBenhNhan} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập của Vợ/Chồng">
                                {entityObj.ThuNhapVoChongBenhNhan} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghề nghiệp vợ/chồng">
                                {entityObj.NgheNghiepVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập khác">
                                {entityObj.ThuNhapKhac} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền chuẩn bị cho việc ghép có sẵn">
                                {entityObj.TienChuanBiChoViecGhepThan} VND
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Lý do đăng ký chờ ghép"
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
                                                checked={
                                                    entityObj.KhongCoNguoiNhan
                                                }
                                            />
                                            Không có người hiến{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.NguoiChoBiBenh
                                                }
                                            />
                                            Người hiến bị bệnh
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.NguoiChoKhongHoaHopMau
                                                }
                                            />
                                            Người hiến không hòa hợp nhóm máu
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Lý do khác : </td>
                                        <td>{entityObj.LyDoKhac}</td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Tình trạng bệnh lý" key="2">
                        <Descriptions
                            title="Tình trạng bệnh lý"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="1.Nguyên nhân dẫn đến tình trạng bệnh hiện tại">
                                {entityObj.NguyenNhanSuyThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="2. Sinh thiết thận">
                                {entityObj.SinhThietThan === 1 ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kết quả sinh thiết thận">
                                {entityObj.KetQuaSinhThietThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="3.Thời gian phát hiện suy giảm chức năng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayPhatHienSuyThan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chạy thận nhân tạo/Thẩm phân phúc mạc từ">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm phát hiện - CTNT trở lại">
                                {entityObj.namphathienctnttrolai}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lần chạy thận một tuần">
                                {entityObj.SoLanCTNTTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vào ngày">
                                {entityObj.CTNTVaoNgay === 1 ? 'Chẵn' : 'Lẻ'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số giờ một lần">
                                {entityObj.SoGioTrenLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chu kỳ thẩm phân phúc mạc (số lần/ngày)">
                                {entityObj.ChuKyThamPhan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thẩm phân phúc mạc bằng máy">
                                {entityObj.ThamPhanBangMay === 1
                                    ? 'Có'
                                    : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tại bệnh viện">
                                {entityObj.ThamPhanBangMayTaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truyền máu">
                                {entityObj.TruyenMau === 1 ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bao nhiêu đơn vị">
                                {entityObj.BaoNhieuDonViMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian truyền máu lần cuối ">
                                {entityObj.Thang !== null ? 'tháng ' : ''}
                                {entityObj.Thang}
                                {entityObj.Nam !== null ? ' năm ' : ''}
                                {entityObj.Nam !== null ? entityObj.Nam : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời điểm truyền máu">
                                {CommonUtility.ShowDateVN(
                                    entityObj.thoidiemtruyenmau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truyền máu tại bệnh viện">
                                {entityObj.BenhVienTruyenMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã ghép thận lần 1 vào ngày">
                                {CommonUtility.ShowDateVN(
                                    entityObj.DaGhepLan1Ngay
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh viện ghép thận">
                                {entityObj.DaGhepLan1TaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người cho thận(cha/mẹ/anh/chị/em?)">
                                {entityObj.NguoiChoThan}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Ngày chạy thận nhân tạo trở lại">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayChayThanTroLai
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chẩn đoán suy chức năng thận">
                                {entityObj.ChuanDoanSuyThanGhep}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày chạy thận nhân tạo/Thẩm phân phúc mạc">
                                {CommonUtility.ShowDateVN(
                                    entityObj.CTNTHoacKhamThamPhan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tại bệnh viện">
                                {entityObj.ChayThanTroLaiTaiBV}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng nước tiểu/24 giờ">
                                {entityObj.NuocTieu24h === 1
                                    ? 'Có'
                                    : ' Không có nước tiểu'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lượng nước tiểu/24 giờ">
                                {entityObj.SoLuongNuocTieu24h} ml/24h
                            </Descriptions.Item>
                            <Descriptions.Item label="Chiều cao">
                                {entityObj.ChieuCao} cm
                            </Descriptions.Item>
                            <Descriptions.Item label="Cân nặng">
                                {entityObj.CanNang} kg
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc đang sử dụng/ngày">
                                {entityObj.ThuocDangSuDungNgay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc tạo máu">
                                {entityObj.ThuocTaoMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bác sĩ điều trị">
                                {entityObj.BacSiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại bác sĩ">
                                {entityObj.DienThoaiBacSi}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="4. Bệnh lý kèm theo"
                                span={2}
                            >
                                <table className="tablebophancho">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.KhongBiViemGan
                                                }
                                            />
                                            Không bị viêm gan
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViA
                                                }
                                            />
                                            Viêm gan siêu vi A
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViB
                                                }
                                            />
                                            Viêm gan siêu vi B
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViC
                                                }
                                            />
                                            Viêm gan siêu vi C
                                        </td>
                                    </tr>
                                    {entityObj.TruocHoacSauLocMau !== null ? (
                                        <tr>
                                            <td>
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Viêm gan trước lọc máu'
                                                    : ''}
                                                {entityObj.TruocHoacSauLocMau ===
                                                2
                                                    ? 'Viêm gan sau lọc máu'
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
                            <Descriptions.Item label="Điều trị viêm gan từ">
                                {entityObj.DieuTriViemGanTu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocTriViemGan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao">
                                {entityObj.TruocHoacSauLocMau === 1
                                    ? 'Lao phổi'
                                    : 'Không có tiền căn lao'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao cơ quan khác">
                                {entityObj.LaoCoQuanKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao từ">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiLao
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian điều trị/Nơi điều trị">
                                {entityObj.ThoiGianDieuTriAndNoiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị đái tháo đường">
                                {entityObj.DaiThaoDuong === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian phát hiện đái tháo đường">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocDieuTriDaiThaoDuong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị tăng huyết áp">
                                {entityObj.TangHuyetAp === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian phát hiện tăng huyết áp">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiTangHuyetAp
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh khác">
                                {entityObj.BenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình hình hiện tại">
                                {entityObj.TinhTrang}
                            </Descriptions.Item>
                            <Descriptions.Item label="5. Tiền căn ngoại khoa" />
                            <Descriptions.Item label="Có phẫu thuật trước đó không">
                                {entityObj.DaPhauThuat === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật ngày">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayThangPhauThuat
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật tại">
                                {entityObj.BenhVienPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật do bệnh">
                                {entityObj.CoPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình trạng hiện tại">
                                {entityObj.TinhTrangHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label="6.Thói quen " />
                            <Descriptions.Item label="Thói quen nghiện rượu">
                                {entityObj.UongRuouBia === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lần/tuần">
                                {entityObj.SoLanTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng trên lần">
                                {entityObj.SoLuongLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thói quen hút thuốc">
                                {entityObj.HutThuoc === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Số điếu trên ngày">
                                {entityObj.DieuTrenNgay}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="7. Tiền căn gia đình"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            Bệnh thận:{' '}
                                            {entityObj.BiBenhThan === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh lao:{' '}
                                            {entityObj.BiBenhLao === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh đái tháo đường:{' '}
                                            {entityObj.BiDaiThaoDuong === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh tăng huyết áp:{' '}
                                            {entityObj.BiTangHuyetAp === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh ung thư:{' '}
                                            {entityObj.BiUngThu === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh khác">
                                {entityObj.BiBenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sống cùng địa chỉ">
                                {entityObj.SongCungDiaChi === 1
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người thân bị bênh">
                                {entityObj.NguoiThanBiBenh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình trạng hiện tại">
                                {entityObj.TinhTrangBenhNguoiThanHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label="8. Thông tin khác" />
                            <Descriptions.Item label="Ngoại tổng quát">
                                {entityObj.ngoaitongquat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngoại tiết niệu">
                                {entityObj.ngoaitietnieu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền căn ngoại khoa khác">
                                {entityObj.tiencanngoaikhoakhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="THA">
                                {entityObj.THA}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh lý tim mạch">
                                {entityObj.benhlytimmach}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh lý hệ thống đường tiết niệu">
                                {renderCheckBox(
                                    entityObj.benhlyhethongduongtietnieu
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sinh con mấy lần">
                                {entityObj.sanhconmaylan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sinh con lần cuối vào năm">
                                {entityObj.sanhconlancuoivaonam}
                            </Descriptions.Item>
                            <Descriptions.Item label="CAPD">
                                {renderCheckBox(entityObj.CAPD)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số năm điều trị thay thế">
                                {entityObj.sonamdieutrithaythe}
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm bắt đầu điều trị CTNT-TPPM">
                                {entityObj.nambatdaudieutri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chỉ số BMI">
                                {entityObj.chisoBMI}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian bảo hiểm y tế">
                                {entityObj.thoigianBHYT}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian đăng ký">
                                {entityObj.NgayDKHien !== null
                                    ? CommonUtility.ShowDateVN(
                                          entityObj.NgayDKHien
                                      )
                                    : entityObj.NamDK}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ung thư">
                                {renderCheckBox(entityObj.BiUngThu)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật">
                                {entityObj.phauthuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Xạ trị">
                                {renderCheckBox(entityObj.xatri)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hoá trị">
                                {renderCheckBox(entityObj.hoatri)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">
                                {entityObj.GhiChu}
                            </Descriptions.Item>
                            <Descriptions.Item label=" 9. Tiền sử covid" />
                            <Descriptions.Item label=" Nhiễm covid">
                                {entityObj.NhiemCovid === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị trước khi tiêm">
                                {entityObj.BiTruocTiem === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị sau khi tiêm">
                                {entityObj.BiSauTiem === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng covid">
                                {entityObj.CoTrieuChung === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng nhẹ">
                                {entityObj.TrieuChungNhe === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng trung bình">
                                {entityObj.TrieuChungtrungBinh === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chúng nặng phải nhập viện">
                                {entityObj.NhapVien === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian nằm viện(ngày)">
                                {entityObj.ThoiGianNamVien}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thở máy">
                                {entityObj.ThoMay === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thở HFNC">
                                {entityObj.ThoHFNC === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="9. Tiêm vaccine ngừa covid" />
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 1">
                                {entityObj.TiemVaccine}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 1">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui1
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 1">
                                {entityObj.PhanUng}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 2">
                                {entityObj.TiemVaccine2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 2">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui2
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 2">
                                {entityObj.PhanUng2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 3">
                                {entityObj.TiemVaccine3}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 3">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui3
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 3">
                                {entityObj.PhanUng3}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Kết quả xét nghiệm" key="3">
                        <div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header p-2">
                                            <KQXetNghiemVGBAdm
                                                showCreateKQVGB={
                                                    showCreateKQVGB
                                                }
                                                DataKQVGB={DataKQVGB}
                                                setshowCreateKQVGB={
                                                    setshowCreateKQVGB
                                                }
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
                                                                Kết quả xét
                                                                nghiệm viêm gan
                                                                B
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
                                                                Định lượng
                                                                HBV-DNA
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
                                                                Ngày bắt đầu
                                                                điều trị
                                                            </th>
                                                            <th scope="col">
                                                                Ngày kết thúc
                                                                điều trị
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {entityObjKQVGB &&
                                                        entityObjKQVGB.length >
                                                            0 ? (
                                                            entityObjKQVGB.map(
                                                                (itm, key) => {
                                                                    const indx =
                                                                        key + 1;
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                {
                                                                                    indx
                                                                                }
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
                                                                    Không có dữ
                                                                    liệu
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
                                                showCreateKQVGC={
                                                    showCreateKQVGC
                                                }
                                                DataKQVGC={DataKQVGC}
                                                setshowCreateKQVGC={
                                                    setshowCreateKQVGC
                                                }
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
                                                                Kết quả xét
                                                                nghiệm viêm gan
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
                                                            <th scope="col">
                                                                Viêm gan C
                                                            </th>
                                                            <th scope="col">
                                                                Định lượng
                                                                HBV-DNA
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
                                                                Ngày bắt đầu
                                                                điều trị
                                                            </th>
                                                            <th scope="col">
                                                                Ngày kết thúc
                                                                điều trị
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {entityObjKQVGC &&
                                                        entityObjKQVGC.length >
                                                            0 ? (
                                                            entityObjKQVGC.map(
                                                                (itm, key) => {
                                                                    const indx =
                                                                        key + 1;
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                {
                                                                                    indx
                                                                                }
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
                                                                    Không có dữ
                                                                    liệu
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
                                                setshowCreateKQ={
                                                    setshowCreateKQ
                                                }
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
                                                Tạo mới kết quả PRA
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
                                                                Kết quả xét
                                                                nghiệm PRA
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
                                                                Tỷ lệ PRA
                                                            </th>
                                                            <th scope="col">
                                                                A
                                                            </th>
                                                            <th scope="col">
                                                                B
                                                            </th>
                                                            <th scope="col">
                                                                DR
                                                            </th>
                                                            <th scope="col">
                                                                DQ
                                                            </th>
                                                            <th scope="col">
                                                                DP
                                                            </th>
                                                            <th scope="col">
                                                                Lọc huyết tương
                                                            </th>
                                                            <th scope="col">
                                                                Thuốc UCMD
                                                            </th>
                                                            <th scope="col">
                                                                Theo dõi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {entityObjKQ &&
                                                        entityObjKQ.length >
                                                            0 ? (
                                                            entityObjKQ.map(
                                                                (itm, key) => {
                                                                    const indx =
                                                                        key + 1;
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                {
                                                                                    indx
                                                                                }
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
                                                                                                        Sửa
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
                                                                                                        Xóa
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
                                                                    Không có dữ
                                                                    liệu
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
                                            <KQXetNghiemHLAAdm
                                                showCreateKQHLA={
                                                    showCreateKQHLA
                                                }
                                                DataKQHLA={DataKQHLA}
                                                setshowCreateKQHLA={
                                                    setshowCreateKQHLA
                                                }
                                                setisload={setisload}
                                                LoadData={LoadData}
                                            />

                                            <Button
                                                variant=""
                                                className="btn btn-primary"
                                                size="sm"
                                                onClick={() => {
                                                    setshowCreateKQHLA(true);
                                                    onCreateHLAEntity();
                                                }}
                                            >
                                                <i
                                                    className="fa fa-plus"
                                                    aria-hidden="true"
                                                />
                                                Tạo mới kết quả HLA
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
                                                                Kết quả xét
                                                                nghiệm HLA
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th scope="col">
                                                                A
                                                            </th>
                                                            <th scope="col">
                                                                {' '}
                                                            </th>
                                                            <th scope="col">
                                                                B
                                                            </th>
                                                            <th scope="col">
                                                                DRB1
                                                            </th>
                                                            <th scope="col">
                                                                DQA1
                                                            </th>
                                                            <th scope="col">
                                                                DQB1
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {entityObjKQHLA &&
                                                        entityObjKQHLA.length >
                                                            0 ? (
                                                            entityObjKQHLA.map(
                                                                (itim, key) => {
                                                                    const indxof =
                                                                        key + 1;
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                {
                                                                                    indxof
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    itim.HLAA
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <div className="tableBoxMain">
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
                                                                                                        onEditHLAEntity(
                                                                                                            itim.Id
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
                                                                                                        DeleteHLAAction(
                                                                                                            itim.Id
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <span className="boxIcon">
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
                                                                                {
                                                                                    itim.HLAB
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    itim.HLADRB1
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    itim.HLADQA1
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    itim.HLADQB1
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={8}
                                                                    className="center"
                                                                >
                                                                    Không có dữ
                                                                    liệu
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
                    </TabPane>
                    <TabPane tab="Quan hệ gia đình" key="4">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Quan hệ</th>
                                    <th>Họ tên</th>
                                    <th>Năm sinh</th>
                                    <th>Nhóm máu</th>
                                    <th>Số điện thoại</th>
                                    <th>Lý do không hiến được</th>
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
                    <TabPane tab="TB khám và làm xét nghiệm" key="5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Ngày hẹn</th>
                                    <th>Lý do</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian gửi</th>
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
                                                    {itm.IsSent ? 'Đã gửi' : ''}
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
                                        <td colSpan={5}>Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="Đăng ký bản gốc" key="6">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                    </TabPane>
                    <TabPane tab="Lịch sử xử lý" key="7">
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

    const DetailModalKhac = () => (
        <>
            <Drawer
                // title="Chi tiết đăng ký chờ ghép"
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
                    <TabPane tab="Thông tin chung" key="1">
                        <Descriptions
                            title="Hành chánh"
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
                            <Descriptions.Item label="Trạng thái">
                                {DangKyChoGhepConstant.GetName(
                                    entityObj.Status
                                )}
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
                            <Descriptions.Item label="Họ và tên">
                                {entityObj.HoTenBN}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã số bệnh nhân">
                                {entityObj.MaSo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {entityObj.GioiTinh === 1 ? 'Nam' : 'Nữ'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {CommonUtility.ShowDateVN(entityObj.NgaySinh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm máu ABO/Rh">
                                {entityObj.NhomMau1 ? (
                                    <>
                                        {entityObj.NhomMau} /{' '}
                                        {entityObj.NhomMau1}
                                    </>
                                ) : (
                                    entityObj.NhomMau
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bảo hiểm y tế">
                                {entityObj.BaoHiemYTe}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                {entityObj.DienThoai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Điện thoại Khác">
                                {entityObj.DienThoai1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {entityObj.Email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trình độ văn hóa">
                                {entityObj.TrinhDoVanHoa}
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
                            <Descriptions.Item label="Nghệ nghiệp bổ sung">
                                {entityObj.NgheNhiepBoSung}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ thường trú">
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
                            <Descriptions.Item label="Địa chỉ tạm trú">
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
                            <Descriptions.Item label="Con thứ mấy trong gia đình">
                                {entityObj.LaConThuMay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình trạng hôn nhân">
                                {entityObj.TinhTrangHonNhan === 1
                                    ? 'Đã có gia đình'
                                    : 'Độc thân'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Họ tên Vợ/Chồng">
                                {entityObj.HoTenVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                {entityObj.DienThoaiVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Con">
                                {entityObj.CoMayCon} con: {entityObj.SoConTrai}{' '}
                                trai, {entityObj.SoConGai} gái
                            </Descriptions.Item>
                            <Descriptions.Item label="Lớn nhất sinh năm">
                                {entityObj.LonNhatSinhNam}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhỏ nhất sinh năm">
                                {entityObj.NhoNhatSinhNam}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Kinh tế"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="Thu nhập của bệnh nhân">
                                {entityObj.ThuNhapBenhNhan} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập của Vợ/Chồng">
                                {entityObj.ThuNhapVoChongBenhNhan} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Nghề nghiệp vợ/chồng">
                                {entityObj.NgheNghiepVoChong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập khác">
                                {entityObj.ThuNhapKhac} VND/Tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền chuẩn bị cho việc ghép có sẵn">
                                {entityObj.TienChuanBiChoViecGhepThan} VND
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions
                            title="Lý do đăng ký chờ ghép"
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
                                                checked={
                                                    entityObj.KhongCoNguoiNhan
                                                }
                                            />
                                            Không có người hiến{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.NguoiChoBiBenh
                                                }
                                            />
                                            Người hiến bị bệnh
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.NguoiChoKhongHoaHopMau
                                                }
                                            />
                                            Người hiến không hòa hợp nhóm máu
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Lý do khác : </td>
                                        <td>{entityObj.LyDoKhac}</td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Tình trạng bệnh lý" key="2">
                        <Descriptions
                            title="Tình trạng bệnh lý"
                            bordered
                            column={2}
                            size="middle"
                        >
                            <Descriptions.Item label="1.Nguyên nhân dẫn đến tình trạng bệnh hiện tại">
                                {entityObj.NguyenNhanSuyThan}
                            </Descriptions.Item>
                            <Descriptions.Item label="2.Thời gian phát hiện suy giảm chức năng">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayPhatHienSuyThan
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truyền máu">
                                {entityObj.TruyenMau === 1 ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bao nhiêu đơn vị">
                                {entityObj.BaoNhieuDonViMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian truyền máu lần cuối ">
                                {entityObj.Thang !== null ? 'tháng ' : ''}
                                {entityObj.Thang}
                                {entityObj.Nam !== null ? ' năm ' : ''}
                                {entityObj.Nam !== null ? entityObj.Nam : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="Truyền máu tại bệnh viện">
                                {entityObj.BenhVienTruyenMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chiều cao">
                                {entityObj.ChieuCao} cm
                            </Descriptions.Item>
                            <Descriptions.Item label="Cân nặng">
                                {entityObj.CanNang} kg
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc đang sử dụng/ngày">
                                {entityObj.ThuocDangSuDungNgay}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc tạo máu">
                                {entityObj.ThuocTaoMau}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bác sĩ điều trị">
                                {entityObj.BacSiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại bác sĩ">
                                {entityObj.DienThoaiBacSi}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="3. Bệnh lý kèm theo"
                                span={2}
                            >
                                <table className="tablebophancho">
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.KhongBiViemGan
                                                }
                                            />
                                            Không bị viêm gan
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViA
                                                }
                                            />
                                            Viêm gan siêu vi A
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViB
                                                }
                                            />
                                            Viêm gan siêu vi B
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    entityObj.ViemGanSieuViC
                                                }
                                            />
                                            Viêm gan siêu vi C
                                        </td>
                                    </tr>
                                    {entityObj.TruocHoacSauLocMau !== null ? (
                                        <tr>
                                            <td>
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Viêm gan trước lọc máu'
                                                    : ''}
                                                {entityObj.TruocHoacSauLocMau ===
                                                2
                                                    ? 'Viêm gan sau lọc máu'
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
                            <Descriptions.Item label="Điều trị viêm gan từ">
                                {entityObj.DieuTriViemGanTu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocTriViemGan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao">
                                {entityObj.TruocHoacSauLocMau === 1
                                    ? 'Lao phổi'
                                    : 'Không có tiền căn lao'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao cơ quan khác">
                                {entityObj.LaoCoQuanKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị lao từ">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiLao
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian điều trị/Nơi điều trị">
                                {entityObj.ThoiGianDieuTriAndNoiDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị đái tháo đường">
                                {entityObj.DaiThaoDuong === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian phát hiện đái tháo đường">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocDieuTriDaiThaoDuong}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị tăng huyết áp">
                                {entityObj.TangHuyetAp === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian phát hiện tăng huyết áp">
                                {CommonUtility.ShowDateVN(
                                    entityObj.ThoiGianBiTangHuyetAp
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuốc điều trị">
                                {entityObj.ThuocDieuTri}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh khác">
                                {entityObj.BenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình hình hiện tại">
                                {entityObj.TinhTrang}
                            </Descriptions.Item>
                            <Descriptions.Item label="4. Tiền căn ngoại khoa" />
                            <Descriptions.Item label="Có phẫu thuật trước đó không">
                                {entityObj.DaPhauThuat === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật ngày">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayThangPhauThuat
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật tại">
                                {entityObj.BenhVienPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phẫu thuật do bệnh">
                                {entityObj.CoPhauThuat}
                            </Descriptions.Item>
                            <Descriptions.Item label="5.Thói quen nghiện rượu">
                                {entityObj.UongRuouBia === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lần/tuần">
                                {entityObj.SoLanTuan}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng trên lần">
                                {entityObj.SoLuongLan}
                            </Descriptions.Item>
                            <Descriptions.Item label="6.Thói quen" />
                            <Descriptions.Item label="Thói quen hút thuốc">
                                {entityObj.HutThuoc === 1 ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label=" Số điếu trên ngày">
                                {entityObj.DieuTrenNgay}
                            </Descriptions.Item>
                            <Descriptions.Item />
                            <Descriptions.Item
                                label="7. Tiền căn gia đình"
                                span={2}
                            >
                                <table className="tablebophanhien">
                                    <tr>
                                        <td>
                                            Bệnh{' '}
                                            {String(
                                                entityObj.TenCoQuan
                                            ).toLowerCase()}
                                            :{' '}
                                            {entityObj.BiBenhThan === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh lao:{' '}
                                            {entityObj.BiBenhLao === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh đái tháo đường:{' '}
                                            {entityObj.BiDaiThaoDuong === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh tăng huyết áp:{' '}
                                            {entityObj.BiTangHuyetAp === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                        <td>
                                            Bệnh ung thư:{' '}
                                            {entityObj.BiUngThu === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </td>
                                    </tr>
                                </table>
                            </Descriptions.Item>
                            <Descriptions.Item label="Bệnh khác">
                                {entityObj.BiBenhKhac}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sống cùng địa chỉ">
                                {entityObj.SongCungDiaChi === 1
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người thân bị bênh">
                                {entityObj.NguoiThanBiBenh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tình trạng hiện tại">
                                {entityObj.TinhTrangBenhNguoiThanHienTai}
                            </Descriptions.Item>
                            <Descriptions.Item label=" 8. Tiền sử covid" />
                            <Descriptions.Item label=" Nhiễm covid">
                                {entityObj.NhiemCovid === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị trước khi tiêm">
                                {entityObj.BiTruocTiem === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bị sau khi tiêm">
                                {entityObj.BiSauTiem === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng covid">
                                {entityObj.CoTrieuChung === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng nhẹ">
                                {entityObj.TrieuChungNhe === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chứng trung bình">
                                {entityObj.TrieuChungtrungBinh === true
                                    ? 'Có'
                                    : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Triệu chúng nặng phải nhập viện">
                                {entityObj.NhapVien === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian nằm viện(ngày)">
                                {entityObj.ThoiGianNamVien}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thở máy">
                                {entityObj.ThoMay === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thở HFNC">
                                {entityObj.ThoHFNC === true ? 'Có' : 'Không '}
                            </Descriptions.Item>
                            <Descriptions.Item label="9. Tiêm vaccine ngừa covid" />
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 1">
                                {entityObj.TiemVaccine}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 1">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui1
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 1">
                                {entityObj.PhanUng}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 2">
                                {entityObj.TiemVaccine2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 2">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui2
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 2">
                                {entityObj.PhanUng2}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêm vaccine ngừa covid mũi 3">
                                {entityObj.TiemVaccine3}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tiêm mũi 3">
                                {CommonUtility.ShowDateVN(
                                    entityObj.NgayTiemMui3
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phản ứng sau tiêm mũi 3">
                                {entityObj.PhanUng3}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="Quan hệ gia đình" key="3">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Quan hệ</th>
                                    <th>Họ tên</th>
                                    <th>Năm sinh</th>
                                    <th>Nhóm máu</th>
                                    <th>Số điện thoại</th>
                                    <th>Lý do không hiến được</th>
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
                    <TabPane tab="TB khám và làm xét nghiệm" key="4">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Ngày hẹn</th>
                                    <th>Lý do</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian gửi</th>
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
                                                    {itm.IsSent ? 'Đã gửi' : ''}
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
                                        <td colSpan={5}>Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="Đăng ký bản gốc" key="5">
                        <RenderViewFile path={entityObj.DonDKBanCung} />
                    </TabPane>
                    <TabPane tab="Lịch sử xử lý" key="6">
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
    //                         Chi tiết đăng ký chờ ghép {entityObj.TenCoQuan}
    //                     </Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body> */}
    //                     <Tabs
    //                         id="controlled-tab-example"
    //                         activeKey={keytab}
    //                         onSelect={(k) => setKey(k)}
    //                         className="mb-3"
    //                     >
    //                         <Tab eventKey="hanhchanh" title="I. Hành Chánh">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             I. Hành chánh
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Ảnh</dt>
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
    //                                             Trạng thái
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
    //                                             Ảnh CMND mặt trước
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
    //                                             Ảnh CMND mặt sau
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
    //                                             Họ và tên
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTenBN}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Mã số bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.MaSo}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Giới tính
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.GioiTinh === 1
    //                                                 ? 'Nam'
    //                                                 : 'Nữ'}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngày sinh
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
    //                                             Nhóm máu ABO/Rh
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
    //                                             Bảo hiểm y tế
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BaoHiemYTe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Điện thoại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoai}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Điện thoại khác
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
    //                                             Trình độ văn hóa
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TrinhDoVanHoa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNghiep}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             {' '}
    //                                             Nghề nghiệp bổ sung
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNhiepBoSung}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Địa chỉ thường trú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiThuongChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Xã/ Phường:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXa}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Quận/ Huyện:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyen}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tỉnh/T.Phố:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinh}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Địa chỉ tạm trú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiTamChu}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Xã/ Phường:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXatt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Quận/ Huyện:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyentt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tỉnh/T.Phố:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinhtt}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Con thứ mấy trong gia đình
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaConThuMay}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình trạng hôn nhân
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHonNhan ===
    //                                             1
    //                                                 ? 'Đã có gia đình'
    //                                                 : 'Độc thân'}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Họ tên Vợ/Chồng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.HoTenVoChong}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Điện thoại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DienThoaiVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Có</dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoMayCon} con (
    //                                             {entityObj.SoConTrai} trai,
    //                                             {entityObj.SoConGai} gái)
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             Lớn nhất sinh năm
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.LonNhatSinhNam}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nhỏ nhất sinh năm
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
    //                             title="II. Tình trạng bệnh lý"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row ">
    //                                         <dt className="col-sm-12">
    //                                             II. TÌNH TRẠNG BỆNH LÝ
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             1.Nguyên nhân dẫn đến tình trạng
    //                                             bệnh hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.NguyenNhanSuyThan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             2.Phát hiện suy{' '}
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
    //                                             Truyền máu
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.TruyenMau === 1
    //                                                 ? 'Có'
    //                                                 : 'Không'}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Bao nhiêu đơn vị
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.BaoNhieuDonViMau}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Truyền máu lần cuối vào tháng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Thang}
    //                                         </dd>
    //                                         <dt className="col-sm-2">Năm</dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.Nam}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Truyền máu tại bệnh viện
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.BenhVienTruyenMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Chiều cao
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.ChieuCao} cm
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Cân nặng
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.CanNang} kg
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thuốc đang sử dụng/ngày
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocDangSuDungNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thuốc tạo máu
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuocTaoMau}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bác sĩ điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-6">
    //                                             {entityObj.BacSiDieuTri}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Điện thoại bác sĩ
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DienThoaiBacSi}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>

    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             3. Bệnh lý kèm theo
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
    //                                                         Không bị viêm gan
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViA
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi A
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViB
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi B
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ViemGanSieuViC
    //                                                             }
    //                                                         />
    //                                                         Viêm gan siêu vi C
    //                                                     </td>
    //                                                 </tr>
    //                                                 {entityObj.TruocHoacSauLocMau !==
    //                                                 null ? (
    //                                                     <tr>
    //                                                         <td>
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             1
    //                                                                 ? 'Viêm gan trước lọc máu'
    //                                                                 : ''}
    //                                                             {entityObj.TruocHoacSauLocMau ===
    //                                                             2
    //                                                                 ? 'Viêm gan sau lọc máu'
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
    //                                             Điều trị viêm gan từ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTriViemGanTu}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuocTriViemGan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">Bị lao</dt>
    //                                         {entityObj.TruocHoacSauLocMau !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TruocHoacSauLocMau ===
    //                                                 1
    //                                                     ? 'Lao phổi'
    //                                                     : 'Không có tiền căn lao'}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Bị lao cơ quan khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.LaoCoQuanKhac}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bị lao từ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiLao
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thời gian điều trị/Nơi điều trị
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
    //                                             Bị đái tháo đường
    //                                         </dt>
    //                                         {entityObj.DaiThaoDuong !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaiThaoDuong ===
    //                                                 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">Từ</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiDaiThaoDuong
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
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
    //                                             Bị tăng huyết áp
    //                                         </dt>
    //                                         {entityObj.TangHuyetAp !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.TangHuyetAp === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}
    //                                         <dt className="col-sm-1">Từ</dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.ThoiGianBiTangHuyetAp
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Thuốc điều trị
    //                                         </dt>
    //                                         <dd className="col-sm-3">
    //                                             {entityObj.ThuocDieuTri}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bệnh khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình hình hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrang}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             4. Tiền căn ngoại khoa
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Có phẫu thuật trước đó không
    //                                         </dt>
    //                                         {entityObj.DaPhauThuat !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.DaPhauThuat === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật ngày
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayThangPhauThuat
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật tại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.BenhVienPhauThuat}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Phẫu thuật do bệnh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.CoPhauThuat}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình trạng hiện tại
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TinhTrangHienTai}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             5.Thói quen nghiện rượu
    //                                         </dt>
    //                                         {entityObj.UongRuouBia !== null ? (
    //                                             <dd className="col-sm-2">
    //                                                 {entityObj.UongRuouBia === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-2"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Số lần/tuần
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLanTuan}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Số lượng trên lần
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoLuongLan}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             6.Thói quen
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thói quen hút thuốc
    //                                         </dt>
    //                                         {entityObj.HutThuoc !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.HutThuoc === 1
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd> </dd>
    //                                         )}

    //                                         <dt className="col-sm-2">
    //                                             Số điếu trên ngày
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.DieuTrenNgay}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             7. Tiền căn gia đình
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dd className="col-sm-12">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         Bệnh{' '}
    //                                                         {String(
    //                                                             entityObj.TenCoQuan
    //                                                         ).toLowerCase()}
    //                                                         :{' '}
    //                                                         {entityObj.BiBenhThan ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh lao:{' '}
    //                                                         {entityObj.BiBenhLao ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh đái tháo đường:{' '}
    //                                                         {entityObj.BiDaiThaoDuong ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>

    //                                                     <td>
    //                                                         Bệnh tăng huyết áp:{' '}
    //                                                         {entityObj.BiTangHuyetAp ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                     <td>
    //                                                         Bệnh ung thư:{' '}
    //                                                         {entityObj.BiUngThu ===
    //                                                         1
    //                                                             ? 'Có'
    //                                                             : 'Không '}
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bệnh khác
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.BiBenhKhac}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Sống cùng địa chỉ
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.SongCungDiaChi === 1
    //                                                 ? 'Có'
    //                                                 : 'Không '}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Người thân bị bênh
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NguoiThanBiBenh}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Tình trạng hiện tại
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
    //                                             8. Tiền sử covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Nhiễm covid
    //                                         </dt>
    //                                         {entityObj.NhiemCovid !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhiemCovid ===
    //                                                 true
    //                                                     ? 'Không'
    //                                                     : 'Có '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Bị trước khi tiêm
    //                                         </dt>
    //                                         {entityObj.BiTruocTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiTruocTiem ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bị sau khi tiêm
    //                                         </dt>
    //                                         {entityObj.BiSauTiem !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.BiSauTiem ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng covid
    //                                         </dt>
    //                                         {entityObj.CoTrieuChung !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.CoTrieuChung ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng nhẹ
    //                                         </dt>
    //                                         {entityObj.TrieuChungNhe !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungNhe ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Triệu chứng trung bình
    //                                         </dt>
    //                                         {entityObj.TrieuChungtrungBinh !==
    //                                         null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.TrieuChungtrungBinh ===
    //                                                 true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Triệu chúng nặng phải nhập viện
    //                                         </dt>
    //                                         {entityObj.NhapVien !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.NhapVien === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Thời gian nằm viện(ngày)
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThoiGianNamVien}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thở máy
    //                                         </dt>
    //                                         {entityObj.ThoMay !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoMay === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                         <dt className="col-sm-2">
    //                                             Thở HFNC
    //                                         </dt>
    //                                         {entityObj.ThoHFNC !== null ? (
    //                                             <dd className="col-sm-4">
    //                                                 {entityObj.ThoHFNC === true
    //                                                     ? 'Có'
    //                                                     : 'Không '}
    //                                             </dd>
    //                                         ) : (
    //                                             <dd className="col-sm-4"> </dd>
    //                                         )}
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             9. Tiêm vaccine ngừa covid
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 1
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
    //                                             Phản ứng sau tiêm mũi 1
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine2}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 2
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
    //                                             Phản ứng sau tiêm mũi 2
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng2}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiêm vaccine ngừa covid mũi 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.TiemVaccine3}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Ngày tiêm mũi 3
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
    //                                             Phản ứng sau tiêm mũi 3
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.PhanUng3}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                         </Tab>
    //                         <Tab eventKey="kinhte" title="III. Kinh tế">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh tế
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập của bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapBenhNhan ? (
    //                                                 <>
    //                                                     {' '}
    //                                                     {
    //                                                         entityObj.ThuNhapBenhNhan
    //                                                     }{' '}
    //                                                     VND/Tháng
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
    //                                             Thu nhập của Vợ/Chồng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ThuNhapVoChongBenhNhan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.ThuNhapVoChongBenhNhan
    //                                                     }{' '}
    //                                                     VND/Tháng
    //                                                 </>
    //                                             ) : (
    //                                                 <></>
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập khác
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.ThuNhapKhac ? (
    //                                                 <>
    //                                                     {entityObj.ThuNhapKhac}{' '}
    //                                                     VND/Tháng
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
    //                                             Tiền chuẩn bị cho việc ghép{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             (có sẵn)
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.TienChuanBiChoViecGhepThan ? (
    //                                                 <>
    //                                                     {
    //                                                         entityObj.TienChuanBiChoViecGhepThan
    //                                                     }{' '}
    //                                                     VND/Tháng
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
    //                         {/* <Tab eventKey="kinhte" title="III. Kinh tế">
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             III. Kinh tế
    //                                         </dt>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập của bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapBenhNhan
    //                                             )}{' '}
    //                                             VND/Tháng
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập của Vợ/Chồng
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapVoChongBenhNhan
    //                                             )}{' '}
    //                                             VND/Tháng
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.NgheNghiepVoChong}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Thu nhập khác
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {ChuyenGiaTien(
    //                                                 entityObj.ThuNhapKhac
    //                                             )}{' '}
    //                                             VND/Tháng
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Tiền chuẩn bị cho việc ghép{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             (có sẵn)
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
    //                             title="IV. Lý do đăng ký chờ ghép"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             IV. Lý do đăng ký chờ ghép{' '}
    //                                             {String(
    //                                                 entityObj.TenCoQuan
    //                                             ).toLowerCase()}{' '}
    //                                             từ người hiến chết não
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
    //                                                         Không có người hiến{' '}
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
    //                                                         Người hiến bị bệnh
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.NguoiChoKhongHoaHopMau
    //                                                             }
    //                                                         />
    //                                                         Người hiến không hòa
    //                                                         hợp nhóm máu
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>Lý do khác : </td>
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
    //                             title="V. Quan hệ gia đình"
    //                         >
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-12">
    //                                             VI. Quan hệ gia đình
    //                                         </dt>
    //                                         <dd className="col-sm-12">
    //                                             <table className="table table-striped">
    //                                                 <thead>
    //                                                     <tr>
    //                                                         <th>#</th>
    //                                                         <th>Quan hệ</th>
    //                                                         <th>Họ tên</th>
    //                                                         <th>Năm sinh</th>
    //                                                         <th>Nhóm máu</th>
    //                                                         <th>
    //                                                             Số điện thoại
    //                                                         </th>
    //                                                         <th>
    //                                                             Lý do không hiến
    //                                                             được
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
    //                         <Tab eventKey="FileDK" title="Đăng ký bản gốc">
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
    //                         <Tab eventKey="lichsuxuly" title="Lịch sử xử lý">
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Thời gian</th>
    //                                         <th>Người cập nhật</th>

    //                                         <th>Tiêu đề</th>
    //                                         <th>Nội dung</th>
    //                                         <th>Ghi chú</th>
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
    //                                                 Không có dữ liệu
    //                                             </td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </Tab>
    //                         <Tab
    //                             eventKey="thongbaoxetnghiem"
    //                             title="TB khám và làm xét nghiệm"
    //                         >
    //                             <table className="table table-bordered">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Thời gian</th>
    //                                         <th>Ngày hẹn</th>
    //                                         <th>Lý do</th>
    //                                         <th>Trạng thái</th>
    //                                         <th>Thời gian gửi</th>
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
    //                                                             ? 'Đã gửi'
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
    //                                                 Không có dữ liệu
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
    //                         Đóng
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
                return 'Nữ';
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
