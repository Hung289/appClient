/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';
import * as HienTangCoQuanService from '@app/services/HienTangCoQuanService';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as Constant from '@app/Constant';
import * as antIcon from '@ant-design/icons';
import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';

import {
    Alert,
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    Typography,
    layout,
    Layout,
    Upload,
    Button,
    Drawer,
    Tabs,
    Checkbox,
    Descriptions,
    Table,
    Popover
} from 'antd';

import * as CommonUtility from '@modules/Common/CommonUtility';
import {toast} from 'react-toastify';
import {object} from 'yup';
import HienTangCoQuanUpdateNgayGhepAdm from './HienTangCoQuanUpdateNgayGhepAdm';

const {Column, ColumnGroup} = Table;

const {TabPane} = Tabs;

const {Title} = Typography;
const moment = require('moment');

const TuyenChonAdm = (props) => {
    const {
        entityObj,
        showDetailModal,
        onCloseEntityModal,
        onTuyenChonModal,
        setisload,
        setshowDetailModal
    } = props;
    const [dsTuyenChon, setDsTuyenChon] = useState([]);
    const [dsChonGhep, setDsChonGhep] = useState([]);
    const [errorTuyenChon, seterrorTuyenChon] = useState('');
    useEffect(() => {
        setDsTuyenChon(null);
        setDsChonGhep([]);
        seterrorTuyenChon('');
        return () => {};
    }, []);
    useEffect(() => {
        if (entityObj.duLieuTuyenChon) {
            setDsChonGhep(entityObj.LstIdNguoiGhep);
            if (entityObj.Status === HienTangMoTangStatusConstant.DaXacDinh) {
                setDsTuyenChon(
                    entityObj.duLieuTuyenChon.ketQuaMatchingDtos.filter(
                        (x) =>
                            entityObj.LstIdNguoiGhep.indexOf(x.IdChoGhep) > -1
                    )
                );
            } else {
                setDsTuyenChon(entityObj.duLieuTuyenChon.ketQuaMatchingDtos);
            }
        } else {
            setDsTuyenChon(null);
            seterrorTuyenChon('');
        }

        return () => {};
    }, [entityObj]);

    function ShowHLAMatching({dataHien, dataMatching}) {
        let RsData;
        if (dataHien) {
            if (dataMatching) {
                RsData = dataHien.map((item, idx) => {
                    if (dataMatching.indexOf(item) > -1) {
                        return <b style={{color: 'red'}}>{item}</b>;
                    }
                    return <span>{item}</span>;
                });

                return (
                    <>
                        {RsData.map((x, idx) => {
                            if (idx > 0) {
                                return <>-{x}</>;
                            }
                            return <>{x}</>;
                        })}
                    </>
                );
            }
        }
        return <></>;
    }

    function RenderDsTuyenChon() {
        useEffect(() => {}, []);
        const [
            IsShowUpdateNgayGhepPopup,
            setIsShowUpdateNgayGhepPopup
        ] = useState(false);
        const [ObjThongTinHien, setObjThongTinHien] = useState({});
        function UpdateNgayGhep(idCoquan, idNguoiGhep) {
            // setisload(true);
            HienTangCoQuanService.GetDetailOfThongTinTuyenChonDto(
                idCoquan,
                idNguoiGhep
            ).then((rs) => {
                setObjThongTinHien(rs);
                setIsShowUpdateNgayGhepPopup(true);
                // setisload(false);
            });
        }
        if (dsTuyenChon) {
            return (
                <>
                    {entityObj.Status ===
                        HienTangMoTangStatusConstant.DangChoTuyenChon && (
                        <Button
                            type="primary"
                            shape="round"
                            onClick={() => {
                                setisload(true);
                                HienTangCoQuanService.GetDsMatching(
                                    entityObj.Id
                                ).then((rs) => {
                                    if (rs.Status) {
                                        setDsTuyenChon(rs.Data);
                                        seterrorTuyenChon('');
                                    } else {
                                        toast.error(rs.MessageError);
                                        seterrorTuyenChon(rs.MessageError);
                                    }
                                    setisload(false);
                                });
                            }}
                            icon={<antIcon.SnippetsOutlined />}
                            size="large"
                        >
                            Thực hiện tuyển chọn người ghép
                        </Button>
                    )}
                    <HienTangCoQuanUpdateNgayGhepAdm
                        IsShowUpdateNgayGhepPopup={IsShowUpdateNgayGhepPopup}
                        entityObj={ObjThongTinHien}
                        onCloseUpdateNgayGhepPopup={() => {
                            setIsShowUpdateNgayGhepPopup(false);
                        }}
                        OnLoadingAction={setisload}
                        // onReloadPage={onReloadPage}
                    />
                    <Table dataSource={dsTuyenChon}>
                        <Column
                            title="#"
                            key="STT"
                            render={(text, record, index) => (
                                <div>{index + 1}</div>
                            )}
                        />
                        <Column
                            title="Mã số"
                            key="MaSo"
                            render={(text, record, index) => (
                                <strong>{record.MaSo}</strong>
                            )}
                        />
                        <Column
                            title="Họ tên"
                            key="HoTen"
                            render={(text, record, index) => {
                                if (
                                    dsChonGhep &&
                                    dsChonGhep.indexOf(record.IdChoGhep) > -1
                                ) {
                                    return (
                                        <>
                                            <antIcon.CheckCircleFilled
                                                style={{color: 'green'}}
                                            />{' '}
                                            <strong>{record.HoTen}</strong>
                                        </>
                                    );
                                }
                                return <strong>{record.HoTen}</strong>;
                            }}
                        />
                        <Column
                            title="Nhóm máu"
                            dataIndex="NhomMau"
                            key="NhomMau"
                        />
                        <Column
                            title="Chiều cao"
                            dataIndex="ChieuCao"
                            key="ChieuCao"
                        />
                        <Column
                            title="Cân nặng"
                            dataIndex="CanNang"
                            key="CanNang"
                        />
                        {/* <Column
                            title="Giới tính"
                            key="GioiTinh"
                            render={(text, record, index) => (
                                <div>
                                    {CommonUtility.RenderGioiTinh(record.GioiTinh)}
                                </div>
                            )}
                        /> */}
                        <Column
                            title="Năm sinh"
                            key="NamSinh"
                            dataIndex="NamSinh"
                        />
                        <Column
                            title="Ngày đăng ký"
                            key="NgayDangKy"
                            render={(text, record, index) => (
                                <div>
                                    {CommonUtility.ShowDateTimeVN(
                                        record.NgayDangKy
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="Ngày CTNT"
                            key="NgayChayThan"
                            render={(text, record, index) => (
                                <div>
                                    {CommonUtility.ShowDateVN(
                                        record.NgayChayThan
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="Điểm tuyển chọn"
                            key="DiemTuyenChon"
                            render={(text, record, index) => {
                                const content = (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Tiêu chí</th>
                                                <th>Điểm</th>
                                                <th>Người hiến</th>
                                                <th>Người chờ ghép</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Nhóm máu</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemNhomMau
                                                    )}
                                                </td>
                                                <td>
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NhomMau
                                                    }
                                                </td>
                                                <td>{record.NhomMau}</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Tuổi</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemTuoi
                                                    )}
                                                </td>
                                                <td>
                                                    {CommonUtility.ShowYearVN(
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NgaySinh
                                                    )}
                                                </td>
                                                <td>{record.NamSinh}</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Chiều cao</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemChieuCao
                                                    )}
                                                </td>
                                                <td>
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .ChieuCao
                                                    }
                                                </td>
                                                <td>{record.ChieuCao}</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>Cân nặng</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemCanNang
                                                    )}
                                                </td>
                                                <td>
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .CanNang
                                                    }
                                                </td>
                                                <td>{record.CanNang}</td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>Điểm HLA</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemHLA
                                                    )}
                                                </td>
                                                <td>
                                                    <p>
                                                        HLA-DR:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                entityObj
                                                                    .phieuDangKyHien
                                                                    .LstHLADRB1
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLADR
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        HLA-A:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                entityObj
                                                                    .phieuDangKyHien
                                                                    .LstHLAA
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLAA
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        HLA-B:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                entityObj
                                                                    .phieuDangKyHien
                                                                    .LstHLAB
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLAB
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>
                                                        HLA-DR:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                record.LstHLADRB1
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLADR
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        HLA-A:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                record.LstHLAA
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLAA
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        HLA-B:{' '}
                                                        <ShowHLAMatching
                                                            dataHien={
                                                                record.LstHLAB
                                                            }
                                                            dataMatching={
                                                                record
                                                                    .TuongHopHLAB
                                                                    .LstTuongHop
                                                            }
                                                        />
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>6</td>
                                                <td>Điểm Anti HLA</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemAntiHLA
                                                    )}
                                                </td>
                                                <td colSpan={2}>
                                                    Gen Anti:
                                                    {record.GenAntiHLA}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>7</td>
                                                <td>Điểm đã ghép thận</td>
                                                <td>
                                                    {CommonUtility.LamTronDiem(
                                                        record.DiemDaGhepTang
                                                    )}
                                                </td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                            <tr>
                                                <td>#</td>
                                                <td>
                                                    <strong>Tổng điểm</strong>
                                                </td>
                                                <td colSpan={3}>
                                                    {CommonUtility.LamTronDiem(
                                                        record.TongDiem
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>#</td>
                                                <td>
                                                    <strong>
                                                        Tổng điểm tối đa
                                                    </strong>
                                                </td>
                                                <td colSpan={3}>7</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                );
                                return (
                                    <Popover
                                        content={content}
                                        title="Bảng điểm chi tiết"
                                        placement="topRight"
                                    >
                                        <Button type="primary">
                                            {CommonUtility.LamTronDiem(
                                                record.TongDiem
                                            )}
                                        </Button>
                                    </Popover>
                                );
                            }}
                        />
                        {entityObj.Status ===
                            HienTangMoTangStatusConstant.DangChoTuyenChon && (
                            <Column
                                title="Thao tác"
                                key="NgayChayThan"
                                render={(text, record, index) => {
                                    if (
                                        dsChonGhep &&
                                        dsChonGhep.indexOf(record.IdChoGhep) >
                                            -1
                                    ) {
                                        return (
                                            <Button
                                                type="danger"
                                                shape="round"
                                                onClick={() => {
                                                    HienTangCoQuanService.ChangeTuyenChon(
                                                        {
                                                            Id: entityObj.Id,
                                                            IdNguoiGhep:
                                                                record.IdChoGhep,
                                                            Status: false
                                                        }
                                                    ).then((rs) => {
                                                        if (rs.Status) {
                                                            setDsChonGhep(
                                                                rs.Data
                                                            );
                                                            seterrorTuyenChon(
                                                                ''
                                                            );
                                                        } else {
                                                            toast.error(
                                                                rs.MessageError
                                                            );
                                                            seterrorTuyenChon(
                                                                rs.MessageError
                                                            );
                                                        }
                                                    });
                                                }}
                                                icon={
                                                    <antIcon.DeleteOutlined />
                                                }
                                                size="small"
                                            >
                                                Bỏ tuyển chọn
                                            </Button>
                                        );
                                    }

                                    return (
                                        <Button
                                            type="primary"
                                            shape="round"
                                            onClick={() => {
                                                HienTangCoQuanService.ChangeTuyenChon(
                                                    {
                                                        Id: entityObj.Id,
                                                        IdNguoiGhep:
                                                            record.IdChoGhep,
                                                        Status: true
                                                    }
                                                ).then((rs) => {
                                                    if (rs.Status) {
                                                        setDsChonGhep(rs.Data);
                                                        seterrorTuyenChon('');
                                                    } else {
                                                        toast.error(
                                                            rs.MessageError
                                                        );
                                                        seterrorTuyenChon(
                                                            rs.MessageError
                                                        );
                                                    }
                                                });
                                            }}
                                            icon={<antIcon.CheckOutlined />}
                                            size="small"
                                        >
                                            Tuyển chọn
                                        </Button>
                                    );
                                }}
                            />
                        )}

                        {entityObj.Status ===
                            HienTangMoTangStatusConstant.DaXacDinh && (
                            <Column
                                title="Thao tác"
                                key="thaotac"
                                render={(text, record, index) => {
                                    return (
                                        <Button
                                            type="primary"
                                            shape="round"
                                            onClick={() => {
                                                UpdateNgayGhep(
                                                    entityObj.Id,
                                                    record.IdChoGhep
                                                );
                                            }}
                                            icon={<antIcon.CalendarOutlined />}
                                            size="small"
                                        >
                                            Cập nhật ngày ghép
                                        </Button>
                                    );
                                }}
                            />
                        )}
                    </Table>
                </>
            );
        }
        return (
            <>
                {entityObj.Status ===
                    HienTangMoTangStatusConstant.DangChoTuyenChon && (
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            setisload(true);
                            HienTangCoQuanService.GetDsMatching(
                                entityObj.Id
                            ).then((rs) => {
                                if (rs.Status) {
                                    setDsTuyenChon(rs.Data);
                                    seterrorTuyenChon('');
                                } else {
                                    toast.error(rs.MessageError);
                                    seterrorTuyenChon(rs.MessageError);
                                }
                                setisload(false);
                            });
                        }}
                        icon={<antIcon.SnippetsOutlined />}
                        size="large"
                    >
                        Thực hiện tuyển chọn người ghép
                    </Button>
                )}
            </>
        );
    }
    function RenderDsDaChon() {
        useEffect(() => {}, []);
        const [
            IsShowUpdateNgayGhepPopup,
            setIsShowUpdateNgayGhepPopup
        ] = useState(false);
        const [ObjThongTinHien, setObjThongTinHien] = useState({});
        function UpdateNgayGhep(idCoquan, idNguoiGhep) {
            // setisload(true);
            HienTangCoQuanService.GetDetailOfThongTinTuyenChonDto(
                idCoquan,
                idNguoiGhep
            ).then((rs) => {
                setObjThongTinHien(rs);
                setIsShowUpdateNgayGhepPopup(true);
                // setisload(false);
            });
        }
        if (entityObj.thongTinTuyenChons) {
            return (
                <>
                    <HienTangCoQuanUpdateNgayGhepAdm
                        IsShowUpdateNgayGhepPopup={IsShowUpdateNgayGhepPopup}
                        entityObj={ObjThongTinHien}
                        onCloseUpdateNgayGhepPopup={() => {
                            setIsShowUpdateNgayGhepPopup(false);
                        }}
                        OnLoadingAction={setisload}
                        // onReloadPage={onReloadPage}
                    />
                    <Table dataSource={entityObj.thongTinTuyenChons}>
                        <Column
                            title="#"
                            key="STT"
                            render={(text, record, index) => (
                                <div>{index + 1}</div>
                            )}
                        />
                        <Column
                            title="Mã số"
                            key="MaSo"
                            render={(text, record, index) => (
                                <strong>
                                    {record.PhieuDangKyChoGhepThan.MaSo}
                                </strong>
                            )}
                        />
                        <Column
                            title="Họ tên"
                            key="HoTen"
                            render={(text, record, index) => {
                                return (
                                    <>
                                        <antIcon.CheckCircleFilled
                                            style={{color: 'green'}}
                                        />{' '}
                                        <strong>
                                            {
                                                record.PhieuDangKyChoGhepThan
                                                    .HoTenBN
                                            }
                                        </strong>
                                    </>
                                );
                            }}
                        />
                        <Column
                            title="Nhóm máu"
                            dataIndex="NhomMau"
                            key="NhomMau"
                            render={(text, record, index) => (
                                <div>
                                    {record.PhieuDangKyChoGhepThan.NhomMau}
                                </div>
                            )}
                        />
                        <Column
                            title="Chiều cao"
                            dataIndex="ChieuCao"
                            key="ChieuCao"
                            render={(text, record, index) => (
                                <div>
                                    {record.PhieuDangKyChoGhepThan.ChieuCao}
                                </div>
                            )}
                        />
                        <Column
                            title="Cân nặng"
                            dataIndex="CanNang"
                            key="CanNang"
                            render={(text, record, index) => (
                                <div>
                                    {record.PhieuDangKyChoGhepThan.CanNang}
                                </div>
                            )}
                        />

                        <Column
                            title="Ngày sinh"
                            key="NamSinh"
                            render={(text, record, index) => (
                                <div>
                                    {CommonUtility.ShowDateVN(
                                        record.PhieuDangKyChoGhepThan.NgaySinh
                                    )}
                                </div>
                            )}
                        />
                        <Column
                            title="Ngày đăng ký"
                            key="NgayDangKy"
                            render={(text, record, index) => (
                                <div>
                                    {CommonUtility.ShowDateVN(
                                        record.PhieuDangKyChoGhepThan.NgayDKHien
                                    )}
                                </div>
                            )}
                        />

                        <Column
                            title="Ngày CTNT"
                            key="NgayChayThan"
                            render={(text, record, index) => (
                                <div>
                                    {record.PhieuDangKyChoGhepThan
                                        .NgayCTNTHoacKhamThamPhanBenhLy &&
                                        CommonUtility.ShowDateVN(
                                            record.PhieuDangKyChoGhepThan
                                                .NgayCTNTHoacKhamThamPhanBenhLy
                                        )}
                                </div>
                            )}
                        />
                        <Column
                            title="Ngày ghép"
                            key="NgayChayThan"
                            render={(text, record, index) => (
                                <div>
                                    {record.PhieuDangKyChoGhepThan.NgayGhep &&
                                        CommonUtility.ShowDateVN(
                                            record.PhieuDangKyChoGhepThan
                                                .NgayGhep
                                        )}
                                </div>
                            )}
                        />

                        <Column
                            title="Thao tác"
                            key="thaotac"
                            render={(text, record, index) => {
                                return (
                                    <Button
                                        type="primary"
                                        shape="round"
                                        onClick={() => {
                                            UpdateNgayGhep(
                                                entityObj.Id,
                                                record.IdNguoiGhep
                                            );
                                        }}
                                        icon={<antIcon.CalendarOutlined />}
                                        size="small"
                                    >
                                        Cập nhật ngày ghép
                                    </Button>
                                );
                            }}
                        />
                    </Table>
                </>
            );
        }

        return (
            entityObj.Status ===
                HienTangMoTangStatusConstant.DangChoTuyenChon && (
                <Space>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            HienTangCoQuanService.GetDsMatching(
                                entityObj.Id
                            ).then((rs) => {
                                if (rs.Status) {
                                    setDsTuyenChon(rs.Data);
                                    seterrorTuyenChon('');
                                } else {
                                    toast.error(rs.MessageError);
                                    seterrorTuyenChon(rs.MessageError);
                                }
                            });
                        }}
                        icon={<antIcon.SnippetsOutlined />}
                        size="large"
                    >
                        Thực hiện tuyển chọn người ghép
                    </Button>
                </Space>
            )
        );
    }
    function TuyenChonModal() {
        return (
            <>
                <Drawer
                    title="Tuyển chọn người phù hợp ghép mô tạng"
                    placement="right"
                    size="large"
                    onClose={() => setshowDetailModal(false)}
                    visible={showDetailModal}
                    extra={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Space>
                            <Button
                                onClick={() => {
                                    setshowDetailModal(false);
                                }}
                            >
                                Đóng
                            </Button>
                        </Space>
                    }
                >
                    {entityObj && entityObj.phieuDangKyHien && (
                        <>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Descriptions
                                        title="Thông tin hiến tặng cơ quan"
                                        column={1}
                                        size="middle"
                                    >
                                        <Descriptions.Item label="Trạng thái">
                                            {HienTangMoTangStatusConstant.GetName(
                                                entityObj.Status
                                            )}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Cơ quan hiến">
                                            {entityObj.TenCoQuan}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày hiến">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayHienTang
                                            )}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ghi chú">
                                            {entityObj.GhiChu}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col span={18}>
                                    <Descriptions
                                        title="Thông tin người hiến"
                                        column={2}
                                        size="middle"
                                    >
                                        <Descriptions.Item label="Ảnh">
                                            {entityObj.phieuDangKyHien
                                                .Avatar !== '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.phieuDangKyHien.Avatar}`}
                                                        alt=""
                                                        onError={
                                                            NotFoundUserImage
                                                        }
                                                        className="imgHinhAnhAccount img-thumbnail"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Họ và tên">
                                            {entityObj.phieuDangKyHien.HoTen}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mã số ">
                                            {entityObj.phieuDangKyHien.MaSo}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nhóm máu">
                                            {entityObj.phieuDangKyHien.NhomMau}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Chiều cao">
                                            {entityObj.phieuDangKyHien.ChieuCao}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Cân nặng">
                                            {entityObj.phieuDangKyHien.ChieuCao}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Giới tính">
                                            {
                                                entityObj.phieuDangKyHien
                                                    .GioiTinhTxt
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày sinh">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.phieuDangKyHien
                                                    .NgaySinh
                                            )}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Ngày đăng ký">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.phieuDangKyHien.NgayDK
                                            )}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Điện thoại">
                                            {
                                                entityObj.phieuDangKyHien
                                                    .SoDienThoai
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {entityObj.phieuDangKyHien.Email}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ thường trú">
                                            {entityObj.phieuDangKyHien.DiaChi}
                                            {entityObj.phieuDangKyHien.TenXa
                                                ? `,${entityObj.phieuDangKyHien.TenXa}`
                                                : ''}

                                            {entityObj.phieuDangKyHien.TenHuyen
                                                ? `, ${entityObj.phieuDangKyHien}`
                                                      .TenHuyen
                                                : ''}

                                            {entityObj.phieuDangKyHien.TenTinh
                                                ? `, ${entityObj.phieuDangKyHien}`
                                                      .TenTinh
                                                : ''}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="CMND/CCCD/Hộ chiếu">
                                            {entityObj.phieuDangKyHien.SoCMND}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nghề nghiệp">
                                            {
                                                entityObj.phieuDangKyHien
                                                    .NgheNghiep
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nghề nghiệp bổ sung">
                                            {
                                                entityObj.phieuDangKyHien
                                                    .NgheNhiepBoSung
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            span={2}
                                            label="Nơi công tác(nếu có)"
                                        >
                                            {
                                                entityObj.phieuDangKyHien
                                                    .NoiCongTac
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Title level={5}>
                                        Danh sách tuyển chọn
                                    </Title>
                                    {errorTuyenChon && (
                                        <Alert
                                            message="Cảnh báo"
                                            description={errorTuyenChon}
                                            type="error"
                                        />
                                    )}
                                    {entityObj.Status ===
                                        HienTangMoTangStatusConstant.DangChoTuyenChon && (
                                        <RenderDsTuyenChon />
                                    )}
                                    {/* <RenderDsTuyenChon /> */}
                                    {entityObj.Status ===
                                        HienTangMoTangStatusConstant.DaXacDinh && (
                                        <RenderDsDaChon />
                                    )}
                                </Col>
                            </Row>
                        </>
                    )}
                </Drawer>
            </>
        );
    }
    return (
        <>
            <TuyenChonModal />
        </>
    );
};

export default TuyenChonAdm;
