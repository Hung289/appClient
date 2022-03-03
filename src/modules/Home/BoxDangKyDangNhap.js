import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';

import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    Button,
    Card,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Modal
} from 'react-bootstrap';
import * as TypeUserConstant from '@modules/Common/TypeUserConstant';
import {Field, Form, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import * as AuthenServerService from '@app/services/AuthenServerService';
import {NotFoundImage} from '@modules/Common/NotFound';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import * as ActionTypes from '../../store/actions';

const BoxDangKyDangNhap = (props) => {
    const history = useHistory();
    const {isLoggedIn, user, onUserLogout, onUserLoad} = props;

    useEffect(() => {
        AuthenServerService.GetProfile().then((response) => {
            if (response.Status) onUserLoad({...response});
        });

        // return () => {
        //     cleanup
        // }
    }, []);
    const LogOutAction = (id) => {
        confirmAlert({
            title: 'Đăng xuất khỏi hệ thống?',
            message: 'Bạn chắc chắn muốn đăng xuất khỏi tài khoản này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onUserLogout(id);
                        history.push('/');
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const ShowBtnLogin = () => {
        return (
            <div className="White">
                <Link to="/LoginUser" className="White">
                    Đăng nhập
                </Link>{' '}
                |{' '}
                <Link to="/dangky" className="White">
                    Đăng ký
                </Link>
            </div>
        );
    };

    const ShowLogedAdmin = () => {
        return (
            <div className="White">
                <Link to="/Admin" className="White">
                    Trang quản lý
                </Link>{' '}
                |{' '}
                <button
                    type="button"
                    className="BtnWhite"
                    onClick={LogOutAction}
                >
                    Đăng xuất
                </button>
            </div>
        );
    };

    const ShowLogedClient = () => {
        return (
            <div className="White">
                <Link to="/HsHienGhep" className="White">
                    Quản lý hồ sơ
                </Link>{' '}
                |{' '}
                <button
                    type="button"
                    className="BtnWhite"
                    onClick={LogOutAction}
                >
                    Đăng xuất
                </button>
            </div>
        );
    };

    // Render html dom
    if (isLoggedIn && user) {
        if (user !== null && user.typeUser === TypeUserConstant.NguoiDangKy) {
            return <ShowLogedClient />;
            // eslint-disable-next-line no-else-return
        } else if (
            user !== null &&
            user.typeUser === TypeUserConstant.CanBoQuanLy
        ) {
            return <ShowLogedAdmin />;
        }
        // return (
        //     <div className="White">
        //         <button
        //             type="button"
        //             className="BtnWhite"
        //             onClick={LogOutAction}
        //         >
        //             Đăng xuất
        //         </button>
        //     </div>
        // );
    }
    return <ShowBtnLogin />;
};
const mapDispatchToProps = (dispatch) => ({
    onUserLogout: () => dispatch({type: ActionTypes.LOGOUT_USER}),
    onUserLoad: (user) =>
        dispatch({type: ActionTypes.LOAD_USER, currentUser: user})
});
const mapStateToProps = (state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.currentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxDangKyDangNhap);
