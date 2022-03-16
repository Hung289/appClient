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
import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';
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

// import DangKyHienEditAdm from './DangKyHienEditAdm';
// import DangKyHienCreateAdm from './DangKyHienCreateAdm';
// import DangKyHienSearchAdm from './DangKyHienSearchAdm';
// import DangKyHienDetailAdm from './DangKyHienDetailAdm';
// import DangKyHienTangChangeStatus from './DangKyHienTangChangeStatus';

const HienTangCoQuanTbl = React.memo((props) => {
    const {
        OnChangePage,
        lstEntity,
        searchModel,
        onEditEntity,
        onChangGuiThe,
        setitemId,
        ChangeStatusAction,
        onChangeStatusEntity,
        DeleteAction,
        onOpenDetailModal,
        onTuyenChonModal,
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
                            key={`MoiTao_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    HienTangMoTangStatusConstant.MoiTao
                                )
                            }
                        >
                            Mới tạo
                        </Menu.Item>
                    </>
                );
            case HienTangMoTangStatusConstant.MoiTao:
                return (
                    <>
                        <Menu.Item
                            key={`DanhGiaNguyCo_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.DanhGiaNguyCo
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.DanhGiaNguyCo
                            )}
                        </Menu.Item>
                    </>
                );
            case HienTangMoTangStatusConstant.DanhGiaNguyCo:
                return (
                    <>
                        <Menu.Item
                            key={`DangChoTuyenChon_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.DangChoTuyenChon
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.DangChoTuyenChon
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`MoiTao_${id}`}
                            icon={<antIcon.RollbackOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    HienTangMoTangStatusConstant.MoiTao
                                )
                            }
                        >
                            Chuyển về Mới tạo
                        </Menu.Item>
                    </>
                );
            case HienTangMoTangStatusConstant.DangChoTuyenChon:
                return (
                    <>
                        <Menu.Item
                            key={`DaXacDinh_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.DaXacDinh
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.DaXacDinh
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`DanhGiaNguyCo_${id}`}
                            icon={<antIcon.RollbackOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.DanhGiaNguyCo
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.DanhGiaNguyCo
                            )}
                        </Menu.Item>
                    </>
                );
            case HienTangMoTangStatusConstant.DaXacDinh:
                return (
                    <>
                        <Menu.Item
                            key={`HoanThanh_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.HoanThanh
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.HoanThanh
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`DangChoTuyenChon_${id}`}
                            icon={<antIcon.RollbackOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HienTangMoTangStatusConstant.DangChoTuyenChon
                                )
                            }
                        >
                            {HienTangMoTangStatusConstant.GetName(
                                HienTangMoTangStatusConstant.DangChoTuyenChon
                            )}
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
                {record.Status !== HienTangMoTangStatusConstant.MoiTao &&
                    record.Status !==
                        HienTangMoTangStatusConstant.DanhGiaNguyCo && (
                        <Menu.Item
                            key={`TuyenChon_${record.Id}`}
                            onClick={() => {
                                onTuyenChonModal(record.Id);
                                // handleEditShow();
                            }}
                            icon={<antIcon.EditOutlined />}
                        >
                            Tuyển chọn người ghép
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
                    key={`xoa_${record.Id}`}
                    onClick={() => DeleteAction(record.Id)}
                    icon={<antIcon.DeleteOutlined />}
                >
                    Xóa
                </Menu.Item>

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
                    title="Người hiến"
                    render={(text, record, index) => {
                        if (record.phieuDangKyHien != null) {
                            return <div>{record.phieuDangKyHien.HoTen}</div>;
                        }
                        return <></>;
                    }}
                />

                <Column
                    title="Giới tính"
                    render={(text, record, index) => {
                        if (record.phieuDangKyHien != null) {
                            return (
                                <div>
                                    {CommonUtility.RenderGioiTinh(
                                        record.phieuDangKyHien.GioiTinh
                                    )}
                                </div>
                            );
                        }
                        return <></>;
                    }}
                />
                <Column
                    title="Cơ quan hiến tặng"
                    key="CoQuanHien"
                    render={(text, record, index) => (
                        <div>
                            {TypeBoPhanConstant.GetName(record.CoQuanHien)}
                        </div>
                    )}
                />

                <Column
                    title="Ngày hiến tặng"
                    key="NgayHienTang"
                    render={(text, record, index) => (
                        <div>
                            {CommonUtility.ShowDateVN(record.NgayHienTang)}
                        </div>
                    )}
                />
                <Column
                    title="Trạng thái"
                    dataIndex="Status"
                    key="Status"
                    render={(text, record, index) => (
                        <div>
                            {HienTangMoTangStatusConstant.GetName(
                                record.Status
                            )}
                        </div>
                    )}
                />
                <Column title="Ghi chú" dataIndex="GhiChu" key="GhiChu" />
            </Table>
        </>
    );
});
export default HienTangCoQuanTbl;
