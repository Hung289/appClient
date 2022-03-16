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
import * as MatchingNhomMauService from '@app/services/MatchingNhomMauService';
import {GetDsCheckedTableHinet} from '@modules/Common/TableCommon';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';

import ReactLoading from 'react-loading';

import AdminSecsionHead from '../AdminSecsionHead';
import MatchingNhomMauEditAdm from './MatchingNhomMauEditAdm';
import MatchingNhomMauCreateAdm from './MatchingNhomMauCreateAdm';
import MatchingNhomMauSearchAdm from './MatchingNhomMauSearchAdm';
import MatchingNhomMauDetailAdm from './MatchingNhomMauDetailAdm';
import MatchingNhomMauTbl from './MatchingNhomMauTbl';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const MatchingNhomMauAdm = (props) => {
    const [isload, setisload] = useState(false);
    const [IsShowEditPopup, setIsShowEditPopup] = useState(false);
    const [IsShowCreatePopup, setIsShowCreatePopup] = useState(false);
    const [lstEntity, setlstEntity] = useState({});
    const [DetailData, setDetailData] = useState({});
    const [danhMucData, setDanhMucData] = useState({});
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
    const LoadEntityData = (objSearch) => {
        setisload(true);
        MatchingNhomMauService.LoadEntityByType(objSearch).then((rs) => {
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
        MatchingNhomMauService.GetDetailDto(id).then((b) => {
            setDetailData(b);
            setIsShowEditPopup(true);
        });
    };

    const onReloadPage = () => {
        LoadEntityData(searchModel);
    };
    const OnChangePage = (pidx, pageSize) => {
        const searchModelUpdate = {
            ...searchModel,
            PageIndex: pidx,
            PageSize: pageSize
        };
        setsearchModel(searchModelUpdate);
        LoadEntityData(searchModelUpdate);
    };

    const onOpenDetailModal = (id) => {
        setisload(true);
        MatchingNhomMauService.GetDetailDto(id).then((rs) => {
            setshowDetailModal(true);
            setEntityObj(rs);

            setisload(false);
        });
    };

    useEffect(() => {
        let isUnmount = false;
        MatchingNhomMauService.InitDanhMuc().then((rs) => setDanhMucData(rs));
        // Update the document title using the browser API
        onReloadPage();

        return () => {
            isUnmount = true;
        };
    }, []);

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa?',
            message:
                'Bạn chắc chắn muốn xóa bỏ cấu hình nguyên tắc truyền máu này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        MatchingNhomMauService.DeleteEntity(id).then((x) => {
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
            title: 'Xác nhận xóa các cấu hình nguyên tắc truyền máu này?',
            message:
                'Bạn chắc chắn muốn xóa bỏ các cấu hình nguyên tắc truyền máu này.',
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            MatchingNhomMauService.DeleteMultiEntity(dsId);
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
            <AdminSecsionHead ModuleName="Quản lý cấu hình nguyên tắc truyền máu" />
            <MatchingNhomMauSearchAdm
                danhMucData={danhMucData}
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
                                    <Space>
                                        <Button
                                            type="primary"
                                            size="sm"
                                            onClick={() => {
                                                onCreateEntity();
                                            }}
                                        >
                                            <i
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                            />
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
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <MatchingNhomMauCreateAdm
                                            IsShowCreatePopup={
                                                IsShowCreatePopup
                                            }
                                            setIsShowCreatePopup={
                                                setIsShowCreatePopup
                                            }
                                            danhMucData={danhMucData}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <MatchingNhomMauEditAdm
                                            danhMucData={danhMucData}
                                            IsShowEditPopup={IsShowEditPopup}
                                            entityObj={DetailData}
                                            onCloseEntityEditModal={() => {
                                                setIsShowEditPopup(false);
                                            }}
                                            OnLoadingAction={setisload}
                                            onReloadPage={onReloadPage}
                                        />
                                        <MatchingNhomMauDetailAdm
                                            showDetailModal={showDetailModal}
                                            setshowDetailModal={
                                                setshowDetailModal
                                            }
                                            entityObj={entityObj}
                                            onReloadPage={onReloadPage}
                                        />
                                        <MatchingNhomMauTbl
                                            lstEntity={lstEntity}
                                            searchModel={searchModel}
                                            onEditEntity={onEditEntity}
                                            setitemId={setitemId}
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

const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MatchingNhomMauAdm);
