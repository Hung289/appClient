import React, {Component, useState} from 'react';
import * as Constant from '@app/Constant';
import {Link, NavLink} from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Modal
} from 'react-bootstrap';

import {toast} from 'react-toastify';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import * as Yup from 'yup';
import Button from '../../components/button/Button';

const QuyenMatKhau = () => {
    const [isSendMail, setisSendMail] = useState(false);
    const [isAuthLoading, setAuthLoading] = useState(false);

    const SendMail = (username) => {
        fetch(`${Constant.PathServer}/api/Auth/SendMailForgotPass`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                userName: username
            })
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    toast.success(
                        'Hệ thống đã gửi email đến tài khoản bạn đã đăng ký'
                    );
                    setisSendMail(true);
                } else {
                    toast.error(json.MessageError);
                }
            });
    };
    const formik = useFormik({
        initialValues: {
            userName: ''
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Vui lòng nhập tài khoản')
        }),
        onSubmit: (values) => {
            setAuthLoading(true);
            SendMail(values.userName);
        }
    });
    return (
        <>
            <Row className="boxlogin ">
                <Col className=" " md={12}>
                    <div>
                        <div className="Title-Login-Register center">
                            Quên mật khẩu
                        </div>
                        <div className="login-box-msg">
                            Hệ thống sẽ gửi mã bí mật về email bạn đã đăng ký.
                        </div>
                    </div>
                    {isSendMail ? (
                        <div className="sendMailDone">
                            Hệ thống đã gửi thông tin khôi phục mật khẩu vào
                            email bạn đã đăng ký vui lòng kiểm tra email và làm
                            theo hướng dẫn.
                        </div>
                    ) : (
                        <Row className=" mgt15">
                            <form
                                onSubmit={formik.handleSubmit}
                                className="col-md-12"
                            >
                                <div className="mb-3">
                                    <label htmlFor> Tên đăng nhập</label>
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            {...formik.getFieldProps(
                                                'userName'
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
                                        <div className="red">
                                            {formik.errors.email}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="mb-3 center mgt15">
                                    <Button
                                        block
                                        className="btn-lg font-size18"
                                        type="submit"
                                        isLoading={isAuthLoading}
                                    >
                                        Lấy lại mật khẩu
                                    </Button>
                                </div>
                            </form>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default QuyenMatKhau;
