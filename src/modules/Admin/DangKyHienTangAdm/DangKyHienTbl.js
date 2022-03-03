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
                            key={`ChoTiepNhan${id}`}
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

    const RenderPage = () => {
        //     const totalPage =
        //         lstEntity.TotalPage !== undefined ? lstEntity.TotalPage : 1;
        //     const curPage =
        //         lstEntity.CurrentPage !== undefined || lstEntity.CurrentPage
        //             ? lstEntity.CurrentPage
        //             : 1;
        //     const reder = [];
        //     const lstPageRender = CommonUtility.GetListPageGen(totalPage, curPage);
        //     // eslint-disable-next-line no-plusplus
        //     if (lstPageRender && lstPageRender.length > 1 && lstPageRender[0] > 1) {
        //         reder.push(
        //             <li className={`page-item `} key={-1}>
        //                 <Button className="page-link">...</Button>
        //             </li>
        //         );
        //     }
        //     for (let index = 0; index < lstPageRender.length; index += 1) {
        //         let acClass = '';
        //         if (lstPageRender[index] === curPage) {
        //             acClass = 'active';
        //         }
        //         reder.push(
        //             <li className={`page-item ${acClass}`} key={index}>
        //                 <Button
        //                     className="page-link"
        //                     onClick={() => NextPage(lstPageRender[index], pageSize)}
        //                 >
        //                     {lstPageRender[index]}
        //                 </Button>
        //             </li>
        //         );
        //     }
        //     if (
        //         lstPageRender &&
        //         lstPageRender.length > 1 &&
        //         lstPageRender[lstPageRender.length - 1] < totalPage
        //     ) {
        //         reder.push(
        //             <li className={`page-item `} key={-2}>
        //                 <Button className="page-link">...</Button>
        //             </li>
        //         );
        //     }
        //     return reder;
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
                        key={`GuiThe_${record.Id}`}
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
                    render={(text, record, index) => (
                        <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                    )}
                />
                <Column
                    title="Ảnh"
                    className="with16vh"
                    key="Avatar"
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
                <Column
                    title="Thao tác"
                    key="action"
                    render={(text, record) => (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getmenu(record)}
                        >
                            Chi tiết
                        </Dropdown.Button>
                    )}
                />
            </Table>
            <>
                {/* <div className="table-responsive">
                <table className="table table-hinetNew" id="dsTable">
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className="checkAll"
                                    onClick={(e) => CheckAllItem(e, 'dsTable')}
                                />
                            </th>
                            <th scope="col">#</th>
                            <th className="imgHinhAnhColAccount mw-image-avatar">
                                Ảnh
                            </th>
                            <th scope="col" className="widthColTableMedium">
                                Họ tên
                            </th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Ngày sinh</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Điện thoại</th>
                            <th scope="col">Nghề nghiệp</th>
                            <th scope="col">CCCD/Hộ chiếu</th>
                            <th scope="col">Gửi thẻ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lstItem.length > 0 ? (
                            lstItem.map((item, key) => {
                                const rIndex =
                                    (pageInd - 1) * pageSiz + key + 1;
                                return (
                                    <tr
                                        key={key}
                                        onClick={(e) => CheckRowsHinetTable(e)}
                                    >
                                        <td>
                                            <input
                                                className="checkTd"
                                                type="checkbox"
                                                data-id={item.Id}
                                                onClick={(e) =>
                                                    CheckRowsHinetTable(e)
                                                }
                                            />
                                        </td>
                                        <th scope="row">{rIndex}</th>

                                        <td>
                                            {item.Avatar !== '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${item.Avatar}`}
                                                        onError={
                                                            NotFoundUserImage
                                                        }
                                                        alt=""
                                                        className="imgHinhAnhAccount img-thumbnail"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                        <td>
                                            <div className="tableBoxMain">
                                                <div className="tableBoxMain-label">
                                                    {item.DonDKBanCung !==
                                                    null ? (
                                                        <>
                                                            {item.HoTen}
                                                            <div>
                                                                <i className="fa fa-check" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>{item.HoTen}</>
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
                                                                    onInThe(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-image" />
                                                                </span>
                                                                <span>
                                                                    In thẻ
                                                                </span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    onInPhieu(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-image" />
                                                                </span>
                                                                <span>
                                                                    In phiếu
                                                                    đăng ký
                                                                </span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    onEditEntity(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-edit" />
                                                                </span>
                                                                <span>Sửa</span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    onChangGuiThe(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-envelope" />
                                                                </span>
                                                                <span>
                                                                    Gửi thẻ
                                                                </span>
                                                            </Dropdown.Item>
                                                            {item.Status ===
                                                            DangKyHienMoTangConstant.DaTiepNhan ? (
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onUpDonDK(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-envelope" />
                                                                    </span>
                                                                    <span>
                                                                        Tải đơn
                                                                        bản cứng
                                                                    </span>
                                                                </Dropdown.Item>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <ActionStatusRender
                                                                id={item.Id}
                                                                Cstatus={
                                                                    item.Status
                                                                }
                                                            />

                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    DeleteAction(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-times" />
                                                                </span>
                                                                <span>Xóa</span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    onOpenDetailModal(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-info-circle" />
                                                                </span>
                                                                <span>
                                                                    Xem chi tiết
                                                                </span>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {DangKyHienMoTangConstant.GetName(
                                                item.Status
                                            )}
                                        </td>
                                        <td>
                                            {CommonUtility.ShowDateVN(
                                                item.NgaySinh
                                            )}
                                        </td>
                                        <td>
                                            {CommonUtility.RenderGioiTinh(
                                                item.GioiTinh
                                            )}
                                        </td>
                                        <td>{item.SoDienThoai}</td>
                                        <td>{item.NgheNghiep}</td>
                                        <td>{item.SoCMND}</td>
                                        <td>
                                            {DangKyHienGuiTheConstant.GetName(
                                                item.IsGuiThe
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <NotDataToShow colNum={11} />
                        )}
                    </tbody>
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className="checkAll"
                                    onClick={(e) => CheckAllItem(e, 'dsTable')}
                                />
                            </th>
                            <th scope="col">#</th>
                            <th className="imgHinhAnhColAccount mw-image-avatar">
                                Ảnh
                            </th>
                            <th scope="col" className="widthColTableMedium">
                                Họ tên
                            </th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Ngày sinh</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Điện thoại</th>
                            <th scope="col">Nghề nghiệp</th>
                            <th scope="col">CCCD/Hộ chiếu</th>
                            <th scope="col">Gửi thẻ</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <DisplayPageNavigation /> */}
            </>
        </>
    );
});
export default DangKyHienTbl;
