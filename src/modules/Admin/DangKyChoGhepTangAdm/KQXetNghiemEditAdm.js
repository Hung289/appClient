import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import axios from 'axios';
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
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as KQXetNghiemService from '@app/services/KQXetNghiemService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {KQXETNGHIEM_EDIT_CLOSE} from '@app/store/ActionType/KQXetNghiemTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemEditAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {
        // onCreateKQEntity,
        onCloseEntityEditKQModal,
        IsshowEditKQModal,
        OnLoadingAction,
        entityKQObj,
        onReloadPage
        // onSaveEditKQEntity
    } = props;
    const SignupSchema = Yup.object().shape({});
    const onSaveEditKQEntity = (tintuc) => {
        OnLoadingAction(true);
        KQXetNghiemService.EditNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditKQModal();
                onReloadPage();
            }
        });
    };
    const onCreateKQEntity = (tintuc) => {
        OnLoadingAction(true);
        KQXetNghiemService.CreateNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditKQModal();
                onReloadPage();
            }
        });
    };
    function EditKQModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    // show="true"
                    show={IsshowEditKQModal}
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditKQModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Cập nhật kết quả xét nghiệm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: entityKQObj.Id,
                                IdPhieu: entityKQObj.IdPhieu,
                                ViemGanB: entityKQObj.ViemGanB,
                                ViemGanBTruocCTNT:
                                    entityKQObj.ViemGanBTruocCTNT,
                                ViemGanBSauCTNT: entityKQObj.ViemGanBSauCTNT,
                                ViemGanBCoDieuTri:
                                    entityKQObj.ViemGanBCoDieuTri,
                                ViemGanBThuocSuDung:
                                    entityKQObj.ViemGanBThuocSuDung,
                                ViemGanBNgayBatDauDieuTri: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBNgayBatDauDieuTri
                                ),
                                ViemGanBThoiGianDieuTri:
                                    entityKQObj.ViemGanBThoiGianDieuTri,
                                ViemGanBNgayKetThuDieuTri: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBNgayKetThuDieuTri
                                ),
                                ViemGanBAmTinhLan1: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBAmTinhLan1
                                ),
                                ViemGanBAmTinhLan2: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBAmTinhLan2
                                ),
                                ViemGanBAmTinhLan3: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBAmTinhLan3
                                ),
                                ViemGanBAmTinhLan4: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBAmTinhLan4
                                ),
                                ViemGanBDuongTinhCopies1: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBDuongTinhCopies1
                                ),
                                ViemGanBDuongTinhCopies2: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBDuongTinhCopies2
                                ),
                                ViemGanBDuongTinhCopies3: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBDuongTinhCopies3
                                ),
                                ViemGanBDuongTinhCopies4: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanBDuongTinhCopies4
                                ),
                                ViemGanBHoanTatDieuTriCachNay:
                                    entityKQObj.ViemGanBHoanTatDieuTriCachNay,
                                ViemGanC: entityKQObj.ViemGanC,
                                ViemGanCTruocCTNT:
                                    entityKQObj.ViemGanCTruocCTNT,
                                ViemGanCSauCTNT: entityKQObj.ViemGanCSauCTNT,
                                ViemGanCCoDieuTri:
                                    entityKQObj.ViemGanCCoDieuTri,
                                ViemGanCThuocSuDung:
                                    entityKQObj.ViemGanCThuocSuDung,
                                ViemGanCNgayBatDauDieuTri: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCNgayBatDauDieuTri
                                ),
                                ViemGanCThoiGianDieuTri:
                                    entityKQObj.ViemGanCThoiGianDieuTri,
                                ViemGanCNgayKetThuDieuTri: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCNgayKetThuDieuTri
                                ),
                                ViemGanCAmTinhLan1: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan1
                                ),
                                ViemGanCAmTinhLan2: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan2
                                ),
                                ViemGanCAmTinhLan3: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan3
                                ),
                                ViemGanCAmTinhLan4: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan4
                                ),
                                ViemGanCAmTinhLan5: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan5
                                ),
                                ViemGanCAmTinhLan6: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan6
                                ),
                                ViemGanCAmTinhLan7: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan7
                                ),
                                ViemGanCAmTinhLan8: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCAmTinhLan8
                                ),
                                ViemGanCDuongTinhCopies1: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCDuongTinhCopies1
                                ),
                                ViemGanCDuongTinhCopies2: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCDuongTinhCopies2
                                ),
                                ViemGanCDuongTinhCopies3: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCDuongTinhCopies3
                                ),
                                ViemGanCDuongTinhCopies4: CommonUtility.GetDateSetField(
                                    entityKQObj.ViemGanCDuongTinhCopies4
                                ),
                                AntibodyLan1NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan1NgayThucHien
                                ),
                                AntibodyLan1TiLePRA:
                                    entityKQObj.AntibodyLan1TiLePRA,
                                AntibodyLan1A: entityKQObj.AntibodyLan1A,
                                AntibodyLan1B: entityKQObj.AntibodyLan1B,
                                AntibodyLan1DR: entityKQObj.AntibodyLan1DR,
                                AntibodyLan1DQ: entityKQObj.AntibodyLan1DQ,
                                AntibodyLan1DP: entityKQObj.AntibodyLan1DP,
                                AntibodyLan1LocHuyetTuong:
                                    entityKQObj.AntibodyLan1LocHuyetTuong,
                                AntibodyLan1ThuocUCMD:
                                    entityKQObj.AntibodyLan1ThuocUCMD,
                                AntibodyLan1TheoDoi:
                                    entityKQObj.AntibodyLan1TheoDoi,
                                AntibodyLan2NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan2NgayThucHien
                                ),
                                AntibodyLan2TiLePRA:
                                    entityKQObj.AntibodyLan2TiLePRA,
                                AntibodyLan2A: entityKQObj.AntibodyLan2A,
                                AntibodyLan2B: entityKQObj.AntibodyLan2B,
                                AntibodyLan2DR: entityKQObj.AntibodyLan2DR,
                                AntibodyLan2DQ: entityKQObj.AntibodyLan2DQ,
                                AntibodyLan2DP: entityKQObj.AntibodyLan2DP,
                                AntibodyLan2LocHuyetTuong:
                                    entityKQObj.AntibodyLan2LocHuyetTuong,
                                AntibodyLan2ThuocUCMD:
                                    entityKQObj.AntibodyLan2ThuocUCMD,
                                AntibodyLan2TheoDoi:
                                    entityKQObj.AntibodyLan2TheoDoi,
                                AntibodyLan3NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan3NgayThucHien
                                ),
                                AntibodyLan3TiLePRA:
                                    entityKQObj.AntibodyLan3TiLePRA,
                                AntibodyLan3A: entityKQObj.AntibodyLan3A,
                                AntibodyLan3B: entityKQObj.AntibodyLan3B,
                                AntibodyLan3DR: entityKQObj.AntibodyLan3DR,
                                AntibodyLan3DQ: entityKQObj.AntibodyLan3DQ,
                                AntibodyLan3DP: entityKQObj.AntibodyLan3DP,
                                AntibodyLan3LocHuyetTuong:
                                    entityKQObj.AntibodyLan3LocHuyetTuong,
                                AntibodyLan3ThuocUCMD:
                                    entityKQObj.AntibodyLan3ThuocUCMD,
                                AntibodyLan3TheoDoi:
                                    entityKQObj.AntibodyLan3TheoDoi,
                                AntibodyLan4NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan4NgayThucHien
                                ),
                                AntibodyLan4TiLePRA:
                                    entityKQObj.AntibodyLan4TiLePRA,
                                AntibodyLan4A: entityKQObj.AntibodyLan4A,
                                AntibodyLan4B: entityKQObj.AntibodyLan4B,
                                AntibodyLan4DR: entityKQObj.AntibodyLan4DR,
                                AntibodyLan4DQ: entityKQObj.AntibodyLan4DQ,
                                AntibodyLan4DP: entityKQObj.AntibodyLan4DP,
                                AntibodyLan4LocHuyetTuong:
                                    entityKQObj.AntibodyLan4LocHuyetTuong,
                                AntibodyLan4ThuocUCMD:
                                    entityKQObj.AntibodyLan4ThuocUCMD,
                                AntibodyLan4TheoDoi:
                                    entityKQObj.AntibodyLan4TheoDoi,
                                AntibodyLan5NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan5NgayThucHien
                                ),
                                AntibodyLan5TiLePRA:
                                    entityKQObj.AntibodyLan5TiLePRA,
                                AntibodyLan5A: entityKQObj.AntibodyLan5A,
                                AntibodyLan5B: entityKQObj.AntibodyLan5B,
                                AntibodyLan5DR: entityKQObj.AntibodyLan5DR,
                                AntibodyLan5DQ: entityKQObj.AntibodyLan5DQ,
                                AntibodyLan5DP: entityKQObj.AntibodyLan5DP,
                                AntibodyLan5LocHuyetTuong:
                                    entityKQObj.AntibodyLan5LocHuyetTuong,
                                AntibodyLan5ThuocUCMD:
                                    entityKQObj.AntibodyLan5ThuocUCMD,
                                AntibodyLan5TheoDoi:
                                    entityKQObj.AntibodyLan5TheoDoi,
                                AntibodyLan6NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan6NgayThucHien
                                ),
                                AntibodyLan6TiLePRA:
                                    entityKQObj.AntibodyLan6TiLePRA,
                                AntibodyLan6A: entityKQObj.AntibodyLan6A,
                                AntibodyLan6B: entityKQObj.AntibodyLan6B,
                                AntibodyLan6DR: entityKQObj.AntibodyLan6DR,
                                AntibodyLan6DQ: entityKQObj.AntibodyLan6DQ,
                                AntibodyLan6DP: entityKQObj.AntibodyLan6DP,
                                AntibodyLan6LocHuyetTuong:
                                    entityKQObj.AntibodyLan6LocHuyetTuong,
                                AntibodyLan6ThuocUCMD:
                                    entityKQObj.AntibodyLan6ThuocUCMD,
                                AntibodyLan6TheoDoi:
                                    entityKQObj.AntibodyLan6TheoDoi,
                                AntibodyLan7NgayThucHien: CommonUtility.GetDateSetField(
                                    entityKQObj.AntibodyLan7NgayThucHien
                                ),
                                AntibodyLan7TiLePRA:
                                    entityKQObj.AntibodyLan7TiLePRA,
                                AntibodyLan7A: entityKQObj.AntibodyLan7A,
                                AntibodyLan7B: entityKQObj.AntibodyLan7B,
                                AntibodyLan7DR: entityKQObj.AntibodyLan7DR,
                                AntibodyLan7DQ: entityKQObj.AntibodyLan7DQ,
                                AntibodyLan7DP: entityKQObj.AntibodyLan7DP,
                                AntibodyLan7LocHuyetTuong:
                                    entityKQObj.AntibodyLan7LocHuyetTuong,
                                AntibodyLan7ThuocUCMD:
                                    entityKQObj.AntibodyLan7ThuocUCMD,
                                AntibodyLan7TheoDoi:
                                    entityKQObj.AntibodyLan7TheoDoi,
                                HLAA: entityKQObj.HLAA,
                                HLAB: entityKQObj.HLAB,
                                HLADRB1: entityKQObj.HLADRB1,
                                HLADQA1: entityKQObj.HLADQA1,
                                HLADQB1: entityKQObj.HLADQB1
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    entityKQObj.Id !== 0 &&
                                    entityKQObj.Id !== undefined
                                ) {
                                    onSaveEditKQEntity(ObjSave);
                                } else {
                                    onCreateKQEntity(ObjSave);
                                }
                            }}
                        >
                            {({errors, touched}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <Field
                                        type="hidden"
                                        name="IdPhieu"
                                        key="IdPhieu"
                                    />
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            I. TÌNH TRẠNG VIÊM QUAN SIÊU VI B:
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanB"
                                                        key="ViemGanB"
                                                        id="ViemGanB"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanB"
                                                    >
                                                        Viêm gan B
                                                    </label>
                                                    {errors.ViemGanB &&
                                                    touched.ViemGanB ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ViemGanB}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanBTruocCTNT"
                                                        key="ViemGanBTruocCTNT"
                                                        id="ViemGanBTruocCTNT"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanBTruocCTNT"
                                                    >
                                                        Trước chạy thận nhân tạo
                                                    </label>
                                                    {errors.ViemGanBTruocCTNT &&
                                                    touched.ViemGanBTruocCTNT ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBTruocCTNT
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanBSauCTNT"
                                                        key="ViemGanBSauCTNT"
                                                        id="ViemGanBSauCTNT"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanBSauCTNT"
                                                    >
                                                        Sau chạy thận nhân tạo
                                                    </label>
                                                    {errors.ViemGanBSauCTNT &&
                                                    touched.ViemGanBSauCTNT ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBSauCTNT
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanBCoDieuTri"
                                                        key="ViemGanBCoDieuTri"
                                                        id="ViemGanBCoDieuTri"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanBCoDieuTri"
                                                    >
                                                        Có điều trị viêm gan
                                                    </label>
                                                    {errors.ViemGanBCoDieuTri &&
                                                    touched.ViemGanBCoDieuTri ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBCoDieuTri
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBThuocSuDung">
                                                    Thuốc sử dụng
                                                </label>
                                                <Field
                                                    name="ViemGanBThuocSuDung"
                                                    key="ViemGanBThuocSuDung"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBThuocSuDung &&
                                                touched.ViemGanBThuocSuDung ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBThuocSuDung
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBNgayBatDauDieuTri">
                                                    Ngày bắt đầu điều trị
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBNgayBatDauDieuTri"
                                                    key="ViemGanBNgayBatDauDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBNgayBatDauDieuTri &&
                                                touched.ViemGanBNgayBatDauDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBNgayBatDauDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBThoiGianDieuTri">
                                                    Thời gian điều trị (tháng)
                                                </label>
                                                <Field
                                                    name="ViemGanBThoiGianDieuTri"
                                                    key="ViemGanBThoiGianDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBThoiGianDieuTri &&
                                                touched.ViemGanBThoiGianDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBThoiGianDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBNgayKetThuDieuTri">
                                                    Ngày kết thúc điều trị
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBNgayKetThuDieuTri"
                                                    key="ViemGanBNgayKetThuDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBNgayKetThuDieuTri &&
                                                touched.ViemGanBNgayKetThuDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBNgayKetThuDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBAmTinhLan1">
                                                    Ngày âm tính lần 1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBAmTinhLan1"
                                                    key="ViemGanBAmTinhLan1"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBAmTinhLan1 &&
                                                touched.ViemGanBAmTinhLan1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBAmTinhLan1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBAmTinhLan2">
                                                    Ngày âm tính lần 2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBAmTinhLan2"
                                                    key="ViemGanBAmTinhLan2"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBAmTinhLan2 &&
                                                touched.ViemGanBAmTinhLan2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBAmTinhLan2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBAmTinhLan3">
                                                    Ngày âm tính lần 3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBAmTinhLan3"
                                                    key="ViemGanBAmTinhLan3"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBAmTinhLan3 &&
                                                touched.ViemGanBAmTinhLan3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBAmTinhLan3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBAmTinhLan4">
                                                    Ngày âm tính lần 4
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBAmTinhLan4"
                                                    key="ViemGanBAmTinhLan4"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBAmTinhLan4 &&
                                                touched.ViemGanBAmTinhLan4 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBAmTinhLan4
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBDuongTinhCopies1">
                                                    Dương tính với số copies lần
                                                    1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBDuongTinhCopies1"
                                                    key="ViemGanBDuongTinhCopies1"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBDuongTinhCopies1 &&
                                                touched.ViemGanBDuongTinhCopies1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBDuongTinhCopies1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBDuongTinhCopies2">
                                                    Dương tính với số copies lần
                                                    2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBDuongTinhCopies2"
                                                    key="ViemGanBDuongTinhCopies2"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBDuongTinhCopies2 &&
                                                touched.ViemGanBDuongTinhCopies2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBDuongTinhCopies2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBDuongTinhCopies3">
                                                    Dương tính với số copies lần
                                                    3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBDuongTinhCopies3"
                                                    key="ViemGanBDuongTinhCopies3"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBDuongTinhCopies3 &&
                                                touched.ViemGanBDuongTinhCopies3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBDuongTinhCopies3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBDuongTinhCopies4">
                                                    Dương tính với số copies lần
                                                    4
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanBDuongTinhCopies4"
                                                    key="ViemGanBDuongTinhCopies4"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBDuongTinhCopies4 &&
                                                touched.ViemGanBDuongTinhCopies4 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBDuongTinhCopies4
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanBHoanTatDieuTriCachNay">
                                                    Đã hoàn tất lộ trình điều
                                                    trị bao lâu (tháng)
                                                </label>
                                                <Field
                                                    name="ViemGanBHoanTatDieuTriCachNay"
                                                    key="ViemGanBHoanTatDieuTriCachNay"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanBHoanTatDieuTriCachNay &&
                                                touched.ViemGanBHoanTatDieuTriCachNay ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanBHoanTatDieuTriCachNay
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            II.TÌNH TRẠNG VIÊM QUAN SIÊU VI C
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanC"
                                                        key="ViemGanC"
                                                        id="ViemGanC"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanC"
                                                    >
                                                        Viêm gan C
                                                    </label>
                                                    {errors.ViemGanC &&
                                                    touched.ViemGanC ? (
                                                        <div className="invalid-feedback">
                                                            {errors.ViemGanC}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanCTruocCTNT"
                                                        key="ViemGanCTruocCTNT"
                                                        id="ViemGanCTruocCTNT"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanCTruocCTNT"
                                                    >
                                                        Trước chạy thận nhân tạo
                                                    </label>
                                                    {errors.ViemGanCTruocCTNT &&
                                                    touched.ViemGanCTruocCTNT ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCTruocCTNT
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanCSauCTNT"
                                                        key="ViemGanCSauCTNT"
                                                        id="ViemGanCSauCTNT"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanCSauCTNT"
                                                    >
                                                        Sau chạy thận nhân tạo
                                                    </label>
                                                    {errors.ViemGanCSauCTNT &&
                                                    touched.ViemGanCSauCTNT ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCSauCTNT
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="custom-control custom-checkbox ">
                                                    <Field
                                                        type="checkbox"
                                                        name="ViemGanCCoDieuTri"
                                                        key="ViemGanCCoDieuTri"
                                                        id="ViemGanCCoDieuTri"
                                                        className="custom-control-input"
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="ViemGanCCoDieuTri"
                                                    >
                                                        Có điều trị viêm gan
                                                    </label>
                                                    {errors.ViemGanCCoDieuTri &&
                                                    touched.ViemGanCCoDieuTri ? (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCCoDieuTri
                                                            }
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCThuocSuDung">
                                                    Thuốc sử dụng
                                                </label>
                                                <Field
                                                    name="ViemGanCThuocSuDung"
                                                    key="ViemGanCThuocSuDung"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCThuocSuDung &&
                                                touched.ViemGanCThuocSuDung ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCThuocSuDung
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCNgayBatDauDieuTri">
                                                    Ngày bắt đầu điều trị
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCNgayBatDauDieuTri"
                                                    key="ViemGanCNgayBatDauDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCNgayBatDauDieuTri &&
                                                touched.ViemGanCNgayBatDauDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCNgayBatDauDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCThoiGianDieuTri">
                                                    Thời gian điều trị (tháng)
                                                </label>
                                                <Field
                                                    name="ViemGanCThoiGianDieuTri"
                                                    key="ViemGanCThoiGianDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCThoiGianDieuTri &&
                                                touched.ViemGanCThoiGianDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCThoiGianDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCNgayKetThuDieuTri">
                                                    Ngày kết thúc điều trị
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCNgayKetThuDieuTri"
                                                    key="ViemGanCNgayKetThuDieuTri"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCNgayKetThuDieuTri &&
                                                touched.ViemGanCNgayKetThuDieuTri ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCNgayKetThuDieuTri
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan1">
                                                    Ngày âm tính lần 1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan1"
                                                    key="ViemGanCAmTinhLan1"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan1 &&
                                                touched.ViemGanCAmTinhLan1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan2">
                                                    Ngày âm tính lần 2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan2"
                                                    key="ViemGanCAmTinhLan2"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan2 &&
                                                touched.ViemGanCAmTinhLan2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan3">
                                                    Ngày âm tính lần 3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan3"
                                                    key="ViemGanCAmTinhLan3"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan3 &&
                                                touched.ViemGanCAmTinhLan3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan4">
                                                    Ngày âm tính lần 4
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan4"
                                                    key="ViemGanCAmTinhLan4"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan4 &&
                                                touched.ViemGanCAmTinhLan4 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan4
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan5">
                                                    Ngày âm tính lần 5
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan5"
                                                    key="ViemGanCAmTinhLan5"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan5 &&
                                                touched.ViemGanCAmTinhLan5 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan5
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan6">
                                                    Ngày âm tính lần 6
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan6"
                                                    key="ViemGanCAmTinhLan6"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan6 &&
                                                touched.ViemGanCAmTinhLan6 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan6
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan7">
                                                    Ngày âm tính lần 7
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan7"
                                                    key="ViemGanCAmTinhLan7"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan7 &&
                                                touched.ViemGanCAmTinhLan7 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan7
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCAmTinhLan8">
                                                    Ngày âm tính lần 8
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCAmTinhLan8"
                                                    key="ViemGanCAmTinhLan8"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCAmTinhLan8 &&
                                                touched.ViemGanCAmTinhLan8 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCAmTinhLan8
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCDuongTinhCopies1">
                                                    Dương tính với số copies lần
                                                    1
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCDuongTinhCopies1"
                                                    key="ViemGanCDuongTinhCopies1"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCDuongTinhCopies1 &&
                                                touched.ViemGanCDuongTinhCopies1 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCDuongTinhCopies1
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCDuongTinhCopies2">
                                                    Dương tính với số copies lần
                                                    2
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCDuongTinhCopies2"
                                                    key="ViemGanCDuongTinhCopies2"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCDuongTinhCopies2 &&
                                                touched.ViemGanCDuongTinhCopies2 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCDuongTinhCopies2
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCDuongTinhCopies3">
                                                    Dương tính với số copies lần
                                                    3
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCDuongTinhCopies3"
                                                    key="ViemGanCDuongTinhCopies3"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCDuongTinhCopies3 &&
                                                touched.ViemGanCDuongTinhCopies3 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCDuongTinhCopies3
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="ViemGanCDuongTinhCopies4">
                                                    Dương tính với số copies lần
                                                    4
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="ViemGanCDuongTinhCopies4"
                                                    key="ViemGanCDuongTinhCopies4"
                                                    className="form-control "
                                                />
                                                {errors.ViemGanCDuongTinhCopies4 &&
                                                touched.ViemGanCDuongTinhCopies4 ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.ViemGanCDuongTinhCopies4
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            III.PRA và Anti HLA antibody Lần 1
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan1NgayThucHien"
                                                    key="AntibodyLan1NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1NgayThucHien &&
                                                touched.AntibodyLan1NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan1TiLePRA"
                                                    key="AntibodyLan1TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1TiLePRA &&
                                                touched.AntibodyLan1TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan1A"
                                                    key="AntibodyLan1A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1A &&
                                                touched.AntibodyLan1A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan1B"
                                                    key="AntibodyLan1B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1B &&
                                                touched.AntibodyLan1B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan1DR"
                                                    key="AntibodyLan1DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1DR &&
                                                touched.AntibodyLan1DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan1DQ"
                                                    key="AntibodyLan1DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1DQ &&
                                                touched.AntibodyLan1DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan1DP"
                                                    key="AntibodyLan1DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1DP &&
                                                touched.AntibodyLan1DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan1LocHuyetTuong"
                                                    key="AntibodyLan1LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1LocHuyetTuong &&
                                                touched.AntibodyLan1LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan1ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan1ThuocUCMD"
                                                    key="AntibodyLan1ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1ThuocUCMD &&
                                                touched.AntibodyLan1ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan1TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan1TheoDoi"
                                                    key="AntibodyLan1TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan1TheoDoi &&
                                                touched.AntibodyLan1TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan1TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            IV.PRA và Anti HLA antibody Lần 2
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan2NgayThucHien"
                                                    key="AntibodyLan2NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2NgayThucHien &&
                                                touched.AntibodyLan2NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan2TiLePRA"
                                                    key="AntibodyLan2TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2TiLePRA &&
                                                touched.AntibodyLan2TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan2A"
                                                    key="AntibodyLan2A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2A &&
                                                touched.AntibodyLan2A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan2B"
                                                    key="AntibodyLan2B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2B &&
                                                touched.AntibodyLan2B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan2DR"
                                                    key="AntibodyLan2DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2DR &&
                                                touched.AntibodyLan2DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan2DQ"
                                                    key="AntibodyLan2DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2DQ &&
                                                touched.AntibodyLan2DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan2DP"
                                                    key="AntibodyLan2DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2DP &&
                                                touched.AntibodyLan2DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan2LocHuyetTuong"
                                                    key="AntibodyLan2LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2LocHuyetTuong &&
                                                touched.AntibodyLan2LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan2ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan2ThuocUCMD"
                                                    key="AntibodyLan2ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2ThuocUCMD &&
                                                touched.AntibodyLan2ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan2TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan2TheoDoi"
                                                    key="AntibodyLan2TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan2TheoDoi &&
                                                touched.AntibodyLan2TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan2TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            V.PRA và Anti HLA antibody Lần 3
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan3NgayThucHien"
                                                    key="AntibodyLan3NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3NgayThucHien &&
                                                touched.AntibodyLan3NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan3TiLePRA"
                                                    key="AntibodyLan3TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3TiLePRA &&
                                                touched.AntibodyLan3TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan3A"
                                                    key="AntibodyLan3A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3A &&
                                                touched.AntibodyLan3A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan3B"
                                                    key="AntibodyLan3B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3B &&
                                                touched.AntibodyLan3B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan3DR"
                                                    key="AntibodyLan3DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3DR &&
                                                touched.AntibodyLan3DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan3DQ"
                                                    key="AntibodyLan3DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3DQ &&
                                                touched.AntibodyLan3DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan3DP"
                                                    key="AntibodyLan3DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3DP &&
                                                touched.AntibodyLan3DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan3LocHuyetTuong"
                                                    key="AntibodyLan3LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3LocHuyetTuong &&
                                                touched.AntibodyLan3LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan3ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan3ThuocUCMD"
                                                    key="AntibodyLan3ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3ThuocUCMD &&
                                                touched.AntibodyLan3ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan3TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan3TheoDoi"
                                                    key="AntibodyLan3TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan3TheoDoi &&
                                                touched.AntibodyLan3TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan3TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            VI.PRA và Anti HLA antibody Lần 4
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan4NgayThucHien"
                                                    key="AntibodyLan4NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4NgayThucHien &&
                                                touched.AntibodyLan4NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan4TiLePRA"
                                                    key="AntibodyLan4TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4TiLePRA &&
                                                touched.AntibodyLan4TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan4A"
                                                    key="AntibodyLan4A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4A &&
                                                touched.AntibodyLan4A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan4B"
                                                    key="AntibodyLan4B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4B &&
                                                touched.AntibodyLan4B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan4DR"
                                                    key="AntibodyLan4DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4DR &&
                                                touched.AntibodyLan4DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan4DQ"
                                                    key="AntibodyLan4DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4DQ &&
                                                touched.AntibodyLan4DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan4DP"
                                                    key="AntibodyLan4DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4DP &&
                                                touched.AntibodyLan4DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan4LocHuyetTuong"
                                                    key="AntibodyLan4LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4LocHuyetTuong &&
                                                touched.AntibodyLan4LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan4ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan4ThuocUCMD"
                                                    key="AntibodyLan4ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4ThuocUCMD &&
                                                touched.AntibodyLan4ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan4TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan4TheoDoi"
                                                    key="AntibodyLan4TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan4TheoDoi &&
                                                touched.AntibodyLan4TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan4TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            VII.PRA và Anti HLA antibody Lần 5
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan5NgayThucHien"
                                                    key="AntibodyLan5NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5NgayThucHien &&
                                                touched.AntibodyLan5NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan5TiLePRA"
                                                    key="AntibodyLan5TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5TiLePRA &&
                                                touched.AntibodyLan5TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan5A"
                                                    key="AntibodyLan5A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5A &&
                                                touched.AntibodyLan5A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan5B"
                                                    key="AntibodyLan5B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5B &&
                                                touched.AntibodyLan5B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan5DR"
                                                    key="AntibodyLan5DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5DR &&
                                                touched.AntibodyLan5DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan5DQ"
                                                    key="AntibodyLan5DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5DQ &&
                                                touched.AntibodyLan5DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan5DP"
                                                    key="AntibodyLan5DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5DP &&
                                                touched.AntibodyLan5DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan5LocHuyetTuong"
                                                    key="AntibodyLan5LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5LocHuyetTuong &&
                                                touched.AntibodyLan5LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan5ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan5ThuocUCMD"
                                                    key="AntibodyLan5ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5ThuocUCMD &&
                                                touched.AntibodyLan5ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan5TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan5TheoDoi"
                                                    key="AntibodyLan5TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan5TheoDoi &&
                                                touched.AntibodyLan5TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan5TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            VIII.PRA và Anti HLA antibody Lần 6
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan6NgayThucHien"
                                                    key="AntibodyLan6NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6NgayThucHien &&
                                                touched.AntibodyLan6NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan6TiLePRA"
                                                    key="AntibodyLan6TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6TiLePRA &&
                                                touched.AntibodyLan6TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan6A"
                                                    key="AntibodyLan6A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6A &&
                                                touched.AntibodyLan6A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan6B"
                                                    key="AntibodyLan6B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6B &&
                                                touched.AntibodyLan6B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan6DR"
                                                    key="AntibodyLan6DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6DR &&
                                                touched.AntibodyLan6DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan6DQ"
                                                    key="AntibodyLan6DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6DQ &&
                                                touched.AntibodyLan6DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan6DP"
                                                    key="AntibodyLan6DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6DP &&
                                                touched.AntibodyLan6DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan6LocHuyetTuong"
                                                    key="AntibodyLan6LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6LocHuyetTuong &&
                                                touched.AntibodyLan6LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan6ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan6ThuocUCMD"
                                                    key="AntibodyLan6ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6ThuocUCMD &&
                                                touched.AntibodyLan6ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan6TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan6TheoDoi"
                                                    key="AntibodyLan6TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan6TheoDoi &&
                                                touched.AntibodyLan6TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan6TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">
                                            IX.PRA và Anti HLA antibody Lần 7
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7NgayThucHien">
                                                    Ngày thực hiện
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="AntibodyLan7NgayThucHien"
                                                    key="AntibodyLan7NgayThucHien"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7NgayThucHien &&
                                                touched.AntibodyLan7NgayThucHien ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7NgayThucHien
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7TiLePRA">
                                                    Tỉ lệ % PRA
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="AntibodyLan7TiLePRA"
                                                    key="AntibodyLan7TiLePRA"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7TiLePRA &&
                                                touched.AntibodyLan7TiLePRA ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7TiLePRA
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7A">
                                                    A
                                                </label>
                                                <Field
                                                    name="AntibodyLan7A"
                                                    key="AntibodyLan7A"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7A &&
                                                touched.AntibodyLan7A ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7A
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7B">
                                                    B
                                                </label>
                                                <Field
                                                    name="AntibodyLan7B"
                                                    key="AntibodyLan7B"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7B &&
                                                touched.AntibodyLan7B ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7B
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7DR">
                                                    DR
                                                </label>
                                                <Field
                                                    name="AntibodyLan7DR"
                                                    key="AntibodyLan7DR"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7DR &&
                                                touched.AntibodyLan7DR ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7DR
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7DQ">
                                                    DQ
                                                </label>
                                                <Field
                                                    name="AntibodyLan7DQ"
                                                    key="AntibodyLan7DQ"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7DQ &&
                                                touched.AntibodyLan7DQ ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7DQ
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7DP">
                                                    DP
                                                </label>
                                                <Field
                                                    name="AntibodyLan7DP"
                                                    key="AntibodyLan7DP"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7DP &&
                                                touched.AntibodyLan7DP ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7DP
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row ">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7LocHuyetTuong">
                                                    Lọc huyết tương
                                                </label>
                                                <Field
                                                    name="AntibodyLan7LocHuyetTuong"
                                                    key="AntibodyLan7LocHuyetTuong"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7LocHuyetTuong &&
                                                touched.AntibodyLan7LocHuyetTuong ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7LocHuyetTuong
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="AntibodyLan7ThuocUCMD">
                                                    Thuốc UCMD
                                                </label>
                                                <Field
                                                    name="AntibodyLan7ThuocUCMD"
                                                    key="AntibodyLan7ThuocUCMD"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7ThuocUCMD &&
                                                touched.AntibodyLan7ThuocUCMD ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7ThuocUCMD
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="AntibodyLan7TheoDoi">
                                                    Theo dõi
                                                </label>
                                                <Field
                                                    name="AntibodyLan7TheoDoi"
                                                    key="AntibodyLan7TheoDoi"
                                                    className="form-control "
                                                />
                                                {errors.AntibodyLan7TheoDoi &&
                                                touched.AntibodyLan7TheoDoi ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.AntibodyLan7TheoDoi
                                                            }
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 no-padding">
                                        <div className="solama">X. HLA</div>
                                    </div>
                                    <div>
                                        <div className="form-row ">
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
                                        <div className="form-row ">
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
                                        <div className="form-row ">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="HLADRB1">
                                                    DRB1
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
                                            <div className="form-group  col-md-12">
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
                                        <div className="form-row ">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="HLADQB1">
                                                    DQB1
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
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditKQModal()}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                submitEdit();
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
            <EditKQModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditKQEntity: (id) => {
        KQXetNghiemService.OpenEditModalSV(dispatch, id);
    }
    // onSaveEditKQEntity: (tintuc) => {
    //     KQXetNghiemService.EditNewEntity(dispatch, tintuc);
    // },
    // onCreateKQEntity: (tintuc) => {
    //     KQXetNghiemService.CreateNewEntity(dispatch, tintuc);
    // },
    // onCloseEntityEditKQModal: (id) => {
    //     dispatch({type: KQXETNGHIEM_EDIT_CLOSE});
    // }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkychogheptang.lstEntity,
    IsUpdate: state.dangkychogheptang.IsUpdate,
    // entityKQObj: state.dangkychogheptang.entityKQObj,
    showEditKQModal: state.dangkychogheptang.showEditKQModal,
    isInit: state.dangkychogheptang.isInit
});

export default connect(mapStateToProps, mapDispatchToProps)(KQXetNghiemEditAdm);
