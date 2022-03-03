import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import React, {useEffect, useRef, Component, useState} from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import {Link, useHistory, NavLink} from 'react-router-dom';
import * as AuthenServerService from '@app/services/AuthenServerService';
import * as TypeUserConstant from '@modules/Common/TypeUserConstant';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';

import * as ActionTypes from '../../store/actions';

const menuTop = [
    {
        name: 'Trang chủ',
        to: '/',
        exact: 'true',
        eventKey: '1'
    },
    {
        name: 'Giới thiệu',
        to: '/GioiThieu',
        exact: 'true',
        eventKey: '2'
    },
    {
        name: 'Tin tức',
        to: '/DsTinTuc',
        exact: 'true',
        eventKey: '3'
    },
    {
        name: 'Số liệu thống kê',
        to: '/SoLieuThongKe',
        exact: 'true',
        eventKey: '4'
    },
    {
        name: 'Hỏi đáp',
        to: '/DsHoiDap',
        exact: 'true',
        eventKey: '5'
    },
    {
        name: 'Liên hệ',
        to: '/LienHe',
        exact: 'true',
        eventKey: '6'
    }
    // {
    //     name: 'Đăng nhập',
    //     to: '/LoginUser',
    //     exact: 'true',
    //     eventKey: '7'
    // }
];

const Header = (props) => {
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
            <>
                {/* <div className="White"> */}
                <Nav.Item key={8}>
                    <Nav.Link
                        key={8}
                        as={Link}
                        className="menuItem nav-link"
                        to="/LoginUser"
                        exact
                        activeClassName="activeLink"
                        eventKey="8"
                    >
                        Đăng nhập
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item key={9}>
                    <Nav.Link
                        key={9}
                        as={Link}
                        className="menuItem nav-link"
                        to="/dangky"
                        exact
                        activeClassName="activeLink"
                        eventKey="9"
                    >
                        Đăng ký
                    </Nav.Link>
                </Nav.Item>

                {/* //{' '}
                <Link to="/LoginUser" className="White">
                    // Đăng nhập //{' '}
                </Link>{' '}
                // | //{' '}
                <Link to="/dangky" className="White">
                    // Đăng ký //{' '}
                </Link>
                //{' '} */}
                {/* </div> */}
            </>
        );
    };

    const ShowLogedAdmin = () => {
        return (
            <>
                <Nav.Item key={10}>
                    <Nav.Link
                        key={10}
                        as={Link}
                        className="menuItem nav-link"
                        to="/Admin"
                        exact
                        activeClassName="activeLink"
                        eventKey="10"
                    >
                        Trang quản lý
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item key={11}>
                    <Nav.Link
                        key={11}
                        as={Link}
                        className="menuItem nav-link"
                        exact
                        activeClassName="activeLink"
                        eventKey="11"
                        onClick={LogOutAction}
                    >
                        Đăng xuất
                    </Nav.Link>
                </Nav.Item>
                {/* <Link to="/Admin" className="White">
                    Trang quản lý
                </Link>{' '}
                |{' '}
                <button
                    type="button"
                    className="BtnWhite"
                    onClick={LogOutAction}
                >
                    Đăng xuất
                </button> */}
            </>
        );
    };

    const ShowLogedClient = () => {
        return (
            <>
                <Nav.Item key={12}>
                    <Nav.Link
                        key={12}
                        as={Link}
                        className="menuItem nav-link"
                        to="/hshienghep"
                        exact
                        activeClassName="activeLink"
                        eventKey="12"
                    >
                        Trang quản lý
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item key={11}>
                    <Nav.Link
                        key={11}
                        as={Link}
                        className="menuItem nav-link"
                        exact
                        activeClassName="activeLink"
                        eventKey="11"
                        onClick={LogOutAction}
                    >
                        Đăng xuất
                    </Nav.Link>
                </Nav.Item>
                {/* <Link to="/hshienghep" className="White">
                    Quản lý hồ sơ
                </Link>{' '}
                |{' '}
                <button
                    type="button"
                    className="BtnWhite"
                    onClick={LogOutAction}
                >
                    Đăng xuất
                </button> */}
            </>
        );
    };
    const showMenu = (menus) => {
        let reslt = null;
        if (menus.length > 0) {
            reslt = menus.map((item, key) => {
                return (
                    <Nav.Item key={key}>
                        <Nav.Link
                            key={key}
                            as={Link}
                            className="menuItem nav-link"
                            to={item.to}
                            exact={item.exact}
                            activeclassname="activeLink"
                            eventKey={item.eventKey}
                        >
                            {item.name}
                        </Nav.Link>
                    </Nav.Item>
                );
            });
        }
        return reslt;
    };
    const LogInLogOut = () => {
        if (isLoggedIn) {
            if (
                user !== null &&
                user.typeUser === TypeUserConstant.NguoiDangKy
            ) {
                return <ShowLogedClient />;
                // eslint-disable-next-line no-else-return
            } else if (
                user !== null &&
                user.typeUser === TypeUserConstant.CanBoQuanLy
            ) {
                return <ShowLogedAdmin />;
            }
            return (
                <Nav.Item key={11}>
                    <Nav.Link
                        key={11}
                        as={Link}
                        className="menuItem nav-link"
                        exact
                        activeClassName="activeLink"
                        eventKey="11"
                        onClick={LogOutAction}
                    >
                        Đăng xuất
                    </Nav.Link>
                </Nav.Item>
            );
        }
        return <ShowBtnLogin />;
    };

    return (
        <div className="border-bt-header">
            <Container>
                <Navbar bg="light" expand="md" collapseOnSelect>
                    <Link to="/" id="header-navbar">
                        <Navbar.Brand>
                            <div className="LogoBox">
                                <div className="LogoBoxItem">
                                    <img
                                        src="/img/logo2.png"
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
                                <div className="NameBoxItem">
                                    <h2>Cổng đăng ký</h2>
                                    <h1>Hiến và ghép mô tạng</h1>
                                </div>
                                <div className="menu-bar-top menu-mobie">
                                    <Navbar.Toggle aria-controls="basic-navbar-nav-top" />
                                </div>
                            </div>
                        </Navbar.Brand>
                    </Link>
                    <div className="menu-bar-top menu-desktop">
                        <Navbar.Toggle aria-controls="basic-navbar-nav-top" />
                    </div>
                    <Navbar.Collapse
                        id="basic-navbar-nav-top"
                        className="hidden-sm hidden-md hidden-lg"
                    >
                        <Nav>
                            {showMenu(menuTop)}
                            <LogInLogOut />
                        </Nav>
                    </Navbar.Collapse>
                    <div className="boxTopRight">
                        <fieldset>
                            <legend>Dành cho:</legend>
                            <ul className="boxtop-ul">
                                <li className="boxtop-li">
                                    <Link to="/PDKHien">
                                        Người đăng ký hiến mô tạng
                                    </Link>
                                </li>
                                <li className="boxtop-li">
                                    <Link to="/PDKGhep">
                                        Người bệnh chờ ghép thận
                                    </Link>
                                </li>
                                <li className="boxtop-li">
                                    <Link to="/PDKGhepCoQuanKhac">
                                        Người bệnh chờ ghép các cơ quan khác
                                    </Link>
                                </li>
                            </ul>
                        </fieldset>
                    </div>
                </Navbar>
            </Container>
            <div className="menu-bar-bottom">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
                <div className="container">
                    <Nav className="">
                        {showMenu(menuTop)}

                        <LogInLogOut />
                    </Nav>
                </div>
            </Navbar.Collapse>
        </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Header);
