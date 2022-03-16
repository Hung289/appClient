/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as Constant from '@app/Constant';

import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';

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
    Drawer,
    Tabs,
    Checkbox,
    Descriptions
} from 'antd';

import * as CommonUtility from '@modules/Common/CommonUtility';

const {TabPane} = Tabs;

const {Title} = Typography;
const moment = require('moment');

const MatchingNhomMauDetailAdm = (props) => {
    const {
        entityObj,
        showDetailModal,
        onCloseEntityModal,
        setshowDetailModal
    } = props;

    useEffect(() => {}, []);

    function CreateModal() {
        return (
            <>
                <Drawer
                    title="Thông tin cấu hình nguyên tắc truyền máu"
                    placement="right"
                    size="large"
                    onClose={() => setshowDetailModal(false)}
                    visible={showDetailModal}
                    extra={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Space>
                            <Button onClick={() => setshowDetailModal(false)}>
                                Đóng
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={16}>
                        <Col span={9}>
                            {entityObj !== null && (
                                <Descriptions
                                    title="Thông tin cấu hình"
                                    bordered
                                    column={1}
                                    size="middle"
                                >
                                    <Descriptions.Item label="Nhóm máu được xét">
                                        {entityObj.NhomMauDuocXet}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Nhóm máu phù hợp">
                                        {entityObj.NhomMauPhuHop}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trọng số">
                                        {entityObj.TrongSo}
                                    </Descriptions.Item>
                                </Descriptions>
                            )}
                        </Col>
                    </Row>
                </Drawer>
            </>
        );
    }
    return (
        <>
            <CreateModal />
        </>
    );
};

export default MatchingNhomMauDetailAdm;
