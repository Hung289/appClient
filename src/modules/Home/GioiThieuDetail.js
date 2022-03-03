/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {Row, Col, Container, Breadcrumb} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as CommonUtility from '@modules/Common/CommonUtility';

const GioiThieuDetail = () => {
    const RenderDataMain = () => {
        const [lstItem, setlstItem] = useState({});
        const [initDataItem, setInitDataItem] = useState(false);
        const InitData = () => {
            if (!initDataItem) {
                fetch(`${Constant.PathServer}/api/TinTuc/GetBaiGioiThieu`)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.Status) {
                            setlstItem(json.Data);
                        }
                    });
                setInitDataItem(true);
            }
        };
        InitData();
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="textNoiDungGioiThieuTinBai">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: lstItem.Content
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Giới thiệu
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default GioiThieuDetail;
