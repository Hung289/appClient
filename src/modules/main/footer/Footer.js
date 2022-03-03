import React from 'react';
import {useTranslation} from 'react-i18next';
import {version} from '../../../../package.json';

const Footer = () => {
    const {t} = useTranslation();

    return (
        <footer className="main-footer">
            <div className="float-right d-none d-sm-block">
                {/* <b>{t('footer.version')}</b>
                <b> </b>
                <span>{version}</span> */}
                <a
                    href="http://hinet.com.vn/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Hinet JSC
                </a>
            </div>
            <strong>
                <span>Copyright © 2021 </span>
                <b style={{color: '#0781c7'}}>
                    HỆ THỐNG ĐĂNG KÝ HIẾN VÀ GHÉP MÔ TẠNG
                </b>{' '}
                <span>.</span>
            </strong>
            <span> </span>
            {/* <span>{t('footer.copyright')}</span> */}
        </footer>
    );
};

export default Footer;
