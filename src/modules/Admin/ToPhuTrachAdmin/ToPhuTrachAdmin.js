/* eslint-disable react/jsx-wrap-multilines */
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as ToPhuTrachService from '@app/services/ToPhuTrachService';
import * as TypeToPhuTrachConstant from '@modules/Common/TypeToPhuTrachConstant';
import * as antd from 'antd';
import {SearchOutlined, DeleteOutlined} from '@ant-design/icons';
import * as antIcon from '@ant-design/icons';

import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    // Button,
    Card,
    ListGroup,
    ListGroupItem,
    Modal
} from 'react-bootstrap';
import {
    TOPHUTRACH_CLOSE_VIEWDETAIL,
    TOPHUTRACH_CLOSE_VIEWEDIT,
    TOPHUTRACH_EDIT_CLOSE,
    TOPHUTRACH_SEARCH_SAVE
} from '@app/store/ActionType/ToPhuTrachTypeAction';
// import {Field, Form, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {NotFoundImage} from '@modules/Common/NotFound';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';

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
    Pagination
} = antd;
const {Option} = Select;
const {Column, ColumnGroup} = Table;

const ToPhuTrachAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
    let FileSelected;

    const {
        LoadEntityData,
        onCreateEntity,
        onDeleteEntity,
        onDeleteMultiEntity,
        onEditEntity,
        onCloseEntityModal,
        onCloseEntityEditModal,
        lstEntity,
        showEditModal,
        IsUpdate,
        entityObj,
        showDetailModal,
        onOpenDetailModal,
        onSaveEditEntity,
        isInit,
        searchModel,
        onSubmitSearchSave
    } = props;
    const [showPanelSearch, SetshowPanelSearch] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    let dataSelected;
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);
    const [form] = Form.useForm();
    function ToggleSearchPanel() {
        SetshowPanelSearch(!showPanelSearch);
    }
    useEffect(() => {
        // Update the document title using the browser API
        if (IsUpdate) {
            let objSearch = {
                ...searchModel
            };
            if (searchModel == null || searchModel === undefined) {
                objSearch = {
                    PageIndex: 1,
                    PageSize: 5
                };
            }
            LoadEntityData(objSearch);
        }
    });

    function CreateModal() {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const onFinish = (values) => {
            const ObjSave = {
                ...values
            };

            onCreateEntity(ObjSave);
        };

        const onFinishFailed = (errorInfo) => {
            notification.error({
                placement: 'bottomRight',
                message: 'C???nh b??o',
                description: 'Vui l??ng ki???m tra l???i d??? li???u nh???p'
            });
        };
        const submitCreate = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Drawer
                    title="T???o m???i th??ng tin t??? ph??? tr??ch"
                    placement="right"
                    size="large"
                    onClose={handleClose}
                    visible={show}
                    extra={
                        <Space>
                            {/* <Button type="primary" onClick={submitCreate}>
                                Ho??n th??nh
                            </Button> */}
                            <Button onClick={handleClose}>????ng</Button>
                        </Space>
                    }
                >
                    <div className="mrg10">
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8
                            }}
                            wrapperCol={{
                                span: 16
                            }}
                            initialValues={{
                                remember: true
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="T??n ng?????i ph??? tr??ch"
                                name="TenNguoiPhuTrach"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p th??ng tin n??y!'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="Ch???c v???" name="ChucVu">
                                <Input />
                            </Form.Item>
                            <Form.Item label="S??? ??i???n tho???i" name="SoDienThoai">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="Email">
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="TypeTo"
                                label="Ti???p nh???n"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng ch???n 1 l???a ch???n!'
                                    }
                                ]}
                            >
                                <Select placeholder="Ch???n 1 l???a ch???n">
                                    <Option value="PhuTrachHien">
                                        Ti???p nh???n ????ng k?? hi???n
                                    </Option>
                                    <Option value="ToChoGhepThan">
                                        Ti???p nh???n ch??? gh??p th???n
                                    </Option>
                                    <Option value="ToChoGhepTim">
                                        Ti???p nh???n ch??? gh??p tim
                                    </Option>
                                    <Option value="ToChoGhepGan">
                                        Ti???p nh???n ch??? gh??p gan
                                    </Option>
                                    <Option value="ToChoGhepPhoi">
                                        Ti???p nh???n ch??? gh??p ph???i
                                    </Option>
                                    <Option value="ToChoGhepGiacMac">
                                        Ti???p nh???n ch??? gh??p gi??c m???c
                                    </Option>
                                    <Option value="ToChoGhepTuy">
                                        Ti???p nh???n ch??? gh??p t???y
                                    </Option>

                                    <Option value="ToChoGhepRuot">
                                        Ti???p nh???n ch??? gh??p ru???t
                                    </Option>
                                    <Option value="ToChoGhepDa">
                                        Ti???p nh???n ch??? gh??p da
                                    </Option>
                                    <Option value="ToChoGhepChiThe">
                                        Ti???p nh???n ch??? gh??p chi th???
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Ho??n th??nh
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Drawer>
                <Button
                    variant=""
                    className="btn-nobg"
                    size="sm"
                    onClick={handleShow}
                >
                    <i className="fa fa-plus" aria-hidden="true" />
                    T???o m???i
                </Button>
            </>
        );
    }

    function EditModal() {
        const onFinish = (values) => {
            const ObjSave = {
                ...values
            };

            onSaveEditEntity(ObjSave);
        };

        const onFinishFailed = (errorInfo) => {
            notification.error({
                placement: 'bottomRight',
                message: 'C???nh b??o',
                description: 'Vui l??ng ki???m tra l???i d??? li???u nh???p'
            });
        };
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        //  console.log(entityObj);
        return (
            <>
                <Drawer
                    title="C???p nh???t th??ng tin t??? ph??? tr??ch"
                    placement="right"
                    size="large"
                    onClose={handleEditClose}
                    visible={showEdit}
                    extra={
                        <Space>
                            <Button onClick={handleEditClose}>????ng</Button>
                        </Space>
                    }
                >
                    <div className="mrg10">
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8
                            }}
                            wrapperCol={{
                                span: 16
                            }}
                            initialValues={{
                                Id: entityObj.Id,
                                TenNguoiPhuTrach: entityObj.TenNguoiPhuTrach,
                                ChucVu: entityObj.ChucVu,
                                TypeTo: entityObj.TypeTo,
                                SoDienThoai: entityObj.SoDienThoai,
                                Email: entityObj.Email
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item className="hide" name="Id" key="Id" />
                            <Form.Item
                                label="T??n ng?????i ph??? tr??ch"
                                name="TenNguoiPhuTrach"
                                key="TenNguoiPhuTrach"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p th??ng tin n??y!'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Ch???c v???"
                                name="ChucVu"
                                key="ChucVu"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="S??? ??i???n tho???i"
                                name="SoDienThoai"
                                key="SoDienThoai"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="Email" key="Email">
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="TypeTo"
                                key="TypeTo"
                                label="Ti???p nh???n"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng ch???n 1 l???a ch???n!'
                                    }
                                ]}
                            >
                                <Select placeholder="Ch???n 1 l???a ch???n">
                                    <Option value="PhuTrachHien">
                                        Ti???p nh???n ????ng k?? hi???n
                                    </Option>
                                    <Option value="ToChoGhepThan">
                                        Ti???p nh???n ch??? gh??p th???n
                                    </Option>
                                    <Option value="ToChoGhepTim">
                                        Ti???p nh???n ch??? gh??p tim
                                    </Option>
                                    <Option value="ToChoGhepGan">
                                        Ti???p nh???n ch??? gh??p gan
                                    </Option>
                                    <Option value="ToChoGhepPhoi">
                                        Ti???p nh???n ch??? gh??p ph???i
                                    </Option>
                                    <Option value="ToChoGhepGiacMac">
                                        Ti???p nh???n ch??? gh??p gi??c m???c
                                    </Option>
                                    <Option value="ToChoGhepTuy">
                                        Ti???p nh???n ch??? gh??p t???y
                                    </Option>

                                    <Option value="ToChoGhepRuot">
                                        Ti???p nh???n ch??? gh??p ru???t
                                    </Option>
                                    <Option value="ToChoGhepDa">
                                        Ti???p nh???n ch??? gh??p da
                                    </Option>
                                    <Option value="ToChoGhepChiThe">
                                        Ti???p nh???n ch??? gh??p chi th???
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Ho??n th??nh
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Drawer>
                {/* 
                <Modal
                    show={showEditModal}
                    size="lg"
                    onHide={() => onCloseEntityEditModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>C???p nh???t th??ng tin Ti???p nh???n</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityObj.Id,
                                TenNguoiPhuTrach: entityObj.TenNguoiPhuTrach,
                                ChucVu: entityObj.ChucVu,
                                TypeTo: entityObj.TypeTo,
                                SoDienThoai: entityObj.SoDienThoai,
                                Email: entityObj.Email
                            }}
                            validationSchema={SignupSchema}
                            vali
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values
                                };
                                onSaveEditEntity(ObjSave);
                                // same shape as initial values
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />

                                    <div className="form-group">
                                        <label htmlFor="TenNguoiPhuTrach">
                                            T??n ng?????i ph??? tr??ch
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TenNguoiPhuTrach"
                                            key="TenNguoiPhuTrach"
                                            className="form-control "
                                        />
                                        {errors.TenNguoiPhuTrach &&
                                        touched.TenNguoiPhuTrach ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TenNguoiPhuTrach}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ChucVu">
                                            Ch???c v???
                                      
                                        </label>
                                        <Field
                                            name="ChucVu"
                                            key="ChucVu"
                                            className="form-control"
                                        />
                                        {errors.ChucVu && touched.ChucVu ? (
                                            <div className="invalid-feedback">
                                                {errors.ChucVu}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="SoDienThoai">
                                            S??? ??i???n tho???i
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="SoDienThoai"
                                            key="SoDienThoai"
                                            className="form-control"
                                        />
                                        {errors.SoDienThoai &&
                                        touched.SoDienThoai ? (
                                            <div className="invalid-feedback">
                                                {errors.SoDienThoai}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Email">
                                            Email
                                          
                                        </label>
                                        <Field
                                            name="Email"
                                            key="Email"
                                            className="form-control"
                                        />
                                        {errors.Email && touched.Email ? (
                                            <div className="invalid-feedback">
                                                {errors.Email}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="TypeTo">
                                            Ti???p nh???n
                                            <span className="red">*</span>
                                        </label>

                                        <Field
                                            as="select"
                                            name="TypeTo"
                                            key="TypeTo"
                                            className="form-control "
                                        >
                                            <option value="">--Ch???n--</option>
                                            <option value="PhuTrachHien">
                                                Ti???p nh???n ????ng k?? hi???n
                                            </option>
                                            <option value="ToChoGhepThan">
                                                Ti???p nh???n ch??? gh??p th???n
                                            </option>
                                            <option value="ToChoGhepTim">
                                                Ti???p nh???n ch??? gh??p tim
                                            </option>
                                            <option value="ToChoGhepGan">
                                                Ti???p nh???n ch??? gh??p gan
                                            </option>
                                            <option value="ToChoGhepPhoi">
                                                Ti???p nh???n ch??? gh??p ph???i
                                            </option>
                                            <option value="ToChoGhepGiacMac">
                                                Ti???p nh???n ch??? gh??p gi??c m???c
                                            </option>
                                            <option value="ToChoGhepTuy">
                                                Ti???p nh???n ch??? gh??p t???y
                                            </option>

                                            <option value="ToChoGhepRuot">
                                                Ti???p nh???n ch??? gh??p ru???t
                                            </option>
                                            <option value="ToChoGhepDa">
                                                Ti???p nh???n ch??? gh??p da
                                            </option>
                                            <option value="ToChoGhepChiThe">
                                                Ti???p nh???n ch??? gh??p chi th???
                                            </option>
                                        </Field>
                                        {errors.TypeTo && touched.TypeTo ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TypeTo}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik> 
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitEdit}>
                            Ho??n th??nh
                        </Button>
                    </Modal.Footer>
                </Modal> */}
            </>
        );
    }
    function DetailModal() {
        return (
            <>
                <Drawer
                    title="Th??ng tin t??? ph??? tr??ch"
                    placement="right"
                    size="large"
                    onClose={onCloseEntityModal}
                    visible={showDetailModal}
                    extra={
                        <Space>
                            <Button onClick={onCloseEntityModal}>????ng</Button>
                        </Space>
                    }
                >
                    <Descriptions
                        title="Th??ng tin chi ti???t"
                        bordered
                        column={1}
                        size="middle"
                    >
                        <Descriptions.Item label="T??n ng?????i ph??? tr??ch">
                            {entityObj.TenNguoiPhuTrach}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ch???c v???">
                            {entityObj.ChucVu}
                        </Descriptions.Item>
                        <Descriptions.Item label="S??? ??i???n tho???i">
                            {entityObj.SoDienThoai}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {entityObj.Email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ti???p nh???n">
                            {TypeToPhuTrachConstant.GetName(entityObj.TypeTo)}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }
    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? th??ng tin Ti???p nh???n n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        onDeleteEntity(id);
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'X??c nh???n x??a c??c th??ng tin Ti???p nh???n n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c th??ng tin Ti???p nh???n n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = dataSelected;
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
                        } else {
                            toast.onError('Vui l??ng ch???n ??t nh???t m???t b???n ghi');
                        }
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };

    const RenderFormSearch = () => {
        return (
            <section
                className={`content  ${
                    showPanelSearch ? 'show fade' : 'hidden'
                }`}
            >
                <div className="container-fluid mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <strong>T??m ki???m</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Form
                                        form={form}
                                        name="basic"
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                        initialValues={{remember: true}}
                                        onFinish={(values) => {
                                            onSubmitSearchSave(values);
                                        }}
                                        onFinishFailed={(errorInfo) => {
                                            notification.error({
                                                placement: 'bottomRight',
                                                message: 'C???nh b??o',
                                                description:
                                                    'Vui l??ng ki???m tra l???i d??? li???u nh???p'
                                            });
                                        }}
                                        autoComplete="off"
                                    >
                                        <Row gutter={24}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="T??n ng?????i ph??? tr??ch"
                                                    name="TenNguoiPhuTrachFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Ch???c v???"
                                                    name="ChucVuFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="S??? ??i???n tho???i"
                                                    name="SoDienThoaiFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Email"
                                                    name="EmailFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Ti???p nh???n"
                                                    name="TypeToFilter"
                                                >
                                                    <Select placeholder="--T???t c???--">
                                                        <Option value="PhuTrachHien">
                                                            Ti???p nh???n ????ng k??
                                                            hi???n
                                                        </Option>
                                                        <Option value="ToChoGhepThan">
                                                            Ti???p nh???n ch??? gh??p
                                                            th???n
                                                        </Option>
                                                        <Option value="ToChoGhepTim">
                                                            Ti???p nh???n ch??? gh??p
                                                            tim
                                                        </Option>
                                                        <Option value="ToChoGhepGan">
                                                            Ti???p nh???n ch??? gh??p
                                                            gan
                                                        </Option>
                                                        <Option value="ToChoGhepPhoi">
                                                            Ti???p nh???n ch??? gh??p
                                                            ph???i
                                                        </Option>
                                                        <Option value="ToChoGhepGiacMac">
                                                            Ti???p nh???n ch??? gh??p
                                                            gi??c m???c
                                                        </Option>
                                                        <Option value="ToChoGhepTuy">
                                                            Ti???p nh???n ch??? gh??p
                                                            t???y
                                                        </Option>

                                                        <Option value="ToChoGhepRuot">
                                                            Ti???p nh???n ch??? gh??p
                                                            ru???t
                                                        </Option>
                                                        <Option value="ToChoGhepDa">
                                                            Ti???p nh???n ch??? gh??p
                                                            da
                                                        </Option>
                                                        <Option value="ToChoGhepChiThe">
                                                            Ti???p nh???n ch??? gh??p
                                                            chi th???
                                                        </Option>
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
                                                    T??m ki???m
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
    const NextPage = (pageInd, pageSize) => {
        const searchMd = {
            ...searchModel,
            PageIndex: pageInd,
            PageSize: pageSize
        };
        onSubmitSearchSave(searchMd);
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dataSelected = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
            // disabled: record.name === 'Disabled User',
            // // Column configuration not to be checked
            // name: record.name
        })
    };

    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 5;
        let pageInd = 1;
        let Count = 0;
        if (lstEntity.ListItem !== undefined) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
            Count = lstEntity.Count;
        }

        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        const getmenu = (record) => (
            <>
                <Menu>
                    <Menu.Item
                        key={`sua_${record.Id}`}
                        onClick={() => {
                            onEditEntity(record.Id);
                            handleEditShow();
                        }}
                        icon={<antIcon.EditOutlined />}
                    >
                        S???a
                    </Menu.Item>

                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        onClick={() => DeleteAction(record.Id)}
                        icon={<antIcon.DeleteOutlined />}
                    >
                        X??a
                    </Menu.Item>
                </Menu>
            </>
        );

        return (
            <>
                <EditModal />
                <DetailModal />
                <Table
                    rowKey="Id"
                    rowSelection={rowSelection}
                    dataSource={lstItem}
                    pagination={{
                        total: Count,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSize: pageSiz,
                        current: pageInd,
                        showTotal: (total) => `T???ng c???ng ${total} b???n ghi`,
                        onChange: (page, pageSize) => {
                            NextPage(page, pageSize);
                        }
                    }}
                >
                    <Column
                        title="#"
                        key="STT"
                        render={(text, record, index) => (
                            <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                        )}
                    />
                    <Column
                        title="T??n ng?????i ph??? tr??ch"
                        dataIndex="TenNguoiPhuTrach"
                        key="TenNguoiPhuTrach"
                    />
                    <Column title="Ch???c v???" dataIndex="ChucVu" key="ChucVu" />
                    <Column
                        title="Ti???p nh???n h??? s??"
                        key="TypeTo"
                        render={(text, record, index) => (
                            <div>
                                {TypeToPhuTrachConstant.GetName(record.TypeTo)}
                            </div>
                        )}
                    />
                    <Column
                        title="S??? ??i???n tho???i"
                        dataIndex="SoDienThoai"
                        key="SoDienThoai"
                    />
                    <Column title="Email" dataIndex="Email" key="Email" />
                    <Column
                        title="Thao t??c"
                        key="action"
                        render={(text, record) => (
                            <Dropdown.Button
                                onClick={() => onOpenDetailModal(record.Id)}
                                overlay={() => getmenu(record)}
                            >
                                Chi ti???t
                            </Dropdown.Button>
                        )}
                    />
                </Table>
            </>
        );
    };
    return (
        <>
            <AdminSecsionHead ModuleName="Danh s??ch th??ng tin Ti???p nh???n" />
            <RenderFormSearch />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <Space>
                                        <CreateModal />
                                        <Button
                                            size="sm"
                                            variant=""
                                            className="btn-nobg"
                                            onClick={() => ToggleSearchPanel()}
                                        >
                                            {showPanelSearch ? (
                                                <>
                                                    <i
                                                        className="fa fa-times"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    ????ng t??m ki???m
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    T??m ki???m
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            X??a
                                        </Button>
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <RenderDsTable />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        ToPhuTrachService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: TOPHUTRACH_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        ToPhuTrachService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: TOPHUTRACH_CLOSE_VIEWDETAIL});
    },

    onCreateEntity: (tintuc) => {
        ToPhuTrachService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        ToPhuTrachService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        ToPhuTrachService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        ToPhuTrachService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        ToPhuTrachService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: TOPHUTRACH_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.tophutrach.lstEntity,
    IsUpdate: state.tophutrach.IsUpdate,
    entityObj: state.tophutrach.entityObj,
    showDetailModal: state.tophutrach.showDetailModal,
    showEditModal: state.tophutrach.showEditModal,
    isInit: state.tophutrach.isInit,
    searchModel: state.tophutrach.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(ToPhuTrachAdm);
