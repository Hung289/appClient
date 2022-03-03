import React, {useState, useEffect, useRef} from 'react';
import * as Yup from 'yup';
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';
import {Link, StaticRouter, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';

const DangKyHienTangChangeStatus = (props) => {
    const {
        showChangeStatusModal,
        itemId,
        setshowChangeStatusModal,
        statusNew,
        onReloadPage
    } = props;
    const formRef = useRef();
    const formCreateEntity = useRef(null);
    const ChagneStatusSchema = Yup.object().shape({
        Message: Yup.string()
            .trim()
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
            .max(500, 'Vui lòng nhập không quá 255 ký tự')
        // .required('Vui lòng nhập thông tin này')
    });
    const submitChangeStatus = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    return (
        <>
            <Modal
                show={showChangeStatusModal}
                size="md"
                onHide={() => setshowChangeStatusModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thực hiện chuyển trạng thái</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            Id: itemId,
                            Status: statusNew,
                            Message: ''
                        }}
                        validationSchema={ChagneStatusSchema}
                        onSubmit={(values) => {
                            // onSaveChangeStatusEntity(ObjSave);
                            dangKyHienTangService
                                .ChangeStatusNewEntity(values)
                                .then((x) => {
                                    if (x.Status) {
                                        setshowChangeStatusModal(false);
                                        onReloadPage();
                                    }
                                });
                        }}
                    >
                        {({errors, touched}) => (
                            <Form ref={formCreateEntity}>
                                <Field type="hidden" name="Id" key="Id" />
                                <Field
                                    type="hidden"
                                    name="Status"
                                    key="Status"
                                />
                                <div className="form-group">
                                    <p>
                                        Thực hiện chuyển trạng thái từ sang{' '}
                                        {/* <b>
                                            {DangKyHienMoTangConstant.GetName(
                                                entityObj.Status
                                            )}
                                        </b>{' '}
                                        sang{' '} */}
                                        <b>
                                            {DangKyHienMoTangConstant.GetName(
                                                statusNew
                                            )}
                                        </b>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Message">Ghi chú</label>
                                    <Field
                                        as="textarea"
                                        rows={3}
                                        name="Message"
                                        key="Message"
                                        className="form-control"
                                    />
                                    {errors.Message && touched.Message ? (
                                        <div className="invalid-feedback">
                                            {errors.Message}
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
                        onClick={() => setshowChangeStatusModal(false)}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={submitChangeStatus}>
                        Hoàn thành
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default DangKyHienTangChangeStatus;
