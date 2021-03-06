import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import {NotFoundImage} from '@modules/Common/NotFound';
import {
    removeAscent,
    stringToDMY,
    canhbaoError
} from '@modules/Common/CommonUtility';
import * as Constant from '@app/Constant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';
import * as DataTokenService from '@app/services/DataTokenService';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import {connect} from 'react-redux';
import $ from 'jquery';
import axios from 'axios';
import {Link, Switch, Router, Route, useParams} from 'react-router-dom';
import {
    Container,
    Modal,
    Row,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card
} from 'react-bootstrap';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {
    loadCaptchaEnginge,
    LoadCanvasTemplate,
    LoadCanvasTemplateNoReload,
    validateCaptcha
} from 'react-simple-captcha';
import {toast} from 'react-toastify';
import * as CommonUtility from '@modules/Common/CommonUtility';
import DsTinMoi from '@modules/Home/DsTinMoi';
import * as Yup from 'yup';
import {Page} from 'react-pdf';
import {Document} from 'react-pdf/dist/esm/entry.webpack';
import ReactLoading from 'react-loading';

const selecct = '';
const PDKGhepCoQuanKhac = '/PDKGhepCoQuanKhac';

// function Ketquaghep() {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     // eslint-disable-next-line no-shadow
//     function onDocumentLoadSuccess({numPages}) {
//         setNumPages(numPages);
//     }
//     return (
//         <div style={{padding: '10px', margin: '0 auto'}}>
//             <div style={{textAlign: 'center', paddingTop: '30px'}}>
//                 <p
//                     style={{textTransform: 'uppercase', fontSize: '30px'}}
//                     className="headerClientPage"
//                 >
//                     ????ng k?? ch??? gh??p t???ng th??nh c??ng
//                 </p>
//             </div>
//             <Document
//                 file={`${window.location.origin}/Phi???u ????ng k?? ch??? gh??p.pdf`}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 style={{margin: 'auto'}}
//             >
//                 {
//                     // eslint-disable-next-line prefer-spread
//                     Array.apply(null, Array(numPages))
//                         .map((x, i) => i + 1)
//                         .map((page) => (
//                             <Page pageNumber={page} scale={1} />
//                         ))
//                 }
//             </Document>
//         </div>
//     );
// }
const PDKGhep = (props) => {
    const formRef = useRef();
    const dataGiaDinh = useRef([]);
    const [IsDone, setIsDone] = useState({state: false, data: {}});
    const [Select, setSelect] = useState(''); // hien border cho cac lua chon co quan ghep
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const {LoadDataToken, LoadFileDangKy, FileKhacDK, datatoken} = props;
    const [isload, setisload] = useState(false);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);
    const [NhomMauRh, setNhomMauRh] = useState([]);

    const [QHGD, setQHGD] = useState([]);
    useEffect(async () => {
        LoadDataToken();
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

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
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
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t??? kh??ng ph???i kho???ng tr???ng')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        ngheNghiep: Yup.string().trim().required('Vui l??ng nh???p th??ng tin n??y'),
        nhomMau: Yup.string().trim(),
        nhomMau1: Yup.string().trim(),
        CMNDBN: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .min(9, 'CMND ph???i c?? ??t nh???t 9 s???')
            .max(12, 'CMND c?? t???t ??a 12 s???')
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
            .required('Vui l??ng nh???p th??ng tin n??y')
            .max(15, 'B???o hi???m y t??? c?? t???t ??a 15 k?? t???')
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
                    /^[0-9.+]*$/.test(val) || val === undefined || val === null
            ),
        // .test('xxx', 'S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0', (val) => {
        //     if (val !== undefined) {
        //         return val.charAt(0) === '0';
        //     }
        //     return true;
        // }),
        dienThoaiVoChong: Yup.string()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .nullable()
            .test(
                'len',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9.+]*$/.test(val) || val === undefined || val === null
            ),
        diaChiThuongChu: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin n??y'),
        diaChiTamChu: Yup.string().trim(),
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
        ngayPhatHienSuyThan: Yup.string(),
        // .nullable()
        // .test(
        //     'len',
        //     'Ng??y v?????t qu?? ng??y hi???n t???i',
        //     (val) => new Date() > new Date(val)
        // )
        // .test(
        //     'len',
        //     'Ng??y ph???i sau ng??y 1 th??ng 1 n??m 1920',
        //     (val) => new Date('1920-1-1') < new Date(val)
        // ),
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
        tinhtt: Yup.string(),
        xaphuongtt: Yup.string(),
        quanhuyentt: Yup.string(),
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
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('H??y nh???p m???t s??? l???n h??n ho???c b???ng 0'),
        canNang: Yup.number()
            .positive('S??? ph???i l???n h??n 0')
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
                'len',
                'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???',
                (val) =>
                    /^[0-9.+]*$/.test(val) || val === undefined || val === null
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
        choGhepBenh: Yup.string().trim().required('Vui l??ng nh???p'),
        choGhepBVDieuTri: Yup.string().trim().required('Vui l??ng nh???p'),
        email: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')

            .test('isEmail', 'Email kh??ng h???p l???', (val) => {
                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return (
                    isEmail.test(val) ||
                    val === '' ||
                    val === undefined ||
                    val === null
                );
            })
    });
    const RenderQuanHeGiaDinh = () => {
        const [lstAnhChiEm, setLstAnhChiEm] = useState([{}]);
        const handleChange = (event, id) => {
            const {name} = event.target;
            const newItem = [...lstAnhChiEm];
            newItem[id] = {...newItem[id], [name]: event.target.value};
            setLstAnhChiEm(newItem);
            dataGiaDinh.current = lstAnhChiEm;
        };

        const DeleteItem = (ind) => {
            const newItem = [...lstAnhChiEm];
            newItem.splice(ind, 1);
            setLstAnhChiEm(newItem);
            dataGiaDinh.current = lstAnhChiEm;
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
                        <i className="fas fa-plus" /> Th??m th??ng tin quan h??? gia
                        ????nh
                    </Button>
                </div>
                {lstAnhChiEm.map((item, key) => {
                    return (
                        <div className="row" key={key}>
                            <div className="col-md-11 col-sm-11">
                                <div className="row">
                                    <div className="form-group col-md-6 col-sm-6">
                                        <label htmlFor="hoTenNguoiThan">
                                            H??? v?? t??n
                                        </label>
                                        <Field
                                            name="hoTenNguoiThan"
                                            key="hoTenNguoiThan"
                                            value={item.HoTenNguoiThan}
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="quanHeNguoiThan">
                                            Quan h???
                                        </label>
                                        <Field
                                            as="select"
                                            name="quanHeNguoiThan"
                                            key="quanHeNguoiThan"
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        >
                                            <option value="">--Ch???n--</option>
                                            <DropDMQHGD />
                                        </Field>
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="namSinhNguoiThan">
                                            Sinh n??m
                                        </label>
                                        <Field
                                            type="number"
                                            name="namSinhNguoiThan"
                                            key="namSinhNguoiThan"
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="nhomMauNguoiThan">
                                            Nh??m m??u ABO
                                        </label>

                                        <Field
                                            as="select"
                                            name="nhomMauNguoiThan"
                                            key="nhomMauNguoiThan"
                                            className="form-control "
                                            onChange={(event) =>
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
                                        <label htmlFor="trinhDoVHNguoiThan">
                                            Tr??nh ????? v??n h??a
                                        </label>

                                        <Field
                                            name="trinhDoVHNguoiThan"
                                            key="trinhDoVHNguoiThan"
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-4 col-sm-4">
                                        <label htmlFor="diaChiThuongTruNguoiThan">
                                            ?????a ch??? th?????ng tr??
                                        </label>
                                        <Field
                                            name="diaChiThuongTruNguoiThan"
                                            key="diaChiThuongTruNguoiThan"
                                            className="form-control "
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-2 col-sm-2">
                                        <label htmlFor="dienThoaiNguoiThan">
                                            S??? ??i???n tho???i
                                        </label>
                                        <Field
                                            name="dienThoaiNguoiThan"
                                            key="dienThoaiNguoiThan"
                                            className="form-control "
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
                                            onChange={(event) =>
                                                handleChange(event, key)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-1 col-sm-1">
                                <div> </div>
                                <div>
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
                        </div>
                    );
                })}
            </div>
        );
    };
    function Ketquaghep() {
        return (
            <div style={{padding: '10px', margin: '0 auto'}}>
                <embed src={FileKhacDK.PathPDF} width="100%" height="500px" />
            </div>
        );
    }
    const RenderKetQuaGhep = () => {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="pdk-hien-tieude">
                        <div className="headerClientPage">
                            {IsDone.data.HoTenBN} G???I ????N ????NG K?? CH??? GH??P{' '}
                            {IsDone.data.TenCoQuan} TH??NH C??NG{' '}
                        </div>
                    </div>
                    <div>
                        <div className="Bold20">
                            T??? ph??? tr??ch: Ti???p nh???n ????ng k?? c???n gh??p{' '}
                            {IsDone.data.TenCoQuan}
                        </div>
                        <div className="paddingleft10">
                            <div>K??nh g???i: {IsDone.data.HoTenBN}</div>
                            <div>Ch??ng t??i xin tr??n tr???ng th??ng tin ?????n</div>
                            <div>
                                ??ng/B??: {IsDone.data.HoTenBN}. sinh ng??y:{' '}
                                {CommonUtility.ShowDateVN(IsDone.data.NgaySinh)}
                            </div>
                            <div>
                                ?????a ch??? th?????ng tr??:{' '}
                                {IsDone.data.DiaChiThuongChu},{' '}
                                {IsDone.data.TenXa}, {IsDone.data.TenHuyen},{' '}
                                {IsDone.data.TenTinh}
                            </div>
                            <div>
                                Ch??ng t??i ???? nh???n ???????c th??ng tin ????ng k?? c???a
                                ??ng/B?? v??o ng??y:{' '}
                                {CommonUtility.ShowDateVN(
                                    IsDone.data.CreatedDate
                                )}
                            </div>
                            <div>
                                Hi???n t???i ch??ng t??i ??ang x??? l?? s??? th??ng b??o l???i
                                k???t qu??? v???i ??ng/b?? trong th???i gian s???m nh???t
                            </div>
                            <div>Tr??n tr???ng./.</div>
                            <div className="alert alert-warning">
                                <div>
                                    ????? ho??n t???t qu?? tr??nh ????ng k?? vui l??ng t???i
                                    xu???ng ????n ????ng k?? sau ???? k?? x??c nh???n v?? g???i
                                    t???i ?????a ch??? nh?? sau:
                                </div>
                                <div>
                                    <ul>
                                        <li>
                                            <b>
                                                ????N V??? ??I???U PH???I GH??P C??C B???
                                                PH???N C?? TH??? NG?????I B???NH VI???N CH???
                                                R???Y
                                            </b>
                                        </li>
                                        <li>
                                            ?????a ch???: 201B Nguy???n Ch?? Thanh,
                                            Ph?????ng 12, Qu???n 5, H??? Ch?? Minh, Vi???t
                                            Nam
                                        </li>
                                        <li>
                                            ??i???n tho???i trong gi??? h??nh ch??nh:
                                            (84-028) 38554137 ??? 1184 hay
                                            (84-028) 39560139 | Fax: (84-028)
                                            39560139
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pdk-hien-tieude">
                        XEM L???I K???T QU??? ????NG K??
                    </div>

                    <div className="center">
                        <Ketquaghep />
                        <Button className="mgb15" variant="primary" size="sm">
                            <a
                                className="White"
                                href={`${Constant.PathServer}/${FileKhacDK.PathWord}`}
                                download
                            >
                                <i className="fas fa-download" />
                                T???i xu???ng ????n ????ng k??
                            </a>
                        </Button>{' '}
                        {/* <Button variant="primary" size="sm" onClick={() => {}}>
                            C???p nh???t th??ng tin
                        </Button>{' '} */}
                    </div>
                </div>
            </div>
        );
    };
    const SaveDataNew = (ObjSave) => {
        fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/Create`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(ObjSave)
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    toast.success('????ng k?? th??nh c??ng');
                    setIsDone({
                        state: true,
                        data: json.Data
                    });
                    LoadFileDangKy(json.Data.Id);
                } else {
                    toast.error(json.MessageError);
                }
                setisload(false);
            });
    };
    function RenderLuaChonBoPhanGhep() {
        const tim = 'tim';
        return (
            <div>
                <div style={{textAlign: 'center', paddingTop: '30px'}}>
                    <p className="headerClientPage choncoquandkchoghep">
                        ch???n c?? quan ????ng k?? ch??? gh??p
                    </p>
                </div>
                <Row>
                    <Col md={12}>
                        <div className="grid-container" id="boxTangGrid">
                            {/* <a href="/#/PDKGhep">
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'Than'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_05-11.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Th???n</p>
                                </div>
                            </a> */}

                            <Link to={`${PDKGhepCoQuanKhac}/tim`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'tim'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img src="/images/bophan_03.gif" alt="" />
                                    <p className="lbl">Tim</p>
                                </div>
                            </Link>

                            <Link to={`${PDKGhepCoQuanKhac}/phoi`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'phoi'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_06-09.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Ph???i</p>
                                </div>
                            </Link>

                            <Link to={`${PDKGhepCoQuanKhac}/gan`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'gan'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_24-24.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Gan</p>
                                </div>
                            </Link>

                            <Link to={`${PDKGhepCoQuanKhac}/giacmac`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'giacmac'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    {/* <img src="/images/mat.png" alt="" /> */}
                                    <img src="/images/bophan_24.gif" alt="" />
                                    <p className="lbl">Gi??c m???c</p>
                                </div>
                            </Link>

                            {/* <Link to={`${PDKGhepCoQuanKhac}/machmau`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'machmau'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img src="/images/bophan_32.gif" alt="" />
                                    <p className="lbl">M???ch m??u</p>
                                </div>
                            </Link> */}

                            <Link to={`${PDKGhepCoQuanKhac}/tuy`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'tuy'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_18-26.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Tu???</p>
                                </div>
                            </Link>

                            <Link to={`${PDKGhepCoQuanKhac}/ruot`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'ruot'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img src="/images/bophan_11.gif" alt="" />
                                    <p className="lbl">Ru???t</p>
                                </div>
                            </Link>

                            <Link to={`${PDKGhepCoQuanKhac}/da`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'da'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_30-32.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Da</p>
                                </div>
                            </Link>

                            {/* <Link to={`${PDKGhepCoQuanKhac}/vantim`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'vantim'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img src="/images/bophan_21.jpg" alt="" />
                                    <p className="lbl">Van tim</p>
                                </div>
                            </Link> */}

                            <Link to={`${PDKGhepCoQuanKhac}/chithe`}>
                                <div
                                    className="grid-item"
                                    style={{
                                        border:
                                            Select === 'chithe'
                                                ? '2px red solid'
                                                : 'none'
                                    }}
                                >
                                    <img
                                        src="/images/bophan_31-33.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Chi th???</p>
                                </div>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    function FormGhepCoQuanKhac(CoQuanGhep) {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: datatoken.TINH !== undefined ? datatoken.TINH : '',
            quanhuyen:
                datatoken.QUANHUYEN !== undefined ? datatoken.QUANHUYEN : '',
            tinhtt: '',
            quanhuyentt: ''
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
            <Row className="pdkhien">
                <Col md={9}>
                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                hoTenBN:
                                    datatoken.HO !== undefined
                                        ? `${datatoken.HO} ${datatoken.TEN}`
                                        : '',
                                tinh:
                                    datatoken.TINH !== undefined
                                        ? datatoken.TINH
                                        : '',
                                xaphuong:
                                    datatoken.XAPHUONG !== undefined
                                        ? datatoken.XAPHUONG
                                        : '',
                                quanhuyen:
                                    datatoken.QUANHUYEN !== undefined
                                        ? datatoken.QUANHUYEN
                                        : '',
                                tinhtt: '',
                                xaphuongtt: '',
                                quanhuyentt: '',
                                gioiTinh:
                                    datatoken.GIOITINH !== undefined
                                        ? String(datatoken.GIOITINH)
                                        : String(0),
                                ngaySinh:
                                    datatoken.NGAYSINH !== undefined
                                        ? stringToDMY(datatoken.NGAYSINH)
                                        : '',
                                nhomMau: '',
                                nhomMau1: '',
                                baoHiemYTe: '',
                                CMNDBN: '',
                                NgayCapCMNDBN: '',
                                NoiCapCMNDBN: '',
                                ngheNghiep: '',
                                ngheNhiepBoSung: '',
                                trinhDoVanHoa: '',
                                dienThoai:
                                    datatoken.DIENTHOAI !== undefined
                                        ? datatoken.DIENTHOAI
                                        : '',
                                dienThoai1: '',
                                diaChiThuongChu:
                                    datatoken.DIACHI !== undefined
                                        ? datatoken.DIACHI
                                        : '',
                                diaChiTamChu: '',
                                laConThuMay: '',
                                tinhTrangHonNhan: String(0),
                                hoTenVoChong: '',
                                dienThoaiVoChong: '',
                                coMayCon: '',
                                soConTrai: '',
                                soConGai: '',
                                lonNhatSinhNam: '',
                                nhoNhatSinhNam: '',
                                // tienCanGiaDinh: '',
                                // tienCanBanThan: '',
                                nguyenNhanSuyThan: '',
                                // chuanDoanSuyThanGhep: '',
                                // benhSu: '',
                                thuocTriViemGan: '',
                                // sinhThietThan: String(0),
                                // ketQuaSinhThietThan: '',
                                ngayPhatHienSuyThan: '',
                                // ngayCTNTHoacKhamThamPhanBenhLy: '',
                                dieuTriViemGanTu: '',
                                // CTNTVaoNgay: String(0),
                                // soGioTrenLan: '',
                                // soLanCTNTTuan: '',
                                // chuKyThamPhan: '',
                                // chuKyThamPhanTaiBV: '',
                                // thamPhanBangMay: String(0),
                                // thamPhanBangMayTaiBV: '',
                                truyenMau: String(0),
                                baoNhieuDonViMau: '',
                                thang: null,
                                nam: null,
                                benhVienTruyenMau: '',
                                // daGhepLan1Ngay: '',
                                // daGhepLan1TaiBV: '',
                                // nguoiChoThan: '',
                                // ngayChayThanTroLai: '',
                                // chayThanTroLaiTaiBV: '',
                                // ctntHoacKhamThamPhan: '',
                                // ctntVaoNgayThuMay: '',
                                // caCTNT: '',
                                chieuCao: '',
                                canNang: '',
                                // nuocTieu24h: String(0),
                                // soLuongNuocTieu24h: '',
                                thuocDangSuDungNgay: '',
                                thoiGianBiTangHuyetAp: '',
                                thuocTaoMau: '',
                                bacSiDieuTri: '',
                                dienThoaiBacSi: '',
                                khongBiViemGan: false,
                                viemGanSieuViA: false,
                                viemGanSieuViB: false,
                                viemGanSieuViC: false,
                                truocHoacSauLocMau: 0,
                                tangHuyetAp: String(0),
                                daiThaoDuong: String(0),
                                thoiGianBiDaiThaoDuong: '',
                                thuocDieuTriDaiThaoDuong: '',
                                tinhTrang: '',
                                laoPhoi: String(0),
                                hutThuoc: String(0),
                                dieuTrenNgay: 0,
                                uongRuouBia: String(0),
                                soLanTuan: 0,
                                soLuongLan: '',
                                // benhKhac: '',
                                laoCoQuanKhac: '',
                                thoiGianBiLao: '',
                                thoiGianDieuTriAndNoiDieuTri: '',
                                // namPhatHien: '',
                                // dieuTriTaiBV: '',
                                // thoiGianDieuTri: '',
                                thuocDieuTri: '',
                                daPhauThuat: String(0),
                                coPhauThuat: '',
                                tinhTrangHienTai: '',
                                ngayThangPhauThuat: '',
                                benhVienPhauThuat: '',
                                biBenhThan: 0,
                                biBenhLao: 0,
                                biDaiThaoDuong: 0,
                                biTangHuyetAp: 0,
                                biUngThu: 0,
                                songCungDiaChi: 0,
                                biBenhKhac: '',
                                nguoiThanBiBenh: '',
                                thuNhapBenhNhan: '',
                                tinhTrangBenhNguoiThanHienTai: '',
                                thuNhapVoChongBenhNhan: '',
                                ngheNghiepVoChong: '',
                                thuNhapKhac: '',
                                tienChuanBiChoViecGhepThan: '',
                                khongCoNguoiNhan: false,
                                nguoiChoBiBenh: false,
                                nguoiChoKhongHoaHopMau: false,
                                lyDoKhac: '',
                                choGhepBoPhan: TypeBoPhanConstant.GetStyle(
                                    CoQuanGhep
                                ),
                                choGhepBenh: '',
                                choGhepBVDieuTri: '',
                                email: '',
                                TiemVaccine: '',
                                NgayTiemMui1: '',
                                NgayTiemMui2: '',
                                PhanUng: '',
                                TiemVaccine2: '',
                                PhanUng2: '',
                                NgayTiemMui3: '',
                                TiemVaccine3: '',
                                PhanUng3: ''
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

                                const qhgdnew = dataGiaDinh.current
                                    ? dataGiaDinh.current
                                    : [];
                                const ObjSave = {
                                    dangKyChoGhepThanCreateVM: {
                                        ...values1,
                                        typePhieuDKGhepTang: TypeBoPhanConstant.GetStyle(
                                            CoQuanGhep
                                        )
                                    },
                                    quanHeGiaDinhCreateVMs: qhgdnew
                                };

                                const usercaptcha = document.getElementById(
                                    'NhapMaXacNhan'
                                ).value;

                                if (validateCaptcha(usercaptcha) === true) {
                                    loadCaptchaEnginge(6);
                                    document.getElementById(
                                        'NhapMaXacNhan'
                                    ).value = '';
                                    if (
                                        FileSelected !== undefined &&
                                        FileSelected.data
                                    ) {
                                        ObjSave.dangKyChoGhepThanCreateVM.imgAvatar = FileSelected;
                                    }

                                    if (
                                        FileSelectedCMNDMT !== undefined &&
                                        FileSelectedCMNDMT.data
                                    ) {
                                        ObjSave.dangKyChoGhepThanCreateVM.imgCMND1 = FileSelectedCMNDMT;
                                        CMNDtruoc = true;
                                    }

                                    if (
                                        FileSelectedCMNDMs !== undefined &&
                                        FileSelectedCMNDMs.data
                                    ) {
                                        ObjSave.dangKyChoGhepThanCreateVM.imgCMND2 = FileSelectedCMNDMs;
                                        CMNDsau = true;
                                    }

                                    // kiem tra xem du 2 cmnd
                                    if (CMNDtruoc && CMNDsau) {
                                        setisload(true);
                                        SaveDataNew(ObjSave);
                                    } else {
                                        toast.error('B???n thi???u ???nh CMND');
                                    }
                                    // FileSelectedCMNDMs = null;
                                    // FileSelectedCMNDMT = null;
                                    // FileSelected = null;
                                } else {
                                    toast.error('B???n ???? nh???p sai m?? x??c nh???n');
                                    document.getElementById(
                                        'NhapMaXacNhan'
                                    ).value = '';
                                }
                            }}
                        >
                            {({errors, touched, values, setFieldValue}) => (
                                <Form className="col-md-12">
                                    <div className="pdk-hien-tieude">
                                        <div className="headerClientPage">
                                            ????N ????NG K?? CH??? GH??P{' '}
                                            {TypeBoPhanConstant.GetName(
                                                CoQuanGhep
                                            )}{' '}
                                            T??? NG?????I HI???N CH???T N??O - NG???NG TU???N
                                            HO??N
                                        </div>
                                    </div>
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
                                            <div className="form-group col-md-3">
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
                                            <div className="form-group col-md-3">
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
                                                    className="form-control "
                                                >
                                                    <option>--Ch???n--</option>
                                                    {/* <option value="A">A</option>
                                                <option value="AB">AB</option>
                                                <option value="B">B</option>
                                                <option value="O">O</option> */}
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
                                            <div className="form-group col-md-6">
                                                <>
                                                    <img
                                                        className="imgCMND"
                                                        id="ImgCMNDBNMatTruoc"
                                                        alt=""
                                                        onError={NotFoundImage}
                                                    />
                                                </>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <div>
                                                    <img
                                                        className="imgCMND"
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
                                                    {/* <option value="B??c s??">
                                                    B??c s??
                                                </option>
                                                <option value="K??? S??">
                                                    K??? S??
                                                </option>
                                                <option value="Gi??o vi??n">
                                                    Gi??o vi??n
                                                </option>
                                                <option value="C??ng nh??n">
                                                    C??ng nh??n
                                                </option> */}
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
                                                </label>
                                                <span className="red">*</span>
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
                                                ?????a ch??? T???m Tr?? :
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
                                                    Gia ????nh: l?? con th??? m???y?{' '}
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
                                                    type="number"
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
                                                    type="number"
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
                                            II. T??NH TR???NG B???NH L??
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="nguyenNhanSuyThan">
                                                    1. Nguy??n nh??n d???n ?????n t??nh
                                                    tr???ng b???nh hi???n t???i
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
                                                    2. Ph??t hi???n suy{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        CoQuanGhep
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
                                                3. B???nh l?? k??m theo
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
                                                4. Ti???n c??n ngo???i khoa
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
                                            <div className="form-group col-md-6">
                                                <label htmlFor="uongRuouBia">
                                                    5. Th??i quen nghi???n r?????u
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
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
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
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="form-group col-md-3">
                                            <label htmlFor="uongRuouBia">
                                                5. Th??i quen nghi???n r?????u
                                                <span className="red">*</span>
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
                                                        name="uongRuouBia"
                                                        value="0"
                                                    />{' '}
                                                    Kh??ng
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="uongRuouBia">
                                                {' '}
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
                                                        name="uongRuouBia"
                                                        value="1"
                                                    />{' '}
                                                    C??
                                                </label>
                                            </div>
                                        </div> */}
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
                                            <div className="form-group col-md-6">
                                                <label htmlFor="hutThuoc">
                                                    6. Th??i quen h??t thu???c
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
                                                                value="0"
                                                            />{' '}
                                                            Kh??ng
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
                                                                value="1"
                                                            />{' '}
                                                            C??
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="form-group col-md-3">
                                            <label htmlFor="hutThuoc">
                                                6. Th??i quen h??t thu???c
                                                <span className="red">*</span>
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
                                                        name="hutThuoc"
                                                        value="0"
                                                    />{' '}
                                                    Kh??ng
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="hutThuoc"> </label>
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
                                        </div> */}

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
                                                7. Ti???n c??n gia ????nh
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="biBenhThan">
                                                    B???nh{' '}
                                                    {TypeBoPhanConstant.GetName(
                                                        CoQuanGhep
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
                                                    type="number"
                                                    placeholder="vnd/th??ng"
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
                                                    type="number"
                                                    placeholder="vnd/th??ng"
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
                                                {/* <option value="">
                                                    --Ch???n--
                                                </option>
                                                 <option value="B??c s??">
                                                    B??c s??
                                                </option>
                                                <option value="K??? S??">
                                                    K??? S??
                                                </option>
                                                <option value="Gi??o vi??n">
                                                    Gi??o vi??n
                                                </option>
                                                <option value="C??ng nh??n">
                                                    C??ng nh??n
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
                                                    Thu nh???p kh??c
                                                </label>
                                                <Field
                                                    type="number"
                                                    placeholder="vnd/th??ng"
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
                                                        CoQuanGhep
                                                    )}{' '}
                                                    (c?? s???n)
                                                    <span className="red">
                                                        *
                                                    </span>
                                                </label>
                                                <Field
                                                    placeholder="vn??"
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
                                            IV. L?? DO ????NG K?? CH??? GH??P
                                            <p
                                                style={{
                                                    textTransform: 'uppercase',
                                                    display: 'inline'
                                                }}
                                            >
                                                {' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}
                                            </p>{' '}
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
                                                        CoQuanGhep
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
                                        <RenderQuanHeGiaDinh />
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
                                                    CoQuanGhep
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
                                                    CoQuanGhep
                                                )}
                                                . T??i ???? ???????c c??c b??c s?? ph???
                                                tr??ch gi???i th??ch r?? v??? c??c b?????c
                                                th???c hi???n ????nh gi?? t??nh tr???ng
                                                s???c kh???e chung, th???c hi???n qu??
                                                tr??nh tuy???n ch???n, th???i gian ch???
                                                ?????i, t??c d???ng ph??? c???a thu???c ???c
                                                ch??? mi???n d???ch ??i???u tr??? sau gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}
                                                , chi ph?? gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}
                                                , chu???n b??? m??i tr?????ng v?? c??ch
                                                sinh ho???t sau khi ???????c gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}
                                                . T??i xin ???????c ????ng k?? v??o danh
                                                s??ch ch??? gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}{' '}
                                                t??? ng?????i hi???n ch???t n??o hay tim
                                                ng???ng ?????p t???i B???nh vi???n Ch??? R???y,
                                                t??i cam k???t tu??n th??? c??c quy
                                                ?????nh trong qu?? tr??nh ??i???u tr???
                                                b???nh tr?????c v?? sau gh??p{' '}
                                                {TypeBoPhanConstant.GetName(
                                                    CoQuanGhep
                                                )}
                                                .
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="noiCap">
                                                Nh???p x??c nh???n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                id="NhapMaXacNhan"
                                                name="NhapMaXacNhan"
                                                key="NhapMaXacNhan"
                                                className="form-control "
                                            />
                                            {errors.NhapMaXacNhan &&
                                            touched.NhapMaXacNhan ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.NhapMaXacNhan}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="noiCap">
                                                M?? x??c nh???n
                                            </label>
                                            <LoadCanvasTemplate />
                                        </div>
                                    </div>
                                    <div className="form-row center mgt15">
                                        <div className="col-sm-12">
                                            <Button
                                                variant="success"
                                                type="submit"
                                                onClick={() =>
                                                    canhbaoError(errors)
                                                }
                                            >
                                                Ho??n th??nh
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                </Col>
                <Col md={3}>
                    <div className="boxRightHeader">Tin m???i</div>
                    <DsTinMoi />
                </Col>
            </Row>
        );
    }
    const RenderFormGhepCoQuanKhac = () => {
        const {CoQuanGhep} = useParams();
        useEffect(() => {
            loadCaptchaEnginge(6);
            document.getElementById('reload_href').text = '?????i m??';
        });
        setSelect(CoQuanGhep);
        switch (CoQuanGhep) {
            case 'tim':
                return FormGhepCoQuanKhac('tim');
            case 'phoi':
                return FormGhepCoQuanKhac('phoi');
            case 'gan':
                return FormGhepCoQuanKhac('gan');
            case 'giacmac':
                return FormGhepCoQuanKhac('giacmac');
            // case 'vantim':
            //     return FormGhepCoQuanKhac('vantim');
            case 'da':
                return FormGhepCoQuanKhac('da');
            case 'tuy':
                return FormGhepCoQuanKhac('tuy');
            case 'chithe':
                return FormGhepCoQuanKhac('chithe');
            case 'ruot':
                return FormGhepCoQuanKhac('ruot');
            // case 'machmau':
            //     return FormGhepCoQuanKhac('machmau');
            default:
                return null;
        }
    };

    const ShowYeuCauDangNhap = () => {
        return (
            <div className="boxRequestLogin">
                <div className="TitleRequestLogin">
                    ????? c?? th??? ????ng k?? hi???n, gh??p m?? t???ng vui l??ng th???c hi???n ????ng
                    nh???p ho???c th???c hi???n ????ng k?? t???o t??i kho???n m???i theo li??n k???t
                    b??n d?????i.
                </div>
                <div className="center boxBtnLoginRequest">
                    <Link
                        to="/loginUser?backurl=pdkghepcoquankhac"
                        className="btn btn-primary btn-lg"
                    >
                        <i className="fas fa-sign-in-alt" /> ????ng nh???p
                    </Link>
                    <Link to="/dangky" className="btn btn-success btn-lg">
                        <i className="fas fa-user-plus" /> ????ng k??
                    </Link>
                </div>
            </div>
        );
    };
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
            {!localStorage.getItem('token') ? (
                <>
                    <ShowYeuCauDangNhap />
                </>
            ) : (
                <>
                    {IsDone.state ? (
                        <RenderKetQuaGhep />
                    ) : (
                        <>
                            <RenderLuaChonBoPhanGhep />
                            <Switch>
                                <Route
                                    path={`${PDKGhepCoQuanKhac}/:CoQuanGhep`}
                                >
                                    <RenderFormGhepCoQuanKhac />
                                </Route>
                            </Switch>
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    LoadDataToken: () => {
        DataTokenService.GetDataByToken(dispatch);
    },
    LoadFileDangKy: (id) => {
        dangKyChoGhepTangService.LoadFileKhacDK(dispatch, id);
    }
});
const mapStateToProps = (state) => ({
    datatoken: state.datatoken.value,
    FileKhacDK: state.dangkychogheptang.FileKhacDK
});

export default connect(mapStateToProps, mapDispatchToProps)(PDKGhep);
