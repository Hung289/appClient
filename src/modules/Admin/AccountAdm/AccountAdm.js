import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import {NotFoundUserImage} from '@modules/Common/NotFoundUser';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import axios from 'axios';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import * as AccountService from '@app/services/AccountServerService';
import * as roleService from '@app/services/roleService';

import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    ACCOUNT_CLOSE_VIEWDETAIL,
    ACCOUNT_EDIT_CLOSE,
    ACCOUNT_SEARCH_SAVE,
    ACCOUNT_RSPW_CLOSE
} from '@app/store/ActionType/AccountTypeAction';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import {
    Drawer,
    Button,
    Space,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Menu,
    Avatar,
    Pagination,
    Dropdown,
    Form,
    Card,
    DatePicker,
    Modal
} from 'antd';
import moment from 'moment';
import * as antIcon from '@ant-design/icons';
import AdminSecsionHead from '../AdminSecsionHead';
import AddRole from './AddRole';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const AccountAdm = (props) => {
    const formCreateAccount = useRef(null);
    const formRef = useRef();
    const [ShowAddRole, setShowAddRole] = useState(false);
    const [lstRole, setlstRole] = useState([]);
    const [lstRoleId, setLstRoleId] = useState([]);
    const [Userid, setUserid] = useState(0);
    // const isAdmin = localStorage.getItem('isAdmin') === 'true';
    let FileSelected;
    let dataSelected;
    const {
        LoadAccountData,
        onCreateAccount,
        onDeleteAccount,
        onDeleteMultiEntity,
        onEditAccount,
        onCloseAccountModal,
        onCloseAccountEditModal,
        lstEntity,
        showEditModal,
        IsUpdate,
        entityObj,
        showDetailModal,
        onOpenDetailModal,
        onSaveEditAccount,
        onRSPWAccount,
        onSaveRSPWAccount,
        showRSPWModal,
        onCloseRSPWModal,
        onUnlockAccount,
        onLockAccount,
        searchModel,
        onSubmitSearchSave,
        user
    } = props;
    const [showPanelSearch, SetshowPanelSearch] = useState(false);

    function ToggleSearchPanel() {
        SetshowPanelSearch(!showPanelSearch);
    }

    const OpenAddRole = (id) => {
        roleService.LoadAllOfUser(id).then((data) => {
            if (data.Status) {
                const arrAL = [];
                for (let idx = 0; idx < data.Data.length; idx += 1) {
                    const element = data.Data[idx];
                    if (element.IsAsign) {
                        arrAL.push(element.Id);
                    }
                }
                setUserid(id);
                setLstRoleId(arrAL);
                setlstRole(data.Data);

                setShowAddRole(true);
            } else {
                toast.error(data.Message);
            }
        });
    };

    useEffect(() => {
        // Update the document title using the browser API
        if (IsUpdate) {
            let objSearch = {
                ...searchModel
            };
            if (searchModel == null || searchModel === undefined) {
                objSearch = {
                    PageIndex: 1,
                    PageSize: 20
                };
            }
            LoadAccountData(objSearch);
        }
    });

    const SignupSchema = Yup.object().shape({
        TENDANGNHAP: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        MATKHAU: Yup.string()
            .trim()
            .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
            .required('Vui lòng nhập thông tin này'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('MATKHAU'), null],
            'Mật khẩu phải trùng'
        ),
        NGAYSINH: Yup.string()
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
        TINH: Yup.string().required('Vui lòng nhập thông tin này'),
        XAPHUONG: Yup.string().required('Vui lòng nhập thông tin này'),
        QUANHUYEN: Yup.string().required('Vui lòng nhập thông tin này')
    });
    const ChangePassSchema = Yup.object().shape({
        MATKHAU: Yup.string()
            .trim()
            .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
            .required('Vui lòng nhập thông tin này'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('MATKHAU'), null],
            'Mật khẩu phải trùng'
        )
    });
    const SearchSchema = Yup.object().shape({
        TENDANGNHAPFilter: Yup.string().nullable(),
        TRANGTHAIFilter: Yup.string().nullable(),
        DIENTHOAIFilter: Yup.string().nullable(),
        HOFilter: Yup.string().nullable(),
        TENFilter: Yup.string().nullable(),
        EMAILIdFilter: Yup.string().nullable(),
        DIACHIFilter: Yup.string().nullable(),
        GIOITINHFilter: Yup.string().nullable()
    });

    function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        let Arr = event.target.files;
        [FileSelected, ...Arr] = Arr;
        const image = document.getElementById('ANH_DAIDIEN_PREVIEW');
        image.src = URL.createObjectURL(event.target.files[0]);
    }
    function SaveAnh() {
        const fd = new FormData();
        fd.append('files', FileSelected, FileSelected.name);
        const dataAPI = axios
            .post(`${Constant.PathServer}/api/AppUserManager/PostImage`, fd, {
                onUploadProgress: (ProgressEvent) => {
                    // console.log(
                    //     `Upload Progress: ${Math.round(
                    //         (ProgressEvent.loaded / ProgressEvent.total) * 100
                    //     )} %
                    //         `
                    // );
                }
            })
            .then((res) => {
                return res.data;
            })
            .catch((ex) => {
                toast.error('Lỗi lưu ảnh');
            });
        return dataAPI;
    }

    function CreateModal() {
        const [show, setShow] = useState(false);
        const [showHidePassword, changeShowHidePassword] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const submitCreate = () => {
            console.log(formRef.current);
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: '',
            quanhuyen: ''
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
            }
        }
        return (
            <>
                <Button type="primary" onClick={handleShow}>
                    <i className="fa fa-plus" aria-hidden="true" />
                    &nbsp; Tạo mới
                </Button>

                <Modal
                    title="Thêm mới người dùng"
                    centered
                    visible={show}
                    onOk={() => submitCreate()}
                    onCancel={handleClose}
                    width={1000}
                    zIndex={1040}
                    okText="Hoàn thành"
                    cancelText="Đóng"
                >
                    <Form
                        ref={formRef}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            TENDANGNHAP: '',
                            MATKHAU: '',
                            TRANGTHAI: String(1),
                            DIENTHOAI: '',
                            NGUOISUA: '',
                            HO: '',
                            TEN: '',
                            EMAIL: '',
                            DIACHI: '',
                            TINH: '',
                            QUANHUYEN: '',
                            XAPHUONG: '',
                            NGAYSINH: '',
                            GIOITINH: String(1)
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values
                            };

                            // same shape as initial values

                            if (
                                FileSelected !== undefined &&
                                FileSelected.name
                            ) {
                                SaveAnh()
                                    .then((dataResult) => {
                                        if (dataResult.Status) {
                                            ObjSave.ANH_DAIDIEN =
                                                dataResult.Data;

                                            onCreateAccount(ObjSave);
                                        } else {
                                            toast.error(
                                                dataResult.MessageError
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        toast.error('Lỗi kết nối');
                                    });
                            } else {
                                console.log('aaa');
                                onCreateAccount(ObjSave);
                            }
                            FileSelected = null;
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tên đang nhập"
                                    name="TENDANGNHAP"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TENDANGNHAP" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Mật khẩu"
                                    name="MATKHAU"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input.Password name="MATKHAU" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Trạng thái"
                                    name="TRANGTHAI"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="TRANGTHAI"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Hoạt động</Radio>
                                        <Radio value="0">Không hoạt động</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Họ" name="Ho">
                                    <Input name="Ho" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Tên" name="Ten">
                                    <Input name="Ten" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Điện thoại" name="DIENTHOAI">
                                    <Input name="DIENTHOAI" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Email" name="EMAIL">
                                    <Input name="EMAIL" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="TINH"
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
                                        name="TINH"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinh', value);
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
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="QUANHUYEN"
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
                                        name="QUANHUYEN"
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
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="XAPHUONG"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="XAPHUONG">
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
                                    name="DIACHI"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="DIACHI" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
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
                                                    new Date() < new Date(val)
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
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Ảnh đại diện"
                                    name="ANH_DAIDIEN"
                                >
                                    <Input
                                        type="file"
                                        name="ANH_DAIDIEN"
                                        key="ANH_DAIDIEN"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="ANH_DAIDIEN"
                                    id="ANH_DAIDIEN_PREVIEW"
                                    alt=""
                                    style={{
                                        width: '100px',
                                        height: '100px'
                                    }}
                                />
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Giới tính"
                                    name="GIOITINH"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="GIOITINH"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.TINH,
            quanhuyen: entityObj.QUANHUYEN
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
            }
        }
        return (
            <>
                <Modal
                    title="Cập nhật người dùng"
                    centered
                    visible={showEditModal}
                    onOk={() => submitEdit()}
                    onCancel={() => onCloseAccountEditModal()}
                    width={1000}
                    zIndex={1040}
                    okText="Hoàn thành"
                    cancelText="Đóng"
                >
                    <Form
                        ref={formRef}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: entityObj.Id,
                            TENDANGNHAP: entityObj.TENDANGNHAP,
                            MATKHAU: entityObj.MATKHAU,
                            TRANGTHAI: String(entityObj.TRANGTHAI),
                            DIENTHOAI: entityObj.DIENTHOAI,
                            NGUOISUA: entityObj.NGUOISUA,
                            HO: entityObj.HO,
                            TEN: entityObj.TEN,
                            EMAIL: entityObj.EMAIL,
                            DIACHI: entityObj.DIACHI,
                            TINH: entityObj.TINH,
                            QUANHUYEN: entityObj.QUANHUYEN,
                            XAPHUONG: entityObj.XAPHUONG,
                            NGAYSINH:
                                entityObj.NGAYSINH !== null
                                    ? moment(entityObj.NGAYSINH)
                                    : '',
                            // ANH_DAIDIEN: entityObj.ANH_DAIDIEN,
                            GIOITINH: String(entityObj.GIOITINH)
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values
                            };
                            // same shape as initial values
                            if (
                                FileSelected !== undefined &&
                                FileSelected.name
                            ) {
                                SaveAnh()
                                    .then((dataResult) => {
                                        if (dataResult.Status) {
                                            ObjSave.ANH_DAIDIEN =
                                                dataResult.Data;
                                            onSaveEditAccount(ObjSave);
                                        } else {
                                            toast.error(
                                                dataResult.MessageError
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        toast.error('Lỗi kết nối');
                                    });
                            } else {
                                ObjSave.ANH_DAIDIEN = entityObj.ANH_DAIDIEN;
                                onSaveEditAccount(ObjSave);
                            }
                            FileSelected = null;
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Id" hidden>
                                    <Input name="Id" />
                                </Form.Item>
                                <Form.Item
                                    label="Tên đang nhập"
                                    name="TENDANGNHAP"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TENDANGNHAP" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Mật khẩu"
                                    name="MATKHAU"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input.Password name="MATKHAU" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Trạng thái"
                                    name="TRANGTHAI"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="TRANGTHAI"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Hoạt động</Radio>
                                        <Radio value="0">Không hoạt động</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Họ" name="Ho">
                                    <Input name="Ho" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Tên" name="Ten">
                                    <Input name="Ten" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Điện thoại" name="DIENTHOAI">
                                    <Input name="DIENTHOAI" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Email" name="EMAIL">
                                    <Input name="EMAIL" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="TINH"
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
                                        name="TINH"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinh', value);
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
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="QUANHUYEN"
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
                                        name="QUANHUYEN"
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
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="XAPHUONG"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="XAPHUONG">
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
                                    name="DIACHI"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="DIACHI" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
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
                                                    new Date() < new Date(val)
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
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Ảnh đại diện"
                                    name="ANH_DAIDIEN"
                                >
                                    <Input
                                        type="file"
                                        name="ANH_DAIDIEN"
                                        key="ANH_DAIDIEN"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="ANH_DAIDIEN"
                                    id="ANH_DAIDIEN_PREVIEW"
                                    alt=""
                                    style={{
                                        width: '100px',
                                        height: '100px'
                                    }}
                                />
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Giới tính"
                                    name="GIOITINH"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="GIOITINH"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
    function RSPWModal() {
        const [showHidePassword, changeShowHidePassword] = useState(false);
        const submitRSPW = () => {
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        if (user.isAdmin === true) {
            return (
                <>
                    <Modal
                        title="Reset mật khẩu người dùng"
                        centered
                        visible={showRSPWModal}
                        onOk={() => submitRSPW()}
                        onCancel={() => onCloseRSPWModal()}
                        width={1000}
                        zIndex={1040}
                        okText="Hoàn thành"
                        cancelText="Đóng"
                    >
                        <Form
                            ref={formRef}
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                            layout="vertical"
                            initialValues={{
                                Id: entityObj.Id,
                                TENDANGNHAP: entityObj.TENDANGNHAP,
                                MATKHAU: ''
                            }}
                            onFinish={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values
                                };
                                onSaveRSPWAccount(ObjSave);
                            }}
                        >
                            <Form.Item name="Id" hidden>
                                <Input name="Id" />
                            </Form.Item>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 24}}
                                    md={{span: 24}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Tên đăng nhập"
                                        name="TENDANGNHAP"
                                    >
                                        <Input name="TENDANGNHAP" />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 24}}
                                    md={{span: 24}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item label="Mật khẩu" name="MATKHAU">
                                        <Input.Password name="MATKHAU" />
                                    </Form.Item>
                                </Col>

                                <Col
                                    lg={{span: 24}}
                                    md={{span: 24}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="Xác nhận mật khẩu"
                                        name="passwordConfirmation"
                                    >
                                        <Input.Password name="passwordConfirmation" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </>
            );
        }
        return <div />;
    }
    function DetailModal() {
        return (
            <>
                <Drawer
                    placement="right"
                    size="large"
                    visible={showDetailModal}
                    onClose={() => onCloseAccountModal()}
                    extra={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Space>
                            <Button
                                type="danger"
                                onClick={() => onCloseAccountModal()}
                            >
                                Đóng
                            </Button>
                        </Space>
                    }
                >
                    <Descriptions title="Chi tiết banner" bordered column={2}>
                        <Descriptions.Item label="Ảnh đại diện">
                            {entityObj.ANH_DAIDIEN !== '' ? (
                                <>
                                    <img
                                        src={`${Constant.PathServer}${entityObj.ANH_DAIDIEN}`}
                                        alt=""
                                        className="imgHinhAnh img-thumbnail"
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên đăng nhập">
                            {entityObj.TENDANGNHAP}
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ">
                            {entityObj.HO}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên">
                            {entityObj.TEN}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {entityObj.TRANGTHAI === 1
                                ? 'Hoạt động'
                                : 'Không hoạt động'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {CommonUtility.ShowDateVN(entityObj.NGAYSINH)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {entityObj.GIOITINH === 1 ? 'Nam' : 'Nữ'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Điện Thoại">
                            {entityObj.DIENTHOAI}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {entityObj.EMAIL}
                        </Descriptions.Item>
                        <Descriptions.Item label="Xã/Phường">
                            {entityObj.XAPHUONG}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quận/huyện">
                            {entityObj.QUANHUYEN}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tỉnh/Thành Phố">
                            {entityObj.TINH}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }
    const LockAccount = (id) => {
        confirmAlert({
            title: 'Xác nhận khoá?',
            message: 'Bạn chắc chắn muốn khoá truy cập của người dùng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onLockAccount(id);
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const UnlockAccount = (id) => {
        confirmAlert({
            title: 'Xác nhận mở khoá?',
            message: 'Bạn chắc chắn muốn mở khoá truy cập của người dùng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onUnlockAccount(id);
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ người dùng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onDeleteAccount(id);
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'Xác nhận xóa danh sách người dùng này?',
            message: 'Bạn chắc chắn muốn xóa bỏ danh sách người dùng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
                        } else {
                            toast.onError('Vui lòng chọn ít nhất một bản ghi');
                        }
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const RenderFormSearch = () => {
        return (
            <section
                className={`content  ${
                    showPanelSearch ? 'show fade' : 'hidden'
                }`}
            >
                <div className="container-fluid mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card title="Tìm kiếm">
                                <Form
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    layout="vertical"
                                    initialValues={{
                                        TENDANGNHAPFilter:
                                            searchModel.TENDANGNHAPFilter,
                                        TRANGTHAIFilter:
                                            searchModel.TRANGTHAIFilter,
                                        DIENTHOAIFilter:
                                            searchModel.DIENTHOAIFilter,
                                        HOFilter: searchModel.HOFilter,
                                        TENFilter: searchModel.TENFilter,
                                        EMAILIdFilter:
                                            searchModel.EMAILIdFilter,
                                        DIACHIFilter: searchModel.DIACHIFilter,
                                        GIOITINHFilter:
                                            searchModel.GIOITINHFilter
                                    }}
                                    onFinish={(values) =>
                                        onSubmitSearchSave(values)
                                    }
                                >
                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="TENDANGNHAPFilter"
                                                label="Tên đăng nhập"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 kí tự'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="TENDANGNHAPFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="TRANGTHAIFilter"
                                                label="Trạng thái"
                                            >
                                                <Select defaultValue="">
                                                    <Select.Option value="">
                                                        --Chọn--
                                                    </Select.Option>
                                                    <Select.Option value="1">
                                                        Hoạt động
                                                    </Select.Option>
                                                    <Select.Option value="0">
                                                        Không hoạt động
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="DIENTHOAIFilter"
                                                label="Điện thoại"
                                            >
                                                <Input name="DIENTHOAIFilter" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Họ"
                                                name="HOFilter"
                                            >
                                                <Input name="HOFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Tên"
                                                name="TENFilter"
                                            >
                                                <Input name="TENFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Email"
                                                name="EMAILIdFilter"
                                            >
                                                <Input name="EMAILIdFilter" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Địa chỉ"
                                                name="DIACHIFilter"
                                            >
                                                <Input name="DIACHIFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Giới tính"
                                                name="GIOITINHFilter"
                                            >
                                                <Select defaultValue="">
                                                    <Select.Option value="">
                                                        --Chọn--
                                                    </Select.Option>
                                                    <Select.Option value="1">
                                                        Nam
                                                    </Select.Option>
                                                    <Select.Option value="0">
                                                        Nữ
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col
                                            lg={{span: 24}}
                                            md={{span: 24}}
                                            sm={{span: 24}}
                                            xs={{span: 24}}
                                        >
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                Tìm kiếm
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    const NextPage = (pageInd) => {
        const searchMd = {
            ...searchModel,
            PageIndex: pageInd
        };
        onSubmitSearchSave(searchMd);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dataSelected = selectedRowKeys;
        }
    };
    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
        let pageInd = 1;
        let Count = 0;
        if (lstEntity !== null && lstEntity.ListItem !== undefined) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
            Count = lstEntity.Count;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        const getMenu = (record) => (
            <>
                <Menu>
                    {user.isAdmin && (
                        <Menu.Item
                            key={`RSPW_${record.Id}`}
                            icon={<antIcon.EditOutlined />}
                            onClick={() => onRSPWAccount(record.Id)}
                        >
                            Reset mật khẩu
                        </Menu.Item>
                    )}
                    {user.isAdmin && record.IsLock ? (
                        <Menu.Item
                            key={`LOCK_${record.Id}`}
                            icon={<antIcon.EditOutlined />}
                            onClick={() => UnlockAccount(record.Id)}
                        >
                            Mở Khoá tài khoản
                        </Menu.Item>
                    ) : (
                        <Menu.Item
                            key={`LOCK1_${record.Id}`}
                            icon={<antIcon.EditOutlined />}
                            onClick={() => LockAccount(record.Id)}
                        >
                            Khóa tài khoản
                        </Menu.Item>
                    )}

                    <Menu.Item
                        key={`vaitro_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={() => OpenAddRole(record.Id)}
                    >
                        Phân vai trò
                    </Menu.Item>
                    <Menu.Item
                        key={`sua_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={() => onEditAccount(record.Id)}
                    >
                        Sửa
                    </Menu.Item>
                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        icon={<antIcon.DeleteOutlined />}
                        onClick={() => DeleteAction(record.Id)}
                    >
                        Xóa
                    </Menu.Item>
                </Menu>
            </>
        );
        const columns = [
            {
                title: 'STT',
                key: 'STT',
                render: (text, record, index) => (
                    <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                )
            },
            {
                title: 'Hành động',
                key: 'HanhDong',
                render: (text, record) => {
                    console.log(record);
                    return (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getMenu(record)}
                        >
                            Chi tiết
                        </Dropdown.Button>
                    );
                }
            },
            {
                title: 'Ảnh',
                key: 'Anh',
                render: (text, record, index) =>
                    record.ANH_DAIDIEN !== '' ? (
                        <>
                            <img
                                src={`${Constant.PathServer}${record.ANH_DAIDIEN}`}
                                onError={NotFoundUserImage}
                                alt=""
                                className="imgHinhAnhAccount img-thumbnail"
                            />
                        </>
                    ) : (
                        <></>
                    )
            },
            {
                title: 'Tên đăng nhập',
                key: 'TenDangNhap',
                render: (text, record, index) => <div>{record.TENDANGNHAP}</div>
            },
            {
                title: 'Họ & Tên',
                key: 'HoTen',
                render: (text, record, index) => (
                    <div>
                        {record.HO}
                        &nbsp; {record.TEN}
                    </div>
                )
            },
            {
                title: 'Email',
                key: 'email',
                render: (text, record, index) => <div>{record.Email}</div>
            },
            {
                title: 'Trạng Thái',
                key: 'TrangThai',
                render: (text, record, index) => (
                    <div>
                        {record.TRANGTHAI === 1
                            ? 'Hoạt động'
                            : 'Không hoạt động'}
                    </div>
                )
            },
            {
                title: 'Ngày Sinh',
                key: 'ngaysinh',
                render: (text, record, index) => (
                    <div>{CommonUtility.ShowDateVN(record.NGAYSINH)}</div>
                )
            },
            {
                title: 'Giới tính',
                key: 'gioitinh',
                render: (text, record, index) => (
                    <div>{record.GIOITINH === 1 ? 'Nam' : 'Nữ'}</div>
                )
            },
            {
                title: 'Địa chỉ',
                key: 'diachi',
                render: (text, record, index) => <div>{record.DIACHI}</div>
            }
        ];
        return (
            <>
                <EditModal />
                <DetailModal />
                <RSPWModal />

                <Table
                    id="dsTable"
                    rowKey="Id"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={lstItem}
                    pagination={{
                        total: Count,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSize: pageSiz,
                        current: pageInd,
                        showTotal: (total) => `Tổng cộng ${total} bản ghi`,
                        onChange: (page, pageSize) => {
                            NextPage(page, pageSize);
                        }
                    }}
                />
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Quản lý người dùng" />
            <RenderFormSearch />
            <AddRole
                ShowAddRole={ShowAddRole}
                setShowAddRole={setShowAddRole}
                Userid={Userid}
                lstRole={lstRole}
                lstRoleId={lstRoleId}
            />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <Space>
                                        <CreateModal />
                                        <Button
                                            type="primary"
                                            onClick={() => ToggleSearchPanel()}
                                        >
                                            {showPanelSearch ? (
                                                <>
                                                    <i
                                                        className="fa fa-times"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; Đóng tìm kiếm
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; Tìm kiếm
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="danger"
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            />{' '}
                                            &nbsp; Xóa
                                        </Button>
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <RenderDsTable />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    LoadAccountData: (objSearch) => {
        AccountService.LoadAccount(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: ACCOUNT_SEARCH_SAVE, searchModel: objSearch});
    },
    onOpenDetailModal: (id) => {
        AccountService.OpenDetailModalSV(dispatch, id);
    },
    onCloseAccountModal: () => {
        dispatch({type: ACCOUNT_CLOSE_VIEWDETAIL});
    },

    onCreateAccount: (Account) => {
        AccountService.CreateNewAccount(dispatch, Account);
    },
    onDeleteAccount: (id) => {
        AccountService.DeleteAccount(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        AccountService.DeleteMultiEntity(dispatch, id);
    },
    onEditAccount: (id) => {
        AccountService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditAccount: (Account) => {
        AccountService.EditNewAccount(dispatch, Account);
    },
    onCloseAccountEditModal: (id) => {
        dispatch({type: ACCOUNT_EDIT_CLOSE});
    },
    onRSPWAccount: (id) => {
        AccountService.OpenRSPWAModalSV(dispatch, id);
    },
    onSaveRSPWAccount: (Account) => {
        AccountService.RSPWAccount(dispatch, Account);
    },
    onCloseRSPWModal: () => {
        dispatch({type: ACCOUNT_RSPW_CLOSE});
    },
    onLockAccount: (id) => {
        AccountService.LockAccount(dispatch, id);
    },
    onUnlockAccount: (id) => {
        AccountService.UnlockAccount(dispatch, id);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.account.lstEntity,
    IsUpdate: state.account.IsUpdate,
    entityObj: state.account.entityObj,
    showDetailModal: state.account.showDetailModal,
    showEditModal: state.account.showEditModal,
    isInit: state.account.isInit,
    searchModel: state.account.searchModel,
    showRSPWModal: state.account.showRSPWModal,
    user: state.auth.currentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountAdm);
