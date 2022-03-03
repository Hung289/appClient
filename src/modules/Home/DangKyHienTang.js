import React, {Component} from 'react';
import {Row, Col, Container} from 'react-bootstrap';

class DangKyHienTang extends Component {
    render() {
        return (
            <>
                <Container id="boxDangKyBanner">
                    <Row>
                        <Col sm={4}>
                            <a href="/#/PDKHien">
                                <img
                                    className="imgItem"
                                    src="/images/anh1.jpg"
                                    alt=""
                                />
                            </a>
                        </Col>
                        <Col sm={4}>
                            <a href="/#/PDKGhepCoQuanKhac">
                                <img
                                    className="imgItem"
                                    src="/images/anh2.jpg"
                                    alt=""
                                />
                            </a>
                        </Col>
                        <Col sm={4}>
                            <a href="/#/nhomtin/huongdandangky">
                                <img
                                    className="imgItem"
                                    src="/images/anh3.jpg"
                                    alt=""
                                />
                            </a>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default DangKyHienTang;
