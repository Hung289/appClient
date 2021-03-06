import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {NotFoundImage} from '@modules/Common/NotFound';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import axios from 'axios';
import {
    Modal,
    Button,
    Col,
    Breadcrumb,
    Container,
    Row,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';
import {Link, StaticRouter, useHistory, useParams} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';
import ReactLoading from 'react-loading';

import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong,
    RenderTenTinh,
    RenderTenQuanhuyen,
    RenderTenXaphuong
} from '@modules/Common/LoadDiachi';

const EditHienTangHome = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const history = useHistory();
    const {id} = useParams();
    const [isload, setisload] = useState(false);

    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef();
    let FileSelectedCMNDMs = useRef();
    const [entityObj, setEntityObj] = useState({});
    const [initDataItem, setInitDataItem] = useState(false);
    const InitData = () => {
        if (!initDataItem) {
            dangKyHienTangService
                .GetDetailDto(id)
                .then((dta) => setEntityObj(dta));
            setInitDataItem(true);
        }
    };
    InitData();
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
                'Ng??y sinh v?????t qu?? ng??y hi???n t???i',
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
        soDienThoai1: Yup.string()
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
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .max(12, 'CMND ph???i c?? 12 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test('len', 'CMND ch??? ???????c s??? d???ng ch??? s???', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
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
                return isEmail.test(val) || val === '' || val === undefined;
            }),
        maso: Yup.number()
            .nullable()
            .min(0, 'Vui l??ng nh???p s??? l???n h??n 0')
            .typeError('Vui l??ng nh???p s???')
    });
    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.Tinh === null ? '' : entityObj.Tinh,
            quanhuyen: entityObj.QuanHuyen === null ? '' : entityObj.QuanHuyen,
            tinhnhanthe:
                entityObj.TinhNhanThe === null ? '' : entityObj.TinhNhanThe,
            quanhuyennhanthe:
                entityObj.QuanHuyenNhanThe === null
                    ? ''
                    : entityObj.QuanHuyenNhanThe
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
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
        return (
            <Row>
                <Col md={12}>
                    <div className="">
                        <div className="Title-Login-Register center">
                            C???p nh???t ????ng k?? hi???n m?? t???ng
                        </div>
                    </div>
                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                id: entityObj.Id,
                                hoTen: entityObj.HoTen,
                                ngaySinh: CommonUtility.GetDateSetField(
                                    entityObj.NgaySinh
                                ),
                                gioiTinh: String(entityObj.GioiTinh),
                                tinh: entityObj.Tinh,
                                xaphuong: entityObj.XaPhuong,
                                quanhuyen: entityObj.QuanHuyen,
                                tinhnhanthe: entityObj.TinhNhanThe,
                                xaphuongnhanthe: entityObj.XaPhuongNhanThe,
                                quanhuyennhanthe: entityObj.QuanHuyenNhanThe,
                                soDienThoai: entityObj.SoDienThoai,
                                soDienThoai1: entityObj.SoDienThoai1,
                                diaChi: entityObj.DiaChi,
                                diaChiNhanTheDangKy:
                                    entityObj.DiaChiNhanTheDangKy,
                                ngheNghiep: entityObj.NgheNghiep,
                                ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                                noiCongTac: entityObj.NoiCongTac,
                                soCMND: entityObj.SoCMND,
                                ngayCap: CommonUtility.GetDateSetField(
                                    entityObj.NgayCap
                                ),
                                diNguyenKhac: entityObj.DiNguyenKhac,
                                noiCap: entityObj.NoiCap,
                                diNguyen: entityObj.DiNguyen,
                                than: entityObj.Than,
                                gan: entityObj.Gan,
                                tuyTang: entityObj.TuyTang,
                                tim: entityObj.Tim,
                                phoi: entityObj.Phoi,
                                ruot: entityObj.Ruot,
                                da: entityObj.Da,
                                giacMac: entityObj.GiacMac,
                                xuong: entityObj.Xuong,
                                chiThe: entityObj.ChiThe,
                                machMau: entityObj.MachMau,
                                vanTim: entityObj.VanTim,
                                email: entityObj.Email,
                                maso: entityObj.MaSo
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    Avatar: entityObj.Avatar,
                                    ImgCMNDMatTruoc: entityObj.ImgCMNDMatTruoc,
                                    ImgCMNDMatSau: entityObj.ImgCMNDMatSau
                                };
                                // same shape as initial values

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
                                }

                                if (
                                    FileSelectedCMNDMs !== undefined &&
                                    FileSelectedCMNDMs.data
                                ) {
                                    ObjSave.imgCMND2 = FileSelectedCMNDMs;
                                }
                                setisload(true);
                                dangKyHienTangService
                                    .EditNewEntityUser(ObjSave)
                                    .then((itemdata) => {
                                        if (itemdata.Status === true) {
                                            toast.success(
                                                'C???p nh???t ????ng k?? hi???n t???ng th??nh c??ng'
                                            );
                                            history.push(
                                                `/ChiTietDKHienTang/${entityObj.Id}`
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
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
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

                                        <div className="form-group col-md-2">
                                            <label htmlFor="gioiTinh">
                                                Gi???i t??nh
                                                <span className="red">*</span>
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
                                                    />
                                                    Nam
                                                </label>
                                                <label htmlFor>
                                                    <Field
                                                        type="radio"
                                                        name="gioiTinh"
                                                        value="0"
                                                    />
                                                    N???
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-4">
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
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-2">
                                            <label htmlFor="ImageSrc">
                                                ???nh th??? c??
                                            </label>
                                            <div>
                                                <>
                                                    <img
                                                        className="imgHinhAnhAccount"
                                                        src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                        onError={
                                                            NotFoundUserImage
                                                        }
                                                        alt=""
                                                    />
                                                </>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="ImageSrc">
                                                Thay ???nh th??? m???i
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
                                                        onError={NotFoundImage}
                                                    />
                                                </>
                                            </div>
                                        </div>

                                        <div className="form-group col-md-2">
                                            <label htmlFor="soDienThoai">
                                                ??i???n tho???i
                                                <span className="red">*</span>
                                            </label>
                                            <Field
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
                                        <div className="form-group col-md-2">
                                            <label htmlFor="soDienThoai1">
                                                ??i???n tho???i kh??c
                                            </label>
                                            <Field
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
                                        <div className="form-group col-md-2">
                                            <label htmlFor="email">Email</label>
                                            <Field
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
                                    </div>
                                    <div className="form-row">
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
                                    <br />
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
                                                    code: 'tinh'
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
                                                htmlFor="xaphuongnhanthe"
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
                                    </div>
                                    <div className="form-row">
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
                                                    {errors.diaChiNhanTheDangKy}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <br />
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
                                                {RenderDropdownDanhMuc({
                                                    code: 'nghenghiep'
                                                })}
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
                                                N??i c??ng t??c(n???u c??)
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
                                                Gi???y CMND/H??? chi???u
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
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ImgCMNDBNMatTruoc">
                                                ???nh CMND/CCCD m???t tr?????c
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="file"
                                                name="ImgCMNDBNMatTruoc"
                                                key="ImgCMNDBNMatTruoc"
                                                className="form-control  ImgCMNDBNMatTruoc"
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
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ImgCMNDBNMatSau">
                                                ???nh CMND/CCCD m???t tr?????c c??{' '}
                                            </label>
                                            <div>
                                                <>
                                                    <img
                                                        className=" imgCMND"
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDMatTruoc}`}
                                                        alt=""
                                                        onError={NotFoundImage}
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
                                                        onError={NotFoundImage}
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
                                                    src={`${Constant.PathServer}${entityObj.ImgCMNDMatSau}`}
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
                                        <div className="class-b">
                                            * Xin 1 vui l??ng ????nh d???u ch???n c??c
                                            m??, b??? ph???n c?? th??? t??nh nguy???n s???
                                            hi???n sau khi ch???t:
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
                                        <div className="form-group col-md-6">
                                            <label htmlFor="diNguyen">
                                                * Di nguy???n v??? vi???c x??? l?? c?? th???
                                                sau khi hi???n t???ng m?? t???ng:
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

                                                <option value="????a tro c???t v??? v???i gia ????nh">
                                                    ????a tro c???t v??? v???i gia ????nh
                                                </option>
                                                <option value="G???i tro c???t t???i">
                                                    G???i tro c???t t???i
                                                </option>
                                                <option value="Theo ?? ki???n gia ????nh">
                                                    Theo ?? ki???n gia ????nh
                                                </option>
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
            <EditModal />
        </Container>
    );
};
const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        dangKyHienTangService.LoadEntity(dispatch, objSearch);
    },
    onEditEntity: (id) => {
        dangKyHienTangService.OpenEditModalSV(dispatch, id);
    },

    onSaveEditEntity: (tintuc) => {
        dangKyHienTangService.EditNewEntityUser(tintuc);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkyhientang.lstEntity,
    entityObj: state.dangkyhientang.entityObj,
    searchModel: state.dangkyhientang.searchModel
});
export default connect(mapStateToProps, mapDispatchToProps)(EditHienTangHome);
