import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import axios from 'axios';
import {NotFoundImage} from '@modules/Common/NotFound';
import TimePicker from 'react-time-picker';
import {
    Modal,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    Tabs,
    Tab
} from 'react-bootstrap';
import {
    Link,
    useHistory,
    useParams,
    useLocation,
    Redirect
} from 'react-router-dom';

import {Button, Space} from 'antd';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import * as KQXetNghiemService from '@app/services/KQXetNghiemService';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    DANGKYCHOGHEPTANG_CHANGESTATUS_CLOSE,
    DANGKYCHOGHEPTANG_CLOSE_VIEWDETAIL,
    DANGKYCHOGHEPTANG_CLOSE_VIEWEDIT,
    DANGKYCHOGHEPTANG_EDIT_CLOSE,
    DANGKYCHOGHEPTANG_SEARCH_SAVE,
    DANGKYCHOGHEPTANG_CLOSE_CREATE,
    DANGKYCHOGHEPTANG_OPEN_CREATE,
    DANGKYCHOGHEPTANG_THONGBAOXN_CLOSE,
    DANGKYCHOGHEPTANG_THONGBAOXNMUTI_OPEN,
    DANGKYCHOGHEPTANG_THONGBAOXNMUTI_CLOSE,
    DANGKYCHOGHEPTANG_SEARCHTOGGLE
} from '@app/store/ActionType/DangKyChoGhepTangTypeAction';
import {KQXETNGHIEM_EDIT_CLOSE} from '@app/store/ActionType/KQXetNghiemTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {LayTypePhieuDKGhepTang, LayText} from '@modules/Home/PDKGhepCoQuanKhac';
import ReactLoading from 'react-loading';
import AdminSecsionHead from '../AdminSecsionHead';

