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
    Table
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
                    <TabPane tab="Đăng ký bản gốc" key="2">
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
                    <TabPane tab="Lịch sử xử lý" key="3">
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
    // function DetailModal() {
    //     const [key, setKey] = useState('thongtincoban');
    //     return (
    //         <>
    //             <Modal
    //                 show={showDetailModal}
    //                 dialogClassName="modal-90w"
    //                 onHide={() => setshowDetailModal(false)}
    //             >
    //                 <Modal.Header closeButton>
    //                     <Modal.Title>Chi tiết đăng ký hiến tạng</Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body>
    //                     <Tabs
    //                         id="controlled-tab-example"
    //                         activeKey={key}
    //                         onSelect={(k) => setKey(k)}
    //                         className="mb-3"
    //                     >
    //                         <Tab
    //                             eventKey="thongtincoban"
    //                             title="Thông tin cơ bản"
    //                         >
    //                             <ListGroup className="list-group-flush">
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
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Họ và tên
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.HoTen}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Mã số bệnh nhân
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.MaSo}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Giới tính
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {entityObj.GioiTinhTxt}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngày sinh
    //                                         </dt>
    //                                         <dd className="col-sm-1">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgaySinh
    //                                             )}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Năm sinh
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NamSinh}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ngày đăng ký
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayDK
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Năm đăng ký
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NamDK}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Ghi chú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.GhiChu}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             {' '}
    //                                             Điện thoại
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoDienThoai}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             {' '}
    //                                             Điện thoại Khác
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoDienThoai1}
    //                                         </dd>
    //                                         <dt className="col-sm-1"> Email</dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.Email}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-1">
    //                                             Địa chỉ thường trú
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChi}
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
    //                                             Địa chỉ nhận thẻ ĐK
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.DiaChiNhanTheDangKy}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Xã/ Phường:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenXaNhanThe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Quận/ Huyện:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenHuyenNhanThe}
    //                                         </dd>
    //                                         <dt className="col-sm-1">
    //                                             Tỉnh/T.Phố:
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.TenTinhNhanThe}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                             </ListGroup>
    //                             <ListGroup className="list-group-flush">
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Ảnh CMND mặt trước
    //                                         </dt>
    //                                         <dd className="col-sm-4">
    //                                             {entityObj.ImgCMNDMatTruoc !==
    //                                             null ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDMatTruoc}`}
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
    //                                             {entityObj.ImgCMNDMatSau !==
    //                                             null ? (
    //                                                 <>
    //                                                     <img
    //                                                         src={`${Constant.PathServer}${entityObj.ImgCMNDMatSau}`}
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
    //                                         <dt className="col-sm-2">
    //                                             {' '}
    //                                             Nghề nghiệp
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNghiep}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             {' '}
    //                                             Nghề nghiệp bổ sung
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NgheNhiepBoSung}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             Nơi công tác(nếu có)
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NoiCongTac}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             CMND/CCCD/Hộ chiếu
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.SoCMND}
    //                                         </dd>

    //                                         <dt className="col-sm-2">
    //                                             {' '}
    //                                             Ngày cấp
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {CommonUtility.ShowDateVN(
    //                                                 entityObj.NgayCap
    //                                             )}
    //                                         </dd>
    //                                         <dt className="col-sm-2">
    //                                             {' '}
    //                                             Nơi cấp
    //                                         </dt>
    //                                         <dd className="col-sm-2">
    //                                             {entityObj.NoiCap}
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Bộ phận cơ thể tình nguyện sẽ
    //                                             hiến sau khi chết
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             <table className="tablebophanhien">
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Than
    //                                                             }
    //                                                         />
    //                                                         Thận
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Gan
    //                                                             }
    //                                                         />
    //                                                         Gan
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.TuyTang
    //                                                             }
    //                                                         />
    //                                                         Tụy tạng
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Tim
    //                                                             }
    //                                                         />
    //                                                         Tim
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Phoi
    //                                                             }
    //                                                         />
    //                                                         Phổi
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Ruot
    //                                                             }
    //                                                         />
    //                                                         Ruột
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Da
    //                                                             }
    //                                                         />
    //                                                         Da
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.GiacMac
    //                                                             }
    //                                                         />
    //                                                         Giác mạc
    //                                                     </td>
    //                                                 </tr>
    //                                                 <tr>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.Xuong
    //                                                             }
    //                                                         />
    //                                                         Chi thể
    //                                                     </td>
    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.MachMau
    //                                                             }
    //                                                         />
    //                                                         Mạch máu
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.VanTim
    //                                                             }
    //                                                         />
    //                                                         Van tim
    //                                                     </td>

    //                                                     <td>
    //                                                         <input
    //                                                             type="checkbox"
    //                                                             checked={
    //                                                                 entityObj.ChiThe
    //                                                             }
    //                                                         />
    //                                                         Chi thể
    //                                                     </td>
    //                                                 </tr>
    //                                             </table>
    //                                         </dd>
    //                                     </dl>
    //                                 </ListGroupItem>
    //                                 <ListGroupItem>
    //                                     <dl className="row">
    //                                         <dt className="col-sm-2">
    //                                             Di nguyện về việc xử lý cơ thể
    //                                             sau khi hiến mô tạng
    //                                         </dt>
    //                                         <dd className="col-sm-10">
    //                                             {entityObj.DiNguyen}
    //                                             {', '}
    //                                             {entityObj.DiNguyenKhac}
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
    //                                                             {itm.CreatedBy}-{' '}
    //                                                             {itm.CreatedID}
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
    //                     </Tabs>
    //                 </Modal.Body>
    //                 <Modal.Footer>
    //                     <Button
    //                         variant="secondary"
    //                         onClick={() => setshowDetailModal(false)}
    //                     >
    //                         Đóng
    //                     </Button>
    //                 </Modal.Footer>
    //             </Modal>
    //         </>
    //     );
    // }
    return (
        <>
            <DetailModal />
        </>
    );
};

export default DangKyHienDetailAdm;
