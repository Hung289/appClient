/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import * as Constant from '@app/Constant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import axios from 'axios';
import {Modal} from 'react-bootstrap';

import {
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    Typography,
    layout,
    Layout,
    Upload,
    Button,
    Checkbox,
    Descriptions
} from 'antd';

import * as hienTangCoQuanService from '@app/services/HienTangCoQuanService';

import * as CommonUtility from '@modules/Common/CommonUtility';

const {Title} = Typography;
const moment = require('moment');

const HienTangCoQuanUpdateNgayGhepAdm = (props) => {
    const {
        IsShowUpdateNgayGhepPopup,
        entityObj,
        onCloseUpdateNgayGhepPopup,
        OnLoadingAction,
        onReloadPage
    } = props;

    const onCreateEntity = (objCreate) => {
        OnLoadingAction(true);
        hienTangCoQuanService.UpdateNgayGhepEntity(objCreate).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseUpdateNgayGhepPopup();
                // onReloadPage();
            }
        });
    };
    useEffect(() => {}, []);

    function UpdateNgayGhepModal() {
        return (
            <>
                <Modal
                    show={IsShowUpdateNgayGhepPopup}
                    dialogClassName=""
                    onHide={() => onCloseUpdateNgayGhepPopup()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cập nhật ngày ghép người bệnh</Modal.Title>
                    </Modal.Header>
                    <Form
                        onFinish={onCreateEntity}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: entityObj.Id,
                            IdCoQuanHien: entityObj.IdCoQuanHien,
                            IdNguoiGhep: entityObj.IdNguoiGhep,
                            NgayGhep:
                                entityObj.NgayGhep !== null
                                    ? moment(entityObj.NgayGhep)
                                    : '',
                            IsDaGhep: true,
                            GhiChu: entityObj.GhiChu
                        }}
                    >
                        <Modal.Body>
                            {entityObj !== null && (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item hidden name="IsDaGhep">
                                            <Input name="IsDaGhep" />
                                        </Form.Item>
                                        <Form.Item hidden name="Id">
                                            <Input name="Id" />
                                        </Form.Item>
                                        <Form.Item hidden name="IdNguoiGhep">
                                            <Input name="IdNguoiGhep" />
                                        </Form.Item>
                                        <Form.Item hidden name="IdCoQuanHien">
                                            <Input name="IdCoQuanHien" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Ngày ghép"
                                            rules={[
                                                {
                                                    type: 'object',
                                                    required: true,
                                                    message:
                                                        'Vui lòng nhập thông tin này'
                                                },
                                                () => ({
                                                    validator(_, val) {
                                                        if (
                                                            new Date() <
                                                            new Date(val)
                                                        ) {
                                                            // eslint-disable-next-line prefer-promise-reject-errors
                                                            return Promise.reject(
                                                                'Ngày hiến vượt quá ngày hiện tại'
                                                            );
                                                        }
                                                        if (
                                                            new Date(
                                                                '1920-1-1'
                                                            ) > new Date(val)
                                                        ) {
                                                            // eslint-disable-next-line prefer-promise-reject-errors
                                                            return Promise.reject(
                                                                'Ngày hiến phải sau ngày 1 tháng 1 năm 1920'
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                            name="NgayGhep"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                name="NgayGhep"
                                                style={{width: '100%'}}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ghi chú"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                            name="GhiChu"
                                        >
                                            <Input.TextArea name="GhiChu" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => onCloseUpdateNgayGhepPopup()}
                            >
                                Đóng
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Hoàn thành
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
    return (
        <>
            <UpdateNgayGhepModal />
        </>
    );
};

export default HienTangCoQuanUpdateNgayGhepAdm;
