/* eslint-disable react/jsx-wrap-multilines */
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as TINHService from '@app/services/TINHService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import * as antIcon from '@ant-design/icons';

import * as antd from 'antd';
import {
    TINH_CLOSE_VIEWDETAIL,
    TINH_CLOSE_VIEWEDIT,
    TINH_EDIT_CLOSE,
    TINH_SEARCH_SAVE
} from '@app/store/ActionType/TINHTypeAction';
import {Field, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {NotFoundImage} from '@modules/Common/NotFound';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';

const TINHAdm = (props) => {
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
        Modal,
        Card
    } = antd;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    const [form] = Form.useForm();
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
    let dataSelected;

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
                    title="Tạo mới tỉnh"
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
                                    label="Mã tỉnh"
                                    name="MaTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaTinh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tên Tỉnh/ Thành phố"
                                    name="TenTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenTinh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Loại"
                                    name="Loai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng chọn thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select name="Loai" initialvalues="">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        <Select.Option value="Tỉnh">
                                            Tỉnh
                                        </Select.Option>
                                        <Select.Option value="Thành phố trung ương">
                                            Thành phố trung ương
                                        </Select.Option>
                                    </Select>
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
                    title="Cập nhật tỉnh"
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
                            MaTinh: entityObj.MaTinh,
                            TenTinh: entityObj.TenTinh,
                            Loai: entityObj.Loai
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values
                            };
                            onSaveEditEntity(ObjSave);
                            // same shape as initial values
                        }}
                    >
                        <Form.Item name="Id" hidden>
                            <Input name="Id" />
                        </Form.Item>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Mã tỉnh"
                                    name="MaTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaTinh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tên Tỉnh/ Thành phố"
                                    name="TenTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenTinh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Loại"
                                    name="Loai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng chọn thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select name="Loai" initialvalues="">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        <Select.Option value="Tỉnh">
                                            Tỉnh
                                        </Select.Option>
                                        <Select.Option value="Thành phố trung ương">
                                            Thành phố trung ương
                                        </Select.Option>
                                    </Select>
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
                <>
                    <Drawer
                        title="Thông tin chi tiết"
                        placement="right"
                        size="large"
                        onClose={onCloseEntityModal}
                        visible={showDetailModal}
                        extra={
                            <Space>
                                <Button onClick={onCloseEntityModal}>
                                    Đóng
                                </Button>
                            </Space>
                        }
                    >
                        <Descriptions
                            title="Thông tin chi tiết"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item label="Tên Tỉnh/ Thành phố">
                                {entityObj.TenTinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn vị">
                                {entityObj.MaTinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại">
                                {entityObj.Loai}
                            </Descriptions.Item>
                        </Descriptions>
                    </Drawer>
                </>
            </>
        );
    }
    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ tỉnh này.',
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
            title: 'Xác nhận xóa các tỉnh này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các tỉnh này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
                        } else {
                            toast.onError('Vui lòng chọn ít nhất một bản ghi');
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
                                            message: 'Cảnh báo',
                                            description:
                                                'Vui lòng kiểm tra lại dữ liệu nhập'
                                        });
                                    }}
                                    autoComplete="off"
                                >
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Mã đơn vị"
                                                name="MaTinhFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Tên tỉnh/ t.phố"
                                                name="TenTinhFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Loại"
                                                name="LoaiFilter"
                                            >
                                                <Select placeholder="--Tất cả--">
                                                    <Option value="">
                                                        Tất cả
                                                    </Option>
                                                    <Option value="Tỉnh">
                                                        Tỉnh
                                                    </Option>
                                                    <Option value="Thành phố Trung ương">
                                                        Thành phố Trung ương
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
        }
    };
    const RenderPage = () => {
        const totalPage =
            lstEntity.TotalPage !== undefined ? lstEntity.TotalPage : 1;
        const curPage =
            lstEntity.CurrentPage !== undefined ? lstEntity.CurrentPage : 1;
        const reder = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < totalPage; i++) {
            let acClass = '';
            if (i + 1 === curPage) {
                acClass = 'active';
            }
            reder.push(
                <li className={`page-item ${acClass}`} key={i}>
                    <Button
                        className="page-link"
                        onClick={() => NextPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                </li>
            );
        }
        return reder;
    };

    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
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
                        }}
                        icon={<antIcon.EditOutlined />}
                    >
                        Sửa
                    </Menu.Item>

                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        onClick={() => DeleteAction(record.Id)}
                        icon={<antIcon.DeleteOutlined />}
                    >
                        Xóa
                    </Menu.Item>
                    <Menu.Item key={`danhsachhuyen_${record.Id}`}>
                        <Link
                            className="MauDen"
                            to={`/admin/Huyen/${record.MaTinh}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Danh sách Quận/ Huyện/ Thị xã</span>
                        </Link>
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
                        showTotal: (total) => `Tổng cộng ${total} bản ghi`,
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
                        title="Thao tác"
                        key="action"
                        render={(text, record) => (
                            <Dropdown.Button
                                onClick={() => onOpenDetailModal(record.Id)}
                                overlay={() => getmenu(record)}
                            >
                                Chi tiết
                            </Dropdown.Button>
                        )}
                    />
                    <Column
                        title="Tên Tỉnh/ Thành phố"
                        dataIndex="TenTinh"
                        key="TenTinh"
                    />
                    <Column
                        title="Mã Tỉnh/ Thành phố"
                        dataIndex="MaTinh"
                        key="MaTinh"
                    />
                    <Column title="Loại" dataIndex="Loai" key="Loai" />
                </Table>
            </>
        );
    };
    return (
        <>
            <AdminSecsionHead ModuleName="Danh sách Tỉnh/ Thành phố" />
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
                                <div className="card-body">
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
        TINHService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: TINH_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        TINHService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: TINH_CLOSE_VIEWDETAIL});
    },

    onCreateEntity: (tintuc) => {
        TINHService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        TINHService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        TINHService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        TINHService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        TINHService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: TINH_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.tinh.lstEntity,
    IsUpdate: state.tinh.IsUpdate,
    entityObj: state.tinh.entityObj,
    showDetailModal: state.tinh.showDetailModal,
    showEditModal: state.tinh.showEditModal,
    isInit: state.tinh.isInit,
    searchModel: state.tinh.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(TINHAdm);
