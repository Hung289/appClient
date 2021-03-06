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
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        MaHuyen: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(10, 'Vui l??ng nh???p kh??ng qu?? 10 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        Loai: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
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
                    <i className="fa fa-plus" aria-hidden="true" /> &nbsp; T???o
                    m???i
                </Button>

                <Modal
                    // eslint-disable-next-line prefer-template
                    title={'T???o m???i Qu???n/ Huy???n c???a' + TinhInfo.TenTinh}
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
                                    label="M?? ????n v???"
                                    name="MaHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="T??n ????n v???"
                                    name="TenHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                        <Select.Option value="Qu???n">
                                            Qu???n
                                        </Select.Option>
                                        <Select.Option value="Huy???n">
                                            Huy???n
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? thu???c t???nh">
                                            Th??nh ph??? thu???c t???nh
                                        </Select.Option>
                                        <Select.Option value="Th??? x??">
                                            Th??? x??
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? thu???c th??nh ph??? tr???c thu???c trung ????ng">
                                            Th??nh ph??? thu???c th??nh ph??? tr???c thu???c
                                            trung ????ng
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
                    title={'C???p nh???t Qu???n/ Huy???n c???a' + TinhInfo.TenTinh}
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
                                    label="M?? ????n v???"
                                    name="MaHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                    label="T??n ????n v???"
                                    name="TenHuyen"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
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
                                        <Select.Option value="Qu???n">
                                            Qu???n
                                        </Select.Option>
                                        <Select.Option value="Huy???n">
                                            Huy???n
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? thu???c t???nh">
                                            Th??nh ph??? thu???c t???nh
                                        </Select.Option>
                                        <Select.Option value="Th??? x??">
                                            Th??? x??
                                        </Select.Option>
                                        <Select.Option value="Th??nh ph??? thu???c th??nh ph??? tr???c thu???c trung ????ng">
                                            Th??nh ph??? thu???c th??nh ph??? tr???c thu???c
                                            trung ????ng
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
                            <Descriptions.Item label="T??n ????n v???">
                                {entityObj.TenHuyen}
                            </Descriptions.Item>
                            <Descriptions.Item label="M?? ????n v???">
                                {entityObj.MaHuyen}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lo???i">
                                {entityObj.Loai}
                            </Descriptions.Item>
                            <Descriptions.Item label="T???nh/ T.ph??? qu???n l??">
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
            title: 'X??c nh???n x??a?',
            message:
                'B???n ch???c ch???n mu???n x??a b??? ????n v??? h??nh ch??nh tr???c thu???c t???nh/ th??nh ph??? n??y.',
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
            title:
                'X??c nh???n x??a c??c ????n v??? h??nh ch??nh tr???c thu???c t???nh/ th??nh ph??? n??y?',
            message:
                'B???n ch???c ch???n mu???n x??a b??? c??c ????n v??? h??nh ch??nh tr???c thu???c t???nh/ th??nh ph??? n??y.',
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
                                                name="MaHuyenFilter"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="T??n ????n v???"
                                                name="TenHuyenFilter"
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
                                                    <Option value="Qu???n">
                                                        Qu???n
                                                    </Option>
                                                    <Option value="Huy???n">
                                                        Huy???n
                                                    </Option>
                                                    <Option value="Th??nh ph??? thu???c t???nh">
                                                        Th??nh ph??? thu???c t???nh
                                                    </Option>
                                                    <Option value="Th??? X??">
                                                        Th??? X??
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
                    <Menu.Item key={`xaphuong_${record.Id}`}>
                        <Link
                            className="MauDen"
                            to={`/admin/Xa/${record.MaHuyen}`}
                        >
                            <span className="boxIcon">
                                <i className="fas fa-info-circle" />
                            </span>
                            <span>Danh s??ch X??/ Ph?????ng/ Th??? tr???n</span>
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
                        title="M?? ????n v???"
                        dataIndex="MaHuyen"
                        key="MaHuyen"
                    />
                    <Column
                        title="T??n ????n v???"
                        dataIndex="TenHuyen"
                        key="TenHuyen"
                    />
                    <Column title="Lo???i" dataIndex="Loai" key="Loai" />
                </Table>
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead
                ModuleName={`Danh s??ch Qu???n/ Huy???n/ Th??? x?? ${TinhInfo.TenTinh}`}
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
                                                to="/admin/Tinh"
                                            >
                                                <span className="boxIcon">
                                                    <i className="fas fa-reply" />
                                                </span>
                                                &nbsp;
                                                <span>
                                                    Danh s??ch t???nh/ th??nh ph???
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
