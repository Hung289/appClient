import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import axios from 'axios';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import * as hoiDapService from '@app/services/HoiDapService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    HOIDAP_CLOSE_VIEWDETAIL,
    HOIDAP_CLOSE_VIEWEDIT,
    HOIDAP_EDIT_CLOSE,
    HOIDAP_SEARCH_SAVE
} from '@app/store/ActionType/HoiDapTypeAction';
import {
    Modal,
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
    Checkbox
} from 'antd';
import * as antIcon from '@ant-design/icons';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const HoiDapAdm = (props) => {
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
    console.log(props);
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
                    PageSize: 20
                };
            }
            LoadEntityData(objSearch);
        }
    });
    let dataSelected;
    const [test, settest] = useState(true);

    function CreateModal() {
        const [createEditor, setCreateEditor] = useState('');
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
                    <i className="fa fa-plus" aria-hidden="true" />
                    &nbsp; T???o m???i
                </Button>

                <Modal
                    title="Th??m m???i h???i ????p"
                    centered
                    visible={show}
                    onOk={() => submitCreate()}
                    onCancel={handleClose}
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
                            hoTen: '',
                            dienThoai: '',
                            email: '',
                            donVi: '',
                            noiDungCauHoi: '',
                            traLoiCauHoi: '',
                            isPhatHanh: false
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values,
                                traLoiCauHoi: createEditor
                            };
                            // same shape as initial values

                            onCreateEntity(ObjSave);
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="C??u h???i"
                                    name="noiDungCauHoi"
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
                                    <Input.TextArea
                                        rows={4}
                                        name="noiDungCauHoi"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Tr??? l???i" name="traLoiCauHoi">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        name="traLoiCauHoi"
                                        data=""
                                        onReady={(editor) => {
                                            setCreateEditor(editor.getData());
                                        }}
                                        onChange={(event, editor) => {
                                            setCreateEditor(editor.getData());
                                        }}
                                        onBlur={(event, editor) => {
                                            setCreateEditor(editor.getData());
                                        }}
                                        onFocus={(event, editor) => {
                                            setCreateEditor(editor.getData());
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="H??? t??n" name="hoTen">
                                    <Input name="hoTen" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="??i???n tho???i" name="dienThoai">
                                    <Input name="dienThoai" />
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
                                <Form.Item label="Email" name="email">
                                    <Input name="email" />
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
                                <Form.Item name="isPhatHanh">
                                    <Checkbox name="isPhatHanh">
                                        Xu???t b???n?
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
    function EditModal() {
        const [EditEditor, setEditEditor] = useState('');
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.submit();
            }
        };
        return (
            <>
                <Modal
                    title="C???p nh???t h???i ????p"
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
                            id: entityObj.Id,
                            hoTen: entityObj.HoTen,
                            dienThoai: entityObj.DienThoai,
                            email: entityObj.Email,
                            donVi: entityObj.DonVi,
                            noiDungCauHoi: entityObj.NoiDungCauHoi,
                            traLoiCauHoi: entityObj.TraLoiCauHoi,
                            isPhatHanh: entityObj.IsPhatHanh
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values,
                                traLoiCauHoi: EditEditor
                            };
                            // same shape as initial values
                            onSaveEditEntity(ObjSave);
                        }}
                    >
                        <Form.Item name="id" hidden>
                            <Input name="id" />
                        </Form.Item>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="C??u h???i"
                                    name="noiDungCauHoi"
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
                                    <Input.TextArea
                                        rows={4}
                                        name="noiDungCauHoi"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Tr??? l???i" name="traLoiCauHoi">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        name="traLoiCauHoi"
                                        data=""
                                        onReady={(editor) => {
                                            setEditEditor(editor.getData());
                                        }}
                                        onChange={(event, editor) => {
                                            setEditEditor(editor.getData());
                                        }}
                                        onBlur={(event, editor) => {
                                            setEditEditor(editor.getData());
                                        }}
                                        onFocus={(event, editor) => {
                                            setEditEditor(editor.getData());
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="H??? t??n" name="hoTen">
                                    <Input name="hoTen" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="??i???n tho???i" name="dienThoai">
                                    <Input name="dienThoai" />
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
                                <Form.Item label="Email" name="email">
                                    <Input name="email" />
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
                                <Form.Item
                                    name="isPhatHanh"
                                    valuePropName="checked"
                                >
                                    <Checkbox name="isPhatHanh">
                                        Xu???t b???n?
                                    </Checkbox>
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
                    <Descriptions title="Chi ti???t h???i ????p" bordered column={2}>
                        <Descriptions.Item label="H??? t??n">
                            {entityObj.HoTen}
                        </Descriptions.Item>
                        <Descriptions.Item label="??i???n tho???i">
                            {entityObj.DienThoai}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {entityObj.Email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Xu???t b???n">
                            {entityObj.IsPhatHanh
                                ? '???? xu???t b???n'
                                : 'Ch??a xu???t b???n'}
                        </Descriptions.Item>
                        <Descriptions.Item label="C??u h???i" span={2}>
                            {entityObj.NoiDungCauHoi}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tr??? l???i" span={2}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: entityObj.TraLoiCauHoi
                                }}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? h???i ????p n??y.',
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
            title: 'X??c nh???n x??a c??c h???i ????p n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c h???i ????p n??y.',
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
                <div className="container-fluid  mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card title="T??m ki???m">
                                <Form
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    layout="vertical"
                                    initialValues={{
                                        NoiDungCauHoiFilter:
                                            searchModel.NoiDungCauHoiFilter,
                                        DienThoaiFilter:
                                            searchModel.DienThoaiFilter,
                                        HoTenFilter: searchModel.HoTenFilter,
                                        EmailFilter: searchModel.EmailFilter,
                                        IsPhatHanhFilter:
                                            searchModel.IsPhatHanhFilter
                                    }}
                                    onFinish={(values) =>
                                        onSubmitSearchSave(values)
                                    }
                                >
                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="NoiDungCauHoiFilter"
                                                label="C??u h???i"
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
                                                <Input name="NoiDungCauHoiFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="HoTenFilter"
                                                label="H??? t??n"
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
                                                <Input name="HoTenFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="DienThoaiFilter"
                                                label="??i???n tho???i"
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
                                                <Input name="DienThoaiFilter" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="EmailFilter"
                                                label="Email"
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
                                                <Input name="EmailFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="IsPhatHanhFilter"
                                                label="Xu???t b???n"
                                            >
                                                <Select defaultValue="">
                                                    <Select.Option value="">
                                                        --Ch???n--
                                                    </Select.Option>
                                                    <Select.Option value="On">
                                                        C??
                                                    </Select.Option>
                                                    <Select.Option value="Off">
                                                        Kh??ng
                                                    </Select.Option>
                                                </Select>
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
        console.log(lstEntity);
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
                title: 'C??u h???i',
                key: 'CauHoi',
                render: (text, record, index) => (
                    <div>{record.NoiDungCauHoi}</div>
                )
            },
            {
                title: 'Xu???t b???n',
                key: 'XuatBan',
                render: (text, record, index) =>
                    record.IsPhatHanh ? (
                        <i className="fas fa-check" />
                    ) : (
                        <i className="fas fa-times" />
                    )
            },
            {
                title: 'H??? t??n',
                key: 'HoTen',
                render: (text, record, index) => <div>{record.HoTen}</div>
            },
            {
                title: '??i???n tho???i',
                key: 'DienThoai',
                render: (text, record, index) => <div>{record.DienThoai}</div>
            },
            {
                title: 'Email',
                key: 'email',
                render: (text, record, index) => <div>{record.Email}</div>
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
            <AdminSecsionHead ModuleName="Qu???n l?? h???i ????p" />
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
        hoiDapService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: HOIDAP_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        hoiDapService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: HOIDAP_CLOSE_VIEWDETAIL});
    },
    // LoadEntityData: () => {
    //     fetch('http://192.168.1.21:8603/api/ManageTinTuc/GetData')
    //         .then((response) => response.json())
    //         .then((json) => {
    //             dispatch({
    //                 type: ActionTypes.LOAD_TINTUC,
    //                 allData: json.Data
    //             });
    //         });
    // },
    onCreateEntity: (tintuc) => {
        hoiDapService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        hoiDapService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        hoiDapService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        hoiDapService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        hoiDapService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: HOIDAP_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.hoidap.lstEntity,
    IsUpdate: state.hoidap.IsUpdate,
    entityObj: state.hoidap.entityObj,
    showDetailModal: state.hoidap.showDetailModal,
    showEditModal: state.hoidap.showEditModal,
    isInit: state.hoidap.isInit,
    searchModel: state.hoidap.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(HoiDapAdm);
