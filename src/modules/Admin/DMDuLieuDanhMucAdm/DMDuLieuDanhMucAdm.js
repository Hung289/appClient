import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as duLieuDanhMucService from '@app/services/duLieuDanhMucService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    DMDULIEUDANHMUC_CLOSE_VIEWDETAIL,
    DMDULIEUDANHMUC_CLOSE_VIEWEDIT,
    DMDULIEUDANHMUC_EDIT_CLOSE,
    DMDULIEUDANHMUC_SEARCH_SAVE
} from '@app/store/ActionType/DMDuLieuDanhMucAction';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
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
    Modal
} from 'antd';
import moment from 'moment';
import * as antIcon from '@ant-design/icons';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DMDuLieuDanhMucAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {idNhom} = useParams();
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
                    GroupId: idNhom
                };
            }
            LoadEntityData(objSearch, idNhom);
        }
    });
    let dataSelected;
    const SignupSchema = Yup.object().shape({
        Name: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        Code: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
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
                    title="Th??m m???i"
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
                            Code: '',
                            Note: '',
                            Priority: 0
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values,
                                GroupId: idNhom
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
                                    label="M??"
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
                                <Form.Item
                                    label="T??n"
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
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Note" label="Ghi ch??">
                                    <Input.TextArea name="Note" rows={4} />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Priority" label="Th??? t???">
                                    <Input name="Priority" rows={4} />
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
                    title="C???p nh???t danh m???c"
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
                        innerRef={formRef}
                        initialValues={{
                            Id: entityObj.Id,
                            GroupId: entityObj.GroupId,
                            Name: entityObj.Name,
                            Code: entityObj.Code,
                            Note: entityObj.Note,
                            Priority: entityObj.Priority
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values,
                                GroupId: entityObj.GroupId
                            };
                            // same shape as initial values

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
                                    label="M??"
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
                                <Form.Item
                                    label="T??n"
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
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Note" label="Ghi ch??">
                                    <Input.TextArea name="Note" rows={4} />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Priority" label="Th??? t???">
                                    <Input name="Priority" rows={4} />
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
                    <Descriptions title="Chi ti???t banner" bordered column={1}>
                        <Descriptions.Item label="T??n danh m???c">
                            {entityObj.Name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Code">
                            {entityObj.Code}
                        </Descriptions.Item>
                        <Descriptions.Item label="Code">
                            {entityObj.Priority}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? danh m???c n??y.',
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
            title: 'X??c nh???n x??a c??c danh m???c n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c danh m???c n??y.',
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
                                                label="T??n"
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
                                                label="Code"
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
                title: 'M??',
                key: 'Ma',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Code}</div>
                    </>
                )
            },
            {
                title: 'T??n',
                key: 'Ten',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Name}</div>
                    </>
                )
            },
            {
                title: 'S???p x???p',
                key: 'Sapxep',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Priority}</div>
                    </>
                )
            },
            {
                title: 'Ghi ch??',
                key: 'GhiChu',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Note}</div>
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
            <AdminSecsionHead ModuleName="Qu???n l?? d??? li???u danh m???c" />
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
                                        <Button type="primary">
                                            <Link
                                                className="MauDen"
                                                to="/admin/DMNhom"
                                            >
                                                <span className="boxIcon">
                                                    <i className="fas fa-reply" />
                                                </span>
                                                &nbsp;
                                                <span>
                                                    Quay l???i nh??m danh m???c
                                                </span>
                                            </Link>
                                        </Button>
                                    </Space>
                                </div>
                                <div className=" nopadding">
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
    LoadEntityData: (objSearch, idnhom) => {
        duLieuDanhMucService.LoadEntity(dispatch, objSearch, idnhom);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: DMDULIEUDANHMUC_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        duLieuDanhMucService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: DMDULIEUDANHMUC_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        duLieuDanhMucService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        duLieuDanhMucService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        duLieuDanhMucService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        duLieuDanhMucService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        duLieuDanhMucService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: DMDULIEUDANHMUC_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dulieudanhmuc.lstEntity,
    IsUpdate: state.dulieudanhmuc.IsUpdate,
    entityObj: state.dulieudanhmuc.entityObj,
    showDetailModal: state.dulieudanhmuc.showDetailModal,
    showEditModal: state.dulieudanhmuc.showEditModal,
    isInit: state.dulieudanhmuc.isInit,
    searchModel: state.dulieudanhmuc.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(DMDuLieuDanhMucAdm);
