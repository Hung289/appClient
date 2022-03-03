import React, {useState} from 'react';
import {Link, Redirect, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {connect} from 'react-redux';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';

import * as Yup from 'yup';

import {Col, Row} from 'react-bootstrap';
import * as AuthService from '../../services/auth';
import Button from '../../components/button/Button';
import * as ActionTypes from '../../store/actions';

const Login = ({onUserLogin}) => {
    const [isAuthLoading, setAuthLoading] = useState(false);
    const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
    const [isFacebookAuthLoading, setFacebookAuthLoading] = useState(false);

    const history = useHistory();
    const [t] = useTranslation();

    const login = async (email, password) => {
        try {
            setAuthLoading(true);
            const token = await AuthService.loginByAuth(email, password);
            toast.success('Đăng nhập thành công!');
            setAuthLoading(false);
            onUserLogin(token);
            history.push('/admin');
        } catch (error) {
            setAuthLoading(false);
            toast.error(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message
            );
        }
    };

    const loginByGoogle = async () => {
        try {
            setGoogleAuthLoading(true);
            const token = await AuthService.loginByGoogle();
            toast.success('Login is succeeded!');
            setGoogleAuthLoading(false);
            onUserLogin(token);
            history.push('/');
        } catch (error) {
            setGoogleAuthLoading(false);
            toast.error(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    'Failed'
            );
        }
    };

    const loginByFacebook = async () => {
        try {
            setFacebookAuthLoading(true);
            const token = await AuthService.loginByFacebook();
            toast.success('Login is succeeded!');
            setFacebookAuthLoading(false);
            onUserLogin(token);
            history.push('/');
        } catch (error) {
            setFacebookAuthLoading(false);
            toast.error(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    'Failed'
            );
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Required'),
            password: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required('Required')
        }),
        onSubmit: (values) => {
            login(values.email, values.password);
        }
    });

    // document.getElementById('root').classList = 'hold-transition login-page';

    return (
        <div id="main-page">
            <div id="header-login">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 className="sitename">SỞ Y TẾ TP HỒ CHÍ MINH</h1>
                            <h2 className="sitesoft namesoft">
                                PHẦN MỀM QUẢN LÝ ĐĂNG KÝ HIẾN VÀ GHÉP MÔ TẠNG
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="col-sm-12 col-xs-12 col-md-12 col-lg-12 pd-0"
                id="form-login"
            >
                <div className="container">
                    <div className="col-sm-12">
                        <div className="row">
                            <div className="col-sm-7 hidden-xs left-form center">
                                {/* <img
                                    style={{width: '200px'}}
                                    alt="logo"
                                    src="/Img/logo.png"
                                /> */}
                                <div
                                    className="LogoBox"
                                    style={{
                                        marginBottom: '15px',
                                        textAlign: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <div className="LogoBoxItem">
                                        <img
                                            src="/img/logonew.png"
                                            className="logoHome"
                                            alt="logo"
                                        />
                                    </div>
                                    <div className="LogoBoxItem logobox2">
                                        <img
                                            src="/img/LGTN2.png"
                                            className="logoHome"
                                            alt="logo2"
                                        />
                                    </div>
                                    <div className="LogoBoxItem">
                                        <img
                                            src="/img/LGTN.png"
                                            className="logoHome"
                                            alt="logo3"
                                        />
                                    </div>
                                </div>

                                <div className="center">
                                    <h5 style={{textTransform: 'uppercase'}}>
                                        Đơn vị điều phối ghép các bộ phận cơ thể
                                        người
                                    </h5>
                                    <h5 style={{textTransform: 'uppercase'}}>
                                        Bệnh viện Chợ Rẫy
                                    </h5>
                                    <div>
                                        Địa chỉ: 201B Nguyễn Chí Thanh, Phường
                                        12, Quận 5, Hồ Chí Minh, Việt Nam
                                    </div>
                                    <div>
                                        Điện thoại: (84-028) 38554137 – 1184 hay
                                        (84-028) 39560139
                                    </div>
                                    <div>Fax: (84-028) 39560139</div>
                                    <div>
                                        Điện thoại dành cho trường hợp khẩn cấp
                                        (24/24h): 0913.677.016
                                    </div>
                                    <div>
                                        Email: dieuphoigheptangbvcr@gmail.com |
                                        donvidieuphoigheptang@choray.vn
                                    </div>
                                    <div>
                                        <a
                                            className="White"
                                            href="https://www.facebook.com/dieuphoigheptangbvcr"
                                        >
                                            Fan page:
                                            https://fb.com/dieuphoigheptangbvcr
                                        </a>
                                    </div>
                                </div>
                                {/* <div className="row">
                                        <div
                                            className="col-sm-6 fax-number"
                                            style={{
                                                'text-align': 'right',
                                                'padding-left': 0
                                            }}
                                        >
                                            <p>
                                                <span>Điện thoại:</span>{' '}
                                                <div>
                                                    <a
                                                        href="tel:02163851500"
                                                        className="contactBox"
                                                    >
                                                        02163.851.500
                                                    </a>
                                                </div>
                                            </p>
                                        </div>
                                        <div
                                            className="col-sm-6 fax-number"
                                            style={{
                                                'text-align': 'left',
                                                'padding-right': 0
                                            }}
                                        >
                                            <p>
                                                <span>Website:</span>{' '}
                                                <div>
                                                    <a
                                                        href="http://benhviensannhiyenbai.com.vn/"
                                                        className="contactBox"
                                                    >
                                                        benhviensannhiyenbai.com.vn
                                                    </a>
                                                </div>
                                            </p>
                                        </div>
                                    </div> */}
                            </div>
                            <div className="col-sm-5 col-xs-12 right-form">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h2>Đăng nhập hệ thống</h2>
                                    </div>
                                    <div className="modal-body">
                                        <section id="loginForm">
                                            <form
                                                onSubmit={formik.handleSubmit}
                                            >
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="email"
                                                        className="control-label "
                                                    >
                                                        Tên đăng nhập
                                                    </label>
                                                    <div className="input-group">
                                                        <input
                                                            className="form-control"
                                                            placeholder="Tên đăng nhập"
                                                            {...formik.getFieldProps(
                                                                'email'
                                                            )}
                                                        />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text">
                                                                <span className="fas fa-user" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {formik.touched.email &&
                                                    formik.errors.email ? (
                                                        <div>
                                                            {
                                                                formik.errors
                                                                    .email
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="password"
                                                        className="control-label "
                                                    >
                                                        Mật khẩu
                                                    </label>
                                                    <div className="input-group ">
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Mật khẩu"
                                                            {...formik.getFieldProps(
                                                                'password'
                                                            )}
                                                        />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text">
                                                                <span className="fas fa-lock" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {formik.touched.password &&
                                                    formik.errors.password ? (
                                                        <div>
                                                            {
                                                                formik.errors
                                                                    .password
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="row">
                                                    <div className="col-sm-7">
                                                        <div className="icheck-primary">
                                                            <input
                                                                type="checkbox"
                                                                id="remember"
                                                            />
                                                            <label htmlFor="remember">
                                                                Ghi nhớ
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <Button
                                                            block
                                                            type="submit"
                                                            isLoading={
                                                                isAuthLoading
                                                            }
                                                            disabled={
                                                                isFacebookAuthLoading ||
                                                                isGoogleAuthLoading
                                                            }
                                                        >
                                                            Đăng nhập
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <Col md={6}>
                                                        <Link to="/quenmatkhau">
                                                            Quên mật khẩu
                                                        </Link>
                                                    </Col>
                                                    <Col
                                                        md={6}
                                                        style={{
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {/* <Link to="/dangky">Đăng ký tài khoản</Link> */}
                                                    </Col>
                                                </div>
                                            </form>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onUserLogin: (token) => dispatch({type: ActionTypes.LOGIN_USER, token})
});

export default connect(null, mapDispatchToProps)(Login);
