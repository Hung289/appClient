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
import moment from 'moment';
import * as antIcon from '@ant-design/icons';
import {Link, useHistory, Redirect, useParams} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
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
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        description: Yup.string().trim().required('Vui l??ng nh???p th??ng tin n??y')
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
            <Form
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                layout="vertical"
                initialValues={{
                    id: tintucObj.Id,
                    title: tintucObj.Title,
                    description: tintucObj.Description,
                    // content: tintucObj.Content,
                    categoryId: tintucObj.CategoryId,
                    // isPublish: true,
                    publishTime:
                        tintucObj.PublishTime !== null
                            ? moment(tintucObj.PublishTime)
                            : '',
                    isHot: tintucObj.IsHot,
                    status: tintucObj.Status,
                    KeyWord: tintucObj.KeyWord
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

                    // same shape as initial values
                    if (FileSelected !== undefined && FileSelected.name) {
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
                        //         toast.error('L???i k???t n???i');
                        //     });

                        ObjSave.file = FileSelected;
                        ActionCreateSubmid(ObjSave);
                    } else {
                        ObjSave.imageData = tintucObj.ImageData;
                        ActionCreateSubmid(ObjSave);
                    }
                    FileSelected = null;
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
                            name="title"
                            label="Ti??u ?????"
                            rules={[
                                {
                                    min: 2,
                                    message: 'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                },
                                {
                                    max: 255,
                                    message: 'Vui l??ng kh??ng nh???p qu?? 255 k?? t???'
                                },
                                {
                                    required: true,
                                    message: 'Vui l??ng nh???p th??ng tin n??y'
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
                            label="M?? t???"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui l??ng nh???p th??ng tin n??y'
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
                        <Form.Item label="N???i dung">
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
                        <Form.Item name="categoryId" label="Lo???i tin b??i">
                            <Select name="categoryId" defaultValue="">
                                <Select.Option value="" key="-1">
                                    --Ch???n lo???i tin b??i--
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
                            label="Tr???ng th??i"
                        >
                            <Select name="status" defaultValue="">
                                <Select.Option value="">--Ch???n--</Select.Option>
                                <Select.Option value="BanThao">
                                    B???n Th???o
                                </Select.Option>
                                <Select.Option value="PhatHanh">
                                    Ph??t h??nh
                                </Select.Option>
                                <Select.Option value="Huy">H???y</Select.Option>
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
                        <Form.Item name="publishTime" label="Ng??y xu???t b???n">
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
                                Tin b??i n???i b???t
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{justifyContent: 'flex-end'}}>
                    <Button type="primary" htmlType="submit" className="mgr15">
                        Ho??n Th??nh
                    </Button>
                    <Button type="danger" onClick={() => BackDanhSach()}>
                        Quay l???i danh s??ch
                    </Button>
                </Row>
            </Form>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="C???p nh???t tin t???c" />
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
