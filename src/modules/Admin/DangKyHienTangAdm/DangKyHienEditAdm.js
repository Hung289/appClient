/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/alt-text */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import axios from 'axios';
import {Modal} from 'react-bootstrap';
import {
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    layout,
    Layout,
    Upload,
    Button,
    Checkbox,
    InputNumber
} from 'antd';
import moment from 'moment';
import {Link, StaticRouter, useHistory} from 'react-router-dom';
// import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';

// import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';

import {
    DaTaTinh,
    DaTaQuanhuyen,
    DaTaXaphuong
} from '@modules/Common/LoadDiachi';

const DangKyHienEditAdm = (props) => {
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef();
    let FileSelectedCMNDMs = useRef();

    const NhomMauRef = useRef([]);
    const NhomMauRHRef = useRef([]);

    const {
        onCloseEntityEditModal,
        entityObj,
        danhMucData,
        // onSaveEditEntity,
        IsShowEditPopup,
        OnLoadingAction,
        onReloadPage
    } = props;

    const onSaveEditEntity = (tintuc) => {
        OnLoadingAction(true);
        dangKyHienTangService.EditNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditModal();
                onReloadPage();
            }
        });
    };
    useEffect(() => {}, []);

    const DropDMNgheNghiep = () => {
        return (
            danhMucData &&
            danhMucData.nghenghiep &&
            danhMucData.nghenghiep.map((item) => {
                return (
                    <Select.Option value={item.Code} key={item.Code}>
                        {item.Name}
                    </Select.Option>
                );
            })
        );
    };

    const DropDMDiNguyen = () => {
        return (
            danhMucData &&
            danhMucData.dinguyen &&
            danhMucData.dinguyen.map((item) => {
                return (
                    <Select.Option value={item.Code} key={item.Code}>
                        {item.Name}
                    </Select.Option>
                );
            })
        );
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

    const onFinish = (values) => {
        // same shape as initial values
        const ngaySinh =
            values.ngaySinh !== '' ? values.ngaySinh.format('YYYY-MM-DD') : '';
        const ngayCap =
            values.ngayCap !== '' ? values.ngayCap.format('YYYY-MM-DD') : '';
        const ngaydk =
            values.ngaydk !== '' ? values.ngaydk.format('YYYY-MM-DD') : '';
        const ObjSave = {
            ...values,
            Avatar: entityObj.Avatar,
            ImgCMNDMatTruoc: entityObj.ImgCMNDMatTruoc,
            ImgCMNDMatSau: entityObj.ImgCMNDMatSau,
            ngaySinh,
            ngayCap,
            ngaydk
        };

        // same shape as initial values

        if (FileSelected !== undefined && FileSelected.data) {
            ObjSave.imgAvatar = FileSelected;
        }

        if (FileSelectedCMNDMT !== undefined && FileSelectedCMNDMT.data) {
            ObjSave.imgCMND1 = FileSelectedCMNDMT;
        }

        if (FileSelectedCMNDMs !== undefined && FileSelectedCMNDMs.data) {
            ObjSave.imgCMND2 = FileSelectedCMNDMs;
        }
        onSaveEditEntity(ObjSave);
    };

    function EditModal() {
        const [form] = Form.useForm();
        const [dsXa, setDsXa] = useState([]);
        const [dshuyen, setDsHuyen] = useState([]);
        const [dshuyenNhanThe, setDsHuyenNhanThe] = useState([]);
        const [dsXaNhanThe, setDsXaNhanThe] = useState([]);

        return (
            <>
                <Modal
                    show={IsShowEditPopup}
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật đăng ký hiến mô, tạng
                        </Modal.Title>
                    </Modal.Header>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            id: entityObj.Id,
                            hoTen: entityObj.HoTen,
                            ngaySinh:
                                entityObj.NgaySinh !== null
                                    ? moment(entityObj.NgaySinh)
                                    : '',
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
                            diaChiNhanTheDangKy: entityObj.DiaChiNhanTheDangKy,
                            ngheNghiep: entityObj.NgheNghiep,
                            ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                            noiCongTac: entityObj.NoiCongTac,
                            soCMND: entityObj.SoCMND,
                            ngayCap:
                                entityObj.NgayCap !== null
                                    ? moment(entityObj.NgayCap)
                                    : '',
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
                            maso: entityObj.MaSo,
                            namsinh: entityObj.NamSinh,
                            ngaydk:
                                entityObj.NgayDK !== null
                                    ? moment(entityObj.NgayDK)
                                    : '',
                            namdk: entityObj.NamDK,
                            ghichu: entityObj.GhiChu,
                            ChieuCao: entityObj.ChieuCao,
                            CanNang: entityObj.CanNang,
                            NhomMau: entityObj.NhomMau,
                            NhomMau1: entityObj.NhomMau1
                        }}
                    >
                        <Modal.Body>
                            <Form.Item name="id" hidden>
                                <Input name="id" />
                            </Form.Item>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 7}}
                                    md={{span: 16}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Họ và tên"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        name="hoTen"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="hoTen" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mã số bệnh nhân"
                                        name="maso"
                                    >
                                        <Input name="maso" />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 4}}
                                    md={{span: 16}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Giới tính"
                                        name="gioiTinh"
                                        valuePropName="checked"
                                    >
                                        <Radio.Group
                                            name="gioiTinh"
                                            defaultValue="1"
                                        >
                                            <Radio value="1">Nam</Radio>
                                            <Radio value="0">Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 5}}
                                    md={{span: 4}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Thay ảnh thẻ mới"
                                    >
                                        <Input
                                            type="file"
                                            name="ImageSrc"
                                            key="ImageSrc"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUpload}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 4}}
                                    md={{span: 4}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh thẻ mới"
                                    >
                                        <img id="Avatar" alt="" />
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 4}}
                                    md={{span: 4}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh thẻ cũ"
                                    >
                                        <div>
                                            <>
                                                <img
                                                    className="imgHinhAnhAccount"
                                                    src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                    onError={NotFoundUserImage}
                                                    alt=""
                                                />
                                            </>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Chiều cao"
                                        name="ChieuCao"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            name="ChieuCao"
                                            addonAfter="Cm"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Cân nặng"
                                        name="CanNang"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <InputNumber
                                            min={1}
                                            max={900}
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            name="CanNang"
                                            addonAfter="Kg"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Nhóm máu ABO"
                                        name="NhomMau"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="NhomMau"
                                            placeholder="--Chọn--"
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {danhMucData &&
                                                danhMucData.nhommau &&
                                                danhMucData.nhommau.map(
                                                    (item) => {
                                                        return (
                                                            <Select.Option
                                                                value={
                                                                    item.Code
                                                                }
                                                                key={item.Code}
                                                            >
                                                                {item.Name}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Nhóm máu RH"
                                        name="NhomMau1"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            placeholder="--Chọn--"
                                            name="NhomMau1"
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>
                                            {danhMucData &&
                                                danhMucData.nhommaurh &&
                                                danhMucData.nhommaurh.map(
                                                    (item) => {
                                                        return (
                                                            <Select.Option
                                                                value={
                                                                    item.Code
                                                                }
                                                                key={item.Code}
                                                            >
                                                                {item.Name}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Ngày sinh"
                                        rules={[
                                            () => ({
                                                validator(_, val) {
                                                    if (
                                                        new Date() <
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh vượt quá ngày hiện tại'
                                                        );
                                                    }
                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh phải sau ngày 1 tháng 1 năm 1920'
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                        name="ngaySinh"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            name="ngaySinh"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Điện Thoại"
                                        rules={[
                                            // {
                                            //     required: true,
                                            //     message:
                                            //         'Vui lòng nhập thông tin này'
                                            // },
                                            {
                                                min: 2,
                                                message:
                                                    'Vui lòng nhập ít nhất 10 kí tự'
                                            },
                                            {
                                                max: 12,
                                                message:
                                                    'Vui lòng nhập không quá 12 ký tự'
                                            },
                                            ({getFieldValue}) => ({
                                                validator(_, val) {
                                                    if (val) {
                                                        if (
                                                            /^[0-9]*$/.test(val)
                                                        ) {
                                                            return Promise.resolve();
                                                        }

                                                        if (val === undefined) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                `Số điện thoại chỉ được sử dụng chữ số`
                                                            )
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                        name="soDienThoai"
                                    >
                                        <Input name="soDienThoai" />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Điện thoại khác"
                                        rules={[
                                            {
                                                min: 2,
                                                message:
                                                    'Vui lòng nhập ít nhất 10 kí tự'
                                            },
                                            {
                                                max: 12,
                                                message:
                                                    'Vui lòng nhập không quá 12 ký tự'
                                            },
                                            ({getFieldValue}) => ({
                                                validator(_, val) {
                                                    if (val) {
                                                        if (
                                                            /^[0-9]*$/.test(val)
                                                        ) {
                                                            return Promise.resolve();
                                                        }

                                                        if (val === undefined) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                `Số điện thoại chỉ được sử dụng chữ số`
                                                            )
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                        name="soDienThoai1"
                                    >
                                        <Input name="soDienThoai1" />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Email"
                                        rules={[
                                            // {
                                            //     required: true,
                                            //     message:
                                            //         'Vui lòng nhập thông tin này'
                                            // },
                                            {
                                                type: 'email',
                                                message:
                                                    'Vui lòng nhập đúng định dạng email'
                                            }
                                        ]}
                                        name="email"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="email" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item label="Năm sinh" name="namsinh">
                                        <InputNumber
                                            style={{width: '100%'}}
                                            min={1990}
                                            max={2022}
                                            name="namsinh"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Ngày đăng ký"
                                        name="ngaydk"
                                        rules={[
                                            () => ({
                                                validator(_, val) {
                                                    if (
                                                        new Date() <
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh vượt quá ngày hiện tại'
                                                        );
                                                    }
                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh phải sau ngày 1 tháng 1 năm 1920'
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            name="ngaydk"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item label="Năm đăng ký" name="namdk">
                                        <InputNumber
                                            style={{width: '100%'}}
                                            min={1990}
                                            max={2022}
                                            name="namsinh"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item label="Ghi chú" name="ghichu">
                                        <Input name="ghichu" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <label>Địa chỉ thường chú</label>
                            <Row
                                className="form-diachithuongchu"
                                gutter={[10, 5]}
                            >
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="chitietdiachi"
                                        label="Tỉnh/Thành Phố"
                                        name="tinh"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            name="tinh"
                                            defaultValue=""
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            // filterSort={(optionA, optionB) =>
                                            //     optionA.children
                                            //         .toLowerCase()
                                            //         .localeCompare(
                                            //             optionB.children.toLowerCase()
                                            //         )
                                            // }
                                            onChange={(value) => {
                                                form.setFieldsValue({
                                                    quanhuyen: '',
                                                    xaphuong: ''
                                                });
                                                DaTaQuanhuyen(value).then(
                                                    (rs) => {
                                                        setDsHuyen(rs.Data);
                                                        setDsXa([]);
                                                    }
                                                );
                                            }}
                                        >
                                            <Select.Option key="">
                                                --Chọn--
                                            </Select.Option>
                                            {danhMucData &&
                                                danhMucData.tinh &&
                                                danhMucData.tinh.map((item) => (
                                                    <Select.Option
                                                        key={item.MaTinh}
                                                    >
                                                        {item.TenTinh}
                                                    </Select.Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="chitietdiachi"
                                        label="Quận/Huyện"
                                        name="quanhuyen"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            // filterSort={(optionA, optionB) =>
                                            //     optionA.children
                                            //         .toLowerCase()
                                            //         .localeCompare(
                                            //             optionB.children.toLowerCase()
                                            //         )
                                            // }
                                            onChange={(value) => {
                                                form.setFieldsValue({
                                                    xaphuong: ''
                                                });
                                                DaTaXaphuong(value).then(
                                                    (rs) => {
                                                        setDsXa(rs.Data);
                                                    }
                                                );
                                            }}
                                        >
                                            <Select.Option key="">
                                                --Chọn--
                                            </Select.Option>
                                            {dshuyen &&
                                                dshuyen.map((item) => (
                                                    <Select.Option
                                                        key={item.MaHuyen}
                                                    >
                                                        {item.TenHuyen}
                                                    </Select.Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="chitietdiachi"
                                        label="Xã/Phường"
                                        name="xaphuong"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            showSearch
                                            defaultValue=""
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children
                                                    .toLowerCase()
                                                    .localeCompare(
                                                        optionB.children.toLowerCase()
                                                    )
                                            }
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {dsXa &&
                                                dsXa.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.MaXa}
                                                        >
                                                            {item.TenXa}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        className="my-label"
                                        label="Số nhà, phố, tổ dân phố /thôn / đội"
                                        name="diaChi"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="diaChi" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <label className="my-label">
                                Yêu cầu gửi thẻ đăng kí hiến tạng về địa chỉ
                            </label>
                            <Row
                                className="form-diachithuongchu"
                                gutter={[10, 5]}
                            >
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="chitietdiachi"
                                        label="Tỉnh/Thành Phố"
                                        name="tinhnhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            // filterSort={(optionA, optionB) =>
                                            //     optionA.children
                                            //         .toLowerCase()
                                            //         .localeCompare(
                                            //             optionB.children.toLowerCase()
                                            //         )
                                            // }
                                            defaultValue=""
                                            name="tinhnhanthe"
                                            onChange={(value) => {
                                                DaTaQuanhuyen(value).then(
                                                    (rs) => {
                                                        setDsHuyenNhanThe(
                                                            rs.Data
                                                        );
                                                    }
                                                );
                                                form.setFieldsValue({
                                                    quanhuyennhanthe: '',
                                                    xaphuongnhanthe: ''
                                                });
                                                setDsXaNhanThe([]);
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>
                                            {danhMucData &&
                                                danhMucData.tinh &&
                                                danhMucData.tinh.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.MaTinh}
                                                        >
                                                            {item.TenTinh}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Quận/Huyện"
                                        name="quanhuyennhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            showSearch
                                            defaultValue=""
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            // filterSort={(optionA, optionB) =>
                                            //     optionA.children
                                            //         .toLowerCase()
                                            //         .localeCompare(
                                            //             optionB.children.toLowerCase()
                                            //         )
                                            // }
                                            onChange={(value) => {
                                                DaTaXaphuong(value).then(
                                                    (rs) => {
                                                        setDsXaNhanThe(rs.Data);
                                                    }
                                                );
                                                form.setFieldsValue({
                                                    xaphuongnhanthe: ''
                                                });
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {dshuyenNhanThe &&
                                                dshuyenNhanThe.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.MaHuyen}
                                                        >
                                                            {item.TenHuyen}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 8}}
                                    md={{span: 8}}
                                    sm={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Xã/Phường"
                                        name="xaphuongnhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            showSearch
                                            defaultValue=""
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            // filterSort={(optionA, optionB) =>
                                            //     optionA.children
                                            //         .toLowerCase()
                                            //         .localeCompare(
                                            //             optionB.children.toLowerCase()
                                            //         )
                                            // }
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {dsXaNhanThe &&
                                                dsXaNhanThe.map((item) => {
                                                    return (
                                                        <Select.Option
                                                            key={item.MaXa}
                                                        >
                                                            {item.TenXa}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        className="my-label"
                                        label="Số nhà, phố, tổ dân phố /thôn / đội"
                                        name="diaChiNhanTheDangKy"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="diaChiNhanTheDangKy" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Nghề nghiệp"
                                        name="ngheNghiep"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="ngheNghiep"
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {DropDMNgheNghiep()}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Nghề nghiệp bổ xung"
                                        name="ngheNhiepBoSung"
                                    >
                                        <Input name="ngheNhiepBoSung" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        className="my-label"
                                        label="Nơi Công tác(nếu có)"
                                        name="noiCongTac"
                                    >
                                        <Input name="noiCongTac" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="CMND/CCCD/Hộ chiếu"
                                        name="soCMND"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="soCMND" />
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ngày cấp"
                                        rules={[
                                            // {
                                            //     type: 'object',
                                            //     required: true,
                                            //     message:
                                            //         'Vui lòng nhập thông tin này'
                                            // },
                                            () => ({
                                                validator(_, val) {
                                                    if (
                                                        new Date() <
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh vượt quá ngày hiện tại'
                                                        );
                                                    }

                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ngày sinh phải sau ngày 1 tháng 1 năm 1920'
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                        name="ngayCap"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            name="ngayCap"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        className="my-label"
                                        label="Nơi cấp"
                                        name="noiCap"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="noiCap" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt trước"
                                    >
                                        <Input
                                            type="file"
                                            name="ImgCMNDBNMatTruoc"
                                            key="ImgCMNDBNMatTruoc"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUploadCMNDMT}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt sau"
                                    >
                                        <Input
                                            type="file"
                                            name="ImgCMNDBNMatSau"
                                            key="ImgCMNDBNMatSau"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUploadCMNDMs}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt trước cũ"
                                    >
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
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt trước mới"
                                    >
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
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt sau cũ"
                                    >
                                        <div>
                                            <img
                                                className=" imgCMND"
                                                src={`${Constant.PathServer}${entityObj.ImgCMNDMatSau}`}
                                                alt=""
                                                onError={NotFoundImage}
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh CMND/CCCD mặt trước mới"
                                    >
                                        <div>
                                            <img
                                                className=" imgCMND"
                                                id="ImgCMNDBNMatSau"
                                                alt=""
                                                onError={NotFoundImage}
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <label
                                    className="class-b"
                                    style={{marginBottom: '0px'}}
                                >
                                    * Xin vui lòng đánh dấu chọn các mô, bộ phận
                                    cơ thể tình nguyện sẽ hiến sau khi chết:
                                </label>
                            </Row>
                            <Row gutter={[10, 0]}>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="than"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="than" id="than">
                                            Thận
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="gan"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="gan" id="gan">
                                            Gan
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="tuyTang"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="tuyTang" id="tuyTang">
                                            Tụy Tạng
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="tim"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="tim" id="tim">
                                            Tim
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="phoi"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="phoi" id="phoi">
                                            Phổi
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="ruot"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="ruot" id="ruot">
                                            Ruột
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="da"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="da" id="da">
                                            Da
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="giacMac"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="giacMac" id="giacMac">
                                            Giác mạc
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="xuong"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="xuong" id="xuong">
                                            Xương
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="machMau"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="machMau" id="machMau">
                                            Mạch máu
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="vanTim"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="vanTim" id="vanTim">
                                            Van tim
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 6}}
                                    sm={{span: 12}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        name="chiThe"
                                        style={{marginBottom: '0px'}}
                                        valuePropName="checked"
                                    >
                                        <Checkbox name="chiThe" id="chiThe">
                                            Chi Thể
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <label htmlFor="diNguyen">
                                        * Di nguyện về việc xử lý cơ thể sau khi
                                        hiến tặng mô tạng:
                                        <span className="red">*</span>
                                    </label>
                                </Col>
                            </Row>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Chọn di nguyện"
                                        name="diNguyen"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui lòng nhập thông tin này'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select defaultValue="" name="diNguyen">
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {DropDMDiNguyen()}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 12}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Mô tả di nguyện"
                                        name="diNguyenKhac"
                                    >
                                        <Input namr="diNguyenKhac" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => onCloseEntityEditModal()}
                            >
                                Đóng
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Hoàn thành
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
    return (
        <>
            <EditModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditEntity: (id) => {
        dangKyHienTangService.OpenEditModalSV(dispatch, id);
    }
    // onCloseEntityEditModal: (id) => {
    //     dispatch({type: DANGKYCHOGHEPTANG_EDIT_CLOSE});
    // }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkyhientang.lstEntity,
    IsUpdate: state.dangkyhientang.IsUpdate,
    // entityObj: state.dangkyhientang.entityObj,
    showDetailModal: state.dangkyhientang.showDetailModal,
    showEditModal: state.dangkyhientang.showEditModal,
    isInit: state.dangkyhientang.isInit,
    showChangeStatusModal: state.dangkyhientang.showChangeStatusModal,
    statusNew: state.dangkyhientang.statusNew,
    searchModel: state.dangkyhientang.searchModel
});
export default connect(mapStateToProps, mapDispatchToProps)(DangKyHienEditAdm);
