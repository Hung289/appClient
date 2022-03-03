import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Constant from '@app/Constant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {Editor} from '@tinymce/tinymce-react';
import axios from 'axios';
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card
} from 'react-bootstrap';
import {Link, useHistory, Redirect, useParams} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as tinTucService from '@app/services/tinTucService';
import * as SaveImageEditor from '@app/services/SaveImageEditor';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {HASUPDATE_TINTUC} from '@app/store/ActionType/TinTucTypeAction';
import AdminSecsionHead from '../AdminSecsionHead';

const EditTinTucAdm = (props) => {
    const {id} = useParams();
    const editorRef = useRef(null);
    const formCreateTinTuc = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
    const [lstCatetory, setLstCatetory] = useState([]);
    const [tintucObj, settintucObj] = useState({});
    const {onReloadListTinTuc} = props;
    const initCategory = () => {
        tinTucService.GetOnlyDataCategory().then((x) => {
            setLstCatetory(x);
        });
    };
    const initTintuc = () => {
        fetch(`${Constant.PathServer}/api/ManageTinTuc/GetById?id=${id}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    settintucObj(json.Data);
                } else {
                    toast.error(json.MessageError);
                }
            });
    };
    useEffect(() => {
        initCategory();
        initTintuc();
    }, []);
    let FileSelected;

    const handlerImage = async (blobInfo, success, failure) => {
        const dataUpload = await SaveImageEditor.SaveImage({
            fileName: blobInfo.filename(),
            base64: blobInfo.base64(),
            folder: 'TinTucEditor'
        });
        if (dataUpload !== null) {
            success(`${Constant.PathServer}${dataUpload.Data}`);
        }
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
    async function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
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
        FileSelected = {
            fileName: Arr[0].name,
            size: Arr[0].size,
            type: Arr[0].type,
            data: await dataOfFile.then((rs) => rs)
        };
    }
    const SignupSchema = Yup.object().shape({
        title: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        description: Yup.string().trim().required('Vui lòng nhập thông tin này')
    });

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

    const ActionCreateSubmid = (data) => {
        tinTucService.EditOnlyTinTuc(data).then((x) => {
            if (x !== null) {
                onReloadListTinTuc();
                props.history.push('/Admin/tintuc');
            }
            return null;
        });
    };
    const BackDanhSach = () => {
        props.history.push('/Admin/tintuc');
    };
    const RenderForm = () => {
        const [CreateContentEditor, setCreateContentEditor] = useState('');

        return (
            <Formik
                innerRef={formRef}
                initialValues={{
                    id: tintucObj.Id,
                    title: tintucObj.Title,
                    description: tintucObj.Description,
                    // content: tintucObj.Content,
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
                    const ObjSave = {
                        ...values,
                        content: editorRef.current.getContent()
                    };

                    // same shape as initial values
                    if (FileSelected !== undefined && FileSelected.data) {
                        // SaveAnh()
                        //     .then((dataResult) => {
                        //         if (dataResult.Status) {
                        //             ObjSave.imageData = dataResult.Data;
                        //             ActionCreateSubmid(ObjSave);
                        //         } else {
                        //             toast.error(dataResult.MessageError);
                        //         }
                        //     })
                        //     .catch((err) => {
                        //         toast.error('Lỗi kết nối');
                        //     });
                        // ObjSave.file = FileSelected;
                        ObjSave.file = FileSelected;
                        ActionCreateSubmid(ObjSave);
                    } else {
                        ObjSave.imageData = tintucObj.ImageData;
                        ActionCreateSubmid(ObjSave);
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
                                Mô tả<span className="red">*</span>
                            </label>
                            <Field
                                as="textarea"
                                rows={3}
                                name="description"
                                key="description"
                                className="form-control"
                            />
                            {errors.description && touched.description ? (
                                <div className="invalid-feedback">
                                    {errors.description}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Nội dung</label>

                            <Editor
                                ref={editorRef}
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                }}
                                initialValue={tintucObj.Content}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    automatic_uploads: true,
                                    imagetools_cors_hosts: ['picsum.photos'],
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
                                    contextmenu: 'link image imagetools table',
                                    image_caption: true,
                                    images_file_types:
                                        'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
                                    content_style:
                                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    onChange: (e) => {
                                        setCreateContentEditor(
                                            e.target.getContent()
                                        );
                                    }
                                }}
                            />

                            {errors.content && touched.content ? (
                                <div className="invalid-feedback">
                                    {errors.content}
                                </div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoryId">Loại tin bài</label>
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
                                        <option key={ind} value={item.Id}>
                                            {item.Name}
                                        </option>
                                    );
                                })}
                            </Field>
                            {errors.categoryId && touched.categoryId ? (
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
                            <label htmlFor="status">Trạng thái</label>
                            <Field
                                as="select"
                                name="status"
                                key="status"
                                className="form-control"
                            >
                                <option value="BanThao">Bản thảo</option>
                                <option value="PhatHanh">Phát hành</option>
                                <option value="Huy">Hủy</option>
                            </Field>
                            {errors.status && touched.status ? (
                                <div className="invalid-feedback">
                                    {errors.status}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="publishTime">Ngày xuất bản</label>
                            <Field
                                type="date"
                                name="publishTime"
                                key="publishTime"
                                className="form-control "
                            />
                            {errors.publishTime && touched.publishTime ? (
                                <>
                                    <div className="invalid-feedback">
                                        {errors.publishTime}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="KeyWord">Ảnh đại diện</label>
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
                            <label htmlFor="KeyWord">SEO KeyWord</label>
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
                        <div className="form-group">
                            <Button
                                variant="success"
                                className="mgr15"
                                type="submit"
                            >
                                Hoàn thành
                            </Button>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={() => BackDanhSach()}
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Cập nhật tin tức" />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                {/* <div className="p-2 card-header"></div> */}
                                <div className="card-body">
                                    <div className="tab-content">
                                        <RenderForm />
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
    onReloadListTinTuc: () => {
        dispatch({type: HASUPDATE_TINTUC});
    }
});
const mapStateToProps = (state) => ({});

export default connect(null, mapDispatchToProps)(EditTinTucAdm);
