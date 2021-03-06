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
import * as KQXetNghiemVGBService from '@app/services/KQXetNghiemHienVGBService';
import * as Yup from 'yup';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemHienVGBAdm = (props) => {
    const {showCreateKQVGB, setshowCreateKQVGB, DataKQVGB, LoadData} = props;

    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);

    const onCreateEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemVGBService.CreateNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();
                setshowCreateKQVGB(false);
            }
        });
    };
    const onSaveEditEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemVGBService.EditNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();

                setshowCreateKQVGB(false);
            }
        });
    };
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    const SignupSchema = Yup.object().shape({
        NgayXetNghiemVGB: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin')
            .typeError('Vui l??ng nh???p th??ng tin')
    });
    function CreateModal() {
        return (
            <>
                <Modal
                    show={showCreateKQVGB}
                    dialogClassName="modal-90w"
                    onHide={() => {
                        setshowCreateKQVGB(false);
                    }}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            C???p nh???t k???t qu??? x??t nghi???m vi??m gan B
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: DataKQVGB.Id,
                                IdPhieu: DataKQVGB.IdPhieu,
                                NgayXetNghiemVGB: CommonUtility.GetDateSetField(
                                    DataKQVGB.NgayXetNghiemVGB
                                ),
                                CoBiVGB: DataKQVGB.CoBiVGB,
                                KetQuaCopiesVGB: DataKQVGB.KetQuaCopiesVGB,
                                BiBaoGioVGB: DataKQVGB.BiBaoGioVGB,
                                CoDieuTriVGB: DataKQVGB.CoDieuTriVGB,
                                ThuocDieuTriVGB: DataKQVGB.ThuocDieuTriVGB,
                                NgayBatDauDieuTriVGB: CommonUtility.GetDateSetField(
                                    DataKQVGB.NgayBatDauDieuTriVGB
                                ),
                                NgayKetThucDieuTriVGB: CommonUtility.GetDateSetField(
                                    DataKQVGB.NgayKetThucDieuTriVGB
                                )
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    DataKQVGB.Id !== 0 &&
                                    DataKQVGB.Id !== undefined
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
                                            <label htmlFor="NgayXetNghiemVGB">
                                                Ng??y th???c hi???n
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayXetNghiemVGB"
                                                key="NgayXetNghiemVGB"
                                                className="form-control "
                                            />
                                            {errors.NgayXetNghiemVGB &&
                                            touched.NgayXetNghiemVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayXetNghiemVGB
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="CoBiVGB">
                                                B??? vi??m gan
                                            </label>
                                            <Field
                                                as="select"
                                                name="CoBiVGB"
                                                key="CoBiVGB"
                                                className="form-control "
                                            >
                                                <option value="false">
                                                    ??m t??nh
                                                </option>
                                                <option value="true">
                                                    D????ng t??nh
                                                </option>
                                            </Field>
                                            {errors.CoBiVGB &&
                                            touched.CoBiVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.CoBiVGB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="KetQuaCopiesVGB">
                                                ?????nh l?????ng HBV-DNA
                                            </label>
                                            <Field
                                                name="KetQuaCopiesVGB"
                                                key="KetQuaCopiesVGB"
                                                className="form-control "
                                            />
                                            {errors.KetQuaCopiesVGB &&
                                            touched.KetQuaCopiesVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.KetQuaCopiesVGB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="BiBaoGioVGB">
                                                B??? vi??m gan B
                                            </label>
                                            <Field
                                                as="select"
                                                name="BiBaoGioVGB"
                                                key="BiBaoGioVGB"
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
                                            {errors.BiBaoGioVGB &&
                                            touched.BiBaoGioVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.BiBaoGioVGB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="CoDieuTriVGB">
                                                ??i???u tr??? Vi??m gan
                                            </label>
                                            <Field
                                                as="select"
                                                name="CoDieuTriVGB"
                                                key="CoDieuTriVGB"
                                                className="form-control "
                                            >
                                                <option>--Ch???n--</option>
                                                <option value="true">C??</option>
                                                <option value="false">
                                                    Kh??ng
                                                </option>
                                            </Field>{' '}
                                            {errors.CoDieuTriVGB &&
                                            touched.CoDieuTriVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.CoDieuTriVGB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="ThuocDieuTriVGB">
                                                Thu???c ??i???u tr???{' '}
                                            </label>
                                            <Field
                                                name="ThuocDieuTriVGB"
                                                key="ThuocDieuTriVGB"
                                                className="form-control "
                                            />
                                            {errors.ThuocDieuTriVGB &&
                                            touched.ThuocDieuTriVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.ThuocDieuTriVGB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="NgayBatDauDieuTriVGB">
                                                Ng??y b???t ?????u ??i???u tr???
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayBatDauDieuTriVGB"
                                                key="NgayBatDauDieuTriVGB"
                                                className="form-control "
                                            />
                                            {errors.NgayBatDauDieuTriVGB &&
                                            touched.NgayBatDauDieuTriVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayBatDauDieuTriVGB
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="NgayKetThucDieuTriVGB">
                                                Ng??y k???t th??c ??i???u tr???
                                            </label>
                                            <Field
                                                type="date"
                                                name="NgayKetThucDieuTriVGB"
                                                key="NgayKetThucDieuTriVGB"
                                                className="form-control "
                                            />
                                            {errors.NgayKetThucDieuTriVGB &&
                                            touched.NgayKetThucDieuTriVGB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.NgayKetThucDieuTriVGB
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
                                setshowCreateKQVGB(false);
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

export default KQXetNghiemHienVGBAdm;
