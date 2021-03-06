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
import * as KQXetNghiemVGCService from '@app/services/KQXetNghiemHienVGCService';
import * as Yup from 'yup';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemHienVGCAdm = (props) => {
    const {showCreateKQVGC, setshowCreateKQVGC, DataKQVGC, LoadData} = props;

    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);

    const onCreateEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemVGCService.CreateNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();
                setshowCreateKQVGC(false);
            }
        });
    };
    const onSaveEditEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemVGCService.EditNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();

                setshowCreateKQVGC(false);
            }
        });
    };
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    const SignupSchema = Yup.object().shape({
        NgayXetNghiemVGC: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin')
            .typeError('Vui l??ng nh???p th??ng tin')
    });
    function CreateModal() {
        return (
            <>
                <Modal
                    show={showCreateKQVGC}
                    dialogClassName="modal-90w"
                    onHide={() => {
                        setshowCreateKQVGC(false);
                    }}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            C???p nh???t k???t qu??? x??t nghi???m vi??m gan C
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: DataKQVGC.Id,
                                IdPhieu: DataKQVGC.IdPhieu,
                                NgayXetNghiemVGC: CommonUtility.GetDateSetField(
                                    DataKQVGC.NgayXetNghiemVGC
                                ),
                                CoBiVGC: DataKQVGC.CoBiVGC,
                                KetQuaCopiesVGC: DataKQVGC.KetQuaCopiesVGC,
                                BiBaoGioVGC: DataKQVGC.BiBaoGioVGC,
                                CoDieuTriVGC: DataKQVGC.CoDieuTriVGC,
                                ThuocDieuTriVGC: DataKQVGC.ThuocDieuTriVGC,
                                NgayBatDauDieuTriVGC: CommonUtility.GetDateSetField(
                                    DataKQVGC.NgayBatDauDieuTriVGC
                                ),
                                NgayKetThucDieuTriVGC: CommonUtility.GetDateSetField(
                                    DataKQVGC.NgayKetThucDieuTriVGC
                                )
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    DataKQVGC.Id !== 0 &&
                                    DataKQVGC.Id !== undefined
                                ) {
                                    onSaveEditEntity(ObjSave);
                                } else {
                                    onCreateEntity(ObjSave);
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
                                        <div className="form-group col-md-4">
                                            <label htmlFor="NgayXetNghiemVGC">
                                                Ng??y th???c hi???n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayXetNghiemVGC"
                                                key="NgayXetNghiemVGC"
                                                className="form-control "
                                            />
                                            {errors.NgayXetNghiemVGC &&
                                            touched.NgayXetNghiemVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayXetNghiemVGC
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="CoBiVGC">
                                                B??? vi??m gan
                                            </label>
                                            <Field
                                                as="select"
                                                name="CoBiVGC"
                                                key="CoBiVGC"
                                                className="form-control "
                                            >
                                                <option value="false">
                                                    ??m t??nh
                                                </option>
                                                <option value="true">
                                                    D????ng t??nh
                                                </option>
                                            </Field>
                                            {errors.CoBiVGC &&
                                            touched.CoBiVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.CoBiVGC}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="KetQuaCopiesVGC">
                                                ?????nh l?????ng HBV-DNA
                                            </label>
                                            <Field
                                                name="KetQuaCopiesVGC"
                                                key="KetQuaCopiesVGC"
                                                className="form-control "
                                            />
                                            {errors.KetQuaCopiesVGC &&
                                            touched.KetQuaCopiesVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.KetQuaCopiesVGC}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="BiBaoGioVGC">
                                                B??? vi??m gan B
                                            </label>
                                            <Field
                                                as="select"
                                                name="BiBaoGioVGC"
                                                key="BiBaoGioVGC"
                                                className="form-control "
                                            >
                                                <option>--Ch???n--</option>
                                                <option value="Tr?????c ch???y th???n nh??n t???o">
                                                    Tr?????c ch???y th???n nh??n t???o
                                                </option>
                                                <option value="Sau ch???y th???n nh??n t???o">
                                                    Sau ch???y th???n nh??n t???o
                                                </option>
                                            </Field>
                                            {errors.BiBaoGioVGC &&
                                            touched.BiBaoGioVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.BiBaoGioVGC}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="CoDieuTriVGC">
                                                ??i???u tr??? Vi??m gan
                                            </label>
                                            <Field
                                                as="select"
                                                name="CoDieuTriVGC"
                                                key="CoDieuTriVGC"
                                                className="form-control "
                                            >
                                                <option>--Ch???n--</option>
                                                <option value="true">C??</option>
                                                <option value="false">
                                                    Kh??ng
                                                </option>
                                            </Field>{' '}
                                            {errors.CoDieuTriVGC &&
                                            touched.CoDieuTriVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.CoDieuTriVGC}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="ThuocDieuTriVGC">
                                                Thu???c ??i???u tr???{' '}
                                            </label>
                                            <Field
                                                name="ThuocDieuTriVGC"
                                                key="ThuocDieuTriVGC"
                                                className="form-control "
                                            />
                                            {errors.ThuocDieuTriVGC &&
                                            touched.ThuocDieuTriVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.ThuocDieuTriVGC}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="NgayBatDauDieuTriVGC">
                                                Ng??y b???t ?????u ??i???u tr???
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayBatDauDieuTriVGC"
                                                key="NgayBatDauDieuTriVGC"
                                                className="form-control "
                                            />
                                            {errors.NgayBatDauDieuTriVGC &&
                                            touched.NgayBatDauDieuTriVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayBatDauDieuTriVGC
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="NgayKetThucDieuTriVGC">
                                                Ng??y k???t th??c ??i???u tr???
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayKetThucDieuTriVGC"
                                                key="NgayKetThucDieuTriVGC"
                                                className="form-control "
                                            />
                                            {errors.NgayKetThucDieuTriVGC &&
                                            touched.NgayKetThucDieuTriVGC ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayKetThucDieuTriVGC
                                                        }
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
                                setshowCreateKQVGC(false);
                            }}
                        >
                            ????ng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitCreate();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Ho??n th??nh
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

export default KQXetNghiemHienVGCAdm;
