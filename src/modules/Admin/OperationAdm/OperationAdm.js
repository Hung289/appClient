import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as duLieuDanhMucService from '@app/services/operationService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    OPERATION_CLOSE_VIEWDETAIL,
    OPERATION_CLOSE_VIEWEDIT,
    OPERATION_EDIT_CLOSE,
    OPERATION_SEARCH_SAVE
} from '@app/store/ActionType/OperationTypeAction';
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
import {Link, useHistory, useParams} from 'react-router-dom';
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
const OperationAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {moduleId} = useParams();
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
                    PageSize: 20,
                    ModuleId: moduleId
                };
            }
            LoadEntityData(objSearch, moduleId);
        }
    });
    const SignupSchema = Yup.object().shape({
        Name: Yup.string()
            .trim()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y')
    });

    const SearchSchema = Yup.object().shape({});

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
                    T???o m???i
                </Button>

                <Modal show={show} size="lg" onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>T???o m???i thao t??c</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Name: '',
                                URL: '',
                                Code: '',
                                Css: '',
                                IsShow: false,
                                Order: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values,
                                    ModuleId: moduleId
                                };
                                // same shape as initial values

                                onCreateEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            M?? thao t??c
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
                                    <div className="form-group">
                                        <label htmlFor="Name">
                                            T??n thao t??c
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
                                        <label htmlFor="URL">???????ng d???n</label>
                                        <Field
                                            name="URL"
                                            key="URL"
                                            className="form-control"
                                        />
                                        {errors.URL && touched.URL ? (
                                            <div className="invalid-feedback">
                                                {errors.URL}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Order">Th??? t???</label>
                                        <Field
                                            type="number"
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
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsShow"
                                            key="IsShow"
                                            id="IsShow"
                                            className="custom-control-input"
                                        />
                                        <label
                                            htmlFor="IsShow"
                                            className="custom-control-label"
                                        >
                                            Hi???n th????
                                        </label>
                                        {errors.IsShow && touched.IsShow ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.IsShow}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Css">Css</label>
                                        <Field
                                            name="Css"
                                            key="Css"
                                            className="form-control "
                                        />
                                        {errors.Css && touched.Css ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Css}
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
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitCreate}>
                            Ho??n th??nh
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
                        <Modal.Title>C???p nh???t thao t??c</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityObj.Id,
                                ModuleId: entityObj.ModuleId,
                                Name: entityObj.Name,
                                URL: entityObj.URL,
                                Code: entityObj.Code,
                                Css: entityObj.Css,
                                IsShow: entityObj.IsShow,
                                Order: entityObj.Order
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    ModuleId: entityObj.ModuleId
                                };
                                // same shape as initial values

                                onSaveEditEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />

                                    <div className="form-group">
                                        <label htmlFor="title">
                                            M?? thao t??c
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
                                    <div className="form-group">
                                        <label htmlFor="Name">
                                            T??n thao t??c
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
                                        <label htmlFor="URL">???????ng d???n</label>
                                        <Field
                                            name="URL"
                                            key="URL"
                                            className="form-control"
                                        />
                                        {errors.URL && touched.URL ? (
                                            <div className="invalid-feedback">
                                                {errors.URL}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Order">Th??? t???</label>
                                        <Field
                                            type="number"
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
                                    <div className="mb-3 custom-control custom-checkbox">
                                        <Field
                                            type="checkbox"
                                            name="IsShow"
                                            key="IsShow"
                                            id="IsShow"
                                            className="custom-control-input"
                                        />
                                        <label
                                            htmlFor="IsShow"
                                            className="custom-control-label"
                                        >
                                            Hi???n th????
                                        </label>
                                        {errors.IsShow && touched.IsShow ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.IsShow}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Css">Css</label>
                                        <Field
                                            name="Css"
                                            key="Css"
                                            className="form-control "
                                        />
                                        {errors.Css && touched.Css ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Css}
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
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitEdit}>
                            Ho??n th??nh
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
                        <Modal.Title>Chi ti???t thao t??c</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">T??n thao t??c</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">M?? thao t??c</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Code}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Th??? t???</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Order}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">???????ng d???n</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.URL}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Hi???n th???</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.IsShow}
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
                            ????ng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? thao t??c n??y.',
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
            title: 'X??c nh???n x??a c??c thao t??c n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c thao t??c n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
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
                            <Card>
                                <Card.Header>
                                    <strong>T??m ki???m</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
                                        initialValues={{
                                            QueryName: searchModel.QueryName,
                                            QueryIsShow: searchModel.QueryIsShow
                                        }}
                                        validationSchema={SearchSchema}
                                        onSubmit={(values) => {
                                            // const toSubmit = values;
                                            // if (
                                            //     toSubmit.IsVisibleFilter ===
                                            //     'On'
                                            // ) {
                                            //     toSubmit.IsVisibleFilter = true;
                                            // } else if (
                                            //     toSubmit.IsVisibleFilter ===
                                            //     'Off'
                                            // ) {
                                            //     toSubmit.IsVisibleFilter = false;
                                            // } else {
                                            //     toSubmit.IsVisibleFilter = null;
                                            // }

                                            // if (
                                            //     toSubmit.IsLinkActiveFilter ===
                                            //     'On'
                                            // ) {
                                            //     toSubmit.IsLinkActiveFilter = true;
                                            // } else if (
                                            //     toSubmit.IsLinkActiveFilter ===
                                            //     'Off'
                                            // ) {
                                            //     toSubmit.IsLinkActiveFilter = false;
                                            // } else {
                                            //     toSubmit.IsLinkActiveFilter = null;
                                            // }

                                            onSubmitSearchSave(values);
                                        }}
                                    >
                                        {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="QueryName">
                                                                T??n
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
                                                            <label htmlFor="QueryIsShow">
                                                                Hi???n th???
                                                            </label>
                                                            <Field
                                                                name="QueryIsShow"
                                                                key="QueryIsShow"
                                                                className="form-control "
                                                            />
                                                            {errors.QueryIsShow &&
                                                            touched.QueryIsShow ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.NameFilter
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
                                                            T??m ki???m
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

                                <th scope="col">M?? thao t??c</th>
                                <th scope="col">T??n thao t??c</th>
                                <th scope="col">Th??? t???</th>
                                <th scope="col">???????ng d???n</th>
                                <th scope="col">Hi???n th???</th>
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
                                                                        S???a
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
                                                                        X??a
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
                                                                        ti???t
                                                                    </span>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{item.Name}</td>
                                            <td>{item.Order}</td>
                                            <td>{item.URL}</td>
                                            <td>
                                                {item.IsShow
                                                    ? 'Hi???n th???'
                                                    : 'Kh??ng hi???n th???'}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <NotDataToShow colNum={6} />
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

                                <th scope="col">M?? thao t??c</th>
                                <th scope="col">T??n thao t??c</th>
                                <th scope="col">Th??? t???</th>
                                <th scope="col">???????ng d???n</th>
                                <th scope="col">Hi???n th???</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            T???ng s??? {lstEntity.Count} b???n ghi trang hi???n t???i -
                            t???ng s??? {lstEntity.TotalPage} trang
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
            <AdminSecsionHead ModuleName="Qu???n l?? d??? li???u thao t??c" />
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
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => DeleteMulTiBtnAction()}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        />{' '}
                                        X??a
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                    >
                                        <Link
                                            className="MauDen"
                                            to="/admin/Module"
                                        >
                                            <span className="boxIcon">
                                                <i className="fas fa-reply" />
                                            </span>
                                            <span>
                                                Quay l???i danh s??ch ch???c n??ng
                                            </span>
                                        </Link>
                                    </Button>
                                    {/* <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay l???i
                                    </Button> */}
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
    LoadEntityData: (objSearch, moduleId) => {
        duLieuDanhMucService.LoadEntity(dispatch, objSearch, moduleId);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: OPERATION_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        duLieuDanhMucService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: OPERATION_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        duLieuDanhMucService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        duLieuDanhMucService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        duLieuDanhMucService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        duLieuDanhMucService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        duLieuDanhMucService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: OPERATION_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.operation.lstEntity,
    IsUpdate: state.operation.IsUpdate,
    entityObj: state.operation.entityObj,
    showDetailModal: state.operation.showDetailModal,
    showEditModal: state.operation.showEditModal,
    isInit: state.operation.isInit,
    searchModel: state.operation.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationAdm);
