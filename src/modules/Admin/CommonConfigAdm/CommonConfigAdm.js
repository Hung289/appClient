import React, {useState, useEffect, useRef} from 'react';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Constant from '@app/Constant';
import axios from 'axios';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as CommonConfigSerivce from '@app/services/CommonConfigService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {
    COMMONCONFIG_CLOSE_VIEWDETAIL,
    COMMONCONFIG_SEARCH_SAVE,
    COMMONCONFIG_SEARCH_TOGGLE
} from '@app/store/ActionType/CommonConfigTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {
    Drawer,
    Button,
    Space,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Menu,
    Avatar,
    Pagination,
    Dropdown,
    Form,
    Card,
    DatePicker,
    Modal
} from 'antd';
import moment from 'moment';
import * as antIcon from '@ant-design/icons';

import AdminSecsionHead from '../AdminSecsionHead';
import CommonConfigCreateAdm from './CommonConfigCreateAdm';
import CommonConfigEditAdm from './CommonConfigEditAdm';
import CommonConfigDetailAdm from './CommonConfigDetailAdm';
import CommonConfigSearchAdm from './CommonConfigSearchAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigAdm = (props) => {
    const {
        onToggleSearch,
        LoadEntityData,
        onDeleteEntity,
        onDeleteMultiEntity,
        onEditEntity,
        lstEntity,
        IsUpdate,
        onOpenDetailModal,
        isInit,
        searchModel,
        onSubmitSearchSave,
        IsShowSearch
    } = props;

    useEffect(() => {
        // Update the document title using the browser API
        if (IsUpdate) {
            let objSearch = {
                ...searchModel
            };
            if (searchModel == null || searchModel === undefined) {
                objSearch = {
                    PageIndex: 1,
                    PageSize: 20
                };
            }
            LoadEntityData(objSearch);
        }
    });
    let dataSelected;

    const DeleteAction = (id) => {
        confirmAlert({
            title: 'X??c nh???n x??a?',
            message: 'B???n ch???c ch???n mu???n x??a b??? nh??m tin b??i n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        onDeleteEntity(id);
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
            title: 'X??c nh???n x??a c??c nh??m n??y?',
            message: 'B???n ch???c ch???n mu???n x??a b??? c??c nh??m n??y.',
            buttons: [
                {
                    label: 'X??c nh???n',
                    onClick: () => {
                        const dsId = GetDsCheckedTableHinet('dsTable');
                        if (dsId != null && dsId.length > 0) {
                            onDeleteMultiEntity(dsId);
                        } else {
                            toast.onError('Vui l??ng ch???n ??t nh???t m???t b???n ghi');
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

    const NextPage = (pageInd) => {
        const searchMd = {
            ...searchModel,
            PageIndex: pageInd
        };
        onSubmitSearchSave(searchMd);
    };

    const RenderPage = () => {
        const totalPage =
            lstEntity.TotalPage !== undefined ? lstEntity.TotalPage : 1;
        const curPage =
            lstEntity.CurrentPage !== undefined ? lstEntity.CurrentPage : 1;
        const reder = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < totalPage; i++) {
            let acClass = '';
            if (i + 1 === curPage) {
                acClass = 'active';
            }
            reder.push(
                <li className={`page-item ${acClass}`} key={i}>
                    <Button
                        className="page-link"
                        onClick={() => NextPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                </li>
            );
        }
        return reder;
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dataSelected = selectedRowKeys;
        }
    };
    const RenderDsTable = () => {
        let lstItem = [];
        let pageSiz = 20;
        let pageInd = 1;
        let Count = 0;
        if (lstEntity.ListItem !== undefined) {
            lstItem = lstEntity.ListItem;
            pageInd = lstEntity.CurrentPage;
            Count = lstEntity.Count;
        }
        if (searchModel !== undefined) {
            pageSiz = searchModel.PageSize;
        }
        const columns = [
            {
                title: 'STT',
                key: 'STT',
                render: (text, record, index) => (
                    <div>{(pageInd - 1) * pageSiz + index + 1}</div>
                )
            },
            {
                title: 'H??nh ?????ng',
                key: 'HanhDong',
                render: (text, record) => {
                    return (
                        <Dropdown.Button
                            onClick={() => onOpenDetailModal(record.Id)}
                            // overlay={() => getMenu(record)}
                        >
                            Chi ti???t
                        </Dropdown.Button>
                    );
                }
            },
            {
                title: 'M?? nh??m',
                key: 'MaNhom',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Code}</div>
                    </>
                )
            },
            {
                title: 'T??n Nh??m',
                key: 'TenNhom',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Name}</div>
                    </>
                )
            },
            {
                title: 'Gi?? tr???',
                key: 'GiaTri',
                render: (text, record, index) => (
                    <>
                        {' '}
                        <div>{record.Data}</div>
                    </>
                )
            }
        ];
        return (
            <>
                <CommonConfigEditAdm />
                <CommonConfigDetailAdm />

                <Table
                    id="dsTable"
                    rowKey="Id"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={lstItem}
                    pagination={{
                        total: Count,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSize: pageSiz,
                        current: pageInd,
                        showTotal: (total) => `T???ng c???ng ${total} b???n ghi`,
                        onChange: (page, pageSize) => {
                            NextPage(page, pageSize);
                        }
                    }}
                />
            </>
        );
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Qu???n l?? c???u h??nh h??? th???ng" />
            <CommonConfigSearchAdm />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header p-2">
                                    <Space>
                                        <CommonConfigCreateAdm />
                                        <Button
                                            type="primary"
                                            onClick={() => onToggleSearch()}
                                        >
                                            {IsShowSearch ? (
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
                                                    &nbsp; T??m ki???m
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
                                            />{' '}
                                            &nbsp; X??a
                                        </Button>
                                    </Space>
                                </div>
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <RenderDsTable />
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

const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        CommonConfigSerivce.LoadEntity(dispatch, objSearch);
    },
    onToggleSearch: () => {
        dispatch({type: COMMONCONFIG_SEARCH_TOGGLE});
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: COMMONCONFIG_SEARCH_SAVE, searchModel: objSearch});
    },
    onEditEntity: (id) => {
        CommonConfigSerivce.OpenEditModalSV(dispatch, id);
    },
    onOpenDetailModal: (id) => {
        CommonConfigSerivce.OpenDetailModalSV(dispatch, id);
    },
    onCloseEntityModal: () => {
        dispatch({type: COMMONCONFIG_CLOSE_VIEWDETAIL});
    },

    onDeleteEntity: (id) => {
        CommonConfigSerivce.DeleteEntity(dispatch, id);
    },
    onDeleteMultiEntity: (id) => {
        CommonConfigSerivce.DeleteMultiEntity(dispatch, id);
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.commonConfig.lstEntity,
    IsUpdate: state.commonConfig.IsUpdate,
    entityObj: state.commonConfig.entityObj,
    showDetailModal: state.commonConfig.showDetailModal,
    isInit: state.commonConfig.isInit,
    searchModel: state.commonConfig.searchModel,
    IsShowSearch: state.commonConfig.IsShowSearch
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonConfigAdm);
