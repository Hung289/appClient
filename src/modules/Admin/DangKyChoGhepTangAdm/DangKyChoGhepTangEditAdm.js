import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import $ from 'jquery';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import axios from 'axios';
import {NotFoundImage} from '@modules/Common/NotFound';
import TimePicker from 'react-time-picker';
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    Tabs,
    Tab
} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    DANGKYCHOGHEPTANG_CHANGESTATUS_CLOSE,
    DANGKYCHOGHEPTANG_CLOSE_VIEWDETAIL,
    DANGKYCHOGHEPTANG_CLOSE_VIEWEDIT,
    DANGKYCHOGHEPTANG_EDIT_CLOSE,
    DANGKYCHOGHEPTANG_SEARCH_SAVE,
    DANGKYCHOGHEPTANG_CLOSE_CREATE,
    DANGKYCHOGHEPTANG_OPEN_CREATE,
    DANGKYCHOGHEPTANG_THONGBAOXN_CLOSE
} from '@app/store/ActionType/DangKyChoGhepTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';
import DangKyChoGhepTangCreateAdm from './DangKyChoGhepTangCreateAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyChoGhepTangEditAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const dataGiaDinh = useRef([]);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);
    const [NhomMauRh, setNhomMauRh] = useState([]);

    const [QHGD, setQHGD] = useState([]);

    const dataGiaDinhEdit = useRef([]);
    const {
        typeCreate,
        onCloseEntityEditModal,
        entityObj,
        // onSaveEditEntity,
        IsShowEditPopup,
        OnLoadingAction,
        onReloadPage
    } = props;
    const onSaveEditEntity = (tintuc) => {
        OnLoadingAction(true);
        console.log('a');
        dangKyChoGhepTangService.EditNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditModal();
                onReloadPage();
            }
        });
    };
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
                'Họ tên không được sử dụng ký tự đặc biệt và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này')
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        ngheNghiep: Yup.string()
            .trim()
            .typeError('Vui lòng nhập thông tin này')
            .required('Vui lòng nhập thông tin này'),
        baoHiemYTe: Yup.string()
            .trim()
            .test(
                'len',
                'Số bảo hiểm y tế chỉ được sử dụng chữ cái và số',
                (val) => /^[a-zA-Z0-9 ]*$/.test(val)
            )
            .typeError('Vui lòng nhập thông tin này'),
        nhomMau: Yup.string().nullable(),
        nhomMau1: Yup.string().trim().nullable(),
        CMNDBN: Yup.string()
            .trim()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này')
            .min(9, 'CMND phải có ít nhất 9 số')
            .max(12, 'CMND không được quá 12 số')
            .test('len', 'CMND chỉ được sử dụng chữ số', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
        ngaySinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày sinh vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày sinh phải sau ngày 1 tháng 1 năm 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        ngayThangPhauThuat: Yup.string()
            .nullable()
            .test('len', 'Ngày tháng vượt quá ngày hiện tại', (val) => {
                return (
                    new Date() > new Date(val) ||
                    val === '' ||
                    val === undefined
                );
            })
            .test(
                'len',
                'Ngày tháng phải sau ngày 1 tháng 1 năm 1920',
                (val) =>
                    new Date('1920-1-1') < new Date(val) ||
                    val === '' ||
                    val === undefined
            ),
        trinhDoVanHoa: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        dienThoai: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này')
            .test('xxx', 'Số điện thoại chỉ được sử dụng chữ số', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        dienThoai1: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .typeError('Vui lòng nhập thông tin này')
            .nullable()
            .test(
                'xxx',
                'Số điện thoại chỉ sử dụng chữ số',
                (val) => /^[0-9+.]*$/.test(val) || val === undefined
            ),
        // .test('xxx', 'Số điện thoại phải bắt đầu bằng số 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        diaChiThuongChu: Yup.string()
            .trim()
            .typeError('Vui lòng nhập thông tin này')
            .required('Vui lòng nhập thông tin này'),
        diaChiTamChu: Yup.string().trim().nullable(),
        NgayCapCMNDBN: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày cấp vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày cấp phải sau ngày 1 tháng 1 năm 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        NoiCapCMNDBN: Yup.string()
            .trim()
            .typeError('Vui lòng nhập thông tin này')
            .required('Vui lòng nhập thông tin này'),
        ngayPhatHienSuyThan: Yup.string().nullable(),
        nguyenNhanSuyThan: Yup.string().nullable(),
        // dia chi thuong tru
        tinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        xaphuong: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        quanhuyen: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        // dia chi tam tru
        tinhtt: Yup.string().nullable(),
        xaphuongtt: Yup.string().nullable(),
        quanhuyentt: Yup.string().nullable(),
        lonNhatSinhNam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900, 'Vui lòng nhập số lớn hơn 1900')
            .nullable()
            .typeError('Năm sinh phải là số lớn hơn 1900')
            .integer('Năm sinh phải là số nguyên'),
        laConThuMay: Yup.string()
            .typeError('Vui lòng nhập thông tin này')
            .required('Vui lòng nhập thông tin này'),
        coMayCon: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0, 'Vui lòng nhập số lớn hơn hoặc bằng 0')
            .nullable()
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0'),
        soConTrai: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0, 'Vui lòng nhập số lớn hơn hoặc bằng 0')
            .nullable()
            .min(0, 'Vui lòng nhập số lớn hơn hoặc bằng 0')
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0'),
        soConGai: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0, 'Vui lòng nhập số lớn hơn hoặc bằng 0')
            .nullable()
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0'),
        nhoNhatSinhNam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900, 'Vui lòng nhập số lớn hơn 1900')
            .nullable()
            .typeError('Năm sinh phải là số lớn hơn 1900')
            .integer('Năm sinh phải là số nguyên'),
        baoNhieuDonViMau: Yup.number()
            .positive('Vui lòng nhập số lớn hơn 0')
            .typeError('Vui lòng nhập thông tin này')
            .min(0, 'Đơn vị máu phải lớn hơn 0'),
        thang: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1, 'Tháng phải lớn hơn 0')
            .max(12, 'Tháng phải nhỏ hơn hoặc bằng 12')
            .nullable()
            .typeError('Hãy nhập một số từ 1 đến 12')
            .integer('Tháng phải là số nguyên'),
        nam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900, 'Năm phải lớn hơn 1900')
            .nullable()
            .typeError('Năm phải là số lớn hơn 1900')
            .integer('Năm phải là số nguyên'),
        chieuCao: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0, 'Chiều cao phải lớn hơn 0')
            .typeError('Vui lòng nhập số'),
        canNang: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0, 'Cân nặng phải lớn hơn 0')
            .typeError('Vui lòng nhập số'),
        soLanTuan: Yup.number()
            .positive('Số phải lớn hơn hoặc bằng 0')
            .min(0, 'Số lần phải lớn hơn hoặc bằng 0')
            .typeError('Vui lòng nhập số'),
        dieuTrenNgay: Yup.number()
            .positive('Số phải lớn hơn hoặc bằng 0')
            .typeError('Vui lòng nhập thông tin này')
            .min(0, 'Số điếu phải lớn hơn hoặc bằng 0'),
        thuNhapVoChongBenhNhan: Yup.number()
            .positive('Số phải lớn hơn 0')
            .nullable(),
        thuNhapKhac: Yup.number().positive('Số phải lớn hơn 0').nullable(),
        ctntHoacKhamThamPhan: Yup.string().nullable(),
        ngayCTNTHoacKhamThamPhanBenhLy: Yup.string().nullable(),
        soLanCTNTTuan: Yup.number()
            .positive('Số phải lớn hơn 0')
            .typeError('Vui lòng nhập số'),
        soGioTrenLan: Yup.string().nullable(),
        chuKyThamPhan: Yup.string().nullable(),
        thuocDangSuDungNgay: Yup.string().nullable(),
        thuocTaoMau: Yup.string().nullable(),
        bacSiDieuTri: Yup.string().nullable(),
        dienThoaiBacSi: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .nullable()
            .test(
                'len',
                'Số điện thoại chỉ được sử dụng chữ số',
                (val) =>
                    /^[0-9.+]*$/.test(val) || val === undefined || val === null
            ),
        // .test('xxx', 'Số điện thoại phải bắt đầu bằng số 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        chuKyThamPhanTaiBV: Yup.string().nullable(),
        hoTenVoChong: Yup.string()
            .test(
                'lxxen',
                'Họ tên không được sử dụng ký tự đặc biệt và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .typeError('Vui lòng nhập thông tin này')
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .nullable(),
        dienThoaiVoChong: Yup.string()
            .nullable()
            .test(
                'lxxen',
                'Số điện thoại chỉ được sử dụng chữ số',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            )
            .typeError('Vui lòng nhập thông tin này')
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự'),
        // .test('xxx', 'Số điện thoại phải bắt đầu bằng số 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        thuNhapBenhNhan: Yup.number()
            .positive('Số phải lớn hơn 0')
            .required('Vui lòng nhập thông tin này')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn 0'),
        tienChuanBiChoViecGhepThan: Yup.number()
            .positive('Số phải lớn hơn 0')
            .required('Vui lòng nhập thông tin này')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn 0'),
        email: Yup.string()
            .required('Vui lòng nhập thông tin')
            .test('isEmail', 'Email không hợp lệ', (val) => {
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
            .min(0, 'Vui lòng nhập số lớn hơn 0')
            .typeError('Vui lòng nhập số'),
        truocHoacSauLocMau: Yup.number().nullable(),
        ngaydkhien: Yup.string()
            .nullable()
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'ngày đăng ký nhỏ nhất',
                'Ngày đăng ký phải lớn hơn 1/1/1900',
                (value) =>
                    new Date(value) > new Date('1/1/1900') ||
                    value === undefined
            )
            .test(
                'ngày đăng ký lớn nhất',
                'Ngày đăng ký không được vượt quá ngày hiện tại',
                (value) => new Date(value) <= new Date() || value === undefined
            ),
        chisobmi: Yup.number().nullable(),
        nambatdaudieutri: Yup.number()
            .nullable()
            .min(1900, 'Năm phải lớn hơn 1900')
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'sonamtoida',
                'Năm phải nhỏ hơn năm hiện tại',
                (value) =>
                    value <= new Date().getFullYear() || value === undefined
            ),
        sonamdieutrithaythe: Yup.number().nullable(),
        sanhconlancuoivaonam: Yup.number()
            .nullable()
            .min(1900, 'Năm phải lớn hơn 1900')
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'sonamtoida',
                'Năm phải nhỏ hơn năm hiện tại',
                (value) =>
                    value <= new Date().getFullYear() || value === undefined
            ),
        sanhconmaylan: Yup.number()
            .nullable()
            .min(0, 'Số lần phải lớn hơn 0')
            .max(1000, 'Số lần phải nhỏ hơn hoặc bằng 1000')
            .typeError('Vui lòng nhập thông tin này'),
        thoidiemtruyenmau: Yup.string()
            .nullable()
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'ngày nhỏ nhất',
                'Ngày phải lớn hơn 1/1/1900',
                (value) =>
                    new Date(value) > new Date('1/1/1900') ||
                    value === undefined
            )
            .test(
                'ngày lớn nhất',
                'Ngày không được vượt quá ngày hiện tại',
                (value) => new Date(value) <= new Date() || value === undefined
            ),
        namphathienctnttrolai: Yup.number()
            .nullable()
            .min(1900, 'Năm phải lớn hơn 1900')
            .typeError('Vui lòng nhập thông tin này')
            .test(
                'sonamtoida',
                'Năm phải nhỏ hơn năm hiện tại',
                (value) =>
                    value <= new Date().getFullYear() || value === undefined
            )
    });

    const SignupSchemaTangKhac = Yup.object().shape({
        hoTenBN: Yup.string()
            .trim()
            .test(
                'lxxen',
                'Họ tên không được sử dụng ký tự đặc biệt và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        ngheNghiep: Yup.string().trim().required('Vui lòng nhập thông tin này'),
        nhomMau: Yup.string(),

        nhomMau1: Yup.string(),
        CMNDBN: Yup.string()
            .trim()
            .required('Vui lòng nhập thông tin này')
            .min(9, 'CMND phải có ít nhất 9 số')
            .max(12, 'CMND phải có ít nhất 12 số')
            .test('len', 'CMND chỉ được sử dụng chữ số', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
        ngaySinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày sinh vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày sinh phải sau ngày 1 tháng 1 năm 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        baoHiemYTe: Yup.string()
            .trim()
            .test(
                'len',
                'Số bảo hiểm y tế chỉ được sử dụng chữ cái và số',
                (val) => /^[a-zA-Z0-9 ]*$/.test(val)
            ),
        trinhDoVanHoa: Yup.string()
            .trim()
            .required('Vui lòng nhập thông tin này'),
        dienThoai: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('xxx', 'Số điện thoại chỉ được sử dụng chữ số', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        dienThoai1: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .nullable()
            .test(
                'xxx',
                'Số điện thoại chỉ sử dụng chữ số',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        // .test('xxx', 'Số điện thoại phải bắt đầu bằng số 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        dienThoaiVoChong: Yup.string()
            .nullable()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .nullable()
            .test(
                'len',
                'Số điện thoại chỉ được sử dụng chữ số',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        diaChiThuongChu: Yup.string()
            .trim()
            .required('Vui lòng nhập thông tin này'),
        diaChiTamChu: Yup.string(),
        NgayCapCMNDBN: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày cấp vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày cấp phải sau ngày 1 tháng 1 năm 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        nguyenNhanSuyThan: Yup.string().trim().nullable(),
        ngayPhatHienSuyThan: Yup.string().nullable(),
        // .required('Vui lòng nhập thông tin này')
        // .test(
        //     'len',
        //     'Ngày vượt quá ngày hiện tại',
        //     (val) => new Date() > new Date(val)
        // )
        // .test(
        //     'len',
        //     'Ngày phải sau ngày 1 tháng 1 năm 1920',
        //     (val) => new Date('1920-1-1') < new Date(val)
        // ),
        NoiCapCMNDBN: Yup.string()
            .trim()
            .required('Vui lòng nhập thông tin này'),
        // dia chi thuong tru
        tinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        xaphuong: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        quanhuyen: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        // dia chi tam tru
        tinhtt: Yup.string().nullable(),
        xaphuongtt: Yup.string().nullable(),
        quanhuyentt: Yup.string().nullable(),
        thuocDangSuDungNgay: Yup.string().trim().nullable(),
        lonNhatSinhNam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900)
            .typeError('Năm sinh phải là số lớn hơn 1900')
            .integer('Năm sinh phải là số nguyên')
            .nullable(),
        laConThuMay: Yup.string()
            .typeError('Vui lòng nhập thông tin này')
            .required('Vui lòng nhập thông tin này'),
        coMayCon: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0')
            .nullable(),
        soConTrai: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0')
            .nullable(),
        soConGai: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0')
            .nullable(),
        nhoNhatSinhNam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900)
            .typeError('Năm sinh phải là số lớn hơn 1900')
            .integer('Năm sinh phải là số nguyên')
            .nullable(),
        baoNhieuDonViMau: Yup.number().positive('Số phải lớn hơn 0'),
        thang: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1)
            .max(12)
            .nullable()
            .typeError('Hãy nhập một số từ 1 đến 12')
            .integer('Tháng phải là số nguyên'),
        nam: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(1900)
            .nullable()
            .typeError('Năm phải là số lớn hơn 1900')
            .integer('Năm phải là số nguyên'),
        chieuCao: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0')
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        canNang: Yup.number()
            .positive('Số phải lớn hơn 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0')
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        soLanTuan: Yup.number()
            .positive('Số phải lớn hơn hoặc bằng 0')
            .min(0)
            .typeError('Hãy nhập một số lớn hơn hoặc bằng 0'),
        dieuTrenNgay: Yup.number()
            .positive('Số phải lớn hơn hoặc bằng 0')
            .min(0),
        thuNhapVoChongBenhNhan: Yup.number().positive('Số phải lớn hơn 0'),
        thuNhapKhac: Yup.number().positive('Số phải lớn hơn 0'),
        thuocTaoMau: Yup.string().trim(),
        bacSiDieuTri: Yup.string().trim(),
        dienThoaiBacSi: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .nullable()
            .test(
                'len',
                'Số điện thoại chỉ được sử dụng chữ số',
                (val) =>
                    /^[0-9.+]*$/.test(val) || val === undefined || val === null
            ),
        thuNhapBenhNhan: Yup.string().required('Vui lòng nhập thông tin này'),
        tienChuanBiChoViecGhepThan: Yup.string().required(
            'Vui lòng nhập thông tin này'
        ),
        choGhepBenh: Yup.string()
            .trim()
            .required('Vui lòng nhập')
            .typeError('Vui lòng nhập thông tin'),
        choGhepBVDieuTri: Yup.string()
            .trim()
            .required('Vui lòng nhập')
            .typeError('Vui lòng nhập thông tin'),
        hoTenVoChong: Yup.string()
            .test(
                'lxxen',
                'Họ tên không được sử dụng ký tự đặc biệt và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .nullable(),
        email: Yup.string()
            .required('Vui lòng nhập thông tin')
            .test('isEmail', 'Email không hợp lệ', (val) => {
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
            .min(0, 'Vui lòng nhập số lớn hơn 0')
            .typeError('Vui lòng nhập số')
    });
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

    const RenderEditQuanHeGiaDinh = () => {
        const [lstAnhChiEm, setLstAnhChiEm] = useState(entityObj.QhGd);
        useEffect(() => {
            dataGiaDinhEdit.current = entityObj.QhGd;
        }, []);
        const handleChange = (event, id) => {
            const {name} = event.target;
            const newItem = [...lstAnhChiEm];
            newItem[id] = {...newItem[id], [name]: event.target.value};
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
        };

        const DeleteItem = (ind) => {
            const newItem = [...lstAnhChiEm];
            newItem.splice(ind, 1);
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
            toast.info('Xóa thành công');
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
                        <i className="fas fa-plus" /> Thêm anh/chị/em
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
                                            Họ và tên
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
                                            Quan hệ
                                        </label>
                                        <Field
                                            name="QuanHeNguoiThan"
                                            as="select"
                                            key="QuanHeNguoiThan"
                                            className="form-control "
                                            value={item.QuanHeNguoiThan}
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        >
                                            <option value="">--Chọn--</option>
                                            <DropDMQHGD />
                                        </Field>
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="NamSinhNguoiThan">
                                            Sinh năm
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
                                            Nhóm máu ABO
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
                                            <option>--Chọn--</option>
                                            <DropDMNhomMau />
                                        </Field>
                                    </div>
                                </div>
                                <div className="row" key={key}>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="TrinhDoVHNguoiThan">
                                            Trình độ văn hóa
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
                                            Địa chỉ thường trú
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
                                            Số điện thoại
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
                                            Lý do không hiến được
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
                                <label htmlFor="a">Xóa</label>
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
            <>
                <Modal
                    show={
                        IsShowEditPopup &&
                        entityObj.TypePhieuDKGhepTang ===
                            TypeBoPhanConstant.than
                    }
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật đăng ký chờ ghép Thận
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                maso: entityObj.MaSo,
                                ghichu: entityObj.GhiChu,
                                namsinh: entityObj.NamSinh,
                                ngaydkhien: CommonUtility.stringToDMY(
                                    entityObj.NgayDKHien
                                ),
                                namdk: entityObj.NamDK,
                                thoigianbhyt: entityObj.thoigianBHYT,
                                chisobmi: entityObj.chisoBMI,
                                nambatdaudieutri: entityObj.nambatdaudieutri,
                                sonamdieutrithaythe:
                                    entityObj.sonamdieutrithaythe,
                                CAPD: entityObj.CAPD,
                                sanhconlancuoivaonam:
                                    entityObj.sanhconlancuoivaonam,
                                sanhconmaylan: entityObj.sanhconmaylan,
                                benhlyhethongduongtietnieu:
                                    entityObj.benhlyhethongduongtietnieu,
                                benhlytimmach: entityObj.benhlytimmach,
                                THA: entityObj.THA,
                                tiencanngoaikhoakhac:
                                    entityObj.tiencanngoaikhoakhac,
                                ngoaitietnieu: entityObj.ngoaitietnieu,
                                ngoaitongquat: entityObj.ngoaitongquat,
                                thoidiemtruyenmau: CommonUtility.stringToDMY(
                                    entityObj.thoidiemtruyenmau
                                ),
                                namphathienctnttrolai:
                                    entityObj.namphathienctnttrolai,
                                hoatri: entityObj.hoatri,
                                xatri: entityObj.xatri,
                                phauthuat: entityObj.phauthuat,
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
                                NgayTiemMui1: CommonUtility.stringToDMY(
                                    entityObj.NgayTiemMui1
                                ),
                                NgayTiemMui2: CommonUtility.stringToDMY(
                                    entityObj.NgayTiemMui2
                                ),
                                PhanUng: entityObj.PhanUng,
                                TiemVaccine2: entityObj.TiemVaccine2,
                                PhanUng2: entityObj.PhanUng2,
                                NgayTiemMui3: CommonUtility.stringToDMY(
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
                                onSaveEditEntity(ObjSave);
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
                                            I. HÀNH CHÁNH:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="hoTenBN">
                                                    Họ và tên
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
                                                <label htmlFor="maso">
                                                    Mã số bệnh nhân
                                                </label>
                                                <Field
                                                    name="maso"
                                                    key="maso"
                                                    className="form-control "
                                                />
                                                {errors.maso && touched.maso ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.maso}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="gioiTinh">
                                                    Giới tính
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
                                                        Nữ
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    Ảnh
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
                                                    Ảnh thẻ cũ
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
                                                    Ảnh thẻ mới
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
                                                    Ngày sinh
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
                                                    Nhóm máu ABO
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
                                                    <option>--Chọn--</option>
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
                                                    Nhóm máu Rh
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
                                                    <option>--Chọn--</option>
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
                                                    Bảo hiểm y tế
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
                                                <label htmlFor="ngaydkhien">
                                                    Ngày đăng ký
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ngaydkhien"
                                                    key="ngaydkhien"
                                                    className="form-control "
                                                />
                                                {errors.ngaydkhien &&
                                                touched.ngaydkhien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ngaydkhien}
                                                        </div>
                                                    </>
                                                ) : null}{' '}
                                            </div>
                                            {/* <div className="form-group col-md-2">
                                                
                                            </div> */}
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thoigianbhyt">
                                                    Thời gian đăng ký BHYT
                                                </label>
                                                <Field
                                                    name="thoigianbhyt"
                                                    key="thoigianbhyt"
                                                    className="form-control "
                                                />
                                                {errors.thoigianbhyt &&
                                                touched.thoigianbhyt ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoigianbhyt
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="CMNDBN">
                                                    CMND/ CCCD/ hộ chiếu
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
                                                    Ngày cấp
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
                                                    Nơi cấp
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
                                                    Ảnh CMND / CCCD / hộ chiếu
                                                    mặt trước
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
                                                    Ảnh CMND/CCCD mặt sau
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
                                                    Ảnh CMND/CCCD mặt trước cũ
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
                                                    Ảnh CMND/CCCD mặt trước mới
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
                                                    Ảnh CMND/CCCD mặt sau cũ
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
                                                    Ảnh CMND/CCCD mặt sau mới
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
                                                    Nghề Nghiệp
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
                                                        --Chọn--
                                                    </option>
                                                    {/* <option value="Bác sĩ">
                                                    Bác sĩ
                                                </option>
                                                <option value="Kỹ Sư">
                                                    Kỹ Sư
                                                </option>
                                                <option value="Giáo viên">
                                                    Giáo viên
                                                </option>
                                                <option value="Công nhân">
                                                    Công nhân
                                                </option> */}
                                                    {/* <RenderDropdownDanhMuc code="nghenghiep" /> */}
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
                                                    Nghề Nghiệp ghi rõ
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
                                                    Trình độ văn hóa
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
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
                                                    Điện thoại
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
                                                    Điện thoại khác
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
                                                Địa Chỉ Thường Trú :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinh"
                                                    className="chitietdiachi"
                                                >
                                                    Tỉnh/Thành Phố
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
                                                        --Chọn--
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
                                                    Quận/Huyện
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
                                                        --Chọn--
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
                                                    Xã/Phường
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
                                                        --Chọn--
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
                                                Số nhà, phố, tổ dân phố/thôn/đội
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
                                                Địa Chỉ Tạm Trú :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinhtt"
                                                    className="chitietdiachi"
                                                >
                                                    Tỉnh/Thành Phố
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
                                                        --Chọn--
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
                                                    Quận/Huyện
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
                                                        --Chọn--
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
                                                    Xã/Phường
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuongtt"
                                                    key="xaphuongtt"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Chọn--
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
                                                Số nhà, phố, tổ dân phố/thôn/đội
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
                                                    Gia đình: là con thứ mấy?
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="laConThuMay"
                                                    key="laConThuMay"
                                                    className="form-control "
                                                    placeholder="VD: là con thứ 1 trong gia đình 2 con viết là 1/2"
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
                                                    Tình trạng hôn nhân
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
                                                        Độc thân
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="1"
                                                        />{' '}
                                                        Đã có gia đình
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="hoTenVoChong">
                                                    Họ tên Vợ/Chồng:
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
                                                    Điện thoại
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
                                                    Có mấy con
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
                                                    Gái
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
                                                    Lớn nhất sinh năm
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
                                                    Nhỏ nhất sinh năm
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
                                            II.TÌNH TRẠNG BỆNH LÝ
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguyenNhanSuyThan">
                                                    1.Nguyên nhân dẫn đến suy
                                                    thận mạn giai đoạn cuối
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
                                                    2.Chẩn đoán về thận học
                                                    trước đó: có sinh thiết thận
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
                                                        Có
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="sinhThietThan"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="ketQuaSinhThietThan">
                                                    Kết quả sinh thiết
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
                                                    3.Phát hiện suy thận
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
                                                    Chạy thận nhân tạo/Thẩm phân
                                                    phúc mạc từ
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
                                                    Số lần chạy thận một tuần:
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
                                                    Vào ngày
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
                                                        Chẵn
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="CTNTVaoNgay"
                                                            value="0"
                                                        />{' '}
                                                        Lẻ
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="soGioTrenLan">
                                                    Số giờ một lần
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
                                                    Chu kỳ thẩm phân phúc mạc
                                                    (số lần/ngày)
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
                                                    Khám và theo dõi tại bệnh
                                                    viện
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
                                                    Thẩm phân phúc mạc bằng máy
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="thamPhanBangMay"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="thamPhanBangMayTaiBV">
                                                    Bệnh viện theo dõi
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
                                                    Truyền máu
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
                                                        Có
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="baoNhieuDonViMau">
                                                    Bao nhiêu đơn vị máu
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
                                                    Truyền máu lần cuối
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="vào tháng"
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
                                                <label htmlFor="nam">Năm</label>
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
                                                    Truyền máu tại bệnh viện
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
                                                    Đã ghép thận lần 1 vào ngày
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
                                                    Tại bệnh viện
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
                                                    Người cho thận
                                                    (Cha/mẹ/anh/chị/em?)
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
                                                    Ngày chạy thận nhân tạo trở
                                                    lại
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
                                                    Chẩn đoán suy chức năng thận
                                                    ghép
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
                                                    Ngày chạy thận nhân tạo/Thẩm
                                                    phân phúc mạc
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
                                                    Tại bệnh viện
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
                                                    Số lượng nước tiểu/24 giờ
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
                                                    Không
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
                                                    Có (ml/24h)
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
                                                    Chiều cao (cm)
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
                                                    Cân nặng (kg)
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
                                                    Thuốc đang sử dụng/ngày
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
                                                    Thuốc tạo máu
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
                                                    Bác sĩ điều trị
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
                                                    Điện thoại bác sĩ
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
                                                4.Bệnh lý kèm theo
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
                                                        Không bị viêm gan
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
                                                        Viêm gan siêu vi A
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
                                                        Viêm gan siêu vi B
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
                                                        Viêm gan siêu vi C
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
                                                            Viêm gan trước lọc
                                                            máu
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
                                                            Sau lọc máu
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.truocHoacSauLocMau &&
                                                touched.truocHoacSauLocMau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.truocHoacSauLocMau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>{' '}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="dieuTriViemGanTu">
                                                    Điều trị viêm gan từ lúc nào
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
                                                    Thuốc điều trị viêm gan
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
                                                        Không có tiền căn lao
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
                                                        Lao phổi
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laoCoQuanKhac">
                                                    Lao các cơ quan khác
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
                                                    Từ lúc nào
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
                                                    Thời gian điều trị/Nơi điều
                                                    trị
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
                                                    Đái tháo đường
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiDaiThaoDuong">
                                                    Từ lúc nào
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
                                                    Thuốc điều trị
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
                                                    Tăng huyết áp
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiTangHuyetAp">
                                                    Từ lúc nào
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
                                                    Thuốc điều trị
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
                                                    Các bệnh khác
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
                                                    Tình hình hiện tại
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
                                                5.Tiền căn ngoại khoa
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daPhauThuat">
                                                    Có phẫu thuật gì trước đó
                                                    không
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ngayThangPhauThuat">
                                                    Ngày tháng năm phẫu thuật
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
                                                    Phẫu thuật tại bệnh viện
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
                                                    Nếu có thì do bệnh gì
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
                                                    Tình trạng hiện tại
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
                                                    6.Thói quen nghiện rượu
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
                                                            Có
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
                                                            Không
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLanTuan">
                                                    Số lần/tuần
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
                                                    Số lượng trên lần
                                                </label>
                                                <Field
                                                    placeholder="lít/chai/lon/ly"
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
                                                    7.Thói quen hút thuốc
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
                                                            Có
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
                                                            Không
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="dieuTrenNgay">
                                                    Số điếu trên ngày
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="điếu/ngày"
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
                                                8.Tiền căn gia đình
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhThan">
                                                    Bệnh thận
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhLao">
                                                    Bệnh lao
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biDaiThaoDuong">
                                                    Đái tháo đường
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biTangHuyetAp">
                                                    Tăng huyết áp
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biUngThu">
                                                    Ung thư
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="biBenhThan">
                                                    Bệnh thận
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biBenhLao"
                                                            value="1"
                                                        />{' '}
                                                        Lao
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biDaiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        Đái tháo đường
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biTangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        Tăng huyết áp
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biUngThu"
                                                            value="1"
                                                        />{' '}
                                                        Ung thư
                                                    </label>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="biBenhKhac">
                                                    Bệnh khác
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
                                                        Sống cùng địa chỉ{' '}
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
                                                        Không cùng địa chỉ{' '}
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
                                                    Nếu có thì là ai
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
                                                    Tình trạng hiện tại
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
                                            <label htmlFor="chisobmi">
                                                9. Thông tin bổ sung
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="chisobmi">
                                                    Chỉ số BMI (%)
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="chisobmi"
                                                    key="chisobmi"
                                                    className="form-control "
                                                />
                                                {errors.chisobmi &&
                                                touched.chisobmi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.chisobmi}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="nambatdaudieutri">
                                                    Năm bắt đầu điều trị
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="nambatdaudieutri"
                                                    key="nambatdaudieutri"
                                                    className="form-control "
                                                />
                                                {errors.nambatdaudieutri &&
                                                touched.nambatdaudieutri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.nambatdaudieutri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="sonamdieutrithaythe">
                                                    Số năm điều trị thay thế
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="sonamdieutrithaythe"
                                                    key="sonamdieutrithaythe"
                                                    className="form-control "
                                                />
                                                {errors.sonamdieutrithaythe &&
                                                touched.sonamdieutrithaythe ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.sonamdieutrithaythe
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="sanhconmaylan">
                                                    Sanh con mấy lần
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="sanhconmaylan"
                                                    key="sanhconmaylan"
                                                    className="form-control "
                                                />
                                                {errors.sanhconmaylan &&
                                                touched.sanhconmaylan ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.sanhconmaylan
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="sanhconlancuoivaonam">
                                                    Sanh con lần cuối vào năm
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="sanhconlancuoivaonam"
                                                    key="sanhconlancuoivaonam"
                                                    className="form-control "
                                                />
                                                {errors.sanhconlancuoivaonam &&
                                                touched.sanhconlancuoivaonam ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.sanhconlancuoivaonam
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ngoaitongquat">
                                                    Ngoại tổng quát
                                                </label>
                                                <Field
                                                    name="ngoaitongquat"
                                                    key="ngoaitongquat"
                                                    className="form-control "
                                                />
                                                {errors.ngoaitongquat &&
                                                touched.ngoaitongquat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngoaitongquat
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ngoaitietnieu">
                                                    Ngoại tiết niệu
                                                </label>
                                                <Field
                                                    name="ngoaitietnieu"
                                                    key="ngoaitietnieu"
                                                    className="form-control "
                                                />
                                                {errors.ngoaitietnieu &&
                                                touched.ngoaitietnieu ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ngoaitietnieu
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="tiencanngoaikhoakhac">
                                                    Tiền căn ngoại khoa khác
                                                </label>
                                                <Field
                                                    name="tiencanngoaikhoakhac"
                                                    key="tiencanngoaikhoakhac"
                                                    className="form-control "
                                                />
                                                {errors.tiencanngoaikhoakhac &&
                                                touched.tiencanngoaikhoakhac ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.tiencanngoaikhoakhac
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoidiemtruyenmau">
                                                    Thời điểm truyền máu
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="thoidiemtruyenmau"
                                                    key="thoidiemtruyenmau"
                                                    className="form-control "
                                                />
                                                {errors.thoidiemtruyenmau &&
                                                touched.thoidiemtruyenmau ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.thoidiemtruyenmau
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="namphathienctnttrolai">
                                                    Năm phát hiện CTNT trở lại
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="namphathienctnttrolai"
                                                    key="namphathienctnttrolai"
                                                    className="form-control "
                                                />
                                                {errors.namphathienctnttrolai &&
                                                touched.namphathienctnttrolai ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.namphathienctnttrolai
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="phauthuat">
                                                    Thông tin phẫu thuật
                                                </label>
                                                <Field
                                                    name="phauthuat"
                                                    key="phauthuat"
                                                    className="form-control "
                                                />
                                                {errors.phauthuat &&
                                                touched.phauthuat ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.phauthuat}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="xatri"
                                                        key="xatri"
                                                        id="xatri"
                                                        className="custom-control-input"
                                                        checked={values.xatri}
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="xatri"
                                                    >
                                                        Xạ trị
                                                    </label>
                                                    {errors.xatri &&
                                                    touched.xatri ? (
                                                        <div className="invalid-feedback">
                                                            {errors.xatri}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="hoatri"
                                                        key="hoatri"
                                                        id="hoatri"
                                                        className="custom-control-input"
                                                        checked={values.hoatri}
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="hoatri"
                                                    >
                                                        Hoá trị
                                                    </label>
                                                    {errors.hoatri &&
                                                    touched.hoatri ? (
                                                        <div className="invalid-feedback">
                                                            {errors.hoatri}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="benhlyhethongduongtietnieu"
                                                        key="benhlyhethongduongtietnieu"
                                                        id="benhlyhethongduongtietnieu"
                                                        className="custom-control-input"
                                                        checked={
                                                            values.benhlyhethongduongtietnieu
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="benhlyhethongduongtietnieu"
                                                    >
                                                        Bệnh lý hệ thống đường
                                                        tiết niệu
                                                    </label>
                                                    {errors.benhlyhethongduongtietnieu &&
                                                    touched.benhlyhethongduongtietnieu ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhlyhethongduongtietnieu
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="benhlytimmach"
                                                        key="benhlytimmach"
                                                        id="benhlytimmach"
                                                        className="custom-control-input"
                                                        checked={
                                                            values.benhlytimmach
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="benhlytimmach"
                                                    >
                                                        Bệnh lý tim mạch
                                                    </label>
                                                    {errors.benhlytimmach &&
                                                    touched.benhlytimmach ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.benhlytimmach
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="THA"
                                                        key="THA"
                                                        id="THA"
                                                        className="custom-control-input"
                                                        checked={values.THA}
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="THA"
                                                    >
                                                        THA
                                                    </label>
                                                    {errors.THA &&
                                                    touched.THA ? (
                                                        <div className="invalid-feedback">
                                                            {errors.THA}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-group custom-checkbox col-md-3">
                                                <br />
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="CAPD"
                                                        key="CAPD"
                                                        id="CAPD"
                                                        className="custom-control-input"
                                                        checked={values.CAPD}
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="CAPD"
                                                    >
                                                        CAPD
                                                    </label>
                                                    {errors.CAPD &&
                                                    touched.CAPD ? (
                                                        <div className="invalid-feedback">
                                                            {errors.CAPD}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 no-padding">
                                            <label htmlFor="NhiemCovid">
                                                10. Tiền sử covid
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
                                                        Không bị nhiễm covid
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
                                                        Bị nhiễm trước tiêm
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
                                                        Bị nhiễm sau tiêm
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
                                                        Không có triệu chứng
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
                                                        Triệu chứng nhẹ
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
                                                        Triệu chúng trung bình
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
                                                        Nhập viện
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
                                                    Thời gian nằm viện(ngày)
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
                                                        Thở máy
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
                                                        Thở HFNC
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
                                                11. Tiêm vaccine ngừa covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine">
                                                    Tiêm vaccine ngừa covid mũi
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
                                                    Ngày tiêm mũi 1
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
                                                    Phản ứng sau tiêm mũi 1
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
                                                    Tiêm vaccine ngừa covid mũi
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
                                                    Ngày tiêm mũi 2
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
                                                    Phản ứng sau tiêm mũi 2
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
                                                    Tiêm vaccine ngừa covid mũi
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
                                                    Ngày tiêm mũi 3
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
                                                    Phản ứng sau tiêm mũi 3
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
                                            III. KINH TẾ:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapBenhNhan">
                                                    Thu nhập của bệnh nhân
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Thu nhập của Vợ hoặc Chồng
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Nghề nghiệp
                                                </label>
                                                <Field
                                                    name="ngheNghiepVoChong"
                                                    key="ngheNghiepVoChong"
                                                    className="form-control "
                                                />
                                                {/* <option value="">
                                                    --Chọn--
                                                </option>
                                                <option value="Bác sĩ">
                                                    Bác sĩ
                                                </option>
                                                <option value="Kỹ Sư">
                                                    Kỹ Sư
                                                </option>
                                                <option value="Giáo viên">
                                                    Giáo viên
                                                </option>
                                                <option value="Công nhân">
                                                    Công nhân
                                                </option>
                                                <RenderDropdownDanhMuc code="nghenghiep" /> 
                                            </Field> */}

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
                                                    Thu nhập khác
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Tiền chuẩn bị cho việc ghép
                                                    thận (có sẵn)
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
                                            IV. LÝ DO ĐĂNG KÝ CHỜ GHÉP THẬN TỪ
                                            NGƯỜI HIẾN CHẾT NÃO:
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
                                                    Không có người hiến thận
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
                                                    Người hiến bị bệnh
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
                                                    Người hiến không hòa hợp
                                                    nhóm máu
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
                                                Lý do khác
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
                                            VI. QUAN HỆ GIA ĐÌNH:
                                        </div>
                                        {RenderEditQuanHeGiaDinh()}
                                    </div>
                                    <div className="col-md-12 no-padding camket">
                                        <div className="solama">
                                            VI. CAM KẾT ĐĂNG KÝ CHỜ GHÉP THẬN TỪ
                                            NGƯỜI HIẾN CHẾT NÃO HAY TIM NGỪNG
                                            ĐẬP
                                        </div>
                                        <div className="form-group col-md-12">
                                            <span>
                                                Hiện tôi bị bệnh suy thận mạn
                                                giai đoạn cuối đang phải lọc máu
                                                định kỳ, có chỉ định ghép thận.
                                                Tôi đã được các bác sĩ phụ trách
                                                giải thích rõ về các bước thực
                                                hiện đánh giá tình trạng sức
                                                khỏe chung, thực hiện quá trình
                                                tuyển chọn, thời gian chờ đợi,
                                                tác dụng phụ của thuốc ức chế
                                                miễn dịch điều trị sau ghép
                                                thận, chi phí ghép thận, chuẩn
                                                bị môi trường và cách sinh hoạt
                                                sau khi được ghép thận….. Tôi
                                                xin được đăng ký vào danh sách
                                                chờ ghép thận từ người hiến chết
                                                não hay tim ngừng đập tại Bệnh
                                                viện Chợ Rẫy, tôi cam kết tuân
                                                thủ các quy định trong quá trình
                                                điều trị bệnh trước và sau ghép
                                                thận.
                                            </span>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
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
            <>
                <Modal
                    show={
                        IsShowEditPopup &&
                        entityObj.TypePhieuDKGhepTang !==
                            TypeBoPhanConstant.than
                    }
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật đăng ký chờ ghép
                            {/* {typeCreate} */}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                truocHoacSauLocMau:
                                    entityObj.TruocHoacSauLocMau,
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
                                NgayTiemMui1: CommonUtility.stringToDMY(
                                    entityObj.NgayTiemMui1
                                ),
                                NgayTiemMui2: CommonUtility.stringToDMY(
                                    entityObj.NgayTiemMui2
                                ),
                                PhanUng: entityObj.PhanUng,
                                TiemVaccine2: entityObj.TiemVaccine2,
                                PhanUng2: entityObj.PhanUng2,
                                NgayTiemMui3: CommonUtility.stringToDMY(
                                    entityObj.NgayTiemMui3
                                ),
                                TiemVaccine3: entityObj.TiemVaccine3,
                                PhanUng3: entityObj.PhanUng3,
                                maso: entityObj.MaSo
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

                                onSaveEditEntity(ObjSave);
                                // kiem tra xem du 2 cmnd
                                // if (CMNDtruoc && CMNDsau) {
                                //     onSaveEditEntity(ObjSave);
                                // } else {
                                //     toast.error('Bạn thiếu ảnh CMND');
                                // }

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
                                            I. HÀNH CHÁNH:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="hoTenBN">
                                                    Họ và tên
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
                                                <label htmlFor="maso">
                                                    Mã số bệnh nhân
                                                </label>
                                                <Field
                                                    name="maso"
                                                    key="maso"
                                                    className="form-control "
                                                />
                                                {errors.maso && touched.maso ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.maso}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="gioiTinh">
                                                    Giới tính
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
                                                        Nữ
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="ImageSrc">
                                                    Ảnh
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
                                                    Ảnh thẻ cũ
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
                                                    Ảnh thẻ mới
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
                                                    Ngày sinh
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
                                                    Nhóm máu ABO
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
                                                    <option>--Chọn--</option>
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
                                                    Nhóm máu Rh
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
                                                    <option>--Chọn--</option>
                                                    {/* <option value="A">A</option>
                                                <option value="AB">AB</option>
                                                <option value="B">B</option>
                                                <option value="O">O</option> */}
                                                    {/* <RenderDropdownDanhMuc code="nhommau" /> */}
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
                                                    Bảo hiểm y tế
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
                                                    CMND/ CCCD/ hộ chiếu
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
                                                    Ngày cấp
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
                                                    Nơi cấp
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
                                                    Ảnh CMND / CCCD / hộ chiếu
                                                    mặt trước
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
                                                    Ảnh CMND/CCCD mặt sau
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
                                                    Ảnh CMND/CCCD mặt trước cũ
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
                                                    Ảnh CMND/CCCD mặt trước mới
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
                                                    Ảnh CMND/CCCD mặt sau cũ
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
                                                    Ảnh CMND/CCCD mặt sau mới
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
                                                    Nghề Nghiệp
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
                                                        --Chọn--
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
                                                    Nghề Nghiệp ghi rõ
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
                                                    Trình độ văn hóa
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
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
                                                    Điện thoại
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
                                                    Điện thoại khác
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
                                                Địa Chỉ Thường Trú :
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinh"
                                                    className="chitietdiachi"
                                                >
                                                    Tỉnh/Thành Phố
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
                                                        --Chọn--
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
                                                    Quận/Huyện
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
                                                        --Chọn--
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
                                                    Xã/Phường
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
                                                        --Chọn--
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
                                                Số nhà, phố, tổ dân phố/thôn/đội
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
                                                Địa Chỉ Tạm Trú :
                                            </label>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="tinhtt"
                                                    className="chitietdiachi"
                                                >
                                                    Tỉnh/Thành Phố
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
                                                        --Chọn--
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
                                                    Quận/Huyện
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
                                                        --Chọn--
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
                                                    Xã/Phường
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="xaphuongtt"
                                                    key="xaphuongtt"
                                                    className="form-control "
                                                >
                                                    <option value="">
                                                        --Chọn--
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
                                                Số nhà, phố, tổ dân phố/thôn/đội
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
                                                    Gia đình: là con thứ mấy?
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    name="laConThuMay"
                                                    key="laConThuMay"
                                                    className="form-control "
                                                    placeholder="VD: là con thứ 1 trong gia đình 2 con viết là 1/2"
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
                                                    Tình trạng hôn nhân
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
                                                        Độc thân
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="tinhTrangHonNhan"
                                                            value="1"
                                                        />{' '}
                                                        Đã có gia đình
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="hoTenVoChong">
                                                    Họ tên Vợ/Chồng:
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
                                                    Điện thoại
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
                                                    Có mấy con
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
                                                    Gái
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
                                                    Lớn nhất sinh năm
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
                                                    Nhỏ nhất sinh năm
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
                                            II.TÌNH TRẠNG BỆNH LÝ
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguyenNhanSuyThan">
                                                    1.Nguyên nhân dẫn đến suy{' '}
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
                                                    2.Phát hiện suy{' '}
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
                                                    Truyền máu
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
                                                        Có
                                                    </label>
                                                    <label htmlFor>
                                                        <Field
                                                            type="radio"
                                                            name="truyenMau"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="baoNhieuDonViMau">
                                                    Bao nhiêu đơn vị máu
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
                                                    Truyền máu lần cuối
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="vào tháng"
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
                                                <label htmlFor="nam">Năm</label>
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
                                                    Truyền máu tại bệnh viện
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
                                                    Chiều cao (cm)
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
                                                    Cân nặng (kg)
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
                                                    Thuốc đang sử dụng/ngày
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
                                                    Thuốc tạo máu
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
                                                    Bác sĩ điều trị
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
                                                    Điện thoại bác sĩ
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
                                                3.Bệnh lý kèm theo
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
                                                        Không bị viêm gan
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
                                                        Viêm gan siêu vi A
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
                                                        Viêm gan siêu vi B
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
                                                        Viêm gan siêu vi C
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
                                                            Viêm gan trước lọc
                                                            máu
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
                                                            Sau lọc máu
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>{' '}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="dieuTriViemGanTu">
                                                    Điều trị viêm gan từ lúc nào
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
                                                    Thuốc điều trị viêm gan
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
                                                        Không có tiền căn lao
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
                                                        Lao phổi
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="laoCoQuanKhac">
                                                    Lao các cơ quan khác
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
                                                    Từ lúc nào
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
                                                    Thời gian điều trị/Nơi điều
                                                    trị
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
                                                    Đái tháo đường
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daiThaoDuong"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiDaiThaoDuong">
                                                    Từ lúc nào
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
                                                    Thuốc điều trị
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
                                                    Tăng huyết áp
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="tangHuyetAp"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="thoiGianBiTangHuyetAp">
                                                    Từ lúc nào
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
                                                    Thuốc điều trị
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
                                                    Các bệnh khác
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
                                                    Tình hình hiện tại
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
                                                4.Tiền căn ngoại khoa
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="daPhauThuat">
                                                    Có phẫu thuật gì trước đó
                                                    không
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
                                                        Có
                                                    </label>
                                                    <label htmlFor="a">
                                                        <Field
                                                            type="radio"
                                                            name="daPhauThuat"
                                                            value="0"
                                                        />{' '}
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ngayThangPhauThuat">
                                                    Ngày tháng năm phẫu thuật
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
                                                    Phẫu thuật tại bệnh viện
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
                                                    Nếu có thì do bệnh gì
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
                                                    Tình trạng hiện tại
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
                                                    5.Thói quen nghiện rượu
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
                                                            Có
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
                                                            Không
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-3">
                                                <label htmlFor="soLanTuan">
                                                    Số lần/tuần
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
                                                    Số lượng trên lần
                                                </label>
                                                <Field
                                                    placeholder="lít/chai/lon/ly"
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
                                                    6.Thói quen hút thuốc
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
                                                            Có
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
                                                            Không
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="dieuTrenNgay">
                                                    Số điếu trên ngày
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="điếu/ngày"
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
                                                7.Tiền căn gia đình
                                            </label>
                                        </div>{' '}
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhThan">
                                                    Bệnh{' '}
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biBenhLao">
                                                    Bệnh lao
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biDaiThaoDuong">
                                                    Đái tháo đường
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biTangHuyetAp">
                                                    Tăng huyết áp
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label htmlFor="biUngThu">
                                                    Ung thư
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="biBenhThan">
                                                   
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
                                                        Có
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
                                                        Không
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biBenhLao"
                                                            value="1"
                                                        />{' '}
                                                        Lao
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biDaiThaoDuong"
                                                            value="1"
                                                        />{' '}
                                                        Đái tháo đường
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biTangHuyetAp"
                                                            value="1"
                                                        />{' '}
                                                        Tăng huyết áp
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <div
                                                    role="group"
                                                    aria-labelledby="my-radio-group"
                                                >
                                                    <label
                                                        htmlFor="a"
                                                        className="mgr15"
                                                    >
                                                        <Field
                                                            type="checkbox"
                                                            name="biUngThu"
                                                            value="1"
                                                        />{' '}
                                                        Ung thư
                                                    </label>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="biBenhKhac">
                                                    Bệnh khác
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
                                                        Sống cùng địa chỉ{' '}
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
                                                        Không cùng địa chỉ{' '}
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
                                                    Nếu có thì là ai
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
                                                    Tình trạng hiện tại
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
                                                8. Tiền sử covid
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
                                                        Không bị nhiễm covid
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
                                                        Bị nhiễm trước tiêm
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
                                                        Bị nhiễm sau tiêm
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
                                                        Không có triệu chứng
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
                                                        Triệu chứng nhẹ
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
                                                        Triệu chúng trung bình
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
                                                        Nhập viện
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
                                                    Thời gian nằm viện(ngày)
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
                                                        Thở máy
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
                                                        Thở HFNC
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
                                                9. Tiêm vaccine ngừa covid
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="TiemVaccine">
                                                    Tiêm vaccine ngừa covid lần
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
                                                    Ngày tiêm mũi 1
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
                                                    Phản ứng sau tiêm lần 1
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
                                                    Tiêm vaccine ngừa covid lần
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
                                                    Ngày tiêm mũi 2
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
                                                    Phản ứng sau tiêm lần 2
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
                                                    Tiêm vaccine ngừa covid mũi
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
                                                    Ngày tiêm mũi 3
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
                                                    Phản ứng sau tiêm mũi 3
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
                                            III. KINH TẾ:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="thuNhapBenhNhan">
                                                    Thu nhập của bệnh nhân
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Thu nhập của Vợ hoặc Chồng
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Nghề nghiệp
                                                </label>
                                                <Field
                                                    name="ngheNghiepVoChong"
                                                    key="ngheNghiepVoChong"
                                                    className="form-control "
                                                />
                                                {/* <option value="">
                                                    --Chọn--
                                                </option>
                                                <option value="Bác sĩ">
                                                    Bác sĩ
                                                </option>
                                                <option value="Kỹ Sư">
                                                    Kỹ Sư
                                                </option>
                                                <option value="Giáo viên">
                                                    Giáo viên
                                                </option>
                                                <option value="Công nhân">
                                                    Công nhân
                                                </option>
                                                <RenderDropdownDanhMuc code="nghenghiep" /> 
                                            </Field> */}

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
                                                    Thu nhập khác
                                                </label>
                                                <Field
                                                    placeholder="VND/Tháng"
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
                                                    Tiền chuẩn bị cho việc ghép{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        String(
                                                            values.typePhieuDKGhepTang
                                                        ).toLowerCase()
                                                    )}
                                                    (có sẵn)
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
                                            IV. LÝ DO ĐĂNG KÝ CHỜ GHÉP{' '}
                                            {TypeBoPhanConstant.GetName(
                                                String(
                                                    values.typePhieuDKGhepTang
                                                ).toLowerCase()
                                            )}{' '}
                                            TỪ NGƯỜI HIẾN CHẾT NÃO:
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
                                                    Không có người hiến{' '}
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
                                                    Người hiến bị bệnh
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
                                                    Người hiến không hòa hợp
                                                    nhóm máu
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
                                                Lý do khác
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
                                            VI. QUAN HỆ GIA ĐÌNH:
                                        </div>
                                        {RenderEditQuanHeGiaDinh()}
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            VI. CAM KẾT ĐĂNG KÝ CHỜ GHÉP{' '}
                                            <p
                                                style={{
                                                    textTransform: 'uppercase',
                                                    display: 'inline'
                                                }}
                                            >
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                            </p>{' '}
                                            TỪ NGƯỜI HIẾN CHẾT NÃO HAY TIM NGỪNG
                                            ĐẬP
                                        </div>
                                        <div
                                            className="form-group col-md-12"
                                            style={{
                                                lineHeight: '30px',
                                                textAlign: 'justify'
                                            }}
                                        >
                                            <span>
                                                Hiện tôi bị bệnh{' '}
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
                                                đang được điều trị tại{' '}
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
                                                , có chỉ định ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                                . Tôi đã được các bác sĩ phụ
                                                trách giải thích rõ về các bước
                                                thực hiện đánh giá tình trạng
                                                sức khỏe chung, thực hiện quá
                                                trình tuyển chọn, thời gian chờ
                                                đợi, tác dụng phụ của thuốc ức
                                                chế miễn dịch điều trị sau ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                                , chi phí ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                                , chuẩn bị môi trường và cách
                                                sinh hoạt sau khi được ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                                . Tôi xin được đăng ký vào danh
                                                sách chờ ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}{' '}
                                                từ người hiến chết não hay tim
                                                ngừng đập tại Bệnh viện Chợ Rẫy,
                                                tôi cam kết tuân thủ các quy
                                                định trong quá trình điều trị
                                                bệnh trước và sau ghép{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    typeCreate
                                                )}
                                                .
                                            </span>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    const RenderGioiTinh = (gt) => {
        switch (gt) {
            case 0:
                return 'Nữ';
            case 1:
                return 'Nam';
            default:
                return '';
        }
    };

    return (
        <>
            <EditModal />
            <EditModalKhac />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditEntity: (id) => {
        dangKyChoGhepTangService.OpenEditModalSV(dispatch, id);
    }
    // onCloseEntityEditModal: (id) => {
    //     dispatch({type: DANGKYCHOGHEPTANG_EDIT_CLOSE});
    // }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkychogheptang.lstEntity,
    IsUpdate: state.dangkychogheptang.IsUpdate,
    // entityObj: state.dangkychogheptang.entityObj,
    showDetailModal: state.dangkychogheptang.showDetailModal,
    showEditModal: state.dangkychogheptang.showEditModal,
    showCreateModal: state.dangkychogheptang.showCreateModal,
    isInit: state.dangkychogheptang.isInit,
    showChangeStatusModal: state.dangkychogheptang.showChangeStatusModal,
    searchModel: state.dangkychogheptang.searchModel,
    statusNew: state.dangkychogheptang.statusNew,
    showThongBaoXNModal: state.dangkychogheptang.showThongBaoXNModal,
    typeCreate: state.dangkychogheptang.typeCreate
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DangKyChoGhepTangEditAdm);
