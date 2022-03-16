/* eslint-disable prefer-template */
/* eslint-disable react/jsx-wrap-multilines */
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as HUYENService from '@app/services/HUYENService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    HUYEN_CLOSE_VIEWDETAIL,
    HUYEN_CLOSE_VIEWEDIT,
    HUYEN_EDIT_CLOSE,
    HUYEN_SEARCH_SAVE
} from '@app/store/ActionType/HUYENTypeAction';
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
const HUYENAdm = (props) => {
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
    const {MaTinh} = useParams();
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
        searchModel,
        TinhInfo,
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
                    TinhId: MaTinh
                };
            }
            LoadPerrentInfo(MaTinh);
            LoadEntityData(objSearch, MaTinh);
        }
    });
    const SignupSchema = Yup.object().shape({
        TenHuyen: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        MaHuyen: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(10, 'Vui lòng nhập không quá 10 ký tự')
            .required('Vui lòng nhập thông tin này'),
        Loai: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        MaHuyenFilter: Yup.string(),
        TenHuyenFilter: Yup.string(),
        LoaiFilter: Yup.string()
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
                    title={'Tạo mới Quận/ Huyện của' + TinhInfo.TenTinh}
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
                            TenHuyen: '',
                            MaHuyen: '',
                            Loai: ''
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values,
                                TinhId: MaTinh
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
                                    name="MaHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaHuyen" />
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
                                    name="TenHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenHuyen" />
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
                                        <Select.Option value="Quận">
                                            Quận
                                        </Select.Option>
                                        <Select.Option value="Huyện">
                                            Huyện
                                        </Select.Option>
                                        <Select.Option value="Thành phố thuộc tỉnh">
                                            Thành phố thuộc tỉnh
                                        </Select.Option>
                                        <Select.Option value="Thị xã">
                                            Thị xã
                                        </Select.Option>
                                        <Select.Option value="Thành phố thuộc thành phố trực thuộc trung ương">
                                            Thành phố thuộc thành phố trực thuộc
                                            trung ương
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
                    title={'Cập nhật Quận/ Huyện của' + TinhInfo.TenTinh}
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
                            TinhId: entityObj.TinhId,
                            TenHuyen: entityObj.TenHuyen,
                            MaHuyen: entityObj.MaHuyen,
                            Loai: entityObj.Loai
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values,
                                TinhId: entityObj.TinhId
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
                                    name="MaHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="MaHuyen" />
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
                                    name="TenHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="TenHuyen" />
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
                                        <Select.Option value="Quận">
                                            Quận
                                        </Select.Option>
                                        <Select.Option value="Huyện">
                                            Huyện
                                        </Select.Option>
                                        <Select.Option value="Thành phố thuộc tỉnh">
                                            Thành phố thuộc tỉnh
                                        </Select.Option>
                                        <Select.Option value="Thị xã">
                                            Thị xã
                                        </Select.Option>
                                        <Select.Option value="Thành phố thuộc thành phố trực thuộc trung ương">
                                            Thành phố thuộc thành phố trực thuộc
                                            trung ương
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
                                {entityObj.TenHuyen}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn vị">
                                {entityObj.MaHuyen}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại">
                                {entityObj.Loai}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tỉnh/ T.phố quản lý">
                                {TinhInfo.TenTinh}
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
            message:
                'Bạn chắc chắn muốn xóa bỏ đơn vị hành chính trực thuộc tỉnh/ thành phố này.',
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
            title:
                'Xác nhận xóa các đơn vị hành chính trực thuộc tỉnh/ thành phố này?',
            message:
                'Bạn chắc chắn muốn xóa bỏ các đơn vị hành chính trực thuộc tỉnh/ thành phố này.',
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
                                                name="MaHuyenFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Tên đơn vị"
                                                name="TenHuyenFilter"
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
                                                    <Option value="Quận">
                                                        Quận
                                                    </Option>
                                                    <Option value="Huyện">
                                                        Huyện
                                                    </Option>
                                                    <Option value="Thành phố thuộc tỉnh">
                                                        Thành phố thuộc tỉnh
                                                    </Option>
                                                    <Option value="Thị Xã">
                                                        Thị Xã
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
                    <Menu.Item key={`xaphuong_${record.Id}`}>
                        <Link
                            className="MauDen"
                            to={`/admin/Xa/${record.MaHuyen}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Danh sách Xã/ Phường/ Thị trấn</span>
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
                        title="Mã đơn vị"
                        dataIndex="MaHuyen"
                        key="MaHuyen"
                    />
                    <Column
                        title="Tên đơn vị"
                        dataIndex="TenHuyen"
                        key="TenHuyen"
                    />
                    <Column title="Loại" dataIndex="Loai" key="Loai" />
                </Table>
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead
                ModuleName={`Danh sách Quận/ Huyện/ Thị xã ${TinhInfo.TenTinh}`}
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
                                                to="/admin/Tinh"
                                            >
                                                <span className="boxIcon">
                                                    <i className="fas fa-reply" />
                                                </span>
                                                &nbsp;
                                                <span>
                                                    Danh sách tỉnh/ thành phố
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
    LoadPerrentInfo: (MaTinh) => {
        HUYENService.LoadParrentInfo(dispatch, MaTinh);
    },
    LoadEntityData: (objSearch, MaTinh) => {
        HUYENService.LoadEntity(dispatch, objSearch, MaTinh);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: HUYEN_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        HUYENService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: HUYEN_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        HUYENService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        HUYENService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        HUYENService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        HUYENService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        HUYENService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: HUYEN_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.huyen.lstEntity,
    TinhInfo: state.huyen.TinhInfo,
    IsUpdate: state.huyen.IsUpdate,
    entityObj: state.huyen.entityObj,
    showDetailModal: state.huyen.showDetailModal,
    showEditModal: state.huyen.showEditModal,
    isInit: state.huyen.isInit,
    searchModel: state.huyen.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(HUYENAdm);
