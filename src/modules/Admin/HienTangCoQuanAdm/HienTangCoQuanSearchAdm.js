import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import {Card} from 'react-bootstrap';
import * as antd from 'antd';

const {
    Drawer,
    Button,
    Space,
    Form,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Dropdown,
    Menu,
    Pagination,
    DatePicker
} = antd;
const {Option} = Select;
const {Column, ColumnGroup} = Table;

const HienTangCoQuanSearchAdm = React.memo((props) => {
    const {
        LoadEntityData,
        searchModel,
        setsearchModel,
        showSearchPanel,
        typeStatus
    } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        return () => {};
    }, [searchModel]);

    const RenderFormSearch = () => {
        const colSize = 8;
        return (
            <section
                className={`content  ${
                    showSearchPanel ? 'show fade' : 'hidden'
                }`}
            >
                <div className="container-fluid mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Form
                                        form={form}
                                        name="basic"
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                        initialValues={{remember: true}}
                                        onFinish={(values) => {
                                            const objSearch = {
                                                ...values,
                                                PageIndex:
                                                    searchModel.PageIndex,
                                                PageSize: searchModel.PageSize
                                            };
                                            setsearchModel(objSearch);
                                            LoadEntityData(
                                                typeStatus,
                                                objSearch
                                            );
                                        }}
                                        onFinishFailed={(errorInfo) => {
                                            notification.error({
                                                placement: 'bottomRight',
                                                message: 'Cảnh báo',
                                                description:
                                                    'Vui lòng kiểm tra lại dữ liệu nhập'
                                            });
                                        }}
                                        autoComplete="off"
                                    >
                                        <Row gutter={24}>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Họ tên"
                                                    name="NguoiHienFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Mã số"
                                                    name="MaSoFilter"
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Giới tính"
                                                    name="GioiTinhFilter"
                                                >
                                                    <Select placeholder="Tất cả">
                                                        <Option value="">
                                                            Tất cả
                                                        </Option>
                                                        <Option value="1">
                                                            Nam
                                                        </Option>
                                                        <Option value="0">
                                                            Nữ
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item label="Ngày hiến">
                                                    <Form.Item
                                                        name="NgayHien_FROM"
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                            width:
                                                                'calc(50% - 8px)'
                                                        }}
                                                    >
                                                        <DatePicker
                                                            placeholder="Từ ngày"
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="NgayHien_TO"
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                            width:
                                                                'calc(50% - 8px)',
                                                            margin: '0 8px'
                                                        }}
                                                    >
                                                        <DatePicker
                                                            placeholder="Đến ngày"
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Trạng thái"
                                                    name="Status"
                                                >
                                                    <Select placeholder="Tất cả">
                                                        <Option value="">
                                                            Tất cả
                                                        </Option>
                                                        {HienTangMoTangStatusConstant.RenderDropdown()}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Cơ quan hiến"
                                                    name="CoQuanHien"
                                                >
                                                    <Select placeholder="Tất cả">
                                                        <Option value="">
                                                            Tất cả
                                                        </Option>
                                                        {TypeBoPhanConstant.RenderDropdown()}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                span={24}
                                                style={{textAlign: 'right'}}
                                            >
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    Tìm kiếm
                                                </Button>
                                                <Button
                                                    style={{margin: '0 8px'}}
                                                    onClick={() => {
                                                        form.resetFields();
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    return (
        <>
            <RenderFormSearch />
        </>
    );
});
export default HienTangCoQuanSearchAdm;
