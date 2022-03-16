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
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';

import {
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    layout,
    Layout,
    Upload,
    Button,
    Checkbox
} from 'antd';
import {Link, StaticRouter, useHistory, useParams} from 'react-router-dom';

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

import AdminSecsionHead from '../AdminSecsionHead';
import DangKyHienEditAdm from './DangKyHienEditAdm';
import UpdateHLAAdm from './UpdateHLAAdm';

import DangKyHienCreateAdm from './DangKyHienCreateAdm';
import DangKyHienSearchAdm from './DangKyHienSearchAdm';
import DangKyHienDetailAdm from './DangKyHienDetailAdm';
import DangKyHienTangChangeStatus from './DangKyHienTangChangeStatus';
import DangKyHienTbl from './DangKyHienTbl';
import HienTangCoQuanCreateAdm from '../HienTangCoQuanAdm/HienTangCoQuanCreateAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyHienTangChoTiepNhanAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    const {typeStatus} = useParams();
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
    const [showEditHLA, setShowEditHLA] = useState(false);
    const handleEditHLAShow = () => setShowEditHLA(true);

    const handleEditHLAClose = () => setShowEditHLA(false);
    const [showEditVGB, setShowEditVGB] = useState(false);
    const handleEditVGBShow = () => setShowEditVGB(true);

    const handleEditVGBClose = () => setShowEditVGB(false);
    const [IsShowEditPopup, setIsShowEditPopup] = useState(false);
    const [IsShowHienTangCoQuanPopup, setIsShowHienTangCoQuanPopup] = useState(
        false
    );
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
    const [DanhMucData, setDanhMucData] = useState({});

    const LoadEntityData = (typeStatusInp, objSearch) => {
        setisload(true);
        dangKyHienTangService
            .LoadEntityByType(typeStatusInp, objSearch)
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
    const onCreateEntity = () => {
        setIsShowCreatePopup(true);
    };
    const onChangeStatusEntity = (id, status) => {
        setitemId(id);
        setstatusNew(status);
        setshowChangeStatusModal(true);
    };
    const onEditEntity = async (id) => {
        dangKyHienTangService.GetDetailDto(id).then((b) => {
            setDetailData(b);
            setIsShowEditPopup(true);
        });
    };

    const onHienTangCoQuan = async (id) => {
        dangKyHienTangService.GetDetailDto(id).then((data) => {
            setDetailData(data);
            setIsShowHienTangCoQuanPopup(true);
        });
    };

    const onEditHLAEntity = async (id) => {
        dangKyHienTangService.OpenEditModalSV(id).then((b) => {
            setDetailData(b.entityObj);
            setShowEditHLA(true);
        });
    };
    const onEditVGBEntity = async (id) => {
        dangKyHienTangService.OpenEditModalSV(id).then((b) => {
            setDetailData(b.entityObj);
            setShowEditVGB(true);
        });
    };
    const onUpDonDK = async (id) => {
        setitemId(id);
        setshowDonModal(true);
    };
    const onReloadPage = () => {
        LoadEntityData(typeStatus, searchModel);
    };
    const OnChangePage = (pidx, pageSize) => {
        const searchModelUpdate = {
            ...searchModel,
            PageIndex: pidx,
            PageSize: pageSize
        };
        setsearchModel(searchModelUpdate);
        LoadEntityData(typeStatus, searchModelUpdate);
    };
    const onChangGuiTheMuti = (id) => {
        dangKyHienTangService.SaveChangeIsGuiTheMuti(id).then((rs) => {
            if (rs.Status) {
                toast.success('Gửi thông báo gửi thẻ thành công');
                onReloadPage();
            } else {
                toast.error(rs.MessageError);
            }
        });
    };

    const onOpenDetailModal = (id) => {
        setisload(true);
        dangKyHienTangService.OpenDetailModalSV(id).then((rs) => {
            if (rs.Status) {
                setshowDetailModal(true);
                setEntityObj(rs.Data);
            }

            setisload(false);
        });
    };

    const onChangGuiThe = (id) => {
        const objdata = {
            Id: id,
            IsGuiThe: DangKyHienGuiTheConstant.DaGuiThe
        };
        dangKyHienTangService.SaveChangeIsGuiThe(objdata).then((rs) => {
            if (rs.Status) {
                toast.success('Thực hiện thông báo gửi thẻ thành công');
                onReloadPage();
            } else {
                toast.error(rs.MessageError);
            }
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
        dangKyHienTangService.InitDanhMuc().then((rs) => {
            setDanhMucData(rs);
        });
        let isUnmount = false;
        // Update the document title using the browser API
        onReloadPage();

        return () => {
            isUnmount = true;
        };
    }, [typeStatus]);

    const ChangeStatusAction = (id, status) => {
        confirmAlert({
            title: 'Xác nhận chuyển trạng thái của hồ sơ?',
            message: `Bạn chắc chắn muốn chuyển trạng thái thành ${DangKyHienMoTangConstant.GetName(
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
                        dangKyHienTangService
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
            message: 'Bạn chắc chắn muốn xóa bỏ đăng ký hiến tạng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        dangKyHienTangService.DeleteEntity(id).then((x) => {
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
            title: 'Xác nhận xóa các  đăng ký hiến tạng này?',
            message: 'Bạn chắc chắn muốn xóa bỏ các  đăng ký hiến tạng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            dangKyHienTangService.DeleteMultiEntity(dsId);
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

    const OnChangGuiTheMuti = () => {
        confirmAlert({
            title: 'Xác nhận gửi thẻ các đăng ký hiến tạng này?',
            message: 'Bạn chắc chắn muốn gửi thẻ các  đăng ký hiến tạng này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            onChangGuiTheMuti(dsId);
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
        dangKyHienTangService.SaveHSBanCung(Obj).then((data) => {
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
                    <Form
                        onFinish={(values) => {
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
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: itemId
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Lưu thông tin đăng ký bản cứng
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Item name="Id" hidden>
                                <Input name="Id" />
                            </Form.Item>
                            <Row gutter={[10, 5]}>
                                <Col
                                    lg={{span: 10}}
                                    md={{span: 16}}
                                    sm={{span: 24}}
                                    xs={{span: 24}}
                                >
                                    <Form.Item
                                        label="File đơn đăng ký bản cứng"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Vui lòng nhập thông tin này'
                                            }
                                        ]}
                                        name="DonDKBanCung"
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <Input
                                            name="DonDKBanCung"
                                            type="file"
                                            onChange={ChangeFileUploadDonDK}
                                        />
                                    </Form.Item>
                                    <div>
                                        <i>
                                            {' '}
                                            Vui lòng tải file có định dạng:
                                            .png, .jpg, .jpeg, .pdf{' '}
                                        </i>
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setshowDonModal(false)}
                            >
                                Đóng
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Hoàn thành
                            </Button>
                        </Modal.Footer>
                    </Form>
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
                ModuleName={`Quản lý đăng ký hiến tạng ${DangKyHienMoTangConstant.GetName(
                    typeStatus
                )}
            `}
            />
            <DangKyHienSearchAdm
                LoadEntityData={LoadEntityData}
                setsearchModel={setsearchModel}
                searchModel={searchModel}
                showSearchPanel={showSearchPanel}
                typeStatus={typeStatus}
            />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    <DangKyHienCreateAdm
                                        IsShowCreatePopup={IsShowCreatePopup}
                                        setIsShowCreatePopup={
                                            setIsShowCreatePopup
                                        }
                                        danhMucData={DanhMucData}
                                        OnLoadingAction={setisload}
                                        onReloadPage={onReloadPage}
                                    />
                                    <DangKyHienTangChangeStatus
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
                                    <Space>
                                        <Button
                                            type="primary"
                                            size="sm"
                                            onClick={() => onCreateEntity()}
                                        >
                                            <i
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                            />
                                            {'  '}
                                            Tạo mới
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="sm"
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
                                                    />
                                                    {'  '}
                                                    Đóng tìm kiếm
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />
                                                    {'  '}
                                                    Tìm kiếm
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            type="danger"
                                            onClick={() =>
                                                DeleteMulTiBtnAction()
                                            }
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            />
                                            {'  '}
                                            Xóa
                                        </Button>
                                        <Button
                                            size="sm"
                                            type="primary"
                                            onClick={() => OnChangGuiTheMuti()}
                                        >
                                            <i
                                                className="fa fa-envelope"
                                                aria-hidden="true"
                                            />
                                            {'  '}
                                            Thông báo gửi thẻ
                                        </Button>
                                        <Button size="sm" type="primary">
                                            <a href="/admin/dangkyhientang/importExcel">
                                                <i
                                                    className="fa fa-upload"
                                                    aria-hidden="true"
                                                />
                                                {'  '}
                                                Nhập Excel Hiến tạng
                                            </a>
                                        </Button>
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <HienTangCoQuanCreateAdm
                                            IsShowCreatePopup={
                                                IsShowHienTangCoQuanPopup
                                            }
                                            entityObj={DetailData}
                                            setIsShowCreatePopup={
                                                setIsShowHienTangCoQuanPopup
                                            }
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <DangKyHienEditAdm
                                            IsShowEditPopup={IsShowEditPopup}
                                            entityObj={DetailData}
                                            onCloseEntityEditModal={() => {
                                                setIsShowEditPopup(false);
                                            }}
                                            danhMucData={DanhMucData}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <UpdateHLAAdm
                                            showEditHLA={showEditHLA}
                                            entityObj={DetailData}
                                            handleEditHLAClose={
                                                handleEditHLAClose
                                            }
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        {/* <UpdateViemGanB
                                            showEditVGB={showEditVGB}
                                            entityObj={DetailData}
                                            handleEditVGBClose={
                                                handleEditVGBClose
                                            }
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        /> */}
                                        <DangKyHienDetailAdm
                                            showDetailModal={showDetailModal}
                                            setshowDetailModal={
                                                setshowDetailModal
                                            }
                                            entityObj={entityObj}
                                            onReloadPage={onReloadPage}
                                        />
                                        <DonDKBanCungModel />
                                        <DangKyHienTbl
                                            lstEntity={lstEntity}
                                            onInThe={onInThe}
                                            onInPhieu={onInPhieu}
                                            searchModel={searchModel}
                                            onEditEntity={onEditEntity}
                                            onHienTangCoQuan={onHienTangCoQuan}
                                            onEditHLAEntity={onEditHLAEntity}
                                            onEditVGBEntity={onEditVGBEntity}
                                            onChangGuiThe={onChangGuiThe}
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

const mapDispatchToProps = (dispatch) => ({
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: DANGKYHIENTANG_SEARCH_SAVE, searchModel: objSearch});
    },

    onCloseEntityModal: () => {
        dispatch({type: DANGKYHIENTANG_CLOSE_VIEWDETAIL});
    },
    // onCreateEntity: (tintuc) => {
    //     dangKyHienTangService.CreateNewEntity(dispatch, tintuc);
    // },

    // onEditEntity: (id) => {
    //     dangKyHienTangService.OpenEditModalSV(dispatch, id);
    // },
    onInThe: async (id) => {
        const dataInthe = await dangKyHienTangService.InTheDangKy(dispatch, id);
        if (dataInthe.Status) {
            const pathDownload = `${Constant.PathServer}/${dataInthe.Data}`;
            downloadFile(pathDownload);
        }
    },
    onInPhieu: async (id) => {
        const dataInPhieu = await dangKyHienTangService.InPhieuDK(id);
        if (dataInPhieu.Status) {
            const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
            downloadFile(pathDownload);
        }
    },
    // onChangGuiThe: (id) => {
    //     const objdata = {
    //         Id: id,
    //         IsGuiThe: DangKyHienGuiTheConstant.DaGuiThe
    //     };
    //     dangKyHienTangService.SaveChangeIsGuiThe(dispatch, objdata);
    // },
    onSaveEditEntity: (tintuc) => {
        dangKyHienTangService.EditNewEntity(dispatch, tintuc);
    },
    onChangStatus: (id, status) => {
        const objdata = {
            Id: id,
            Status: status,
            Messsage: ''
        };
        dangKyHienTangService.SaveChangeStatus(dispatch, objdata);
    },

    onCloseEntityEditModal: (id) => {
        dispatch({type: DANGKYHIENTANG_EDIT_CLOSE});
    },
    onCloseChangeStatusModal: () => {
        dispatch({type: DANGKYHIENTANG_CHANGESTATUS_CLOSE});
    },
    onSaveChangeStatusEntity: (tintuc) => {
        dangKyHienTangService.ChangeStatusNewEntity(dispatch, tintuc);
    }
});
const mapStateToProps = (state) => ({
    // lstEntity: state.dangkyhientangchotiepnhan.lstEntity,
    IsUpdate: state.dangkyhientangchotiepnhan.IsUpdate,
    showEditModal: state.dangkyhientang.showEditModal,
    isInit: state.dangkyhientang.isInit,
    showChangeStatusModal: state.dangkyhientang.showChangeStatusModal,
    statusNew: state.dangkyhientang.statusNew,
    searchModel: state.dangkyhientang.searchModel
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DangKyHienTangChoTiepNhanAdm);
