import React, {Component} from 'react';
import {Row, Col, Container} from 'react-bootstrap';

class ThongKeNhanh extends Component {
    render() {
        return (
            <div className="boxThongKeHome">
                <Container>
                    <Row>
                        <Col className="thongKeContent" sm={12}>
                            <Row>
                                <Col md={4}>
                                    <div className="ThongKeItem">
                                        <div className="Number">21.237</div>
                                        <div className="Desc">
                                            Người đăng ký
                                            <br /> Hiến mô tạng
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="ThongKeItem">
                                        {/* <div className="Number">212.558</div> */}
                                        <div className="Number">-----</div>
                                        <div className="Desc">
                                            Người bệnh
                                            <br /> Chờ ghép mô tạng
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="ThongKeItem">
                                        {/* <div className="Number">6.558</div> */}
                                        <div className="Number">-----</div>
                                        <div className="Desc">
                                            Người bệnh
                                            <br /> Được ghép mô tạng
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ThongKeNhanh;
