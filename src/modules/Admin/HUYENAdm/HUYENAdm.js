import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as HUYENService from '@app/services/HUYENService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    HUYEN_CLOSE_VIEWDETAIL,
    HUYEN_CLOSE_VIEWEDIT,
    HUYEN_EDIT_CLOSE,
    HUYEN_SEARCH_SAVE
} from '@app/store/ActionType/HUYENTypeAction';
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
const HUYENAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {MaTinh} = useParams();
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
        searchModel,
        TinhInfo,
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
                    TinhId: MaTinh
                };
            }
            LoadPerrentInfo(MaTinh);
            LoadEntityData(objSearch, MaTinh);
        }
    });
    const SignupSchema = Yup.object().shape({
        TenHuyen: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        MaHuyen: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(10, 'Vui lòng nhập không quá 10 ký tự')
            .required('Vui lòng nhập thông tin này'),
        Loai: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
    });

    const SearchSchema = Yup.object().shape({
        MaHuyenFilter: Yup.string(),
        TenHuyenFilter: Yup.string(),
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
                            Tạo mới Quận/ Huyện của {TinhInfo.TenTinh}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                TenHuyen: '',
                                MaHuyen: '',
                                Loai: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values,
                                    TinhId: MaTinh
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
                                            name="MaHuyen"
                                            key="MaHuyen"
                                            className="form-control "
                                        />
                                        {errors.MaHuyen && touched.MaHuyen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.MaHuyen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="TenHuyen">
                                            Tên đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TenHuyen"
                                            key="TenHuyen"
                                            className="form-control "
                                        />
                                        {errors.TenHuyen && touched.TenHuyen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TenHuyen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="Loai">
                                            Loại
                                            <span className="red">*</span>
                                        </label>

                                        <Field
                                            as="select"
                                            name="Loai"
                                            key="Loai"
                                            className="form-control "
                                        >
                                            <option value="">--Chọn--</option>
                                            <option value="Quận">Quận</option>
                                            <option value="Huyện">Huyện</option>
                                            <option value="Thành phố thuộc tỉnh">
                                                Thành phố thuộc tỉnh
                                            </option>
                                            <option value="Thị Xã">
                                                Thị Xã
                                            </option>
                                            <option value="Thành phố thuộc thành phố trực thuộc trung ương">
                                                Thành phố thuộc thành phố trực
                                                thuộc trung ương
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
                            Cập nhật Quận/ Huyện của {TinhInfo.TenTinh}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityObj.Id,
                                TinhId: entityObj.TinhId,
                                TenHuyen: entityObj.TenHuyen,
                                MaHuyen: entityObj.MaHuyen,
                                Loai: entityObj.Loai
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values
                                const ObjSave = {
                                    ...values,
                                    TinhId: entityObj.TinhId
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
                                            Mã đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="MaHuyen"
                                            key="MaHuyen"
                                            className="form-control "
                                        />
                                        {errors.MaHuyen && touched.MaHuyen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.MaHuyen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="TenHuyen">
                                            Tên đơn vị
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            name="TenHuyen"
                                            key="TenHuyen"
                                            className="form-control "
                                        />
                                        {errors.TenHuyen && touched.TenHuyen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.TenHuyen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="Loai">
                                            Loại
                                            <span className="red">*</span>
                                        </label>

                                        <Field
                                            as="select"
                                            name="Loai"
                                            key="Loai"
                                            className="form-control "
                                        >
                                            <option value="">--Chọn--</option>
                                            <option value="Quận">Quận</option>
                                            <option value="Huyện">Huyện</option>
                                            <option value="Thành phố thuộc tỉnh">
                                                Thành phố thuộc tỉnh
                                            </option>
                                            <option value="Thị Xã">
                                                Thị Xã
                                            </option>
                                            <option value="Thành phố thuộc thành phố trực thuộc trung ương">
                                                Thành phố thuộc thành phố trực
                                                thuộc trung ương
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

    // function DetailModal() {
    //     return (
    //         <>
    //             <Modal
    //                 show={showDetailModal}
    //                 size="lg"
    //                 onHide={() => onCloseEntityModal()}
    //             >
    //                 <Modal.Header closeButton>
    //                     <Modal.Title>Chi tiết đơn vị hành chính trực thuộc tỉnh/ thành phố</Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body>
    //                     <ListGroup className="list-group-flush">
    //                         <ListGroupItem>
    //                             <dl className="row">
    //                                 <dt className="col-sm-2">Tên đơn vị hành chính trực thuộc tnh</dt>
    //                                 <dd className="col-sm-10">
    //                                     {entityObj.Name}
    //                                 </dd>
    //                             </dl>
    //                         </ListGroupItem>

    //                         <ListGroupItem>
    //                             <dl className="row">
    //                                 <dt className="col-sm-2">Mã đơn vị hành chính trực thuộc tnh</dt>
    //                                 <dd className="col-sm-10">
    //                                     {entityObj.Code}
    //                                 </dd>
    //                             </dl>
    //                         </ListGroupItem>
    //                         <ListGroupItem>
    //                             <dl className="row">
    //                                 <dt className="col-sm-2">Thứ tự</dt>
    //                                 <dd className="col-sm-10">
    //                                     {entityObj.Priority}
    //                                 </dd>
    //                             </dl>
    //                         </ListGroupItem>
    //                     </ListGroup>
    //                 </Modal.Body>
    //                 <Modal.Footer>
    //                     <Button
    //                         variant="secondary"
    //                         onClick={() => onCloseEntityModal()}
    //                     >
    //                         Đóng
    //                     </Button>
    //                 </Modal.Footer>
    //             </Modal>
    //         </>
    //     );
    // }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message:
                'Bạn chắc chắn muốn xóa bỏ đơn vị hành chính trực thuộc tỉnh/ thành phố này.',
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
            title:
                'Xác nhận xóa các đơn vị hành chính trực thuộc tỉnh/ thành phố này?',
            message:
                'Bạn chắc chắn muốn xóa bỏ các đơn vị hành chính trực thuộc tỉnh/ thành phố này.',
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
                                            MaHuyenFilter:
                                                searchModel.MaHuyenFilter,
                                            TenHuyenFilter:
                                                searchModel.TenHuyenFilter,
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
                                                            <label htmlFor="MaHuyenFilter">
                                                                Mã đơn vị
                                                            </label>
                                                            <Field
                                                                name="MaHuyenFilter"
                                                                key="MaHuyenFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.MaHuyenFilter &&
                                                            touched.MaHuyenFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.MaHuyenFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TenHuyenFilter">
                                                                Tên đơn vị
                                                            </label>
                                                            <Field
                                                                name="TenHuyenFilter"
                                                                key="TenHuyenFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.TenHuyenFilter &&
                                                            touched.TenHuyenFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TenHuyenFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="LoaiFilter">
                                                                Loại
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
                                                                <option value="Quận">
                                                                    Quận
                                                                </option>
                                                                <option value="Huyện">
                                                                    Huyện
                                                                </option>
                                                                <option value="Thành phố thuộc tỉnh">
                                                                    Thành phố
                                                                    thuộc tỉnh
                                                                </option>
                                                                <option value="Thị Xã">
                                                                    Thị Xã
                                                                </option>
                                                                <option value="Thành phố thuộc thành phố trực thuộc trung ương">
                                                                    Thành phố
                                                                    thuộc thành
                                                                    phố trực
                                                                    thuộc trung
                                                                    ương
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
                {/* <DetailModal /> */}

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
                                                        {item.MaHuyen}
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
                                                                <Dropdown.Item>
                                                                    <Link
                                                                        className="MauDen"
                                                                        to={`/admin/Xa/${item.MaHuyen}`}
                                                                    >
                                                                        <span className="boxIcon">
                                                                            <i className="fas fa-info-circle" />
                                                                        </span>
                                                                        <span>
                                                                            Danh
                                                                            sách
                                                                            Xã/
                                                                            Phường/
                                                                            Thị
                                                                            trấn
                                                                        </span>
                                                                    </Link>
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

                                            <td>{item.TenHuyen}</td>
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
                ModuleName={`Danh sách Quận/ Huyện/ Thị xã ${TinhInfo.TenTinh}`}
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
                                            to="/admin/Tinh"
                                        >
                                            <span className="boxIcon">
                                                <i className="fas fa-reply" />
                                            </span>
                                            <span>
                                                Danh sách tỉnh/ thành phố
                                            </span>
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
    LoadPerrentInfo: (MaTinh) => {
        HUYENService.LoadParrentInfo(dispatch, MaTinh);
    },
    LoadEntityData: (objSearch, MaTinh) => {
        HUYENService.LoadEntity(dispatch, objSearch, MaTinh);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: HUYEN_SEARCH_SAVE, searchModel: objSearch});
    },

    onOpenDetailModal: (id) => {
        HUYENService.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: HUYEN_CLOSE_VIEWDETAIL});
    },
    onCreateEntity: (tintuc) => {
        HUYENService.CreateNewEntity(dispatch, tintuc);
    },
    onDeleteEntity: (id) => {
        HUYENService.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        HUYENService.DeleteMultiEntity(dispatch, id);
    },
    onEditEntity: (id) => {
        HUYENService.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        HUYENService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: HUYEN_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.huyen.lstEntity,
    TinhInfo: state.huyen.TinhInfo,
    IsUpdate: state.huyen.IsUpdate,
    entityObj: state.huyen.entityObj,
    showDetailModal: state.huyen.showDetailModal,
    showEditModal: state.huyen.showEditModal,
    isInit: state.huyen.isInit,
    searchModel: state.huyen.searchModel
});

export default connect(mapStateToProps, mapDispatchToProps)(HUYENAdm);
