import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {NotFoundImage} from '@modules/Common/NotFound';

import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';

import axios from 'axios';

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
import * as hienTangCoQuanService from '@app/services/HienTangCoQuanService';
import {GetDsCheckedTableHinet} from '@modules/Common/TableCommon';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';

import ReactLoading from 'react-loading';

import AdminSecsionHead from '../AdminSecsionHead';
import HienTangCoQuanEditAdm from './HienTangCoQuanEditAdm';
import HienTangCoQuanCreateAdm from './HienTangCoQuanCreateAdm';
import HienTangCoQuanSearchAdm from './HienTangCoQuanSearchAdm';
import HienTangCoQuanDetailAdm from './HienTangCoQuanDetailAdm';
import HienTangCoQuanChangeStatusAdm from './HienTangCoQuanChangeStatusAdm';
import HienTangCoQuanTbl from './HienTangCoQuanTbl';
import TuyenChonAdm from './TuyenChonAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const HienTangCoQuanStatusAdm = (props) => {
    const {typeStatus} = useParams();
    const [isload, setisload] = useState(false);
    const [IsShowEditPopup, setIsShowEditPopup] = useState(false);
    const [IsShowCreatePopup, setIsShowCreatePopup] = useState(false);
    const [lstEntity, setlstEntity] = useState({});
    const [DetailData, setDetailData] = useState({});
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [searchModel, setsearchModel] = useState({
        PageIndex: 1,
        PageSize: 20
    });

    const [showDetailModal, setshowDetailModal] = useState(false);
    const [showTuyenChonModal, setshowTuyenChonModal] = useState(false);
    const [entityObj, setEntityObj] = useState({});
    const [statusNew, setstatusNew] = useState('');
    const [itemId, setitemId] = useState(0);
    const [showChangeStatusModal, setshowChangeStatusModal] = useState(false);
    const LoadEntityData = (typeStatusInp, objSearch) => {
        setisload(true);
        hienTangCoQuanService
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

    const onEditEntity = async (id) => {
        hienTangCoQuanService.GetDetailDto(id).then((b) => {
            setDetailData(b);
            setIsShowEditPopup(true);
        });
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

    const onChangeStatusEntity = (id, status) => {
        setitemId(id);
        setstatusNew(status);
        setshowChangeStatusModal(true);
    };

    const onOpenDetailModal = (id) => {
        setisload(true);
        hienTangCoQuanService.GetDetailDto(id).then((rs) => {
            setshowDetailModal(true);
            setEntityObj(rs);

            setisload(false);
        });
    };

    const onTuyenChonModal = (id) => {
        setisload(true);
        hienTangCoQuanService.GetDetailDto(id).then((rs) => {
            setshowTuyenChonModal(true);
            setEntityObj(rs);
            setisload(false);
        });
    };

    useEffect(() => {
        let isUnmount = false;
        // Update the document title using the browser API
        onReloadPage();

        return () => {
            isUnmount = true;
        };
    }, [typeStatus]);

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message:
                'B???n ch???c ch???n mu???n x??a b??? th??ng tin hi???n t???ng m?? t???ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        hienTangCoQuanService.DeleteEntity(id).then((x) => {
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
    const ChangeStatusAction = (id, status) => {
        confirmAlert({
            title: 'X??c nh???n chuy???n tr???ng th??i c???a h??? s???',
            message: `B???n ch???c ch???n mu???n chuy???n tr???ng th??i th??nh ${HienTangMoTangStatusConstant.GetName(
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
                        hienTangCoQuanService
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
            title: 'X??c nh???n x??a c??c th??ng tin hi???n t???ng m?? t???ng n??y?',
            message:
                'B???n ch???c ch???n mu???n x??a b??? c??c th??ng tin hi???n t???ng m?? t???ng n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            hienTangCoQuanService.DeleteMultiEntity(dsId);
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
            <AdminSecsionHead ModuleName="Qu???n l?? th??ng tin hi???n t???ng m?? t???ng" />
            <HienTangCoQuanSearchAdm
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
                                    <Space>
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
                                                    ????ng t??m ki???m
                                                </>
                                            ) : (
                                                <>
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />
                                                    {'  '}
                                                    T??m ki???m
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
                                            X??a
                                        </Button>
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <HienTangCoQuanEditAdm
                                            IsShowEditPopup={IsShowEditPopup}
                                            entityObj={DetailData}
                                            onCloseEntityEditModal={() => {
                                                setIsShowEditPopup(false);
                                            }}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <HienTangCoQuanChangeStatusAdm
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
                                        <HienTangCoQuanDetailAdm
                                            showDetailModal={showDetailModal}
                                            setshowDetailModal={
                                                setshowDetailModal
                                            }
                                            entityObj={entityObj}
                                            onReloadPage={onReloadPage}
                                        />
                                        <TuyenChonAdm
                                            showDetailModal={showTuyenChonModal}
                                            setshowDetailModal={
                                                setshowTuyenChonModal
                                            }
                                            setisload={setisload}
                                            entityObj={entityObj}
                                            onTuyenChonModal={onTuyenChonModal}
                                            onReloadPage={onReloadPage}
                                        />
                                        <HienTangCoQuanTbl
                                            lstEntity={lstEntity}
                                            searchModel={searchModel}
                                            onEditEntity={onEditEntity}
                                            setitemId={setitemId}
                                            DeleteAction={DeleteAction}
                                            onOpenDetailModal={
                                                onOpenDetailModal
                                            }
                                            onTuyenChonModal={onTuyenChonModal}
                                            OnChangePage={OnChangePage}
                                            onReloadPage={onReloadPage}
                                            ChangeStatusAction={
                                                ChangeStatusAction
                                            }
                                            onChangeStatusEntity={
                                                onChangeStatusEntity
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

const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HienTangCoQuanStatusAdm);
