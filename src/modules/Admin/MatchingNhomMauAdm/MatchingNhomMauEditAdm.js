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
    Descriptions,
    InputNumber
} from 'antd';

import * as MatchingNhomMauService from '@app/services/MatchingNhomMauService';

import * as CommonUtility from '@modules/Common/CommonUtility';

const {Title} = Typography;
const moment = require('moment');

const MatchingNhomMauEditAdm = (props) => {
    const {
        IsShowEditPopup,
        entityObj,
        onCloseEntityEditModal,
        OnLoadingAction,
        onReloadPage,
        danhMucData
    } = props;

    const onCreateEntity = (objCreate) => {
        OnLoadingAction(true);
        MatchingNhomMauService.EditNewEntity(objCreate).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditModal();
                onReloadPage();
            }
        });
    };
    useEffect(() => {}, []);

    function EditModal() {
        return (
            <>
                <Modal
                    show={IsShowEditPopup}
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật thông tin hiến mô tạng
                        </Modal.Title>
                    </Modal.Header>
                    <Form
                        onFinish={onCreateEntity}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: entityObj.Id,
                            NhomMauDuocXet: entityObj.NhomMauDuocXet,
                            NhomMauPhuHop: entityObj.NhomMauPhuHop,
                            TrongSo: entityObj.TrongSo
                        }}
                    >
                        <Modal.Body>
                            {entityObj !== null && (
                                <Row gutter={16}>
                                    <Col span={9}>
                                        <Form.Item hidden name="Id">
                                            <Input name="Id" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Nhóm máu xét"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng nhập thông tin này'
                                                }
                                            ]}
                                            name="NhomMauDuocXet"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                        >
                                            <Select
                                                defaultValue=""
                                                name="NhomMauDuocXet"
                                            >
                                                {danhMucData &&
                                                    danhMucData.NhomMau &&
                                                    danhMucData.NhomMau.map(
                                                        (item) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        item.Code
                                                                    }
                                                                >
                                                                    {item.Name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Nhóm máu phù hợp"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng nhập thông tin này'
                                                }
                                            ]}
                                            name="NhomMauPhuHop"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                        >
                                            <Select
                                                defaultValue=""
                                                name="NhomMauPhuHop"
                                            >
                                                {danhMucData &&
                                                    danhMucData.NhomMau &&
                                                    danhMucData.NhomMau.map(
                                                        (item) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        item.Code
                                                                    }
                                                                >
                                                                    {item.Name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Trọng số"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                            name="TrongSo"
                                        >
                                            <InputNumber
                                                min={0}
                                                max={10}
                                                formatter={(value) =>
                                                    `${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ','
                                                    )
                                                }
                                                parser={(value) =>
                                                    value.replace(
                                                        /\$\s?|(,*)/g,
                                                        ''
                                                    )
                                                }
                                                name="TrongSo"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => onCloseEntityEditModal()}
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
            <EditModal />
        </>
    );
};

export default MatchingNhomMauEditAdm;
