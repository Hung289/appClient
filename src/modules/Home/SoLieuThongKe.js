import React, {Component} from 'react';
import {Row, Col, Container, Breadcrumb} from 'react-bootstrap';

const SoLieuThongKe = () => {
    const RenderData = () => {
        return <div> </div>;
    };

    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            Số liệu thống kê
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <img
                        width="100%"
                        alt="Đang cập nhật"
                        src="/img/management.png"
                    />
                </div>
            </div>
            <RenderData />
        </Container>
    );
};

export default SoLieuThongKe;
