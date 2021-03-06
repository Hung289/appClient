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
                        <Tab eventKey="hanhchanh" title="I. H??nh Ch??nh">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row ">
                                        <dt className="col-sm-12">
                                            I. H??nh ch??nh
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">???nh</dt>
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

                                        <dt className="col-sm-2">Tr???ng th??i</dt>
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
                                            ???nh CMND m???t tr?????c
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
                                            ???nh CMND m???t sau
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
                                        <dt className="col-sm-1">H??? v?? t??n</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTenBN}
                                        </dd>
                                        <dt className="col-sm-2">
                                            M?? s??? b???nh nh??n
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.MaSo}
                                        </dd>
                                        <dt className="col-sm-1">Gi???i t??nh</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.GioiTinh === 1
                                                ? 'Nam'
                                                : 'N???'}
                                        </dd>
                                        <dt className="col-sm-1">Ng??y sinh</dt>
                                        <dd className="col-sm-1">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgaySinh
                                            )}
                                        </dd>
                                        <dt className="col-sm-1">Nh??m m??u</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.NhomMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            B???o hi???m y t???
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.BaoHiemYTe}
                                        </dd>
                                        <dt className="col-sm-1">??i???n tho???i</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoai}
                                        </dd>
                                        <dt className="col-sm-1">
                                            ??i???n tho???i Kh??c
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
                                            Tr??nh ????? v??n h??a
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TrinhDoVanHoa}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngh??? nghi???p
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNghiep}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngh??? nghi???p b??? sung
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNhiepBoSung}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            ?????a ch??? th?????ng tr??
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiThuongChu}
                                        </dd>
                                        <dt className="col-sm-1">
                                            X??/ Ph?????ng:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXa}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Qu???n/ Huy???n:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            T???nh/T.Ph???:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinh}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            ?????a ch??? t???m tr??
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiTamChu}
                                        </dd>
                                        <dt className="col-sm-1">
                                            X??/ Ph?????ng:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXatt}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Qu???n/ Huy???n:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyentt}
                                        </dd>
                                        <dt className="col-sm-1">
                                            T???nh/T.Ph???:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinhtt}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Con th??? m???y trong gia ????nh
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.LaConThuMay}
                                        </dd>
                                        <dt className="col-sm-1">
                                            T??nh tr???ng h??n nh??n
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TinhTrangHonNhan === 1
                                                ? '???? c?? gia ????nh'
                                                : '?????c th??n'}
                                        </dd>
                                        <dt className="col-sm-1">
                                            H??? t??n V???/Ch???ng
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTenVoChong}
                                        </dd>
                                        <dt className="col-sm-1">??i???n tho???i</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoaiVoChong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">S??? con</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.CoMayCon} con (
                                            {entityObj.SoConTrai} trai,
                                            {entityObj.SoConGai} g??i)
                                        </dd>

                                        <dt className="col-sm-2">
                                            L???n nh???t sinh n??m
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.LonNhatSinhNam}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nh??? nh???t sinh n??m
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
                            title="II. T??nh tr???ng b???nh l??"
                        >
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row ">
                                        <dt className="col-sm-12">
                                            II. T??NH TR???NG B???NH L??
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            1.Nguy??n nh??n d???n ?????n t??nh tr???ng
                                            b???nh hi???n t???i
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.NguyenNhanSuyThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            2.Sinh thi???t th???n
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SinhThietThan === 1
                                                ? 'C??'
                                                : 'Kh??ng'}
                                        </dd>
                                        <dt className="col-sm-2">K???t qu???</dt>
                                        <dd className="col-sm-3">
                                            {entityObj.KetQuaSinhThietThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            3.Ph??t hi???n suy{' '}
                                            {entityObj.TenCoQuan}
                                        </dt>
                                        <dd className="col-sm-1">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayPhatHienSuyThan
                                            )}
                                        </dd>
                                        <dt className="col-sm-4">
                                            Ch???y th???n nh??n t???o/Th???m ph??n ph??c
                                            m???c t???
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
                                            S??? l???n ch???y th???n m???t tu???n
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoLanCTNTTuan}
                                        </dd>
                                        <dt className="col-sm-2">V??o ng??y</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.CTNTVaoNgay === 1
                                                ? 'Ch???n'
                                                : 'L???'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            S??? gi??? m???t l???n
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoGioTrenLan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Chu k??? th???m ph??n ph??c m???c (s???
                                            l???n/ng??y)
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ChuKyThamPhan}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Th???m ph??n ph??c m???c b???ng m??y
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ThamPhanBangMay === 1
                                                ? 'C??'
                                                : 'Kh??ng'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T???i b???nh vi???n
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ThamPhanBangMayTaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Truy???n m??u</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.TruyenMau === 1
                                                ? 'C??'
                                                : 'Kh??ng'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Bao nhi??u ????n v???
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.BaoNhieuDonViMau}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Truy???n m??u l???n cu???i v??o th??ng
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.Thang}
                                        </dd>
                                        <dt className="col-sm-2">N??m</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.Nam}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Truy???n m??u t???i b???nh vi???n
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.BenhVienTruyenMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            ???? gh??p th???n l???n 1 v??o ng??y
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.DaGhepLan1Ngay
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T???i b???nh vi???n
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DaGhepLan1TaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-4">
                                            Ng?????i cho th???n (cha/m???/anh/ch???/em?)
                                        </dt>
                                        <dd className="col-sm-8">
                                            {entityObj.NguoiChoThan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ng??y ch???y th???n nh??n t???o tr??? l???i
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayChayThanTroLai
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ch???n ??o??n suy ch???c n??ng th???n gh??p
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ChuanDoanSuyThanGhep}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ng??y ch???y th???n nh??n t???o/Th???m ph??n
                                            ph??c m???c
                                        </dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.CTNTHoacKhamThamPhan
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T???i b???nh vi???n
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ChayThanTroLaiTaiBV}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            S??? l?????ng n?????c ti???u/24 gi???
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.NuocTieu24h === 1
                                                ? 'C??'
                                                : ' Kh??ng c?? n?????c ti???u'}
                                        </dd>
                                        <dt className="col-sm-2">
                                            L?????ng n?????c ti???u/24 gi???
                                        </dt>
                                        <dd className="col-sm-1">
                                            {entityObj.SoLuongNuocTieu24h}{' '}
                                            ml/24h
                                        </dd>
                                        <dt className="col-sm-2">Chi???u cao</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.ChieuCao} cm
                                        </dd>
                                        <dt className="col-sm-2">C??n n???ng</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.CanNang} kg
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu???c ??ang s??? d???ng/ng??y
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.ThuocDangSuDungNgay}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu???c t???o m??u
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.ThuocTaoMau}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            B??c s?? ??i???u tr???
                                        </dt>
                                        <dd className="col-sm-6">
                                            {entityObj.BacSiDieuTri}
                                        </dd>
                                        <dt className="col-sm-2">
                                            ??i???n tho???i b??c s??
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DienThoaiBacSi}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            4. B???nh l?? k??m theo
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
                                                        Kh??ng b??? vi??m gan
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.ViemGanSieuViA
                                                            }
                                                        />
                                                        Vi??m gan si??u vi A
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.ViemGanSieuViB
                                                            }
                                                        />
                                                        Vi??m gan si??u vi B
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.ViemGanSieuViC
                                                            }
                                                        />
                                                        Vi??m gan si??u vi C
                                                    </td>
                                                </tr>
                                                {entityObj.TruocHoacSauLocMau !==
                                                null ? (
                                                    <tr>
                                                        <td>
                                                            {entityObj.TruocHoacSauLocMau ===
                                                            1
                                                                ? 'Vi??m gan tr?????c l???c m??u'
                                                                : ''}
                                                            {entityObj.TruocHoacSauLocMau ===
                                                            2
                                                                ? 'Vi??m gan sau l???c m??u'
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
                                            ??i???u tr??? vi??m gan t???
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DieuTriViemGanTu}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thu???c ??i???u tr???
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ThuocTriViemGan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">B??? lao</dt>
                                        {entityObj.TruocHoacSauLocMau !==
                                        null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TruocHoacSauLocMau ===
                                                1
                                                    ? 'Lao ph???i'
                                                    : 'Kh??ng c?? ti???n c??n lao'}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            B??? lao c?? quan kh??c
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.LaoCoQuanKhac}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">B??? lao t???</dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiLao
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Th???i gian ??i???u tr???/N??i ??i???u tr???
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
                                            B??? ????i th??o ???????ng
                                        </dt>
                                        {entityObj.DaiThaoDuong !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.DaiThaoDuong === 1
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-1">T???</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiDaiThaoDuong
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thu???c ??i???u tr???
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.ThuocDieuTriDaiThaoDuong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            B??? t??ng huy???t ??p
                                        </dt>
                                        {entityObj.TangHuyetAp !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.TangHuyetAp === 1
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-1">T???</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.ThoiGianBiTangHuyetAp
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Thu???c ??i???u tr???
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.ThuocDieuTri}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">B???nh kh??c</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.BenhKhac}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T??nh h??nh hi???n t???i
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TinhTrang}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            5. Ti???n c??n ngo???i khoa
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            C?? ph???u thu???t tr?????c ???? kh??ng
                                        </dt>
                                        {entityObj.DaPhauThuat !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.DaPhauThuat === 1
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Ph???u thu???t ng??y
                                        </dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayThangPhauThuat
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ph???u thu???t t???i
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.BenhVienPhauThuat}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ph???u thu???t do b???nh
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.CoPhauThuat}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T??nh tr???ng hi???n t???i
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TinhTrangHienTai}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            6.Th??i quen nghi???n r?????u
                                        </dt>
                                        {entityObj.UongRuouBia !== null ? (
                                            <dd className="col-sm-2">
                                                {entityObj.UongRuouBia === 1
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            S??? l???n/tu???n
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoLanTuan}
                                        </dd>
                                        <dt className="col-sm-2">
                                            S??? l?????ng tr??n l???n
                                        </dt>
                                        <dd className="col-sm-3">
                                            {entityObj.SoLuongLan}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            7.Th??i quen h??t thu???c
                                        </dt>
                                        {entityObj.HutThuoc !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.HutThuoc === 1
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd> </dd>
                                        )}

                                        <dt className="col-sm-2">
                                            S??? ??i???u tr??n ng??y
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DieuTrenNgay}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            8. Ti???n c??n gia ????nh
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dd className="col-sm-12">
                                            <table className="tablebophanhien">
                                                <tr>
                                                    <td>
                                                        B???nh th???n:{' '}
                                                        {entityObj.BiBenhThan ===
                                                        1
                                                            ? 'C??'
                                                            : 'Kh??ng '}
                                                    </td>
                                                    <td>
                                                        B???nh lao:{' '}
                                                        {entityObj.BiBenhLao ===
                                                        1
                                                            ? 'C??'
                                                            : 'Kh??ng '}
                                                    </td>
                                                    <td>
                                                        B???nh ????i th??o ???????ng:{' '}
                                                        {entityObj.BiDaiThaoDuong ===
                                                        1
                                                            ? 'C??'
                                                            : 'Kh??ng '}
                                                    </td>

                                                    <td>
                                                        B???nh t??ng huy???t ??p:{' '}
                                                        {entityObj.BiTangHuyetAp ===
                                                        1
                                                            ? 'C??'
                                                            : 'Kh??ng '}
                                                    </td>
                                                    <td>
                                                        B???nh ung th??:{' '}
                                                        {entityObj.BiUngThu ===
                                                        1
                                                            ? 'C??'
                                                            : 'Kh??ng '}
                                                    </td>
                                                </tr>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">B???nh kh??c</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.BiBenhKhac}
                                        </dd>
                                        <dt className="col-sm-2">
                                            S???ng c??ng ?????a ch???
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.SongCungDiaChi === 1
                                                ? 'C??'
                                                : 'Kh??ng '}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ng?????i th??n b??? b??nh
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.NguoiThanBiBenh}
                                        </dd>
                                        <dt className="col-sm-2">
                                            T??nh tr???ng hi???n t???i
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
                                            9. Ti???n s??? covid
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Nhi???m covid
                                        </dt>
                                        {entityObj.NhiemCovid !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.NhiemCovid === true
                                                    ? 'Kh??ng'
                                                    : 'C?? '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            B??? tr?????c khi ti??m
                                        </dt>
                                        {entityObj.BiTruocTiem !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.BiTruocTiem === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            B??? sau khi ti??m
                                        </dt>
                                        {entityObj.BiSauTiem !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.BiSauTiem === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Tri???u ch???ng covid
                                        </dt>
                                        {entityObj.CoTrieuChung !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.CoTrieuChung === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tri???u ch???ng nh???
                                        </dt>
                                        {entityObj.TrieuChungNhe !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TrieuChungNhe ===
                                                true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Tri???u ch???ng trung b??nh
                                        </dt>
                                        {entityObj.TrieuChungtrungBinh !==
                                        null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.TrieuChungtrungBinh ===
                                                true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tri???u ch??ng n???ng ph???i nh???p vi???n
                                        </dt>
                                        {entityObj.NhapVien !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.NhapVien === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">
                                            Th???i gian n???m vi???n(ng??y)
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ThoiGianNamVien}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Th??? m??y</dt>
                                        {entityObj.ThoMay !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.ThoMay === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                        <dt className="col-sm-2">Th??? HFNC</dt>
                                        {entityObj.ThoHFNC !== null ? (
                                            <dd className="col-sm-4">
                                                {entityObj.ThoHFNC === true
                                                    ? 'C??'
                                                    : 'Kh??ng '}
                                            </dd>
                                        ) : (
                                            <dd className="col-sm-4"> </dd>
                                        )}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            10. Ti??m vaccine ng???a covid
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ti??m vaccine ng???a covid m??i 1
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ng??y ti??m m??i 1
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
                                            Ph???n ???ng sau ti??m m??i 1
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ti??m vaccine ng???a covid m??i 2
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine2}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ng??y ti??m m??i 2
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
                                            Ph???n ???ng sau ti??m m??i 2
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng2}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ti??m vaccine ng???a covid m??i 3
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.TiemVaccine3}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ng??y ti??m m??i 3
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
                                            Ph???n ???ng sau ti??m m??i 3
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.PhanUng3}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="kinhte" title="III. Kinh t???">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            III. Kinh t???
                                        </dt>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nh???p c???a b???nh nh??n
                                        </dt>
                                        <dd className="col-sm-10">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapBenhNhan
                                            )}{' '}
                                            VND/Th??ng
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nh???p c???a V???/Ch???ng
                                        </dt>
                                        <dd className="col-sm-4">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapVoChongBenhNhan
                                            )}{' '}
                                            VND/Th??ng
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ngh??? nghi???p
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.NgheNghiepVoChong}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Thu nh???p kh??c
                                        </dt>
                                        <dd className="col-sm-10">
                                            {ChuyenGiaTien(
                                                entityObj.ThuNhapKhac
                                            )}{' '}
                                            VND/Th??ng
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ti???n chu???n b??? cho vi???c gh??p th???n (c??
                                            s???n)
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
                        <Tab eventKey="lydo" title="IV. L?? do ????ng k?? ch??? gh??p">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            IV. L?? do ????ng k?? ch??? gh??p th???n t???
                                            ng?????i hi???n ch???t n??o
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
                                                        Kh??ng c?? ng?????i hi???n th???n
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.NguoiChoBiBenh
                                                            }
                                                        />
                                                        Ng?????i hi???n b??? b???nh
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.NguoiChoKhongHoaHopMau
                                                            }
                                                        />
                                                        Ng?????i hi???n kh??ng h??a h???p
                                                        nh??m m??u
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>L?? do kh??c : </td>
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
                            title="V. Quan h??? gia ????nh"
                        >
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-12">
                                            V. Quan h??? gia ????nh
                                        </dt>
                                        <dd className="col-sm-12">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Quan h???</th>
                                                        <th>H??? t??n</th>
                                                        <th>N??m sinh</th>
                                                        <th>Nh??m m??u</th>
                                                        <th>S??? ??i???n tho???i</th>
                                                        <th>
                                                            L?? do kh??ng hi???n
                                                            ???????c
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
                        <Tab eventKey="lichsuxuly" title="L???ch s??? x??? l??">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Th???i gian</th>
                                        <th>Ng?????i c???p nh???t</th>

                                        <th>Ti??u ?????</th>
                                        <th>N???i dung</th>
                                        <th>Ghi ch??</th>
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
                                                Kh??ng c?? d??? li???u
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Tab>
                        <Tab
                            eventKey="thongbaoxetnghiem"
                            title="TB kh??m v?? l??m x??t nghi???m"
                        >
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Th???i gian</th>
                                        <th>Ng??y h???n</th>
                                        <th>L?? do</th>
                                        <th>Tr???ng th??i</th>
                                        <th>Th???i gian g???i</th>
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
                                                            ? '???? g???i'
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
                                                Kh??ng c?? d??? li???u
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Tab>
                        <Tab eventKey="FileDangKy" title="Xem ????ng k?? PDF">
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
                        <Breadcrumb.Item href="/">Trang ch???</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Th??ng tin chi ti???t ????ng k?? ch??? gh??p m?? t???ng
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
                        <span>In phi???u ????ng k??</span>
                    </Button>
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Qu???n l?? h??? s??
                    </Link>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default ChiTietDKChoGhepTang;
