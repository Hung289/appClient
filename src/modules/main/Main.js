import React, {useState, useEffect} from 'react';
import {Route, Switch, Redirect, useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import * as AuthenServerService from '@app/services/AuthenServerService';
import OperationAdm from '@app/modules/Admin/OperationAdm/OperationAdm';
import Dashboard from '@pages/Dashboard';
import ProfileAdm from '@app/modules/Admin/ProfileAdm/ProfileAdm';
import TinTucAdm from '@app/modules/Admin/TinTucAdm/TinTucAdm';
import HoiDapAdm from '@app/modules/Admin/HoiDapAdm/HoiDapAdm';
import BannerAdm from '@app/modules/Admin/BannerAdm/BannerAdm';
import CategoryNewsAdm from '@app/modules/Admin/CategoryNewsAdm/CategoryNewsAdm';
import DangKyHienTangChoTiepNhanAdm from '@app/modules/Admin/DangKyHienTangAdm/DangKyHienTangChoTiepNhanAdm';
import DangKyChoGhepTangChoTiepNhanAdm from '@app/modules/Admin/DangKyChoGhepTangAdm/DangKyChoGhepTangChoTiepNhanAdm';
import DangKyChoGhepTangDetailAdm from '@app/modules/Admin/DangKyChoGhepTangAdm/DangKyChoGhepTangDetailAdm';

import CreateTinTucAdm from '@app/modules/Admin/TinTucAdm/CreateTinTucAdm';
import AccountAdm from '@app/modules/Admin/AccountAdm/AccountAdm';
import EditTinTucAdm from '@app/modules/Admin/TinTucAdm/EditTinTucAdm';
import DMDuLieuDanhMucAdm from '@app/modules/Admin/DMDuLieuDanhMucAdm/DMDuLieuDanhMucAdm';
import DMNhomDanhMucAdmin from '@app/modules/Admin/DMNhomDanhMucAdmin/DMNhomDanhMucAdmin';
import Post from '@app/pages/profile/Post';
import RoleAdm from '@app/modules/Admin/RoleAdm/RoleAdm';
import ModuleAdm from '@app/modules/Admin/ModuleAdm/ModuleAdm';
import TinhNangMoRongAdm from '@app/modules/Admin/TinhNangMoRongAdm/TinhNangMoRongAdm';
import TINHAdm from '@app/modules/Admin/TINHAdmin/TINHAdmin';
import HUYENAdm from '@app/modules/Admin/HUYENAdm/HUYENAdm';
import XAAdm from '@app/modules/Admin/XAAdm/XAAdm';
import ToPhuTrachAdm from '@app/modules/Admin/ToPhuTrachAdmin/ToPhuTrachAdmin';
import CommonConfigAdm from '@app/modules/Admin/CommonConfigAdm/CommonConfigAdm';
import HuyDangKyAdm from '@app/modules/Admin/HuyDangKy/HuyDangKyAdm';

import Header from './header/Header';
import Footer from './footer/Footer';
import MenuSidebar from './menu-sidebar/MenuSidebar';
import PageLoading from '../../components/page-loading/PageLoading';
import * as ActionTypes from '../../store/actions';
import DKHienExcel from '../Admin/DangKyHienTangAdm/DKHienExcel';
import DKGhepExcel from '../Admin/DangKyChoGhepTangAdm/DKGhepExcel';
import 'antd/dist/antd.css';

const Main = ({onUserLoad, onUserLogout, history}) => {
    const [appLoadingState, updateAppLoading] = useState(false);
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });
    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
    };

    useEffect(() => {
        updateAppLoading(true);
        const fetchProfile = async () => {
            try {
                // const response = await Gatekeeper.getProfile();
                const response = await AuthenServerService.GetProfile();
                onUserLoad({...response});
                // if (
                //     response == null ||
                //     response.Status === false ||
                //     response.Data.Status === false
                // ) {
                //     onUserLogout();
                // }

                updateAppLoading(false);
            } catch (error) {
                updateAppLoading(false);
            }
        };
        fetchProfile();

        return () => {};
    }, [onUserLoad]);

    document.getElementById('root').classList.remove('register-page');
    document.getElementById('root').classList.remove('login-page');
    document.getElementById('root').classList.remove('hold-transition');

    document.getElementById('root').className += ' sidebar-mini';

    if (menusidebarState.isMenuSidebarCollapsed) {
        document.getElementById('root').classList.add('sidebar-collapse');
        document.getElementById('root').classList.remove('sidebar-open');
    } else {
        document.getElementById('root').classList.add('sidebar-open');
        document.getElementById('root').classList.remove('sidebar-collapse');
    }

    let template;

    const AdminSiteName = '/admin';
    // const AdminSiteName = '';

    if (appLoadingState) {
        template = <PageLoading />;
    } else {
        template = (
            <>
                <Header toggleMenuSidebar={toggleMenuSidebar} />

                <MenuSidebar />

                <div className="content-wrapper">
                    <div className="pt-3" />
                    <section className="content">
                        <Switch>
                            {/* <Route exact path="/" component={Dashboard} /> */}
                            <Route
                                exact
                                path={`${AdminSiteName}/DuLieuDanhMuc/:idNhom`}
                                component={DMDuLieuDanhMucAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Operation/:moduleId`}
                                component={OperationAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/CapNhatTinBai/:id`}
                                component={EditTinTucAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/DMNhom`}
                                component={DMNhomDanhMucAdmin}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/HuyDangKy`}
                                component={HuyDangKyAdm}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/TaoMoiTinBai`}
                                component={CreateTinTucAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/post`}
                                component={Post}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/profile`}
                                component={ProfileAdm}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/tinTuc`}
                                component={TinTucAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/hoidap`}
                                component={HoiDapAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/banner`}
                                component={BannerAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/category`}
                                component={CategoryNewsAdm}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/dangkyhientangchotiepnhan`}
                                component={DangKyHienTangChoTiepNhanAdm}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/dangkyhientang/importexcel`}
                                component={DKHienExcel}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/dangkychogheptangchotiepnhan`}
                                component={DangKyChoGhepTangChoTiepNhanAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/hosogheptang/:typeStatus/:coquan`}
                                component={DangKyChoGhepTangChoTiepNhanAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/hosogheptangchitiet/:id`}
                                component={DangKyChoGhepTangDetailAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/dangkychogheptang/importexcel`}
                                component={DKGhepExcel}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Tinh`}
                                component={TINHAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/ToPhuTrach`}
                                component={ToPhuTrachAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Huyen/:MaTinh`}
                                component={HUYENAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Xa/:MaHuyen`}
                                component={XAAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/account`}
                                component={AccountAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Role`}
                                component={RoleAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/Module`}
                                component={ModuleAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/tinhnangmorong`}
                                component={TinhNangMoRongAdm}
                            />
                            <Route
                                exact
                                path={`${AdminSiteName}/cauhinhchung`}
                                component={CommonConfigAdm}
                            />
                            <Route
                                exact
                                path={AdminSiteName}
                                component={Dashboard}
                            />

                            <Route
                                exact
                                path={`${AdminSiteName}/hosohientang/:typeStatus`}
                                component={DangKyHienTangChoTiepNhanAdm}
                            />
                        </Switch>
                    </section>
                </div>
                <Footer />
                <div
                    id="sidebar-overlay"
                    role="presentation"
                    onClick={toggleMenuSidebar}
                    onKeyDown={() => {}}
                />
            </>
        );
    }

    return <div className="wrapper">{template}</div>;
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onUserLoad: (user) =>
        dispatch({type: ActionTypes.LOAD_USER, currentUser: user}),
    onUserLogout: () => dispatch({type: ActionTypes.LOGOUT_USER})
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
