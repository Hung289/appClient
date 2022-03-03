import React from 'react';
import {BrowserRouter as Router, HashRouter, Switch} from 'react-router-dom';
import Main from '@modules/main/Main';
import Login from '@modules/login/Login';
import Register from '@modules/register/Register';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import PrivacyPolicy from '@modules/privacy-policy/PrivacyPolicy';
import GioiThieuDetail from '@modules/Home/GioiThieuDetail';
import DsTinTuc from '@modules/Home/DsTinTuc';
import DsHoiDap from '@modules/Home/DsHoiDap';
import PDKGhep from '@modules/Home/PDKGhep';
import PDKGhepCoQuanKhac from '@modules/Home/PDKGhepCoQuanKhac';
import PDKHien from '@modules/Home/PDKHien';
import LienHe from '@modules/Home/LienHe';
import SoLieuThongKe from '@app/modules/Home/SoLieuThongKe';
import QuyenMatKhau from '@app/modules/Home/QuyenMatKhau';
import ChiTietTinBai from '@modules/Home/ChiTietTinBai';
import HomePage from '@app/modules/Home/HomePage';
import DsTinNhom from '@app/modules/Home/DsTinNhom';
import CreateHuyDangKy from '@app/modules/Home/CreateHuyDangKy';
import Dangky from '@modules/Home/Dangky';
import LoginUser from '@modules/Home/LoginUser';
import HSHienGhep from '@modules/Home/HSHienGhep';
import UnAuthor from '@modules/Home/UnAuthor';
import EditGhepTangHome from '@modules/Home/EditGhepTangHome';
import EditHienTangHome from '@modules/Home/EditHienTangHome';
import ChiTietDKHienTang from '@modules/Home/ChiTietDKHienTang';
import ChiTietDKChoGhepTang from '@modules/Home/ChiTietDKChoGhepTang';
import ChangePass from '@modules/Home/ChangePass';
import XacNhanTaiKhoan from '@modules/Home/XacNhanTaiKhoan';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import ClientRoute from './routes/ClientRoute';

import './App.scss';

const App = () => {
    return (
        <Router>
            <Switch>
                {/* <ClientRoute exact path="/CreateHuyDangKy/:id/:typeData">
                    <CreateHuyDangKy />
                </ClientRoute>
                <ClientRoute exact path="/Unauthor">
                    <UnAuthor />
                </ClientRoute>
                <ClientRoute exact path="/SoLieuThongKe">
                    <SoLieuThongKe />
                </ClientRoute>
                <ClientRoute exact path="/nhomtin/:maNhom">
                    <DsTinNhom />
                </ClientRoute>

                <ClientRoute exact path="/GioiThieu">
                    <GioiThieuDetail />
                </ClientRoute>
                <ClientRoute exact path="/DsTinTuc">
                    <DsTinTuc />
                </ClientRoute>
                <ClientRoute exact path="/QuenMatKhau">
                    <QuyenMatKhau />
                </ClientRoute>
                <ClientRoute exact path="/DsHoiDap">
                    <DsHoiDap />
                </ClientRoute>
                <ClientRoute exact path="/PDKGhep">
                    <PDKGhep />
                </ClientRoute>
                <ClientRoute path="/PDKGhepCoQuanKhac">
                    <PDKGhepCoQuanKhac />
                </ClientRoute>
                <ClientRoute exact path="/PDKHien">
                    <PDKHien />
                </ClientRoute>
                <ClientRoute exact path="/EditGhepTangHome/:id">
                    <EditGhepTangHome />
                </ClientRoute>
                <ClientRoute exact path="/EditHienTangHome/:id">
                    <EditHienTangHome />
                </ClientRoute>
                <ClientRoute exact path="/ChiTietTinBai/:id">
                    <ChiTietTinBai />
                </ClientRoute>
                <ClientRoute exact path="/ChiTietDKHienTang/:id">
                    <ChiTietDKHienTang />
                </ClientRoute>
                <ClientRoute exact path="/ChiTietDKChoGhepTang/:id">
                    <ChiTietDKChoGhepTang />
                </ClientRoute>
                <ClientRoute exact path="/ChangePass/:token">
                    <ChangePass />
                </ClientRoute>
                <ClientRoute exact path="/XacNhanTaiKhoan/:token">
                    <XacNhanTaiKhoan />
                </ClientRoute>
                <ClientRoute exact path="/LienHe">
                    <LienHe />
                </ClientRoute>
                <ClientRoute exact path="/HSHienGhep">
                    <HSHienGhep />
                </ClientRoute>
                <ClientRoute exact path="/">
                    <HomePage />
                </ClientRoute>
                <PublicRoute exact path="/login">
                    <Login />
                </PublicRoute>
                <ClientRoute exact path="/LoginUser">
                    <LoginUser />
                </ClientRoute>
                <ClientRoute exact path="/Dangky">
                    <Dangky />
                </ClientRoute>
                <PublicRoute exact path="/register">
                    <Register />
                </PublicRoute>
                <PublicRoute exact path="/forgot-password">
                    <ForgetPassword />
                </PublicRoute>
                <PublicRoute exact path="/recover-password">
                    <RecoverPassword />
                </PublicRoute>
                <PublicRoute exact path="/privacy-policy">
                    <PrivacyPolicy />
                </PublicRoute>
                <PublicRoute exact path="/callback">
                    <h1>Callback</h1>
                </PublicRoute> */}

                {/* <PrivateRoute path="/admin">
                    <Main />
                </PrivateRoute> */}
                <PublicRoute exact path="/login">
                    <Login />
                </PublicRoute>
                <PrivateRoute path="/">
                    <Main />
                </PrivateRoute>
            </Switch>
        </Router>
    );
};

export default App;
