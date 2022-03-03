import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import {NotFoundUserImage} from '@modules/Common/NotFoundUser';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import axios from 'axios';
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card
} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
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
        const image = document.getElementById('ANH_DAIDIEN');
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
            if (formRef.current) {
                formRef.current.handleSubmit();
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
                <Button
                    variant=""
                    className="btn-nobg"
                    size="sm"
                    onClick={handleShow}
                >
                    <i className="fa fa-plus" aria-hidden="true" />
                    Tạo mới
                </Button>

                <Modal show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo mới người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
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
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
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
                                    onCreateAccount(ObjSave);
                                }
                                FileSelected = null;
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateAccount}>
                                    <div className="form-group">
                                        <label htmlFor="TENDANGNHAP">
                                            Tên đăng nhập
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TENDANGNHAP"
                                            key="TENDANGNHAP"
                                            className="form-control "
                                        />
                                        {errors.TENDANGNHAP &&
                                        touched.TENDANGNHAP ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TENDANGNHAP}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="MATKHAU">
                                            Mật khẩu
                                            <span className="red">*</span>
                                            <i
                                                aria-hidden="true"
                                                className="fas fa-eye icon"
                                                onClick={() =>
                                                    changeShowHidePassword(
                                                        !showHidePassword
                                                    )
                                                }
                                            />
                                        </label>
                                        <Field
                                            type={
                                                showHidePassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="MATKHAU"
                                            key="MATKHAU"
                                            className="form-control"
                                        />
                                        {errors.MATKHAU && touched.MATKHAU ? (
                                            <div className="invalid-feedback">
                                                {errors.MATKHAU}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="TRANGTHAI">
                                            Trạng thái
                                            <span className="red">*</span>
                                        </label>
                                        <div
                                            role="group"
                                            aria-labelledby="my-radio-group"
                                        >
                                            <label htmlFor className="mgr15">
                                                <Field
                                                    type="radio"
                                                    name="TRANGTHAI"
                                                    value="1"
                                                />
                                                Hoạt động
                                            </label>
                                            <label htmlFor>
                                                <Field
                                                    type="radio"
                                                    name="TRANGTHAI"
                                                    value="0"
                                                />
                                                Không hoạt động
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="HO">
                                                Họ{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="HO"
                                                key="HO"
                                                className="form-control "
                                            />
                                            {errors.HO && touched.HO ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HO}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="TEN">
                                                Tên{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="TEN"
                                                key="TEN"
                                                className="form-control "
                                            />
                                            {errors.TEN && touched.TEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="DIENTHOAI">
                                                Điện thoại
                                            </label>
                                            <Field
                                                name="DIENTHOAI"
                                                key="DIENTHOAI"
                                                className="form-control "
                                            />
                                            {errors.DIENTHOAI &&
                                            touched.DIENTHOAI ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.DIENTHOAI}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="EMAIL">Email</label>
                                            <Field
                                                name="EMAIL"
                                                key="EMAIL"
                                                className="form-control "
                                            />
                                            {errors.EMAIL && touched.EMAIL ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.EMAIL}
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
                                                name="TINH"
                                                key="TINH"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'tinh',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'TINH',
                                                        value
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
                                            {errors.TINH && touched.TINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="QUANHUYEN"
                                                className="chitietdiachi"
                                            >
                                                Quận/Huyện
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="QUANHUYEN"
                                                key="QUANHUYEN"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'quanhuyen',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'QUANHUYEN',
                                                        value
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
                                            {errors.QUANHUYEN &&
                                            touched.QUANHUYEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.QUANHUYEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="XAPHUONG"
                                                className="chitietdiachi"
                                            >
                                                Xã/Phường
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="XAPHUONG"
                                                key="XAPHUONG"
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
                                            {errors.XAPHUONG &&
                                            touched.XAPHUONG ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.XAPHUONG}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label
                                            htmlFor="DIACHI"
                                            className="chitietdiachi"
                                        >
                                            Số nhà, phố, tổ dân phố/thôn/đội
                                        </label>
                                        <Field
                                            name="DIACHI"
                                            key="DIACHI"
                                            className="form-control "
                                        />
                                        {errors.DIACHI && touched.DIACHI ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.DIACHI}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label htmlFor="NGAYSINH">
                                            Ngày sinh
                                        </label>
                                        <Field
                                            type="date"
                                            name="NGAYSINH"
                                            key="NGAYSINH"
                                            className="form-control "
                                        />
                                        {errors.NGAYSINH && touched.NGAYSINH ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.NGAYSINH}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="GIOITINH">
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
                                                        name="GIOITINH"
                                                        value="1"
                                                    />
                                                    Nam
                                                </label>
                                                <label htmlFor>
                                                    <Field
                                                        type="radio"
                                                        name="GIOITINH"
                                                        value="0"
                                                    />
                                                    Nữ
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-row col-md-6">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="ANH_DAIDIEN">
                                                    Ảnh đại diện
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ANH_DAIDIEN"
                                                    key="ANH_DAIDIEN"
                                                    className="form-control "
                                                    onChange={ChangeFileUpload}
                                                />
                                                {errors.ANH_DAIDIEN &&
                                                touched.ANH_DAIDIEN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ANH_DAIDIEN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="form-group col-md-6">
                                                <div>
                                                    <img
                                                        className="ANH_DAIDIEN"
                                                        id="ANH_DAIDIEN"
                                                        alt=""
                                                        style={{
                                                            width: '100px',
                                                            height: '100px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={submitCreate}>
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
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
                    show={showEditModal}
                    size="lg"
                    onHide={() => onCloseAccountEditModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cập nhật người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
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
                                NGAYSINH: CommonUtility.GetDateSetField(
                                    entityObj.NGAYSINH
                                ),
                                // ANH_DAIDIEN: entityObj.ANH_DAIDIEN,
                                GIOITINH: String(entityObj.GIOITINH)
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
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
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateAccount}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <div className="form-group">
                                        <label htmlFor="TENDANGNHAP">
                                            Tên đăng nhập
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TENDANGNHAP"
                                            key="TENDANGNHAP"
                                            className="form-control "
                                        />
                                        {errors.TENDANGNHAP &&
                                        touched.TENDANGNHAP ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TENDANGNHAP}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="TRANGTHAI">
                                            Trạng thái
                                            <span className="red">*</span>
                                        </label>
                                        <div
                                            role="group"
                                            aria-labelledby="my-radio-group"
                                        >
                                            <label htmlFor className="mgr15">
                                                <Field
                                                    type="radio"
                                                    name="TRANGTHAI"
                                                    value="1"
                                                />
                                                Hoạt động
                                            </label>
                                            <label htmlFor>
                                                <Field
                                                    type="radio"
                                                    name="TRANGTHAI"
                                                    value="0"
                                                />
                                                Không hoạt động
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="HO">
                                                Họ{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="HO"
                                                key="HO"
                                                className="form-control "
                                            />
                                            {errors.HO && touched.HO ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HO}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="TEN">
                                                Tên{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="TEN"
                                                key="TEN"
                                                className="form-control "
                                            />
                                            {errors.TEN && touched.TEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="NGAYSINH">
                                                Ngày sinh
                                            </label>
                                            <Field
                                                type="date"
                                                name="NGAYSINH"
                                                key="NGAYSINH"
                                                className="form-control "
                                            />
                                            {errors.NGAYSINH &&
                                            touched.NGAYSINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.NGAYSINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="GIOITINH">
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
                                                        name="GIOITINH"
                                                        value="1"
                                                    />
                                                    Nam
                                                </label>
                                                <label htmlFor>
                                                    <Field
                                                        type="radio"
                                                        name="GIOITINH"
                                                        value="0"
                                                    />
                                                    Nữ
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="DIENTHOAI">
                                            Điện thoại
                                        </label>
                                        <Field
                                            name="DIENTHOAI"
                                            key="DIENTHOAI"
                                            className="form-control "
                                        />
                                        {errors.DIENTHOAI &&
                                        touched.DIENTHOAI ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.DIENTHOAI}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="EMAIL">Email</label>
                                        <Field
                                            name="EMAIL"
                                            key="EMAIL"
                                            className="form-control "
                                        />
                                        {errors.EMAIL && touched.EMAIL ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.EMAIL}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    {/* <div className="form-group col-md-6">
                                            <label htmlFor="DIACHI">
                                                Địa chỉ
                                            </label>
                                            <Field
                                                name="DIACHI"
                                                key="DIACHI"
                                                className="form-control "
                                            />
                                            {errors.DIACHI && touched.DIACHI ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.DIACHI}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="XAPHUONG">
                                                Xã/Phường
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="XAPHUONG"
                                                key="XAPHUONG"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {RenderDropdownDanhMuc({
                                                    code: 'xaphuong'
                                                })}
                                            </Field>
                                            {errors.XAPHUONG &&
                                            touched.XAPHUONG ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.XAPHUONG}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="QUANHUYEN">
                                                Quận/Huyện
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="QUANHUYEN"
                                                key="QUANHUYEN"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {RenderDropdownDanhMuc({
                                                    code: 'QUANHUYEN'
                                                })}
                                            </Field>
                                            {errors.QUANHUYEN &&
                                            touched.QUANHUYEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.QUANHUYEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label htmlFor="tinh">
                                                Tỉnh/Thành Phố
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="TINH"
                                                key="TINH"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {RenderDropdownDanhMuc({
                                                    code: 'tinh'
                                                })}
                                            </Field>
                                            {errors.TINH && touched.TINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div> */}
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
                                                name="TINH"
                                                key="TINH"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'tinh',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'TINH',
                                                        value
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
                                            {errors.TINH && touched.TINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="QUANHUYEN"
                                                className="chitietdiachi"
                                            >
                                                Quận/Huyện
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="QUANHUYEN"
                                                key="QUANHUYEN"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'quanhuyen',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'QUANHUYEN',
                                                        value
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
                                            {errors.QUANHUYEN &&
                                            touched.QUANHUYEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.QUANHUYEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="XAPHUONG"
                                                className="chitietdiachi"
                                            >
                                                Xã/Phường
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="XAPHUONG"
                                                key="XAPHUONG"
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
                                            {errors.XAPHUONG &&
                                            touched.XAPHUONG ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.XAPHUONG}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label
                                            htmlFor="DIACHI"
                                            className="chitietdiachi"
                                        >
                                            Số nhà, phố, tổ dân phố/thôn/đội
                                        </label>
                                        <Field
                                            name="DIACHI"
                                            key="DIACHI"
                                            className="form-control "
                                        />
                                        {errors.DIACHI && touched.DIACHI ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.DIACHI}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <br />
                                    <div className="form-row">
                                        <div className="form-row col-md-6">
                                            <div className="form-group ">
                                                <label htmlFor="ANH_DAIDIEN">
                                                    Ảnh đại diện
                                                </label>
                                                <Field
                                                    type="file"
                                                    name="ANH_DAIDIEN"
                                                    key="ANH_DAIDIEN"
                                                    className="form-control "
                                                    onChange={ChangeFileUpload}
                                                />
                                                {errors.ANH_DAIDIEN &&
                                                touched.ANH_DAIDIEN ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.ANH_DAIDIEN}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="ANH_DAIDIEN">
                                                    Ảnh đại diện cũ
                                                </label>
                                                <div>
                                                    {entityObj.ANH_DAIDIEN !==
                                                    '' ? (
                                                        <>
                                                            <img
                                                                src={`${Constant.PathServer}${entityObj.ANH_DAIDIEN}`}
                                                                onError={
                                                                    NotFoundUserImage
                                                                }
                                                                alt=""
                                                                className="imgHinhAnhAccount img-thumbnail"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>
                                                                Chưa có ảnh đại
                                                                diện
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="ANH_DAIDIEN">
                                                    Ảnh đại diện mới
                                                </label>
                                                <div>
                                                    {entityObj.ANH_DAIDIEN !==
                                                    '' ? (
                                                        <>
                                                            <img
                                                                className="ANH_DAIDIEN"
                                                                id="ANH_DAIDIEN"
                                                                alt=""
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>
                                                                Chưa có ảnh đại
                                                                diện
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseAccountEditModal()}
                        >
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={submitEdit}>
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    function DropdownRSPWAdmin({userEntity}) {
        if (user.isAdmin === true) {
            return (
                <>
                    <Dropdown.Item onClick={() => onRSPWAccount(userEntity.Id)}>
                        <i className="fas fa-undo" /> Reset mật khẩu
                    </Dropdown.Item>
                </>
            );
        }
        return <div />;
    }

    function RSPWModal() {
        const [showHidePassword, changeShowHidePassword] = useState(false);
        const submitRSPW = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        if (user.isAdmin === true) {
            return (
                <>
                    <Modal
                        show={showRSPWModal}
                        size="lg"
                        onHide={() => onCloseRSPWModal()}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Reset mật khẩu người dùng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Formik
                                innerRef={formRef}
                                initialValues={{
                                    Id: entityObj.Id,
                                    TENDANGNHAP: entityObj.TENDANGNHAP,
                                    MATKHAU: ''
                                }}
                                validationSchema={ChangePassSchema}
                                onSubmit={(values) => {
                                    // same shape as initial values
                                    const ObjSave = {
                                        ...values
                                    };
                                    onSaveRSPWAccount(ObjSave);
                                }}
                            >
                                {({errors, touched}) => (
                                    <Form ref={formRef}>
                                        <Field
                                            type="hidden"
                                            name="Id"
                                            key="Id"
                                        />
                                        <div className="form-group">
                                            <label htmlFor="TENDANGNHAP">
                                                Tên đăng nhập
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="TENDANGNHAP"
                                                key="TENDANGNHAP"
                                                disabled="disabled"
                                                className="form-control "
                                            />
                                            {errors.TENDANGNHAP &&
                                            touched.TENDANGNHAP ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TENDANGNHAP}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="MATKHAU">
                                                Mật khẩu
                                                <span className="red">*</span>
                                                &nbsp;
                                                <i
                                                    aria-hidden="true"
                                                    className="fas fa-eye icon"
                                                    onClick={() =>
                                                        changeShowHidePassword(
                                                            !showHidePassword
                                                        )
                                                    }
                                                />
                                            </label>
                                            <Field
                                                name="MATKHAU"
                                                key="MATKHAU"
                                                className="form-control"
                                                type={
                                                    showHidePassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                            />
                                            {errors.MATKHAU &&
                                            touched.MATKHAU ? (
                                                <div className="invalid-feedback">
                                                    {errors.MATKHAU}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="passwordConfirmation">
                                                Xác nhận mật khẩu
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="passwordConfirmation"
                                                key="passwordConfirmation"
                                                className="form-control"
                                                type={
                                                    showHidePassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                            />
                                            {errors.passwordConfirmation &&
                                            touched.passwordConfirmation ? (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.passwordConfirmation
                                                    }
                                                </div>
                                            ) : null}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => onCloseRSPWModal()}
                            >
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={submitRSPW}>
                                Hoàn thành
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }
        return <div />;
    }
    function DetailModal() {
        return (
            <>
                <Modal
                    show={showDetailModal}
                    size="lg"
                    onHide={() => onCloseAccountModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Ảnh đại diện</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.ANH_DAIDIEN !== '' ? (
                                            <>
                                                <img
                                                    src={`${Constant.PathServer}${entityObj.ANH_DAIDIEN}`}
                                                    alt=""
                                                    className="imgHinhAnhAccount img-thumbnail"
                                                />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên đăng nhập</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.TENDANGNHAP}
                                    </dd>

                                    <dt className="col-sm-2">Trạng thái</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.TRANGTHAI === 1
                                            ? 'Hoạt động'
                                            : 'Không hoạt động'}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Họ</dt>
                                    <dd className="col-sm-4">{entityObj.HO}</dd>
                                    <dt className="col-sm-2">Tên</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.TEN}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Ngày sinh</dt>
                                    <dd className="col-sm-4">
                                        {CommonUtility.ShowDateVN(
                                            entityObj.NGAYSINH
                                        )}
                                    </dd>
                                    <dt className="col-sm-2">Giới tính</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.GIOITINH === 1
                                            ? 'Nam'
                                            : 'Nữ'}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Điện thoại</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.DIENTHOAI}
                                    </dd>
                                    <dt className="col-sm-2">Email</dt>
                                    <dd className="col-sm-4">
                                        {entityObj.EMAIL}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Địa chỉ</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.DIACHI}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Xã/Phường</dt>
                                    <dd className="col-sm-2">
                                        {entityObj.XAPHUONG}
                                    </dd>
                                    <dt className="col-sm-2">Quận/Huyện</dt>
                                    <dd className="col-sm-2">
                                        {entityObj.QUANHUYEN}
                                    </dd>
                                    <dt className="col-sm-2">Tỉnh/Thành phố</dt>
                                    <dd className="col-sm-2">
                                        {entityObj.TINH}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseAccountModal()}
                        >
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
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

    function DropdownLockAdmin({userEntity}) {
        if (user.isAdmin === true) {
            if (userEntity.IsLock === true) {
                return (
                    <>
                        <Dropdown.Item
                            onClick={() => UnlockAccount(userEntity.Id)}
                        >
                            <i className="fas fa-lock-open" /> Mở khoá tài khoản
                        </Dropdown.Item>
                    </>
                );
            }
            return (
                <>
                    <Dropdown.Item onClick={() => LockAccount(userEntity.Id)}>
                        <i className="fas fa-lock" /> Khoá tài khoản
                    </Dropdown.Item>
                </>
            );
        }
        return <div />;
    }

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
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
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
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
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
                                            DIACHIFilter:
                                                searchModel.DIACHIFilter,
                                            GIOITINHFilter:
                                                searchModel.GIOITINHFilter
                                        }}
                                        validationSchema={SearchSchema}
                                        onSubmit={(values) => {
                                            onSubmitSearchSave(values);
                                        }}
                                    >
                                        {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TENDANGNHAPFilter">
                                                                Tên đăng nhập
                                                            </label>
                                                            <Field
                                                                name="TENDANGNHAPFilter"
                                                                key="TENDANGNHAPFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.TENDANGNHAPFilter &&
                                                            touched.TENDANGNHAPFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TENDANGNHAPFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TRANGTHAIFilter">
                                                                Trạng thái
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="TRANGTHAIFilter"
                                                                key="TRANGTHAIFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Chọn--
                                                                </option>
                                                                <option value="1">
                                                                    Hoạt động
                                                                </option>
                                                                <option value="0">
                                                                    Không hoạt
                                                                    động
                                                                </option>
                                                            </Field>
                                                            {errors.TRANGTHAIFilter &&
                                                            touched.TRANGTHAIFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TRANGTHAIFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="DIENTHOAIFilter">
                                                                Điện thoại
                                                            </label>
                                                            <Field
                                                                name="DIENTHOAIFilter"
                                                                key="DIENTHOAIFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.DIENTHOAIFilter &&
                                                            touched.DIENTHOAIFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.DIENTHOAIFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="HOFilter">
                                                                Họ
                                                            </label>
                                                            <Field
                                                                name="HOFilter"
                                                                key="HOFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.IsHotFilter &&
                                                            touched.IsHotFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.IsHotFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TENFilter">
                                                                Tên
                                                            </label>
                                                            <Field
                                                                name="TENFilter"
                                                                key="TENFilter"
                                                                className="form-control "
                                                            />

                                                            {errors.TENFilter &&
                                                            touched.TENFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TENFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="EMAILIdFilter">
                                                                Email
                                                            </label>
                                                            <Field
                                                                name="EMAILIdFilter"
                                                                key="EMAILIdFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.EMAILIdFilter &&
                                                            touched.EMAILIdFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.EMAILIdFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="DIACHIFilter">
                                                                Địa chỉ
                                                            </label>
                                                            <Field
                                                                name="DIACHIFilter"
                                                                key="DIACHIFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.DIACHIFilter &&
                                                            touched.DIACHIFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.DIACHIFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="GIOITINHFilter">
                                                                Giới tính
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="GIOITINHFilter"
                                                                key="GIOITINHFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Chọn--
                                                                </option>
                                                                <option value="1">
                                                                    Nam
                                                                </option>
                                                                <option value="0">
                                                                    Nữ
                                                                </option>
                                                            </Field>

                                                            {errors.GIOITINHFilter &&
                                                            touched.GIOITINHFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.GIOITINHFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="form-row">
                                                        <Button
                                                            variant="success"
                                                            size="md"
                                                            type="submit"
                                                            className="button-action"
                                                        >
                                                            <i
                                                                className="fa fa-search"
                                                                aria-hidden="true"
                                                            />{' '}
                                                            Tìm kiếm
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </Card.Body>
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

    const RenderPage = () => {
        const totalPage =
            lstEntity != null && lstEntity.TotalPage !== undefined
                ? lstEntity.TotalPage
                : 1;
        const curPage =
            lstEntity != null && lstEntity.CurrentPage !== undefined
                ? lstEntity.CurrentPage
                : 1;
        const reder = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < totalPage; i++) {
            let acClass = '';
            if (i + 1 === curPage) {
                acClass = 'active';
            }
            reder.push(
                <li className={`page-item ${acClass}`} key={i}>
                    <Button
                        className="page-link"
                        onClick={() => NextPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                </li>
            );
        }
        return reder;
    };

    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
        let pageInd = 1;
        if (lstEntity !== null && lstEntity.ListItem !== undefined) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        return (
            <>
                <EditModal />
                <DetailModal />
                <RSPWModal />

                <div className="table-responsive">
                    <table className="table table-hinetNew" id="dsTable">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        className="checkAll"
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th
                                    scope="col"
                                    className="imgHinhAnhColAccount mw-image-avatar"
                                >
                                    Ảnh
                                </th>
                                <th scope="col">Tên đăng nhập</th>
                                <th scope="col">Họ & Tên</th>

                                <th scope="col">Email</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Địa chỉ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lstItem.length > 0 ? (
                                lstItem.map((item, key) => {
                                    const rIndex =
                                        (pageInd - 1) * pageSiz + key + 1;
                                    return (
                                        <tr
                                            key={key}
                                            onClick={(e) =>
                                                CheckRowsHinetTable(e)
                                            }
                                        >
                                            <td>
                                                <input
                                                    className="checkTd"
                                                    type="checkbox"
                                                    data-id={item.Id}
                                                    onClick={(e) =>
                                                        CheckRowsHinetTable(e)
                                                    }
                                                />
                                            </td>
                                            <th scope="row">{rIndex}</th>
                                            <td>
                                                {item.ANH_DAIDIEN !== '' ? (
                                                    <>
                                                        <img
                                                            src={`${Constant.PathServer}${item.ANH_DAIDIEN}`}
                                                            onError={
                                                                NotFoundUserImage
                                                            }
                                                            alt=""
                                                            className="imgHinhAnhAccount img-thumbnail"
                                                        />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </td>
                                            <td>
                                                <div className="tableBoxMain">
                                                    <div className="tableBoxMain-label">
                                                        {item.TENDANGNHAP}
                                                    </div>
                                                    <div className="tableBoxMain-btnAction">
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                size="sm"
                                                                variant=""
                                                                className="dropdowTableBtn"
                                                            >
                                                                <i
                                                                    className="fa fa-ellipsis-h"
                                                                    aria-hidden="true"
                                                                />
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                <DropdownRSPWAdmin
                                                                    userEntity={
                                                                        item
                                                                    }
                                                                />
                                                                <DropdownLockAdmin
                                                                    userEntity={
                                                                        item
                                                                    }
                                                                />
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        OpenAddRole(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-edit" />
                                                                    </span>
                                                                    <span>
                                                                        Phân vai
                                                                        trò
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onEditAccount(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-edit" />
                                                                    </span>
                                                                    <span>
                                                                        Sửa
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        DeleteAction(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-times" />
                                                                    </span>
                                                                    <span>
                                                                        Xóa
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onOpenDetailModal(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-info-circle" />
                                                                    </span>
                                                                    <span>
                                                                        Xem chi
                                                                        tiết
                                                                    </span>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <p>
                                                    {item.HO}
                                                    &nbsp; {item.TEN}
                                                </p>
                                            </td>

                                            <td>{item.EMAIL}</td>
                                            <td>
                                                {item.TRANGTHAI === 1
                                                    ? 'Hoạt động'
                                                    : 'Không hoạt động'}
                                            </td>
                                            <td>
                                                {CommonUtility.ShowDateVN(
                                                    item.NGAYSINH
                                                )}
                                            </td>
                                            <td>
                                                {item.GIOITINH === 1
                                                    ? 'Nam'
                                                    : 'Nữ'}
                                            </td>
                                            <td>{item.DIACHI}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={9} />
                            )}
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        className="checkAll"
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th
                                    scope="col"
                                    className="imgHinhAnhColAccount mw-image-avatar"
                                >
                                    Ảnh
                                </th>
                                <th scope="col">Tên đăng nhập</th>
                                <th scope="col">Họ & Tên</th>

                                <th scope="col">Email</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Địa chỉ</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            Tổng số {lstEntity.Count} bản ghi trang hiện tại -
                            tổng số {lstEntity.TotalPage} trang
                        </div>

                        <div className="col-sm-6 right">
                            <nav
                                aria-label="Page navigation "
                                className="tblHinet-pagin"
                            >
                                <ul className="pagination pagination-sm">
                                    <li className="page-item">
                                        <Button
                                            className="page-link"
                                            onClick={() => NextPage(1)}
                                            aria-label="Previous"
                                        >
                                            <span aria-hidden="true">
                                                &laquo;
                                            </span>
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                        </Button>
                                    </li>
                                    <RenderPage />
                                    <li className="page-item">
                                        <Button
                                            className="page-link"
                                            onClick={() =>
                                                NextPage(
                                                    lstEntity != null
                                                        ? lstEntity.TotalPage
                                                        : 0
                                                )
                                            }
                                            aria-label="Next"
                                        >
                                            <span aria-hidden="true">
                                                &raquo;
                                            </span>
                                            <span className="sr-only">
                                                Next
                                            </span>
                                        </Button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
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
                                    <CreateModal />
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => ToggleSearchPanel()}
                                    >
                                        {showPanelSearch ? (
                                            <>
                                                <i
                                                    className="fa fa-times"
                                                    aria-hidden="true"
                                                />{' '}
                                                Đóng tìm kiếm
                                            </>
                                        ) : (
                                            <>
                                                <i
                                                    className="fa fa-search"
                                                    aria-hidden="true"
                                                />{' '}
                                                Tìm kiếm
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => DeleteMulTiBtnAction()}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        />{' '}
                                        Xóa
                                    </Button>
                                    {/* <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay lại
                                    </Button> */}
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
        console.log(objSearch);

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
