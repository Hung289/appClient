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
import ReactLoading from 'react-loading';

const HuyDangKyDetailAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {
        entityObj,

        showDetailModal,
        setshowDetailModal
    } = props;
    const RenderViewFile = (path) => {
        const type = CommonUtility.GetTypeFile(path);
        if (type === 1) {
            return (
                <>
                    <img
                        src={`${Constant.PathServer}${entityObj.FileDonDangKy}`}
                        alt=""
                        onError={NotFoundUserImage}
                        // className="imgHinhAnhAccount img-thumbnail"
                    />
                </>
            );
        }
        if (type === 2) {
            return (
                <div
                    style={{
                        padding: '10px',
                        margin: '0 auto'
                    }}
                >
                    <embed
                        src={`${Constant.PathServer}${entityObj.FileDonDangKy}`}
                        width="100%"
                        height="500px"
                    />
                </div>
            );
        }
        return <></>;
    };
    function DetailModal() {
        const [key, setKey] = useState('thongtincoban');
        return (
            <>
                <Modal
                    show={showDetailModal}
                    dialogClassName="modal-90w"
                    onHide={() => setshowDetailModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết đăng ký hiến tạng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            <Tab
                                eventKey="thongtincoban"
                                title="Thông tin cơ bản"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">Ảnh</dt>
                                            <dd className="col-sm-4">
                                                {entityObj.Avatar !== '' ? (
                                                    <>
                                                        <img
                                                            src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                            alt=""
                                                            onError={
                                                                NotFoundUserImage
                                                            }
                                                            className="imgHinhAnhAccount img-thumbnail"
                                                        />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Họ và tên
                                            </dt>
                                            <dd className="col-sm-4">
                                                {entityObj.HoTen}
                                            </dd>
                                        </dl>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Trạng thái
                                            </dt>
                                            <dd className="col-sm-4">
                                                {entityObj.StatusName}
                                            </dd>
                                        </dl>
                                        <dl className="row">
                                            <dt className="col-sm-2">Loại</dt>
                                            <dd className="col-sm-4">
                                                {entityObj.TypeName}
                                            </dd>
                                        </dl>
                                        <dl className="row">
                                            <dt className="col-sm-2">Lý do</dt>
                                            <dd className="col-sm-4">
                                                {entityObj.LyDo}
                                            </dd>
                                        </dl>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày tạo
                                            </dt>
                                            <dd className="col-sm-4">
                                                {CommonUtility.ShowDateVN(
                                                    entityObj.CreatedDate
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab eventKey="FileDK" title="Đăng ký bản gốc">
                                <ListGroup>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dd className="col-sm-12">
                                                <RenderViewFile
                                                    path={
                                                        entityObj.FileDonDangKy
                                                    }
                                                />{' '}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setshowDetailModal(false)}
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

export default HuyDangKyDetailAdm;
