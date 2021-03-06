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
            title: 'X??c nh???n chuy???n tr???ng th??i c???a h??? s???',
            message: `B???n ch???c ch???n mu???n chuy???n tr???ng th??i th??nh ${HuyDangKyConstant.GetName(
                status
            )}.`,
            buttons: [
                {
                    label: 'X??c nh???n',
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
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? ????n h???y ????ng k?? n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        huyDangKyService.DeleteEntity(id).then((x) => {
                            onReloadPage();
                        });
                    }
                },
                {
                    label: '????ng',
                    onClick: () => {}
                }
            ]
        });
    };

    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'X??c nh???n x??a c??c ????n h???y ????ng k?? n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c ????n h???y ????ng k?? n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            huyDangKyService.DeleteMultiEntity(dsId);
                            onReloadPage();
                        } else {
                            toast.error('Vui l??ng ch???n ??t nh???t m???t b???n ghi');
                        }
                    }
                },
                {
                    label: '????ng',
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
                            L??u th??ng tin ????ng k?? b???n c???ng
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
                                    toast.error('B???n ch??a t???i file l??n');
                                }
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <div className="form-group ">
                                        <label htmlFor="DonDKBanCung">
                                            File ????n ????ng k?? b???n c???ng
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
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitDon}>
                            Ho??n th??nh
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
            <AdminSecsionHead ModuleName="Qu???n l?? ????n h???y ????ng k??" />
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
                                                ????ng t??m ki???m
                                            </>
                                        ) : (
                                            <>
                                                <i
                                                    className="fa fa-search"
                                                    aria-hidden="true"
                                                />{' '}
                                                T??m ki???m
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
                                        X??a
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
