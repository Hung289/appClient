import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import axios from 'axios';
import {NotFoundImage} from '@modules/Common/NotFound';
import TimePicker from 'react-time-picker';
import $ from 'jquery';

import {
    Modal,
    Button,
    Col,
    Container,
    Breadcrumb,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    Tabs,
    Tab,
    Row
} from 'react-bootstrap';
import {Link, useHistory, useParams} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '@modules/Common/CommonUtility';
import ReactLoading from 'react-loading';

const EditGhepTangHome = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const history = useHistory();
    const {id} = useParams();
    const [isload, setisload] = useState(false);
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const dataGiaDinhEdit = useRef([]);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);
    const [NhomMauRh, setNhomMauRh] = useState([]);
    const [QHGD, setQHGD] = useState([]);
    const [entityObj, setEntityObj] = useState({});
    const [initDataItem, setInitDataItem] = useState(false);
    const InitData = () => {
        if (!initDataItem) {
            dangKyChoGhepTangService
                .GetDetailDto(id)
                .then((dta) => setEntityObj(dta));
            setInitDataItem(true);
        }
    };
    const [typeModal, SettypeModal] = useState('');
    InitData();
    useEffect(() => {
        DuLieuDanhMuc.GetDMbyCodeNhom('nghenghiep').then((rs) => {
            if (rs.Status) {
                setNgheNghiep(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('nhommau').then((rs) => {
            if (rs.Status) {
                setNhomMau(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('nhommaurh').then((rs) => {
            if (rs.Status) {
                setNhomMauRh(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('quanhegiadinh').then((rs) => {
            if (rs.Status) {
                setQHGD(rs.Data);
            }
        });
    }, []);

    const DropDMNgheNghiep = () => {
        return NgheNghiep.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMNhomMau = () => {
        return NhomMau.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMNhomMauRh = () => {
        return NhomMauRh.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMQHGD = () => {
        return QHGD.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const SignupSchema = Yup.object().shape({
        hoTenBN: Yup.string()
            .trim()
            .test(
                'lxxen',
                'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t v?? s???',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t??? kh??ng ph???i kho???ng tr???ng')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        ngheNghiep: Yup.string().trim().required('Vui l??ng nh???p th??ng tin n??y'),
        baoHiemYTe: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'S??? b???o hi???m y t??? ch??? ???????c s??? d???ng ch??? c??i v?? s???',
                (val) => /^[a-zA-Z0-9 ]*$/.test(val)
            ),
        nhomMau: Yup.string(),
        nhomMau1: Yup.string(),
        CMNDBN: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(9, 'CMND ph???i c?? ??t nh???t 9 s???')
            .max(12, 'CMND kh??ng ???????c qu?? 12 s???')
            .test('len', 'CMND ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
        ngaySinh: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y sinh v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        ngayThangPhauThuat: Yup.string()
            .nullable()
            .test('len', 'Ng??y th??ng v?????t qu?? ng??y hi???n t???i', (val) => {
                return (
                    new Date() > new Date(val) ||
                    val === '' ||
                    val === undefined
                );
            })
            .test(
                'len',
                'Ng??y th??ng ph???i sau ng??y 1 th??ng 1 n??m 1920',
                (val) =>
                    new Date('1920-1-1') < new Date(val) ||
                    val === '' ||
                    val === undefined
            ),
        trinhDoVanHoa: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        dienThoai: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test('xxx', 'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        dienThoai1: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'xxx',
                'S??? ??i???n tho???i ch??? s??? d???ng ch??? s???',
                (val) => /^[0-9+.]*$/.test(val) || val === undefined
            ),
        // .test('xxx', 'S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        diaChiThuongChu: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        diaChiTamChu: Yup.string().trim().nullable(),
        NgayCapCMNDBN: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y c???p v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ng??y c???p ph???i sau ng??y 1 th??ng 1 n??m 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        NoiCapCMNDBN: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        ngayPhatHienSuyThan: Yup.string().nullable(),
        nguyenNhanSuyThan: Yup.string().trim(),
        // dia chi thuong tru
        tinh: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        xaphuong: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        quanhuyen: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        // dia chi tam tru
        tinhtt: Yup.string().nullable(),
        xaphuongtt: Yup.string().nullable(),
        quanhuyentt: Yup.string().nullable(),
        lonNhatSinhNam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900, 'Vui l??ng nh???p s??? l???n h??n 1900')
            .nullable()
            .typeError('N??m sinh ph???i l?? s??? l???n h??n 1900')
            .integer('N??m sinh ph???i l?? s??? nguy??n'),
        laConThuMay: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        coMayCon: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'Vui l??ng nh???p s??? l???n h??n ho???c b???ng 0')
            .nullable()
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        soConTrai: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'Vui l??ng nh???p s??? l???n h??n ho???c b???ng 0')
            .nullable()
            .min(0, 'Vui l??ng nh???p s??? l???n h??n ho???c b???ng 0')
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        soConGai: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'Vui l??ng nh???p s??? l???n h??n ho???c b???ng 0')
            .nullable()
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        nhoNhatSinhNam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900, 'Vui l??ng nh???p s??? l???n h??n 1900')
            .nullable()
            .typeError('N??m sinh ph???i l?? s??? l???n h??n 1900')
            .integer('N??m sinh ph???i l?? s??? nguy??n'),
        baoNhieuDonViMau: Yup.number()
            .positive('Vui l??ng nh???p s??? l???n h??n 0')
            .min(0, '????n v??? m??u ph???i l???n h??n 0'),
        thang: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1, 'Th??ng ph???i l???n h??n 0')
            .max(12, 'Th??ng ph???i nh??? h??n ho???c b???ng 12')
            .nullable()
            .typeError('H??y nh???p m???t s??? t??? 1 ?????n 12')
            .integer('Th??ng ph???i l?? s??? nguy??n'),
        nam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900, 'N??m ph???i l???n h??n 1900')
            .nullable()
            .typeError('N??m ph???i l?? s??? l???n h??n 1900')
            .integer('N??m ph???i l?? s??? nguy??n'),
        chieuCao: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'Chi???u cao ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p s???'),
        canNang: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'C??n n???ng ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p s???'),
        soLanTuan: Yup.number()
            .positive('S??? ph???i l???n h??n ho???c b???ng 0')
            .min(0, 'S??? l???n ph???i l???n h??n ho???c b???ng 0')
            .typeError('Vui l??ng nh???p s???'),
        dieuTrenNgay: Yup.number()
            .positive('S??? ph???i l???n h??n ho???c b???ng 0')
            .min(0, 'S??? ??i???u ph???i l???n h??n ho???c b???ng 0'),
        thuNhapVoChongBenhNhan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('Vui l??ng nh???p s???'),
        thuNhapKhac: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0, 'Thu nh???p ph???i l???n h??n ho???c b???ng 0')
            .typeError('Vui l??ng nh???p s???'),
        ctntHoacKhamThamPhan: Yup.string(),
        ngayCTNTHoacKhamThamPhanBenhLy: Yup.string(),
        soLanCTNTTuan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .typeError('Vui l??ng nh???p s???'),
        soGioTrenLan: Yup.string().trim(),
        chuKyThamPhan: Yup.string(),
        thuocDangSuDungNgay: Yup.string().trim(),
        thuocTaoMau: Yup.string(),
        bacSiDieuTri: Yup.string().trim(),
        dienThoaiBacSi: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'xxx',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        // .test('xxx', 'S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        chuKyThamPhanTaiBV: Yup.string(),
        hoTenVoChong: Yup.string()
            .test(
                'lxxen',
                'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t v?? s???',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t??? kh??ng ph???i kho???ng tr???ng')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .nullable(),
        dienThoaiVoChong: Yup.string()
            .nullable()
            .test(
                'lxxen',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            )
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'),
        // .test('xxx', 'S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        thuNhapBenhNhan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        tienChuanBiChoViecGhepThan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        email: Yup.string()
            .required('Vui l??ng nh???p th??ng tin')
            .test('isEmail', 'Email kh??ng h???p l???', (val) => {
                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return (
                    isEmail.test(val) ||
                    val === '' ||
                    val === undefined ||
                    val === null
                );
            }),
        maso: Yup.number()
            .nullable()
            .min(0, 'Vui l??ng nh???p s??? l???n h??n 0')
            .typeError('Vui l??ng nh???p s???')
    });

    const SignupSchemaTangKhac = Yup.object().shape({
        hoTenBN: Yup.string()
            .trim()
            .test(
                'lxxen',
                'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t v?? s???',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t??? kh??ng ph???i kho???ng tr???ng')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        ngheNghiep: Yup.string().trim().required('Vui l??ng nh???p th??ng tin n??y'),
        nhomMau: Yup.string().trim(),
        nhomMau1: Yup.string(),
        CMNDBN: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(9, 'CMND ph???i c?? ??t nh???t 9 s???')
            .max(12, 'CMND ph???i c?? ??t nh???t 12 s???')
            .test('len', 'CMND ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
        ngaySinh: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y sinh v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        baoHiemYTe: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin')
            .test(
                'len',
                'S??? b???o hi???m y t??? ch??? ???????c s??? d???ng ch??? c??i v?? s???',
                (val) => /^[a-zA-Z0-9 ]*$/.test(val)
            ),
        trinhDoVanHoa: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        dienThoai: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test('xxx', 'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        dienThoai1: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'xxx',
                'S??? ??i???n tho???i ch??? s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        // .test('xxx', 'S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        dienThoaiVoChong: Yup.string()
            .nullable()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'len',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        diaChiThuongChu: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        diaChiTamChu: Yup.string().trim().nullable(),
        NgayCapCMNDBN: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y c???p v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ng??y c???p ph???i sau ng??y 1 th??ng 1 n??m 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        nguyenNhanSuyThan: Yup.string().trim(),
        ngayPhatHienSuyThan: Yup.string().nullable(),
        NoiCapCMNDBN: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        // dia chi thuong tru
        tinh: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        xaphuong: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        quanhuyen: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        // dia chi tam tru
        tinhtt: Yup.string().nullable(),
        xaphuongtt: Yup.string().nullable(),
        quanhuyentt: Yup.string().nullable(),
        thuocDangSuDungNgay: Yup.string().trim(),
        lonNhatSinhNam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900)
            .typeError('N??m sinh ph???i l?? s??? l???n h??n 1900')
            .integer('N??m sinh ph???i l?? s??? nguy??n')
            .nullable(),
        laConThuMay: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        coMayCon: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0')
            .nullable(),
        soConTrai: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0')
            .nullable(),
        soConGai: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0')
            .nullable(),
        nhoNhatSinhNam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900)
            .typeError('N??m sinh ph???i l?? s??? l???n h??n 1900')
            .integer('N??m sinh ph???i l?? s??? nguy??n')
            .nullable(),
        baoNhieuDonViMau: Yup.number().positive('S??? ph???i l???n h??n 0'),
        thang: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1)
            .max(12)
            .nullable()
            .typeError('H??y nh???p m???t s??? t??? 1 ?????n 12')
            .integer('Th??ng ph???i l?? s??? nguy??n'),
        nam: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(1900)
            .nullable()
            .typeError('N??m ph???i l?? s??? l???n h??n 1900')
            .integer('N??m ph???i l?? s??? nguy??n'),
        chieuCao: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        canNang: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        soLanTuan: Yup.number()
            .positive('S??? ph???i l???n h??n ho???c b???ng 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        dieuTrenNgay: Yup.number()
            .positive('S??? ph???i l???n h??n ho???c b???ng 0')
            .min(0),
        thuNhapVoChongBenhNhan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        thuNhapKhac: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        thuocTaoMau: Yup.string().trim(),
        bacSiDieuTri: Yup.string().trim(),
        dienThoaiBacSi: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'xxx',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        thuNhapBenhNhan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        tienChuanBiChoViecGhepThan: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(0)
            .typeError('H??y nh???p m???t s??? l???n h??n 0'),
        choGhepBenh: Yup.string()
            .trim()
            .required('Vui l??ng nh???p')
            .typeError('Vui l??ng nh???p th??ng tin'),
        choGhepBVDieuTri: Yup.string()
            .trim()
            .required('Vui l??ng nh???p')
            .typeError('Vui l??ng nh???p th??ng tin'),
        hoTenVoChong: Yup.string()
            .test(
                'lxxen',
                'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t v?? s???',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t??? kh??ng ph???i kho???ng tr???ng')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .nullable(),
        email: Yup.string()
            .required('Vui l??ng nh???p email')
            .test('isEmail', 'Email kh??ng h???p l???', (val) => {
                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return (
                    isEmail.test(val) ||
                    val === '' ||
                    val === undefined ||
                    val === null
                );
            }),
        maso: Yup.number()
            .nullable()
            .min(0, 'Vui l??ng nh???p s??? l???n h??n 0')
            .typeError('Vui l??ng nh???p s???')
    });

    async function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(Arr[0]);
        });
        if (Arr[0] !== undefined) {
            FileSelected = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('Avatar');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('Avatar');
            image.src =
                'https://cidrapbusiness.org/wp-content/uploads/2017/10/noimage.gif';
            FileSelected = {current: null};
        }
    }
    async function ChangeFileUploadCMNDMT(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
        });
        if (Arr[0] !== undefined) {
            FileSelectedCMNDMT = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('ImgCMNDBNMatTruoc');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('ImgCMNDBNMatTruoc');
            image.src = '';
            FileSelectedCMNDMT = {current: null};
        }
    }
    async function ChangeFileUploadCMNDMs(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
        });
        if (Arr[0] !== undefined) {
            FileSelectedCMNDMs = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('ImgCMNDBNMatSau');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('ImgCMNDBNMatSau');
            image.src = '';
            FileSelectedCMNDMs = {current: null};
        }
    }
    const KhongBiNhiemCheck = () => {
        const isChecked = $('#NhiemCovid').prop('checked');
        if (isChecked === true) {
            $('#BiTruocTiem').prop('checked', false);
            $('#BiSauTiem').prop('checked', false);
            $('#CoTrieuChung').prop('checked', false);
            $('#TrieuChungNhe').prop('checked', null);
            $('#TrieuChungtrungBinh').prop('checked', null);
            $('#NhapVien').prop('checked', null);
            $('#ThoMay').prop('checked', null);
            $('#ThoHFNC').prop('checked', null);
        }
    };
    const RenderEditQuanHeGiaDinh = (abc) => {
        const {lstQhgd} = abc;
        let dataQhgdinnit = [];
        if (lstQhgd !== undefined) {
            dataQhgdinnit = lstQhgd;
        }
        const [lstAnhChiEm, setLstAnhChiEm] = useState(dataQhgdinnit);
        useEffect(() => {
            dataGiaDinhEdit.current = dataQhgdinnit;
        }, []);
        const handleChange = (event, idd) => {
            const {name} = event.target;
            const newItem = [...lstAnhChiEm];
            newItem[idd] = {...newItem[idd], [name]: event.target.value};
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
        };

        const DeleteItem = (ind) => {
            const newItem = [...lstAnhChiEm];
            newItem.splice(ind, 1);
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
            toast.info('X??a th??nh c??ng');
        };
        return (
            <div>
                <div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            const NewItem = [...lstAnhChiEm, {}];
                            setLstAnhChiEm(NewItem);
                        }}
                    >
                        <i className="fas fa-plus" /> Th??m anh/ch???/em
                    </Button>
                </div>
                {lstAnhChiEm.map((item, key) => {
                    return (
                        <div className="row">
                            <div className="col-md-11 col-sm-11">
                                <div
                                    className="row"
                                    key={`${item.hoTenBN}--${key}`}
                                >
                                    <div className="form-group col-md-6 col-sm-6">
                                        <label htmlFor="HoTenNguoiThan">
                                            H??? v?? t??n
                                        </label>
                                        <Field
                                            name="HoTenNguoiThan"
                                            key="HoTenNguoiThan"
                                            value={item.HoTenNguoiThan}
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="QuanHeNguoiThan">
                                            Quan h???
                                        </label>
                                        <Field
                                            name="QuanHeNguoiThan"
                                            as="select"
                                            key="QuanHeNguoiThan"
                                            className="form-control "
                                            value={item.QuanHeNguoiThan}
                                            onChange={(event) => {
                                                handleChange(event, key);
                                            }}
                                        >
                                            <option value="">--Ch???n--</option>
                                            <DropDMQHGD />
                                        </Field>
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="NamSinhNguoiThan">
                                            Sinh n??m
                                        </label>
                                        <Field
                                            type="number"
                                            name="NamSinhNguoiThan"
                                            key="NamSinhNguoiThan"
                                            className="form-control "
                                            defaultValue={item.NamSinhNguoiThan}
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="NhomMauNguoiThan">
                                            Nh??m m??u ABO
                                        </label>
                                        <Field
                                            as="select"
                                            name="NhomMauNguoiThan"
                                            key="NhomMauNguoiThan"
                                            className="form-control "
                                            value={item.NhomMauNguoiThan}
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                            onKeyUp={(event) =>
                                                handleChange(event, key)
                                            }
                                        >
                                            <option>--Ch???n--</option>
                                            <DropDMNhomMau />
                                        </Field>
                                    </div>
                                </div>
                                <div className="row" key={key}>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="TrinhDoVHNguoiThan">
                                            Tr??nh ????? v??n h??a
                                        </label>

                                        <Field
                                            name="TrinhDoVHNguoiThan"
                                            key="TrinhDoVHNguoiThan"
                                            defaultValue={
                                                item.TrinhDoVHNguoiThan
                                            }
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-4 col-sm-4">
                                        <label htmlFor="DiaChiThuongTruNguoiThan">
                                            ?????a ch??? th?????ng tr??
                                        </label>
                                        <Field
                                            name="DiaChiThuongTruNguoiThan"
                                            key="DiaChiThuongTruNguoiThan"
                                            defaultValue={
                                                item.DiaChiThuongTruNguoiThan
                                            }
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="DienThoaiNguoiThan">
                                            S??? ??i???n tho???i
                                        </label>
                                        <Field
                                            name="DienThoaiNguoiThan"
                                            key="DienThoaiNguoiThan"
                                            className="form-control "
                                            defaultValue={
                                                item.DienThoaiNguoiThan
                                            }
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-4 col-sm-4">
                                        <label htmlFor="LyDoKhongHien">
                                            L?? do kh??ng hi???n ???????c
                                        </label>
                                        <Field
                                            name="LyDoKhongHien"
                                            key="LyDoKhongHien"
                                            className="form-control "
                                            defaultValue={item.LyDoKhongHien}
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-1 col-sm-1">
                                <label htmlFor="a">X??a</label>
                                <div>
                                    <Button
                                        variant="danger"
                                        onClick={() => DeleteItem(key)}
                                    >
                                        <i className="fas fa-times" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    function EditModal() {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.Tinh === null ? '' : entityObj.Tinh,
            quanhuyen: entityObj.QuanHuyen === null ? '' : entityObj.QuanHuyen,
            tinhtt: entityObj.Tinhtt === null ? '' : entityObj.Tinhtt,
            quanhuyentt:
                entityObj.QuanHuyentt === null ? '' : entityObj.QuanHuyentt
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
            } else if (name === 'tinhtt') {
                setloaddiachi({...loaddiachi, tinhtt: value, quanhuyentt: ''});
            } else if (name === 'quanhuyentt') {
                setloaddiachi({...loaddiachi, quanhuyentt: value});
            }
        }
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <Row>
                <Col md={12}>
                    <div className="">
                        <div className="Title-Login-Register center">
                            C???p nh???t ????ng k?? ch??? gh??p Th???n
                        </div>
                    </div>

                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                id: entityObj.Id,
                                typePhieuDKGhepTang:
                                    entityObj.TypePhieuDKGhepTang,
                                hoTenBN: entityObj.HoTenBN,
                                tinh: entityObj.Tinh,
                                xaphuong: entityObj.XaPhuong,
                                quanhuyen: entityObj.QuanHuyen,
                                tinhtt: entityObj.Tinhtt,
                                xaphuongtt: entityObj.XaPhuongtt,
                                quanhuyentt: entityObj.QuanHuyentt,
                                gioiTinh: String(entityObj.GioiTinh),
                                ngaySinh: CommonUtility.GetDateSetField(
                                    entityObj.NgaySinh
                                ),
                                nhomMau: entityObj.NhomMau,
                                nhomMau1: entityObj.NhomMau1,
                                baoHiemYTe: entityObj.BaoHiemYTe,
                                CMNDBN: entityObj.CMNDBN,
                                NgayCapCMNDBN: CommonUtility.GetDateSetField(
                                    entityObj.NgayCapCMNDBN
                                ),
                                NoiCapCMNDBN: entityObj.NoiCapCMNDBN,
                                ngheNghiep: entityObj.NgheNghiep,
                                ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                                trinhDoVanHoa: entityObj.TrinhDoVanHoa,
                                dienThoai: entityObj.DienThoai,
                                dienThoai1: entityObj.DienThoai1,
                                diaChiThuongChu: entityObj.DiaChiThuongChu,
                                diaChiTamChu: entityObj.DiaChiTamChu,
                                laConThuMay: entityObj.LaConThuMay,
                                tinhTrangHonNhan: String(
                                    entityObj.TinhTrangHonNhan
                                ),
                                hoTenVoChong: entityObj.HoTenVoChong,
                                dienThoaiVoChong: entityObj.DienThoaiVoChong,
                                coMayCon: entityObj.CoMayCon,
                                soConTrai: entityObj.SoConTrai,
                                soConGai: entityObj.SoConGai,
                                lonNhatSinhNam: entityObj.LonNhatSinhNam,
                                nhoNhatSinhNam: entityObj.NhoNhatSinhNam,
                                tienCanGiaDinh: entityObj.TienCanGiaDinh,
                                tienCanBanThan: entityObj.TienCanBanThan,
                                nguyenNhanSuyThan: entityObj.NguyenNhanSuyThan,
                                chuanDoanSuyThanGhep:
                                    entityObj.ChuanDoanSuyThanGhep,
                                benhSu: entityObj.BenhSu,
                                thuocTriViemGan: entityObj.ThuocTriViemGan,
                                sinhThietThan: String(entityObj.SinhThietThan),
                                ketQuaSinhThietThan:
                                    entityObj.KetQuaSinhThietThan,
                                ngayPhatHienSuyThan: CommonUtility.GetDateSetField(
                                    entityObj.NgayPhatHienSuyThan
                                ),
                                ngayCTNTHoacKhamThamPhanBenhLy: CommonUtility.GetDateSetField(
                                    entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                ),
                                dieuTriViemGanTu: entityObj.DieuTriViemGanTu,
                                CTNTVaoNgay: String(entityObj.CTNTVaoNgay),
                                soGioTrenLan:
                                    entityObj.SoGioTrenLan !== null
                                        ? entityObj.SoGioTrenLan
                                        : '',
                                soLanCTNTTuan:
                                    entityObj.SoLanCTNTTuan !== null
                                        ? entityObj.SoLanCTNTTuan
                                        : '',
                                chuKyThamPhan:
                                    entityObj.ChuKyThamPhan !== null
                                        ? entityObj.ChuKyThamPhan
                                        : '',
                                chuKyThamPhanTaiBV:
                                    entityObj.ChuKyThamPhanTaiBV !== null
                                        ? entityObj.ChuKyThamPhanTaiBV
                                        : '',
                                thamPhanBangMay: String(
                                    entityObj.ThamPhanBangMay
                                ),
                                thamPhanBangMayTaiBV:
                                    entityObj.ThamPhanBangMayTaiBV,
                                truyenMau: String(entityObj.TruyenMau),
                                baoNhieuDonViMau: entityObj.BaoNhieuDonViMau,
                                thang:
                                    entityObj.Thang !== null
                                        ? entityObj.Thang
                                        : '',
                                nam:
                                    entityObj.Nam !== null ? entityObj.Nam : '',
                                benhVienTruyenMau: entityObj.BenhVienTruyenMau,
                                daGhepLan1Ngay: CommonUtility.GetDateSetField(
                                    entityObj.DaGhepLan1Ngay
                                ),
                                daGhepLan1TaiBV: entityObj.DaGhepLan1TaiBV,
                                nguoiChoThan: entityObj.NguoiChoThan,
                                ngayChayThanTroLai: CommonUtility.GetDateSetField(
                                    entityObj.NgayChayThanTroLai
                                ),
                                chayThanTroLaiTaiBV:
                                    entityObj.ChayThanTroLaiTaiBV,
                                ctntHoacKhamThamPhan: CommonUtility.GetDateSetField(
                                    entityObj.CTNTHoacKhamThamPhan
                                ),
                                ctntVaoNgayThuMay: entityObj.CTNTVaoNgayThuMay,
                                caCTNT: entityObj.CaCTNT,
                                chieuCao: entityObj.ChieuCao,
                                canNang: entityObj.CanNang,
                                nuocTieu24h: String(entityObj.NuocTieu24h),
                                soLuongNuocTieu24h:
                                    entityObj.SoLuongNuocTieu24h,
                                thuocDangSuDungNgay:
                                    entityObj.ThuocDangSuDungNgay,
                                thoiGianBiTangHuyetAp: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiTangHuyetAp
                                ),
                                thuocTaoMau: entityObj.ThuocTaoMau,
                                bacSiDieuTri: entityObj.BacSiDieuTri,
                                dienThoaiBacSi: entityObj.DienThoaiBacSi,
                                khongBiViemGan: entityObj.KhongBiViemGan,
                                viemGanSieuViA: entityObj.ViemGanSieuViA,
                                viemGanSieuViB: entityObj.ViemGanSieuViB,
                                viemGanSieuViC: entityObj.ViemGanSieuViC,
                                truocHoacSauLocMau: String(
                                    entityObj.TruocHoacSauLocMau
                                ),
                                tangHuyetAp: String(entityObj.TangHuyetAp),
                                daiThaoDuong: String(entityObj.DaiThaoDuong),
                                thoiGianBiDaiThaoDuong: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                ),
                                thuocDieuTriDaiThaoDuong:
                                    entityObj.ThuocDieuTriDaiThaoDuong,
                                tinhTrang: entityObj.TinhTrang,
                                laoPhoi: String(entityObj.LaoPhoi),
                                hutThuoc: String(entityObj.HutThuoc),
                                dieuTrenNgay:
                                    entityObj.DieuTrenNgay !== null
                                        ? entityObj.DieuTrenNgay
                                        : '',
                                uongRuouBia: String(entityObj.UongRuouBia),
                                soLanTuan:
                                    entityObj.SoLanTuan !== null
                                        ? entityObj.SoLanTuan
                                        : '',
                                soLuongLan: entityObj.SoLuongLan,
                                benhKhac: entityObj.BenhKhac,
                                laoCoQuanKhac: entityObj.LaoCoQuanKhac,
                                thoiGianBiLao: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiLao
                                ),
                                thoiGianDieuTriAndNoiDieuTri:
                                    entityObj.ThoiGianDieuTriAndNoiDieuTri,
                                namPhatHien: entityObj.NamPhatHien,
                                dieuTriTaiBV: entityObj.DieuTriTaiBV,
                                thoiGianDieuTri: entityObj.ThoiGianDieuTri,
                                thuocDieuTri: entityObj.ThuocDieuTri,
                                daPhauThuat: String(entityObj.DaPhauThuat),
                                coPhauThuat: entityObj.CoPhauThuat,
                                tinhTrangHienTai: entityObj.TinhTrangHienTai,
                                ngayThangPhauThuat: CommonUtility.GetDateSetField(
                                    entityObj.NgayThangPhauThuat
                                ),
                                benhVienPhauThuat: entityObj.BenhVienPhauThuat,
                                biBenhThan: String(entityObj.BiBenhThan),
                                biBenhLao: String(entityObj.BiBenhLao),
                                biDaiThaoDuong: String(
                                    entityObj.BiDaiThaoDuong
                                ),
                                biTangHuyetAp: String(entityObj.BiTangHuyetAp),
                                biUngThu: String(entityObj.BiUngThu),
                                songCungDiaChi: String(
                                    entityObj.SongCungDiaChi
                                ),
                                biBenhKhac: entityObj.BiBenhKhac,
                                nguoiThanBiBenh: entityObj.NguoiThanBiBenh,
                                thuNhapBenhNhan: entityObj.ThuNhapBenhNhan,
                                tinhTrangBenhNguoiThanHienTai:
                                    entityObj.TinhTrangBenhNguoiThanHienTai,
                                thuNhapVoChongBenhNhan:
                                    entityObj.ThuNhapVoChongBenhNhan,
                                ngheNghiepVoChong: entityObj.NgheNghiepVoChong,
                                thuNhapKhac: entityObj.ThuNhapKhac,
                                tienChuanBiChoViecGhepThan:
                                    entityObj.TienChuanBiChoViecGhepThan,
                                khongCoNguoiNhan: entityObj.KhongCoNguoiNhan,
                                nguoiChoBiBenh: entityObj.NguoiChoBiBenh,
                                nguoiChoKhongHoaHopMau:
                                    entityObj.NguoiChoKhongHoaHopMau,
                                lyDoKhac: entityObj.LyDoKhac,
                                email: entityObj.Email,
                                NhiemCovid: entityObj.NhiemCovid,
                                BiTruocTiem: entityObj.BiTruocTiem,
                                BiSauTiem: entityObj.BiSauTiem,
                                CoTrieuChung: entityObj.CoTrieuChung,
                                TrieuChungNhe: entityObj.TrieuChungNhe,
                                TrieuChungtrungBinh:
                                    entityObj.TrieuChungtrungBinh,
                                NhapVien: entityObj.NhapVien,
                                ThoiGianNamVien: entityObj.ThoiGianNamVien,
                                ThoMay: entityObj.ThoMay,
                                ThoHFNC: entityObj.ThoHFNC,
                                TiemVaccine: entityObj.TiemVaccine,
                                NgayTiemMui1: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui1
                                ),
                                NgayTiemMui2: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui2
                                ),
                                PhanUng: entityObj.PhanUng,
                                TiemVaccine2: entityObj.TiemVaccine2,
                                PhanUng2: entityObj.PhanUng2,
                                NgayTiemMui3: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui3
                                ),
                                TiemVaccine3: entityObj.TiemVaccine3,
                                PhanUng3: entityObj.PhanUng3
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // sua gia tri 3 checkbox viem gan sieu vi A B C
                                const values1 = values;
                                let CMNDtruoc = false;
                                let CMNDsau = false;
                                if (values.khongBiViemGan) {
                                    values1.viemGanSieuViA = false;
                                    values1.viemGanSieuViB = false;
                                    values1.viemGanSieuViC = false;
                                    values1.truocHoacSauLocMau = 0;
                                }

                                const qhgd = dataGiaDinhEdit.current
                                    ? dataGiaDinhEdit.current
                                    : [];
                                const ObjSave = {
                                    dangKyChoGhepThanEditVM: {
                                        ...values1,
                                        Avatar: entityObj.Avatar,
                                        typePhieuDKGhepTang:
                                            entityObj.TypePhieuDKGhepTang,
                                        ImgCMNDBNMatTruoc:
                                            entityObj.ImgCMNDBNMatTruoc,
                                        ImgCMNDBNMatSau:
                                            entityObj.ImgCMNDBNMatSau
                                    },
                                    quanHeGiaDinhEditVMs: qhgd
                                };
                                if (
                                    FileSelected !== undefined &&
                                    FileSelected.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgAvatar = FileSelected;
                                }

                                if (
                                    FileSelectedCMNDMT !== undefined &&
                                    FileSelectedCMNDMT.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgCMND1 = FileSelectedCMNDMT;
                                    CMNDtruoc = true;
                                }

                                if (
                                    FileSelectedCMNDMs !== undefined &&
                                    FileSelectedCMNDMs.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgCMND2 = FileSelectedCMNDMs;
                                    CMNDsau = true;
                                }

                                // kiem tra xem du 2 cmnd
                                setisload(true);
                                dangKyChoGhepTangService
                                    .EditNewEntityUser(ObjSave)
                                    .then((itemdata) => {
                                        if (itemdata.Status === true) {
                                            toast.success(
                                                'C???p nh???t ????ng k?? hi???n t???ng th??nh c??ng'
                                            );
                                            history.push(
                                                `/ChiTietDKChoGhepTang/${entityObj.Id}`
                                            );
                                        } else {
                                            toast.error(itemdata.MessageError);
                                        }
                                        setisload(false);
                                    });
                                // FileSelectedCMNDMs = null;
                                // FileSelectedCMNDMT = null;
                                // FileSelected = null;
                                // FileSelected = null;
                            }}
                        >
                            {({errors, touched, values, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="id" key="id" />
                                    <Field
                                        type="hidden"
                                        name="typePhieuDKGhepTang"
                                        key="TypePhieuDKGhepTang"
                                    />
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            I. H??NH CH??NH:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="hoTenBN">
                                                    H??? v?? t??n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="hoTenBN"
                                                    key="hoTenBN"
                                                    className="form-control "
                                                />
                                                {errors.hoTenBN &&
                                                touched.hoTenBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.hoTenBN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-2">
                                                <label htmlFor="gioiTinh">
                                                    Gi???i t??nh
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="gioiTinh"
                                                            value="1"
                                                        />{' '}
                                                        Nam
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="gioiTinh"
                                                            value="0"
                                                        />{' '}
                                                        N???
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ImageSrc"
                                                    key="ImageSrc"
                                                    className="form-control img-padding"
                                                    onChange={ChangeFileUpload}
                                                />
                                                {errors.ImageSrc &&
                                                touched.ImageSrc ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ImageSrc}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh th??? c??
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className="imgHinhAnhAccount"
                                                            src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                            alt=""
                                                            onError={
                                                                NotFoundUserImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh th??? m???i
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            id="Avatar"
                                                            alt=""
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="ngaySinh">
                                                    Ng??y sinh
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngaySinh"
                                                    key="ngaySinh"
                                                    className="form-control "
                                                />
                                                {errors.ngaySinh &&
                                                touched.ngaySinh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ngaySinh}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-2">
                                                <label htmlFor="nhomMau">
                                                    Nh??m m??u ABO
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nhomMau"
                                                    key="nhomMau"
                                                    defaultValue={
                                                        entityObj.NhomMau
                                                    }
                                                    className="form-control "
                                                >
                                                    <option>--Ch???n--</option>
                                                    <DropDMNhomMau />
                                                </Field>

                                                {errors.nhomMau &&
                                                touched.nhomMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nhomMau}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nhomMau1">
                                                    Nh??m m??u Rh
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nhomMau1"
                                                    key="nhomMau1"
                                                    defaultValue={
                                                        entityObj.NhomMau1
                                                    }
                                                    className="form-control "
                                                >
                                                    <option>--Ch???n--</option>
                                                    <DropDMNhomMauRh />
                                                </Field>

                                                {errors.nhomMau1 &&
                                                touched.nhomMau1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nhomMau1}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="baoHiemYTe">
                                                    B???o hi???m y t???
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="baoHiemYTe"
                                                    key="baoHiemYTe"
                                                    className="form-control "
                                                />
                                                {errors.baoHiemYTe &&
                                                touched.baoHiemYTe ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.baoHiemYTe}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="CMNDBN">
                                                    CMND/ CCCD/ h??? chi???u
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="CMNDBN"
                                                    key="CMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.CMNDBN &&
                                                touched.CMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.CMNDBN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayCapCMNDBN">
                                                    Ng??y c???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayCapCMNDBN"
                                                    key="NgayCapCMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.NgayCapCMNDBN &&
                                                touched.NgayCapCMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayCapCMNDBN
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NoiCapCMNDBN">
                                                    N??i c???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="NoiCapCMNDBN"
                                                    key="NoiCapCMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.NoiCapCMNDBN &&
                                                touched.NoiCapCMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NoiCapCMNDBN
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ImgCMNDBNMatTruoc">
                                                    ???nh CMND / CCCD / h??? chi???u
                                                    m???t tr?????c
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ImgCMNDBNMatTruoc"
                                                    key="ImgCMNDBNMatTruoc"
                                                    className="form-control "
                                                    onChange={
                                                        ChangeFileUploadCMNDMT
                                                    }
                                                />
                                                {errors.ImgCMNDBNMatTruoc &&
                                                touched.ImgCMNDBNMatTruoc ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ImgCMNDBNMatTruoc
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>

                                                <Field
                                                    type="file"
                                                    name="ImgCMNDBNMatSau"
                                                    key="ImgCMNDBNMatSau"
                                                    className="form-control  img-padding"
                                                    onChange={
                                                        ChangeFileUploadCMNDMs
                                                    }
                                                />
                                                {errors.ImgCMNDBNMatSau &&
                                                touched.ImgCMNDBNMatSau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ImgCMNDBNMatSau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t tr?????c c??
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className=" imgCMND"
                                                            src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
                                                            alt=""
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t tr?????c m???i
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className=" imgCMND"
                                                            id="ImgCMNDBNMatTruoc"
                                                            alt=""
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau c??
                                                </label>
                                                <div>
                                                    <img
                                                        className=" imgCMND"
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
                                                        alt=""
                                                        onError={NotFoundImage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau m???i
                                                </label>
                                                <div>
                                                    <img
                                                        className=" imgCMND"
                                                        id="ImgCMNDBNMatSau"
                                                        alt=""
                                                        onError={NotFoundImage}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNghiep">
                                                    Ngh??? Nghi???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="ngheNghiep"
                                                    key="ngheNghiep"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    <DropDMNgheNghiep />
                                                </Field>

                                                {errors.ngheNghiep &&
                                                touched.ngheNghiep ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ngheNghiep}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNhiepBoSung">
                                                    Ngh??? Nghi???p ghi r??
                                                </label>
                                                <Field
                                                    name="ngheNhiepBoSung"
                                                    key="ngheNhiepBoSung"
                                                    className="form-control "
                                                />
                                                {errors.ngheNhiepBoSung &&
                                                touched.ngheNhiepBoSung ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngheNhiepBoSung
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="trinhDoVanHoa">
                                                    Tr??nh ????? v??n h??a
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="V?? d??? h???c h???t l???p 10 c???a h??? 12 th?? nh???p: 10/12"
                                                    name="trinhDoVanHoa"
                                                    key="trinhDoVanHoa"
                                                    className="form-control "
                                                />
                                                {errors.trinhDoVanHoa &&
                                                touched.trinhDoVanHoa ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.trinhDoVanHoa
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="dienThoai">
                                                    ??i???n tho???i
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="dienThoai"
                                                    key="dienThoai"
                                                    className="form-control "
                                                />
                                                {errors.dienThoai &&
                                                touched.dienThoai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.dienThoai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="dienThoai1">
                                                    ??i???n tho???i kh??c
                                                </label>
                                                <Field
                                                    name="dienThoai1"
                                                    key="dienThoai1"
                                                    className="form-control "
                                                />
                                                {errors.dienThoai1 &&
                                                touched.dienThoai1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.dienThoai1}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="email">
                                                    Email
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="email"
                                                    key="email"
                                                    className="form-control "
                                                />
                                                {errors.email &&
                                                touched.email ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.email}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-row">
                                            <label htmlFor="diaChi">
                                                ?????a Ch??? Th?????ng Tr?? :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinh"
                                                    className="chitietdiachi"
                                                >
                                                    T???nh/Th??nh Ph???
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="tinh"
                                                    key="tinh"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'tinh',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'tinh',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyen',
                                                            ''
                                                        );
                                                        setFieldValue(
                                                            'xaphuong',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {RenderDropdownTinh({
                                                        code: 'tinh'
                                                    })}
                                                </Field>
                                                {errors.tinh && touched.tinh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinh}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="quanhuyen"
                                                    className="chitietdiachi"
                                                >
                                                    Qu???n/Huy???n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="quanhuyen"
                                                    key="quanhuyen"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'quanhuyen',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyen',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'xaphuong',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.tinh !== '' ? (
                                                        <RenderDropdownQuanhuyen
                                                            code="quanhuyen"
                                                            data={
                                                                loaddiachi.tinh
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.quanhuyen &&
                                                touched.quanhuyen ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.quanhuyen}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="xaphuong"
                                                    className="chitietdiachi"
                                                >
                                                    X??/Ph?????ng
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuong"
                                                    key="xaphuong"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.quanhuyen !==
                                                    '' ? (
                                                        <RenderDropdownXaphuong
                                                            code="xaphuong"
                                                            data={
                                                                loaddiachi.quanhuyen
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.xaphuong &&
                                                touched.xaphuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.xaphuong}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label
                                                htmlFor="diaChiThuongChu"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="diaChiThuongChu"
                                                key="diaChiThuongChu"
                                                className="form-control "
                                            />
                                            {errors.diaChiThuongChu &&
                                            touched.diaChiThuongChu ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diaChiThuongChu}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <br />
                                        <div className="form-row">
                                            <label htmlFor="diaChiTamChu">
                                                ?????a Ch??? T???m Tr?? :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinhtt"
                                                    className="chitietdiachi"
                                                >
                                                    T???nh/Th??nh Ph???
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="tinhtt"
                                                    key="tinhtt"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'tinhtt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'tinhtt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyentt',
                                                            ''
                                                        );
                                                        setFieldValue(
                                                            'xaphuongtt',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {RenderDropdownTinh({
                                                        code: 'tinh'
                                                    })}
                                                </Field>
                                                {errors.tinhtt &&
                                                touched.tinhtt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinhtt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="quanhuyentt"
                                                    className="chitietdiachi"
                                                >
                                                    Qu???n/Huy???n
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="quanhuyentt"
                                                    key="quanhuyentt"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'quanhuyentt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyentt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'xaphuongtt',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.tinhtt !==
                                                    '' ? (
                                                        <RenderDropdownQuanhuyen
                                                            code="quanhuyentt"
                                                            data={
                                                                loaddiachi.tinhtt
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.quanhuyentt &&
                                                touched.quanhuyentt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.quanhuyentt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="xaphuongtt"
                                                    className="chitietdiachi"
                                                >
                                                    X??/Ph?????ng
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuongtt"
                                                    key="xaphuongtt"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.quanhuyentt !==
                                                    '' ? (
                                                        <RenderDropdownXaphuong
                                                            code="xaphuongtt"
                                                            data={
                                                                loaddiachi.quanhuyentt
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.xaphuongtt &&
                                                touched.xaphuongtt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.xaphuongtt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label
                                                htmlFor="diaChiTamChu"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                            </label>
                                            <Field
                                                name="diaChiTamChu"
                                                key="diaChiTamChu"
                                                className="form-control "
                                            />
                                            {errors.diaChiTamChu &&
                                            touched.diaChiTamChu ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diaChiTamChu}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <br />
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laConThuMay">
                                                    Gia ????nh: l?? con th??? m???y?
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="laConThuMay"
                                                    key="laConThuMay"
                                                    className="form-control "
                                                    placeholder="VD: l?? con th??? 1 trong gia ????nh 2 con vi???t l?? 1/2"
                                                />
                                                {errors.laConThuMay &&
                                                touched.laConThuMay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.laConThuMay}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangHonNhan">
                                                    T??nh tr???ng h??n nh??n
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="0"
                                                        />{' '}
                                                        ?????c th??n
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="1"
                                                        />{' '}
                                                        ???? c?? gia ????nh
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="hoTenVoChong">
                                                    H??? t??n V???/Ch???ng:
                                                </label>
                                                <Field
                                                    name="hoTenVoChong"
                                                    key="hoTenVoChong"
                                                    className="form-control "
                                                />
                                                {errors.hoTenVoChong &&
                                                touched.hoTenVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.hoTenVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="dienThoaiVoChong">
                                                    ??i???n tho???i
                                                </label>
                                                <Field
                                                    type="tel"
                                                    name="dienThoaiVoChong"
                                                    key="dienThoaiVoChong"
                                                    className="form-control "
                                                />
                                                {errors.dienThoaiVoChong &&
                                                touched.dienThoaiVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dienThoaiVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="coMayCon">
                                                    C?? m???y con
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="coMayCon"
                                                    key="coMayCon"
                                                    className="form-control "
                                                />
                                                {errors.coMayCon &&
                                                touched.coMayCon ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.coMayCon}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="soConTrai">
                                                    Trai
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="soConTrai"
                                                    key="soConTrai"
                                                    className="form-control "
                                                />
                                                {errors.soConTrai &&
                                                touched.soConTrai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soConTrai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="soConGai">
                                                    G??i
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="soConGai"
                                                    key="soConGai"
                                                    className="form-control "
                                                />
                                                {errors.soConGai &&
                                                touched.soConGai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soConGai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-3">
                                                <label htmlFor="lonNhatSinhNam">
                                                    L???n nh???t sinh n??m
                                                </label>
                                                <Field
                                                    name="lonNhatSinhNam"
                                                    key="lonNhatSinhNam"
                                                    className="form-control "
                                                />
                                                {errors.lonNhatSinhNam &&
                                                touched.lonNhatSinhNam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.lonNhatSinhNam
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="nhoNhatSinhNam">
                                                    Nh??? nh???t sinh n??m
                                                </label>
                                                <Field
                                                    name="nhoNhatSinhNam"
                                                    key="nhoNhatSinhNam"
                                                    className="form-control "
                                                />
                                                {errors.nhoNhatSinhNam &&
                                                touched.nhoNhatSinhNam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nhoNhatSinhNam
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            II.T??NH TR???NG B???NH L??
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguyenNhanSuyThan">
                                                    1.Nguy??n nh??n d???n ?????n suy
                                                    th???n m???n giai ??o???n cu???i
                                                </label>
                                                <Field
                                                    name="nguyenNhanSuyThan"
                                                    key="nguyenNhanSuyThan"
                                                    className="form-control "
                                                />
                                                {errors.nguyenNhanSuyThan &&
                                                touched.nguyenNhanSuyThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nguyenNhanSuyThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="benhSu">
                                                    2.Ch???n ??o??n v??? th???n h???c
                                                    tr?????c ????: c?? sinh thi???t th???n
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="sinhThietThan"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="sinhThietThan"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="ketQuaSinhThietThan">
                                                    K???t qu??? sinh thi???t
                                                </label>
                                                <Field
                                                    name="ketQuaSinhThietThan"
                                                    key="ketQuaSinhThietThan"
                                                    className="form-control "
                                                />
                                                {errors.ketQuaSinhThietThan &&
                                                touched.ketQuaSinhThietThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ketQuaSinhThietThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngayPhatHienSuyThan">
                                                    3.Ph??t hi???n suy th???n
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayPhatHienSuyThan"
                                                    key="ngayPhatHienSuyThan"
                                                    className="form-control "
                                                />
                                                {errors.ngayPhatHienSuyThan &&
                                                touched.ngayPhatHienSuyThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayPhatHienSuyThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngayCTNTHoacKhamThamPhanBenhLy">
                                                    Ch???y th???n nh??n t???o/Th???m ph??n
                                                    ph??c m???c t???
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayCTNTHoacKhamThamPhanBenhLy"
                                                    key="ngayCTNTHoacKhamThamPhanBenhLy"
                                                    className="form-control "
                                                />
                                                {errors.ngayCTNTHoacKhamThamPhanBenhLy &&
                                                touched.ngayCTNTHoacKhamThamPhanBenhLy ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayCTNTHoacKhamThamPhanBenhLy
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="soLanCTNTTuan">
                                                    S??? l???n ch???y th???n m???t tu???n:
                                                </label>
                                                <Field
                                                    name="soLanCTNTTuan"
                                                    key="soLanCTNTTuan"
                                                    className="form-control "
                                                />
                                                {errors.soLanCTNTTuan &&
                                                touched.soLanCTNTTuan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.soLanCTNTTuan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="CTNTVaoNgay">
                                                    V??o ng??y
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="CTNTVaoNgay"
                                                            value="1"
                                                        />{' '}
                                                        Ch???n
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="CTNTVaoNgay"
                                                            value="0"
                                                        />{' '}
                                                        L???
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="soGioTrenLan">
                                                    S??? gi??? m???t l???n
                                                </label>
                                                <Field
                                                    name="soGioTrenLan"
                                                    key="soGioTrenLan"
                                                    className="form-control "
                                                />
                                                {errors.soGioTrenLan &&
                                                touched.soGioTrenLan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.soGioTrenLan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="chuKyThamPhan">
                                                    Chu k??? th???m ph??n ph??c m???c
                                                    (s??? l???n/ng??y)
                                                </label>
                                                <Field
                                                    name="chuKyThamPhan"
                                                    key="chuKyThamPhan"
                                                    className="form-control "
                                                />
                                                {errors.chuKyThamPhan &&
                                                touched.chuKyThamPhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.chuKyThamPhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="chuKyThamPhanTaiBV">
                                                    Kh??m v?? theo d??i t???i b???nh
                                                    vi???n
                                                </label>
                                                <Field
                                                    name="chuKyThamPhanTaiBV"
                                                    key="chuKyThamPhanTaiBV"
                                                    className="form-control "
                                                />
                                                {errors.chuKyThamPhanTaiBV &&
                                                touched.chuKyThamPhanTaiBV ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.chuKyThamPhanTaiBV
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thamPhanBangMay">
                                                    Th???m ph??n ph??c m???c b???ng m??y
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="thamPhanBangMay"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="thamPhanBangMay"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="thamPhanBangMayTaiBV">
                                                    B???nh vi???n theo d??i
                                                </label>
                                                <Field
                                                    name="thamPhanBangMayTaiBV"
                                                    key="thamPhanBangMayTaiBV"
                                                    className="form-control "
                                                />
                                                {errors.thamPhanBangMayTaiBV &&
                                                touched.thamPhanBangMayTaiBV ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thamPhanBangMayTaiBV
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="benhSu">
                                                    Truy???n m??u
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="baoNhieuDonViMau">
                                                    Bao nhi??u ????n v??? m??u
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="baoNhieuDonViMau"
                                                    key="baoNhieuDonViMau"
                                                    className="form-control "
                                                />
                                                {errors.baoNhieuDonViMau &&
                                                touched.baoNhieuDonViMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.baoNhieuDonViMau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="thang">
                                                    Truy???n m??u l???n cu???i
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="v??o th??ng"
                                                    name="thang"
                                                    key="thang"
                                                    className="form-control "
                                                />
                                                {errors.thang &&
                                                touched.thang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nam">N??m</label>
                                                <Field
                                                    type="number"
                                                    name="nam"
                                                    key="nam"
                                                    className="form-control "
                                                />
                                                {errors.nam && touched.nam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nam}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="benhVienTruyenMau">
                                                    Truy???n m??u t???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="benhVienTruyenMau"
                                                    key="benhVienTruyenMau"
                                                    className="form-control "
                                                />
                                                {errors.benhVienTruyenMau &&
                                                touched.benhVienTruyenMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhVienTruyenMau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="daGhepLan1Ngay">
                                                    ???? gh??p th???n l???n 1 v??o ng??y
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="daGhepLan1Ngay"
                                                    key="daGhepLan1Ngay"
                                                    className="form-control "
                                                />
                                                {errors.daGhepLan1Ngay &&
                                                touched.daGhepLan1Ngay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.daGhepLan1Ngay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="daGhepLan1TaiBV">
                                                    T???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="daGhepLan1TaiBV"
                                                    key="daGhepLan1TaiBV"
                                                    className="form-control "
                                                />
                                                {errors.daGhepLan1TaiBV &&
                                                touched.daGhepLan1TaiBV ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.daGhepLan1TaiBV
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguoiChoThan">
                                                    Ng?????i cho th???n
                                                    (Cha/m???/anh/ch???/em?)
                                                </label>
                                                <Field
                                                    name="nguoiChoThan"
                                                    key="nguoiChoThan"
                                                    className="form-control "
                                                />
                                                {errors.nguoiChoThan &&
                                                touched.nguoiChoThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nguoiChoThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngayChayThanTroLai">
                                                    Ng??y ch???y th???n nh??n t???o tr???
                                                    l???i
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayChayThanTroLai"
                                                    key="ngayChayThanTroLai"
                                                    className="form-control "
                                                />
                                                {errors.ngayChayThanTroLai &&
                                                touched.ngayChayThanTroLai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayChayThanTroLai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="chuanDoanSuyThanGhep">
                                                    Ch???n ??o??n suy ch???c n??ng th???n
                                                    gh??p
                                                </label>
                                                <Field
                                                    name="chuanDoanSuyThanGhep"
                                                    key="chuanDoanSuyThanGhep"
                                                    className="form-control "
                                                />
                                                {errors.chuanDoanSuyThanGhep &&
                                                touched.chuanDoanSuyThanGhep ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.chuanDoanSuyThanGhep
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ctntHoacKhamThamPhan">
                                                    Ng??y ch???y th???n nh??n t???o/Th???m
                                                    ph??n ph??c m???c
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ctntHoacKhamThamPhan"
                                                    key="ctntHoacKhamThamPhan"
                                                    className="form-control "
                                                />
                                                {errors.ctntHoacKhamThamPhan &&
                                                touched.ctntHoacKhamThamPhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ctntHoacKhamThamPhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="chayThanTroLaiTaiBV">
                                                    T???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="chayThanTroLaiTaiBV"
                                                    key="chayThanTroLaiTaiBV"
                                                    className="form-control "
                                                />
                                                {errors.chayThanTroLaiTaiBV &&
                                                touched.chayThanTroLaiTaiBV ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.chayThanTroLaiTaiBV
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nuocTieu24h">
                                                    S??? l?????ng n?????c ti???u/24 gi???
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    {errors.soLuongNuocTieu24h &&
                                                    touched.soLuongNuocTieu24h ? (
                                                        <>
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.soLuongNuocTieu24h
                                                                }
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group col-md-1">
                                                <label htmlFor>
                                                    <Field
                                                        type="radio"
                                                        name="nuocTieu24h"
                                                        value="0"
                                                    />{' '}
                                                    Kh??ng
                                                </label>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label
                                                    htmlFor="nuocTieu24h"
                                                    className="mgr15"
                                                >
                                                    <Field
                                                        type="radio"
                                                        name="nuocTieu24h"
                                                        value="1"
                                                    />{' '}
                                                    C?? (ml/24h)
                                                </label>

                                                <Field
                                                    type="number"
                                                    placeholder="ml/24h"
                                                    name="soLuongNuocTieu24h"
                                                    key="soLuongNuocTieu24h"
                                                    className="form-control "
                                                />
                                            </div>

                                            <div className="form-group col-md-3">
                                                <label htmlFor="chieuCao">
                                                    Chi???u cao (cm)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="chieuCao"
                                                    key="chieuCao"
                                                    className="form-control "
                                                />

                                                {errors.chieuCao &&
                                                touched.chieuCao ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.chieuCao}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="canNang">
                                                    C??n n???ng (kg)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="canNang"
                                                    key="canNang"
                                                    className="form-control "
                                                />

                                                {errors.canNang &&
                                                touched.canNang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.canNang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="thuocDangSuDungNgay">
                                                    Thu???c ??ang s??? d???ng/ng??y
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    rows={3}
                                                    name="thuocDangSuDungNgay"
                                                    key="thuocDangSuDungNgay"
                                                    className="form-control "
                                                />

                                                {errors.thuocDangSuDungNgay &&
                                                touched.thuocDangSuDungNgay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDangSuDungNgay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="thuocTaoMau">
                                                    Thu???c t???o m??u
                                                </label>
                                                <Field
                                                    name="thuocTaoMau"
                                                    key="thuocTaoMau"
                                                    className="form-control "
                                                />

                                                {errors.thuocTaoMau &&
                                                touched.thuocTaoMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thuocTaoMau}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="bacSiDieuTri">
                                                    B??c s?? ??i???u tr???
                                                </label>
                                                <Field
                                                    name="bacSiDieuTri"
                                                    key="bacSiDieuTri"
                                                    className="form-control "
                                                />

                                                {errors.bacSiDieuTri &&
                                                touched.bacSiDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.bacSiDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="dienThoaiBacSi">
                                                    ??i???n tho???i b??c s??
                                                </label>
                                                <Field
                                                    name="dienThoaiBacSi"
                                                    key="dienThoaiBacSi"
                                                    className="form-control "
                                                />

                                                {errors.dienThoaiBacSi &&
                                                touched.dienThoaiBacSi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dienThoaiBacSi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="khongBiViemGan">
                                                4.B???nh l?? k??m theo
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox">
                                                    <Field
                                                        type="checkbox"
                                                        name="khongBiViemGan"
                                                        key="khongBiViemGan"
                                                        id="khongBiViemGan"
                                                        className="custom-control-input"
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="khongBiViemGan"
                                                    >
                                                        Kh??ng b??? vi??m gan
                                                    </label>
                                                    {errors.khongBiViemGan &&
                                                    touched.khongBiViemGan ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.khongBiViemGan
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViA"
                                                        key="viemGanSieuViA"
                                                        id="viemGanSieuViA"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViA
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViA"
                                                    >
                                                        Vi??m gan si??u vi A
                                                    </label>
                                                    {errors.viemGanSieuViA &&
                                                    touched.viemGanSieuViA ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViA
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViB"
                                                        key="viemGanSieuViB"
                                                        id="viemGanSieuViB"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViB
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViB"
                                                    >
                                                        Vi??m gan si??u vi B
                                                    </label>
                                                    {errors.viemGanSieuViB &&
                                                    touched.viemGanSieuViB ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViB
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViC"
                                                        key="viemGanSieuViC"
                                                        id="viemGanSieuViC"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViC
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViC"
                                                    >
                                                        Vi??m gan si??u vi C
                                                    </label>
                                                    {errors.viemGanSieuViC &&
                                                    touched.viemGanSieuViC ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViC
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div
                                                className="form-row col-md-6"
                                                id="truocHoacSauLocMau"
                                            >
                                                <div className="col-md-6">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="truocHoacSauLocMau"
                                                                value="1"
                                                                disabled={
                                                                    values.khongBiViemGan
                                                                }
                                                                checked={
                                                                    values.khongBiViemGan
                                                                        ? ''
                                                                        : values.truocHoacSauLocMau ===
                                                                          '1'
                                                                }
                                                            />{' '}
                                                            Vi??m gan tr?????c l???c
                                                            m??u
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label htmlFor="a">
                                                            <Field
                                                                type="radio"
                                                                name="truocHoacSauLocMau"
                                                                value="2"
                                                                disabled={
                                                                    values.khongBiViemGan
                                                                }
                                                                checked={
                                                                    values.khongBiViemGan
                                                                        ? ''
                                                                        : values.truocHoacSauLocMau ===
                                                                          '2'
                                                                }
                                                            />{' '}
                                                            Sau l???c m??u
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>{' '}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="dieuTriViemGanTu">
                                                    ??i???u tr??? vi??m gan t??? l??c n??o
                                                </label>
                                                <Field
                                                    name="dieuTriViemGanTu"
                                                    key="dieuTriViemGanTu"
                                                    className="form-control "
                                                />
                                                {errors.dieuTriViemGanTu &&
                                                touched.dieuTriViemGanTu ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dieuTriViemGanTu
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-8">
                                                <label htmlFor="thuocTriViemGan">
                                                    Thu???c ??i???u tr??? vi??m gan
                                                </label>
                                                <Field
                                                    name="thuocTriViemGan"
                                                    key="thuocTriViemGan"
                                                    className="form-control "
                                                />
                                                {errors.thuocTriViemGan &&
                                                touched.thuocTriViemGan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocTriViemGan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            key="laoPhoi"
                                                            name="laoPhoi"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng c?? ti???n c??n lao
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            key="laoPhoi"
                                                            name="laoPhoi"
                                                            value="1"
                                                        />{' '}
                                                        Lao ph???i
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laoCoQuanKhac">
                                                    Lao c??c c?? quan kh??c
                                                </label>
                                                <Field
                                                    name="laoCoQuanKhac"
                                                    key="laoCoQuanKhac"
                                                    className="form-control "
                                                />
                                                {errors.laoCoQuanKhac &&
                                                touched.laoCoQuanKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.laoCoQuanKhac
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thoiGianBiLao">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiLao"
                                                    key="thoiGianBiLao"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiLao &&
                                                touched.thoiGianBiLao ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiLao
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-8">
                                                <label htmlFor="thoiGianDieuTriAndNoiDieuTri">
                                                    Th???i gian ??i???u tr???/N??i ??i???u
                                                    tr???
                                                </label>
                                                <Field
                                                    name="thoiGianDieuTriAndNoiDieuTri"
                                                    key="thoiGianDieuTriAndNoiDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianDieuTriAndNoiDieuTri &&
                                                touched.thoiGianDieuTriAndNoiDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianDieuTriAndNoiDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daiThaoDuong">
                                                    ????i th??o ???????ng
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiDaiThaoDuong">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiDaiThaoDuong"
                                                    key="thoiGianBiDaiThaoDuong"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiDaiThaoDuong &&
                                                touched.thoiGianBiDaiThaoDuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiDaiThaoDuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuocDieuTriDaiThaoDuong">
                                                    Thu???c ??i???u tr???
                                                </label>
                                                <Field
                                                    name="thuocDieuTriDaiThaoDuong"
                                                    key="thuocDieuTriDaiThaoDuong"
                                                    className="form-control "
                                                />
                                                {errors.thuocDieuTriDaiThaoDuong &&
                                                touched.thuocDieuTriDaiThaoDuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDieuTriDaiThaoDuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="tangHuyetAp">
                                                    T??ng huy???t ??p
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiTangHuyetAp">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiTangHuyetAp"
                                                    key="thoiGianBiTangHuyetAp"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiTangHuyetAp &&
                                                touched.thoiGianBiTangHuyetAp ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiTangHuyetAp
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuocDieuTri">
                                                    Thu???c ??i???u tr???
                                                </label>
                                                <Field
                                                    name="thuocDieuTri"
                                                    key="thuocDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.thuocDieuTri &&
                                                touched.thuocDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="benhKhac">
                                                    C??c b???nh kh??c
                                                </label>
                                                <Field
                                                    name="benhKhac"
                                                    key="benhKhac"
                                                    className="form-control "
                                                />
                                                {errors.benhKhac &&
                                                touched.benhKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.benhKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrang">
                                                    T??nh h??nh hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrang"
                                                    key="tinhTrang"
                                                    className="form-control "
                                                />
                                                {errors.tinhTrang &&
                                                touched.tinhTrang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinhTrang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="coPhauThuat">
                                                5.Ti???n c??n ngo???i khoa
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daPhauThuat">
                                                    C?? ph???u thu???t g?? tr?????c ????
                                                    kh??ng
                                                </label>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ngayThangPhauThuat">
                                                    Ng??y th??ng n??m ph???u thu???t
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayThangPhauThuat"
                                                    key="ngayThangPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.ngayThangPhauThuat &&
                                                touched.ngayThangPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayThangPhauThuat
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="benhVienPhauThuat">
                                                    Ph???u thu???t t???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="benhVienPhauThuat"
                                                    key="benhVienPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.benhVienPhauThuat &&
                                                touched.benhVienPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhVienPhauThuat
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="coPhauThuat">
                                                    N???u c?? th?? do b???nh g??
                                                </label>
                                                <Field
                                                    name="coPhauThuat"
                                                    key="coPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.coPhauThuat &&
                                                touched.coPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.coPhauThuat}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangHienTai">
                                                    T??nh tr???ng hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrangHienTai"
                                                    key="tinhTrangHienTai"
                                                    className="form-control "
                                                />
                                                {errors.tinhTrangHienTai &&
                                                touched.tinhTrangHienTai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tinhTrangHienTai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="uongRuouBia">
                                                    6.Th??i quen nghi???n r?????u
                                                </label>
                                                <div className="form-row">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="uongRuouBia"
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="uongRuouBia"
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLanTuan">
                                                    S??? l???n/tu???n
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="soLanTuan"
                                                    key="soLanTuan"
                                                    className="form-control "
                                                />
                                                {errors.soLanTuan &&
                                                touched.soLanTuan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soLanTuan}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLuongLan">
                                                    S??? l?????ng tr??n l???n
                                                </label>
                                                <Field
                                                    placeholder="l??t/chai/lon/ly"
                                                    name="soLuongLan"
                                                    key="soLuongLan"
                                                    className="form-control "
                                                />
                                                {errors.soLuongLan &&
                                                touched.soLuongLan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soLuongLan}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <p />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="hutThuoc">
                                                    7.Th??i quen h??t thu???c
                                                </label>
                                                <div className="form-row">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="hutThuoc"
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="hutThuoc"
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="dieuTrenNgay">
                                                    S??? ??i???u tr??n ng??y
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="??i???u/ng??y"
                                                    name="dieuTrenNgay"
                                                    key="dieuTrenNgay"
                                                    className="form-control "
                                                />
                                                {errors.dieuTrenNgay &&
                                                touched.dieuTrenNgay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dieuTrenNgay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="BiBenhThan">
                                                8.Ti???n c??n gia ????nh
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="biBenhThan">
                                                    B???nh th???n
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhThan"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhThan"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhLao">
                                                    B???nh lao
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhLao"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhLao"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biDaiThaoDuong">
                                                    ????i th??o ???????ng
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biDaiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biDaiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biTangHuyetAp">
                                                    T??ng huy???t ??p
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biTangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biTangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biUngThu">
                                                    Ung th??
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biUngThu"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biUngThu"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="biBenhKhac">
                                                    B???nh kh??c
                                                </label>
                                                <Field
                                                    name="biBenhKhac"
                                                    key="biBenhKhac"
                                                    className="form-control "
                                                />

                                                {errors.biBenhKhac &&
                                                touched.biBenhKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.biBenhKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        S???ng c??ng ?????a ch???{' '}
                                                        <Field
                                                            type="radio"
                                                            name="songCungDiaChi"
                                                            value="1"
                                                        />
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        Kh??ng c??ng ?????a ch???{' '}
                                                        <Field
                                                            type="radio"
                                                            name="songCungDiaChi"
                                                            value="0"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="nguoiThanBiBenh">
                                                    N???u c?? th?? l?? ai
                                                </label>
                                                <Field
                                                    name="nguoiThanBiBenh"
                                                    key="nguoiThanBiBenh"
                                                    className="form-control "
                                                />

                                                {errors.nguoiThanBiBenh &&
                                                touched.nguoiThanBiBenh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nguoiThanBiBenh
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangBenhNguoiThanHienTai">
                                                    T??nh tr???ng hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrangBenhNguoiThanHienTai"
                                                    key="tinhTrangBenhNguoiThanHienTai"
                                                    className="form-control "
                                                />

                                                {errors.tinhTrangBenhNguoiThanHienTai &&
                                                touched.tinhTrangBenhNguoiThanHienTai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tinhTrangBenhNguoiThanHienTai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="NhiemCovid">
                                                9. Ti???n s??? covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox">
                                                    <Field
                                                        type="checkbox"
                                                        name="NhiemCovid"
                                                        key="NhiemCovid"
                                                        id="NhiemCovid"
                                                        className="custom-control-input"
                                                        onClick={() =>
                                                            KhongBiNhiemCheck()
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="NhiemCovid"
                                                    >
                                                        Kh??ng b??? nhi???m covid
                                                    </label>
                                                    {errors.NhiemCovid &&
                                                    touched.NhiemCovid ? (
                                                        <div className="invalid-feedback">
                                                            {errors.NhiemCovid}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="BiTruocTiem"
                                                        key="BiTruocTiem"
                                                        id="BiTruocTiem"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.BiTruocTiem
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="BiTruocTiem"
                                                    >
                                                        B??? nhi???m tr?????c ti??m
                                                    </label>
                                                    {errors.BiTruocTiem &&
                                                    touched.BiTruocTiem ? (
                                                        <div className="invalid-feedback">
                                                            {errors.BiTruocTiem}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="BiSauTiem"
                                                        key="BiSauTiem"
                                                        id="BiSauTiem"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.BiSauTiem
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="BiSauTiem"
                                                    >
                                                        B??? nhi???m sau ti??m
                                                    </label>
                                                    {errors.BiSauTiem &&
                                                    touched.BiSauTiem ? (
                                                        <div className="invalid-feedback">
                                                            {errors.BiSauTiem}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="CoTrieuChung"
                                                        key="CoTrieuChung"
                                                        id="CoTrieuChung"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.CoTrieuChung
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="CoTrieuChung"
                                                    >
                                                        Kh??ng c?? tri???u ch???ng
                                                    </label>
                                                    {errors.CoTrieuChung &&
                                                    touched.CoTrieuChung ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.CoTrieuChung
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="TrieuChungNhe"
                                                        key="TrieuChungNhe"
                                                        id="TrieuChungNhe"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.TrieuChungNhe
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="TrieuChungNhe"
                                                    >
                                                        Tri???u ch???ng nh???
                                                    </label>
                                                    {errors.TrieuChungNhe &&
                                                    touched.TrieuChungNhe ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TrieuChungNhe
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="TrieuChungtrungBinh"
                                                        key="TrieuChungtrungBinh"
                                                        id="TrieuChungtrungBinh"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.TrieuChungtrungBinh
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="TrieuChungtrungBinh"
                                                    >
                                                        Tri???u ch??ng trung b??nh
                                                    </label>
                                                    {errors.TrieuChungtrungBinh &&
                                                    touched.TrieuChungtrungBinh ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TrieuChungtrungBinh
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="NhapVien"
                                                        key="NhapVien"
                                                        id="NhapVien"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.NhapVien
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="NhapVien"
                                                    >
                                                        Nh???p vi???n
                                                    </label>
                                                    {errors.NhapVien &&
                                                    touched.NhapVien ? (
                                                        <div className="invalid-feedback">
                                                            {errors.NhapVien}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <label htmlFor="ThoiGianNamVien">
                                                    Th???i gian n???m vi???n(ng??y)
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="ThoiGianNamVien"
                                                    key="ThoiGianNamVien"
                                                    className="form-control "
                                                />

                                                {errors.ThoiGianNamVien &&
                                                touched.ThoiGianNamVien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ThoiGianNamVien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ThoMay"
                                                        key="ThoMay"
                                                        id="ThoMay"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.ThoMay
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ThoMay"
                                                    >
                                                        Th??? m??y
                                                    </label>
                                                    {errors.ThoMay &&
                                                    touched.ThoMay ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ThoMay}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ThoHFNC"
                                                        key="ThoHFNC"
                                                        id="ThoHFNC"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.ThoHFNC
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ThoHFNC"
                                                    >
                                                        Th??? HFNC
                                                    </label>
                                                    {errors.ThoHFNC &&
                                                    touched.ThoHFNC ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ThoHFNC}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="khongBiViemGan">
                                                10. Ti??m vaccine ng???a covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine">
                                                    Ti??m vaccine ng???a covid m??i
                                                    1
                                                </label>
                                                <Field
                                                    name="TiemVaccine"
                                                    key="TiemVaccine"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine &&
                                                touched.TiemVaccine ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.TiemVaccine}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui1">
                                                    Ng??y ti??m m??i 1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui1"
                                                    key="NgayTiemMui1"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui1 &&
                                                touched.NgayTiemMui1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng">
                                                    Ph???n ???ng sau ti??m m??i 1
                                                </label>
                                                <Field
                                                    name="PhanUng"
                                                    key="PhanUng"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng &&
                                                touched.PhanUng ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine2">
                                                    Ti??m vaccine ng???a covid m??i
                                                    2
                                                </label>
                                                <Field
                                                    name="TiemVaccine2"
                                                    key="TiemVaccine2"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine2 &&
                                                touched.TiemVaccine2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TiemVaccine2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui2">
                                                    Ng??y ti??m m??i 2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui2"
                                                    key="NgayTiemMui2"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui2 &&
                                                touched.NgayTiemMui2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng2">
                                                    Ph???n ???ng sau ti??m m??i 2
                                                </label>
                                                <Field
                                                    name="PhanUng2"
                                                    key="PhanUng2"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng2 &&
                                                touched.PhanUng2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng2}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine3">
                                                    Ti??m vaccine ng???a covid m??i
                                                    3
                                                </label>
                                                <Field
                                                    name="TiemVaccine3"
                                                    key="TiemVaccine3"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine3 &&
                                                touched.TiemVaccine3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TiemVaccine3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui3">
                                                    Ng??y ti??m m??i 3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui3"
                                                    key="NgayTiemMui3"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui3 &&
                                                touched.NgayTiemMui3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng3">
                                                    Ph???n ???ng sau ti??m m??i 3
                                                </label>
                                                <Field
                                                    name="PhanUng3"
                                                    key="PhanUng3"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng3 &&
                                                touched.PhanUng3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng3}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            III. KINH T???:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapBenhNhan">
                                                    Thu nh???p c???a b???nh nh??n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapBenhNhan"
                                                    key="thuNhapBenhNhan"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapBenhNhan &&
                                                touched.thuNhapBenhNhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuNhapBenhNhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapVoChongBenhNhan">
                                                    Thu nh???p c???a V??? ho???c Ch???ng
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapVoChongBenhNhan"
                                                    key="thuNhapVoChongBenhNhan"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapVoChongBenhNhan &&
                                                touched.thuNhapVoChongBenhNhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuNhapVoChongBenhNhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNghiepVoChong">
                                                    Ngh??? nghi???p
                                                </label>
                                                <Field
                                                    name="ngheNghiepVoChong"
                                                    key="ngheNghiepVoChong"
                                                    className="form-control "
                                                />
                                                {errors.ngheNghiepVoChong &&
                                                touched.ngheNghiepVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngheNghiepVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapKhac">
                                                    Thu nh???p kh??c
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapKhac"
                                                    key="thuNhapKhac"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapKhac &&
                                                touched.thuNhapKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thuNhapKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tienChuanBiChoViecGhepThan">
                                                    Ti???n chu???n b??? cho vi???c gh??p
                                                    th???n (c?? s???n)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="tienChuanBiChoViecGhepThan"
                                                    key="tienChuanBiChoViecGhepThan"
                                                    className="form-control "
                                                />

                                                {errors.tienChuanBiChoViecGhepThan &&
                                                touched.tienChuanBiChoViecGhepThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tienChuanBiChoViecGhepThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            IV. L?? DO ????NG K?? CH??? GH??P TH???N T???
                                            NG?????I HI???N CH???T N??O:
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox">
                                                <Field
                                                    type="checkbox"
                                                    name="khongCoNguoiNhan"
                                                    key="khongCoNguoiNhan"
                                                    id="khongCoNguoiNhan"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="khongCoNguoiNhan"
                                                >
                                                    Kh??ng c?? ng?????i hi???n th???n
                                                </label>
                                                {errors.khongCoNguoiNhan &&
                                                touched.khongCoNguoiNhan ? (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.khongCoNguoiNhan
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox ">
                                                <Field
                                                    type="checkbox"
                                                    name="nguoiChoBiBenh"
                                                    key="nguoiChoBiBenh"
                                                    id="nguoiChoBiBenh"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="nguoiChoBiBenh"
                                                >
                                                    Ng?????i hi???n b??? b???nh
                                                </label>
                                                {errors.nguoiChoBiBenh &&
                                                touched.nguoiChoBiBenh ? (
                                                    <div className="invalid-feedback">
                                                        {errors.nguoiChoBiBenh}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox ">
                                                <Field
                                                    type="checkbox"
                                                    name="nguoiChoKhongHoaHopMau"
                                                    key="nguoiChoKhongHoaHopMau"
                                                    id="nguoiChoKhongHoaHopMau"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="nguoiChoKhongHoaHopMau"
                                                >
                                                    Ng?????i hi???n kh??ng h??a h???p
                                                    nh??m m??u
                                                </label>
                                                {errors.nguoiChoKhongHoaHopMau &&
                                                touched.nguoiChoKhongHoaHopMau ? (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.nguoiChoKhongHoaHopMau
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label htmlFor="lyDoKhac">
                                                L?? do kh??c
                                            </label>
                                            <Field
                                                name="lyDoKhac"
                                                key="lyDoKhac"
                                                className="form-control "
                                            />
                                            {errors.lyDoKhac &&
                                            touched.lyDoKhac ? (
                                                <div className="invalid-feedback">
                                                    {errors.lyDoKhac}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            V. QUAN H??? GIA ????NH:
                                        </div>
                                        <RenderEditQuanHeGiaDinh
                                            lstQhgd={entityObj.QhGd}
                                        />

                                        {/* {RenderEditQuanHeGiaDinh()} */}
                                    </div>
                                    <div className="col-md-12 no-padding camket">
                                        <div className="solama">
                                            VI. CAM K???T ????NG K?? CH??? GH??P TH???N T???
                                            NG?????I HI???N CH???T N??O HAY TIM NG???NG
                                            ?????P
                                        </div>
                                        <div className="form-group col-md-12">
                                            <span>
                                                Hi???n t??i b??? b???nh suy th???n m???n
                                                giai ??o???n cu???i ??ang ph???i l???c m??u
                                                ?????nh k???, c?? ch??? ?????nh gh??p th???n.
                                                T??i ???? ???????c c??c b??c s?? ph??? tr??ch
                                                gi???i th??ch r?? v??? c??c b?????c th???c
                                                hi???n ????nh gi?? t??nh tr???ng s???c
                                                kh???e chung, th???c hi???n qu?? tr??nh
                                                tuy???n ch???n, th???i gian ch??? ?????i,
                                                t??c d???ng ph??? c???a thu???c ???c ch???
                                                mi???n d???ch ??i???u tr??? sau gh??p
                                                th???n, chi ph?? gh??p th???n, chu???n
                                                b??? m??i tr?????ng v?? c??ch sinh ho???t
                                                sau khi ???????c gh??p th???n???.. T??i
                                                xin ???????c ????ng k?? v??o danh s??ch
                                                ch??? gh??p th???n t??? ng?????i hi???n ch???t
                                                n??o hay tim ng???ng ?????p t???i B???nh
                                                vi???n Ch??? R???y, t??i cam k???t tu??n
                                                th??? c??c quy ?????nh trong qu?? tr??nh
                                                ??i???u tr??? b???nh tr?????c v?? sau gh??p
                                                th???n.
                                            </span>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                    <div className="center mgb15 mgt15">
                        {/* <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            ????ng
                        </Button> */}
                        <Button
                            className="btn-lg"
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Ho??n th??nh
                        </Button>
                    </div>
                </Col>
            </Row>
        );
    }

    function EditModalKhac() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.Tinh === null ? '' : entityObj.Tinh,
            quanhuyen: entityObj.QuanHuyen === null ? '' : entityObj.QuanHuyen,
            tinhtt: entityObj.Tinhtt === null ? '' : entityObj.Tinhtt,
            quanhuyentt:
                entityObj.QuanHuyentt === null ? '' : entityObj.QuanHuyentt
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
            } else if (name === 'tinhtt') {
                setloaddiachi({...loaddiachi, tinhtt: value, quanhuyentt: ''});
            } else if (name === 'quanhuyentt') {
                setloaddiachi({...loaddiachi, quanhuyentt: value});
            }
        }
        return (
            <Row>
                <Col>
                    <div className="">
                        <div className="Title-Login-Register center">
                            C???p nh???t ????ng k?? ch??? gh??p {typeModal}
                        </div>
                    </div>

                    <Row>
                        <Formik
                            enableReinitialize
                            innerRef={formRef}
                            initialValues={{
                                id: entityObj.Id,
                                typePhieuDKGhepTang:
                                    entityObj.TypePhieuDKGhepTang,
                                hoTenBN: entityObj.HoTenBN,
                                tinh: entityObj.Tinh,
                                xaphuong: entityObj.XaPhuong,
                                quanhuyen: entityObj.QuanHuyen,
                                tinhtt: entityObj.Tinhtt,
                                xaphuongtt: entityObj.XaPhuongtt,
                                quanhuyentt: entityObj.QuanHuyentt,
                                gioiTinh: String(entityObj.GioiTinh),
                                ngaySinh: CommonUtility.GetDateSetField(
                                    entityObj.NgaySinh
                                ),
                                nhomMau: entityObj.NhomMau,
                                nhomMau1: entityObj.NhomMau1,
                                baoHiemYTe: entityObj.BaoHiemYTe,
                                CMNDBN: entityObj.CMNDBN,
                                NgayCapCMNDBN: CommonUtility.GetDateSetField(
                                    entityObj.NgayCapCMNDBN
                                ),
                                NoiCapCMNDBN: entityObj.NoiCapCMNDBN,
                                ngheNghiep: entityObj.NgheNghiep,
                                ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                                trinhDoVanHoa: entityObj.TrinhDoVanHoa,
                                dienThoai: entityObj.DienThoai,
                                dienThoai1: entityObj.DienThoai1,
                                diaChiThuongChu: entityObj.DiaChiThuongChu,
                                diaChiTamChu: entityObj.DiaChiTamChu,
                                laConThuMay: entityObj.LaConThuMay,
                                tinhTrangHonNhan: String(
                                    entityObj.TinhTrangHonNhan
                                ),
                                hoTenVoChong: entityObj.HoTenVoChong,
                                dienThoaiVoChong: entityObj.DienThoaiVoChong,
                                coMayCon: entityObj.CoMayCon,
                                soConTrai: entityObj.SoConTrai,
                                soConGai: entityObj.SoConGai,
                                lonNhatSinhNam: entityObj.LonNhatSinhNam,
                                nhoNhatSinhNam: entityObj.NhoNhatSinhNam,
                                // tienCanGiaDinh: entityObj.TienCanGiaDinh,
                                // tienCanBanThan: entityObj.TienCanBanThan,
                                nguyenNhanSuyThan: entityObj.NguyenNhanSuyThan,
                                // chuanDoanSuyThanGhep:
                                //     entityObj.chuanDoanSuyThanGhep,
                                benhSu: entityObj.BenhSu,
                                thuocTriViemGan: entityObj.ThuocTriViemGan,
                                // sinhThietThan: String(entityObj.SinhThietThan),
                                // ketQuaSinhThietThan:
                                //     entityObj.KetQuaSinhThietThan,
                                ngayPhatHienSuyThan: CommonUtility.GetDateSetField(
                                    entityObj.NgayPhatHienSuyThan
                                ),
                                // ngayCTNTHoacKhamThamPhanBenhLy: CommonUtility.GetDateSetField(
                                //     entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                // ),
                                dieuTriViemGanTu: entityObj.DieuTriViemGanTu,
                                // CTNTVaoNgay: String(entityObj.CTNTVaoNgay),
                                // soGioTrenLan: entityObj.SoGioTrenLan,
                                // soLanCTNTTuan: entityObj.SoLanCTNTTuan,
                                // chuKyThamPhan: entityObj.ChuKyThamPhan,
                                // chuKyThamPhanTaiBV:
                                //     entityObj.ChuKyThamPhanTaiBV,
                                // thamPhanBangMay: String(
                                //     entityObj.ThamPhanBangMay
                                // ),
                                // thamPhanBangMayTaiBV:
                                //     entityObj.ThamPhanBangMayTaiBV,
                                truyenMau: String(entityObj.TruyenMau),
                                baoNhieuDonViMau: entityObj.BaoNhieuDonViMau,
                                thang:
                                    entityObj.Thang !== null
                                        ? entityObj.Thang
                                        : '',
                                nam:
                                    entityObj.Nam !== null ? entityObj.Nam : '',
                                benhVienTruyenMau: entityObj.BenhVienTruyenMau,
                                // daGhepLan1Ngay: CommonUtility.GetDateSetField(
                                //     entityObj.DaGhepLan1Ngay
                                // ),
                                // daGhepLan1TaiBV: entityObj.DaGhepLan1TaiBV,
                                // nguoiChoThan: entityObj.NguoiChoThan,
                                // ngayChayThanTroLai: CommonUtility.GetDateSetField(
                                //     entityObj.NgayChayThanTroLai
                                // ),
                                // chayThanTroLaiTaiBV:
                                //     entityObj.ChayThanTroLaiTaiBV,
                                // ctntHoacKhamThamPhan: CommonUtility.GetDateSetField(
                                //     entityObj.CTNTHoacKhamThamPhan
                                // ),
                                // ctntVaoNgayThuMay: entityObj.CTNTVaoNgayThuMay,
                                // caCTNT: entityObj.CaCTNT,
                                chieuCao: entityObj.ChieuCao,
                                canNang: entityObj.CanNang,
                                // nuocTieu24h: String(entityObj.NuocTieu24h),
                                // soLuongNuocTieu24h:
                                //     entityObj.SoLuongNuocTieu24h,
                                thuocDangSuDungNgay:
                                    entityObj.ThuocDangSuDungNgay,
                                thoiGianBiTangHuyetAp: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiTangHuyetAp
                                ),
                                thuocTaoMau: entityObj.ThuocTaoMau,
                                bacSiDieuTri: entityObj.BacSiDieuTri,
                                dienThoaiBacSi: entityObj.DienThoaiBacSi,
                                khongBiViemGan: entityObj.KhongBiViemGan,
                                viemGanSieuViA: entityObj.ViemGanSieuViA,
                                viemGanSieuViB: entityObj.ViemGanSieuViB,
                                viemGanSieuViC: entityObj.ViemGanSieuViC,
                                truocHoacSauLocMau: String(
                                    entityObj.TruocHoacSauLocMau
                                ),
                                tangHuyetAp: String(entityObj.TangHuyetAp),
                                daiThaoDuong: String(entityObj.DaiThaoDuong),
                                thoiGianBiDaiThaoDuong: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiDaiThaoDuong
                                ),
                                thuocDieuTriDaiThaoDuong:
                                    entityObj.ThuocDieuTriDaiThaoDuong,
                                tinhTrang: entityObj.TinhTrang,
                                laoPhoi: String(entityObj.LaoPhoi),
                                hutThuoc: String(entityObj.HutThuoc),
                                dieuTrenNgay:
                                    entityObj.DieuTrenNgay !== null
                                        ? entityObj.DieuTrenNgay
                                        : '',
                                uongRuouBia: String(entityObj.UongRuouBia),
                                soLanTuan:
                                    entityObj.SoLanTuan !== null
                                        ? entityObj.SoLanTuan
                                        : '',
                                soLuongLan: entityObj.SoLuongLan,
                                benhKhac: entityObj.BenhKhac,
                                laoCoQuanKhac: entityObj.LaoCoQuanKhac,
                                thoiGianBiLao: CommonUtility.GetDateSetField(
                                    entityObj.ThoiGianBiLao
                                ),
                                thoiGianDieuTriAndNoiDieuTri:
                                    entityObj.ThoiGianDieuTriAndNoiDieuTri,
                                // namPhatHien: entityObj.NamPhatHien,
                                // dieuTriTaiBV: entityObj.DieuTriTaiBV,
                                thoiGianDieuTri: entityObj.ThoiGianDieuTri,
                                thuocDieuTri: entityObj.ThuocDieuTri,
                                daPhauThuat: String(entityObj.DaPhauThuat),
                                coPhauThuat: entityObj.CoPhauThuat,
                                tinhTrangHienTai: entityObj.TinhTrangHienTai,
                                ngayThangPhauThuat: CommonUtility.GetDateSetField(
                                    entityObj.NgayThangPhauThuat
                                ),
                                benhVienPhauThuat: entityObj.BenhVienPhauThuat,
                                biBenhThan: String(entityObj.BiBenhThan),
                                biBenhLao: String(entityObj.BiBenhLao),
                                biDaiThaoDuong: String(
                                    entityObj.BiDaiThaoDuong
                                ),
                                biTangHuyetAp: String(entityObj.BiTangHuyetAp),
                                biUngThu: String(entityObj.BiUngThu),
                                songCungDiaChi: String(
                                    entityObj.SongCungDiaChi
                                ),
                                biBenhKhac: entityObj.BiBenhKhac,
                                nguoiThanBiBenh: entityObj.NguoiThanBiBenh,
                                thuNhapBenhNhan: entityObj.ThuNhapBenhNhan,
                                tinhTrangBenhNguoiThanHienTai:
                                    entityObj.TinhTrangBenhNguoiThanHienTai,
                                thuNhapVoChongBenhNhan:
                                    entityObj.ThuNhapVoChongBenhNhan,
                                ngheNghiepVoChong: entityObj.NgheNghiepVoChong,
                                thuNhapKhac: entityObj.ThuNhapKhac,
                                tienChuanBiChoViecGhepThan:
                                    entityObj.TienChuanBiChoViecGhepThan,
                                khongCoNguoiNhan: entityObj.KhongCoNguoiNhan,
                                nguoiChoBiBenh: entityObj.NguoiChoBiBenh,
                                nguoiChoKhongHoaHopMau:
                                    entityObj.NguoiChoKhongHoaHopMau,
                                lyDoKhac: entityObj.LyDoKhac,
                                choGhepBVDieuTri: entityObj.ChoGhepBVDieuTri,
                                choGhepBenh: entityObj.ChoGhepBenh,
                                email: entityObj.Email,
                                NhiemCovid: entityObj.NhiemCovid,
                                BiTruocTiem: entityObj.BiTruocTiem,
                                BiSauTiem: entityObj.BiSauTiem,
                                CoTrieuChung: entityObj.CoTrieuChung,
                                TrieuChungNhe: entityObj.TrieuChungNhe,
                                TrieuChungtrungBinh:
                                    entityObj.TrieuChungtrungBinh,
                                NhapVien: entityObj.NhapVien,
                                ThoiGianNamVien: entityObj.ThoiGianNamVien,
                                ThoMay: entityObj.ThoMay,
                                ThoHFNC: entityObj.ThoHFNC,
                                TiemVaccine: entityObj.TiemVaccine,
                                NgayTiemMui1: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui1
                                ),
                                NgayTiemMui2: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui2
                                ),
                                PhanUng: entityObj.PhanUng,
                                TiemVaccine2: entityObj.TiemVaccine2,
                                PhanUng2: entityObj.PhanUng2,
                                NgayTiemMui3: CommonUtility.GetDateSetField(
                                    entityObj.NgayTiemMui3
                                ),
                                TiemVaccine3: entityObj.TiemVaccine3,
                                PhanUng3: entityObj.PhanUng3
                            }}
                            validationSchema={SignupSchemaTangKhac}
                            onSubmit={(values) => {
                                // sua gia tri 3 checkbox viem gan sieu vi A B C
                                const values1 = values;
                                let CMNDtruoc = false;
                                let CMNDsau = false;
                                if (values.khongBiViemGan) {
                                    values1.viemGanSieuViA = false;
                                    values1.viemGanSieuViB = false;
                                    values1.viemGanSieuViC = false;
                                    values1.truocHoacSauLocMau = 0;
                                }

                                const qhgd = dataGiaDinhEdit.current
                                    ? dataGiaDinhEdit.current
                                    : [];
                                const ObjSave = {
                                    dangKyChoGhepThanEditVM: {
                                        ...values1,
                                        Avatar: entityObj.Avatar,
                                        typePhieuDKGhepTang:
                                            entityObj.TypePhieuDKGhepTang,
                                        ImgCMNDBNMatTruoc:
                                            entityObj.ImgCMNDBNMatTruoc,
                                        ImgCMNDBNMatSau:
                                            entityObj.ImgCMNDBNMatSau
                                    },
                                    quanHeGiaDinhEditVMs: qhgd
                                };
                                if (
                                    FileSelected !== undefined &&
                                    FileSelected.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgAvatar = FileSelected;
                                }

                                if (
                                    FileSelectedCMNDMT !== undefined &&
                                    FileSelectedCMNDMT.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgCMND1 = FileSelectedCMNDMT;
                                    CMNDtruoc = true;
                                }

                                if (
                                    FileSelectedCMNDMs !== undefined &&
                                    FileSelectedCMNDMs.data
                                ) {
                                    ObjSave.dangKyChoGhepThanEditVM.imgCMND2 = FileSelectedCMNDMs;
                                    CMNDsau = true;
                                }
                                setisload(true);
                                dangKyChoGhepTangService
                                    .EditNewEntityUser(ObjSave)
                                    .then((itemdata) => {
                                        if (itemdata.Status === true) {
                                            toast.success(
                                                'C???p nh???t ????ng k?? hi???n t???ng th??nh c??ng'
                                            );
                                            history.push(
                                                `/ChiTietDKChoGhepTang/${entityObj.Id}`
                                            );
                                        } else {
                                            toast.error(itemdata.MessageError);
                                        }
                                        setisload(false);
                                    });
                            }}
                        >
                            {({errors, touched, values, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="id" key="id" />
                                    <Field
                                        type="hidden"
                                        name="typePhieuDKGhepTang"
                                        key="TypePhieuDKGhepTang"
                                    />
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            I. H??NH CH??NH:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="hoTenBN">
                                                    H??? v?? t??n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="hoTenBN"
                                                    key="hoTenBN"
                                                    className="form-control "
                                                />
                                                {errors.hoTenBN &&
                                                touched.hoTenBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.hoTenBN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="gioiTinh">
                                                    Gi???i t??nh
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="gioiTinh"
                                                            value="1"
                                                        />{' '}
                                                        Nam
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="gioiTinh"
                                                            value="0"
                                                        />{' '}
                                                        N???
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ImageSrc"
                                                    key="ImageSrc"
                                                    className="form-control img-padding"
                                                    onChange={ChangeFileUpload}
                                                />
                                                {errors.ImageSrc &&
                                                touched.ImageSrc ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ImageSrc}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh th??? c??
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className="imgHinhAnhAccount"
                                                            src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                            alt=""
                                                            onError={
                                                                NotFoundUserImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    ???nh th??? m???i
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            id="Avatar"
                                                            alt=""
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="ngaySinh">
                                                    Ng??y sinh
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngaySinh"
                                                    key="ngaySinh"
                                                    className="form-control "
                                                />
                                                {errors.ngaySinh &&
                                                touched.ngaySinh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ngaySinh}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-2">
                                                <label htmlFor="nhomMau">
                                                    Nh??m m??u ABO
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nhomMau"
                                                    key="nhomMau"
                                                    defaultValue={
                                                        entityObj.NhomMau
                                                    }
                                                    className="form-control "
                                                >
                                                    <option>--Ch???n--</option>
                                                    {/* {RenderDropdownDanhMuc({
                                                        code: 'nhommau'
                                                    })} */}
                                                    <DropDMNhomMau />
                                                </Field>

                                                {errors.nhomMau &&
                                                touched.nhomMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nhomMau}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nhomMau1">
                                                    Nh??m m??u Rh
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="nhomMau1"
                                                    key="nhomMau1"
                                                    defaultValue={
                                                        entityObj.NhomMau1
                                                    }
                                                    className="form-control "
                                                >
                                                    <option>--Ch???n--</option>
                                                    {/* <option value="A">A</option>
                                                <option value="AB">AB</option>
                                                <option value="B">B</option>
                                                <option value="O">O</option> */}
                                                    {/* <RenderDropdownDanhMuc code="nhommau" /> */}
                                                    {/* {RenderDropdownDanhMuc({
                                                        code: 'nhommau'
                                                    })} */}
                                                    <DropDMNhomMauRh />
                                                </Field>

                                                {errors.nhomMau1 &&
                                                touched.nhomMau1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nhomMau1}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="baoHiemYTe">
                                                    B???o hi???m y t???
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="baoHiemYTe"
                                                    key="baoHiemYTe"
                                                    className="form-control "
                                                />
                                                {errors.baoHiemYTe &&
                                                touched.baoHiemYTe ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.baoHiemYTe}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="CMNDBN">
                                                    CMND/ CCCD/ h??? chi???u
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="CMNDBN"
                                                    key="CMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.CMNDBN &&
                                                touched.CMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.CMNDBN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayCapCMNDBN">
                                                    Ng??y c???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayCapCMNDBN"
                                                    key="NgayCapCMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.NgayCapCMNDBN &&
                                                touched.NgayCapCMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayCapCMNDBN
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NoiCapCMNDBN">
                                                    N??i c???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="NoiCapCMNDBN"
                                                    key="NoiCapCMNDBN"
                                                    className="form-control "
                                                />
                                                {errors.NoiCapCMNDBN &&
                                                touched.NoiCapCMNDBN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NoiCapCMNDBN
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ImgCMNDBNMatTruoc">
                                                    ???nh CMND / CCCD / h??? chi???u
                                                    m???t tr?????c
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ImgCMNDBNMatTruoc"
                                                    key="ImgCMNDBNMatTruoc"
                                                    className="form-control "
                                                    onChange={
                                                        ChangeFileUploadCMNDMT
                                                    }
                                                />
                                                {errors.ImgCMNDBNMatTruoc &&
                                                touched.ImgCMNDBNMatTruoc ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ImgCMNDBNMatTruoc
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>

                                                <Field
                                                    type="file"
                                                    name="ImgCMNDBNMatSau"
                                                    key="ImgCMNDBNMatSau"
                                                    className="form-control  img-padding"
                                                    onChange={
                                                        ChangeFileUploadCMNDMs
                                                    }
                                                />
                                                {errors.ImgCMNDBNMatSau &&
                                                touched.ImgCMNDBNMatSau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ImgCMNDBNMatSau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t tr?????c c??
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className=" imgCMND"
                                                            src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatTruoc}`}
                                                            alt=""
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t tr?????c m???i
                                                </label>
                                                <div>
                                                    <>
                                                        <img
                                                            className=" imgCMND"
                                                            id="ImgCMNDBNMatTruoc"
                                                            alt=""
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                        />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau c??
                                                </label>
                                                <div>
                                                    <img
                                                        className=" imgCMND"
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDBNMatSau}`}
                                                        alt=""
                                                        onError={NotFoundImage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ImgCMNDBNMatSau">
                                                    ???nh CMND/CCCD m???t sau m???i
                                                </label>
                                                <div>
                                                    <img
                                                        className=" imgCMND"
                                                        id="ImgCMNDBNMatSau"
                                                        alt=""
                                                        onError={NotFoundImage}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNghiep">
                                                    Ngh??? Nghi???p
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="ngheNghiep"
                                                    key="ngheNghiep"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    <DropDMNgheNghiep />
                                                </Field>

                                                {errors.ngheNghiep &&
                                                touched.ngheNghiep ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ngheNghiep}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNhiepBoSung">
                                                    Ngh??? Nghi???p ghi r??
                                                </label>
                                                <Field
                                                    name="ngheNhiepBoSung"
                                                    key="ngheNhiepBoSung"
                                                    className="form-control "
                                                />
                                                {errors.ngheNhiepBoSung &&
                                                touched.ngheNhiepBoSung ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngheNhiepBoSung
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="trinhDoVanHoa">
                                                    Tr??nh ????? v??n h??a
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="V?? d??? h???c h???t l???p 10 c???a h??? 12 th?? nh???p: 10/12"
                                                    name="trinhDoVanHoa"
                                                    key="trinhDoVanHoa"
                                                    className="form-control "
                                                />
                                                {errors.trinhDoVanHoa &&
                                                touched.trinhDoVanHoa ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.trinhDoVanHoa
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="dienThoai">
                                                    ??i???n tho???i
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="dienThoai"
                                                    key="dienThoai"
                                                    className="form-control "
                                                />
                                                {errors.dienThoai &&
                                                touched.dienThoai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.dienThoai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="dienThoai1">
                                                    ??i???n tho???i kh??c
                                                </label>
                                                <Field
                                                    name="dienThoai1"
                                                    key="dienThoai1"
                                                    className="form-control "
                                                />
                                                {errors.dienThoai1 &&
                                                touched.dienThoai1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.dienThoai1}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="email">
                                                    Email
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="email"
                                                    key="email"
                                                    className="form-control "
                                                />
                                                {errors.email &&
                                                touched.email ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.email}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-row">
                                            <label htmlFor="diaChi">
                                                ?????a Ch??? Th?????ng Tr?? :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinh"
                                                    className="chitietdiachi"
                                                >
                                                    T???nh/Th??nh Ph???
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="tinh"
                                                    key="tinh"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'tinh',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'tinh',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyen',
                                                            ''
                                                        );
                                                        setFieldValue(
                                                            'xaphuong',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {RenderDropdownTinh({
                                                        code: 'tinh'
                                                    })}
                                                </Field>
                                                {errors.tinh && touched.tinh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinh}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="quanhuyen"
                                                    className="chitietdiachi"
                                                >
                                                    Qu???n/Huy???n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="quanhuyen"
                                                    key="quanhuyen"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'quanhuyen',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyen',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'xaphuong',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.tinh !== '' ? (
                                                        <RenderDropdownQuanhuyen
                                                            code="quanhuyen"
                                                            data={
                                                                loaddiachi.tinh
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.quanhuyen &&
                                                touched.quanhuyen ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.quanhuyen}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="xaphuong"
                                                    className="chitietdiachi"
                                                >
                                                    X??/Ph?????ng
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuong"
                                                    key="xaphuong"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.quanhuyen !==
                                                    '' ? (
                                                        <RenderDropdownXaphuong
                                                            code="xaphuong"
                                                            data={
                                                                loaddiachi.quanhuyen
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.xaphuong &&
                                                touched.xaphuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.xaphuong}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label
                                                htmlFor="diaChiThuongChu"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="diaChiThuongChu"
                                                key="diaChiThuongChu"
                                                className="form-control "
                                            />
                                            {errors.diaChiThuongChu &&
                                            touched.diaChiThuongChu ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diaChiThuongChu}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <br />
                                        <div className="form-row">
                                            <label htmlFor="diaChiTamChu">
                                                ?????a Ch??? T???m Tr?? :
                                            </label>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinhtt"
                                                    className="chitietdiachi"
                                                >
                                                    T???nh/Th??nh Ph???
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="tinhtt"
                                                    key="tinhtt"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'tinhtt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'tinhtt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyentt',
                                                            ''
                                                        );
                                                        setFieldValue(
                                                            'xaphuongtt',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {RenderDropdownTinh({
                                                        code: 'tinh'
                                                    })}
                                                </Field>
                                                {errors.tinhtt &&
                                                touched.tinhtt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinhtt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="quanhuyentt"
                                                    className="chitietdiachi"
                                                >
                                                    Qu???n/Huy???n
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="quanhuyentt"
                                                    key="quanhuyentt"
                                                    className="form-control "
                                                    onChange={(e) => {
                                                        const {
                                                            value
                                                        } = e.target;
                                                        onchangeloaddiachi(
                                                            'quanhuyentt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'quanhuyentt',
                                                            value
                                                        );
                                                        setFieldValue(
                                                            'xaphuongtt',
                                                            ''
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.tinhtt !==
                                                    '' ? (
                                                        <RenderDropdownQuanhuyen
                                                            code="quanhuyentt"
                                                            data={
                                                                loaddiachi.tinhtt
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.quanhuyentt &&
                                                touched.quanhuyentt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.quanhuyentt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="xaphuongtt"
                                                    className="chitietdiachi"
                                                >
                                                    X??/Ph?????ng
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuongtt"
                                                    key="xaphuongtt"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Ch???n--
                                                    </option>
                                                    {loaddiachi.quanhuyentt !==
                                                    '' ? (
                                                        <RenderDropdownXaphuong
                                                            code="xaphuongtt"
                                                            data={
                                                                loaddiachi.quanhuyentt
                                                            }
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Field>
                                                {errors.xaphuongtt &&
                                                touched.xaphuongtt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.xaphuongtt}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label
                                                htmlFor="diaChiTamChu"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                            </label>
                                            <Field
                                                name="diaChiTamChu"
                                                key="diaChiTamChu"
                                                className="form-control "
                                            />
                                            {errors.diaChiTamChu &&
                                            touched.diaChiTamChu ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diaChiTamChu}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <br />

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laConThuMay">
                                                    Gia ????nh: l?? con th??? m???y?
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="laConThuMay"
                                                    key="laConThuMay"
                                                    className="form-control "
                                                    placeholder="VD: l?? con th??? 1 trong gia ????nh 2 con vi???t l?? 1/2"
                                                />
                                                {errors.laConThuMay &&
                                                touched.laConThuMay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.laConThuMay}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangHonNhan">
                                                    T??nh tr???ng h??n nh??n
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="0"
                                                        />{' '}
                                                        ?????c th??n
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="1"
                                                        />{' '}
                                                        ???? c?? gia ????nh
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="hoTenVoChong">
                                                    H??? t??n V???/Ch???ng:
                                                </label>
                                                <Field
                                                    name="hoTenVoChong"
                                                    key="hoTenVoChong"
                                                    className="form-control "
                                                />
                                                {errors.hoTenVoChong &&
                                                touched.hoTenVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.hoTenVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="dienThoaiVoChong">
                                                    ??i???n tho???i
                                                </label>
                                                <Field
                                                    name="dienThoaiVoChong"
                                                    key="dienThoaiVoChong"
                                                    className="form-control "
                                                />
                                                {errors.dienThoaiVoChong &&
                                                touched.dienThoaiVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dienThoaiVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="coMayCon">
                                                    C?? m???y con
                                                </label>
                                                <Field
                                                    name="coMayCon"
                                                    key="coMayCon"
                                                    className="form-control "
                                                />
                                                {errors.coMayCon &&
                                                touched.coMayCon ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.coMayCon}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="soConTrai">
                                                    Trai
                                                </label>
                                                <Field
                                                    name="soConTrai"
                                                    key="soConTrai"
                                                    className="form-control "
                                                />
                                                {errors.soConTrai &&
                                                touched.soConTrai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soConTrai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="soConGai">
                                                    G??i
                                                </label>
                                                <Field
                                                    name="soConGai"
                                                    key="soConGai"
                                                    className="form-control "
                                                />
                                                {errors.soConGai &&
                                                touched.soConGai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soConGai}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-3">
                                                <label htmlFor="lonNhatSinhNam">
                                                    L???n nh???t sinh n??m
                                                </label>
                                                <Field
                                                    name="lonNhatSinhNam"
                                                    key="lonNhatSinhNam"
                                                    className="form-control "
                                                />
                                                {errors.lonNhatSinhNam &&
                                                touched.lonNhatSinhNam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.lonNhatSinhNam
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="nhoNhatSinhNam">
                                                    Nh??? nh???t sinh n??m
                                                </label>
                                                <Field
                                                    name="nhoNhatSinhNam"
                                                    key="nhoNhatSinhNam"
                                                    className="form-control "
                                                />
                                                {errors.nhoNhatSinhNam &&
                                                touched.nhoNhatSinhNam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nhoNhatSinhNam
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            II.T??NH TR???NG B???NH L??
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguyenNhanSuyThan">
                                                    1.Nguy??n nh??n d???n ?????n suy{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                </label>
                                                <Field
                                                    name="nguyenNhanSuyThan"
                                                    key="nguyenNhanSuyThan"
                                                    className="form-control "
                                                />
                                                {errors.nguyenNhanSuyThan &&
                                                touched.nguyenNhanSuyThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nguyenNhanSuyThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngayPhatHienSuyThan">
                                                    2.Ph??t hi???n suy{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayPhatHienSuyThan"
                                                    key="ngayPhatHienSuyThan"
                                                    className="form-control "
                                                />
                                                {errors.ngayPhatHienSuyThan &&
                                                touched.ngayPhatHienSuyThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayPhatHienSuyThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="benhSu">
                                                    Truy???n m??u
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="baoNhieuDonViMau">
                                                    Bao nhi??u ????n v??? m??u
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="baoNhieuDonViMau"
                                                    key="baoNhieuDonViMau"
                                                    className="form-control "
                                                />
                                                {errors.baoNhieuDonViMau &&
                                                touched.baoNhieuDonViMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.baoNhieuDonViMau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="thang">
                                                    Truy???n m??u l???n cu???i
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="v??o th??ng"
                                                    name="thang"
                                                    key="thang"
                                                    className="form-control "
                                                />
                                                {errors.thang &&
                                                touched.thang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nam">N??m</label>
                                                <Field
                                                    type="number"
                                                    name="nam"
                                                    key="nam"
                                                    className="form-control "
                                                />
                                                {errors.nam && touched.nam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.nam}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="benhVienTruyenMau">
                                                    Truy???n m??u t???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="benhVienTruyenMau"
                                                    key="benhVienTruyenMau"
                                                    className="form-control "
                                                />
                                                {errors.benhVienTruyenMau &&
                                                touched.benhVienTruyenMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhVienTruyenMau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="chieuCao">
                                                    Chi???u cao (cm)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="chieuCao"
                                                    key="chieuCao"
                                                    className="form-control "
                                                />

                                                {errors.chieuCao &&
                                                touched.chieuCao ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.chieuCao}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="canNang">
                                                    C??n n???ng (kg)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="canNang"
                                                    key="canNang"
                                                    className="form-control "
                                                />

                                                {errors.canNang &&
                                                touched.canNang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.canNang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="thuocDangSuDungNgay">
                                                    Thu???c ??ang s??? d???ng/ng??y
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    rows={3}
                                                    name="thuocDangSuDungNgay"
                                                    key="thuocDangSuDungNgay"
                                                    className="form-control "
                                                />

                                                {errors.thuocDangSuDungNgay &&
                                                touched.thuocDangSuDungNgay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDangSuDungNgay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="thuocTaoMau">
                                                    Thu???c t???o m??u
                                                </label>
                                                <Field
                                                    name="thuocTaoMau"
                                                    key="thuocTaoMau"
                                                    className="form-control "
                                                />

                                                {errors.thuocTaoMau &&
                                                touched.thuocTaoMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thuocTaoMau}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="bacSiDieuTri">
                                                    B??c s?? ??i???u tr???
                                                </label>
                                                <Field
                                                    name="bacSiDieuTri"
                                                    key="bacSiDieuTri"
                                                    className="form-control "
                                                />

                                                {errors.bacSiDieuTri &&
                                                touched.bacSiDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.bacSiDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="dienThoaiBacSi">
                                                    ??i???n tho???i b??c s??
                                                </label>
                                                <Field
                                                    name="dienThoaiBacSi"
                                                    key="dienThoaiBacSi"
                                                    className="form-control "
                                                />

                                                {errors.dienThoaiBacSi &&
                                                touched.dienThoaiBacSi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dienThoaiBacSi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="khongBiViemGan">
                                                3.B???nh l?? k??m theo
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox">
                                                    <Field
                                                        type="checkbox"
                                                        name="khongBiViemGan"
                                                        key="khongBiViemGan"
                                                        id="khongBiViemGan"
                                                        className="custom-control-input"
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="khongBiViemGan"
                                                    >
                                                        Kh??ng b??? vi??m gan
                                                    </label>
                                                    {errors.khongBiViemGan &&
                                                    touched.khongBiViemGan ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.khongBiViemGan
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViA"
                                                        key="viemGanSieuViA"
                                                        id="viemGanSieuViA"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViA
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViA"
                                                    >
                                                        Vi??m gan si??u vi A
                                                    </label>
                                                    {errors.viemGanSieuViA &&
                                                    touched.viemGanSieuViA ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViA
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViB"
                                                        key="viemGanSieuViB"
                                                        id="viemGanSieuViB"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViB
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViB"
                                                    >
                                                        Vi??m gan si??u vi B
                                                    </label>
                                                    {errors.viemGanSieuViB &&
                                                    touched.viemGanSieuViB ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViB
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="viemGanSieuViC"
                                                        key="viemGanSieuViC"
                                                        id="viemGanSieuViC"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.khongBiViemGan
                                                        }
                                                        checked={
                                                            values.khongBiViemGan
                                                                ? ''
                                                                : values.viemGanSieuViC
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="viemGanSieuViC"
                                                    >
                                                        Vi??m gan si??u vi C
                                                    </label>
                                                    {errors.viemGanSieuViC &&
                                                    touched.viemGanSieuViC ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.viemGanSieuViC
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div
                                                className="form-row col-md-6"
                                                id="truocHoacSauLocMau"
                                            >
                                                <div className="col-md-6">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="truocHoacSauLocMau"
                                                                value="1"
                                                                disabled={
                                                                    values.khongBiViemGan
                                                                }
                                                                checked={
                                                                    values.khongBiViemGan
                                                                        ? ''
                                                                        : values.truocHoacSauLocMau ===
                                                                          '1'
                                                                }
                                                            />{' '}
                                                            Vi??m gan tr?????c l???c
                                                            m??u
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label htmlFor="a">
                                                            <Field
                                                                type="radio"
                                                                name="truocHoacSauLocMau"
                                                                value="2"
                                                                disabled={
                                                                    values.khongBiViemGan
                                                                }
                                                                checked={
                                                                    values.khongBiViemGan
                                                                        ? ''
                                                                        : values.truocHoacSauLocMau ===
                                                                          '2'
                                                                }
                                                            />{' '}
                                                            Sau l???c m??u
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>{' '}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="dieuTriViemGanTu">
                                                    ??i???u tr??? vi??m gan t??? l??c n??o
                                                </label>
                                                <Field
                                                    name="dieuTriViemGanTu"
                                                    key="dieuTriViemGanTu"
                                                    className="form-control "
                                                />
                                                {errors.dieuTriViemGanTu &&
                                                touched.dieuTriViemGanTu ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dieuTriViemGanTu
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-8">
                                                <label htmlFor="thuocTriViemGan">
                                                    Thu???c ??i???u tr??? vi??m gan
                                                </label>
                                                <Field
                                                    name="thuocTriViemGan"
                                                    key="thuocTriViemGan"
                                                    className="form-control "
                                                />
                                                {errors.thuocTriViemGan &&
                                                touched.thuocTriViemGan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocTriViemGan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            key="laoPhoi"
                                                            name="laoPhoi"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng c?? ti???n c??n lao
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            key="laoPhoi"
                                                            name="laoPhoi"
                                                            value="1"
                                                        />{' '}
                                                        Lao ph???i
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laoCoQuanKhac">
                                                    Lao c??c c?? quan kh??c
                                                </label>
                                                <Field
                                                    name="laoCoQuanKhac"
                                                    key="laoCoQuanKhac"
                                                    className="form-control "
                                                />
                                                {errors.laoCoQuanKhac &&
                                                touched.laoCoQuanKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.laoCoQuanKhac
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thoiGianBiLao">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiLao"
                                                    key="thoiGianBiLao"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiLao &&
                                                touched.thoiGianBiLao ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiLao
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-8">
                                                <label htmlFor="thoiGianDieuTriAndNoiDieuTri">
                                                    Th???i gian ??i???u tr???/N??i ??i???u
                                                    tr???
                                                </label>
                                                <Field
                                                    name="thoiGianDieuTriAndNoiDieuTri"
                                                    key="thoiGianDieuTriAndNoiDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianDieuTriAndNoiDieuTri &&
                                                touched.thoiGianDieuTriAndNoiDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianDieuTriAndNoiDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daiThaoDuong">
                                                    ????i th??o ???????ng
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiDaiThaoDuong">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiDaiThaoDuong"
                                                    key="thoiGianBiDaiThaoDuong"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiDaiThaoDuong &&
                                                touched.thoiGianBiDaiThaoDuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiDaiThaoDuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuocDieuTriDaiThaoDuong">
                                                    Thu???c ??i???u tr???
                                                </label>
                                                <Field
                                                    name="thuocDieuTriDaiThaoDuong"
                                                    key="thuocDieuTriDaiThaoDuong"
                                                    className="form-control "
                                                />
                                                {errors.thuocDieuTriDaiThaoDuong &&
                                                touched.thuocDieuTriDaiThaoDuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDieuTriDaiThaoDuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="tangHuyetAp">
                                                    T??ng huy???t ??p
                                                </label>
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiTangHuyetAp">
                                                    T??? l??c n??o
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoiGianBiTangHuyetAp"
                                                    key="thoiGianBiTangHuyetAp"
                                                    className="form-control "
                                                />
                                                {errors.thoiGianBiTangHuyetAp &&
                                                touched.thoiGianBiTangHuyetAp ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoiGianBiTangHuyetAp
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuocDieuTri">
                                                    Thu???c ??i???u tr???
                                                </label>
                                                <Field
                                                    name="thuocDieuTri"
                                                    key="thuocDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.thuocDieuTri &&
                                                touched.thuocDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuocDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="benhKhac">
                                                    C??c b???nh kh??c
                                                </label>
                                                <Field
                                                    name="benhKhac"
                                                    key="benhKhac"
                                                    className="form-control "
                                                />
                                                {errors.benhKhac &&
                                                touched.benhKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.benhKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrang">
                                                    T??nh h??nh hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrang"
                                                    key="tinhTrang"
                                                    className="form-control "
                                                />
                                                {errors.tinhTrang &&
                                                touched.tinhTrang ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.tinhTrang}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="coPhauThuat">
                                                4.Ti???n c??n ngo???i khoa
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daPhauThuat">
                                                    C?? ph???u thu???t g?? tr?????c ????
                                                    kh??ng
                                                </label>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ngayThangPhauThuat">
                                                    Ng??y th??ng n??m ph???u thu???t
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngayThangPhauThuat"
                                                    key="ngayThangPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.ngayThangPhauThuat &&
                                                touched.ngayThangPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngayThangPhauThuat
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="benhVienPhauThuat">
                                                    Ph???u thu???t t???i b???nh vi???n
                                                </label>
                                                <Field
                                                    name="benhVienPhauThuat"
                                                    key="benhVienPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.benhVienPhauThuat &&
                                                touched.benhVienPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhVienPhauThuat
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="coPhauThuat">
                                                    N???u c?? th?? do b???nh g??
                                                </label>
                                                <Field
                                                    name="coPhauThuat"
                                                    key="coPhauThuat"
                                                    className="form-control "
                                                />
                                                {errors.coPhauThuat &&
                                                touched.coPhauThuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.coPhauThuat}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangHienTai">
                                                    T??nh tr???ng hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrangHienTai"
                                                    key="tinhTrangHienTai"
                                                    className="form-control "
                                                />
                                                {errors.tinhTrangHienTai &&
                                                touched.tinhTrangHienTai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tinhTrangHienTai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="uongRuouBia">
                                                    5.Th??i quen nghi???n r?????u
                                                </label>
                                                <div className="form-row">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="uongRuouBia"
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="uongRuouBia"
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLanTuan">
                                                    S??? l???n/tu???n
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="soLanTuan"
                                                    key="soLanTuan"
                                                    className="form-control "
                                                />
                                                {errors.soLanTuan &&
                                                touched.soLanTuan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soLanTuan}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLuongLan">
                                                    S??? l?????ng tr??n l???n
                                                </label>
                                                <Field
                                                    placeholder="l??t/chai/lon/ly"
                                                    name="soLuongLan"
                                                    key="soLuongLan"
                                                    className="form-control "
                                                />
                                                {errors.soLuongLan &&
                                                touched.soLuongLan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.soLuongLan}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="hutThuoc">
                                                    6.Th??i quen h??t thu???c
                                                </label>
                                                <div className="form-row">
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="hutThuoc"
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                    <div
                                                        role="group"
                                                        aria-labelledby="my-radio-group"
                                                    >
                                                        <label
                                                            htmlFor="a"
                                                            className="mgr15"
                                                        >
                                                            <Field
                                                                type="radio"
                                                                name="hutThuoc"
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="dieuTrenNgay">
                                                    S??? ??i???u tr??n ng??y
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="??i???u/ng??y"
                                                    name="dieuTrenNgay"
                                                    key="dieuTrenNgay"
                                                    className="form-control "
                                                />
                                                {errors.dieuTrenNgay &&
                                                touched.dieuTrenNgay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.dieuTrenNgay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="BiBenhThan">
                                                7.Ti???n c??n gia ????nh
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="biBenhThan">
                                                    B???nh{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhThan"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhThan"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhLao">
                                                    B???nh lao
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhLao"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biBenhLao"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biDaiThaoDuong">
                                                    ????i th??o ???????ng
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biDaiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biDaiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biTangHuyetAp">
                                                    T??ng huy???t ??p
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biTangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biTangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biUngThu">
                                                    Ung th??
                                                </label>

                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biUngThu"
                                                            value="1"
                                                        />{' '}
                                                        C??
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="radio"
                                                            name="biUngThu"
                                                            value="0"
                                                        />{' '}
                                                        Kh??ng
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="biBenhKhac">
                                                    B???nh kh??c
                                                </label>
                                                <Field
                                                    name="biBenhKhac"
                                                    key="biBenhKhac"
                                                    className="form-control "
                                                />

                                                {errors.biBenhKhac &&
                                                touched.biBenhKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.biBenhKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        S???ng c??ng ?????a ch???{' '}
                                                        <Field
                                                            type="radio"
                                                            name="songCungDiaChi"
                                                            value="1"
                                                        />
                                                    </label>
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        Kh??ng c??ng ?????a ch???{' '}
                                                        <Field
                                                            type="radio"
                                                            name="songCungDiaChi"
                                                            value="0"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="nguoiThanBiBenh">
                                                    N???u c?? th?? l?? ai
                                                </label>
                                                <Field
                                                    name="nguoiThanBiBenh"
                                                    key="nguoiThanBiBenh"
                                                    className="form-control "
                                                />

                                                {errors.nguoiThanBiBenh &&
                                                touched.nguoiThanBiBenh ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nguoiThanBiBenh
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tinhTrangBenhNguoiThanHienTai">
                                                    T??nh tr???ng hi???n t???i
                                                </label>
                                                <Field
                                                    name="tinhTrangBenhNguoiThanHienTai"
                                                    key="tinhTrangBenhNguoiThanHienTai"
                                                    className="form-control "
                                                />

                                                {errors.tinhTrangBenhNguoiThanHienTai &&
                                                touched.tinhTrangBenhNguoiThanHienTai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tinhTrangBenhNguoiThanHienTai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="NhiemCovid">
                                                8. Ti???n s??? covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox">
                                                    <Field
                                                        type="checkbox"
                                                        name="NhiemCovid"
                                                        key="NhiemCovid"
                                                        id="NhiemCovid"
                                                        className="custom-control-input"
                                                        onClick={() =>
                                                            KhongBiNhiemCheck()
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="NhiemCovid"
                                                    >
                                                        Kh??ng b??? nhi???m covid
                                                    </label>
                                                    {errors.NhiemCovid &&
                                                    touched.NhiemCovid ? (
                                                        <div className="invalid-feedback">
                                                            {errors.NhiemCovid}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="BiTruocTiem"
                                                        key="BiTruocTiem"
                                                        id="BiTruocTiem"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.BiTruocTiem
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="BiTruocTiem"
                                                    >
                                                        B??? nhi???m tr?????c ti??m
                                                    </label>
                                                    {errors.BiTruocTiem &&
                                                    touched.BiTruocTiem ? (
                                                        <div className="invalid-feedback">
                                                            {errors.BiTruocTiem}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="BiSauTiem"
                                                        key="BiSauTiem"
                                                        id="BiSauTiem"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.BiSauTiem
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="BiSauTiem"
                                                    >
                                                        B??? nhi???m sau ti??m
                                                    </label>
                                                    {errors.BiSauTiem &&
                                                    touched.BiSauTiem ? (
                                                        <div className="invalid-feedback">
                                                            {errors.BiSauTiem}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="CoTrieuChung"
                                                        key="CoTrieuChung"
                                                        id="CoTrieuChung"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.CoTrieuChung
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="CoTrieuChung"
                                                    >
                                                        Kh??ng c?? tri???u ch???ng
                                                    </label>
                                                    {errors.CoTrieuChung &&
                                                    touched.CoTrieuChung ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.CoTrieuChung
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="TrieuChungNhe"
                                                        key="TrieuChungNhe"
                                                        id="TrieuChungNhe"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.TrieuChungNhe
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="TrieuChungNhe"
                                                    >
                                                        Tri???u ch???ng nh???
                                                    </label>
                                                    {errors.TrieuChungNhe &&
                                                    touched.TrieuChungNhe ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TrieuChungNhe
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="TrieuChungtrungBinh"
                                                        key="TrieuChungtrungBinh"
                                                        id="TrieuChungtrungBinh"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.TrieuChungtrungBinh
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="TrieuChungtrungBinh"
                                                    >
                                                        Tri???u ch??ng trung b??nh
                                                    </label>
                                                    {errors.TrieuChungtrungBinh &&
                                                    touched.TrieuChungtrungBinh ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TrieuChungtrungBinh
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="NhapVien"
                                                        key="NhapVien"
                                                        id="NhapVien"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.NhapVien
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="NhapVien"
                                                    >
                                                        Nh???p vi???n
                                                    </label>
                                                    {errors.NhapVien &&
                                                    touched.NhapVien ? (
                                                        <div className="invalid-feedback">
                                                            {errors.NhapVien}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-3">
                                                <label htmlFor="ThoiGianNamVien">
                                                    Th???i gian n???m vi???n(ng??y)
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="ThoiGianNamVien"
                                                    key="ThoiGianNamVien"
                                                    className="form-control "
                                                />

                                                {errors.ThoiGianNamVien &&
                                                touched.ThoiGianNamVien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ThoiGianNamVien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ThoMay"
                                                        key="ThoMay"
                                                        id="ThoMay"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.ThoMay
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ThoMay"
                                                    >
                                                        Th??? m??y
                                                    </label>
                                                    {errors.ThoMay &&
                                                    touched.ThoMay ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ThoMay}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ThoHFNC"
                                                        key="ThoHFNC"
                                                        id="ThoHFNC"
                                                        className="custom-control-input"
                                                        disabled={
                                                            values.NhiemCovid
                                                        }
                                                        checked={
                                                            values.NhiemCovid
                                                                ? ''
                                                                : values.ThoHFNC
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ThoHFNC"
                                                    >
                                                        Th??? HFNC
                                                    </label>
                                                    {errors.ThoHFNC &&
                                                    touched.ThoHFNC ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ThoHFNC}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="khongBiViemGan">
                                                9. Ti??m vaccine ng???a covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine">
                                                    Ti??m vaccine ng???a covid l???n
                                                    1
                                                </label>
                                                <Field
                                                    name="TiemVaccine"
                                                    key="TiemVaccine"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine &&
                                                touched.TiemVaccine ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.TiemVaccine}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui1">
                                                    Ng??y ti??m m??i 1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui1"
                                                    key="NgayTiemMui1"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui1 &&
                                                touched.NgayTiemMui1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng">
                                                    Ph???n ???ng sau ti??m l???n 1
                                                </label>
                                                <Field
                                                    name="PhanUng"
                                                    key="PhanUng"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng &&
                                                touched.PhanUng ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine2">
                                                    Ti??m vaccine ng???a covid l???n
                                                    2
                                                </label>
                                                <Field
                                                    name="TiemVaccine2"
                                                    key="TiemVaccine2"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine2 &&
                                                touched.TiemVaccine2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TiemVaccine2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui2">
                                                    Ng??y ti??m m??i 2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui2"
                                                    key="NgayTiemMui2"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui2 &&
                                                touched.NgayTiemMui2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng2">
                                                    Ph???n ???ng sau ti??m l???n 2
                                                </label>
                                                <Field
                                                    name="PhanUng2"
                                                    key="PhanUng2"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng2 &&
                                                touched.PhanUng2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng2}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine3">
                                                    Ti??m vaccine ng???a covid m??i
                                                    3
                                                </label>
                                                <Field
                                                    name="TiemVaccine3"
                                                    key="TiemVaccine3"
                                                    className="form-control "
                                                />

                                                {errors.TiemVaccine3 &&
                                                touched.TiemVaccine3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.TiemVaccine3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="NgayTiemMui3">
                                                    Ng??y ti??m m??i 3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="NgayTiemMui3"
                                                    key="NgayTiemMui3"
                                                    className="form-control "
                                                />

                                                {errors.NgayTiemMui3 &&
                                                touched.NgayTiemMui3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.NgayTiemMui3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="PhanUng3">
                                                    Ph???n ???ng sau ti??m m??i 3
                                                </label>
                                                <Field
                                                    name="PhanUng3"
                                                    key="PhanUng3"
                                                    className="form-control "
                                                />

                                                {errors.PhanUng3 &&
                                                touched.PhanUng3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.PhanUng3}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            III. KINH T???:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapBenhNhan">
                                                    Thu nh???p c???a b???nh nh??n
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapBenhNhan"
                                                    key="thuNhapBenhNhan"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapBenhNhan &&
                                                touched.thuNhapBenhNhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuNhapBenhNhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapVoChongBenhNhan">
                                                    Thu nh???p c???a V??? ho???c Ch???ng
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapVoChongBenhNhan"
                                                    key="thuNhapVoChongBenhNhan"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapVoChongBenhNhan &&
                                                touched.thuNhapVoChongBenhNhan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thuNhapVoChongBenhNhan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ngheNghiepVoChong">
                                                    Ngh??? nghi???p
                                                </label>
                                                <Field
                                                    name="ngheNghiepVoChong"
                                                    key="ngheNghiepVoChong"
                                                    className="form-control "
                                                />

                                                {errors.ngheNghiepVoChong &&
                                                touched.ngheNghiepVoChong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngheNghiepVoChong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapKhac">
                                                    Thu nh???p kh??c
                                                </label>
                                                <Field
                                                    placeholder="VND/Th??ng"
                                                    name="thuNhapKhac"
                                                    key="thuNhapKhac"
                                                    className="form-control "
                                                />

                                                {errors.thuNhapKhac &&
                                                touched.thuNhapKhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.thuNhapKhac}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="tienChuanBiChoViecGhepThan">
                                                    Ti???n chu???n b??? cho vi???c gh??p{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                    (c?? s???n)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="tienChuanBiChoViecGhepThan"
                                                    key="tienChuanBiChoViecGhepThan"
                                                    className="form-control "
                                                />

                                                {errors.tienChuanBiChoViecGhepThan &&
                                                touched.tienChuanBiChoViecGhepThan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tienChuanBiChoViecGhepThan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div
                                            className="solama"
                                            style={{textTransform: 'uppercase'}}
                                        >
                                            IV. L?? DO ????NG K?? CH??? GH??P{' '}
                                            {TypeBoPhanConstant.GetName(
                                                String(
                                                    values.typePhieuDKGhepTang
                                                ).toLowerCase()
                                            )}{' '}
                                            T??? NG?????I HI???N CH???T N??O:
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox">
                                                <Field
                                                    type="checkbox"
                                                    name="khongCoNguoiNhan"
                                                    key="khongCoNguoiNhan"
                                                    id="khongCoNguoiNhan"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="khongCoNguoiNhan"
                                                >
                                                    Kh??ng c?? ng?????i hi???n{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                </label>
                                                {errors.khongCoNguoiNhan &&
                                                touched.khongCoNguoiNhan ? (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.khongCoNguoiNhan
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox ">
                                                <Field
                                                    type="checkbox"
                                                    name="nguoiChoBiBenh"
                                                    key="nguoiChoBiBenh"
                                                    id="nguoiChoBiBenh"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="nguoiChoBiBenh"
                                                >
                                                    Ng?????i hi???n b??? b???nh
                                                </label>
                                                {errors.nguoiChoBiBenh &&
                                                touched.nguoiChoBiBenh ? (
                                                    <div className="invalid-feedback">
                                                        {errors.nguoiChoBiBenh}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="custom-control custom-checkbox ">
                                                <Field
                                                    type="checkbox"
                                                    name="nguoiChoKhongHoaHopMau"
                                                    key="nguoiChoKhongHoaHopMau"
                                                    id="nguoiChoKhongHoaHopMau"
                                                    className="custom-control-input"
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="nguoiChoKhongHoaHopMau"
                                                >
                                                    Ng?????i hi???n kh??ng h??a h???p
                                                    nh??m m??u
                                                </label>
                                                {errors.nguoiChoKhongHoaHopMau &&
                                                touched.nguoiChoKhongHoaHopMau ? (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.nguoiChoKhongHoaHopMau
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label htmlFor="lyDoKhac">
                                                L?? do kh??c
                                            </label>
                                            <Field
                                                name="lyDoKhac"
                                                key="lyDoKhac"
                                                className="form-control "
                                            />
                                            {errors.lyDoKhac &&
                                            touched.lyDoKhac ? (
                                                <div className="invalid-feedback">
                                                    {errors.lyDoKhac}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            V. QUAN H??? GIA ????NH:
                                        </div>
                                        <RenderEditQuanHeGiaDinh
                                            lstQhgd={entityObj.QhGd}
                                        />
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            VI. CAM K???T ????NG K?? CH??? GH??P{' '}
                                            <p
                                                style={{
                                                    textTransform: 'uppercase',
                                                    display: 'inline'
                                                }}
                                            >
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                            </p>{' '}
                                            T??? NG?????I HI???N CH???T N??O HAY TIM NG???NG
                                            ?????P
                                        </div>
                                        <div
                                            className="form-group col-md-12"
                                            style={{
                                                lineHeight: '30px',
                                                textAlign: 'justify'
                                            }}
                                        >
                                            <span>
                                                Hi???n t??i b??? b???nh{' '}
                                                <div
                                                    style={{
                                                        width: '150px',
                                                        display: 'inline-table'
                                                    }}
                                                >
                                                    <Field
                                                        name="choGhepBenh"
                                                        key="choGhepBenh"
                                                        className="form-control"
                                                    />
                                                    {errors.choGhepBenh &&
                                                    touched.choGhepBenh ? (
                                                        <>
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.choGhepBenh
                                                                }
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>{' '}
                                                ??ang ???????c ??i???u tr??? t???i{' '}
                                                <div
                                                    style={{
                                                        width: '150px',
                                                        display: 'inline-table'
                                                    }}
                                                >
                                                    <Field
                                                        name="choGhepBVDieuTri"
                                                        key="choGhepBVDieuTri"
                                                        className="form-control "
                                                        style={{}}
                                                    />
                                                    {errors.choGhepBVDieuTri &&
                                                    touched.choGhepBVDieuTri ? (
                                                        <>
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.choGhepBVDieuTri
                                                                }
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                                , c?? ch??? ?????nh gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                                . T??i ???? ???????c c??c b??c s?? ph???
                                                tr??ch gi???i th??ch r?? v??? c??c b?????c
                                                th???c hi???n ????nh gi?? t??nh tr???ng
                                                s???c kh???e chung, th???c hi???n qu??
                                                tr??nh tuy???n ch???n, th???i gian ch???
                                                ?????i, t??c d???ng ph??? c???a thu???c ???c
                                                ch??? mi???n d???ch ??i???u tr??? sau gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                                , chi ph?? gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                                , chu???n b??? m??i tr?????ng v?? c??ch
                                                sinh ho???t sau khi ???????c gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                                . T??i xin ???????c ????ng k?? v??o danh
                                                s??ch ch??? gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}{' '}
                                                t??? ng?????i hi???n ch???t n??o hay tim
                                                ng???ng ?????p t???i B???nh vi???n Ch??? R???y,
                                                t??i cam k???t tu??n th??? c??c quy
                                                ?????nh trong qu?? tr??nh ??i???u tr???
                                                b???nh tr?????c v?? sau gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeModal
                                                )}
                                                .
                                            </span>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>

                    <div className="center mgb15 mgt15">
                        {/* <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            ????ng
                        </Button> */}
                        <Button
                            className="btn-lg"
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Ho??n th??nh
                        </Button>
                    </div>
                </Col>
            </Row>
        );
    }
    return (
        <Container>
            {isload ? (
                <div className="coverLoader">
                    <ReactLoading
                        className="loaderItem"
                        type="bars"
                        color="#2980b9"
                        height="100px"
                        width="100px"
                    />
                </div>
            ) : null}
            <div className="row">
                <div className="col-sm-8">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang ch???</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            C???p nh???t ????ng k??
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm-4 boxMenuClient">
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Qu???n l?? h??? s??
                    </Link>
                </div>
            </div>

            {entityObj !== null ? (
                <>
                    {entityObj.TypePhieuDKGhepTang ===
                    TypeBoPhanConstant.than ? (
                        <EditModal />
                    ) : (
                        <EditModalKhac />
                    )}
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        dangKyChoGhepTangService.LoadEntity(dispatch, objSearch);
    },

    onEditEntity: (id) => {
        dangKyChoGhepTangService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        dangKyChoGhepTangService.EditNewEntityUser(tintuc);
    },
    SaveThongBaoXN: (obj) => {
        dangKyChoGhepTangService.SaveThongBaoXN(dispatch, obj);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkychogheptang.lstEntity,

    entityObj: state.dangkychogheptang.entityObj,

    showEditModal: state.dangkychogheptang.showEditModal,
    isInit: state.dangkychogheptang.isInit,
    showThongBaoXNModal: state.dangkychogheptang.showThongBaoXNModal
});
export default connect(mapStateToProps, mapDispatchToProps)(EditGhepTangHome);
