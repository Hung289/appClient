import React, {useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {connect} from 'react-redux';

import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {useTranslation} from 'react-i18next';

import * as Yup from 'yup';

import {Col, Row} from 'react-bootstrap';
import * as TypeUserConstant from '@modules/Common/TypeUserConstant';
import * as AuthService from '../../services/auth';
import Button from '../../components/button/Button';

import * as ActionTypes from '../../store/actions';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LoginUser = ({onUserLogin}) => {
    const query = useQuery();
    const backUrl = query.get('backurl');
    const [isAuthLoading, setAuthLoading] = useState(false);

    const history = useHistory();
    const [t] = useTranslation();

    const loginUser = async (email, password) => {
        try {
            setAuthLoading(true);
            const token = await AuthService.loginByAuth(email, password);
            toast.success('Đăng nhập thành công!');
            setAuthLoading(false);
            onUserLogin(token);
            if (backUrl != null) {
                history.push(`/${backUrl}`);
            } else if (token.TypeUser === TypeUserConstant.NguoiDangKy) {
                history.push('/HsHienGhep');
            } else if (token.TypeUser === TypeUserConstant.CanBoQuanLy) {
                history.push('/Admin');
            }
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

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Vui lòng nhập tài khoản'),
            password: Yup.string()
                .min(5, 'Vui lòng nhập nhiều hơn 5 ký tự')
                .max(30, 'Vui lòng nhập ít hơn 30 ký tự')
                .required('Vui lòng nhập mật khẩu')
        }),
        onSubmit: (values) => {
            loginUser(values.email, values.password);
        }
    });

    // document.getElementById('root').classList = 'hold-transition login-page';

    return (
        <Row className="boxlogin ">
            <Col className=" " md={12}>
                <div>
                    <div className="Title-Login-Register center">Đăng Nhập</div>
                    {/* <div className="login-box-msg">
                        Vui lòng nhập thông tin để đăng nhập
                    </div> */}
                </div>
                <Row className=" mgt15">
                    <form onSubmit={formik.handleSubmit} className="col-md-12">
                        <div className="mb-3">
                            <label htmlFor="email"> Tên đăng nhập</label>
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    {...formik.getFieldProps('email')}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="red">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password"> Mật khẩu</label>
                            <div className="input-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    {...formik.getFieldProps('password')}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            {formik.touched.password &&
                            formik.errors.password ? (
                                <div className="red">
                                    {formik.errors.password}
                                </div>
                            ) : null}
                        </div>
                        <div className="font-size15 right">
                            <Link to="/QuenMatKhau">Quên mật khẩu?</Link>
                        </div>
                        <div className="mb-3 center mgt15">
                            {/* <div className="col-7">
                                <div className="icheck-primary">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">Ghi nhớ</label>
                                </div>
                            </div> */}

                            <Button
                                block
                                className="btn-lg font-size22"
                                type="submit"
                                isLoading={isAuthLoading}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </form>
                    <div className="col-sm-12 mgt15">
                        <Row>
                            {/* <Col md={6} style={{textAlign: 'right'}}>
                                <Link to="/forgot-password">Quên mật khẩu</Link>
                            </Col> */}
                            <Col md={12} className="font-size15 center">
                                <Link to="/dangky">Đăng ký tài khoản</Link>
                            </Col>
                        </Row>
                    </div>
                    {/* <form className="col-md-12" onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    placeholder="Tên đăng nhập"
                                    {...formik.getFieldProps('email')}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div>{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <div className="input-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Mật khẩu"
                                    {...formik.getFieldProps('password')}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            {formik.touched.password &&
                            formik.errors.password ? (
                                <div>{formik.errors.password}</div>
                            ) : null}
                        </div>
                    </form>
                    <div className="row col-sm-12 mgt15">

                        <div className="col-sm-12 center ">
                            <Button
                                block
                                type="submit"
                                isLoading={isAuthLoading}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </div> */}
                </Row>
            </Col>
        </Row>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onUserLogin: (tokenData, isClient) =>
        dispatch({
            type: ActionTypes.LOGIN_USER,
            token: tokenData,
            isClientAcc: isClient
        })
});

export default connect(null, mapDispatchToProps)(LoginUser);
