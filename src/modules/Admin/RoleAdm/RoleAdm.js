import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as roleService from '@app/services/roleService';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    ROLE_CLOSE_VIEWDETAIL,
    ROLE_CLOSE_VIEWEDIT,
    ROLE_EDIT_CLOSE,
    ROLE_SEARCH_SAVE
} from '@app/store/ActionType/RoleTypeAction';
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
import {removeAscent} from '@modules/Common/CommonUtility';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';
import AddOperation from './AddOperation';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const RoleAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const createEditor = useRef();
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

    const [useOperations, setuseOperations] = useState([]);
    const [lstOperationId, setlstOperationId] = useState([]);
    const [RoleId, setRoleId] = useState(0);
    const [isOpenModelOperation, setIsOpenModelOperation] = useState(false);
    function ToggleSearchPanel() {
        SetshowPanelSearch(!showPanelSearch);
    }

    // const [Isloaded, SetIsloaded] = useState(false);
    const OpenAddOpeation = (id) => {
        roleService.GetRoleOperaion(id).then((data) => {
            if (data.Status) {
                const arrAL = [];
                for (let idx = 0; idx < data.Data.length; idx += 1) {
                    const element = data.Data[idx];
                    if (element.LstOperation != null) {
                        for (
                            let jt = 0;
                            jt < element.LstOperation.length;
                            jt += 1
                        ) {
                            const elementChild = element.LstOperation[jt];
                            if (elementChild.IsAsign) {
                                arrAL.push(elementChild.Id);
                            }
                        }
                    }
                }
                setRoleId(id);
                setlstOperationId(arrAL);
                setuseOperations(data.Data);
                setIsOpenModelOperation(true);
            } else {
                toast.error(data.Message);
            }
        });
    };
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
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Thông tin này chỉ được sử dụng chữ cái và số',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z0-9 ]*$/.test(str);
                }
            ),
        Code: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Thông tin này chỉ được sử dụng chữ cái và số',
                (val) => /^[a-zA-Z0-9 ]*$/.test(val)
            )
    });

    const SearchSchema = Yup.object().shape({
        QueryName: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        QueryCode: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });

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
                        <Modal.Title>Tạo mới vai trò</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Name: '',
                                Code: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };

                                onCreateEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tên vai trò
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
                                        <label htmlFor="title">
                                            Mã vai trò
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="Code"
                                            key="Code"
                                            className="form-control "
                                        />
                                        {errors.Code && touched.Code ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Name}
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
                        <Modal.Title>Cập nhật vai trò</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityObj.Id,
                                Name: entityObj.Name,
                                Code: entityObj.Code
                            }}
                            validationSchema={SignupSchema}
                            vali
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                onSaveEditEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <div className="form-group">
                                        <label htmlFor="Name">
                                            Tên vai trò
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
                                        <label htmlFor="Code">
                                            Mã vai trò
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="Code"
                                            key="Code"
                                            className="form-control "
                                        />
                                        {errors.Code && touched.Code ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Code}
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
                        <Modal.Title>Chi tiết vai trò</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên vai trò</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mã vai trò</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Code}
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
            message: 'Bạn chắc chắn muốn xóa bỏ vai trò này.',
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
            title: 'Xác nhận xóa các vai trò này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các vai trò này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
                        } else {
                            toast.error('Vui lòng chọn ít nhất một bản ghi');
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
                                            QueryName: searchModel.QueryName,
                                            QueryCode: searchModel.QueryCode
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
                                                            <label htmlFor="QueryName">
                                                                Tên vai trò
                                                            </label>
                                                            <Field
                                                                name="QueryName"
                                                                key="QueryName"
                                                                className="form-control "
                                                            />
                                                            {errors.QueryName &&
                                                            touched.QueryName ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.QueryName
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="QueryCode">
                                                                Mã vai trò
                                                            </label>
                                                            <Field
                                                                name="QueryCode"
                                                                key="QueryCode"
                                                                className="form-control"
                                                            />
                                                            {errors.QueryCode &&
                                                            touched.QueryCode ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.QueryCode
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
            lstEntity !== undefined && lstEntity.TotalPage !== undefined
                ? lstEntity.TotalPage
                : 1;
        const curPage =
            lstEntity !== undefined && lstEntity.CurrentPage !== undefined
                ? lstEntity.CurrentPage
                : 1;
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
        if (lstEntity !== undefined && lstEntity.ListItem !== undefined) {
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
                                <th scope="col">Mã vai trò</th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên vai trò
                                </th>
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
                                            <td>{rIndex}</td>

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
                                                                        OpenAddOpeation(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-edit" />
                                                                    </span>
                                                                    <span>
                                                                        Thiết
                                                                        lập
                                                                        quyền
                                                                        vai trò
                                                                    </span>
                                                                </Dropdown.Item>
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
                                                {/* <div className="lstItemHover">
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-primary"
                                                        onClick={() =>
                                                            onEditEntity(
                                                                item.Id
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-edit" />{' '}
                                                        Sửa
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-danger"
                                                        onClick={() =>
                                                            DeleteAction(
                                                                item.Id
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-times" />{' '}
                                                        Xóa
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-info"
                                                        onClick={() =>
                                                            onOpenDetailModal(
                                                                item.Id
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-info-circle" />{' '}
                                                        Xem
                                                    </button>
                                                </div>
                                            */}
                                            </td>
                                            <td>{item.Name}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={4} />
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
                                <th scope="col">Mã vai trò</th>
                                <th scope="col" className="widthColTableMedium">
                                    Tên vai trò
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            Tổng số {lstEntity.Count} bản ghi- trên{' '}
                            {lstEntity.TotalPage} trang
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
            <AdminSecsionHead ModuleName="Quản lý vai trò" />
            <RenderFormSearch />
            <AddOperation
                ShowAddRole={isOpenModelOperation}
                setShowAddRole={setIsOpenModelOperation}
                Userid={RoleId}
                lstRole={useOperations}
                lstRoleId={lstOperationId}
            />

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
        roleService.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: ROLE_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        roleService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: ROLE_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        roleService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        roleService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        roleService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        roleService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        roleService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: ROLE_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.role.lstEntity,
    IsUpdate: state.role.IsUpdate,
    entityObj: state.role.entityObj,
    showDetailModal: state.role.showDetailModal,
    showEditModal: state.role.showEditModal,
    isInit: state.role.isInit,
    searchModel: state.role.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdm);
