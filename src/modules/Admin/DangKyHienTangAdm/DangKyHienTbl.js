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
import * as antIcon from '@ant-design/icons';

import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';
import axios from 'axios';
import {
    Modal,
    // Button,
    //  Col,
    // Dropdown,
    ListGroup,
    ListGroupItem,
    Card
    // Tabs,
    // Tab
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
import DangKyHienDetailAdm from './DangKyHienDetailAdm';
import DangKyHienTangChangeStatus from './DangKyHienTangChangeStatus';

const DangKyHienTbl = React.memo((props) => {
    const {
        OnChangePage,
        lstEntity,
        onInThe,
        searchModel,
        onInPhieu,
        onUpDonDK,
        onEditEntity,
        onHienTangCoQuan,
        onEditHLAEntity,
        onEditVGBEntity,
        onChangGuiThe,
        setitemId,
        ChangeStatusAction,
        onChangeStatusEntity,
        DeleteAction,
        onOpenDetailModal,
        onReloadPage
    } = props;
    const {
        Drawer,
        Button,
        Space,
        Form,
        Row,
        Col,
        Input,
        Radio,
        Select,
        notification,
        Descriptions,
        Table,
        Dropdown,
        Menu,
        Pagination
    } = antd;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    let dataSelected;
    useEffect(() => {
        return () => {};
    }, [lstEntity]);

    const ActionStatusRender = (prop) => {
        const {id, Cstatus} = prop;
        switch (Cstatus) {
            case '':
            case null:
                return (
                    <>
                        <Menu.Item
                            key={`ChoTiepNhan_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyHienMoTangConstant.ChoTiepNhan
                                )
                            }
                        >
                            Chờ tiếp nhận
                        </Menu.Item>
                        <Menu.Item
                            key={`Huy_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyHienMoTangConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.HuyDangKy
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyHienMoTangConstant.ChoTiepNhan:
                return (
                    <>
                        <Menu.Item
                            key={`TiepNhan_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyHienMoTangConstant.DaTiepNhan
                                )
                            }
                        >
                            Tiếp nhận
                        </Menu.Item>
                        <Menu.Item
                            key={`TuChoi_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.TuChoi
                                )
                            }
                        >
                            Từ chối
                        </Menu.Item>
                        <Menu.Item
                            key={`Huy_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.HuyDangKy
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyHienMoTangConstant.DaTiepNhan:
                return (
                    <>
                        <Menu.Item
                            key={`DaNhanDon_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyHienMoTangConstant.HoanThanh
                                )
                            }
                        >
                            Đã nhận đơn
                        </Menu.Item>
                        <Menu.Item
                            key={`TuChoi_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.TuChoi
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.TuChoi
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`Huy_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.HuyDangKy
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyHienMoTangConstant.TuChoi:
                return (
                    <>
                        <Menu.Item
                            key={`ChoTiepNhan_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.ChoTiepNhan
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.ChoTiepNhan
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyHienMoTangConstant.HuyDangKy:
                return (
                    <>
                        <Menu.Item
                            key={`ChoTiepNhan_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.ChoTiepNhan
                                )
                            }
                        >
                            {DangKyHienMoTangConstant.GetName(
                                DangKyHienMoTangConstant.ChoTiepNhan
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyHienMoTangConstant.HoanThanh:
                return (
                    <>
                        <Menu.Item
                            key={`DoiDon_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.DaTiepNhan
                                )
                            }
                        >
                            Đợi đơn đăng ký
                        </Menu.Item>
                        <Menu.Item
                            key={`DaNhanDonHuy_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyHienMoTangConstant.HuyDonDK
                                )
                            }
                        >
                            Đã nhận đơn hủy
                        </Menu.Item>
                    </>
                );

            default:
                return <></>;
        }
    };

    const NextPage = (pageInd, pageSize) => {
        OnChangePage(pageInd, pageSize);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dataSelected = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
            // disabled: record.name === 'Disabled User',
            // // Column configuration not to be checked
            // name: record.name
        })
    };

    let lstItem = [];
    let pageSiz = 5;
    let pageInd = 1;
    let Count = 0;
    if (lstEntity.ListItem !== undefined) {
        lstItem = lstEntity.ListItem;
        pageInd = lstEntity.CurrentPage;
        Count = lstEntity.Count;
    }
    if (searchModel !== undefined) {
        pageSiz = searchModel.PageSize;
    }
    const getmenu = (record) => (
        <>
            <Menu>
                {record.Status === DangKyHienMoTangConstant.HoanThanh && (
                    <Menu.Item
                        key={`hiencoquan_${record.Id}`}
                        onClick={() => {
                            onHienTangCoQuan(record.Id);
                        }}
                        icon={<antIcon.PlusCircleOutlined />}
                    >
                        Hiến tặng mô tạng
                    </Menu.Item>
                )}

                <Menu.Item
                    key={`sua_${record.Id}`}
                    onClick={() => {
                        onEditEntity(record.Id);
                        // handleEditShow();
                    }}
                    icon={<antIcon.EditOutlined />}
                >
                    Sửa
                </Menu.Item>

                <Menu.Item
                    key={`capnhat_${record.Id}`}
                    onClick={() => {
                        onEditHLAEntity(record.Id);
                        // handleEditShow();
                    }}
                    icon={<antIcon.EditOutlined />}
                >
                    Cập nhật kết quả HLA
                </Menu.Item>
                <Menu.Item
                    key={`capnhatVGB_${record.Id}`}
                    onClick={() => {
                        onEditVGBEntity(record.Id);
                        // handleEditShow();
                    }}
                    icon={<antIcon.EditOutlined />}
                >
                    Cập nhật kết quả viêm gan B
                </Menu.Item>
                <Menu.Item
                    key={`xoa_${record.Id}`}
                    onClick={() => DeleteAction(record.Id)}
                    icon={<antIcon.DeleteOutlined />}
                >
                    Xóa
                </Menu.Item>

                <Menu.Item
                    key={`Inthe_${record.Id}`}
                    icon={<antIcon.FileImageOutlined />}
                    onClick={() => onInThe(record.Id)}
                >
                    In thẻ
                </Menu.Item>
                <Menu.Item
                    key={`Inphieu_${record.Id}`}
                    icon={<antIcon.PrinterOutlined />}
                    onClick={() => onInPhieu(record.Id)}
                >
                    In phiếu đăng ký
                </Menu.Item>
                <Menu.Item
                    key={`GuiThe_${record.Id}`}
                    icon={<antIcon.SendOutlined />}
                    onClick={() => onChangGuiThe(record.Id)}
                >
                    Gửi thẻ
                </Menu.Item>
                {record.Status === DangKyHienMoTangConstant.DaTiepNhan ? (
                    <Menu.Item
                        key={`TaiDon_${record.Id}`}
                        icon={<antIcon.DownloadOutlined />}
                        onClick={() => onUpDonDK(record.Id)}
                    >
                        Tải đơn bản cứng
                    </Menu.Item>
                ) : (
                    <></>
                )}
                <ActionStatusRender id={record.Id} Cstatus={record.Status} />
            </Menu>
        </>
    );
    return (
        <>
            <Table
                rowKey="Id"
                rowSelection={rowSelection}
                dataSource={lstItem}
                scroll={{x: 'max-content'}}
                pagination={{
                    total: Count,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSize: pageSiz,
                    current: pageInd,
                    showTotal: (total) => `Tổng cộng ${total} bản ghi`,
                    onChange: (page, pageSize) => {
                        NextPage(page, pageSize);
                    }
                }}
            >
                <Column
                    title="#"
                    key="STT"
                    fixed="left"
                    render={(text, record, index) => (
                        <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                    )}
                />
                <Column
                    title="Thao tác"
                    key="action"
                    fixed="left"
                    render={(text, record) => (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getmenu(record)}
                        >
                            Chi tiết
                        </Dropdown.Button>
                    )}
                />
                <Column
                    title="Ảnh"
                    className="with16vh"
                    key="Avatar"
                    fixed="left"
                    responsive={['lg']}
                    render={(text, record, index) => (
                        <div>
                            {record.Avatar !== '' ? (
                                <>
                                    <img
                                        src={`${Constant.PathServer}${record.Avatar}`}
                                        onError={NotFoundUserImage}
                                        alt=""
                                        className="imgHinhAnhAccount img-thumbnail"
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                />

                <Column
                    title="Họ tên"
                    key="HoTen"
                    fixed="left"
                    render={(text, record, index) => (
                        <div className="tableBoxMain">
                            <div className="tableBoxMain-label">
                                <strong>
                                    {record.DonDKBanCung !== null ? (
                                        <>
                                            {record.HoTen}
                                            <div>
                                                <i className="fa fa-check" />
                                            </div>
                                        </>
                                    ) : (
                                        <>{record.HoTen}</>
                                    )}
                                </strong>
                                <div>
                                    {record.IsGuiThe ? (
                                        <span className="statusSendMailSuccess">
                                            <i className="fas fa-envelope" /> Đã
                                            gửi thẻ
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Column
                    title="Đã hiến"
                    render={(text, record, index) => {
                        if (record.hienTangCoQuans) {
                            return (
                                <div>
                                    {record.hienTangCoQuans.map((it) => (
                                        <p>
                                            {TypeBoPhanConstant.GetName(
                                                it.CoQuanHien
                                            )}
                                        </p>
                                    ))}
                                </div>
                            );
                        }
                        return <></>;
                    }}
                />
                <Column
                    title="Trạng thái"
                    key="Status"
                    render={(text, record, index) => (
                        <div>
                            {DangKyHienMoTangConstant.GetName(record.Status)}
                        </div>
                    )}
                />
                <Column
                    title="Ngày sinh"
                    key="NgaySinh"
                    render={(text, record, index) => (
                        <div>{CommonUtility.ShowDateVN(record.NgaySinh)}</div>
                    )}
                />
                <Column
                    title="Giới tính"
                    key="GioiTinh"
                    render={(text, record, index) => (
                        <div>
                            {CommonUtility.RenderGioiTinh(record.GioiTinh)}
                        </div>
                    )}
                />
                <Column
                    title="Số điện thoại"
                    dataIndex="SoDienThoai"
                    key="SoDienThoai"
                />
                <Column
                    title="Nghề nghiệp"
                    dataIndex="NgheNghiep"
                    key="NgheNghiep"
                />
                <Column title="CCCD/Hộ chiếu" dataIndex="SoCMND" key="SoCMND" />
                {/* <Column
                    title="Gửi thẻ"
                    key="IsGuiThe"
                    render={(text, record, index) => (
                        <div>
                            {DangKyHienGuiTheConstant.GetName(record.IsGuiThe)}
                        </div>
                    )}
                /> */}
            </Table>
        </>
    );
});
export default DangKyHienTbl;
