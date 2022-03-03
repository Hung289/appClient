/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect, useRef} from 'react';
import {
    Row,
    Col,
    Container,
    Breadcrumb,
    Tabs,
    Tab,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import * as Yup from 'yup';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from 'react-router-dom';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {toast} from 'react-toastify';
import Button from '../../components/button/Button';

const ChangePass = () => {
    const {token} = useParams();
    const formRef = useRef();
    const history = useHistory();
    // const submitCreate = () => {
    //     if (formRef.current) {
    //         formRef.current.handleSubmit();
    //     }
    // };
    const RenderDataMain = () => {
        const [entityObj, setEntityObj] = useState({});
        const [isSendMail, setisSendMail] = useState(false);
        const [initDataItem, setInitDataItem] = useState(false);
        const InitData = () => {
            if (!initDataItem) {
                fetch(
                    `${Constant.PathServer}/api/Auth/CheckTokenPassword?token=${token}`,
                    {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                            // Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        // body: JSON.stringify(obj)
                    }
                )
                    .then((response) => response.json())
                    .then((json) => {
                        setEntityObj(json);
                    });
                setInitDataItem(true);
            }
        };
        const onChangePassword = (obj) => {
            fetch(`${Constant.PathServer}/api/Auth/SaveChangePassword`, {
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
                body: JSON.stringify(obj)
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        toast.success('Mật khẩu của bạn đã được thay đổi');
                        setisSendMail(true);
                    } else {
                        toast.error(json.MessageError);
                    }
                });
        };
        InitData();
        const SignupSchema = Yup.object().shape({
            MATKHAU: Yup.string()
                .trim()
                .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
                .required('Vui lòng nhập thông tin này')
                .test(
                    'xxx',
                    'Mật khẩu phải sử dụng cả chữ cái và số',
                    (val) => {
                        let so = false;
                        let chu = false;
                        if (val !== undefined) {
                            for (let i = 0; i < val.length; i += 1) {
                                if (/^[a-zA-Z ]*$/.test(val[i])) {
                                    chu = true;
                                } else if (/^[0-9]*$/.test(val[i])) {
                                    so = true;
                                }
                            }
                            if (chu && so) {
                                return true;
                            }
                            return false;
                        }
                        return true;
                    }
                ),
            MATKHAU2: Yup.string()
                .trim()
                .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
                .required('Vui lòng nhập thông tin này')
                .test(
                    'xxx',
                    'Mật khẩu phải sử dụng cả chữ cái và số',
                    (val) => {
                        let so = false;
                        let chu = false;
                        if (val !== undefined) {
                            for (let i = 0; i < val.length; i += 1) {
                                if (/^[a-zA-Z ]*$/.test(val[i])) {
                                    chu = true;
                                } else if (/^[0-9]*$/.test(val[i])) {
                                    so = true;
                                }
                            }
                            if (chu && so) {
                                return true;
                            }
                            return false;
                        }
                        return true;
                    }
                )
                .test(
                    'xxx',
                    'Mật khẩu không trùng khớp',
                    (val, test) => val === test.parent.MATKHAU
                )
        });
        function DetailHoSo() {
            return (
                <>
                    <Row className="boxdangky">
                        <Col className="" md={12}>
                            <div className="">
                                <div className="Title-Login-Register center">
                                    THAY ĐỔI MẬT KHẨU
                                </div>
                            </div>
                            {entityObj.Status ? (
                                <>
                                    {isSendMail ? (
                                        <div className="sendMailDone">
                                            Mật khẩu của bạn đã được thay đổi
                                            thành công. Vui lòng thực hiện đăng
                                            nhập để theo dõi thông tin hồ sơ
                                            đăng ký hiến và ghép mô tạng
                                        </div>
                                    ) : (
                                        <Row>
                                            <Formik
                                                innerRef={formRef}
                                                initialValues={{
                                                    TOKEN: token,
                                                    MATKHAU: '',
                                                    MATKHAU2: ''
                                                }}
                                                validationSchema={SignupSchema}
                                                onSubmit={(values) => {
                                                    const ObjSave = {
                                                        ...values
                                                    };
                                                    if (
                                                        values.MATKHAU ===
                                                        values.MATKHAU2
                                                    ) {
                                                        onChangePassword(
                                                            ObjSave
                                                        );
                                                    } else {
                                                        toast.error(
                                                            'Vui lòng kiểm tra lại mật khẩu'
                                                        );
                                                    }
                                                    // same shape as initial values
                                                }}
                                            >
                                                {({
                                                    errors,
                                                    touched,
                                                    setFieldValue
                                                }) => (
                                                    <Form className="col-md-12">
                                                        <Field
                                                            type="hidden"
                                                            name="TOKEN"
                                                        />
                                                        <div className="form-row">
                                                            <div className="form-group col-sm-12">
                                                                <label htmlFor="MATKHAU">
                                                                    Mật khẩu
                                                                    <span className="red">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <Field
                                                                    // type={
                                                                    //     showHidePassword
                                                                    //         ? 'text'
                                                                    //         : 'password'
                                                                    // }
                                                                    type="password"
                                                                    name="MATKHAU"
                                                                    key="MATKHAU"
                                                                    className="form-control"
                                                                />

                                                                {errors.MATKHAU &&
                                                                touched.MATKHAU ? (
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.MATKHAU
                                                                        }
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-sm-12">
                                                                <label htmlFor="MATKHAU2">
                                                                    Nhập lại mật
                                                                    khẩu
                                                                    <span className="red">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <Field
                                                                    // type={
                                                                    //     showHidePassword
                                                                    //         ? 'text'
                                                                    //         : 'password'
                                                                    // }
                                                                    type="password"
                                                                    name="MATKHAU2"
                                                                    key="MATKHAU2"
                                                                    className="form-control"
                                                                />

                                                                {errors.MATKHAU2 &&
                                                                touched.MATKHAU2 ? (
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.MATKHAU2
                                                                        }
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="form-row center mgt15">
                                                            <div className="col-sm-12">
                                                                <Button
                                                                    className="btn-lg"
                                                                    variant="primary"
                                                                    type="submit"
                                                                    // onClick={
                                                                    //     submitCreate
                                                                    // }
                                                                >
                                                                    Hoàn thành
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </Row>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="ErroMess">
                                        {entityObj.MessageError}
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </>
            );
        }
        return (
            <div className="row">
                <div className="col-sm-12">
                    <DetailHoSo />
                </div>
            </div>
        );
    };

    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Đổi mật khẩu
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default ChangePass;
