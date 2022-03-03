import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as antd from 'antd';
import {SearchOutlined, DeleteOutlined} from '@ant-design/icons';
import * as antIcon from '@ant-design/icons';

import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import {
    Modal,
    // Button,
    // Col,
    // Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse
    // Tabs,
    // Tab
} from 'react-bootstrap';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as CommonUtility from '@modules/Common/CommonUtility';

const DangKyChoGhepTangTbl = React.memo((props) => {
    const {
        DeleteKetQuaXetNghiemAction,
        OnChangePage,
        lstEntity,
        coquan,
        onCreateKQXNEntity,
        onEditKQEntity,
        onUpDonDK,
        onLyDoOut,
        searchModel,
        onInPhieuThan,
        onEditEntity,
        onInPhieuKhac,
        setitemId,
        setshowTBXetNghiemModal,
        ChangeStatusAction,
        onChangeStatusEntity,
        DeleteAction,
        onOpenDetailModal,
        onOpenDetailKQModal
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
        Avatar,
        Pagination
    } = antd;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    let dataSelected;

    const ActionStatusRender = (prop) => {
        const {id, Cstatus} = prop;
        switch (Cstatus) {
            case '':
            case null:
                return (
                    <>
                        <Menu.Item
                            key={`chotn_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.ChoTiepNhan
                                )
                            }
                        >
                            Chờ tiếp nhận
                        </Menu.Item>
                        <Menu.Item
                            key={`Huydk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.HuyDangKy
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.ChoTiepNhan:
                return (
                    <>
                        <Menu.Item
                            key={`datn_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.DaTiepNhan
                                )
                            }
                        >
                            Tiếp nhận
                        </Menu.Item>
                        <Menu.Item
                            key={`tuC_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyChoGhepConstant.TuChoi
                                )
                            }
                        >
                            Từ chối
                        </Menu.Item>
                        <Menu.Item
                            key={`huydk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyChoGhepConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.HuyDangKy
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.DaTiepNhan:
                return (
                    <>
                        <Menu.Item
                            key={`tuc_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyChoGhepConstant.TuChoi
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.TuChoi
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`huydk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyChoGhepConstant.HuyDangKy
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.HuyDangKy
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`dacdk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    DangKyChoGhepConstant.DaCoDonDK
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.DaCoDonDK
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.DaCoDonDK:
                return (
                    <>
                        <Menu.Item
                            key={`datn_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.DaTiepNhan
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.DaTiepNhan
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`hoant_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.HoanThanh
                                )
                            }
                        >
                            Đưa vào ds chờ ghép
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.TuChoi:
                return (
                    <>
                        <Menu.Item
                            key={`tuc_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.ChoTiepNhan
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.ChoTiepNhan
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.HuyDangKy:
                return (
                    <>
                        <Menu.Item
                            key={`chotn_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.ChoTiepNhan
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.ChoTiepNhan
                            )}
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.HoanThanh:
                return (
                    <>
                        {/* <Dropdown.Item
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.DuaRaKhoiDS
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>
                                {DangKyChoGhepConstant.GetName(
                                    DangKyChoGhepConstant.DuaRaKhoiDS
                                )}
                            </span>
                        </Dropdown.Item> */}
                        <Menu.Item
                            key={`dacddk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.DaCoDonDK
                                )
                            }
                        >
                            {DangKyChoGhepConstant.GetName(
                                DangKyChoGhepConstant.DaCoDonDK
                            )}
                        </Menu.Item>
                        <Menu.Item
                            key={`huydk_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.HuyDonDK
                                )
                            }
                        >
                            Đã nhận đơn hủy đăng ký
                        </Menu.Item>
                    </>
                );
            case DangKyChoGhepConstant.DuaRaKhoiDS:
                return (
                    <>
                        <Menu.Item
                            key={`duyvds_${id}`}
                            icon={<antIcon.ShareAltOutlined />}
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    DangKyChoGhepConstant.HoanThanh
                                )
                            }
                        >
                            Đưa vào danh sách chờ
                        </Menu.Item>
                    </>
                );
            default:
                return <></>;
        }
    };
    useEffect(() => {
        return () => {};
    }, [lstEntity]);
    const NextPage = (pageIndx, pageSize) => {
        OnChangePage(pageIndx, pageSize);
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
        // const totalPage =
        //     lstEntity.TotalPage !== undefined ? lstEntity.TotalPage : 1;
        // const curPage =
        //     lstEntity.CurrentPage !== undefined || lstEntity.CurrentPage
        //         ? lstEntity.CurrentPage
        //         : 1;
        // const reder = [];
        // const lstPageRender = CommonUtility.GetListPageGen(totalPage, curPage);
        // // eslint-disable-next-line no-plusplus
        // if (lstPageRender && lstPageRender.length > 1 && lstPageRender[0] > 1) {
        //     reder.push(
        //         <li className={`page-item `} key={-1}>
        //             <Button className="page-link">...</Button>
        //         </li>
        //     );
        // }
        // for (let index = 0; index < lstPageRender.length; index += 1) {
        //     let acClass = '';
        //     if (lstPageRender[index] === curPage) {
        //         acClass = 'active';
        //     }
        //     reder.push(
        //         <li className={`page-item ${acClass}`} key={index}>
        //             <Button
        //                 className="page-link"
        //                 onClick={() => NextPage(lstPageRender[index])}
        //             >
        //                 {lstPageRender[index]}
        //             </Button>
        //         </li>
        //     );
        // }
        // if (
        //     lstPageRender &&
        //     lstPageRender.length > 1 &&
        //     lstPageRender[lstPageRender.length - 1] < totalPage
        // ) {
        //     reder.push(
        //         <li className={`page-item `} key={-2}>
        //             <Button className="page-link">...</Button>
        //         </li>
        //     );
        // }
        // return reder;
    };

    let lstItem = [];
    let pageSiz = 5;
    let pageInd = 1;
    let Count = 0;
    if (lstEntity.ListItem !== undefined) {
        lstItem = lstEntity.ListItem;
        pageInd = lstEntity.CurrentPage;
        Count = lstEntity.Count;
        // pageSiz = lstEntity.PageSize;
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
                        onEditEntity(record.Id, record.TenCoQuan);
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
                {record.TypePhieuDKGhepTang === 'than' ? (
                    <>
                        <Menu.Item
                            key={`inPhieu_${record.Id}`}
                            icon={<antIcon.PrinterOutlined />}
                            onClick={() => onInPhieuThan(record.Id)}
                        >
                            In phiếu đăng ký
                        </Menu.Item>
                    </>
                ) : (
                    <>
                        <Menu.Item
                            key={`inPhieuKhac_${record.Id}`}
                            icon={<antIcon.PrinterOutlined />}
                            onClick={() => onInPhieuKhac(record.Id)}
                        >
                            In phiếu đăng ký
                        </Menu.Item>
                    </>
                )}
                <Menu.Item
                    onClick={() => {
                        setitemId(record.Id);
                        setshowTBXetNghiemModal(true);
                    }}
                    key={`henXn_${record.Id}`}
                    icon={<antIcon.SendOutlined />}
                >
                    Thông báo hẹn xét nghiệm
                </Menu.Item>
                {record.Status === DangKyChoGhepConstant.DaTiepNhan ? (
                    <Menu.Item
                        key={`downbc_${record.Id}`}
                        icon={<antIcon.DownloadOutlined />}
                        onClick={() => onUpDonDK(record.Id)}
                    >
                        Tải đơn bản cứng
                    </Menu.Item>
                ) : (
                    <></>
                )}
                {record.Status === DangKyChoGhepConstant.HoanThanh ? (
                    <Menu.Item
                        key={`downbc_${record.Id}`}
                        icon={<antIcon.ShareAltOutlined />}
                        onClick={() => onLyDoOut(record.Id)}
                    >
                        Lý do đưa ra ngoài danh sách
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
                                    {/* <Avatar
                                        shape="square"
                                        size={64}
                                        src={`${Constant.PathServer}${record.Avatar}`}
                                    /> */}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                />
                <Column
                    title="Họ tên bệnh nhân"
                    key="TenNguoiPhuTrach"
                    render={(text, record, index) => (
                        <div className="tableBoxMain">
                            <div className="tableBoxMain-label">
                                <strong>
                                    <div className="tableBoxMain-label">
                                        {record.DonDKBanCung !== null ? (
                                            <>
                                                {record.HoTenBN}
                                                <div>
                                                    <i className="fa fa-check" />
                                                </div>
                                            </>
                                        ) : (
                                            <>{record.HoTenBN}</>
                                        )}
                                    </div>
                                </strong>
                                <div>
                                    {record.IsGuiEmailThongBao ? (
                                        <span
                                            className="statusSendMailSuccess"
                                            title={CommonUtility.ShowDateTimeVN(
                                                record.ThoiGianGuiEmailThongBao
                                            )}
                                        >
                                            <i className="fas fa-envelope" /> Đã
                                            gửi Mail
                                        </span>
                                    ) : (
                                        <span>Chưa gửi mail</span>
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
                            {DangKyChoGhepConstant.GetName(record.Status)}
                        </div>
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
                    title="Ngày sinh"
                    key="NgaySinh"
                    render={(text, record, index) => (
                        <div>{CommonUtility.ShowDateVN(record.NgaySinh)}</div>
                    )}
                />

                <Column
                    title="Nghề nghiệp"
                    dataIndex="NgheNghiep"
                    key="NgheNghiep"
                />
                <Column
                    title="Số điện thoại"
                    dataIndex="DienThoai"
                    key="DienThoai"
                />
                <Column title="Nhóm máu" dataIndex="NhomMau" key="NhomMau" />
                {/* <Column
                    title="Loại chờ ghép"
                    dataIndex="TenCoQuan"
                    key="TenCoQuan"
                /> */}
                <Column
                    title="Thao tác"
                    key="action"
                    render={(text, record) => (
                        <Dropdown.Button
                            onClick={() =>
                                onOpenDetailModal(
                                    record.Id,
                                    record.TypePhieuDKGhepTang
                                )
                            }
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
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th className="imgHinhAnhColAccount mw-image-avatar">
                                    Ảnh
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Họ tên bệnh nhân
                                </th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Nghề nghiệp</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Nhóm máu</th>
                                <th scope="col">Loại chờ ghép</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lstItem.length > 0 ? (
                                lstItem.map((item, key) => {
                                    const rIndex =
                                        (pageInd - 1) * pageSiz + key + 1;
                                    return (
                                        <tr
                                            key={`${item.hoTenBN}-${item.NhomMau}-${key}`}
                                            onClick={(e) =>
                                                CheckRowsHinetTable(e)
                                            }
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
                                                        <strong>
                                                            <div className="tableBoxMain-label">
                                                                {item.DonDKBanCung !==
                                                                null ? (
                                                                    <>
                                                                        {
                                                                            item.HoTenBN
                                                                        }
                                                                        <div>
                                                                            <i className="fa fa-check" />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            item.HoTenBN
                                                                        }
                                                                    </>
                                                                )}
                                                            </div>
                                                        </strong>
                                                        <div>
                                                            {item.IsGuiEmailThongBao ? (
                                                                <span
                                                                    className="statusSendMailSuccess"
                                                                    title={CommonUtility.ShowDateTimeVN(
                                                                        item.ThoiGianGuiEmailThongBao
                                                                    )}
                                                                >
                                                                    <i className="fas fa-envelope" />{' '}
                                                                    Đã gửi Mail
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    Chưa gửi
                                                                    mail
                                                                </span>
                                                            )}
                                                        </div>
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
                                                                {item.TypePhieuDKGhepTang ===
                                                                'than' ? (
                                                                    <>
                                                                         <Dropdown.Item
                                                                        href={`/admin/hosogheptangchitiet/${item.Id}`}
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-info-circle" />
                                                                        </span>
                                                                        <span>
                                                                            Xem
                                                                            chi
                                                                            tiết
                                                                        </span>
                                                                    </Dropdown.Item> 
                                                                        <Dropdown.Item
                                                                            onClick={() =>
                                                                                onOpenDetailModal(
                                                                                    item.Id,
                                                                                    'than'
                                                                                )
                                                                            }
                                                                        >
                                                                            <span className="boxIcon">
                                                                                <i className="fas fa-info-circle" />
                                                                            </span>
                                                                            <span>
                                                                                Xem
                                                                                chi
                                                                                tiết
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item
                                                                        onClick={() =>
                                                                            onOpenDetailKQModal(
                                                                                item.Id
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-info-circle" />
                                                                        </span>
                                                                        <span>
                                                                            Xem
                                                                            kết
                                                                            quả
                                                                            xét
                                                                            nghiệm
                                                                        </span>
                                                                    </Dropdown.Item>{' '}
                                                                    </>
                                                                ) : (
                                                                     <Dropdown.Item
                                                                    //     href={`/admin/hosogheptangchitiet/${item.Id}`}
                                                                    // >
                                                                    //     <span className="boxIcon">
                                                                    //         <i className="fas fa-info-circle" />
                                                                    //     </span>
                                                                    //     <span>
                                                                    //         Xem chi
                                                                    //         tiết
                                                                    //     </span>
                                                                    // </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            onOpenDetailModal(
                                                                                item.Id,
                                                                                item.TenCoQuan
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-info-circle" />
                                                                        </span>
                                                                        <span>
                                                                            Xem
                                                                            chi
                                                                            tiết
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                )}
                                                                <Dropdown.Item
                                                                    onClick={
                                                                        () => {
                                                                            setitemId(
                                                                                item.Id
                                                                            );
                                                                            setshowTBXetNghiemModal(
                                                                                true
                                                                            );
                                                                        }

                                                                        // OpenThongBaoXNModalSV(
                                                                        //     item.Id
                                                                        // )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-envelope" />
                                                                    </span>
                                                                    <span>
                                                                        Thông
                                                                        báo hẹn
                                                                        xét
                                                                        nghiệm
                                                                    </span>
                                                                </Dropdown.Item>
                                                                {item.Status ===
                                                                DangKyChoGhepConstant.DaTiepNhan ? (
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
                                                                            Tải
                                                                            đơn
                                                                            bản
                                                                            cứng
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                                {item.Status ===
                                                                DangKyChoGhepConstant.HoanThanh ? (
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            onLyDoOut(
                                                                                item.Id
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-edit" />
                                                                        </span>
                                                                        <span>
                                                                            Lý
                                                                            do
                                                                            đưa
                                                                            ra
                                                                            ngoài
                                                                            danh
                                                                            sách
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
                                                                {item.TypePhieuDKGhepTang ===
                                                                'than' ? (
                                                                    <>
                                                                        {/* <Dropdown.Item
                                                                        onClick={() =>
                                                                            onCreateKQXNEntity(
                                                                                item.Id
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-plus" />
                                                                        </span>
                                                                        <span>
                                                                            Thêm
                                                                            kết
                                                                            quả
                                                                            xét
                                                                            nghiệm
                                                                        </span>
                                                                    </Dropdown.Item> 
                                                                        <Dropdown.Item
                                                                            onClick={() =>
                                                                                onInPhieuThan(
                                                                                    item.Id
                                                                                )
                                                                            }
                                                                        >
                                                                            <span className="boxIcon">
                                                                                <i className="fas fa-image" />
                                                                            </span>
                                                                            <span>
                                                                                In
                                                                                phiếu
                                                                                đăng
                                                                                ký
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item
                                                                            onClick={() =>
                                                                                onEditEntity(
                                                                                    item.Id,
                                                                                    'than'
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
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Dropdown.Item
                                                                            onClick={() =>
                                                                                onInPhieuKhac(
                                                                                    item.Id
                                                                                )
                                                                            }
                                                                        >
                                                                            <span className="boxIcon">
                                                                                <i className="fas fa-image" />
                                                                            </span>
                                                                            <span>
                                                                                In
                                                                                phiếu
                                                                                đăng
                                                                                ký
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item
                                                                            onClick={() =>
                                                                                onEditEntity(
                                                                                    item.Id,
                                                                                    item.TenCoQuan
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
                                                                    </>
                                                                )}
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
                                                {DangKyChoGhepConstant.GetName(
                                                    item.Status
                                                )}
                                            </td>
                                            <td>
                                                {CommonUtility.RenderGioiTinh(
                                                    item.GioiTinh
                                                )}
                                            </td>
                                            <td>
                                                {CommonUtility.ShowDateVN(
                                                    item.NgaySinh
                                                )}
                                            </td>
                                            <td>{item.NgheNghiep}</td>
                                            <td>{item.DienThoai}</td>
                                            <td>{item.NhomMau}</td>
                                            <td>{item.TenCoQuan}</td>
                                            <td>
                                            {item.TypePhieuDKGhepTang ===
                                                'than' && (
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-primary btn-sm dropdown-toggle"
                                                        type="button"
                                                        id={`dropdownMenuButton${item.id}`}
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    >
                                                        Danh sách
                                                    </button>
                                                    <div
                                                        className="dropdown-menu dropdown-menu-right wid200px"
                                                        aria-labelledby={`dropdownMenuButton${item.id}`}
                                                    >
                                                        <div>
                                                            <table className="width100">
                                                                {item.ketQuaXetNghieChoGheps &&
                                                                    item.ketQuaXetNghieChoGheps.map(
                                                                        (
                                                                            xn,
                                                                            idxn
                                                                        ) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        {idxn +
                                                                                            1}
                                                                                    </td>
                                                                                    <td>
                                                                                        <a
                                                                                            href="/"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) => {
                                                                                                e.preventDefault();
                                                                                                onOpenDetailKQModal(
                                                                                                    item.Id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {CommonUtility.ShowDateVN(
                                                                                                xn.CreatedDate
                                                                                            )}
                                                                                        </a>
                                                                                    </td>
                                                                                    <td>
                                                                                        {' '}
                                                                                        <a
                                                                                            title="Cập nhật kết quả"
                                                                                            href="/"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) => {
                                                                                                e.preventDefault();
                                                                                                onEditKQEntity(
                                                                                                    xn.Id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <i className="fa fa-edit" />
                                                                                        </a>{' '}
                                                                                        <a
                                                                                            href="/"
                                                                                            title="Xóa bỏ kết quả"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) => {
                                                                                                e.preventDefault();
                                                                                                DeleteKetQuaXetNghiemAction(
                                                                                                    xn.Id
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <i className="fa fa-trash red" />
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
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
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th className="imgHinhAnhColAccount mw-image-avatar">
                                    Ảnh
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Họ tên bệnh nhân
                                </th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Nghề nghiệp</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Nhóm máu</th>
                                <th scope="col">Loại chờ ghép</th>
                            </tr>
                        </thead>
                    </table>
                </div> */}
            </>
        </>
    );
});

export default DangKyChoGhepTangTbl;
