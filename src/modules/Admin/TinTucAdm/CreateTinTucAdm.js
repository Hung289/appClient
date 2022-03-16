/* eslint-disable dot-notation */
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
import {Modal, ListGroup, ListGroupItem} from 'react-bootstrap';
import {
    Drawer,
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
    Form,
    Checkbox,
    DatePicker,
    Button
} from 'antd';
import * as antIcon from '@ant-design/icons';
import {Link, useHistory, Redirect} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as tinTucService from '@app/services/tinTucService';
import * as SaveImageEditor from '@app/services/SaveImageEditor';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {HASUPDATE_TINTUC} from '@app/store/ActionType/TinTucTypeAction';
import AdminSecsionHead from '../AdminSecsionHead';

const CreateTinTucAdm = (props) => {
    const editorRef = useRef(null);
    const formCreateTinTuc = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
    const [lstCatetory, setLstCatetory] = useState([]);
    const {onReloadListTinTuc} = props;
    const initCategory = () => {
        tinTucService.GetOnlyDataCategory().then((x) => {
            setLstCatetory(x);
        });
    };
    useEffect(() => {
        initCategory();
    }, []);
    let FileSelected;

    const handlerImage = async (blobInfo, success, failure) => {
        // console.log(blobInfo.base64());
        // console.log(blobInfo.filename());
        // console.log(blobInfo);
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
    function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        let Arr = event.target.files;
        [FileSelected, ...Arr] = Arr;
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
        tinTucService.CreateOnlyNewTinTuc(data).then((x) => {
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
            <Form
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                layout="vertical"
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
                onFinish={(values) => {
                    const publishTime =
                        values['publishTime'] !== ''
                            ? values['publishTime'].format('YYYY-MM-DD')
                            : '';
                    const ObjSave = {
                        ...values,
                        content: editorRef.current.getContent(),
                        publishTime
                    };
                    console.log(ObjSave);

                    // same shape as initial values
                    if (FileSelected !== undefined && FileSelected.name) {
                        SaveAnh()
                            .then((dataResult) => {
                                if (dataResult.Status) {
                                    ObjSave.imageData = dataResult.Data;
                                    ActionCreateSubmid(ObjSave);
                                } else {
                                    toast.error(dataResult.MessageError);
                                }
                            })
                            .catch((err) => {
                                toast.error('Lỗi kết nối');
                            });
                    } else {
                        ActionCreateSubmid(ObjSave);
                    }
                    FileSelected = null;
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
                            name="title"
                            label="Tiêu đề"
                            rules={[
                                {
                                    min: 2,
                                    message: 'Vui lòng nhập ít nhất 2 kí tự'
                                },
                                {
                                    max: 255,
                                    message: 'Vui lòng không nhập quá 255 ký tự'
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thông tin này'
                                }
                            ]}
                            validateTrigger={['onBlur', 'onChange']}
                        >
                            <Input name="title" />
                        </Form.Item>
                    </Col>

                    <Col
                        lg={{span: 24}}
                        md={{span: 24}}
                        sm={{span: 24}}
                        xs={{span: 24}}
                    >
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thông tin này'
                                }
                            ]}
                            validateTrigger={['onBlur', 'onChange']}
                        >
                            <Input name="description" />
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
                        <Form.Item label="Nội dung">
                            <Editor
                                ref={editorRef}
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                }}
                                initialValue="<p></p>"
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
                        <Form.Item name="categoryId" label="Loại tin bài">
                            <Select name="categoryId" defaultValue="">
                                <Select.Option value="" key="-1">
                                    --Chọn loại tin bài--
                                </Select.Option>
                                {lstCatetory.map((item, ind) => {
                                    return (
                                        <Select.Option
                                            key={ind}
                                            value={item.Id}
                                        >
                                            {item.Name}
                                        </Select.Option>
                                    );
                                })}
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
                            name="status"
                            key="status"
                            label="Trạng thái"
                        >
                            <Select name="status" defaultValue="">
                                <Select.Option value="">--Chọn--</Select.Option>
                                <Select.Option value="BanThao">
                                    Bản Thảo
                                </Select.Option>
                                <Select.Option value="PhatHanh">
                                    Phát hành
                                </Select.Option>
                                <Select.Option value="Huy">Hủy</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col
                        lg={{span: 12}}
                        md={{span: 12}}
                        sm={{span: 12}}
                        xs={{span: 24}}
                    >
                        <Form.Item name="KeyWord" label="SEO KeyWord">
                            <Input name="KeyWord" />
                        </Form.Item>
                    </Col>

                    <Col
                        lg={{span: 12}}
                        md={{span: 12}}
                        sm={{span: 12}}
                        xs={{span: 24}}
                    >
                        <Form.Item name="publishTime" label="Ngày xuất bản">
                            <DatePicker
                                format="DD/MM/YYYY"
                                name="publishTime"
                                style={{width: '100%'}}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        lg={{span: 24}}
                        md={{span: 24}}
                        sm={{span: 24}}
                        xs={{span: 24}}
                    >
                        <Form.Item
                            name="isHot"
                            key="isHot"
                            valuePropName="checked"
                        >
                            <Checkbox name="isHot" id="isHot">
                                Tin bài nổi bật
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{justifyContent: 'flex-end'}}>
                    <Button type="primary" htmlType="submit" className="mgr15">
                        Hoàn Thành
                    </Button>
                    <Button type="danger" onClick={() => BackDanhSach()}>
                        Quay lại danh sách
                    </Button>
                </Row>
            </Form>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Tạo mới tin tức" />
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
    onReloadListTinTuc: (id) => {
        dispatch({type: HASUPDATE_TINTUC});
    }
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTinTucAdm);
