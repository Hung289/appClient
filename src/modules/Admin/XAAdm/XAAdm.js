import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as XAService from '@app/services/XAService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    XA_CLOSE_VIEWDETAIL,
    XA_CLOSE_VIEWEDIT,
    XA_EDIT_CLOSE,
    XA_SEARCH_SAVE
} from '@app/store/ActionType/XATypeAction';
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
const XAAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {MaHuyen} = useParams();
    const {
        LoadEntityData,
        LoadPerrentInfo,
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
        HuyenInfo,
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
                    HuyenId: MaHuyen
                };
            }
            LoadPerrentInfo(MaHuyen);
            LoadEntityData(objSearch, MaHuyen);
        }
    });
    const SignupSchema = Yup.object().shape({
        MaXa: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(10, 'Vui lòng nhập không quá 10 ký tự')
            .required('Vui lòng nhập thông tin này'),
        TenXa: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        Loai: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        MaXaFilter: Yup.string(),
        TenXaFilter: Yup.string(),
        LoaiFilter: Yup.string()
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
                        <Modal.Title>
                            Tạo mới Xã/ Phường/ Thị trấn của{' '}
                            {HuyenInfo.TenHuyen}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                MaXa: '',
                                TenXa: '',
                                Loai: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values,
                                    HuyenId: MaHuyen
                                };
                                // same shape as initial values

                                onCreateEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Mã đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="MaXa"
                                            key="MaXa"
                                            className="form-control "
                                        />
                                        {errors.MaXa && touched.MaXa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.MaXa}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="TenXa">
                                            Tên đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TenXa"
                                            key="TenXa"
                                            className="form-control "
                                        />
                                        {errors.TenXa && touched.TenXa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TenXa}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Loai">Loại</label>
                                        <span className="red">*</span>
                                        <Field
                                            as="select"
                                            name="Loai"
                                            key="Loai"
                                            className="form-control "
                                        >
                                            <option value="">--Chọn--</option>
                                            <option value="Xã">Xã</option>
                                            <option value="Phường">
                                                Phường
                                            </option>
                                            <option value="Thị trấn">
                                                Thị trấn
                                            </option>
                                        </Field>
                                        {errors.Loai && touched.Loai ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Loai}
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
                        <Modal.Title>
                            Cập nhật Xã/ Phường/ Thị trấn của{' '}
                            {HuyenInfo.TenHuyen}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityObj.Id,
                                HuyenId: entityObj.HuyenId,
                                MaXa: entityObj.MaXa,
                                TenXa: entityObj.TenXa,
                                Loai: entityObj.Loai
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    HuyenId: entityObj.HuyenId
                                };
                                // same shape as initial values

                                onSaveEditEntity(ObjSave);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />

                                    <div className="form-group">
                                        <label htmlFor="MaXa">
                                            Mã đươn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="MaXa"
                                            key="MaXa"
                                            className="form-control "
                                        />
                                        {errors.MaXa && touched.MaXa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.MaXa}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="TenXa">
                                            Tên đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TenXa"
                                            key="TenXa"
                                            className="form-control "
                                        />
                                        {errors.TenXa && touched.TenXa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TenXa}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Loai">Loại</label>
                                        <span className="red">*</span>
                                        <Field
                                            as="select"
                                            name="Loai"
                                            key="Loai"
                                            className="form-control "
                                        >
                                            <option value="">--Chọn--</option>
                                            <option value="Xã">Xã</option>
                                            <option value="Phường">
                                                Phường
                                            </option>
                                            <option value="Thị trấn">
                                                Thị trấn
                                            </option>
                                        </Field>
                                        {errors.Loai && touched.Loai ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.Loai}
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
                        <Modal.Title>Chi tiết danh mục</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên danh mục</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mã danh mục</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Code}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Thứ tự</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Priority}
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
            message: 'Bạn chắc chắn muốn xóa bỏ danh mục này.',
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
            title: 'Xác nhận xóa các danh mục này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các danh mục này.',
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
                                            MaXaFilter: searchModel.MaXaFilter,
                                            TenXaFilter:
                                                searchModel.TenXaFilter,
                                            LoaiFilter: searchModel.LoaiFilter
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
                                                            <label htmlFor="MaXaFilter">
                                                                Mã đơn vị
                                                            </label>
                                                            <Field
                                                                name="MaXaFilter"
                                                                key="MaXaFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.MaXaFilter &&
                                                            touched.MaXaFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.MaXaFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TenXaFilter">
                                                                Tên đơn vị
                                                            </label>
                                                            <Field
                                                                name="TenXaFilter"
                                                                key="TenXaFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.TenXaFilter &&
                                                            touched.TenXaFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TenXaFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="LoaiFilter">
                                                                Loại
                                                                <span className="red">
                                                                    *
                                                                </span>
                                                            </label>

                                                            <Field
                                                                as="select"
                                                                name="LoaiFilter"
                                                                key="LoaiFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Chọn--
                                                                </option>
                                                                <option value="Xã">
                                                                    Xã
                                                                </option>
                                                                <option value="Phường">
                                                                    Phường
                                                                </option>
                                                                <option value="Thị trấn">
                                                                    Thị trấn
                                                                </option>
                                                            </Field>
                                                            {errors.LoaiFilter &&
                                                            touched.LoaiFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.LoaiFilter
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

                                <th scope="col">Mã đơn vị</th>
                                <th scope="col">Tên đơn vị</th>
                                <th scope="col">Loại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lstItem.length > 0 ? (
                                lstItem.map((item, key) => {
                                    const rIndex = pageInd * pageSiz + key + 1;
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
                                                        {item.MaXa}
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
                                                                {/* <Dropdown.Item
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
                                                                </Dropdown.Item> */}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{item.TenXa}</td>
                                            <td>{item.Loai}</td>
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

                                <th scope="col">Mã đơn vị</th>
                                <th scope="col">Tên đơn vị</th>
                                <th scope="col">Loại</th>
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
            <AdminSecsionHead
                ModuleName={`Danh sách Xã/ Phường/ Thị trấn ${HuyenInfo.TenHuyen}`}
            />
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
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                    >
                                        <Link
                                            className="MauDen"
                                            to={`/admin/Huyen/${HuyenInfo.TinhId}`}
                                        >
                                            <span className="boxIcon">
                                                <i className="fas fa-reply" />
                                            </span>
                                            <span>Danh sách Quận/ Huyện</span>
                                        </Link>
                                    </Button>
                                    {/* <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay lại
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
    LoadPerrentInfo: (MaHuyen) => {
        XAService.LoadParrentInfo(dispatch, MaHuyen);
    },
    LoadEntityData: (objSearch, MaHuyen) => {
        XAService.LoadEntity(dispatch, objSearch, MaHuyen);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: XA_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        XAService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: XA_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        XAService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        XAService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        XAService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        XAService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        XAService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: XA_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.xa.lstEntity,
    HuyenInfo: state.xa.HuyenInfo,
    IsUpdate: state.xa.IsUpdate,
    entityObj: state.xa.entityObj,
    showDetailModal: state.xa.showDetailModal,
    showEditModal: state.xa.showEditModal,
    isInit: state.xa.isInit,
    searchModel: state.xa.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(XAAdm);
