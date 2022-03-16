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
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test(
                'lxxen',
                'Tên chức năng chỉ được sử dụng chữ cái và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z0-9 ]*$/.test(str);
                }
            ),
        Code: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .required('Vui lòng nhập thông tin này'),
        Order: Yup.string().trim().required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        QueryName: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        QueryCode: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
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
                    <i className="fa fa-plus" aria-hidden="true" /> &nbsp; Tạo
                    mới
                </Button>

                <Modal
                    title="Tạo mới chức năng"
                    centered
                    visible={show}
                    onOk={() => submitCreate()}
                    onCancel={() => handleClose()}
                    width={1000}
                    zIndex={1040}
                    okText="Hoàn thành"
                    cancelText="Đóng"
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
                                    label="Tên chức năng"
                                    name="Name"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                                    'Tên chức năng chỉ được sử dụng chữ cái và số'
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
                                    label="Mã chức năng"
                                    name="Code"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                <Form.Item label="Thứ tự" name="Order">
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
                                    <Checkbox name="IsShow">Hiển thị?</Checkbox>
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
                    title="Cập nhật chức năng"
                    centered
                    visible={showEditModal}
                    onOk={() => submitEdit()}
                    onCancel={() => onCloseEntityEditModal()}
                    width={1000}
                    zIndex={1040}
                    okText="Hoàn thành"
                    cancelText="Đóng"
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
                                    label="Tên chức năng"
                                    name="Name"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Mã chức năng"
                                    name="Code"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                <Form.Item label="Thứ tự" name="Order">
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
                                Đóng
                            </Button>
                        </Space>
                    }
                >
                    <Descriptions
                        title="Chi tiết chức năng"
                        bordered
                        column={2}
                    >
                        <Descriptions.Item label="Tên chức năng">
                            {entityObj.Name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã chức năng">
                            {entityObj.Code}
                        </Descriptions.Item>
                        <Descriptions.Item label="Font Awesome Class">
                            {entityObj.ClassCss}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thứ tự">
                            {entityObj.Order}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hiển thị">
                            {entityObj.IsShow ? 'Hiển thị' : 'Không hiển thị'}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ chức năng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onDeleteEntity(id);
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };
    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'Xác nhận xóa các chức năng này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các chức năng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
                        } else {
                            toast.error('Vui lòng chọn ít nhất một bản ghi');
                        }
                    }
                },
                {
                    label: 'Đóng',
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
                            <Card title="Tìm kiếm">
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
                                                label="Tên chức năng"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 kí tự'
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
                                                label="Mã chức năng"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 kí tự'
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
                                                Tìm kiếm
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
                        Sửa
                    </Menu.Item>
                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        icon={<antIcon.DeleteOutlined />}
                        onClick={() => DeleteAction(record.Id)}
                    >
                        Xóa
                    </Menu.Item>
                    <Menu.Item>
                        <Link
                            className="MauDen"
                            to={`/admin/Operation/${record.Id}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Quản lý thao tác</span>
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
                title: 'Hành động',
                key: 'HanhDong',
                render: (text, record) => {
                    return (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            overlay={() => getMenu(record)}
                        >
                            Chi tiết
                        </Dropdown.Button>
                    );
                }
            },
            {
                title: 'Mã chức năng',
                key: 'MaChucNang',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Code}</div>
                    </>
                )
            },
            {
                title: 'Tên chức năng',
                key: 'TenChucNang',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Name}</div>
                    </>
                )
            },
            {
                title: 'Hiển thị',
                key: 'HienThi',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>
                            {record.IsShow ? 'Hiển thị' : 'Không hiển thị'}
                        </div>
                    </>
                )
            },
            {
                title: 'Thứ tự',
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
                        showTotal: (total) => `Tổng cộng ${total} bản ghi`,
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
            <AdminSecsionHead ModuleName="Quản lý chức năng" />
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
                                                    &nbsp; Đóng tìm kiếm
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; Tìm kiếm
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
                                            &nbsp; Xóa
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
