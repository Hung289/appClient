import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Icon from '../../images/svg';

export default class CoQuanVaGioiThieu extends Component {
    render() {
        return (
            <Container id="boxGioiThieu">
                <Row>
                    <Col md={6}>
                        <div className="grid-container" id="boxGioiThieuGrid">
                            <Link to="/nhomtin/tim">
                                <div className="grid-item">
                                    <img src="/images/bophan_03.gif" alt="" />
                                    <p className="lbl">Tim</p>
                                </div>
                            </Link>
                            <Link to="/nhomtin/phoi">
                                <div className="grid-item">
                                    <img
                                        src="/images/bophan_06-09.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Phổi</p>
                                </div>
                            </Link>
                            <Link to="/nhomtin/than">
                                <div className="grid-item">
                                    <img
                                        src="/images/bophan_05-11.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Thận</p>
                                </div>
                            </Link>
                            <Link to="/nhomtin/gan">
                                <div className="grid-item">
                                    <img
                                        src="/images/bophan_24-24.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Gan</p>
                                </div>
                            </Link>
                            <Link to="/nhomtin/mat">
                                <div className="grid-item">
                                    {/* <img src="/images/mat.png" alt="" /> */}
                                    <img src="/images/bophan_24.gif" alt="" />
                                    <p className="lbl">Mắt</p>
                                </div>
                            </Link>
                            <Link to="/nhomtin/bophankhac">
                                <div className="grid-item">
                                    {/* <img src="/images/coquankhac.png" alt="" /> */}
                                    <img
                                        src="/images/bophan_30-32.gif"
                                        alt=""
                                    />
                                    <p className="lbl">Bộ phận khác</p>
                                </div>
                            </Link>
                        </div>
                    </Col>
                    <Col md={6} id="boxDesGioiThieu">
                        <p className="lblG">Giới thiệu</p>
                        <h4 className="headerGioiThieu">Về chúng tôi</h4>
                        <p className="contentGioiThieu">
                            Theo yêu cầu phát triển tự nhiên của xã hội, để giảm
                            sự thiếu hụt tạng hiến, ngoài việc đẩy mạnh phát
                            triển ghép tạng thận từ người hiến tạng chết não còn
                            cần phải mở rộng và tận dụng nguồn tạng hiến từ
                            người hiến tim ngừng đập.
                            <br />
                            <br />
                            Đơn vị Điều phối ghép các bộ phận cơ thể người BVCR
                            được hình thành để đáp ứng theo yêu cầu thực hiện
                            của đề tài nghiên cứu cấp nhà nước “Nghiên cứu triển
                            khai ghép thận từ người cho tim ngừng đập” được giao
                            về BVCR thực hiện (2011-2015).
                            <br />
                            <br />
                            Một trong những trách nhiệm của đơn vị điều phối là
                            làm sao làm gia tăng được sự đồng thuận hiến tạng
                            nhân đạo cứu người khi chẳng may qua đời, gia tăng
                            được nguồn tạng hiến tặng, quản lý về mặt khoa học
                            và tuyển chọn, điều phối sao cho minh bạch, công
                            bằng.
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}
