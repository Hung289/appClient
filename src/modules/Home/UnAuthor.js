/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {Row, Col, Container, Breadcrumb} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as CommonUtility from '@modules/Common/CommonUtility';

const UnAuthor = () => {
    useEffect(() => {
        return () => {};
    }, []);

    const RenderData = () => {
        return (
            <>
                <div className="alert alert-warning">
                    <h1 className="center">
                        <b>401. KHÔNG CÓ QUYỀN TRUY CẬP</b>
                    </h1>
                    <h4 className="center">
                        Chức năng này yêu cầu quyền truy cập mà bạn không có.
                    </h4>
                    <h4 className="center">
                        Vui lòng quản trị hệ thống để biết thêm thông tin
                    </h4>
                </div>
            </>
        );
    };
    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            Không có quyền truy cập
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderData />
        </Container>
    );
};

export default UnAuthor;
