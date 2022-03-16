/* eslint-disable prefer-template */
/* eslint-disable react/jsx-wrap-multilines */
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as XAService from '@app/services/XAService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    XA_CLOSE_VIEWDETAIL,
    XA_CLOSE_VIEWEDIT,
    XA_EDIT_CLOSE,
    XA_SEARCH_SAVE
} from '@app/store/ActionType/XATypeAction';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import * as antIcon from '@ant-design/icons';

import * as antd from 'antd';
import {Field, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory, useParams} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {NotFoundImage} from '@modules/Common/NotFound';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const XAAdm = (props) => {
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
        Card,
        Modal
    } = antd;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    const [form] = Form.useForm();
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {MaHuyen} = useParams();
    const {
        LoadEntityData,
        LoadPerrentInfo,
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
        HuyenInfo,
        searchModel,
        onSubmitSearchSave
    } = props;
    const [showPanelSearch, SetshowPanelSearch] = useState(false);
    let dataSelected;

    function ToggleSearchPanel() {
        SetshowPanelSearch(!showPanelSearch);
    }

    // const [Isloaded, SetIsloaded] = useState(false);

    useEffect(() => {
        // Update the document title using the browser API
        if (IsUpdate) {
            let objSearch = {
                ...searchModel
            };
            if (searchModel == null || searchModel === undefined) {
                objSearch = {
                    PageIndex: 1,
                    PageSize: 20,
                    HuyenId: MaHuyen
                };
            }
            LoadPerrentInfo(MaHuyen);
            LoadEntityData(objSearch, MaHuyen);
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
                    // eslint-disable-next-line prefer-template
                    title={
                        'Tạo mới Xã/ Phường/ Thị trấn của ' + HuyenInfo.TenTinh
                    }
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
                            MaXa: '',
                            TenXa: '',
                            Loai: ''
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values,
                                HuyenId: MaHuyen
                            };
                            // same shape as initial values

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
                                    label="Mã đơn vị"
                                    name="MaXa"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 10,
                                            message:
                                                'Vui lòng không nhập quá 10 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaXa" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tên đơn vị"
                                    name="TenXa"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng không nhập quá 255 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenXa" />
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
                                        <Select.Option value="Xã">
                                            Xã
                                        </Select.Option>
                                        <Select.Option value="Phường">
                                            Phường
                                        </Select.Option>
                                        <Select.Option value="Thị Trấn">
                                            Thị Trấn
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
                    title={
                        'Cập nhật Xã/ Phường/ Thị trấn của ' + HuyenInfo.TenTinh
                    }
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
                            HuyenId: entityObj.HuyenId,
                            MaXa: entityObj.MaXa,
                            TenXa: entityObj.TenXa,
                            Loai: entityObj.Loai
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values,
                                HuyenId: entityObj.HuyenId
                            };
                            // same shape as initial values

                            onSaveEditEntity(ObjSave);
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
                                    label="Mã đơn vị"
                                    name="MaXa"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 10,
                                            message:
                                                'Vui lòng không nhập quá 10 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaXa" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tên đơn vị"
                                    name="TenXa"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng không nhập quá 255 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenXa" />
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
                                        <Select.Option value="Xã">
                                            Xã
                                        </Select.Option>
                                        <Select.Option value="Phường">
                                            Phường
                                        </Select.Option>
                                        <Select.Option value="Thị Trấn">
                                            Thị Trấn
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
                            <Descriptions.Item label="Tên đơn vị">
                                {entityObj.TenXa}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn vị">
                                {entityObj.MaXa}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại">
                                {entityObj.Loai}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quận/ huyện quản lý">
                                {HuyenInfo.TenHuyen}
                            </Descriptions.Item>
                        </Descriptions>
                    </Drawer>
                </>
                <>
                    {/* <Modal
                        show={showDetailModal}
                        size="lg"
                        onHide={() => onCloseEntityModal()}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết danh mục</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Tên danh mục
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.Name}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Mã danh mục
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.Code}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">Thứ tự</dt>
                                        <dd className="col-sm-10">
                                            {entityObj.Priority}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => onCloseEntityModal()}
                            >
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal> */}
                </>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ danh mục này.',
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
            title: 'Xác nhận xóa các danh mục này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các danh mục này.',
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
                                                name="MaXaFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Tên đơn vị"
                                                name="TenXaFilter"
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
                                                    <Option value="Xã">
                                                        Xã
                                                    </Option>
                                                    <Option value="Phường">
                                                        Phường
                                                    </Option>
                                                    <Option value="Thị trấn">
                                                        Thị trấn
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
                    <Column title="Mã đơn vị" dataIndex="MaXa" key="MaXa" />
                    <Column title="Tên đơn vị" dataIndex="TenXa" key="TenXa" />
                    <Column title="Loại" dataIndex="Loai" key="Loai" />
                </Table>
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead
                ModuleName={`Danh sách Xã/ Phường/ Thị trấn ${HuyenInfo.TenHuyen}`}
            />
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
                                        <Button type="primary">
                                            <Link
                                                className="MauDen"
                                                to={`/admin/Huyen/${HuyenInfo.TinhId}`}
                                            >
                                                <span className="boxIcon">
                                                    <i className="fas fa-reply" />
                                                </span>
                                                <span>
                                                    Danh sách Quận/ Huyện
                                                </span>
                                            </Link>
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
    LoadPerrentInfo: (MaHuyen) => {
        XAService.LoadParrentInfo(dispatch, MaHuyen);
    },
    LoadEntityData: (objSearch, MaHuyen) => {
        XAService.LoadEntity(dispatch, objSearch, MaHuyen);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: XA_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        XAService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: XA_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        XAService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        XAService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        XAService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        XAService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        XAService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: XA_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.xa.lstEntity,
    HuyenInfo: state.xa.HuyenInfo,
    IsUpdate: state.xa.IsUpdate,
    entityObj: state.xa.entityObj,
    showDetailModal: state.xa.showDetailModal,
    showEditModal: state.xa.showEditModal,
    isInit: state.xa.isInit,
    searchModel: state.xa.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(XAAdm);
