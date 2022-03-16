/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {connect} from 'react-redux';
import {NavLink, Link, HashRouter} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import $ from 'jquery';

const MenuSidebar = ({user}) => {
    function disableLink(e) {
        e.preventDefault();
        const eparent = $(e.target).parents('li').first();
        if (eparent.length > 0) {
            if (!eparent.hasClass('menu-open')) {
                eparent.addClass('menu-open');
            } else {
                eparent.removeClass('menu-open');
            }
        }
    }
    const {t} = useTranslation();
    const isAdmin = user.userName === 'admin';

    const RenderMenuLeft = () => {
        let rturnmdm = <></>;
        if (user != null && user.listActionMenu != null) {
            rturnmdm = user.listActionMenu.map((modul) => {
                if (modul.ListOperation.length > 1) {
                    return (
                        <li className="nav-item has-treeview" key={modul.Id}>
                            <a
                                onClick={disableLink}
                                className="nav-link MenuPageQL "
                                // eslint-disable-next-line no-script-url
                                href="/"
                            >
                                {modul.ClassCss ? (
                                    <i
                                        className={`nav-icon ${modul.ClassCss}`}
                                    />
                                ) : (
                                    <i className="nav-icon far fa-circle" />
                                )}

                                <p>
                                    {modul.Name}

                                    <i className="right fas fa-angle-left " />
                                </p>
                            </a>
                            <ul className="nav nav-treeview2">
                                {modul.ListOperation.map((op) => {
                                    return (
                                        <li className="nav-item" key={op.Id}>
                                            <NavLink
                                                to={op.URL}
                                                className="nav-link MenuPageQL "
                                                exact
                                            >
                                                <i className="far fa-circle nav-icon" />
                                                <p>{op.Name}</p>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                }
                return modul.ListOperation.map((op) => {
                    return (
                        <li className="nav-item" key={op.Id}>
                            <NavLink
                                to={op.URL}
                                className="nav-link MenuPageQL "
                                exact
                            >
                                {modul.ClassCss ? (
                                    <i
                                        className={`nav-icon ${modul.ClassCss}`}
                                    />
                                ) : (
                                    <i className="nav-icon far fa-circle" />
                                )}
                                <p>{op.Name}</p>
                            </NavLink>
                        </li>
                    );
                });
            });
        }
        return rturnmdm;
    };

    return (
        <aside className="main-sidebar sidebar-white ">
            <Link
                to="/admin"
                className="brand-link text-center linkAdmin backgroundBlue"
            >
                {/* <img
                    src="/dist/img/AdminLTELogo.png"
                    alt="AdminLTE Logo"
                    className="brand-image img-circle"
                /> */}
                <span className="brand-image ">
                    <i
                        className="fa fa-heartbeat"
                        style={{fontSize: '30px'}}
                        aria-hidden="true"
                    />
                </span>

                <span className="brand-text font-weight-bold">
                    PHÂN HỆ QUẢN LÝ
                </span>
            </Link>
            {/* <span className="brand-text font-weight-light">
                    <b>Quản trị hệ thống</b>
                </span>
            */}
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img
                            src={user.picture || '/img/default-profile.png'}
                            className="img-circle "
                            alt="User"
                        />
                    </div>
                    <div className="info">
                        <Link to="/admin/profile" className="d-block colorBlue">
                            {user.userName}
                        </Link>
                    </div>
                </div>
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu"
                        data-accordion="false"
                    >
                        <li className="nav-item">
                            <NavLink
                                to="/admin"
                                exact
                                className="nav-link MenuPageQL"
                            >
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>{t('menusidebar.label.dashboard')}</p>
                            </NavLink>
                        </li>
                        <RenderMenuLeft />
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});

export default connect(mapStateToProps, null)(MenuSidebar);
