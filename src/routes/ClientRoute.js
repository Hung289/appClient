import React from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import Header from '@app/modules/Home/Header';
import {Helmet} from 'react-helmet';

import FooterBox from '@app/modules/Home/FooterBox';

const ClientRoute = ({children, isLoggedIn, ...rest}) => {
    // const isAuthenticated = isLoggedIn || localStorage.getItem('token');

    return (
        <Route
            {...rest}
            render={() => (
                <>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Cổng đăng ký hiến và ghép mô tạng</title>
                        <meta
                            name="description"
                            content="ĐƠN VỊ ĐIỀU PHỐI GHÉP CÁC BỘ PHẬN CƠ THỂ NGƯỜI BỆNH VIỆN CHỢ RẪY"
                        />
                        <meta
                            name="keywords"
                            content="mo tang, dang ky hien, ghep mo tang, ghep than, ghep tim"
                        />
                    </Helmet>
                    <Header />
                    {children}
                    <FooterBox />
                    <MessengerCustomerChat
                        // pageId="503486866782616"
                        // appId="403668491128518"
                        // htmlRef="<REF_STRING>"
                        pageId="141259733037430"
                        appId="479802529808660"
                        htmlRef={window.location.pathname}
                    />
                </>
            )}
        />
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(ClientRoute);
