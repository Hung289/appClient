import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as roleService from '@app/services/moduleService';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    MODULE_CLOSE_VIEWDETAIL,
    MODULE_CLOSE_VIEWEDIT,
    MODULE_EDIT_CLOSE,
    MODULE_SEARCH_SAVE
} from '@app/store/ActionType/ModuleTypeAction';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Field, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {NotFoundImage} from '@modules/Common/NotFound';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {removeAscent} from '@modules/Common/CommonUtility';

import {
    Drawer,
    Button,
    Space,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Menu,
    Avatar,
    Pagination,
    Dropdown,
    Form,
    Card,
    DatePicker,
    Modal,
    Checkbox,
    InputNumber
} from 'antd';
import moment from 'moment';
import * as antIcon from '@ant-design/icons';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const ModuleAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
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
                    PageSize: 20
                };
            }
            LoadEntityData(objSearch);
        }
    });
    let dataSelected;
    const SignupSchema = Yup.object().shape({
        Name: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
            .test(
                'lxxen',
                'T??n ch???c n??ng ch??? ???????c s??? d???ng ch??? c??i v?? s???',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z0-9 ]*$/.test(str);
                }
            ),
        Code: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        Order: Yup.string().trim().required('Vui l??ng nh???p th??ng tin n??y')
    });

    const SearchSchema = Yup.object().shape({
        QueryName: Yup.string().min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???'),
        QueryCode: Yup.string().min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
    });

    function CreateModal() {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const submitCreate = () => {
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        return (
            <>
                <Button type="primary" onClick={handleShow}>
                    <i className="fa fa-plus" aria-hidden="true" /> &nbsp; T???o
                    m???i
                </Button>

                <Modal
                    title="T???o m???i ch???c n??ng"
                    centered
                    visible={show}
                    onOk={() => submitCreate()}
                    onCancel={() => handleClose()}
                    width={1000}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="????ng"
                >
                    <Form
                        ref={formRef}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Name: '',
                            Order: '',
                            IsShow: true,
                            ClassCss: '',
                            StyleCss: '',
                            Code: '',
                            AllowFilterScope: true
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values
                            };

                            onCreateEntity(ObjSave);
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="T??n ch???c n??ng"
                                    name="Name"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (
                                                    /^[a-zA-Z0-9 ]*$/.test(str)
                                                ) {
                                                    return Promise.resolve();
                                                }

                                                // eslint-disable-next-line prefer-promise-reject-errors
                                                return Promise.reject(
                                                    'T??n ch???c n??ng ch??? ???????c s??? d???ng ch??? c??i v?? s???'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="Name" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="M?? ch???c n??ng"
                                    name="Code"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="Code" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Th??? t???" name="Order">
                                    <InputNumber
                                        name="Order"
                                        style={{width: '100%'}}
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Font Awesome Class"
                                    name="ClassCss"
                                >
                                    <Input name="ClassCss" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="IsShow"
                                    valuePropName="checked"
                                >
                                    <Checkbox name="IsShow">Hi???n th????</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        return (
            <>
                <Modal
                    title="C???p nh???t ch???c n??ng"
                    centered
                    visible={showEditModal}
                    onOk={() => submitEdit()}
                    onCancel={() => onCloseEntityEditModal()}
                    width={1000}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="????ng"
                >
                    <Form
                        ref={formRef}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: entityObj.Id,
                            Name: entityObj.Name,
                            Order: entityObj.Order,
                            IsShow: entityObj.IsShow,
                            ClassCss: entityObj.ClassCss,
                            StyleCss: entityObj.StyleCss,
                            Code: entityObj.Code,
                            AllowFilterScope: entityObj.AllowFilterScope
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values
                            };
                            onSaveEditEntity(ObjSave);
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Id" hidden>
                                    <Input name="Id" />
                                </Form.Item>
                                <Form.Item
                                    label="T??n ch???c n??ng"
                                    name="Name"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="Name" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="M?? ch???c n??ng"
                                    name="Code"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="Code" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Th??? t???" name="Order">
                                    <InputNumber
                                        name="Order"
                                        style={{width: '100%'}}
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Font Awesome Class"
                                    name="ClassCss"
                                >
                                    <Input name="ClassCss" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }

    function DetailModal() {
        return (
            <>
                <Drawer
                    placement="right"
                    size="large"
                    visible={showDetailModal}
                    onClose={() => onCloseEntityModal()}
                    extra={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Space>
                            <Button
                                type="danger"
                                onClick={() => onCloseEntityModal()}
                            >
                                ????ng
                            </Button>
                        </Space>
                    }
                >
                    <Descriptions
                        title="Chi ti???t ch???c n??ng"
                        bordered
                        column={2}
                    >
                        <Descriptions.Item label="T??n ch???c n??ng">
                            {entityObj.Name}
                        </Descriptions.Item>
                        <Descriptions.Item label="M?? ch???c n??ng">
                            {entityObj.Code}
                        </Descriptions.Item>
                        <Descriptions.Item label="Font Awesome Class">
                            {entityObj.ClassCss}
                        </Descriptions.Item>
                        <Descriptions.Item label="Th??? t???">
                            {entityObj.Order}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hi???n th???">
                            {entityObj.IsShow ? 'Hi???n th???' : 'Kh??ng hi???n th???'}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? ch???c n??ng n??y.',
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
            title: 'X??c nh???n x??a c??c ch???c n??ng n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c ch???c n??ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
                        } else {
                            toast.error('Vui l??ng ch???n ??t nh???t m???t b???n ghi');
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
                            <Card title="T??m ki???m">
                                <Form
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    layout="vertical"
                                    initialValues={{
                                        QueryName: searchModel.QueryName,
                                        QueryCode: searchModel.QueryCode
                                    }}
                                    onFinish={(values) =>
                                        onSubmitSearchSave(values)
                                    }
                                >
                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="QueryName"
                                                label="T??n ch???c n??ng"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="QueryName" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="QueryCode"
                                                label="M?? ch???c n??ng"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="QueryCode" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col
                                            lg={{span: 24}}
                                            md={{span: 24}}
                                            sm={{span: 24}}
                                            xs={{span: 24}}
                                        >
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                T??m ki???m
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    const NextPage = (page, pageSize) => {
        const searchMd = {
            ...searchModel,
            PageIndex: page,
            PageSize: pageSize
        };
        onSubmitSearchSave(searchMd);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dataSelected = selectedRowKeys;
        }
    };
    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
        let pageInd = 1;
        let Count = 0;
        if (
            lstEntity !== undefined &&
            lstEntity != null &&
            lstEntity.ListItem !== undefined
        ) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
            Count = lstEntity.Count;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        const getMenu = (record) => (
            <>
                <Menu>
                    <Menu.Item
                        key={`sua_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={() => onEditEntity(record.Id)}
                    >
                        S???a
                    </Menu.Item>
                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        icon={<antIcon.DeleteOutlined />}
                        onClick={() => DeleteAction(record.Id)}
                    >
                        X??a
                    </Menu.Item>
                    <Menu.Item>
                        <Link
                            className="MauDen"
                            to={`/admin/Operation/${record.Id}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Qu???n l?? thao t??c</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </>
        );
        const columns = [
            {
                title: 'STT',
                key: 'STT',
                render: (text, record, index) => (
                    <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                )
            },
            {
                title: 'H??nh ?????ng',
                key: 'HanhDong',
                render: (text, record) => {
                    return (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getMenu(record)}
                        >
                            Chi ti???t
                        </Dropdown.Button>
                    );
                }
            },
            {
                title: 'M?? ch???c n??ng',
                key: 'MaChucNang',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Code}</div>
                    </>
                )
            },
            {
                title: 'T??n ch???c n??ng',
                key: 'TenChucNang',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Name}</div>
                    </>
                )
            },
            {
                title: 'Hi???n th???',
                key: 'HienThi',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>
                            {record.IsShow ? 'Hi???n th???' : 'Kh??ng hi???n th???'}
                        </div>
                    </>
                )
            },
            {
                title: 'Th??? t???',
                key: 'ThuTu',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Order}</div>
                    </>
                )
            }
        ];
        return (
            <>
                <EditModal />
                <DetailModal />
                <Table
                    id="dsTable"
                    rowKey="Id"
                    rowSelection={rowSelection}
                    columns={columns}
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
                />
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Qu???n l?? ch???c n??ng" />
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
                                            type="primary"
                                            onClick={() => ToggleSearchPanel()}
                                        >
                                            {showPanelSearch ? (
                                                <>
                                                    <i
                                                        className="fa fa-times"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; ????ng t??m ki???m
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; T??m ki???m
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="danger"
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            />{' '}
                                            &nbsp; X??a
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
        roleService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: MODULE_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        roleService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: MODULE_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        roleService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        roleService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        roleService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        roleService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        roleService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: MODULE_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.module.lstEntity,
    IsUpdate: state.module.IsUpdate,
    entityObj: state.module.entityObj,
    showDetailModal: state.module.showDetailModal,
    showEditModal: state.module.showEditModal,
    isInit: state.module.isInit,
    searchModel: state.module.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(ModuleAdm);
