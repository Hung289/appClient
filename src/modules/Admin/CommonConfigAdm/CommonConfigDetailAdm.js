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
import {COMMONCONFIG_CLOSE_VIEWDETAIL} from '@app/store/ActionType/CommonConfigTypeAction';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigDetailAdm = (props) => {
    const {onCloseEntityModal, entityObj, showDetailModal} = props;

    function DetailModal() {
        return (
            <>
                <Modal
                    show={showDetailModal}
                    size="lg"
                    onHide={() => onCloseEntityModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết cấu hình chung</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Mã cấu hình</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Code}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Tên cấu hình</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Name}
                                    </dd>
                                </dl>
                            </ListGroupItem>

                            <ListGroupItem>
                                <dl className="row">
                                    <dt className="col-sm-2">Giá trị</dt>
                                    <dd className="col-sm-10">
                                        {entityObj.Data}
                                    </dd>
                                </dl>
                            </ListGroupItem>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseEntityModal()}
                        >
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <>
            <DetailModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onOpenDetailModal: (id) => {
        CommonConfigSerivce.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: COMMONCONFIG_CLOSE_VIEWDETAIL});
    }
});
const mapStateToProps = (state) => ({
    entityObj: state.commonConfig.entityObj,
    showDetailModal: state.commonConfig.showDetailModal
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonConfigDetailAdm);
