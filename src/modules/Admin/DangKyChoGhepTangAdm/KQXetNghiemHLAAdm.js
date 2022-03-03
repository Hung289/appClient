import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as CommonUtility from '@modules/Common/CommonUtility';
import TimePicker from 'react-time-picker';
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    Tabs,
    Tab
} from 'react-bootstrap';
import {Link, useParams, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as KQXetNghiemHLAService from '@app/services/KQXetNghiemHLAService';
import * as Yup from 'yup';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemHLAAdm = (props) => {
    const {showCreateKQHLA, setshowCreateKQHLA, DataKQHLA, LoadData} = props;

    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);

    const onCreateHLAEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemHLAService.CreateNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();
                setshowCreateKQHLA(false);
            }
        });
    };
    const onSaveEditHLAEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemHLAService.EditNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();

                setshowCreateKQHLA(false);
            }
        });
    };
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    const SignupSchema = Yup.object().shape({
        HLAA: Yup.string().nullable(),
        HLAB: Yup.string().nullable(),
        HLADRB1: Yup.string().nullable(),
        HLADQA1: Yup.string().nullable(),
        HLADQB1: Yup.string().nullable()
    });
    function CreateModal() {
        return (
            <>
                <Modal
                    show={showCreateKQHLA}
                    dialogClassName="modal-90w"
                    onHide={() => {
                        setshowCreateKQHLA(false);
                    }}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật kết quả xét nghiệm HLA
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: DataKQHLA.Id,
                                IdPhieu: DataKQHLA.IdPhieu,
                                HLAA: DataKQHLA.HLAA,
                                HLAB: DataKQHLA.HLAB,
                                HLADRB1: DataKQHLA.HLADRB1,
                                HLADQA1: DataKQHLA.HLADQA1,
                                HLADQB1: DataKQHLA.HLADQB1
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    DataKQHLA.Id !== 0 &&
                                    DataKQHLA.Id !== undefined
                                ) {
                                    onSaveEditHLAEntity(ObjSave);
                                } else {
                                    onCreateHLAEntity(ObjSave);
                                }
                            }}
                        >
                            {({errors, touched, values, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />

                                    <Field
                                        type="hidden"
                                        name="IdPhieu"
                                        key="IdPhieu"
                                    />
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="HLAA">A</label>
                                            <Field
                                                name="HLAA"
                                                key="HLAA"
                                                className="form-control "
                                            />
                                            {errors.HLAA && touched.HLAA ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HLAA}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="HLAB">B</label>
                                            <Field
                                                name="HLAB"
                                                key="HLAB"
                                                className="form-control "
                                            />
                                            {errors.HLAB && touched.HLAB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HLAB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="HLADRB1">
                                                DRB1{' '}
                                            </label>
                                            <Field
                                                name="HLADRB1"
                                                key="HLADRB1"
                                                className="form-control "
                                            />
                                            {errors.HLADRB1 &&
                                            touched.HLADRB1 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HLADRB1}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="HLADQA1">
                                                DQA1
                                            </label>
                                            <Field
                                                name="HLADQA1"
                                                key="HLADQA1"
                                                className="form-control "
                                            />
                                            {errors.HLADQA1 &&
                                            touched.HLADQA1 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HLADQA1}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="HLADQB1">
                                                DQB1{' '}
                                            </label>
                                            <Field
                                                name="HLADQB1"
                                                key="HLADQB1"
                                                className="form-control "
                                            />
                                            {errors.HLADQB1 &&
                                            touched.HLADQB1 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HLADQB1}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setshowCreateKQHLA(false);
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitCreate();
                                canhbaoErrorModal(formRef);
                            }}
                        >
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

export default KQXetNghiemHLAAdm;
