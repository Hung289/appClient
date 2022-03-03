import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import axios from 'axios';
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
import ReactLoading from 'react-loading';

import {Link, StaticRouter, useHistory} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';
import {
    DANGKYHIENTANG_CLOSE_VIEWDETAIL,
    DANGKYHIENTANG_CLOSE_VIEWEDIT,
    DANGKYHIENTANG_EDIT_CLOSE,
    DANGKYHIENTANG_SEARCH_SAVE,
    DANGKYHIENTANG_CHANGESTATUS_CLOSE
} from '@app/store/ActionType/DangKyHienTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong,
    RenderTenTinh,
    RenderTenQuanhuyen,
    RenderTenXaphuong
} from '@modules/Common/LoadDiachi';
import AdminSecsionHead from '../AdminSecsionHead';

const HuyDangKySearchAdm = React.memo((props) => {
    const {
        LoadEntityData,
        searchModel,
        setsearchModel,
        showSearchPanel
    } = props;
    const SearchSchema = Yup.object().shape({
        HoTenFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        NgaySinhFromFilter: Yup.date().nullable(),
        NgaySinhToFilter: Yup.date().nullable(),
        GioiTinhFilter: Yup.number().nullable(),
        SoDienThoaiFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        NgheNghiepFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        SoCMNDFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });
    const RenderDropdownData = (dataCateDM, code, field) => {
        return dataCateDM.map((item, key) => {
            const keyData = `${code}-${field}-${key}`;
            // console.log(keyData);
            return (
                <option value={item.Code} key={keyData}>
                    {item.Name}
                </option>
            );
        });
    };
    useEffect(() => {
        return () => {};
    }, [searchModel]);

    const RenderFormSearch = () => {
        return (
            <section
                className={`content  ${
                    showSearchPanel ? 'show fade' : 'hidden'
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
                                            StatusFilter:
                                                searchModel.StatusFilter,
                                            TypeDangKyFilter:
                                                searchModel.TypeDangKyFilter
                                        }}
                                        validationSchema={SearchSchema}
                                        onSubmit={(values) => {
                                            const objSearch = {
                                                ...values,
                                                PageIndex:
                                                    searchModel.PageIndex,
                                                PageSize: searchModel.PageSize
                                            };
                                            setsearchModel(objSearch);
                                            LoadEntityData(objSearch);
                                        }}
                                    >
                                        {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="TypeDangKyFilter">
                                                                Loại
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="TypeDangKyFilter"
                                                                key="TypeDangKyFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Tất cả--
                                                                </option>
                                                                <option value="DangKyHien">
                                                                    Đăng ký hiến
                                                                    mô tạng
                                                                </option>
                                                                <option value="DangKyChoGhep">
                                                                    Đăng ký chờ
                                                                    ghép mô tạng
                                                                </option>
                                                            </Field>
                                                            {errors.TypeDangKyFilter &&
                                                            touched.TypeDangKyFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.TypeDangKyFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-8">
                                                            <label htmlFor="NgayDKFromFilter">
                                                                Ngày đăng ký
                                                            </label>
                                                            <div className="input-group">
                                                                <Field
                                                                    type="date"
                                                                    name="NgayDKFromFilter"
                                                                    key="NgayDKFromFilter"
                                                                    className="form-control "
                                                                />
                                                                {errors.NgayDKFromFilter &&
                                                                touched.NgayDKFromFilter ? (
                                                                    <>
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors.NgayDKFromFilter
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : null}
                                                                <span className="input-group-text">
                                                                    Đến
                                                                </span>
                                                                <Field
                                                                    type="date"
                                                                    name="NgayDangKyToFilter"
                                                                    key="NgayDangKyToFilter"
                                                                    className="form-control "
                                                                />
                                                                {errors.NgayDangKyToFilter &&
                                                                touched.NgayDangKyToFilter ? (
                                                                    <>
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors.NgayDangKyToFilter
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : null}
                                                            </div>
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
    return (
        <>
            <RenderFormSearch />
        </>
    );
});
export default HuyDangKySearchAdm;
