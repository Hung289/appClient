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
                            C???p nh???t ????ng k?? hi???n m??, t???ng
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
                                        label="H??? v?? t??n"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui l??ng nh???p th??ng tin n??y'
                                            }
                                        ]}
                                        name="hoTen"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="hoTen" />
                                    </Form.Item>

                                    <Form.Item
                                        label="M?? s??? b???nh nh??n"
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
                                        label="Gi???i t??nh"
                                        name="gioiTinh"
                                        valuePropName="checked"
                                    >
                                        <Radio.Group
                                            name="gioiTinh"
                                            defaultValue="1"
                                        >
                                            <Radio value="1">Nam</Radio>
                                            <Radio value="0">N???</Radio>
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
                                        label="Thay ???nh th??? m???i"
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
                                        label="???nh th??? m???i"
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
                                        label="???nh th??? c??"
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
                                        label="Chi???u cao"
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
                                        label="C??n n???ng"
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
                                        label="Nh??m m??u ABO"
                                        name="NhomMau"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="NhomMau"
                                            placeholder="--Ch???n--"
                                        >
                                            <Select.Option value="">
                                                --Ch???n--
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
                                        label="Nh??m m??u RH"
                                        name="NhomMau1"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            placeholder="--Ch???n--"
                                            name="NhomMau1"
                                        >
                                            <Select.Option value="">
                                                --Ch???n--
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
                                        label="Ng??y sinh"
                                        rules={[
                                            () => ({
                                                validator(_, val) {
                                                    if (
                                                        new Date() <
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ng??y sinh v?????t qu?? ng??y hi???n t???i'
                                                        );
                                                    }
                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        label="??i???n Tho???i"
                                        rules={[
                                            // {
                                            //     required: true,
                                            //     message:
                                            //         'Vui l??ng nh???p th??ng tin n??y'
                                            // },
                                            {
                                                min: 2,
                                                message:
                                                    'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                            },
                                            {
                                                max: 12,
                                                message:
                                                    'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                                `S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???`
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
                                        label="??i???n tho???i kh??c"
                                        rules={[
                                            {
                                                min: 2,
                                                message:
                                                    'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                            },
                                            {
                                                max: 12,
                                                message:
                                                    'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                                `S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???`
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
                                            //         'Vui l??ng nh???p th??ng tin n??y'
                                            // },
                                            {
                                                type: 'email',
                                                message:
                                                    'Vui l??ng nh???p ????ng ?????nh d???ng email'
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
                                    <Form.Item label="N??m sinh" name="namsinh">
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
                                        label="Ng??y ????ng k??"
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
                                                            'Ng??y sinh v?????t qu?? ng??y hi???n t???i'
                                                        );
                                                    }
                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                    <Form.Item label="N??m ????ng k??" name="namdk">
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
                                    <Form.Item label="Ghi ch??" name="ghichu">
                                        <Input name="ghichu" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <label>?????a ch??? th?????ng ch??</label>
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
                                        label="T???nh/Th??nh Ph???"
                                        name="tinh"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="Qu???n/Huy???n"
                                        name="quanhuyen"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="X??/Ph?????ng"
                                        name="xaphuong"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                        name="diaChi"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="diaChi" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <label className="my-label">
                                Y??u c???u g???i th??? ????ng k?? hi???n t???ng v??? ?????a ch???
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
                                        label="T???nh/Th??nh Ph???"
                                        name="tinhnhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="Qu???n/Huy???n"
                                        name="quanhuyennhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="X??/Ph?????ng"
                                        name="xaphuongnhanthe"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                                --Ch???n--
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
                                        label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                        name="diaChiNhanTheDangKy"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                        label="Ngh??? nghi???p"
                                        name="ngheNghiep"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="ngheNghiep"
                                        >
                                            <Select.Option value="">
                                                --Ch???n--
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
                                        label="Ngh??? nghi???p b??? xung"
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
                                        label="N??i C??ng t??c(n???u c??)"
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
                                        label="CMND/CCCD/H??? chi???u"
                                        name="soCMND"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                        label="Ng??y c???p"
                                        rules={[
                                            // {
                                            //     type: 'object',
                                            //     required: true,
                                            //     message:
                                            //         'Vui l??ng nh???p th??ng tin n??y'
                                            // },
                                            () => ({
                                                validator(_, val) {
                                                    if (
                                                        new Date() <
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ng??y sinh v?????t qu?? ng??y hi???n t???i'
                                                        );
                                                    }

                                                    if (
                                                        new Date('1920-1-1') >
                                                        new Date(val)
                                                    ) {
                                                        // eslint-disable-next-line prefer-promise-reject-errors
                                                        return Promise.reject(
                                                            'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        label="N??i c???p"
                                        name="noiCap"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
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
                                        label="???nh CMND/CCCD m???t tr?????c"
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
                                        label="???nh CMND/CCCD m???t sau"
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
                                        label="???nh CMND/CCCD m???t tr?????c c??"
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
                                        label="???nh CMND/CCCD m???t tr?????c m???i"
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
                                        label="???nh CMND/CCCD m???t sau c??"
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
                                        label="???nh CMND/CCCD m???t tr?????c m???i"
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
                                    * Xin vui l??ng ????nh d???u ch???n c??c m??, b??? ph???n
                                    c?? th??? t??nh nguy???n s??? hi???n sau khi ch???t:
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
                                            Th???n
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
                                            T???y T???ng
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
                                            Ph???i
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
                                            Ru???t
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
                                            Gi??c m???c
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
                                            X????ng
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
                                            M???ch m??u
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
                                            Chi Th???
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <label htmlFor="diNguyen">
                                        * Di nguy???n v??? vi???c x??? l?? c?? th??? sau khi
                                        hi???n t???ng m?? t???ng:
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
                                        label="Ch???n di nguy???n"
                                        name="diNguyen"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             'Vui l??ng nh???p th??ng tin n??y'
                                        //     }
                                        // ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select defaultValue="" name="diNguyen">
                                            <Select.Option value="">
                                                --Ch???n--
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
                                        label="M?? t??? di nguy???n"
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
                                ????ng
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Ho??n th??nh
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
