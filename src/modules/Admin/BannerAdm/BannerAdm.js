import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as bannerService from '@app/services/bannerService';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    BANNER_CLOSE_VIEWDETAIL,
    BANNER_CLOSE_VIEWEDIT,
    BANNER_EDIT_CLOSE,
    BANNER_SEARCH_SAVE
} from '@app/store/ActionType/BannerTypeAction';
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
const BannerAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
    let FileSelected = useRef();

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
                    PageSize: 20
                };
            }
            LoadEntityData(objSearch);
        }
    });
    let dataSelected;
    async function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        console.log(Arr);
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(Arr[0]);
        });
        if (Arr[0] !== undefined) {
            FileSelected = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('ImageSrcShow');

            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('ImageSrcShow');
            image.src =
                'https://cidrapbusiness.org/wp-content/uploads/2017/10/noimage.gif';
            FileSelected = {current: null};
        }
    }

    function SaveAnh() {
        const fd = new FormData();

        fd.append('files', FileSelected, FileSelected.fileName);
        const dataAPI = axios
            .post(`${Constant.PathServer}/api/Banners/PostImage`, fd, {
                onUploadProgress: (ProgressEvent) => {
                    // console.log(
                    //     `Upload Progress: ${Math.round(
                    //         (ProgressEvent.loaded / ProgressEvent.total) * 100
                    //     )} %
                    //             `
                    // );
                }
            })
            .then((res) => {
                return res.data;
            })
            .catch((ex) => {
                toast.error('L???i l??u ???nh');
            });
        return dataAPI;
    }

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
                    <i className="fa fa-plus" aria-hidden="true" />
                    T???o m???i
                </Button>

                <Modal
                    title="Th??m m???i banner"
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
                            Name: '',
                            IsVisible: true,
                            Order: 0,
                            ImageLink: '',
                            IsLinkActive: true,
                            Comment: ''
                        }}
                        onFinish={(values) => {
                            const ObjSave = {
                                ...values
                            };
                            // same shape as initial values
                            if (
                                FileSelected !== undefined &&
                                FileSelected.data
                            ) {
                                SaveAnh()
                                    .then((dataResult) => {
                                        if (dataResult.Status) {
                                            ObjSave.ImageSrc = dataResult.Data;
                                            onCreateEntity(ObjSave);
                                        } else {
                                            toast.error(
                                                dataResult.MessageError
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        toast.error('L???i k???t n???i');
                                    });
                            } else {
                                onCreateEntity(ObjSave);
                            }
                            FileSelected = null;
                        }}
                    >
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="???nh Banner" name="ImageSrc">
                                    <Input
                                        type="file"
                                        name="ImageSrc"
                                        key="ImageSrc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <img
                                    style={{width: '120px', height: '80px'}}
                                    id="ImageSrcShow"
                                    alt=""
                                />
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
                                    label="T??n Banner"
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
                                                'Vui l??ng kh??ng nh???p qu?? 255 k?? t???'
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
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="M?? t???"
                                    name="Comment"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input.TextArea name="Comment" rows={4} />
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
                                <Form.Item name="ImageLink" label="Li??n k???t">
                                    <Input name="ImageLink" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Order" label="Th??? t???">
                                    <Input name="Order" />
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
                                <Form.Item name="IsVisible">
                                    <Checkbox name="IsVisible">
                                        Hi???n th????
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="IsLinkActive">
                                    <Checkbox name="IsLinkActive">
                                        Ho???t ?????ng?
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
                            Id: entityObj.Id,
                            Name: entityObj.Name,
                            // ImageSrc: entityObj.ImageSrc,
                            IsVisible: entityObj.IsVisible,
                            Order: entityObj.Order,
                            ImageLink: entityObj.ImageLink,
                            IsLinkActive: entityObj.IsLinkActive,
                            Comment: entityObj.Comment
                        }}
                        onFinish={(values) => {
                            // same shape as initial values
                            const ObjSave = {
                                ...values,
                                ImageSrc: entityObj.ImageSrc
                            };
                            // same shape as initial values
                            if (FileSelected !== null && FileSelected.data) {
                                SaveAnh()
                                    .then((dataResult) => {
                                        if (dataResult.Status) {
                                            ObjSave.ImageSrc = dataResult.Data;
                                            console.log(ObjSave.ImageSrc);
                                            onSaveEditEntity(ObjSave);
                                        } else {
                                            toast.error(
                                                dataResult.MessageError
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        toast.error('L???i k???t n???i');
                                    });
                            } else {
                                ObjSave.ImageSrc = entityObj.ImageSrc;
                                onSaveEditEntity(ObjSave);
                            }
                            FileSelected = null;
                        }}
                    >
                        <Form.Item name="Id" hidden>
                            <Input name="Id" />
                        </Form.Item>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="???nh Banner" name="ImageSrc">
                                    <Input
                                        type="file"
                                        name="ImageSrc"
                                        key="ImageSrc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="???nh Banner m???i">
                                    <img
                                        className="img-ImageSrc"
                                        id="ImageSrcShow"
                                        alt=""
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="???nh Banner c??">
                                    {entityObj.ImageSrc !== '' ? (
                                        <>
                                            <img
                                                src={`${Constant.PathServer}${entityObj.ImageSrc}`}
                                                onError={NotFoundImage}
                                                alt=""
                                                className=" img-ImageSrc"
                                            />
                                        </>
                                    ) : (
                                        <></>
                                    )}
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
                                    label="T??n Banner"
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
                                                'Vui l??ng kh??ng nh???p qu?? 255 k?? t???'
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
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="M?? t???"
                                    name="Comment"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input.TextArea name="Comment" rows={4} />
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
                                <Form.Item name="ImageLink" label="Li??n k???t">
                                    <Input name="ImageLink" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item name="Order" label="Th??? t???">
                                    <Input name="Order" />
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
                                    name="IsVisible"
                                    valuePropName="checked"
                                >
                                    <Checkbox name="IsVisible">
                                        Hi???n th????
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="IsLinkActive"
                                    valuePropName="checked"
                                >
                                    <Checkbox name="IsLinkActive">
                                        Ho???t ?????ng?
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
                    <Descriptions title="Chi ti???t banner" bordered column={2}>
                        <Descriptions.Item label="???nh ?????i di???n" span={2}>
                            {entityObj.ImageSrc !== '' ? (
                                <>
                                    <img
                                        stype={{width: '800px', height: 'auto'}}
                                        src={`${Constant.PathServer}${entityObj.ImageSrc}`}
                                        alt=""
                                        className="imgHinhAnh img-thumbnail"
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="T??n">
                            {entityObj.Name}
                        </Descriptions.Item>
                        <Descriptions.Item label="M?? t???">
                            {entityObj.Comment}
                        </Descriptions.Item>
                        <Descriptions.Item label="???????ng ?????n">
                            {entityObj.ImageLink}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ho???t ?????ng">
                            {entityObj.IsLinkActive
                                ? '???? xu???t b???n'
                                : 'Ch??a xu???t b???n'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hi???n th???">
                            {entityObj.IsVisible
                                ? '???? xu???t b???n'
                                : 'Ch??a xu???t b???n'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Th??? t???">
                            {entityObj.Order}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? Banner n??y.',
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
            title: 'X??c nh???n x??a c??c banner n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c Banner n??y.',
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
                                        NameFilter: searchModel.NameFilter,
                                        CommentFilter:
                                            searchModel.CommentFilter,
                                        ImageLinkFilter:
                                            searchModel.ImageLinkFilter,
                                        IsVisibleFilter:
                                            searchModel.IsVisibleFilter,
                                        IsLinkActiveFilter:
                                            searchModel.IsLinkActiveFilter
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
                                                name="NameFilter"
                                                label="T??n Banner"
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
                                                <Input name="NameFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="CommentFilter"
                                                label="M?? t???"
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
                                                <Input name="CommentFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 8}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="ImageLinkFilter"
                                                label="???????ng d???n"
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
                                                <Input name="ImageLinkFilter" />
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
                                                name="IsLinkActiveFilter"
                                                label="Ho???t ?????ng"
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

                                        <Col
                                            lg={{span: 12}}
                                            md={{span: 12}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="IsVisibleFilter"
                                                label="Hi???n th???"
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
            console.log(dataSelected);
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
                title: '???nh Banner',
                key: 'AnhBanner',
                render: (text, record, index) =>
                    record.ImageSrc !== '' ? (
                        <>
                            <img
                                src={`${Constant.PathServer}${record.ImageSrc}`}
                                onError={NotFoundImage}
                                alt=""
                                className="imgHinhAnh-Banner img-thumbnail"
                            />
                        </>
                    ) : (
                        <></>
                    )
            },
            {
                title: 'T??n banner',
                key: 'TenBanner',
                render: (text, record, index) => <div>{record.Name}</div>
            },
            {
                title: 'M?? t???',
                key: 'Mota',
                render: (text, record, index) => <div>{record.Comment}</div>
            },
            {
                title: '???????ng d???n',
                key: 'DuongDan',
                render: (text, record, index) => <div>{record.ImageLink}</div>
            },
            {
                title: 'Ho???t ?????ng',
                key: 'HoatDong',
                render: (text, record, index) => {
                    return record.IsLinkActive ? (
                        <i className="fas fa-check" />
                    ) : (
                        <i className="fas fa-times" />
                    );
                }
            },
            {
                title: 'Hi???n th???',
                key: 'HienThi',
                render: (text, record, index) => {
                    return record.IsVisible ? (
                        <i className="fas fa-check" />
                    ) : (
                        <i className="fas fa-times" />
                    );
                }
            },
            {
                title: 'Th??? t???',
                key: 'ThuTu',
                render: (text, record, index) => <div>{record.Order}</div>
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
            <AdminSecsionHead ModuleName="Qu???n l?? Banner" />
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
                                            type="danger"
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            />{' '}
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
        bannerService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: BANNER_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        bannerService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: BANNER_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        bannerService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        bannerService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        bannerService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        bannerService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        bannerService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: BANNER_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.banner.lstEntity,
    IsUpdate: state.banner.IsUpdate,
    entityObj: state.banner.entityObj,
    showDetailModal: state.banner.showDetailModal,
    showEditModal: state.banner.showEditModal,
    isInit: state.banner.isInit,
    searchModel: state.banner.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(BannerAdm);
