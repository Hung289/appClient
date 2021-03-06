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
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        MATKHAU: Yup.string()
            .trim()
            .min(6, 'Vui l??ng nh???p ??t nh???t 6 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('MATKHAU'), null],
            'M???t kh???u ph???i tr??ng'
        ),
        NGAYSINH: Yup.string()
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
        TINH: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        XAPHUONG: Yup.string().required('Vui l??ng nh???p th??ng tin n??y'),
        QUANHUYEN: Yup.string().required('Vui l??ng nh???p th??ng tin n??y')
    });
    const ChangePassSchema = Yup.object().shape({
        MATKHAU: Yup.string()
            .trim()
            .min(6, 'Vui l??ng nh???p ??t nh???t 6 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('MATKHAU'), null],
            'M???t kh???u ph???i tr??ng'
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
                toast.error('L???i l??u ???nh');
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
                    &nbsp; T???o m???i
                </Button>

                <Modal
                    title="Th??m m???i ng?????i d??ng"
                    centered
                    visible={show}
                    onOk={() => submitCreate()}
                    onCancel={handleClose}
                    width={1000}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="????ng"
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
                                        toast.error('L???i k???t n???i');
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
                                    label="T??n ??ang nh???p"
                                    name="TENDANGNHAP"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="M???t kh???u"
                                    name="MATKHAU"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="Tr???ng th??i"
                                    name="TRANGTHAI"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="TRANGTHAI"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Ho???t ?????ng</Radio>
                                        <Radio value="0">Kh??ng ho???t ?????ng</Radio>
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
                                <Form.Item label="H???" name="Ho">
                                    <Input name="Ho" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="T??n" name="Ten">
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
                                <Form.Item label="??i???n tho???i" name="DIENTHOAI">
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
                                    label="T???nh/Th??nh Ph???"
                                    name="TINH"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
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
                                    label="Qu???n/Huy???n"
                                    name="QUANHUYEN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
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
                                    label="X??/Ph?????ng"
                                    name="XAPHUONG"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="XAPHUONG">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                    name="DIACHI"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="Ng??y sinh"
                                    rules={[
                                        {
                                            type: 'object',
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="???nh ?????i di???n"
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
                                    label="Gi???i t??nh"
                                    name="GIOITINH"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="GIOITINH"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">N???</Radio>
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
                    title="C???p nh???t ng?????i d??ng"
                    centered
                    visible={showEditModal}
                    onOk={() => submitEdit()}
                    onCancel={() => onCloseAccountEditModal()}
                    width={1000}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="????ng"
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
                                        toast.error('L???i k???t n???i');
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
                                    label="T??n ??ang nh???p"
                                    name="TENDANGNHAP"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="M???t kh???u"
                                    name="MATKHAU"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="Tr???ng th??i"
                                    name="TRANGTHAI"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="TRANGTHAI"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Ho???t ?????ng</Radio>
                                        <Radio value="0">Kh??ng ho???t ?????ng</Radio>
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
                                <Form.Item label="H???" name="Ho">
                                    <Input name="Ho" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="T??n" name="Ten">
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
                                <Form.Item label="??i???n tho???i" name="DIENTHOAI">
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
                                    label="T???nh/Th??nh Ph???"
                                    name="TINH"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
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
                                    label="Qu???n/Huy???n"
                                    name="QUANHUYEN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
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
                                    label="X??/Ph?????ng"
                                    name="XAPHUONG"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="XAPHUONG">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                    name="DIACHI"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                    label="Ng??y sinh"
                                    rules={[
                                        {
                                            type: 'object',
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="???nh ?????i di???n"
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
                                    label="Gi???i t??nh"
                                    name="GIOITINH"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="GIOITINH"
                                        defaultValue="1"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">N???</Radio>
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
                        title="Reset m???t kh???u ng?????i d??ng"
                        centered
                        visible={showRSPWModal}
                        onOk={() => submitRSPW()}
                        onCancel={() => onCloseRSPWModal()}
                        width={1000}
                        zIndex={1040}
                        okText="Ho??n th??nh"
                        cancelText="????ng"
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
                                        label="T??n ????ng nh???p"
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
                                    <Form.Item label="M???t kh???u" name="MATKHAU">
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
                                        label="X??c nh???n m???t kh???u"
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
                                ????ng
                            </Button>
                        </Space>
                    }
                >
                    <Descriptions title="Chi ti???t banner" bordered column={2}>
                        <Descriptions.Item label="???nh ?????i di???n">
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
                        <Descriptions.Item label="T??n ????ng nh???p">
                            {entityObj.TENDANGNHAP}
                        </Descriptions.Item>
                        <Descriptions.Item label="H???">
                            {entityObj.HO}
                        </Descriptions.Item>
                        <Descriptions.Item label="T??n">
                            {entityObj.TEN}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tr???ng th??i">
                            {entityObj.TRANGTHAI === 1
                                ? 'Ho???t ?????ng'
                                : 'Kh??ng ho???t ?????ng'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ng??y sinh">
                            {CommonUtility.ShowDateVN(entityObj.NGAYSINH)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gi???i t??nh">
                            {entityObj.GIOITINH === 1 ? 'Nam' : 'N???'}
                        </Descriptions.Item>
                        <Descriptions.Item label="??i???n Tho???i">
                            {entityObj.DIENTHOAI}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {entityObj.EMAIL}
                        </Descriptions.Item>
                        <Descriptions.Item label="X??/Ph?????ng">
                            {entityObj.XAPHUONG}
                        </Descriptions.Item>
                        <Descriptions.Item label="Qu???n/huy???n">
                            {entityObj.QUANHUYEN}
                        </Descriptions.Item>
                        <Descriptions.Item label="T???nh/Th??nh Ph???">
                            {entityObj.TINH}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }
    const LockAccount = (id) => {
        confirmAlert({
            title: 'X??c nh???n kho???',
            message: 'B???n ch???c ch???n mu???n kho?? truy c???p c???a ng?????i d??ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        onLockAccount(id);
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };
    const UnlockAccount = (id) => {
        confirmAlert({
            title: 'X??c nh???n m??? kho???',
            message: 'B???n ch???c ch???n mu???n m??? kho?? truy c???p c???a ng?????i d??ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        onUnlockAccount(id);
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? ng?????i d??ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        onDeleteAccount(id);
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'X??c nh???n x??a danh s??ch ng?????i d??ng n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? danh s??ch ng?????i d??ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
                        } else {
                            toast.onError('Vui l??ng ch???n ??t nh???t m???t b???n ghi');
                        }
                    }
                },
                {
                    label: '????ng',
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
                            <Card title="T??m ki???m">
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
                                                label="T??n ????ng nh???p"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                                label="Tr???ng th??i"
                                            >
                                                <Select defaultValue="">
                                                    <Select.Option value="">
                                                        --Ch???n--
                                                    </Select.Option>
                                                    <Select.Option value="1">
                                                        Ho???t ?????ng
                                                    </Select.Option>
                                                    <Select.Option value="0">
                                                        Kh??ng ho???t ?????ng
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
                                                label="??i???n tho???i"
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
                                                label="H???"
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
                                                label="T??n"
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
                                                label="?????a ch???"
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
                                                label="Gi???i t??nh"
                                                name="GIOITINHFilter"
                                            >
                                                <Select defaultValue="">
                                                    <Select.Option value="">
                                                        --Ch???n--
                                                    </Select.Option>
                                                    <Select.Option value="1">
                                                        Nam
                                                    </Select.Option>
                                                    <Select.Option value="0">
                                                        N???
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
                                                T??m ki???m
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
                            Reset m???t kh???u
                        </Menu.Item>
                    )}
                    {user.isAdmin && record.IsLock ? (
                        <Menu.Item
                            key={`LOCK_${record.Id}`}
                            icon={<antIcon.EditOutlined />}
                            onClick={() => UnlockAccount(record.Id)}
                        >
                            M??? Kho?? t??i kho???n
                        </Menu.Item>
                    ) : (
                        <Menu.Item
                            key={`LOCK1_${record.Id}`}
                            icon={<antIcon.EditOutlined />}
                            onClick={() => LockAccount(record.Id)}
                        >
                            Kh??a t??i kho???n
                        </Menu.Item>
                    )}

                    <Menu.Item
                        key={`vaitro_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={() => OpenAddRole(record.Id)}
                    >
                        Ph??n vai tr??
                    </Menu.Item>
                    <Menu.Item
                        key={`sua_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={() => onEditAccount(record.Id)}
                    >
                        S???a
                    </Menu.Item>
                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        icon={<antIcon.DeleteOutlined />}
                        onClick={() => DeleteAction(record.Id)}
                    >
                        X??a
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
                title: 'H??nh ?????ng',
                key: 'HanhDong',
                render: (text, record) => {
                    console.log(record);
                    return (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getMenu(record)}
                        >
                            Chi ti???t
                        </Dropdown.Button>
                    );
                }
            },
            {
                title: '???nh',
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
                title: 'T??n ????ng nh???p',
                key: 'TenDangNhap',
                render: (text, record, index) => <div>{record.TENDANGNHAP}</div>
            },
            {
                title: 'H??? & T??n',
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
                title: 'Tr???ng Th??i',
                key: 'TrangThai',
                render: (text, record, index) => (
                    <div>
                        {record.TRANGTHAI === 1
                            ? 'Ho???t ?????ng'
                            : 'Kh??ng ho???t ?????ng'}
                    </div>
                )
            },
            {
                title: 'Ng??y Sinh',
                key: 'ngaysinh',
                render: (text, record, index) => (
                    <div>{CommonUtility.ShowDateVN(record.NGAYSINH)}</div>
                )
            },
            {
                title: 'Gi???i t??nh',
                key: 'gioitinh',
                render: (text, record, index) => (
                    <div>{record.GIOITINH === 1 ? 'Nam' : 'N???'}</div>
                )
            },
            {
                title: '?????a ch???',
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
                        showTotal: (total) => `T???ng c???ng ${total} b???n ghi`,
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
            <AdminSecsionHead ModuleName="Qu???n l?? ng?????i d??ng" />
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
                                                    &nbsp; ????ng t??m ki???m
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; T??m ki???m
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
                                            &nbsp; X??a
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
