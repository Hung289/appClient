import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {NotFoundImage} from '@modules/Common/NotFound';
import DsTinMoi from '@modules/Home/DsTinMoi';
import * as Constant from '@app/Constant';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {Page, Document, pdfjs} from 'react-pdf';
// import {Document} from 'react-pdf/dist/esm/entry.webpack';
// import PDFViewer from 'pdf-viewer-reactjs';

import {
    loadCaptchaEnginge,
    LoadCanvasTemplate,
    LoadCanvasTemplateNoReload,
    validateCaptcha
} from 'react-simple-captcha';
import axios from 'axios';
import {connect} from 'react-redux';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

import * as DataTokenService from '@app/services/DataTokenService';
import * as DiachiService from '@app/services/DiachiService';
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
import * as CommonUtility from '@modules/Common/CommonUtility';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {
    removeAscent,
    stringToDMY,
    canhbaoError
} from '@modules/Common/CommonUtility';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import {data} from 'jquery';
import {Link} from 'react-router-dom';
import ReactLoading from 'react-loading';

const PDKHien = (props) => {
    const formRef = useRef();
    const [IsDone, setIsDone] = useState({state: false, data: {}});
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const {LoadDataToken, LoadFileDangKy, FileDK, datatoken} = props;
    const [isload, setisload] = useState(false);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [DiNguyen, setDiNguyen] = useState([]);

    useEffect(async () => {
        // lay du lieu tu token
        LoadDataToken();
        DuLieuDanhMuc.GetDMbyCodeNhom('nghenghiep').then((rs) => {
            if (rs.Status) {
                setNgheNghiep(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('dinguyen').then((rs) => {
            if (rs.Status) {
                setDiNguyen(rs.Data);
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

    const DropDMDiNguyen = () => {
        return DiNguyen.map((item) => {
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

    const SignupSchema = Yup.object().shape({
        hoTen: Yup.string()
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
        ngaySinh: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y sinh v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            ),
        ngayCap: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'len',
                'Ng??y c???p v?????t qu?? ng??y hi???n t???i',
                (val) => new Date() > new Date(val)
            ),
        diaChi: Yup.string()
            .trim()
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        diaChiNhanTheDangKy: Yup.string()
            .trim()
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        ngheNghiep: Yup.string()
            .trim()
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        soDienThoai: Yup.string()
            .trim()
            .min(10, 'Vui l??ng nh???p ??t nh???t 10 k?? t???')
            .max(12, 'Vui l??ng nh???p kh??ng qu?? 12 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test('xxx', 'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        soDienThoai1: Yup.string().trim().nullable(),
        noiCap: Yup.string()
            .trim()
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        diNguyen: Yup.string()
            .trim()
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        soCMND: Yup.string()
            .trim()
            .max(14, 'Vui l??ng nh???p kh??ng qu?? 14 k?? t???')
            .min(8, 'CMND ph???i c?? 8 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        tinh: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        xaphuong: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        quanhuyen: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        tinhnhanthe: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        xaphuongnhanthe: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        quanhuyennhanthe: Yup.string()
            .required('Vui l??ng nh???p th??ng tin n??y')
            .typeError('Vui l??ng nh???p th??ng tin n??y'),
        email: Yup.string()
            .nullable()
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
    function Ketquaghep() {
        return (
            <div style={{padding: '10px', margin: '0 auto'}}>
                <embed src={FileDK.PathPDF} width="100%" height="500px" />
            </div>
        );
    }

    const RenderKetQua = () => {
        return (
            <div className="row">
                <div className="col-sm-12 ">
                    <div className="pdk-hien-tieude">
                        <div className="headerClientPage">
                            {IsDone.data.HoTen} G???I ????N T??? NGUY???N HI???N M??, B???
                            PH???N C?? TH??? ??? NG?????I SAU KHI CH???T TH??NH C??NG
                        </div>
                    </div>
                    <div>
                        <div className="Bold14">
                            T??? ph??? tr??ch: Ti???p nh???n ????ng k?? hi???n t???ng
                        </div>
                        <div className="paddingleft10">
                            <div>K??nh g???i: {IsDone.data.HoTen}</div>
                            <div>Ch??ng t??i xin tr??n tr???ng th??ng tin ?????n</div>
                            <div>
                                ??ng/B??: {IsDone.data.HoTen}. sinh ng??y:{' '}
                                {CommonUtility.ShowDateVN(IsDone.data.NgaySinh)}
                            </div>
                            <div>
                                ?????a ch??? th?????ng tr??: {IsDone.data.DiaChi},
                                {IsDone.data.TenXa},{IsDone.data.TenHuyen},
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
                                    ????? ho??n t???t quy tr??nh ????ng k?? vui l??ng t???i
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
                    <div className="pdk-hien-tieude">XEM L???I ????N ????NG K??</div>

                    <div className="center">
                        <Ketquaghep />
                        <Button className="mgb15" variant="primary" size="sm">
                            <a
                                className="White"
                                href={`${Constant.PathServer}/${FileDK.PathWord}`}
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
        fetch(`${Constant.PathServer}/api/DangKyHien/Create`, {
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
    const RenderForm = () => {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: datatoken.TINH !== undefined ? datatoken.TINH : '',
            quanhuyen:
                datatoken.QUANHUYEN !== undefined ? datatoken.QUANHUYEN : '',
            xaphuong:
                datatoken.XAPHUONG !== undefined ? datatoken.XAPHUONG : '',
            tinhnhanthe: '',
            quanhuyennhanthe: ''
        });

        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value, xaphuong: ''});
            } else if (name === 'xaphuong') {
                setloaddiachi({...loaddiachi, xaphuong: value});
            } else if (name === 'tinhnhanthe') {
                setloaddiachi({
                    ...loaddiachi,
                    tinhnhanthe: value,
                    quanhuyennhanthe: ''
                });
            } else if (name === 'quanhuyennhanthe') {
                setloaddiachi({...loaddiachi, quanhuyennhanthe: value});
            }
        }
        useEffect(async () => {
            loadCaptchaEnginge(6);
            document.getElementById('reload_href').text = '?????i m??';
        }, []);
        return (
            <Row className="pdkhien">
                <Col md={9}>
                    <Ketquaghep />
                    <div className="form-row boxNoteHeader">
                        <div className="border-camket">
                            <div className="tag-text">
                                V?? s??? ph??t tri???n n???n y h???c n?????c nh??, nh???m giup
                                ????? nh???ng ng?????i kh??ng may m???c c??c b???nh hi???m ngh??o
                                v?? v???i tinh th???n nh??n ?????o ch???a b???nh c???u ng?????i.
                                Sau khi ???????c c??n b??? y t??? t?? v???n, t??i xin t???
                                nguy???n hi???n m??, b??? ph???n c?? th??? c???a m??nh sau khi
                                t??i qua ?????i m?? m?? kh??ng y??u c???u k??m theo b???t c???
                                m???t ??i???u ki???n n??o.
                            </div>
                            <div className="tag-text">
                                T??i ????? ngh??? gi??? (ho???c kh??ng gi???) b?? m???t danh
                                t??nh c???a t??i ?????i v???i ng?????i nh???n.
                            </div>
                            <div className="tag-text">
                                T??i vi???t ????n n??y trong tr???ng th??i ho??n to??n minh
                                m???n, t???nh t??o v?? xin ch???u tr??ch nhi???m tr?????c ph??p
                                lu???t v??? cam k???t c???a m??nh.
                            </div>
                            <div className="tag-text">
                                T??i xin ch??n th??nh c???m ??n.
                            </div>
                        </div>
                    </div>
                    <div className="pdk-hien-tieude">
                        <div className="headerClientPage">
                            ????N T??? NGUY???N HI???N M??, B??? PH???N C?? TH??? ??? NG?????I SAU
                            KHI CH???T
                        </div>
                    </div>
                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                hoTen:
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
                                gioiTinh:
                                    datatoken.GIOITINH !== undefined
                                        ? String(datatoken.GIOITINH)
                                        : String(0),
                                ngaySinh:
                                    datatoken.NGAYSINH !== undefined
                                        ? stringToDMY(datatoken.NGAYSINH)
                                        : '',
                                tinhnhanthe: '',
                                xaphuongnhanthe: '',
                                quanhuyennhanthe: '',
                                soDienThoai:
                                    datatoken.DIENTHOAI !== undefined
                                        ? datatoken.DIENTHOAI
                                        : '',
                                soDienThoai1: '',
                                diaChi:
                                    datatoken.DIACHI !== undefined
                                        ? datatoken.DIACHI
                                        : '',
                                diaChiNhanTheDangKy: '',
                                ngheNghiep: '',
                                ngheNhiepBoSung: '',
                                noiCongTac: '',
                                soCMND: '',
                                ngayCap: '',
                                noiCap: '',
                                diNguyen: '',
                                than: false,
                                gan: false,
                                tuyTang: false,
                                tim: false,
                                phoi: false,
                                ruot: false,
                                diNguyenKhac: '',
                                da: false,
                                giacMac: false,
                                xuong: false,
                                machMau: false,
                                vanTim: false,
                                chiThe: false,
                                email: '',
                                maso: null
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                let CMNDtruoc = false;
                                let CMNDsau = false;

                                const ObjSave = {
                                    ...values
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
                                        ObjSave.imgAvatar = FileSelected;
                                    }

                                    if (
                                        FileSelectedCMNDMT !== undefined &&
                                        FileSelectedCMNDMT.data
                                    ) {
                                        ObjSave.imgCMND1 = FileSelectedCMNDMT;
                                        CMNDtruoc = true;
                                    }

                                    if (
                                        FileSelectedCMNDMs !== undefined &&
                                        FileSelectedCMNDMs.data
                                    ) {
                                        ObjSave.imgCMND2 = FileSelectedCMNDMs;
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
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="hoTen">
                                                H??? v?? t??n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="hoTen"
                                                key="hoTen"
                                                className="form-control "
                                            />
                                            {errors.hoTen && touched.hoTen ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.hoTen}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-3">
                                            <label htmlFor="ngaySinh">
                                                Ng??y sinh
                                                <span className="red">*</span>
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
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ImageSrc">
                                                ???nh th???
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
                                            <>
                                                <img id="Avatar" alt="" />
                                            </>
                                        </div>
                                    </div>
                                    <div className="form-row">
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
                                            <label htmlFor="soDienThoai">
                                                ??i???n tho???i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="tel"
                                                name="soDienThoai"
                                                key="soDienThoai"
                                                className="form-control "
                                            />
                                            {errors.soDienThoai &&
                                            touched.soDienThoai ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.soDienThoai}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="soDienThoai1">
                                                ??i???n tho???i kh??c
                                            </label>
                                            <Field
                                                type="tel"
                                                name="soDienThoai1"
                                                key="soDienThoai1"
                                                className="form-control "
                                            />
                                            {errors.soDienThoai1 &&
                                            touched.soDienThoai1 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.soDienThoai1}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="email">Email</label>
                                            <Field
                                                type="text"
                                                name="email"
                                                key="email"
                                                className="form-control "
                                            />
                                            {errors.email && touched.email ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.email}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
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
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="tinh"
                                                key="tinh"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
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
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="quanhuyen"
                                                key="quanhuyen"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
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
                                                        data={loaddiachi.tinh}
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
                                                <span className="red">*</span>
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
                                                {loaddiachi.quanhuyen !== '' ? (
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
                                        <div className="form-group col-md-12">
                                            <label
                                                htmlFor="diaChi"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="diaChi"
                                                key="diaChi"
                                                className="form-control "
                                            />
                                            {errors.diaChi && touched.diaChi ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diaChi}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="diaChiNhanTheDangKy">
                                            Y??u c???u g???i th??? ????ng k?? hi???n t???ng v???
                                            ?????a ch??? :
                                        </label>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="tinhnhanthe"
                                                className="chitietdiachi"
                                            >
                                                T???nh/Th??nh Ph???
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="tinhnhanthe"
                                                key="tinhnhanthe"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'tinhnhanthe',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'tinhnhanthe',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'quanhuyennhanthe',
                                                        ''
                                                    );
                                                    setFieldValue(
                                                        'xaphuongnhanthe',
                                                        ''
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    --Ch???n--
                                                </option>
                                                {RenderDropdownTinh({
                                                    code: 'tinhnhanthe'
                                                })}
                                            </Field>
                                            {errors.tinhnhanthe &&
                                            touched.tinhnhanthe ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.tinhnhanthe}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="quanhuyennhanthe"
                                                className="chitietdiachi"
                                            >
                                                Qu???n/Huy???n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="quanhuyennhanthe"
                                                key="quanhuyennhanthe"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'quanhuyennhanthe',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'quanhuyennhanthe',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'xaphuongnhanthe',
                                                        ''
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    --Ch???n--
                                                </option>
                                                {loaddiachi.tinhnhanthe !==
                                                '' ? (
                                                    <RenderDropdownQuanhuyen
                                                        code="quanhuyennhanthe"
                                                        data={
                                                            loaddiachi.tinhnhanthe
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </Field>
                                            {errors.quanhuyennhanthe &&
                                            touched.quanhuyennhanthe ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.quanhuyennhanthe
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="xaphuongnhanthess"
                                                className="chitietdiachi"
                                            >
                                                X??/Ph?????ng
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="xaphuongnhanthe"
                                                key="xaphuongnhanthe"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Ch???n--
                                                </option>
                                                {loaddiachi.quanhuyennhanthe !==
                                                '' ? (
                                                    <RenderDropdownXaphuong
                                                        code="xaphuongnhanthe"
                                                        data={
                                                            loaddiachi.quanhuyennhanthe
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </Field>
                                            {errors.xaphuongnhanthe &&
                                            touched.xaphuongnhanthe ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.xaphuongnhanthe}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label
                                                htmlFor="diaChiNhanTheDangKy"
                                                className="chitietdiachi"
                                            >
                                                S??? nh??, ph???, t??? d??n ph???/th??n/?????i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="diaChiNhanTheDangKy"
                                                key="diaChiNhanTheDangKy"
                                                className="form-control "
                                            />
                                            {errors.diaChiNhanTheDangKy &&
                                            touched.diaChiNhanTheDangKy ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.diaChiNhanTheDangKy
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ngheNghiep">
                                                Ngh??? nghi???p
                                                <span className="red">*</span>
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
                                                Ngh??? nghi???p b??? sung
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
                                                        {errors.ngheNhiepBoSung}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="noiCongTac">
                                                N??i c??ng t??c (n???u c??)
                                            </label>
                                            <Field
                                                name="noiCongTac"
                                                key="noiCongTac"
                                                className="form-control "
                                            />
                                            {errors.noiCongTac &&
                                            touched.noiCongTac ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.noiCongTac}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="soCMND">
                                                CMND/C??n c?????c c??ng d??n/H??? chi???u
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="soCMND"
                                                key="soCMND"
                                                className="form-control "
                                            />
                                            {errors.soCMND && touched.soCMND ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.soCMND}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ngayCap">
                                                Ng??y c???p
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="ngayCap"
                                                key="ngayCap"
                                                className="form-control "
                                            />
                                            {errors.ngayCap &&
                                            touched.ngayCap ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.ngayCap}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label htmlFor="noiCap">
                                                N??i c???p
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="noiCap"
                                                key="noiCap"
                                                className="form-control "
                                            />
                                            {errors.noiCap && touched.noiCap ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.noiCap}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ImgCMNDBNMatTruoc">
                                                ???nh CMND/CCCD m???t tr?????c
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="file"
                                                name="ImgCMNDBNMatTruoc"
                                                key="ImgCMNDBNMatTruoc"
                                                className="form-control  img-padding"
                                                onChange={
                                                    ChangeFileUploadCMNDMT
                                                }
                                                onError={NotFoundImage}
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
                                        <div className="form-group col-md-3">
                                            <>
                                                <img
                                                    className="imgCMND"
                                                    id="ImgCMNDBNMatTruoc"
                                                    alt=""
                                                    onError={NotFoundImage}
                                                />
                                            </>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ImgCMNDBNMatSau">
                                                ???nh CMND/CCCD m???t sau
                                                <span className="red">*</span>
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
                                                        {errors.ImgCMNDBNMatSau}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-3">
                                            <div>
                                                <img
                                                    className="imgCMND"
                                                    id="ImgCMNDBNMatSau"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="class-b">
                                            * Xin vui l??ng ????nh d???u ch???n c??c m??,
                                            b??? ph???n c?? th??? t??nh nguy???n s??? hi???n
                                            sau khi qua ?????i:
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-row">
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox">
                                                        <Field
                                                            type="checkbox"
                                                            name="than"
                                                            key="than"
                                                            id="than"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="than"
                                                        >
                                                            Th???n
                                                        </label>
                                                        {errors.than &&
                                                        touched.than ? (
                                                            <div className="invalid-feedback">
                                                                {errors.than}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="gan"
                                                            key="gan"
                                                            id="gan"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="gan"
                                                        >
                                                            Gan
                                                        </label>
                                                        {errors.gan &&
                                                        touched.gan ? (
                                                            <div className="invalid-feedback">
                                                                {errors.gan}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="tuyTang"
                                                            key="tuyTang"
                                                            id="tuyTang"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="tuyTang"
                                                        >
                                                            T???y t???ng
                                                        </label>
                                                        {errors.tuyTang &&
                                                        touched.tuyTang ? (
                                                            <div className="invalid-feedback">
                                                                {errors.tuyTang}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="tim"
                                                            key="tim"
                                                            id="tim"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="tim"
                                                        >
                                                            Tim
                                                        </label>
                                                        {errors.tim &&
                                                        touched.tim ? (
                                                            <div className="invalid-feedback">
                                                                {errors.tim}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="phoi"
                                                            key="phoi"
                                                            id="phoi"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="phoi"
                                                        >
                                                            Ph???i
                                                        </label>
                                                        {errors.phoi &&
                                                        touched.phoi ? (
                                                            <div className="invalid-feedback">
                                                                {errors.phoi}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="ruot"
                                                            key="ruot"
                                                            id="ruot"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="ruot"
                                                        >
                                                            Ru???t
                                                        </label>
                                                        {errors.ruot &&
                                                        touched.ruot ? (
                                                            <div className="invalid-feedback">
                                                                {errors.ruot}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="da"
                                                            key="da"
                                                            id="da"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="da"
                                                        >
                                                            Da
                                                        </label>
                                                        {errors.da &&
                                                        touched.da ? (
                                                            <div className="invalid-feedback">
                                                                {errors.da}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="giacMac"
                                                            key="giacMac"
                                                            id="giacMac"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="giacMac"
                                                        >
                                                            Gi??c m???c
                                                        </label>
                                                        {errors.giacMac &&
                                                        touched.giacMac ? (
                                                            <div className="invalid-feedback">
                                                                {errors.giacMac}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="xuong"
                                                            key="xuong"
                                                            id="xuong"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="xuong"
                                                        >
                                                            X????ng
                                                        </label>
                                                        {errors.xuong &&
                                                        touched.xuong ? (
                                                            <div className="invalid-feedback">
                                                                {errors.xuong}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="machMau"
                                                            key="machMau"
                                                            id="machMau"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="machMau"
                                                        >
                                                            M???ch m??u
                                                        </label>
                                                        {errors.machMau &&
                                                        touched.machMau ? (
                                                            <div className="invalid-feedback">
                                                                {errors.machMau}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="vanTim"
                                                            key="vanTim"
                                                            id="vanTim"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="vanTim"
                                                        >
                                                            Van tim
                                                        </label>
                                                        {errors.vanTim &&
                                                        touched.vanTim ? (
                                                            <div className="invalid-feedback">
                                                                {errors.vanTim}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="custom-control custom-checkbox ">
                                                        <Field
                                                            type="checkbox"
                                                            name="chiThe"
                                                            key="chiThe"
                                                            id="chiThe"
                                                            className="custom-control-input"
                                                        />

                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="chiThe"
                                                        >
                                                            Chi th???
                                                        </label>
                                                        {errors.chiThe &&
                                                        touched.chiThe ? (
                                                            <div className="invalid-feedback">
                                                                {errors.chiThe}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="diNguyen">
                                                * Di nguy???n v??? vi???c x??? l?? c?? th???
                                                sau khi hi???n t???ng m?? t???ng:
                                                <span className="red">*</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ngaySinh">
                                                Ch???n di nguy???n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="diNguyen"
                                                key="diNguyen"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Ch???n--
                                                </option>
                                                <DropDMDiNguyen />
                                            </Field>
                                            {errors.diNguyen &&
                                            touched.diNguyen ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.diNguyen}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="diNguyenKhac">
                                                M?? t??? di nguy???n
                                            </label>
                                            <Field
                                                name="diNguyenKhac"
                                                key="diNguyenKhac"
                                                className="form-control"
                                            />

                                            {errors.diNguyenKhac &&
                                            touched.diNguyenKhac ? (
                                                <div className="invalid-feedback">
                                                    {errors.diNguyenKhac}
                                                </div>
                                            ) : null}
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
                        to="/loginUser?backurl=pdkhien"
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
                <>{IsDone.state ? <RenderKetQua /> : <RenderForm />}</>
            )}
        </Container>
    );
};
const mapDispatchToProps = (dispatch) => ({
    LoadDataToken: () => {
        DataTokenService.GetDataByToken(dispatch);
    },
    LoadFileDangKy: (id) => {
        dangKyHienTangService.LoadFileDK(dispatch, id);
    },
    LoadTinh: (code) => {
        DiachiService.RenderDataTinh(dispatch, code);
    }
});
const mapStateToProps = (state) => ({
    datatoken: state.datatoken.value,
    FileDK: state.dangkyhientang.FileDK
});

export default connect(mapStateToProps, mapDispatchToProps)(PDKHien);
