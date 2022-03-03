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
import * as KQXetNghiemPRAService from '@app/services/KQXetNghiemPRAService';
import * as Yup from 'yup';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemPRAAdm = (props) => {
    const {showCreateKQ, setshowCreateKQ, DataKQ, LoadData} = props;

    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);

    const onCreateEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemPRAService.CreateNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();
                setshowCreateKQ(false);
            }
        });
    };
    const onSaveEditEntity = (tintuc) => {
        setisload(true);
        KQXetNghiemPRAService.EditNewEntity(tintuc).then((data) => {
            setisload(false);
            if (data.Status) {
                LoadData();

                setshowCreateKQ(false);
            }
        });
    };
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    const SignupSchema = Yup.object().shape({
        PRANgayThucHien: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày thực hiện vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày thực hiện phải sau ngày 1 tháng 1 năm 2010',
                (val) => new Date('2010-1-1') < new Date(val)
            )
            .typeError('Vui lòng nhập thông tin'),

        PRATyLePRALop1: Yup.string().nullable(),
        PRATyLePRALop2: Yup.string().nullable(),
        PRAA: Yup.string().nullable(),
        PRAB: Yup.string().nullable(),
        PRADR: Yup.string().nullable(),
        PRADQ: Yup.string().nullable(),
        PRADP: Yup.string().nullable(),
        PRALocHuyetTuong: Yup.string().nullable(),
        PRAThuocUCMD: Yup.string().nullable(),
        PRATheoDoi: Yup.string().nullable()
    });
    function CreateModal() {
        return (
            <>
                <Modal
                    show={showCreateKQ}
                    dialogClassName="modal-90w"
                    onHide={() => {
                        setshowCreateKQ(false);
                    }}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật kết quả xét nghiệm PRA
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: DataKQ.Id,
                                IdPhieu: DataKQ.IdPhieu,
                                PRANgayThucHien: CommonUtility.GetDateSetField(
                                    DataKQ.PRANgayThucHien
                                ),
                                PRATyLePRALop1: DataKQ.PRATyLePRALop1,
                                PRATyLePRALop2: DataKQ.PRATyLePRALop2,
                                PRAA: DataKQ.PRAA,
                                PRAB: DataKQ.PRAB,
                                PRADR: DataKQ.PRADR,
                                PRADQ: DataKQ.PRADQ,
                                PRADP: DataKQ.PRADP,
                                PRALocHuyetTuong: DataKQ.PRALocHuyetTuong,
                                PRAThuocUCMD: DataKQ.PRAThuocUCMD,
                                PRATheoDoi: DataKQ.PRATheoDoi
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    DataKQ.Id !== 0 &&
                                    DataKQ.Id !== undefined
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
                                            <label htmlFor="PRANgayThucHien">
                                                Ngày thực hiện
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="PRANgayThucHien"
                                                key="PRANgayThucHien"
                                                className="form-control "
                                            />
                                            {errors.PRANgayThucHien &&
                                            touched.PRANgayThucHien ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRANgayThucHien}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRATyLePRALop1">
                                                Tỷ lệ PRA lớp 1
                                            </label>
                                            <Field
                                                name="PRATyLePRALop1"
                                                key="PRATyLePRALop1"
                                                className="form-control "
                                            />
                                            {errors.PRATyLePRALop1 &&
                                            touched.PRATyLePRALop1 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRATyLePRALop1}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRATyLePRALop2">
                                                Tỷ lệ PRA lớp 2
                                            </label>
                                            <Field
                                                name="PRATyLePRALop2"
                                                key="PRATyLePRALop2"
                                                className="form-control "
                                            />
                                            {errors.PRATyLePRALop2 &&
                                            touched.PRATyLePRALop2 ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRATyLePRALop2}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRAA">A </label>
                                            <Field
                                                name="PRAA"
                                                key="PRAA"
                                                className="form-control "
                                            />
                                            {errors.PRAA && touched.PRAA ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRAA}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRAB">B </label>
                                            <Field
                                                name="PRAB"
                                                key="PRAB"
                                                className="form-control "
                                            />
                                            {errors.PRAB && touched.PRAB ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRAB}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRADR">DR </label>
                                            <Field
                                                name="PRADR"
                                                key="PRADR"
                                                className="form-control "
                                            />
                                            {errors.PRADR && touched.PRADR ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRADR}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRADQ">DQ </label>
                                            <Field
                                                name="PRADQ"
                                                key="PRADQ"
                                                className="form-control "
                                            />
                                            {errors.PRADQ && touched.PRADQ ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRADQ}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRADP">DP </label>
                                            <Field
                                                name="PRADP"
                                                key="PRADP"
                                                className="form-control "
                                            />
                                            {errors.PRADP && touched.PRADP ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRADP}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="PRALocHuyetTuong">
                                                Lọc huyết tương{' '}
                                            </label>
                                            <Field
                                                name="PRALocHuyetTuong"
                                                key="PRALocHuyetTuong"
                                                className="form-control "
                                            />
                                            {errors.PRALocHuyetTuong &&
                                            touched.PRALocHuyetTuong ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.PRALocHuyetTuong
                                                        }
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="PRAThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                            <Field
                                                name="PRAThuocUCMD"
                                                key="PRAThuocUCMD"
                                                className="form-control "
                                            />
                                            {errors.PRAThuocUCMD &&
                                            touched.PRAThuocUCMD ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRAThuocUCMD}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="PRATheoDoi">
                                                Theo dõi{' '}
                                            </label>
                                            <Field
                                                name="PRATheoDoi"
                                                key="PRATheoDoi"
                                                className="form-control "
                                            />
                                            {errors.PRATheoDoi &&
                                            touched.PRATheoDoi ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.PRATheoDoi}
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
                                setshowCreateKQ(false);
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

export default KQXetNghiemPRAAdm;
