import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {NotFoundImage} from '@modules/Common/NotFound';

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
import * as AccountService from '@app/services/AccountServerService';
import {
    ACCOUNT_CHANGEPW_CLOSE,
    ACCOUNT_CHANGEPW_OPEN
} from '@app/store/ActionType/AccountTypeAction';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import AdminSecsionHead from '../AdminSecsionHead';

const ProfileAdm = (props) => {
    const {
        entityObj,
        showChangePWModal,
        onLoadAccountDetail,
        onCloseChangePWModal,
        onSaveChangePWAccount,
        onOpenChangePWModal,
        isInit
    } = props;
    useEffect(() => {
        if (!isInit) {
            onLoadAccountDetail();
        }
    });
    const formRef = useRef();
    // import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
    const SignupSchema = Yup.object().shape({
        MATKHAU: Yup.string().required('Vui lòng nhập thông tin này'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('MATKHAU'), null],
            'Mật khẩu phải trùng'
        )
    });
    function ChangePWModal() {
        const [showHidePassword, changeShowHidePassword] = useState(false);
        const submitRSPW = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={showChangePWModal}
                    size="md"
                    onHide={() => onCloseChangePWModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Đổi mật khẩu người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                MATKHAU: '',
                                passwordConfirmation: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                onSaveChangePWAccount(values);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formRef}>
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
                                        {errors.MATKHAU && touched.MATKHAU ? (
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
                                                {errors.passwordConfirmation}
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
                            onClick={() => onCloseChangePWModal()}
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
    const RenderUserDetail = () => {
        return (
            <>
                <ChangePWModal />
                <ListGroup className="list-group-flush">
                    <ListGroupItem>
                        <dl className="row">
                            <dt className="col-sm-2">Ảnh đại diện</dt>
                            <dd className="col-sm-10">
                                {entityObj.ANH_DAIDIEN !== '' ? (
                                    <>
                                        <img
                                            // src={`${Constant.PathServer}${entityObj.ANH_DAIDIEN}`}
                                            src={
                                                entityObj.ANH_DAIDIEN ||
                                                '/img/default-profile.png'
                                            }
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
                            <dd className="col-sm-4">{entityObj.TEN}</dd>
                        </dl>
                    </ListGroupItem>
                    <ListGroupItem>
                        <dl className="row">
                            <dt className="col-sm-2">Ngày sinh</dt>
                            <dd className="col-sm-4">
                                {CommonUtility.ShowDateVN(entityObj.NGAYSINH)}
                            </dd>
                            <dt className="col-sm-2">Giới tính</dt>
                            <dd className="col-sm-4">
                                {entityObj.GIOITINH === 1 ? 'Nam' : 'Nữ'}
                            </dd>
                        </dl>
                    </ListGroupItem>
                    <ListGroupItem>
                        <dl className="row">
                            <dt className="col-sm-2">Điện thoại</dt>
                            <dd className="col-sm-4">{entityObj.DIENTHOAI}</dd>
                            <dt className="col-sm-2">Email</dt>
                            <dd className="col-sm-4">{entityObj.EMAIL}</dd>
                        </dl>
                    </ListGroupItem>
                    <ListGroupItem>
                        <dl className="row">
                            <dt className="col-sm-2">Địa chỉ</dt>
                            <dd className="col-sm-10">{entityObj.DIACHI}</dd>
                        </dl>
                    </ListGroupItem>
                </ListGroup>
            </>
        );
    };
    return (
        <>
            <AdminSecsionHead ModuleName="Quản lý cá nhân" />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay lại
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="button-action"
                                        onClick={() => onOpenChangePWModal()}
                                    >
                                        <i
                                            className="fas fa-key"
                                            aria-hidden="true"
                                        />{' '}
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <RenderUserDetail />
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
    onLoadAccountDetail: () => {
        AccountService.LoadAccountDetail(dispatch);
    },
    onCloseChangePWModal: () => {
        dispatch({type: ACCOUNT_CHANGEPW_CLOSE});
    },
    onOpenChangePWModal: () => {
        dispatch({type: ACCOUNT_CHANGEPW_OPEN});
    },
    onSaveChangePWAccount: (Account) => {
        AccountService.RSPWAccount(dispatch, Account);
    }
});
const mapStateToProps = (state) => ({
    entityObj: state.profile.entityObj,
    showChangePWModal: state.profile.showChangePWModal,
    isInit: state.profile.isInit
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAdm);
