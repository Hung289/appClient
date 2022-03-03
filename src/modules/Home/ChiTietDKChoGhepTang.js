/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {
    Row,
    Col,
    Container,
    Breadcrumb,
    Tabs,
    Tab,
    ListGroup,
    Button,
    ListGroupItem
} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from 'react-router-dom';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '@modules/Common/CommonUtility';

const ChiTietDKChoGhepTang = () => {
    const {id} = useParams();
    const [entityObj, setEntityObj] = useState({});

    useEffect(() => {
        dangKyChoGhepTangService.GetDetailDto(id).then((dta) => {
            setEntityObj(dta);
        });
    }, []);

    const RenderDataMain = () => {
        const [FileDK, setFileDK] = useState([]);
        const [FileDKKhac, setFileDKKhac] = useState([]);

        useEffect(() => {
            if (entityObj.TypePhieuDKGhepTang === 'than') {
                dangKyChoGhepTangService.LoadFileThanDKPDF(id).then((rs) => {
                    if (rs.Status) {
                        setFileDK(rs.Data);
                    }
                });
            } else {
                dangKyChoGhepTangService.LoadFileKhacDKPDF(id).then((rs) => {
                    if (rs.Status) {
                        setFileDKKhac(rs.Data);
                    }
                });
            }
        }, []);
        function DetailHoSo() {
            const [keytab, setKeyTab] = useState('hanhchanh');
            return (
                <>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={keytab}
                        onSelect={(k) => setKeyTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="hanhchanh" title="I. Hành Chánh">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row ">
                                        <dt className="col-sm-12">
                                            I. Hành chánh
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Ảnh</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.Avatar !== '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.Avatar}`}
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
                                        </dd>

                                        <dt className="col-sm-2">Trạng thái</dt>
                                        <dd className="col-sm-4">
                                            {DangKyChoGhepConstant.GetName(
                                                entityObj.Status
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ảnh CMND mặt trước
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ImgCMNDBNMatTruoc !==
                                            '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
                                                        alt=""
                                                        onError={
                                                            NotFoundCMNDImage
                                                        }
                                                        className="imgCMND"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ảnh CMND mặt sau
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ImgCMNDBNMatSau !==
                                            '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
                                                        alt=""
                                                        onError={
                                                            NotFoundCMNDImage
                                                        }
                                                        className="imgCMND"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">Họ và tên</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTenBN}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Mã số bệnh nhân
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.MaSo}
                                        </dd>
                                        <dt className="col-sm-1">Giới tính</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.GioiTinh === 1
                                                ? 'Nam'
                                                : 'Nữ'}
                                        </dd>
                                        <dt className="col-sm-1">Ngày sinh</dt>
                                        <dd className="col-sm-1">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgaySinh
                                            )}
                                        </dd>
                                        <dt className="col-sm-1">Nhóm máu</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.NhomMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            Bảo hiểm y tế
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.BaoHiemYTe}
                                        </dd>
                                        <dt className="col-sm-1">Điện thoại</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoai}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Điện thoại Khác
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoai1}
                                        </dd>
                                        <dt className="col-sm-1">Email</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.Email}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Trình độ văn hóa
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TrinhDoVanHoa}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nghề nghiệp
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNghiep}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nghề nghiệp bổ sung
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNhiepBoSung}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            Địa chỉ thường trú
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiThuongChu}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Xã/ Phường:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXa}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Quận/ Huyện:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Tỉnh/T.Phố:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinh}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            Địa chỉ tạm trú
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiTamChu}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Xã/ Phường:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXatt}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Quận/ Huyện:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyentt}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Tỉnh/T.Phố:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinhtt}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Con thứ mấy trong gia đình
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.LaConThuMay}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Tình trạng hôn nhân
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TinhTrangHonNhan === 1
                                                ? 'Đã có gia đình'
                                                : 'Độc thân'}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Họ tên Vợ/Chồng
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTenVoChong}
                                        </dd>
                                        <dt className="col-sm-1">Điện thoại</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoaiVoChong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">Số con</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.CoMayCon} con (
                                            {entityObj.SoConTrai} trai,
                                            {entityObj.SoConGai} gái)
                                        </dd>

                                        <dt className="col-sm-2">
                                            Lớn nhất sinh năm
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.LonNhatSinhNam}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nhỏ nhất sinh năm
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.NhoNhatSinhNam}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab
                            eventKey="tinhtrangbenhly"
                            title="II. Tình trạng bệnh lý"
                        >
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row ">
                                        <dt className="col-sm-12">
                                            II. TÌNH TRẠNG BỆNH LÝ
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            1.Nguyên nhân dẫn đến tình trạng
                                            bệnh hiện tại
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.NguyenNhanSuyThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            2.Sinh thiết thận
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SinhThietThan === 1
                                                ? 'Có'
                                                : 'Không'}
                                        </dd>
                                        <dt className="col-sm-2">Kết quả</dt>
                                        <dd className="col-sm-3">
                                            {entityObj.KetQuaSinhThietThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            3.Phát hiện suy{' '}
                                            {entityObj.TenCoQuan}
                                        </dt>
                                        <dd className="col-sm-1">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayPhatHienSuyThan
                                            )}
                                        </dd>
                                        <dt className="col-sm-4">
                                            Chạy thận nhân tạo/Thẩm phân phúc
                                            mạc từ
                                        </dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Số lần chạy thận một tuần
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoLanCTNTTuan}
                                        </dd>
                                        <dt className="col-sm-2">Vào ngày</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.CTNTVaoNgay === 1
                                                ? 'Chẵn'
                                                : 'Lẻ'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Số giờ một lần
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoGioTrenLan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Chu kỳ thẩm phân phúc mạc (số
                                            lần/ngày)
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ChuKyThamPhan}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thẩm phân phúc mạc bằng máy
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ThamPhanBangMay === 1
                                                ? 'Có'
                                                : 'Không'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tại bệnh viện
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ThamPhanBangMayTaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Truyền máu</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.TruyenMau === 1
                                                ? 'Có'
                                                : 'Không'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Bao nhiêu đơn vị
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.BaoNhieuDonViMau}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Truyền máu lần cuối vào tháng
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.Thang}
                                        </dd>
                                        <dt className="col-sm-2">Năm</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.Nam}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Truyền máu tại bệnh viện
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.BenhVienTruyenMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Đã ghép thận lần 1 vào ngày
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.DaGhepLan1Ngay
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tại bệnh viện
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DaGhepLan1TaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-4">
                                            Người cho thận (cha/mẹ/anh/chị/em?)
                                        </dt>
                                        <dd className="col-sm-8">
                                            {entityObj.NguoiChoThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ngày chạy thận nhân tạo trở lại
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayChayThanTroLai
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Chẩn đoán suy chức năng thận ghép
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ChuanDoanSuyThanGhep}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ngày chạy thận nhân tạo/Thẩm phân
                                            phúc mạc
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.CTNTHoacKhamThamPhan
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tại bệnh viện
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ChayThanTroLaiTaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Số lượng nước tiểu/24 giờ
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.NuocTieu24h === 1
                                                ? 'Có'
                                                : ' Không có nước tiểu'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Lượng nước tiểu/24 giờ
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoLuongNuocTieu24h}{' '}
                                            ml/24h
                                        </dd>
                                        <dt className="col-sm-2">Chiều cao</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ChieuCao} cm
                                        </dd>
                                        <dt className="col-sm-2">Cân nặng</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.CanNang} kg
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thuốc đang sử dụng/ngày
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.ThuocDangSuDungNgay}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thuốc tạo máu
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.ThuocTaoMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Bác sĩ điều trị
                                        </dt>
                                        <dd className="col-sm-6">
                                            {entityObj.BacSiDieuTri}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Điện thoại bác sĩ
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoaiBacSi}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            4. Bệnh lý kèm theo
                                        </dt>
                                        <dd className="col-sm-10">
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
                                                {entityObj.TruocHoacSauLocMau !==
                                                null ? (
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
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Điều trị viêm gan từ
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DieuTriViemGanTu}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thuốc điều trị
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ThuocTriViemGan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Bị lao</dt>
                                        {entityObj.TruocHoacSauLocMau !==
                                        null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Lao phổi'
                                                    : 'Không có tiền căn lao'}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Bị lao cơ quan khác
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.LaoCoQuanKhac}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Bị lao từ</dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiLao
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thời gian điều trị/Nơi điều trị
                                        </dt>
                                        <dd className="col-sm-4">
                                            {
                                                entityObj.ThoiGianDieuTriAndNoiDieuTri
                                            }
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Bị đái tháo đường
                                        </dt>
                                        {entityObj.DaiThaoDuong !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.DaiThaoDuong === 1
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-1">Từ</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiDaiThaoDuong
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thuốc điều trị
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.ThuocDieuTriDaiThaoDuong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Bị tăng huyết áp
                                        </dt>
                                        {entityObj.TangHuyetAp !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.TangHuyetAp === 1
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-1">Từ</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiTangHuyetAp
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thuốc điều trị
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.ThuocDieuTri}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Bệnh khác</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.BenhKhac}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tình hình hiện tại
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TinhTrang}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            5. Tiền căn ngoại khoa
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Có phẫu thuật trước đó không
                                        </dt>
                                        {entityObj.DaPhauThuat !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.DaPhauThuat === 1
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Phẫu thuật ngày
                                        </dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayThangPhauThuat
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Phẫu thuật tại
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.BenhVienPhauThuat}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Phẫu thuật do bệnh
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.CoPhauThuat}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tình trạng hiện tại
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TinhTrangHienTai}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            6.Thói quen nghiện rượu
                                        </dt>
                                        {entityObj.UongRuouBia !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.UongRuouBia === 1
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Số lần/tuần
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoLanTuan}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Số lượng trên lần
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.SoLuongLan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            7.Thói quen hút thuốc
                                        </dt>
                                        {entityObj.HutThuoc !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.HutThuoc === 1
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}

                                        <dt className="col-sm-2">
                                            Số điếu trên ngày
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DieuTrenNgay}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            8. Tiền căn gia đình
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dd className="col-sm-12">
                                            <table className="tablebophanhien">
                                                <tr>
                                                    <td>
                                                        Bệnh thận:{' '}
                                                        {entityObj.BiBenhThan ===
                                                        1
                                                            ? 'Có'
                                                            : 'Không '}
                                                    </td>
                                                    <td>
                                                        Bệnh lao:{' '}
                                                        {entityObj.BiBenhLao ===
                                                        1
                                                            ? 'Có'
                                                            : 'Không '}
                                                    </td>
                                                    <td>
                                                        Bệnh đái tháo đường:{' '}
                                                        {entityObj.BiDaiThaoDuong ===
                                                        1
                                                            ? 'Có'
                                                            : 'Không '}
                                                    </td>

                                                    <td>
                                                        Bệnh tăng huyết áp:{' '}
                                                        {entityObj.BiTangHuyetAp ===
                                                        1
                                                            ? 'Có'
                                                            : 'Không '}
                                                    </td>
                                                    <td>
                                                        Bệnh ung thư:{' '}
                                                        {entityObj.BiUngThu ===
                                                        1
                                                            ? 'Có'
                                                            : 'Không '}
                                                    </td>
                                                </tr>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Bệnh khác</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.BiBenhKhac}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Sống cùng địa chỉ
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.SongCungDiaChi === 1
                                                ? 'Có'
                                                : 'Không '}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Người thân bị bênh
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.NguoiThanBiBenh}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Tình trạng hiện tại
                                        </dt>
                                        <dd className="col-sm-4">
                                            {
                                                entityObj.TinhTrangBenhNguoiThanHienTai
                                            }
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            9. Tiền sử covid
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Nhiễm covid
                                        </dt>
                                        {entityObj.NhiemCovid !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.NhiemCovid === true
                                                    ? 'Không'
                                                    : 'Có '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Bị trước khi tiêm
                                        </dt>
                                        {entityObj.BiTruocTiem !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.BiTruocTiem === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Bị sau khi tiêm
                                        </dt>
                                        {entityObj.BiSauTiem !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.BiSauTiem === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Triệu chứng covid
                                        </dt>
                                        {entityObj.CoTrieuChung !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.CoTrieuChung === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Triệu chứng nhẹ
                                        </dt>
                                        {entityObj.TrieuChungNhe !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TrieuChungNhe ===
                                                true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Triệu chứng trung bình
                                        </dt>
                                        {entityObj.TrieuChungtrungBinh !==
                                        null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TrieuChungtrungBinh ===
                                                true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Triệu chúng nặng phải nhập viện
                                        </dt>
                                        {entityObj.NhapVien !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.NhapVien === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Thời gian nằm viện(ngày)
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ThoiGianNamVien}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Thở máy</dt>
                                        {entityObj.ThoMay !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.ThoMay === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">Thở HFNC</dt>
                                        {entityObj.ThoHFNC !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.ThoHFNC === true
                                                    ? 'Có'
                                                    : 'Không '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            10. Tiêm vaccine ngừa covid
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tiêm vaccine ngừa covid mũi 1
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngày tiêm mũi 1
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayTiemMui1
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Phản ứng sau tiêm mũi 1
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tiêm vaccine ngừa covid mũi 2
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine2}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngày tiêm mũi 2
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayTiemMui2
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Phản ứng sau tiêm mũi 2
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng2}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tiêm vaccine ngừa covid mũi 3
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine3}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngày tiêm mũi 3
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayTiemMui3
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Phản ứng sau tiêm mũi 3
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng3}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="kinhte" title="III. Kinh tế">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            III. Kinh tế
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nhập của bệnh nhân
                                        </dt>
                                        <dd className="col-sm-10">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapBenhNhan
                                            )}{' '}
                                            VND/Tháng
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nhập của Vợ/Chồng
                                        </dt>
                                        <dd className="col-sm-4">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapVoChongBenhNhan
                                            )}{' '}
                                            VND/Tháng
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nghề nghiệp
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.NgheNghiepVoChong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nhập khác
                                        </dt>
                                        <dd className="col-sm-10">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapKhac
                                            )}{' '}
                                            VND/Tháng
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tiền chuẩn bị cho việc ghép thận (có
                                            sẵn)
                                        </dt>
                                        <dd className="col-sm-10">
                                            {ChuyenGiaTien(
                                                entityObj.TienChuanBiChoViecGhepThan
                                            )}{' '}
                                            VND
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="lydo" title="IV. Lý do đăng ký chờ ghép">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            IV. Lý do đăng ký chờ ghép thận từ
                                            người hiến chết não
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dd className="col-sm-10">
                                            <table className="tablebophanhien">
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.KhongCoNguoiNhan
                                                            }
                                                        />
                                                        Không có người hiến thận
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
                                                        Người hiến không hòa hợp
                                                        nhóm máu
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Lý do khác : </td>
                                                    <td>
                                                        {entityObj.LyDoKhac}
                                                    </td>
                                                </tr>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab
                            eventKey="quanhegiadinh"
                            title="V. Quan hệ gia đình"
                        >
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            V. Quan hệ gia đình
                                        </dt>
                                        <dd className="col-sm-12">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Quan hệ</th>
                                                        <th>Họ tên</th>
                                                        <th>Năm sinh</th>
                                                        <th>Nhóm máu</th>
                                                        <th>Số điện thoại</th>
                                                        <th>
                                                            Lý do không hiến
                                                            được
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entityObj.QhGd != null &&
                                                        entityObj.QhGd.map(
                                                            (item, key) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {key +
                                                                                1}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.QuanHeNguoiThan
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.HoTenNguoiThan
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.NamSinhNguoiThan
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.NhomMauNguoiThan
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.DienThoaiNguoiThan
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.LyDoKhongHien
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                </tbody>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="lichsuxuly" title="Lịch sử xử lý">
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
                                        entityObj.historyContentDtos.map(
                                            (itm) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {CommonUtility.ShowDateTimeVN(
                                                                itm.CreatedDate
                                                            )}
                                                        </td>
                                                        <td>{itm.CreatedBy}</td>
                                                        <td>{itm.Title}</td>
                                                        <td>{itm.Content}</td>
                                                        <td>{itm.Comment}</td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Tab>
                        <Tab
                            eventKey="thongbaoxetnghiem"
                            title="TB khám và làm xét nghiệm"
                        >
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
                                                        {itm.IsSent
                                                            ? 'Đã gửi'
                                                            : ''}
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
                                            <td colSpan={5}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Tab>
                        <Tab eventKey="FileDangKy" title="Xem đăng ký PDF">
                            <div>
                                {entityObj.TypePhieuDKGhepTang === 'than' ? (
                                    <>
                                        <div
                                            style={{
                                                padding: '10px',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <embed
                                                src={FileDK.PathPDF}
                                                width="100%"
                                                height="600px"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                padding: '10px',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <embed
                                                src={FileDKKhac.PathPDF}
                                                width="100%"
                                                height="600px"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </>
            );
        }
        return (
            <div className="row">
                <div className="col-sm-12">
                    <DetailHoSo />
                </div>
            </div>
        );
    };
    const downloadFile = (file) => {
        const element = document.createElement('a');
        element.setAttribute('href', file);
        element.setAttribute('download', '');

        element.style.display = 'none';

        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    };
    const onInPhieu = async () => {
        if (entityObj.TypePhieuDKGhepTang === 'than') {
            const dataInPhieu = await dangKyChoGhepTangService.InPhieuDKThan(
                id
            );
            if (dataInPhieu.Status) {
                const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
                downloadFile(pathDownload);
            }
        } else {
            const dataInPhieu = await dangKyChoGhepTangService.InPhieuDKTangKhac(
                id
            );
            if (dataInPhieu.Status) {
                const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
                downloadFile(pathDownload);
            }
        }
    };
    return (
        <Container>
            <div className="row">
                <div className="col-sm-8">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Thông tin chi tiết đăng ký chờ ghép mô tạng
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm-4 boxMenuClient">
                    <Button
                        className="btn btn-success"
                        onClick={() => onInPhieu()}
                    >
                        <span className="boxIcon">
                            <i className="fas fa-download" />
                        </span>
                        <span>In phiếu đăng ký</span>
                    </Button>
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Quản lý hồ sơ
                    </Link>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default ChiTietDKChoGhepTang;
