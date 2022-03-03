/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {Row, Col, Container, Breadcrumb} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as CommonUtility from '@modules/Common/CommonUtility';

const LienHe = () => {
    const RenderData = () => {
        const [lstItem, setlstItem] = useState([]);
        const [initDataItem, setinitDataItem] = useState(false);
        const InitData = () => {
            if (!initDataItem) {
                fetch(`${Constant.PathServer}/api/TinTuc/GetThongTinLienHe`)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.Status) {
                            setlstItem(json.Data);
                        }
                    });
                setinitDataItem(true);
            }
        };

        InitData();
        return (
            <Row>
                <Col sm={5}>
                    <div className="textNoiDungTinBai">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: lstItem.Content
                            }}
                        />
                    </div>
                </Col>
                <Col sm={7}>
                    <iframe
                        title="bando"
                        id="bando"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6986271521514!2d106.65736551475128!3d10.757693862480917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ef1efebf7d7%3A0x9014ce53b8910a58!2zQuG7h25oIHZp4buHbiBDaOG7oyBS4bqreQ!5e0!3m2!1svi!2s!4v1622349464475!5m2!1svi!2s"
                        width="600"
                        height="450"
                        allowFullScreen=""
                        loading="lazy"
                        className="noborder w100p"
                    />
                </Col>
            </Row>
        );
    };
    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            Liên hệ
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderData />
        </Container>
    );
};

export default LienHe;
