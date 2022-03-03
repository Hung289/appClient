/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import axios from 'axios';
import {
    Modal,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';

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
    Checkbox
} from 'antd';
import {Link, StaticRouter, useHistory} from 'react-router-dom';
// import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
// import * as Yup from 'yup';
import {connect} from 'react-redux';
import ReactLoading from 'react-loading';

import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';
import {
    DANGKYHIENTANG_CLOSE_VIEWDETAIL,
    DANGKYHIENTANG_CLOSE_VIEWEDIT,
    DANGKYHIENTANG_EDIT_CLOSE,
    DANGKYHIENTANG_SEARCH_SAVE,
    DANGKYHIENTANG_CHANGESTATUS_CLOSE
} from '@app/store/ActionType/DangKyHienTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong,
    RenderTenTinh,
    RenderTenQuanhuyen,
    RenderTenXaphuong
} from '@modules/Common/LoadDiachi';
import AdminSecsionHead from '../AdminSecsionHead';

const moment = require('moment');

const DangKyHienCreateAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef();
    let FileSelectedCMNDMs = useRef();
    const {
        setIsShowCreatePopup,
        IsShowCreatePopup,
        OnLoadingAction,
        onReloadPage
    } = props;
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [DiNguyen, setDiNguyen] = useState([]);

    const onCreateEntity = (tintuc) => {
        OnLoadingAction(true);
        dangKyHienTangService.CreateNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                setIsShowCreatePopup(false);
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
    function CreateModal() {
        const submitCreate = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: '',
            quanhuyen: '',
            tinhnhanthe: '',
            quanhuyennhanthe: ''
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
            <>
                <Modal
                    show={IsShowCreatePopup}
                    dialogClassName="modal-90w"
                    onHide={() => setIsShowCreatePopup(false)}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo mới đăng ký hiến tạng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                            layout="vertical"
                        >
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 10}}
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
                                    lg={{span: 6}}
                                    md={{span: 16}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        className="my-label"
                                        label="Ảnh thẻ"
                                    >
                                        <Input
                                            type="file"
                                            name="Avatar"
                                            key="Avatar"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUpload}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 4}}
                                    md={{span: 16}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <img id="Avatar" alt="" />
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
                                            {
                                                type: 'object',
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            },
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
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Điện Thoại"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            },
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
                                                    if (/^[0-9]*$/.test(val)) {
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
                                    md={{span: 12}}
                                    sm={{span: 24}}
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
                                                    if (/^[0-9]*$/.test(val)) {
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
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            },
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="tinh"
                                            onChange={(value) => {
                                                onchangeloaddiachi(
                                                    'tinh',
                                                    value
                                                );
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>
                                            {RenderDropdownTinh({
                                                code: 'tinh'
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
                                        className="chitietdiachi"
                                        label="Quận/Huyện"
                                        name="quanhuyen"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="quanhuyen"
                                            onChange={(value) => {
                                                onchangeloaddiachi(
                                                    'quanhuyen',
                                                    value
                                                );
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {RenderDropdownQuanhuyen({
                                                code: 'quanhuyen',
                                                data: loaddiachi.tinh
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
                                        className="chitietdiachi"
                                        label="Xã/Phường"
                                        name="xaphuong"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select defaultValue="" name="xaphuong">
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {RenderDropdownXaphuong({
                                                code: 'xaphuong',
                                                data: loaddiachi.quanhuyen
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="tinhnhanthe"
                                            onChange={(value) => {
                                                onchangeloaddiachi(
                                                    'tinhnhanthe',
                                                    value
                                                );
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>
                                            {RenderDropdownTinh({
                                                code: 'tinhnhanthe'
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="quanhuyennhanthe"
                                            onChange={(value) => {
                                                onchangeloaddiachi(
                                                    'quanhuyennhanthe',
                                                    value
                                                );
                                            }}
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {RenderDropdownQuanhuyen({
                                                code: 'quanhuyennhanthe',
                                                data: loaddiachi.tinhnhanthe
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Select
                                            defaultValue=""
                                            name="xaphuongnhanthe"
                                        >
                                            <Select.Option value="">
                                                --Chọn--
                                            </Select.Option>

                                            {RenderDropdownXaphuong({
                                                code: 'xaphuongnhanthe',
                                                data:
                                                    loaddiachi.quanhuyennhanthe
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
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
                                            {
                                                type: 'object',
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            },
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input name="noiCap" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 6}}
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
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatTruoc"
                                    />
                                </Col>
                                <Col
                                    lg={{span: 6}}
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
                                <Col
                                    lg={{span: 6}}
                                    md={{span: 12}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatSau"
                                    />
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
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
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
                        </Form>
                        {/* <Formik
                            innerRef={formRef}  
                            initialValues={{
                                hoTen: '',
                                ngaySinh: '',
                                gioiTinh: String(0),
                                diaChi: '',
                                tinh: '',
                                xaphuong: '',
                                quanhuyen: '',
                                tinhnhanthe: '',
                                xaphuongnhanthe: '',
                                quanhuyennhanthe: '',
                                soDienThoai: '',
                                soDienThoai1: '',
                                diaChiNhanTheDangKy: '',
                                ngheNghiep: '',
                                ngheNhiepBoSung: '',
                                noiCongTac: '',
                                soCMND: '',
                                ngayCap: '',
                                noiCap: '',
                                diNguyen: '',
                                diNguyenKhac: '',
                                than: false,
                                gan: false,
                                tuyTang: false,
                                tim: false,
                                  phoi: false,
                                ruot: false,
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
                                    onCreateEntity(ObjSave);
                                } else {
                                    toast.error('Bạn thiếu ảnh CMND');
                                }
                                // FileSelectedCMNDMT = null;
                                // FileSelected = null;
                                // FileSelectedCMNDMs = null;
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-row">
                                        <div className="form-group col-md-5">
                                            <label htmlFor="hoTen">
                                                Họ và tên
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="hoTen"
                                                key="hoTen"
                                                className="form-control img-padding"
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
                                        <div className="form-group col-md-3">
                                            <label htmlFor="Avatar">Ảnh</label>
                                            <Field
                                                type="file"
                                                name="Avatar"
                                                key="Avatar"
                                                className="form-control img-padding"
                                                onChange={ChangeFileUpload}
                                            />
                                            {errors.Avatar && touched.Avatar ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.Avatar}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-2">
                                            <>
                                                <img
                                                    id="Avatar"
                                                    alt=""
                                                    onError={NotFoundImage}
                                                />
                                            </>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
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
                                        <div className="form-group col-md-3">
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
                                        <div className="form-group col-md-3">
                                            <label htmlFor="soDienThoai1">
                                                Điện thoại khác
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
                                                type="tel"
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
                                                htmlFor="xaphuongnhanthess"
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
                                                Nơi công tác (nếu có)
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
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ImgCMNDBNMatTruoc">
                                                Ảnh CMND/CCCD mặt trước
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
                                                    onError={NotFoundImage}
                                                    alt=""
                                                />
                                            </>
                                        </div>
                                        <div className="form-group col-md-3">
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

                                        <div className="form-group col-md-3">
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
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="diNguyen">
                                                Chọn di nguyện
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
                        </Formik> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setIsShowCreatePopup(false)}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitCreate();
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
    return (
        <>
            <CreateModal />
        </>
    );
};

export default DangKyHienCreateAdm;
