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
                    <i className="fa fa-plus" aria-hidden="true" /> &nbsp; T???o
                    m???i
                </Button>

                <Modal
                    title="T???o m???i t???nh"
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
                                    label="M?? t???nh"
                                    name="MaTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="T??n T???nh/ Th??nh ph???"
                                    name="TenTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="Lo???i"
                                    name="Loai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng ch???n th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select name="Loai" initialvalues="">
                                        <Select.Option value="">
                                            --Ch???n--
                                        </Select.Option>
                                        <Select.Option value="T???nh">
                                            T???nh
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? trung ????ng">
                                            Th??nh ph??? trung ????ng
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
                    title="C???p nh???t t???nh"
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
                                    label="M?? t???nh"
                                    name="MaTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="T??n T???nh/ Th??nh ph???"
                                    name="TenTinh"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="Lo???i"
                                    name="Loai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng ch???n th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select name="Loai" initialvalues="">
                                        <Select.Option value="">
                                            --Ch???n--
                                        </Select.Option>
                                        <Select.Option value="T???nh">
                                            T???nh
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? trung ????ng">
                                            Th??nh ph??? trung ????ng
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
                        title="Th??ng tin chi ti???t"
                        placement="right"
                        size="large"
                        onClose={onCloseEntityModal}
                        visible={showDetailModal}
                        extra={
                            <Space>
                                <Button onClick={onCloseEntityModal}>
                                    ????ng
                                </Button>
                            </Space>
                        }
                    >
                        <Descriptions
                            title="Th??ng tin chi ti???t"
                            bordered
                            column={1}
                            size="middle"
                        >
                            <Descriptions.Item label="T??n T???nh/ Th??nh ph???">
                                {entityObj.TenTinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="M?? ????n v???">
                                {entityObj.MaTinh}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lo???i">
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
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? t???nh n??y.',
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
            title: 'X??c nh???n x??a c??c t???nh n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c t???nh n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dataSelected != null && dataSelected.length > 0) {
                            onDeleteMultiEntity(dataSelected);
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
                            <Card title="T??m ki???m">
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
                                                label="M?? ????n v???"
                                                name="MaTinhFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="T??n t???nh/ t.ph???"
                                                name="TenTinhFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Lo???i"
                                                name="LoaiFilter"
                                            >
                                                <Select placeholder="--T???t c???--">
                                                    <Option value="">
                                                        T???t c???
                                                    </Option>
                                                    <Option value="T???nh">
                                                        T???nh
                                                    </Option>
                                                    <Option value="Th??nh ph??? Trung ????ng">
                                                        Th??nh ph??? Trung ????ng
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
                        S???a
                    </Menu.Item>

                    <Menu.Item
                        key={`xoa_${record.Id}`}
                        onClick={() => DeleteAction(record.Id)}
                        icon={<antIcon.DeleteOutlined />}
                    >
                        X??a
                    </Menu.Item>
                    <Menu.Item key={`danhsachhuyen_${record.Id}`}>
                        <Link
                            className="MauDen"
                            to={`/admin/Huyen/${record.MaTinh}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Danh s??ch Qu???n/ Huy???n/ Th??? x??</span>
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
                    <Column
                        title="T??n T???nh/ Th??nh ph???"
                        dataIndex="TenTinh"
                        key="TenTinh"
                    />
                    <Column
                        title="M?? T???nh/ Th??nh ph???"
                        dataIndex="MaTinh"
                        key="MaTinh"
                    />
                    <Column title="Lo???i" dataIndex="Loai" key="Loai" />
                </Table>
            </>
        );
    };
    return (
        <>
            <AdminSecsionHead ModuleName="Danh s??ch T???nh/ Th??nh ph???" />
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
