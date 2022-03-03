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
import {COMMONCONFIG_SEARCH_SAVE} from '@app/store/ActionType/CommonConfigTypeAction';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigSearchAdm = (props) => {
    const {IsShowSearch, searchModel, onSubmitSearchSave} = props;

    const SearchSchema = Yup.object().shape({
        name: Yup.string().trim().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });

    const RenderFormSearch = () => {
        return (
            <section
                className={`content  ${IsShowSearch ? 'show fade' : 'hidden'}`}
            >
                <div className="container-fluid  mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
                                        initialValues={{
                                            Name: searchModel.Name
                                        }}
                                        validationSchema={SearchSchema}
                                        onSubmit={(values) => {
                                            onSubmitSearchSave(values);
                                        }}
                                    >
                                        {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="inputEmail4">
                                                                Tên nhóm
                                                            </label>
                                                            <Field
                                                                name="Name"
                                                                key="Name"
                                                                className="form-control "
                                                            />
                                                            {errors.Name &&
                                                            touched.Name ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.Name
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
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
};

const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        CommonConfigSerivce.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: COMMONCONFIG_SEARCH_SAVE, searchModel: objSearch});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.commonConfig.lstEntity,
    IsUpdate: state.commonConfig.IsUpdate,
    isInit: state.commonConfig.isInit,
    searchModel: state.commonConfig.searchModel,
    IsShowSearch: state.commonConfig.IsShowSearch
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonConfigSearchAdm);
