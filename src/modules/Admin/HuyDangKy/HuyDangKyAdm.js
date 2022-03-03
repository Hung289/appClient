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
import * as HuyDangKyConstant from '@modules/Common/HuyDangKyConstant';
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
import {Link, StaticRouter, useHistory, useParams} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as huyDangKyService from '@app/services/huyDangKyService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';

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

import AdminSecsionHead from '../AdminSecsionHead';
import HuyDangkyTbl from './HuyDangkyTbl';
// import DangKyHienCreateAdm from './DangKyHienCreateAdm';
import HuyDangKySearchAdm from './HuyDangKySearchAdm';
import HuyDangKyDetailAdm from './HuyDangKyDetailAdm';
import HuyDangKyChangeStatus from './HuyDangKyChangeStatus';
// import DangKyHienTbl from './DangKyHienTbl';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const HuyDangKyAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);
    let FileSelectedDonDK = useRef();

    const {
        // onCreateEntity,
        // onChangGuiTheMuti,
        // onEditEntity,
        onInThe,
        onSaveChangeStatusEntity,
        onChangStatus,
        onInPhieu,
        onCloseEntityModal,
        onCloseEntityEditModal,
        showEditModal,
        IsUpdate,
        onSaveEditEntity,
        isInit,
        // searchModel,
        onSubmitSearchSave
    } = props;
    const [IsShowEditPopup, setIsShowEditPopup] = useState(false);
    const [IsShowCreatePopup, setIsShowCreatePopup] = useState(false);
    const [lstEntity, setlstEntity] = useState({});
    const [DetailData, setDetailData] = useState({});
    const [typeModal, SettypeModal] = useState('');
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [searchModel, setsearchModel] = useState({
        PageIndex: 1,
        PageSize: 20
    });

    const [showDetailModal, setshowDetailModal] = useState(false);
    const [entityObj, setEntityObj] = useState({});
    const [statusNew, setstatusNew] = useState('');
    const [itemId, setitemId] = useState(0);
    const [showChangeStatusModal, setshowChangeStatusModal] = useState(false);
    const [showDonModal, setshowDonModal] = useState(false);
    const LoadEntityData = (objSearch) => {
        setisload(true);
        huyDangKyService.LoadEntity(objSearch).then((rs) => {
            if (rs.Status) {
                setlstEntity(rs.Data);
            } else {
                toast.error(rs.MessageError);
            }
            setisload(false);
        });
    };
    const onCreateEntity = () => {
        setIsShowCreatePopup(true);
    };
    const onChangeStatusEntity = (id, status) => {
        setitemId(id);
        setstatusNew(status);
        setshowChangeStatusModal(true);
    };
    const onEditEntity = async (id) => {
        huyDangKyService.GetDetailById(id).then((b) => {
            setDetailData(b.entityObj);
            setIsShowEditPopup(true);
        });
    };
    const onUpDonDK = async (id) => {
        setitemId(id);
        setshowDonModal(true);
    };
    const onReloadPage = () => {
        LoadEntityData(searchModel);
    };
    const OnChangePage = (pidx) => {
        const searchModelUpdate = {
            ...searchModel,
            PageIndex: pidx
        };
        setsearchModel(searchModelUpdate);
        LoadEntityData(searchModelUpdate);
    };

    const onOpenDetailModal = (id) => {
        setisload(true);
        huyDangKyService.GetDetailById(id).then((rs) => {
            if (rs.Status) {
                setEntityObj(rs.Data);
                setshowDetailModal(true);
            }
            setisload(false);
        });
    };

    async function ChangeFileUploadDonDK(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
        });
        if (Arr[0] !== undefined) {
            FileSelectedDonDK = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('DonDKBanCung');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('DonDKBanCung');
            image.src = '';
            FileSelectedDonDK = {current: null};
        }
    }
    useEffect(() => {
        let isUnmount = false;
        // Update the document title using the browser API
        onReloadPage();

        return () => {
            isUnmount = true;
        };
    }, []);

    const ChangeStatusAction = (id, status) => {
        confirmAlert({
            title: 'Xác nhận chuyển trạng thái của hồ sơ?',
            message: `Bạn chắc chắn muốn chuyển trạng thái thành ${HuyDangKyConstant.GetName(
                status
            )}.`,
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const objdata = {
                            Id: id,
                            Status: status,
                            Messsage: ''
                        };
                        huyDangKyService
                            .ChangeStatusNewEntity(objdata)
                            .then((x) => {
                                if (x.Status) {
                                    onReloadPage();
                                }
                            });
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message: 'Bạn chắc chắn muốn xóa bỏ đơn hủy đăng ký này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        huyDangKyService.DeleteEntity(id).then((x) => {
                            onReloadPage();
                        });
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'Xác nhận xóa các đơn hủy đăng ký này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các đơn hủy đăng ký này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            huyDangKyService.DeleteMultiEntity(dsId);
                            onReloadPage();
                        } else {
                            toast.error('Vui lòng chọn ít nhất một bản ghi');
                        }
                    }
                },
                {
                    label: 'Đóng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DonDKBanCungSchema = Yup.object().shape({});
    const SaveDonDKBanCung = (Obj) => {
        setisload(true);
        huyDangKyService.SaveHSBanCung(Obj).then((data) => {
            setisload(false);
            if (data.Status) {
                setshowDonModal(false);
                onReloadPage();
            }
        });
    };
    function DonDKBanCungModel() {
        const submitDon = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={showDonModal}
                    size="md"
                    onHide={() => setshowDonModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Lưu thông tin đăng ký bản cứng
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: itemId
                            }}
                            validationSchema={DonDKBanCungSchema}
                            onSubmit={(values) => {
                                let DonDK = false;
                                const ObjSave = {
                                    ...values
                                };
                                if (
                                    FileSelectedDonDK !== undefined &&
                                    FileSelectedDonDK.data
                                ) {
                                    ObjSave.imgDonDK = FileSelectedDonDK;
                                    DonDK = true;
                                }
                                if (DonDK) {
                                    SaveDonDKBanCung(ObjSave);
                                } else {
                                    toast.error('Bạn chưa tải file lên');
                                }
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <div className="form-group ">
                                        <label htmlFor="DonDKBanCung">
                                            File đơn đăng ký bản cứng
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            type="file"
                                            id="DonDKBanCung"
                                            name="DonDKBanCung"
                                            key="DonDKBanCung"
                                            className="form-control img-padding"
                                            onChange={ChangeFileUploadDonDK}
                                        />
                                        {errors.DonDKBanCung &&
                                        touched.DonDKBanCung ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.DonDKBanCung}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setshowDonModal(false)}
                        >
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={submitDon}>
                            Hoàn thành
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <>
            {isload ? (
                <div className="coverLoader">
                    <ReactLoading
                        className="loaderItem"
                        type="bars"
                        color="#2980b9"
                        height="100px"
                        width="100px"
                    />
                </div>
            ) : null}
            <AdminSecsionHead ModuleName="Quản lý đơn hủy đăng ký" />
            <HuyDangKySearchAdm
                LoadEntityData={LoadEntityData}
                setsearchModel={setsearchModel}
                searchModel={searchModel}
                showSearchPanel={showSearchPanel}
            />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <HuyDangKyChangeStatus
                                        itemId={itemId}
                                        onReloadPage={onReloadPage}
                                        showChangeStatusModal={
                                            showChangeStatusModal
                                        }
                                        setshowChangeStatusModal={
                                            setshowChangeStatusModal
                                        }
                                        statusNew={statusNew}
                                    />

                                    <Button
                                        variant=""
                                        className="btn-nobg "
                                        size="sm"
                                        onClick={() =>
                                            setShowSearchPanel(!showSearchPanel)
                                        }
                                    >
                                        {showSearchPanel ? (
                                            <>
                                                <i
                                                    className="fa fa-times"
                                                    aria-hidden="true"
                                                />{' '}
                                                Đóng tìm kiếm
                                            </>
                                        ) : (
                                            <>
                                                <i
                                                    className="fa fa-search"
                                                    aria-hidden="true"
                                                />{' '}
                                                Tìm kiếm
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant=""
                                        className="btn-nobg"
                                        onClick={() => DeleteMulTiBtnAction()}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        />{' '}
                                        Xóa
                                    </Button>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        {/* <DangKyHienEditAdm
                                            IsShowEditPopup={IsShowEditPopup}
                                            entityObj={DetailData}
                                            onCloseEntityEditModal={() => {
                                                setIsShowEditPopup(false);
                                            }}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        /> */}
                                        <HuyDangKyDetailAdm
                                            showDetailModal={showDetailModal}
                                            setshowDetailModal={
                                                setshowDetailModal
                                            }
                                            entityObj={entityObj}
                                            onReloadPage={onReloadPage}
                                        />
                                        <DonDKBanCungModel />
                                        <HuyDangkyTbl
                                            lstEntity={lstEntity}
                                            onEditEntity={onEditEntity}
                                            setitemId={setitemId}
                                            onUpDonDK={onUpDonDK}
                                            ChangeStatusAction={
                                                ChangeStatusAction
                                            }
                                            onChangeStatusEntity={
                                                onChangeStatusEntity
                                            }
                                            DeleteAction={DeleteAction}
                                            onOpenDetailModal={
                                                onOpenDetailModal
                                            }
                                            OnChangePage={OnChangePage}
                                            onReloadPage={onReloadPage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
const downloadFile = (file) => {
    const element = document.createElement('a');
    element.setAttribute('href', file);
    element.setAttribute('download', '');

    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
};

export default HuyDangKyAdm;