import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';
import DangKyChoGhepTangCreateAdm from './DangKyChoGhepTangCreateAdm';
import DangKyChoGhepTangEditAdm from './DangKyChoGhepTangEditAdm';
import DangKyChoGhepTangDetailAdm from './DangKyChoGhepTangDetailAdm';
import DangKyChoGhepTangSearchAdm from './DangKyChoGhepTangSearchAdm';
import KQXetNghiemEditAdm from './KQXetNghiemEditAdm';
import KQXetNghiemDetailAdm from './KQXetNghiemDetailAdm';
import DangKyChoGhepTangChangeStatus from './DangKyChoGhepTangChangeStatus';
import DangKyChoGhepTangTbl from './DangKyChoGhepTangTbl';
import DangKyChoGhepTangThongBaoXN from './DangKyChoGhepTangThongBaoXN';
import ChoGhepUpdateHLAAdm from './ChoGhepUpdateHLAAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyChoGhepTangChoTiepNhanAdm = (props) => {
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    const {typeStatus} = useParams();
    const {coquan} = useParams();
    let FileSelectedDonDK = useRef();

    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const [isload, setisload] = useState(false);
    const {
        onCloseChangeStatusModal,
        SaveThongBaoXN,
        onCloseThongBaoXNModal,
        showThongBaoXNModal,
        IsUpdate,
        onSubmitSearchSave,
        onInPhieuThan,
        onInPhieuKhac,
        onOpenEntityCreateModal
    } = props;
    const [showEditHLA, setShowEditHLA] = useState(false);
    const handleEditHLAClose = () => setShowEditHLA(false);
    const [typeModal, SettypeModal] = useState('');
    const [IsShowEditPopup, setIsShowEditPopup] = useState(false);
    const [IsShowCreatePopup, setIsShowCreatePopup] = useState(false);

    const [IsshowEditKQModal, setIsshowEditKQModal] = useState(false);
    const [DetailData, setDetailData] = useState({});
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [searchModel, setsearchModel] = useState({
        PageIndex: 1,
        PageSize: 20
    });
    const [showTBXetNghiemModal, setshowTBXetNghiemModal] = useState(false);

    const [showDetailModal, setshowDetailModal] = useState(false);
    const [showDetailKQModal, setshowDetailKQModal] = useState(false);
    const [showThongBaoXNMutiModal, setshowThongBaoXNMutiModal] = useState(
        false
    );
    const [showDonModal, setshowDonModal] = useState(false);
    const [showLyDoModal, setshowLyDoModal] = useState(false);
    const [statusNew, setstatusNew] = useState('');
    const [itemId, setitemId] = useState(0);
    const [showChangeStatusModal, setshowChangeStatusModal] = useState(false);
    const [lstEntity, setlstEntity] = useState({});

    const onEditHLAEntity = async (id) => {
        dangKyChoGhepTangService.OpenEditModalSV(id).then((a) => {
            setDetailData(a.entityObj);
            setShowEditHLA(true);
        });
    };
    const LoadEntityData = (objSearch) => {
        setisload(true);
        dangKyChoGhepTangService
            .LoadEntityChoTiepNhan(coquan, typeStatus, objSearch)
            .then((rs) => {
                if (rs.Status) {
                    setlstEntity(rs.Data);
                } else {
                    toast.error(rs.MessageError);
                    if (rs.ErrorCode === 401) {
                        props.history.push('/login');
                    }
                }
                setisload(false);
            });
    };
    const onUpDonDK = async (id) => {
        setitemId(id);
        setshowDonModal(true);
    };
    const onLyDoOut = async (id) => {
        setitemId(id);
        setshowLyDoModal(true);
    };
    const onChangeStatusEntity = (id, status) => {
        setitemId(id);
        setstatusNew(status);
        setshowChangeStatusModal(true);
    };
    const [entityObj, setEntityObj] = useState({});
    const [entityKQObj, setentityKQObj] = useState({});
    const onCreateEntity = () => {
        setIsShowCreatePopup(true);
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
    const OnChangePage = (pidx, pageSize) => {
        const searchModelUpdate = {
            ...searchModel,
            PageIndex: pidx,
            PageSize: pageSize
        };
        setsearchModel(searchModelUpdate);
        LoadEntityData(searchModelUpdate);
    };
    const onOpenDetailModal = (id, type) => {
        setisload(true);
        dangKyChoGhepTangService.OpenDetailModalSV(id).then((rs) => {
            if (rs.Status) {
                setEntityObj(rs.entityObj);
                setshowDetailModal(true);
            }

            setisload(false);
        });
    };

    const onOpenDetailKQModal = (id) => {
        setisload(true);
        KQXetNghiemService.OpenDetailModalSV(id).then((rs) => {
            if (rs.Status) {
                setshowDetailKQModal(true);
                setentityKQObj(rs.entityKQObj);
            }

            setisload(false);
        });
    };
    const onEditEntity = async (id) => {
        dangKyChoGhepTangService.OpenEditModalSV(id).then((a) => {
            setDetailData(a.entityObj);
            setIsShowEditPopup(true);
        });
    };
    const onCreateKQXNEntity = (IdP) => {
        setDetailData({IdPhieu: IdP});
        setIsshowEditKQModal(true);
    };
    const onEditKQEntity = async (id) => {
        KQXetNghiemService.OpenEditModalSV(id).then((a) => {
            setDetailData(a.entityKQObj);
            setIsshowEditKQModal(true);
        });
    };
    const onReloadPage = () => {
        LoadEntityData(typeStatus, searchModel);
    };
    const [DanhMucBenh, setDanhMucBenh] = useState([]);

    useEffect(() => {
        let isUnmount = false;

        DuLieuDanhMuc.GetDMbyCodeNhom('benhdieutri').then((rs) => {
            if (rs.Status) {
                setDanhMucBenh(rs.Data);
            }
        });

        onReloadPage();

        return () => {
            isUnmount = true;
        };
    }, [typeStatus, coquan]);

    const DropDMBenh = () => {
        return DanhMucBenh.map((item) => {
            return <option value={item.Code}>{item.Name}</option>;
        });
    };

    const ThongBaoXNSchema = Yup.object().shape({
        ThoiGian: Yup.string()
            .typeError('B???n nh???p sai ?????nh d???ng th???i gian')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        NgayHen: Yup.date()
            .default(function a() {
                return new Date();
            })
            .required('Vui l??ng nh???p th??ng tin n??y'),
        LyDo: Yup.string().required('Vui l??ng nh???p th??ng tin n??y')
    });
    function ThongBaoHenKhamModal() {
        const submitHenKham = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={showThongBaoXNModal}
                    size="md"
                    onHide={() => onCloseChangeStatusModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Th??ng b??o m???i ?????n x??t nghi???m</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                IdObj: entityObj.Id,
                                ThoiGian: '',
                                NgayHen: '',
                                LyDo: ''
                            }}
                            validationSchema={ThongBaoXNSchema}
                            onSubmit={(values) => {
                                SaveThongBaoXN(values);
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field
                                        type="hidden"
                                        name="IdObj"
                                        key="IdObj"
                                    />
                                    <div className="form-group ">
                                        <label htmlFor="ThoiGian">
                                            Th???i gian
                                            <span className="red">*</span>
                                        </label>
                                        <Field name="ThoiGian">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                // form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                meta
                                            }) => (
                                                <div>
                                                    <TimePicker
                                                        key="ThoiGian"
                                                        format="HH:mm"
                                                        name="ThoiGian"
                                                        required
                                                        value={field.value}
                                                        onChange={(val) => {
                                                            setFieldValue(
                                                                'ThoiGian',
                                                                val
                                                            );
                                                        }}
                                                        className="form-control "
                                                        disableClock="true"
                                                    />
                                                    {meta.touched &&
                                                        meta.error && (
                                                            <div className="invalid-feedback">
                                                                {meta.error}
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </Field>

                                        {errors.NgayHen && touched.NgayHen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.NgayHen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group ">
                                        <label htmlFor="NgayHen">
                                            Ng??y h???n
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            type="date"
                                            name="NgayHen"
                                            key="NgayHen"
                                            className="form-control "
                                        />
                                        {errors.NgayHen && touched.NgayHen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.NgayHen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="LyDo">
                                            L?? do<span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="LyDo"
                                            key="LyDo"
                                            className="form-control"
                                        />
                                        {errors.LyDo && touched.LyDo ? (
                                            <div className="invalid-feedback">
                                                {errors.LyDo}
                                            </div>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => onCloseThongBaoXNModal()}
                        >
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitHenKham}>
                            Ho??n th??nh
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    const SaveThongBaoXNMuti = (Obj) => {
        setisload(true);
        dangKyChoGhepTangService.SaveThongBaoXNMuti(Obj).then((data) => {
            setisload(false);
            if (data.Status) {
                setshowThongBaoXNMutiModal(false);
                onReloadPage();
            }
        });
    };
    function ThongBaoHenKhamMutiModal() {
        const submitHenKham = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        const dsId = GetDsCheckedTableHinet('dsTable');
        return (
            <>
                <Modal
                    show={showThongBaoXNMutiModal}
                    size="md"
                    onHide={() => setshowThongBaoXNMutiModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Th??ng b??o m???i ?????n x??t nghi???m</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                IdObj: dsId,
                                ThoiGian: '',
                                NgayHen: '',
                                LyDo: ''
                            }}
                            validationSchema={ThongBaoXNSchema}
                            onSubmit={(values) => {
                                if (
                                    values.IdObj != null &&
                                    values.IdObj.length > 0
                                ) {
                                    SaveThongBaoXNMuti(values);
                                } else {
                                    toast.error(
                                        'Vui l??ng ch???n ??t nh???t m???t b???n ghi'
                                    );
                                }
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field
                                        type="hidden"
                                        name="IdObj"
                                        key="IdObj"
                                    />
                                    <div className="form-group ">
                                        <label htmlFor="ThoiGian">
                                            Th???i gian
                                            <span className="red">*</span>
                                        </label>
                                        <Field name="ThoiGian">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                // form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                meta
                                            }) => (
                                                <div>
                                                    <TimePicker
                                                        key="ThoiGian"
                                                        format="HH:mm"
                                                        name="ThoiGian"
                                                        value={field.value}
                                                        required
                                                        onChange={(val) => {
                                                            setFieldValue(
                                                                'ThoiGian',
                                                                val
                                                            );
                                                        }}
                                                        className="form-control "
                                                        disableClock="true"
                                                    />
                                                    {meta.touched &&
                                                        meta.error && (
                                                            <div className="invalid-feedback">
                                                                {meta.error}
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </Field>

                                        {errors.NgayHen && touched.NgayHen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.NgayHen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group ">
                                        <label htmlFor="NgayHen">
                                            Ng??y h???n
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            type="date"
                                            name="NgayHen"
                                            key="NgayHen"
                                            className="form-control "
                                        />
                                        {errors.NgayHen && touched.NgayHen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.NgayHen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="LyDo">
                                            L?? do<span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="LyDo"
                                            key="LyDo"
                                            className="form-control"
                                        />
                                        {errors.LyDo && touched.LyDo ? (
                                            <div className="invalid-feedback">
                                                {errors.LyDo}
                                            </div>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setshowThongBaoXNMutiModal(false)}
                        >
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitHenKham}>
                            Ho??n th??nh
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? ????ng k?? ch??? gh??p t???ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        dangKyChoGhepTangService.DeleteEntity(id).then((x) => {
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

    const DeleteKetQuaXetNghiemAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? k???t qu??? x??t nghi???m n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        KQXetNghiemService.DeleteEntity(id).then((x) => {
                            if (x.Status) {
                                toast.success(
                                    'X??a ????ng k?? ch??? gh??p t???ng th??nh c??ng'
                                );
                                onReloadPage();
                            } else {
                                toast.error(x.MessageError);
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

    const ChangeStatusAction = (id, status) => {
        confirmAlert({
            title: 'X??c nh???n chuy???n tr???ng th??i c???a h??? s???',
            message: `B???n ch???c ch???n mu???n chuy???n tr???ng th??i th??nh ${DangKyChoGhepConstant.GetName(
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
                        dangKyChoGhepTangService
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

    const DeleteMulTiBtnAction = () => {
        confirmAlert({
            title: 'X??c nh???n x??a c??c ????ng k?? ch??? gh??p t???ng n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c ????ng k?? ch??? gh??p t???ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            dangKyChoGhepTangService.DeleteMultiEntity(dsId);
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
    const LyDoDuaRaNgoaiDS = Yup.object().shape({
        BenhCanChuyenRa: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin')
            .typeError('Vui l??ng nh???p th??ng tin'),
        LyDoChuyenRa: Yup.string()
            .trim()
            .required('Vui l??ng nh???p th??ng tin')
            .typeError('Vui l??ng nh???p th??ng tin')
    });
    const SaveLyDo = (Obj) => {
        setisload(true);
        dangKyChoGhepTangService.SaveLyDoOutDs(Obj).then((data) => {
            setisload(false);
            if (data.Status) {
                setshowLyDoModal(false);
                onReloadPage();
            }
        });
    };
    function LyDoOutModel() {
        const submitDon = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={showLyDoModal}
                    size="md"
                    onHide={() => setshowLyDoModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>L?? do ????a ra ngo??i danh s??ch</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                Id: itemId,
                                LyDoChuyenRa: '',
                                BenhCanChuyenRa: ''
                            }}
                            validationSchema={LyDoDuaRaNgoaiDS}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    dangKyChoGhepThanEditVM: {
                                        ...values
                                    }
                                };
                                SaveLyDo(ObjSave);
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form ref={formCreateEntity}>
                                    <Field type="hidden" name="Id" key="Id" />
                                    <div className="form-group ">
                                        <label htmlFor="BenhCanChuyenRa">
                                            B???nh c???n chuy???n ra
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            id="BenhCanChuyenRa"
                                            name="BenhCanChuyenRa"
                                            key="BenhCanChuyenRa"
                                            className="form-control img-padding"
                                        >
                                            <option>--Ch???n--</option>
                                            <DropDMBenh />
                                        </Field>
                                        {errors.BenhCanChuyenRa &&
                                        touched.BenhCanChuyenRa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.BenhCanChuyenRa}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group ">
                                        <label htmlFor="LyDoChuyenRa">
                                            L?? do chuy???n ra
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            id="LyDoChuyenRa"
                                            name="LyDoChuyenRa"
                                            key="LyDoChuyenRa"
                                            className="form-control img-padding"
                                        />
                                        {errors.LyDoChuyenRa &&
                                        touched.LyDoChuyenRa ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.LyDoChuyenRa}
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
                            onClick={() => setshowLyDoModal(false)}
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

    const DonDKBanCungSchema = Yup.object().shape({});

    const SaveDonDKBanCung = (Obj) => {
        setisload(true);
        dangKyChoGhepTangService.SaveHSBanCung(Obj).then((data) => {
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
                                        <div>
                                            <i>
                                                Vui l??ng t???i file c?? ?????nh d???ng:
                                                .png, .jpg, .jpeg, .pdf
                                            </i>
                                        </div>
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
            <AdminSecsionHead
                ModuleName={`Danh s??ch ch??? gh??p ${TypeBoPhanConstant.GetName(
                    coquan
                )} ${DangKyChoGhepConstant.GetName(typeStatus)}`}
            />
            <DangKyChoGhepTangSearchAdm
                LoadEntityData={LoadEntityData}
                setsearchModel={setsearchModel}
                typeStatus={typeStatus}
                searchModel={searchModel}
                showSearchPanel={showSearchPanel}
            />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <DangKyChoGhepTangCreateAdm
                                        IsShowCreatePopup={IsShowCreatePopup}
                                        setIsShowCreatePopup={
                                            setIsShowCreatePopup
                                        }
                                        OnLoadingAction={setisload}
                                        onReloadPage={onReloadPage}
                                    />
                                    <DangKyChoGhepTangChangeStatus
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

                                    <ThongBaoHenKhamModal />
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                SettypeModal('');
                                                onCreateEntity();
                                            }}
                                        >
                                            <i
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                            />
                                            &nbsp; T???o m???i
                                        </Button>
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                setShowSearchPanel(
                                                    !showSearchPanel
                                                )
                                            }
                                        >
                                            {showSearchPanel ? (
                                                <>
                                                    <i
                                                        className="fa fa-times"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    &nbsp; ????ng t??m ki???m
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
                                            type="danger"
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            />
                                            &nbsp; X??a
                                        </Button>
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                setshowThongBaoXNMutiModal(true)
                                            }
                                        >
                                            <i
                                                className="fas fa-envelope"
                                                aria-hidden="true"
                                            />{' '}
                                            &nbsp; Th??ng b??o h???n x??t nghi???m
                                        </Button>
                                        <Button type="primary">
                                            <a
                                                href="/admin/dangkychogheptang/importExcel"
                                                style={{color: 'black'}}
                                            >
                                                <i
                                                    className="fa fa-upload"
                                                    aria-hidden="true"
                                                />{' '}
                                                &nbsp; Nh???p Excel ch??? Gh??p th???n
                                            </a>
                                        </Button>
                                    </Space>

                                    {/* <Button size="sm" className="button-action">
                                        <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                        />{' '}
                                        Quay l???i
                                    </Button> */}
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <DangKyChoGhepTangEditAdm
                                            IsShowEditPopup={IsShowEditPopup}
                                            entityObj={DetailData}
                                            onCloseEntityEditModal={() => {
                                                setIsShowEditPopup(false);
                                            }}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <DangKyChoGhepTangThongBaoXN
                                            itemId={itemId}
                                            onReloadPage={onReloadPage}
                                            showModal={showTBXetNghiemModal}
                                            setshowModal={
                                                setshowTBXetNghiemModal
                                            }
                                        />
                                        <KQXetNghiemEditAdm
                                            IsshowEditKQModal={
                                                IsshowEditKQModal
                                            }
                                            entityKQObj={DetailData}
                                            onCloseEntityEditKQModal={() => {
                                                setIsshowEditKQModal(false);
                                            }}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <KQXetNghiemDetailAdm
                                            showDetailKQModal={
                                                showDetailKQModal
                                            }
                                            setshowDetailKQModal={
                                                setshowDetailKQModal
                                            }
                                            entityKQObj={entityKQObj}
                                        />
                                        <ThongBaoHenKhamMutiModal />
                                        <DonDKBanCungModel />
                                        <LyDoOutModel />
                                        <DangKyChoGhepTangDetailAdm
                                            showDetailModal={showDetailModal}
                                            setshowDetailModal={
                                                setshowDetailModal
                                            }
                                            entityObj={entityObj}
                                            onReloadPage={onReloadPage}
                                        />
                                        <ChoGhepUpdateHLAAdm
                                            showEditHLA={showEditHLA}
                                            entityObj={DetailData}
                                            handleEditHLAClose={
                                                handleEditHLAClose
                                            }
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <DangKyChoGhepTangTbl
                                            lstEntity={lstEntity}
                                            coquan={coquan}
                                            searchModel={searchModel}
                                            OnChangePage={OnChangePage}
                                            onEditKQEntity={onEditKQEntity}
                                            DeleteKetQuaXetNghiemAction={
                                                DeleteKetQuaXetNghiemAction
                                            }
                                            onCreateKQXNEntity={
                                                onCreateKQXNEntity
                                            }
                                            onInPhieuThan={onInPhieuThan}
                                            onEditEntity={onEditEntity}
                                            onEditHLAEntity={onEditHLAEntity}
                                            onInPhieuKhac={onInPhieuKhac}
                                            setitemId={setitemId}
                                            onUpDonDK={onUpDonDK}
                                            onLyDoOut={onLyDoOut}
                                            setshowTBXetNghiemModal={
                                                setshowTBXetNghiemModal
                                            }
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
                                            onOpenDetailKQModal={
                                                onOpenDetailKQModal
                                            }
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
const mapDispatchToProps = (dispatch) => ({
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: DANGKYCHOGHEPTANG_SEARCH_SAVE, searchModel: objSearch});
    },
    onCloseEntityModal: () => {
        dispatch({type: DANGKYCHOGHEPTANG_CLOSE_VIEWDETAIL});
    },

    onSendMail: (id) => {
        dangKyChoGhepTangService.SendMailThongBao(dispatch, id);
    },
    onChangStatus: (id, status) => {
        const objdata = {
            Id: id,
            Status: status,
            Messsage: ''
        };
        dangKyChoGhepTangService.SaveChangeStatus(dispatch, objdata);
    },

    onSaveEditEntity: (tintuc) => {
        dangKyChoGhepTangService.EditNewEntity(dispatch, tintuc);
    },
    onCloseEntityEditModal: (id) => {
        dispatch({type: DANGKYCHOGHEPTANG_EDIT_CLOSE});
    },

    onOpenEntityCreateModal: (id) => {
        dispatch({type: DANGKYCHOGHEPTANG_OPEN_CREATE});
    },
    onChangeStatusEntity: (id, status) => {
        dangKyChoGhepTangService.OpenChangeStatusModalSV(dispatch, id, status);
    },
    onCloseChangeStatusModal: () => {
        dispatch({type: DANGKYCHOGHEPTANG_CHANGESTATUS_CLOSE});
    },
    onSaveChangeStatusEntity: (tintuc) => {
        dangKyChoGhepTangService.ChangeStatusNewEntity(dispatch, tintuc);
    },
    onInPhieuThan: async (id) => {
        const dataInPhieu = await dangKyChoGhepTangService.InPhieuDKThan(id);
        if (dataInPhieu.Status) {
            const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
            downloadFile(pathDownload);
        }
    },
    onInPhieuKhac: async (id) => {
        const dataInPhieu = await dangKyChoGhepTangService.InPhieuDKTangKhac(
            id
        );
        if (dataInPhieu.Status) {
            const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
            downloadFile(pathDownload);
        }
    },
    OpenThongBaoXNModalSV: (id, status) => {
        dangKyChoGhepTangService.OpenThongBaoXNModalSV(dispatch, id, status);
    },
    onCloseThongBaoXNModal: () => {
        dispatch({type: DANGKYCHOGHEPTANG_THONGBAOXN_CLOSE});
    },

    SaveThongBaoXN: (obj) => {
        dangKyChoGhepTangService.SaveThongBaoXN(dispatch, obj);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkychoghepchotiepnhan.lstEntity,
    showEditModal: state.dangkychogheptang.showEditModal,
    isInit: state.dangkychogheptang.isInit,
    showChangeStatusModal: state.dangkychogheptang.showChangeStatusModal,
    searchModel: state.dangkychogheptang.searchModel,
    statusNew: state.dangkychogheptang.statusNew,
    showThongBaoXNModal: state.dangkychogheptang.showThongBaoXNModal
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DangKyChoGhepTangChoTiepNhanAdm);
