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
import * as CommonConfigSerivce from '@app/services/CommonConfigService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    COMMONCONFIG_CLOSE_VIEWDETAIL,
    COMMONCONFIG_CLOSE_VIEWEDIT,
    COMMONCONFIG_EDIT_CLOSE,
    COMMONCONFIG_SEARCH_SAVE
} from '@app/store/ActionType/CommonConfigTypeAction';
import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigCreateAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();

    const {onCreateEntity, entityObj} = props;

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
                        <Modal.Title>Tạo mới cấu hình 12</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                code: '',
                                name: '',
                                data: ''
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
                                            Mã cấu hình
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
                                            Cấu hình
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
                                            Giá trị
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="data"
                                            key="data"
                                            className="form-control"
                                        />
                                        {errors.data && touched.data ? (
                                            <div className="invalid-feedback">
                                                {errors.data}
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

    return (
        <>
            <CreateModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onCreateEntity: (tintuc) => {
        CommonConfigSerivce.CreateNewEntity(dispatch, tintuc);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.commonConfig.lstEntity,
    IsUpdate: state.commonConfig.IsUpdate,
    entityObj: state.commonConfig.entityObj,
    showDetailModal: state.commonConfig.showDetailModal,
    showEditModal: state.commonConfig.showEditModal,
    isInit: state.commonConfig.isInit,
    searchModel: state.commonConfig.searchModel
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonConfigCreateAdm);
