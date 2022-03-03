import React, {Component} from 'react';
import {Container} from 'react-bootstrap';
import {Link, NavLink} from 'react-router-dom';
import BoxDangKyDangNhap from './BoxDangKyDangNhap';

class FooterBox extends Component {
    render() {
        return (
            <>
                <div id="boxFooter">
                    <Container>
                        <p>
                            Cổng đăng ký hiến và ghép tạng - Cơ quan quản lý:
                            Bệnh viện Chợ Rẫy
                        </p>
                        <p style={{textTransform: 'uppercase'}}>
                            Đơn vị điều phối ghép các bộ phận cơ thể người Bệnh
                            viện Chợ Rẫy
                        </p>
                        {/* <br /> */}
                        <p>
                            Địa chỉ: 201B Nguyễn Chí Thanh, Phường 12, Quận 5,
                            Hồ Chí Minh, Việt Nam
                        </p>
                        <p>
                            Điện thoại trong giờ hành chính: (84-028) 38554137 –
                            1184 hay (84-028) 39560139 | Fax: (84-028) 39560139
                        </p>
                        <p>
                            Điện thoại dành cho trường hợp khẩn cấp (24/24h):
                            0913.677.016
                        </p>
                        <p>
                            Email: dieuphoigheptangbvcr@gmail.com |{' '}
                            donvidieuphoigheptang@choray.vn
                        </p>
                        <p>
                            Fan page:{' '}
                            <a
                                className="White"
                                href="https://www.facebook.com/dieuphoigheptangbvcr"
                            >
                                https://fb.com/dieuphoigheptangbvcr
                            </a>
                        </p>
                        <BoxDangKyDangNhap />
                    </Container>
                </div>
            </>
        );
    }
}

export default FooterBox;
