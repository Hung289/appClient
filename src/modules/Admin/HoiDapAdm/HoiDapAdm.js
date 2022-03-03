import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
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
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
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
        noiDungCauHoi: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        NoiDungCauHoiFilter: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        DienThoaiFilter: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        HoTenFilter: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        EmailFilter: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        IsPhatHanhFilter: Yup.string().nullable()
    });

    const [test, settest] = useState(true);

    function CreateModal() {
        const [createEditor, setCreateEditor] = useState('');
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
                        <Modal.Title>Tạo mới hỏi đáp</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                hoTen: '',
                                dienThoai: '',
                                email: '',
                                donVi: '',
                                noiDungCauHoi: '',
                                traLoiCauHoi: '',
                                isPhatHanh: false
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values,
                                    traLoiCauHoi: createEditor
                                };
                                // same shape as initial values

                                onCreateEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="noiDungCauHoi">
                                            Câu hỏi
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="noiDungCauHoi"
                                            key="noiDungCauHoi"
                                            className="form-control "
                                        />
                                        {errors.noiDungCauHoi &&
                                        touched.noiDungCauHoi ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.noiDungCauHoi}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="traLoiCauHoi">
                                            Trả lời
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            name="traLoiCauHoi"
                                            data=""
                                            onReady={(editor) => {
                                                setCreateEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onChange={(event, editor) => {
                                                setCreateEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onBlur={(event, editor) => {
                                                setCreateEditor(
                                                    editor.getData()
                                                );
                                            }}
                                            onFocus={(event, editor) => {
                                                setCreateEditor(
                                                    editor.getData()
                                                );
                                            }}
                                        />
                                        {errors.traLoiCauHoi &&
                                        touched.traLoiCauHoi ? (
                                            <div className="invalid-feedback">
                                                {errors.traLoiCauHoi}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hoTen">Họ tên</label>
                                        <Field
                                            name="hoTen"
                                            key="hoTen"
                                            className="form-control "
                                        />
                                        {errors.hoTen && touched.hoTen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.hoTen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dienThoai">
                                            Điện thoại
                                        </label>
                                        <Field
                                            name="dienThoai"
                                            key="dienThoai"
                                            className="form-control "
                                        />
                                        {errors.dienThoai &&
                                        touched.dienThoai ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.dienThoai}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            name="email"
                                            key="email"
                                            className="form-control "
                                        />
                                        {errors.email && touched.email ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.email}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="isPhatHanh"
                                            key="isPhatHanh"
                                            id="isPhatHanh"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="isPhatHanh"
                                        >
                                            Xuất bản?
                                        </label>
                                        {errors.isPhatHanh &&
                                        touched.isPhatHanh ? (
                                            <div className="invalid-feedback">
                                                {errors.isPhatHanh}
                                            </div>
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
        const [EditEditor, setEditEditor] = useState('');
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
                        <Modal.Title>Cập nhật hỏi đáp</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
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
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    traLoiCauHoi: EditEditor
                                };
                                // same shape as initial values

                                onSaveEditEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="id" key="id" />

                                    <div className="form-group">
                                        <label htmlFor="noiDungCauHoi">
                                            Câu hỏi
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="noiDungCauHoi"
                                            key="noiDungCauHoi"
                                            className="form-control "
                                        />
                                        {errors.noiDungCauHoi &&
                                        touched.noiDungCauHoi ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.noiDungCauHoi}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="traLoiCauHoi">
                                            Trả lời
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            name="traLoiCauHoi"
                                            data={entityObj.TraLoiCauHoi}
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
                                        {errors.traLoiCauHoi &&
                                        touched.traLoiCauHoi ? (
                                            <div className="invalid-feedback">
                                                {errors.traLoiCauHoi}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hoTen">Họ tên</label>
                                        <Field
                                            name="hoTen"
                                            key="hoTen"
                                            className="form-control "
                                        />
                                        {errors.hoTen && touched.hoTen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.hoTen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dienThoai">
                                            Điện thoại
                                        </label>
                                        <Field
                                            name="dienThoai"
                                            key="dienThoai"
                                            className="form-control "
                                        />
                                        {errors.dienThoai &&
                                        touched.dienThoai ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.dienThoai}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            name="email"
                                            key="email"
                                            className="form-control "
                                        />
                                        {errors.email && touched.email ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.email}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="isPhatHanh"
                                            key="isPhatHanh"
                                            id="isPhatHanh"
                                            className="custom-control-input"
                                        />

                                        <label
                                            className="custom-control-label"
                                            htmlFor="isPhatHanh"
                                        >
                                            Xuất bản?
                                        </label>
                                        {errors.isPhatHanh &&
                                        touched.isPhatHanh ? (
                                            <div className="invalid-feedback">
                                                {errors.isPhatHanh}
                                            </div>
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
                        <Modal.Title>Chi tiết hỏi đáp</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Họ tên</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.HoTen}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Điện thoại</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.DienThoai}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Email</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Email}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Xuất bản</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.IsPhatHanh
                                            ? 'Đã xuất bản'
                                            : 'Chưa xuất bản'}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Câu hỏi</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.NoiDungCauHoi}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Trả lời</dt>
                                    <dd className="col-sm-10">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: entityObj.TraLoiCauHoi
                                            }}
                                        />
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
            message: 'Bạn chắc chắn muốn xóa bỏ hỏi đáp này.',
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
            title: 'Xác nhận xóa các hỏi đáp này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các hỏi đáp này.',
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
                <div className="container-fluid  mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
                                        initialValues={{
                                            NoiDungCauHoiFilter:
                                                searchModel.NoiDungCauHoiFilter,
                                            DienThoaiFilter:
                                                searchModel.DienThoaiFilter,
                                            HoTenFilter:
                                                searchModel.HoTenFilter,
                                            EmailFilter:
                                                searchModel.EmailFilter,
                                            IsPhatHanhFilter:
                                                searchModel.IsPhatHanhFilter
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
                                                            <label htmlFor="NoiDungCauHoiFilter">
                                                                Câu hỏi
                                                            </label>
                                                            <Field
                                                                name="NoiDungCauHoiFilter"
                                                                key="NoiDungCauHoiFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.NoiDungCauHoiFilter &&
                                                            touched.NoiDungCauHoiFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.NoiDungCauHoiFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="HoTenFilter">
                                                                Họ tên
                                                            </label>
                                                            <Field
                                                                name="HoTenFilter"
                                                                key="HoTenFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.HoTenFilter &&
                                                            touched.HoTenFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.HoTenFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="DienThoaiFilter">
                                                                Điện thoại
                                                            </label>
                                                            <Field
                                                                name="DienThoaiFilter"
                                                                key="DienThoaiFilter"
                                                                className="form-control"
                                                            />
                                                            {errors.DienThoaiFilter &&
                                                            touched.DienThoaiFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.DienThoaiFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="EmailFilter">
                                                                Email
                                                            </label>
                                                            <Field
                                                                name="EmailFilter"
                                                                key="EmailFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.EmailFilter &&
                                                            touched.EmailFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.EmailFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="IsPhatHanhFilter">
                                                                Xuất bản
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="IsPhatHanhFilter"
                                                                key="IsPhatHanhFilter"
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
                                                            {errors.IsPhatHanhFilter &&
                                                            touched.IsPhatHanhFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.IsPhatHanhFilter
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

                                <th scope="col" className="widthColTableMedium">
                                    Câu hỏi
                                </th>
                                <th scope="col">Xuất bản?</th>
                                <th scope="col">Họ tên</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Email</th>
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
                                                <div className="tableBoxMain">
                                                    <div className="tableBoxMain-label">
                                                        {item.NoiDungCauHoi}
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
                                            <td>
                                                {item.IsPhatHanh ? (
                                                    <i className="fas fa-check" />
                                                ) : (
                                                    <i className="fas fa-times" />
                                                )}
                                            </td>
                                            <td>{item.HoTen}</td>
                                            <td>{item.DienThoai}</td>
                                            <td>{item.Email}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={7} />
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

                                <th scope="col" className="widthColTableMedium">
                                    Câu hỏi
                                </th>
                                <th scope="col">Xuất bản?</th>
                                <th scope="col">Họ tên</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Email</th>
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
            <AdminSecsionHead ModuleName="Quản lý hỏi đáp" />
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
                                    {/* <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay lại
                                    </Button> */}
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
