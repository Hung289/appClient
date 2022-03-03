import React, {useState, useEffect, useRef} from 'react';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
import * as categoryNewsService from '@app/services/categoryNewsService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    CATEGORYNEWS_CLOSE_VIEWDETAIL,
    CATEGORYNEWS_CLOSE_VIEWEDIT,
    CATEGORYNEWS_EDIT_CLOSE,
    CATEGORYNEWS_SEARCH_SAVE
} from '@app/store/ActionType/CategoryNewsTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CatetoryNewsAdm = (props) => {
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
        code: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        name: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        name: Yup.string().trim().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });

    const [test, settest] = useState(true);

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
                        <Modal.Title>Tạo mới nhóm tin bài</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                code: '',
                                name: '',
                                description: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                // same shape as initial values

                                onCreateEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-group">
                                        <label htmlFor="code">
                                            Mã nhóm
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="code"
                                            key="code"
                                            className="form-control "
                                        />
                                        {errors.code && touched.code ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.code}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            Tên nhóm
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="name"
                                            key="name"
                                            className="form-control "
                                        />
                                        {errors.name && touched.name ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.name}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả
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
                        <Modal.Title>Cập nhật nhóm tin bài</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                id: entityObj.Id,
                                code: entityObj.Code,
                                name: entityObj.Name,
                                description: entityObj.Description
                            }}
                            validationSchema={SignupSchema}
                            vali
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values
                                };
                                // same shape as initial values

                                onSaveEditEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="id" key="id" />

                                    <div className="form-group">
                                        <label htmlFor="code">
                                            Mã nhóm
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="code"
                                            key="code"
                                            className="form-control "
                                        />
                                        {errors.code && touched.code ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.code}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            Tên nhóm
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="name"
                                            key="name"
                                            className="form-control "
                                        />
                                        {errors.name && touched.name ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.name}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả
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
                        <Modal.Title>Chi tiết nhóm tin bài</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mã nhóm</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Code}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên nhóm</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mô tả</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Description}
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
            message: 'Bạn chắc chắn muốn xóa bỏ nhóm tin bài này.',
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
            title: 'Xác nhận xóa các nhóm này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các nhóm này.',
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
                                            Name: searchModel.Name
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
                                                            <label htmlFor="inputEmail4">
                                                                Tên nhóm
                                                            </label>
                                                            <Field
                                                                name="Name"
                                                                key="Name"
                                                                className="form-control "
                                                            />
                                                            {errors.Name &&
                                                            touched.Name ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.Name
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
                                    Mã nhóm
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên nhóm
                                </th>
                                <th scope="col">Mô tả</th>
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
                                                        {item.Code}
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

                                            <td>{item.Name}</td>
                                            <td>{item.Description}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={5} />
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
                                    Mã nhóm
                                </th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên nhóm
                                </th>
                                <th scope="col">Mô tả</th>
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
                                aria-label="Page navigation"
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
            <AdminSecsionHead ModuleName="Quản lý Nhóm tin bài" />
            <RenderFormSearch />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
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
        categoryNewsService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: CATEGORYNEWS_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        categoryNewsService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: CATEGORYNEWS_CLOSE_VIEWDETAIL});
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
        categoryNewsService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        categoryNewsService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        categoryNewsService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        categoryNewsService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        categoryNewsService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: CATEGORYNEWS_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.categoryNews.lstEntity,
    IsUpdate: state.categoryNews.IsUpdate,
    entityObj: state.categoryNews.entityObj,
    showDetailModal: state.categoryNews.showDetailModal,
    showEditModal: state.categoryNews.showEditModal,
    isInit: state.categoryNews.isInit,
    searchModel: state.categoryNews.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(CatetoryNewsAdm);
