/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as Constant from '@app/Constant';

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

const MatchingNhomMauCreateAdm = (props) => {
    const formRef = useRef();
    const {
        setIsShowCreatePopup,
        IsShowCreatePopup,
        OnLoadingAction,
        onReloadPage,
        entityObj,
        danhMucData
    } = props;

    const onCreateEntity = (objCreate) => {
        OnLoadingAction(true);
        MatchingNhomMauService.CreateNewEntity(objCreate).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                setIsShowCreatePopup(false);
                onReloadPage();
            }
        });
    };

    function CreateModal() {
        return (
            <>
                <Modal
                    show={IsShowCreatePopup}
                    dialogClassName="modal-90w"
                    onHide={() => setIsShowCreatePopup(false)}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Tạo mới cấu hình nguyên tắc truyền máu
                        </Modal.Title>
                    </Modal.Header>
                    <Form
                        onFinish={onCreateEntity}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            NhomMauDuocXet: '',
                            NhomMauPhuHop: '',
                            TrongSo: 0
                        }}
                    >
                        <Modal.Body>
                            <Row gutter={16}>
                                <Col span={9}>
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
                                        validateTrigger={['onBlur', 'onChange']}
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
                                                                key={item.Code}
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
                                        validateTrigger={['onBlur', 'onChange']}
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
                                                                key={item.Code}
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
                                        validateTrigger={['onBlur', 'onChange']}
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
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            name="TrongSo"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => setIsShowCreatePopup(false)}
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
            <CreateModal />
        </>
    );
};

export default MatchingNhomMauCreateAdm;
