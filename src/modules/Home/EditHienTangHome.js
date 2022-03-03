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
                'Họ tên không được sử dụng ký tự đặc biệt và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        ngaySinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày sinh vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            ),
        ngayCap: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày sinh vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            ),
        diaChi: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        diaChiNhanTheDangKy: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        ngheNghiep: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        soDienThoai: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('xxx', 'Số điện thoại chỉ được sử dụng chữ số', (val) =>
                /^[0-9+.]*$/.test(val)
            ),
        soDienThoai1: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .nullable()
            .test(
                'xxx',
                'Số điện thoại chỉ được sử dụng chữ số',
                (val) =>
                    /^[0-9+.]*$/.test(val) || val === undefined || val === null
            ),
        noiCap: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        diNguyen: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        soCMND: Yup.string()
            .trim()
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .max(12, 'CMND phải có 12 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('len', 'CMND chỉ được sử dụng chữ số', (val) =>
                /^[0-9 ]*$/.test(val)
            ),
        tinh: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        xaphuong: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        quanhuyen: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        tinhnhanthe: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        xaphuongnhanthe: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        quanhuyennhanthe: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .typeError('Vui lòng nhập thông tin này'),
        email: Yup.string()
            .nullable()
            .test('isEmail', 'Email không hợp lệ', (val) => {
                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return isEmail.test(val) || val === '' || val === undefined;
            }),
        maso: Yup.number()
            .nullable()
            .min(0, 'Vui lòng nhập số lớn hơn 0')
            .typeError('Vui lòng nhập số')
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
                            Cập nhật đăng ký hiến mô tạng
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
                                                'Cập nhật đăng ký hiến tạng thành công'
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
                                                Họ và tên
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
                                                Giới tính
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
                                                    Nữ
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="ngaySinh">
                                                Ngày sinh
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
                                                Ảnh thẻ cũ
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
                                                Thay ảnh thẻ mới
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
                                                Ảnh thẻ mới
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
                                                Điện thoại
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
                                                Điện thoại khác
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
                                                    --Chọn--
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
                                                Xã/Phường
                                                <span className="red">*</span>
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
                                            Số nhà, phố, tổ dân phố/thôn/đội
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
                                            Yêu cầu gửi thẻ đăng ký hiến tạng về
                                            địa chỉ :
                                        </label>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="tinhnhanthe"
                                                className="chitietdiachi"
                                            >
                                                Tỉnh/Thành Phố
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
                                                    --Chọn--
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
                                                Quận/Huyện
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
                                                    --Chọn--
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
                                                Xã/Phường
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="xaphuongnhanthe"
                                                key="xaphuongnhanthe"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
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
                                            Số nhà, phố, tổ dân phố/thôn/đội
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
                                                Nghề nghiệp
                                                <span className="red">*</span>
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
                                                Nghề nghiệp bổ sung
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
                                                Nơi công tác(nếu có)
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
                                                Giấy CMND/Hộ chiếu
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
                                                Ngày cấp
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
                                                Nơi cấp
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
                                                Ảnh CMND/CCCD mặt trước
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
                                                Ảnh CMND/CCCD mặt sau
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
                                                Ảnh CMND/CCCD mặt trước cũ{' '}
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
                                                Ảnh CMND/CCCD mặt trước mới
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
                                                Ảnh CMND/CCCD mặt sau cũ
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
                                        <div className="class-b">
                                            * Xin 1 vui lòng đánh dấu chọn các
                                            mô, bộ phận cơ thể tình nguyện sẽ
                                            hiến sau khi chết:
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
                                                            Thận
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
                                                            Tụy tạng
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
                                                            Phổi
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
                                                            Ruột
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
                                                            Giác mạc
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
                                                            Xương
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
                                                            Mạch máu
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
                                                            Chi thể
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
                                                * Di nguyện về việc xử lý cơ thể
                                                sau khi hiến tặng mô tạng:
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="diNguyen"
                                                key="diNguyen"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>

                                                <option value="Đưa tro cốt về với gia đình">
                                                    Đưa tro cốt về với gia đình
                                                </option>
                                                <option value="Gửi tro cốt tại">
                                                    Gửi tro cốt tại
                                                </option>
                                                <option value="Theo ý kiến gia đình">
                                                    Theo ý kiến gia đình
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
                                                Mô tả di nguyện
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
                            Đóng
                        </Button> */}
                        <Button
                            className="btn-lg"
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Hoàn thành
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
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            Cập nhật đăng ký
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm-4 boxMenuClient">
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Quản lý hồ sơ
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
