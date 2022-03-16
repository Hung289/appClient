/* eslint-disable react/no-danger */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Constant from '@app/Constant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {Editor} from '@tinymce/tinymce-react';
import axios from 'axios';
import {Modal, ListGroup, ListGroupItem} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import * as tinTucService from '@app/services/tinTucService';
import * as SaveImageEditor from '@app/services/SaveImageEditor';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    TINTUC_CLOSE_VIEWDETAIL,
    TINTUC_CLOSE_VIEWEDIT,
    TINTUC_EDIT_CLOSE,
    TINTUC_SEARCH_SAVE
} from '@app/store/ActionType/TinTucTypeAction';
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
    Card,
    Form
} from 'antd';
import * as antIcon from '@ant-design/icons';

import AdminSecsionHead from '../AdminSecsionHead';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const TinTucAdm = (props) => {
    const formCreateTinTuc = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
    let FileSelected;

    const {
        LoadTinTucData,
        onCreateTinTuc,
        onDeleteTinTuc,
        onDeleteMultiEntity,
        onEditTinTuc,
        onCloseTinTucModal,
        onCloseTinTucEditModal,
        lstTinTuc,
        showEditModal,
        IsUpdate,
        tintucObj,
        showDetailModal,
        onOpenDetailModal,
        onSaveEditTinTuc,
        lstCatetory,
        onLoadCategoryModal,
        isInit,
        searchModel,
        onSubmitSearchSave
    } = props;
    const [showPanelSearch, SetshowPanelSearch] = useState(false);

    const editorRef = useRef(null);
    function ToggleSearchPanel() {
        SetshowPanelSearch(!showPanelSearch);
    }
    const SignupSchema = Yup.object().shape({
        title: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        description: Yup.string().trim().required('Vui lòng nhập thông tin này')
    });
    // const [Isloaded, SetIsloaded] = useState(false);

    useEffect(() => {
        if (!isInit) {
            onLoadCategoryModal();
        }
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
            LoadTinTucData(objSearch);
        }
    });
    let dataSelected;
    function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        let Arr = event.target.files;
        [FileSelected, ...Arr] = Arr;
    }
    function SaveAnh() {
        const fd = new FormData();
        fd.append('files', FileSelected, FileSelected.name);
        const dataAPI = axios
            .post(`${Constant.PathServer}/api/ManageTinTuc/PostImage`, fd, {
                onUploadProgress: (ProgressEvent) => {
                    // console.log(
                    //     `Upload Progress: ${Math.round(
                    //         (ProgressEvent.loaded / ProgressEvent.total) * 100
                    //     )} %
                    //         `
                    // );
                }
            })
            .then((res) => {
                return res.data;
            });
        return dataAPI;
    }
    const [test, settest] = useState(true);
    function IntiEditor(evt, editor) {
        editorRef.current = editor;
    }
    const handlerImage = async (blobInfo, success, failure) => {
        const dataUpload = await SaveImageEditor.SaveImage({
            fileName: blobInfo.filename(),
            base64: blobInfo.base64(),
            folder: 'TinTucEditor'
        });
        if (dataUpload !== null) {
            success(`${Constant.PathServer}${dataUpload.Data}`);
        }
        // setTimeout(function () {

        //     // /* no matter what you upload, we will turn it into TinyMCE logo :)*/
        //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
        // }, 2000);
    };
    function CallbackPickImage(callback, value, meta) {
        /* Provide file and text for the link dialog */
        if (meta.filetype === 'file') {
            callback('https://www.google.com/logos/google.jpg', {
                text: 'My text'
            });
        }

        /* Provide image and alt text for the image dialog */
        if (meta.filetype === 'image') {
            callback('https://www.google.com/logos/google.jpg', {
                alt: 'My alt text'
            });
        }

        /* Provide alternative source and posted for the media dialog */
        if (meta.filetype === 'media') {
            callback('movie.mp4', {
                source2: 'alt.ogg',
                poster: 'https://www.google.com/logos/google.jpg'
            });
        }
    }
    function CreateModal() {
        const [show, setShow] = useState(false);
        const [CreateContentEditor, setCreateContentEditor] = useState('');
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
                        <Modal.Title>Tạo mới tin tức</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                title: '',
                                description: '',
                                content: '',
                                categoryId: 0,
                                // isPublish: true,
                                publishTime: '',
                                isHot: false,
                                status: '',
                                KeyWord: '',
                                slugTitle: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values,
                                    content: CreateContentEditor
                                };
                                // same shape as initial values
                                if (
                                    FileSelected !== undefined &&
                                    FileSelected.name
                                ) {
                                    SaveAnh()
                                        .then((dataResult) => {
                                            if (dataResult.Status) {
                                                ObjSave.imageData =
                                                    dataResult.Data;
                                                onCreateTinTuc(ObjSave);
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
                                    onCreateTinTuc(ObjSave);
                                }
                                FileSelected = null;
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateTinTuc}>
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tiêu đề
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="title"
                                            key="title"
                                            className="form-control "
                                        />
                                        {errors.title && touched.title ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.title}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả<span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            key="description"
                                            className="form-control"
                                        />
                                        {errors.description &&
                                        touched.description ? (
                                            <div className="invalid-feedback">
                                                {errors.description}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="content">
                                            Nội dung
                                        </label>

                                        {/* <CKEditor
                                            editor={ClassicEditor}
                                            ref={createEditor}
                                            name="content"
                                            data=""
                                            onReady={(editor) => {
                                                setCreateContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onChange={(event, editor) => {
                                                setCreateContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onBlur={(event, editor) => {
                                                setCreateContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onFocus={(event, editor) => {
                                                setCreateContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                        /> */}

                                        <Editor
                                            initialValue="<p></p>"
                                            init={{
                                                height: 500,
                                                menubar: false,
                                                automatic_uploads: true,
                                                imagetools_cors_hosts: [
                                                    'picsum.photos'
                                                ],
                                                image_advtab: true,
                                                autosave_ask_before_unload: true,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar_sticky: true,
                                                // toolbar:
                                                //     'undo redo | formatselect | ' +
                                                //     'bold italic backcolor | alignleft aligncenter ' +
                                                //     'alignright alignjustify | bullist numlist outdent indent | ' +
                                                //     'link image | ' +
                                                //     'removeformat | help',
                                                toolbar:
                                                    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                                file_picker_callback: CallbackPickImage,
                                                images_upload_handler: handlerImage,
                                                // toolbar_mode: 'sliding',
                                                contextmenu:
                                                    'link image imagetools table',
                                                image_caption: true,
                                                images_file_types:
                                                    'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
                                                content_style:
                                                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                // onChange: (e) => {
                                                //     // console.log(
                                                //     //     'Content was updated:',
                                                //     //     e.target.getContent()
                                                //     // );
                                                //     // setCreateContentEditor(e.target.getContent());
                                                // }
                                            }}
                                        />

                                        {errors.content && touched.content ? (
                                            <div className="invalid-feedback">
                                                {errors.content}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="categoryId">
                                            Loại tin bài
                                        </label>
                                        <Field
                                            as="select"
                                            name="categoryId"
                                            key="categoryId"
                                            className="form-control"
                                        >
                                            <option key={-1} value="">
                                                --Chọn loại tin bài--
                                            </option>
                                            {lstCatetory.map((item, ind) => {
                                                return (
                                                    <option
                                                        key={ind}
                                                        value={item.Id}
                                                    >
                                                        {item.Name}
                                                    </option>
                                                );
                                            })}
                                        </Field>
                                        {errors.categoryId &&
                                        touched.categoryId ? (
                                            <div className="invalid-feedback">
                                                {errors.categoryId}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="isHot"
                                            key="isHot"
                                            id="isHot"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="isHot"
                                        >
                                            Tin bài nổi bật?
                                        </label>
                                        {errors.isHot && touched.isHot ? (
                                            <div className="invalid-feedback">
                                                {errors.isHot}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">
                                            Trạng thái
                                        </label>
                                        <Field
                                            as="select"
                                            name="status"
                                            key="status"
                                            className="form-control"
                                        >
                                            <option value="BanThao">
                                                Bản thảo
                                            </option>
                                            <option value="PhatHanh">
                                                Phát hành
                                            </option>
                                            <option value="Huy">Hủy</option>
                                        </Field>
                                        {errors.status && touched.status ? (
                                            <div className="invalid-feedback">
                                                {errors.status}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="publishTime">
                                            Ngày xuất bản
                                        </label>
                                        <Field
                                            type="date"
                                            name="publishTime"
                                            key="publishTime"
                                            className="form-control "
                                        />
                                        {errors.publishTime &&
                                        touched.publishTime ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.publishTime}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="KeyWord">
                                            Ảnh đại diện
                                        </label>
                                        <Field
                                            type="file"
                                            name="imageData"
                                            key="imageData"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUpload}
                                        />
                                        {errors.KeyWord && touched.KeyWord ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.imageData}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="KeyWord">
                                            SEO KeyWord
                                        </label>
                                        <Field
                                            name="KeyWord"
                                            key="KeyWord"
                                            className="form-control "
                                        />
                                        {errors.KeyWord && touched.KeyWord ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.KeyWord}
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
        const [EditContentEditor, setEditContentEditor] = useState('');
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
                    onHide={() => onCloseTinTucEditModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cập nhật tin tức</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                id: tintucObj.Id,
                                title: tintucObj.Title,
                                description: tintucObj.Description,
                                content: tintucObj.Content,
                                categoryId: tintucObj.CategoryId,
                                // isPublish: true,
                                publishTime: CommonUtility.GetDateSetField(
                                    tintucObj.PublishTime
                                ),
                                isHot: tintucObj.IsHot,
                                status: tintucObj.Status,
                                KeyWord: tintucObj.KeyWord
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    content: EditContentEditor
                                };
                                // same shape as initial values
                                if (
                                    FileSelected !== undefined &&
                                    FileSelected.name
                                ) {
                                    SaveAnh()
                                        .then((dataResult) => {
                                            if (dataResult.Status) {
                                                ObjSave.imageData =
                                                    dataResult.Data;
                                                onSaveEditTinTuc(ObjSave);
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
                                    ObjSave.imageData = tintucObj.ImageData;
                                    onSaveEditTinTuc(ObjSave);
                                }
                                FileSelected = null;
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateTinTuc}>
                                    <Field type="hidden" name="id" key="id" />
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tiêu đề
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="title"
                                            key="title"
                                            className="form-control "
                                        />
                                        {errors.title && touched.title ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.title}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            key="description"
                                            className="form-control"
                                        />
                                        {errors.description &&
                                        touched.description ? (
                                            <div className="invalid-feedback">
                                                {errors.description}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="content">
                                            Nội dung
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            ref={createEditor}
                                            name="content"
                                            data={tintucObj.Content}
                                            onReady={(editor) => {
                                                setEditContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onChange={(event, editor) => {
                                                setEditContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onBlur={(event, editor) => {
                                                setEditContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onFocus={(event, editor) => {
                                                setEditContentEditor(
                                                    editor.getData()
                                                );
                                            }}
                                        />
                                        {errors.content && touched.content ? (
                                            <div className="invalid-feedback">
                                                {errors.content}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="categoryId">
                                            Loại tin bài
                                        </label>
                                        <Field
                                            as="select"
                                            name="categoryId"
                                            key="categoryId"
                                            className="form-control"
                                        >
                                            <option key={-1} value="">
                                                --Chọn loại tin bài--
                                            </option>
                                            {lstCatetory.map((item, ind) => {
                                                return (
                                                    <option
                                                        key={ind}
                                                        value={item.Id}
                                                    >
                                                        {item.Name}
                                                    </option>
                                                );
                                            })}
                                        </Field>
                                        {errors.categoryId &&
                                        touched.categoryId ? (
                                            <div className="invalid-feedback">
                                                {errors.categoryId}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="isHot"
                                            key="isHot"
                                            id="isHot"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="isHot"
                                        >
                                            Tin bài nổi bật?
                                        </label>
                                        {errors.isHot && touched.isHot ? (
                                            <div className="invalid-feedback">
                                                {errors.isHot}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">
                                            Trạng thái
                                        </label>
                                        <Field
                                            as="select"
                                            name="status"
                                            key="status"
                                            className="form-control"
                                        >
                                            <option value="BanThao">
                                                Bản thảo
                                            </option>
                                            <option value="PhatHanh">
                                                Phát hành
                                            </option>
                                            <option value="Huy">Hủy</option>
                                        </Field>
                                        {errors.status && touched.status ? (
                                            <div className="invalid-feedback">
                                                {errors.status}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="publishTime">
                                            Ngày xuất bản
                                        </label>
                                        <Field
                                            type="date"
                                            name="publishTime"
                                            key="publishTime"
                                            className="form-control"
                                        />
                                        {errors.publishTime &&
                                        touched.publishTime ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.publishTime}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="KeyWord">
                                            Ảnh đại diện
                                        </label>
                                        <Field
                                            type="file"
                                            name="imageData"
                                            key="imageData"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUpload}
                                        />
                                        {errors.KeyWord && touched.KeyWord ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.imageData}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="KeyWord">
                                            SEO KeyWord
                                        </label>
                                        <Field
                                            name="KeyWord"
                                            key="KeyWord"
                                            className="form-control "
                                        />
                                        {errors.KeyWord && touched.KeyWord ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.KeyWord}
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
                            onClick={() => onCloseTinTucEditModal()}
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
            <Drawer
                placement="right"
                size="large"
                visible={showDetailModal}
                onClose={() => onCloseTinTucModal()}
                extra={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Space>
                        <Button
                            type="danger"
                            onClick={() => onCloseTinTucModal()}
                        >
                            Đóng
                        </Button>
                    </Space>
                }
            >
                <Descriptions title="Chi tiết tin tức" bordered>
                    <Descriptions.Item label="Ảnh đại diện">
                        {tintucObj.ImageData !== '' ? (
                            <>
                                <img
                                    src={`${Constant.PathServer}${tintucObj.ImageData}`}
                                    alt=""
                                    className="imgHinhAnh img-thumbnail"
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiêu đề">
                        {tintucObj.Title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        {tintucObj.Description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {tintucObj.Status}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày phát hành">
                        {CommonUtility.ShowDateVN(tintucObj.PublishTime)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tin bài nổi bật">
                        {tintucObj.IsHot ? (
                            <i className="fas fa-check" />
                        ) : (
                            <i className="fas fa-times" />
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="KeyWord" span={6}>
                        {tintucObj.KeyWord}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nội dung">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: tintucObj.Content
                            }}
                        />
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ tin tức này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        onDeleteTinTuc(id);
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
            title: 'Xác nhận xóa các tin tức này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các tin tức này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
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
                <div className="container-fluid  mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card title="Tìm kiếm">
                                <Form
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    layout="vertical"
                                    initialValues={{
                                        TitleFilter: searchModel.TitleFilter,
                                        MotaFilter: searchModel.MotaFilter,
                                        KeywordFilter:
                                            searchModel.KeywordFilter,
                                        IsHotFilter: searchModel.IsHotFilter,
                                        TrangThaiFilter:
                                            searchModel.TrangThaiFilter,
                                        CategoryIdFilter:
                                            searchModel.CategoryIdFilter
                                    }}
                                    onFinish={(values) =>
                                        onSubmitSearchSave(values)
                                    }
                                >
                                    <Row gutter={[10, 5]}>
                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="TitleFilter"
                                                label="Tiêu đề"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 ký tự'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="TitleFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="MotaFilter"
                                                label="Mô tả"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 ký tự'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="MotaFilter" />
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                name="KeywordFilter"
                                                label="Keyword"
                                                rules={[
                                                    {
                                                        min: 2,
                                                        message:
                                                            'Vui lòng nhập ít nhất 2 ký tự'
                                                    }
                                                ]}
                                                validateTrigger={[
                                                    'onBlur',
                                                    'onChange'
                                                ]}
                                            >
                                                <Input name="KeywordFilter" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[10, 20]}>
                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Nổi bật"
                                                name="IsHotFilter"
                                            >
                                                <Select>
                                                    <Select.Option value="">
                                                        --Chọn--
                                                    </Select.Option>
                                                    <Select.Option value="On">
                                                        Có
                                                    </Select.Option>
                                                    <Select.Option value="Off">
                                                        Không
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Trạng thái"
                                                name="TrangThaiFilter"
                                            >
                                                <Select>
                                                    <Select.Option value="">
                                                        --Chọn--
                                                    </Select.Option>
                                                    <Select.Option value="BanThao">
                                                        Bản thảo
                                                    </Select.Option>
                                                    <Select.Option value="PhatHanh">
                                                        Phát hành
                                                    </Select.Option>
                                                    <Select.Option value="Huy">
                                                        Hủy
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col
                                            lg={{span: 8}}
                                            md={{span: 8}}
                                            sm={{span: 12}}
                                            xs={{span: 24}}
                                        >
                                            <Form.Item
                                                label="Loại tin bài"
                                                name="CategoryIdFilter"
                                            >
                                                <Select>
                                                    <Select.Option value="">
                                                        --Chọn--
                                                    </Select.Option>
                                                    {lstCatetory.map(
                                                        (item, index) => {
                                                            return (
                                                                <Select.Option
                                                                    key={index}
                                                                    value={
                                                                        item.Id
                                                                    }
                                                                >
                                                                    {item.Name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
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

    const RenderPage = () => {
        const totalPage =
            lstTinTuc.TotalPage !== undefined ? lstTinTuc.TotalPage : 1;
        const curPage =
            lstTinTuc.CurrentPage !== undefined ? lstTinTuc.CurrentPage : 1;
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
        let pageSiz = 5;
        let pageInd = 1;
        let Count = 0;
        if (lstTinTuc.ListItem !== undefined) {
            lstItem = lstTinTuc.ListItem;
            pageInd = lstTinTuc.CurrentPage;
            Count = lstTinTuc.Count;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        const rowSelection = {
            // onChange: (selectedRowKeys, selectedRows) => {
            //     dataSelected = selectedRowKeys;
            // },
            // getCheckboxProps: (record) => ({
            //     // disabled: record.name === 'Disabled User',
            //     // // Column configuration not to be checked
            //     // name: record.name
            // })
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(
                //     `selectedRowKeys: ${selectedRowKeys}`,
                //     'selectedRows: ',
                //     selectedRows
                // );
                dataSelected = selectedRowKeys;
            }
        };
        const getMenu = (record) => (
            <>
                <Menu>
                    <Menu.Item
                        key={`sua_${record.Id}`}
                        icon={<antIcon.EditOutlined />}
                        onClick={
                            () => {
                                props.history.push(
                                    `/Admin/CapNhatTinBai/${record.Id}`
                                );
                            }
                            // onEditTinTuc(item.Id)
                        }
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
                title: 'Thao tác',
                key: 'action',
                render: (text, record) => (
                    <Dropdown.Button
                        onClick={() => onOpenDetailModal(record.Id)}
                        overlay={() => getMenu(record)}
                    >
                        Chi tiết
                    </Dropdown.Button>
                )
            },
            {
                title: 'Ảnh',
                key: 'Avatar',
                className: 'imgHinhAnhCol .mw-image-avatar',
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.ImageData !== '' ? (
                                <>
                                    <img
                                        src={`${Constant.PathServer}${record.ImageData}`}
                                        alt=""
                                        onError={NotFoundImage}
                                        className="imgHinhAnhAccount img-thumbnail"
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                }
            },
            {
                title: 'Tiêu đề',
                key: 'TieuDe',
                render: (text, record, index) => {
                    return (
                        <div className="tableBoxMain">
                            <div className="tableBoxMain-label">
                                {record.Title}
                            </div>
                        </div>
                    );
                }
            },
            {
                title: 'Mô tả',
                key: 'MoTa',
                render: (text, record, index) => {
                    return <div>{record.Description}</div>;
                }
            },
            {
                title: 'Nổi bật',
                key: 'NoiBat',
                render: (text, record, index) => {
                    return record.IsHot ? (
                        <i className="fas fa-check" />
                    ) : (
                        <i className="fas fa-times" />
                    );
                }
            },
            {
                title: 'Trạng Thái',
                key: 'TrangThai',
                render: (text, record, index) => {
                    return <div>{record.StatusName}</div>;
                }
            },
            {
                title: 'Loại tin bài',
                key: 'LoaiTinBai',
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.categoryNews != null
                                ? record.categoryNews.Name
                                : ''}
                        </div>
                    );
                }
            },
            {
                title: 'Ngày phát hành',
                key: 'NgayPhatHanh',
                render: (text, record, index) => {
                    return (
                        <div>
                            {CommonUtility.ShowDateVN(record.PublishTime)}
                        </div>
                    );
                }
            },
            {
                title: 'KeyWord',
                key: 'Keyword',
                render: (text, record, index) => {
                    return <div>{record.KeyWord}</div>;
                }
            }
        ];
        return (
            <>
                <EditModal />
                <DetailModal />

                <Table
                    rowKey="Id"
                    columns={columns}
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
                />
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Quản lý tin tức" />
            <RenderFormSearch />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                props.history.push(
                                                    '/Admin/TaoMoiTinBai'
                                                )
                                            }
                                        >
                                            <i
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                            />
                                            {'  '}
                                            Tạo mới
                                        </Button>

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
    LoadTinTucData: (objSearch) => {
        tinTucService.LoadTinTuc(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: TINTUC_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        tinTucService.OpenDetailModalSV(dispatch, id);
    },
    onCloseTinTucModal: () => {
        dispatch({type: TINTUC_CLOSE_VIEWDETAIL});
    },
    // LoadTinTucData: () => {
    //     fetch('http://192.168.1.21:8603/api/ManageTinTuc/GetData')
    //         .then((response) => response.json())
    //         .then((json) => {
    //             dispatch({
    //                 type: ActionTypes.LOAD_TINTUC,
    //                 allData: json.Data
    //             });
    //         });
    // },
    onCreateTinTuc: (tintuc) => {
        tinTucService.CreateNewTinTuc(dispatch, tintuc);
    },
    onDeleteTinTuc: (id) => {
        tinTucService.DeleteTinTuc(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        tinTucService.DeleteMultiEntity(dispatch, id);
    },
    // onEditTinTuc: (id) => {
    //     // tinTucService.OpenEditModalSV(dispatch, id);
    // },
    onSaveEditTinTuc: (tintuc) => {
        tinTucService.EditNewTinTuc(dispatch, tintuc);
    },
    onCloseTinTucEditModal: (id) => {
        dispatch({type: TINTUC_EDIT_CLOSE});
    },
    onLoadCategoryModal: () => {
        tinTucService.GetCategory(dispatch);
    }
});
const mapStateToProps = (state) => ({
    lstTinTuc: state.tintuc.lstTinTuc,
    IsUpdate: state.tintuc.IsUpdate,
    tintucObj: state.tintuc.tintucObj,
    showDetailModal: state.tintuc.showDetailModal,
    showEditModal: state.tintuc.showEditModal,
    lstCatetory: state.tintuc.lstCatetory,
    isInit: state.tintuc.isInit,
    searchModel: state.tintuc.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(TinTucAdm);
