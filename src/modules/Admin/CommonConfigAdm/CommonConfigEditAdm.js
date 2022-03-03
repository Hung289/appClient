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
import {COMMONCONFIG_EDIT_CLOSE} from '@app/store/ActionType/CommonConfigTypeAction';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigEditAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();

    const {
        onCloseEntityEditModal,
        showEditModal,
        entityObj,
        onSaveEditEntity
    } = props;

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
                        <Modal.Title>Cập nhật cấu hình chung</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                id: entityObj.Id,
                                code: entityObj.Code,
                                name: entityObj.Name,
                                data: entityObj.Data
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
                                            Tên cấu hình
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
                                        <label htmlFor="data">Giá trị</label>
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

    return (
        <>
            <EditModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditEntity: (id) => {
        CommonConfigSerivce.OpenEditModalSV(dispatch, id);
    },
    onSaveEditEntity: (tintuc) => {
        CommonConfigSerivce.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: COMMONCONFIG_EDIT_CLOSE});
    }
});
const mapStateToProps = (state) => ({
    IsUpdate: state.commonConfig.IsUpdate,
    entityObj: state.commonConfig.entityObj,
    showEditModal: state.commonConfig.showEditModal
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonConfigEditAdm);
