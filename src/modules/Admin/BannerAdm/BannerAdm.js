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
import {
    Button,
    Card,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Modal
} from 'react-bootstrap';
import {Field, Form, Formik, useFormik, useFormikContex} from 'formik';
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
    const SignupSchema = Yup.object().shape({
        Name: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        Comment: Yup.string().trim().required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        NameFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        CommentFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        ImageLinkFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        IsLinkActiveFilter: Yup.string().nullable(),
        IsVisibleFilter: Yup.string().nullable()
    });

    function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        let Arr = event.target.files;
        [FileSelected, ...Arr] = Arr;
        const image = document.getElementById('ImageSrc');
        image.src = URL.createObjectURL(event.target.files[0]);
    }
    function SaveAnh() {
        const fd = new FormData();
        fd.append('files', FileSelected, FileSelected.name);
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
                toast.error('Lỗi lưu ảnh');
            });
        return dataAPI;
    }

    function CreateModal() {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const submitCreate = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Button
                    variant=""
                    className="btn-nobg"
                    size="sm"
                    onClick={handleShow}
                >
                    <i className="fa fa-plus" aria-hidden="true" />
                    Tạo mới
                </Button>

                <Modal show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo mới banner</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Name: '',

                                IsVisible: true,
                                Order: 0,
                                ImageLink: '',
                                IsLinkActive: true,
                                Comment: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                // same shape as initial values
                                if (
                                    FileSelected !== undefined &&
                                    FileSelected.name
                                ) {
                                    SaveAnh()
                                        .then((dataResult) => {
                                            if (dataResult.Status) {
                                                ObjSave.ImageSrc =
                                                    dataResult.Data;
                                                onCreateEntity(ObjSave);
                                            } else {
                                                toast.error(
                                                    dataResult.MessageError
                                                );
                                            }
                                        })
                                        .catch((err) => {
                                            toast.error('Lỗi kết nối');
                                        });
                                } else {
                                    onCreateEntity(ObjSave);
                                }
                                FileSelected = null;
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ImageSrc">
                                                Ảnh Banner
                                            </label>
                                            <Field
                                                type="file"
                                                name="ImageSrc"
                                                key="ImageSrc"
                                                className="form-control img-padding"
                                                onChange={ChangeFileUpload}
                                            />
                                            {errors.ImageSrc &&
                                            touched.ImageSrc ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.ImageSrc}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <>
                                                <img
                                                    className="img-ImageSrc"
                                                    id="ImageSrc"
                                                    alt=""
                                                />
                                            </>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tên Banner
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="Name"
                                            key="Name"
                                            className="form-control "
                                        />
                                        {errors.Name && touched.Name ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Name}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Comment">
                                            Mô tả<span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="Comment"
                                            key="Comment"
                                            className="form-control"
                                        />
                                        {errors.Comment && touched.Comment ? (
                                            <div className="invalid-feedback">
                                                {errors.Comment}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsVisible"
                                            key="IsVisible"
                                            id="IsVisible"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="IsVisible"
                                        >
                                            Hiển thị?
                                        </label>
                                        {errors.IsVisible &&
                                        touched.IsVisible ? (
                                            <div className="invalid-feedback">
                                                {errors.IsVisible}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsLinkActive"
                                            key="IsLinkActive"
                                            id="IsLinkActive"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="IsLinkActive"
                                        >
                                            Hoạt động?
                                        </label>
                                        {errors.IsLinkActive &&
                                        touched.IsLinkActive ? (
                                            <div className="invalid-feedback">
                                                {errors.IsLinkActive}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ImageLink">
                                            Liên kết
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="ImageLink"
                                            key="ImageLink"
                                            className="form-control "
                                        />
                                        {errors.ImageLink &&
                                        touched.ImageLink ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.ImageLink}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Order">Thứ tự</label>
                                        <Field
                                            name="Order"
                                            key="Order"
                                            className="form-control "
                                        />
                                        {errors.Order && touched.Order ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Order}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={submitCreate}>
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={showEditModal}
                    size="lg"
                    onHide={() => onCloseEntityEditModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cập nhật banner</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
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
                            validationSchema={SignupSchema}
                            vali
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    ImageSrc: entityObj.ImageSrc
                                };
                                // same shape as initial values
                                if (
                                    FileSelected !== null &&
                                    FileSelected.name
                                ) {
                                    SaveAnh()
                                        .then((dataResult) => {
                                            if (dataResult.Status) {
                                                ObjSave.ImageSrc =
                                                    dataResult.Data;
                                                onSaveEditEntity(ObjSave);
                                            } else {
                                                toast.error(
                                                    dataResult.MessageError
                                                );
                                            }
                                        })
                                        .catch((err) => {
                                            toast.error('Lỗi kết nối');
                                        });
                                } else {
                                    ObjSave.ImageSrc = entityObj.ImageSrc;
                                    onSaveEditEntity(ObjSave);
                                }
                                FileSelected = null;
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />

                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="ImageSrc">
                                                Ảnh Banner
                                            </label>
                                            <Field
                                                type="file"
                                                name="ImageSrc"
                                                key="ImageSrc"
                                                className="form-control img-padding"
                                                onChange={ChangeFileUpload}
                                            />
                                            {errors.ImageSrc &&
                                            touched.ImageSrc ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.ImageSrc}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="ImageSrc">
                                                Ảnh Banner mới
                                            </label>
                                            <div>
                                                <>
                                                    <img
                                                        className="img-ImageSrc"
                                                        id="ImageSrc"
                                                        alt=""
                                                    />
                                                </>
                                            </div>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="ImageSrc">
                                                Ảnh Banner cũ
                                            </label>
                                            <div>
                                                {entityObj.ImageSrc !== '' ? (
                                                    <>
                                                        <img
                                                            src={`${Constant.PathServer}${entityObj.ImageSrc}`}
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                            alt=""
                                                            className=" img-ImageSrc"
                                                        />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tên Banner
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="Name"
                                            key="Name"
                                            className="form-control "
                                        />
                                        {errors.Name && touched.Name ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Name}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Comment">
                                            Mô tả<span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="Comment"
                                            key="Comment"
                                            className="form-control"
                                        />
                                        {errors.Comment && touched.Comment ? (
                                            <div className="invalid-feedback">
                                                {errors.Comment}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsVisible"
                                            key="IsVisible"
                                            id="IsVisible"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="IsVisible"
                                        >
                                            Hiển thị?
                                        </label>
                                        {errors.IsVisible &&
                                        touched.IsVisible ? (
                                            <div className="invalid-feedback">
                                                {errors.IsVisible}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsLinkActive"
                                            key="IsLinkActive"
                                            id="IsLinkActive"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="IsLinkActive"
                                        >
                                            Hoạt động?
                                        </label>
                                        {errors.IsLinkActive &&
                                        touched.IsLinkActive ? (
                                            <div className="invalid-feedback">
                                                {errors.IsLinkActive}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ImageLink">
                                            Liên kết
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="ImageLink"
                                            key="ImageLink"
                                            className="form-control "
                                        />
                                        {errors.ImageLink &&
                                        touched.ImageLink ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.ImageLink}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Order">Thứ tự</label>
                                        <Field
                                            name="Order"
                                            key="Order"
                                            className="form-control "
                                        />
                                        {errors.Order && touched.Order ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Order}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={submitEdit}>
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function DetailModal() {
        return (
            <>
                <Modal
                    show={showDetailModal}
                    size="lg"
                    onHide={() => onCloseEntityModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết banner</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Ảnh đại diện</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.ImageSrc !== '' ? (
                                            <>
                                                <img
                                                    src={`${Constant.PathServer}${entityObj.ImageSrc}`}
                                                    alt=""
                                                    className="imgHinhAnh img-thumbnail"
                                                />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mô tả</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Comment}
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
                </Modal>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ Banner này.',
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
            title: 'Xác nhận xóa các banner này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các Banner này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
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
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
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
                                        validationSchema={SearchSchema}
                                        onSubmit={(values) => {
                                            onSubmitSearchSave(values);
                                        }}
                                    >
                                        {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="NameFilter">
                                                                Tên Banner
                                                            </label>
                                                            <Field
                                                                name="NameFilter"
                                                                key="NameFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.NameFilter &&
                                                            touched.NameFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.NameFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="CommentFilter">
                                                                Mô tả
                                                            </label>
                                                            <Field
                                                                name="CommentFilter"
                                                                key="CommentFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.CommentFilter &&
                                                            touched.CommentFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.CommentFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="ImageLinkFilter">
                                                                Đường dẫn
                                                            </label>
                                                            <Field
                                                                name="ImageLinkFilter"
                                                                key="ImageLinkFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.ImageLinkFilter &&
                                                            touched.ImageLinkFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.ImageLinkFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="IsLinkActiveFilter">
                                                                Hoạt động
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="IsLinkActiveFilter"
                                                                key="IsLinkActiveFilter"
                                                                className="form-control"
                                                            >
                                                                <option value="">
                                                                    --Chọn--
                                                                </option>
                                                                <option value="On">
                                                                    Có
                                                                </option>
                                                                <option value="Off">
                                                                    Không
                                                                </option>
                                                            </Field>
                                                            {errors.IsLinkActiveFilter &&
                                                            touched.IsLinkActiveFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.IsLinkActiveFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="IsVisibleFilter">
                                                                Hiển thị
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="IsVisibleFilter"
                                                                key="IsVisibleFilter"
                                                                className="form-control"
                                                            >
                                                                <option value="">
                                                                    --Chọn--
                                                                </option>
                                                                <option value="On">
                                                                    Có
                                                                </option>
                                                                <option value="Off">
                                                                    Không
                                                                </option>
                                                            </Field>
                                                            {errors.IsVisibleFilter &&
                                                            touched.IsVisibleFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.IsVisibleFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <Button
                                                            variant="success"
                                                            size="md"
                                                            type="submit"
                                                            className="button-action"
                                                        >
                                                            <i
                                                                className="fa fa-search"
                                                                aria-hidden="true"
                                                            />{' '}
                                                            Tìm kiếm
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    const NextPage = (pageInd) => {
        const searchMd = {
            ...searchModel,
            PageIndex: pageInd
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

    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
        let pageInd = 1;
        if (lstEntity.ListItem !== undefined) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }

        return (
            <>
                <EditModal />
                <DetailModal />

                <div className="table-responsive">
                    <table className="table table-hinetNew" id="dsTable">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        className="checkAll"
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th
                                    scope="col"
                                    className="imgHinhAnhCol mw-image"
                                >
                                    Ảnh Banner
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên Banner
                                </th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Đường dẫn</th>
                                <th scope="col">Hoạt động?</th>
                                <th scope="col">Hiển thị</th>
                                <th scope="col">Thứ tự</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lstItem.length > 0 ? (
                                lstItem.map((item, key) => {
                                    const rIndex =
                                        (pageInd - 1) * pageSiz + key + 1;
                                    return (
                                        <tr
                                            key={key}
                                            onClick={(e) =>
                                                CheckRowsHinetTable(e)
                                            }
                                        >
                                            <td>
                                                <input
                                                    className="checkTd"
                                                    type="checkbox"
                                                    data-id={item.Id}
                                                    onClick={(e) =>
                                                        CheckRowsHinetTable(e)
                                                    }
                                                />
                                            </td>
                                            <th scope="row">{rIndex}</th>

                                            <td>
                                                {item.ImageSrc !== '' ? (
                                                    <>
                                                        <img
                                                            src={`${Constant.PathServer}${item.ImageSrc}`}
                                                            onError={
                                                                NotFoundImage
                                                            }
                                                            alt=""
                                                            className="imgHinhAnh-Banner img-thumbnail"
                                                        />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </td>
                                            <td>
                                                <div className="tableBoxMain">
                                                    <div className="tableBoxMain-label">
                                                        {item.Name}
                                                    </div>
                                                    <div className="tableBoxMain-btnAction">
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                size="sm"
                                                                variant=""
                                                                className="dropdowTableBtn"
                                                            >
                                                                <i
                                                                    className="fa fa-ellipsis-h"
                                                                    aria-hidden="true"
                                                                />
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onEditEntity(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-edit" />
                                                                    </span>
                                                                    <span>
                                                                        Sửa
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        DeleteAction(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-times" />
                                                                    </span>
                                                                    <span>
                                                                        Xóa
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onOpenDetailModal(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-info-circle" />
                                                                    </span>
                                                                    <span>
                                                                        Xem chi
                                                                        tiết
                                                                    </span>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.Comment}</td>
                                            <td>{item.ImageLink}</td>
                                            <td>
                                                {item.IsLinkActive ? (
                                                    <i className="fas fa-check" />
                                                ) : (
                                                    <i className="fas fa-times" />
                                                )}
                                            </td>
                                            <td>
                                                {item.IsVisible ? (
                                                    <i className="fas fa-check" />
                                                ) : (
                                                    <i className="fas fa-times" />
                                                )}
                                            </td>
                                            <td>{item.Order}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={9} />
                            )}
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        className="checkAll"
                                        onClick={(e) =>
                                            CheckAllItem(e, 'dsTable')
                                        }
                                    />
                                </th>
                                <th scope="col">#</th>
                                <th
                                    scope="col"
                                    className="imgHinhAnhCol mw-image"
                                >
                                    Ảnh Banner
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên Banner
                                </th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Đường dẫn</th>
                                <th scope="col">Hoạt động?</th>
                                <th scope="col">Hiển thị</th>
                                <th scope="col">Thứ tự</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            Tổng số {lstEntity.Count} bản ghi trang hiện tại -
                            tổng số {lstEntity.TotalPage} trang
                        </div>

                        <div className="col-sm-6 right">
                            <nav
                                aria-label="Page navigation "
                                className="tblHinet-pagin"
                            >
                                <ul className="pagination pagination-sm">
                                    <li className="page-item">
                                        <Button
                                            className="page-link"
                                            onClick={() => NextPage(1)}
                                            aria-label="Previous"
                                        >
                                            <span aria-hidden="true">
                                                &laquo;
                                            </span>
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                        </Button>
                                    </li>
                                    <RenderPage />
                                    <li className="page-item">
                                        <Button
                                            className="page-link"
                                            onClick={() =>
                                                NextPage(lstEntity.TotalPage)
                                            }
                                            aria-label="Next"
                                        >
                                            <span aria-hidden="true">
                                                &raquo;
                                            </span>
                                            <span className="sr-only">
                                                Next
                                            </span>
                                        </Button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Quản lý Banner" />
            <RenderFormSearch />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <CreateModal />
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => ToggleSearchPanel()}
                                    >
                                        {showPanelSearch ? (
                                            <>
                                                <i
                                                    className="fa fa-times"
                                                    aria-hidden="true"
                                                />{' '}
                                                Đóng tìm kiếm
                                            </>
                                        ) : (
                                            <>
                                                <i
                                                    className="fa fa-search"
                                                    aria-hidden="true"
                                                />{' '}
                                                Tìm kiếm
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => DeleteMulTiBtnAction()}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        />{' '}
                                        Xóa
                                    </Button>
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
