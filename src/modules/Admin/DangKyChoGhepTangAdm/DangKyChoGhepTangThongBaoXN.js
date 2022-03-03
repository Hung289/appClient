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
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import TimePicker from 'react-time-picker';

const DangKyChoGhepTangThongBaoXN = (props) => {
    const {showModal, itemId, setshowModal, onReloadPage} = props;
    const formRef = useRef();
    const formCreateEntity = useRef(null);
    const ThongBaoXNSchema = Yup.object().shape({
        ThoiGian: Yup.string().required('Vui lòng nhập thông tin này'),
        NgayHen: Yup.date()
            .default(function () {
                return new Date();
            })
            .required('Vui lòng nhập thông tin này'),
        LyDo: Yup.string().required('Vui lòng nhập thông tin này')
    });
    const submitHenKham = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    return (
        <>
            <Modal
                show={showModal}
                size="md"
                onHide={() => setshowModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo mời đến xét nghiệm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            IdObj: itemId,
                            ThoiGian: '',
                            NgayHen: '',
                            LyDo: ''
                        }}
                        validationSchema={ThongBaoXNSchema}
                        onSubmit={(values) => {
                            dangKyChoGhepTangService
                                .SaveThongBaoXN(values)
                                .then((x) => {
                                    setshowModal(false);
                                    onReloadPage();
                                });
                        }}
                    >
                        {({errors, touched, setFieldValue}) => (
                            <Form ref={formCreateEntity}>
                                <Field type="hidden" name="IdObj" key="IdObj" />
                                <div className="form-group ">
                                    <label htmlFor="ThoiGian">
                                        Thời gian
                                        <span className="red">*</span>
                                    </label>
                                    <Field name="ThoiGian">
                                        {({
                                            field, // { name, value, onChange, onBlur }
                                            // form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                            meta
                                        }) => (
                                            <div>
                                                <TimePicker
                                                    key="ThoiGian"
                                                    format="HH:mm"
                                                    name="ThoiGian"
                                                    value={field.value}
                                                    onChange={(val) => {
                                                        setFieldValue(
                                                            'ThoiGian',
                                                            val
                                                        );
                                                    }}
                                                    className="form-control"
                                                    disableClock
                                                />
                                                {meta.touched && meta.error && (
                                                    <div className="invalid-feedback">
                                                        {meta.error}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Field>

                                    {errors.NgayHen && touched.NgayHen ? (
                                        <>
                                            <div className="invalid-feedback">
                                                {errors.NgayHen}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className="form-group ">
                                    <label htmlFor="NgayHen">
                                        Ngày hẹn
                                        <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="date"
                                        name="NgayHen"
                                        key="NgayHen"
                                        className="form-control "
                                    />
                                    {errors.NgayHen && touched.NgayHen ? (
                                        <>
                                            <div className="invalid-feedback">
                                                {errors.NgayHen}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="LyDo">
                                        Lý do<span className="red">*</span>
                                    </label>
                                    <Field
                                        as="textarea"
                                        rows={3}
                                        name="LyDo"
                                        key="LyDo"
                                        className="form-control"
                                    />
                                    {errors.LyDo && touched.LyDo ? (
                                        <div className="invalid-feedback">
                                            {errors.LyDo}
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
                        onClick={() => setshowModal(false)}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={submitHenKham}>
                        Hoàn thành
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default DangKyChoGhepTangThongBaoXN;
