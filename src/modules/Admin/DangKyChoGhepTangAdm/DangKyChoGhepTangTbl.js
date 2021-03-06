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
        onEditHLAEntity,
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
                            Ch??? ti???p nh???n
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
                            Ti???p nh???n
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
                            T??? ch???i
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
                            ????a v??o ds ch??? gh??p
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
                            ???? nh???n ????n h???y ????ng k??
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
                            ????a v??o danh s??ch ch???
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
    let pageSiz = 10;
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
                    S???a
                </Menu.Item>

                <Menu.Item
                    key={`xoa_${record.Id}`}
                    onClick={() => DeleteAction(record.Id)}
                    icon={<antIcon.DeleteOutlined />}
                >
                    X??a
                </Menu.Item>
                <Menu.Item
                    key={`capnhat_${record.Id}`}
                    onClick={() => {
                        onEditHLAEntity(record.Id);
                        // handleEditShow();
                    }}
                    icon={<antIcon.EditOutlined />}
                >
                    C???p nh???t k???t qu??? HLA
                </Menu.Item>

                {record.TypePhieuDKGhepTang === 'than' ? (
                    <>
                        <Menu.Item
                            key={`inPhieu_${record.Id}`}
                            icon={<antIcon.PrinterOutlined />}
                            onClick={() => onInPhieuThan(record.Id)}
                        >
                            In phi???u ????ng k??
                        </Menu.Item>
                    </>
                ) : (
                    <>
                        <Menu.Item
                            key={`inPhieuKhac_${record.Id}`}
                            icon={<antIcon.PrinterOutlined />}
                            onClick={() => onInPhieuKhac(record.Id)}
                        >
                            In phi???u ????ng k??
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
                    Th??ng b??o h???n x??t nghi???m
                </Menu.Item>
                {record.Status === DangKyChoGhepConstant.DaTiepNhan ? (
                    <Menu.Item
                        key={`downbc_${record.Id}`}
                        icon={<antIcon.DownloadOutlined />}
                        onClick={() => onUpDonDK(record.Id)}
                    >
                        T???i ????n b???n c???ng
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
                        L?? do ????a ra ngo??i danh s??ch
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
                    showTotal: (total) => `T???ng c???ng ${total} b???n ghi`,
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
                    title="Thao t??c"
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
                            Chi ti???t
                        </Dropdown.Button>
                    )}
                />
                <Column
                    title="???nh"
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
                    title="H??? t??n b???nh nh??n"
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
                                            <i className="fas fa-envelope" /> ????
                                            g???i Mail
                                        </span>
                                    ) : (
                                        <span>Ch??a g???i mail</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Column
                    title="Tr???ng th??i"
                    key="Status"
                    render={(text, record, index) => (
                        <div>
                            {DangKyChoGhepConstant.GetName(record.Status)}
                        </div>
                    )}
                />
                <Column
                    title="Gi???i t??nh"
                    key="GioiTinh"
                    render={(text, record, index) => (
                        <div>
                            {CommonUtility.RenderGioiTinh(record.GioiTinh)}
                        </div>
                    )}
                />
                <Column
                    title="Ng??y sinh"
                    key="NgaySinh"
                    render={(text, record, index) => (
                        <div>{CommonUtility.ShowDateVN(record.NgaySinh)}</div>
                    )}
                />

                <Column
                    title="Ngh??? nghi???p"
                    dataIndex="NgheNghiep"
                    key="NgheNghiep"
                />
                <Column
                    title="S??? ??i???n tho???i"
                    dataIndex="DienThoai"
                    key="DienThoai"
                />
                <Column title="Nh??m m??u" dataIndex="NhomMau" key="NhomMau" />
            </Table>
        </>
    );
});

export default DangKyChoGhepTangTbl;
