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

const XacNhanTaiKhoan = () => {
    const {token} = useParams();
    const formRef = useRef();
    const history = useHistory();
    // const submitCreate = () => {
    //     if (formRef.current) {
    //         formRef.current.handleSubmit();
    //     }
    // };

    // useEffect(() => {
    //     InitData();
    //     return () => {};
    // }, [token]);
    const RenderDataMain = () => {
        const [entityObj, setEntityObj] = useState({});
        const [isSendMail, setisSendMail] = useState(false);
        const [initDataItem, setInitDataItem] = useState(false);
        const InitData = () => {
            if (!initDataItem) {
                fetch(
                    `${Constant.PathServer}/api/Auth/XacNhanTaiKhoan?token=${token}`,
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
        InitData();
        function DetailHoSo() {
            return (
                <>
                    <Row className="boxdangky">
                        <Col className="" md={12}>
                            <div className="">
                                <div className="Title-Login-Register center">
                                    XÁC NHẬN TÀI KHOẢN
                                </div>
                            </div>
                            {entityObj.Status ? (
                                <>
                                    <RegisterDoneRender />
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

    const RegisterDoneRender = () => {
        return (
            <div className="RegisterDoneRender">
                <h3 className="center">
                    Chúc mừng bạn đã hoàn tất đăng ký tài khoản
                </h3>
                <h4 className="center">Xác nhận tài khoản thành công</h4>
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
                            Xác nhận tài khoản
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default XacNhanTaiKhoan;
