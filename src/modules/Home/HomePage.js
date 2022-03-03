import React, {Component} from 'react';
import BannerTop from '@modules/Home/BannerTop';
import CoQuanVaGioiThieu from '@modules/Home/CoQuanVaGioiThieu';
import ThongKeNhanh from '@modules/Home/ThongKeNhanh';
import ThongTinYKhoa from '@modules/Home/ThongTinYKhoa';
import DangKyHienTang from '@modules/Home/DangKyHienTang';
import ThongTinTruyenThong from '@app/modules/Home/ThongTinTruyenThong';
import CauHoiThuongGap from '@app/modules/Home/CauHoiThuongGap';
import {Helmet} from 'react-helmet';
// eslint-disable-next-line react/prefer-stateless-function

class HomePage extends Component {
    render() {
        return (
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta
                        name="title"
                        content="Cổng đăng ký hiến và ghép mô tạng - home"
                        data-react-helmet="true"
                    />
                    <meta
                        name="description"
                        content="ĐƠN VỊ ĐIỀU PHỐI GHÉP CÁC BỘ PHẬN CƠ THỂ NGƯỜI BỆNH VIỆN CHỢ RẪY"
                    />
                    <meta
                        name="keywords"
                        content="mo tang, dang ky hien, ghep mo tang, ghep than, ghep tim"
                    />
                </Helmet>
                <BannerTop />
                <CoQuanVaGioiThieu />
                <ThongKeNhanh />
                <ThongTinYKhoa />
                <DangKyHienTang />
                <ThongTinTruyenThong />
                <CauHoiThuongGap />
            </>
        );
    }
}

export default HomePage;
