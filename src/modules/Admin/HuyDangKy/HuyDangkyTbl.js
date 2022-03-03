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

import AdminSecsionHead from '../AdminSecsionHead';
// import DangKyHienEditAdm from './DangKyHienEditAdm';
// import DangKyHienCreateAdm from './DangKyHienCreateAdm';
import HuyDangKySearchAdm from './HuyDangKySearchAdm';
// import DangKyHienDetailAdm from './DangKyHienDetailAdm';
// import DangKyHienTangChangeStatus from './DangKyHienTangChangeStatus';

const HuyDangkyTbl = React.memo((props) => {
    const {
        OnChangePage,
        lstEntity,
        onUpDonDK,
        onEditEntity,
        setitemId,
        ChangeStatusAction,
        onChangeStatusEntity,
        DeleteAction,
        onOpenDetailModal,
        onReloadPage
    } = props;

    useEffect(() => {
        return () => {};
    }, [lstEntity]);

    const ActionStatusRender = (prop) => {
        const {id, Cstatus} = prop;
        switch (Cstatus) {
            case '':
            case null:
                return (
                    <>
                        <Dropdown.Item
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    HuyDangKyConstant.ChoTiepNhan
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>Chờ tiếp nhận</span>
                        </Dropdown.Item>
                    </>
                );
            case HuyDangKyConstant.ChoTiepNhan:
                return (
                    <>
                        <Dropdown.Item
                            onClick={() =>
                                ChangeStatusAction(
                                    id,
                                    HuyDangKyConstant.DaTiepNhan
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>Tiếp nhận</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HuyDangKyConstant.TuChoi
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>Từ chối</span>
                        </Dropdown.Item>
                    </>
                );
            case HuyDangKyConstant.DaTiepNhan:
                return (
                    <>
                        <Dropdown.Item
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HuyDangKyConstant.TuChoi
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>Từ chối</span>
                        </Dropdown.Item>
                    </>
                );
            case HuyDangKyConstant.TuChoi:
                return (
                    <>
                        <Dropdown.Item
                            onClick={() =>
                                onChangeStatusEntity(
                                    id,
                                    HuyDangKyConstant.ChoTiepNhan
                                )
                            }
                        >
                            <span className="boxIcon">
                                <i className="fas fa-share-alt" />
                            </span>
                            <span>
                                {HuyDangKyConstant.GetName(
                                    HuyDangKyConstant.ChoTiepNhan
                                )}
                            </span>
                        </Dropdown.Item>
                    </>
                );

            default:
                return <></>;
        }
    };

    const NextPage = (pageInd) => {
        OnChangePage(pageInd);
    };

    const RenderPage = () => {
        const totalPage =
            lstEntity.TotalPage !== undefined ? lstEntity.TotalPage : 1;
        const curPage =
            lstEntity.CurrentPage !== undefined || lstEntity.CurrentPage
                ? lstEntity.CurrentPage
                : 1;
        const reder = [];
        const lstPageRender = CommonUtility.GetListPageGen(totalPage, curPage);
        // eslint-disable-next-line no-plusplus
        if (lstPageRender && lstPageRender.length > 1 && lstPageRender[0] > 1) {
            reder.push(
                <li className={`page-item `} key={-1}>
                    <Button className="page-link">...</Button>
                </li>
            );
        }
        for (let index = 0; index < lstPageRender.length; index += 1) {
            let acClass = '';
            if (lstPageRender[index] === curPage) {
                acClass = 'active';
            }
            reder.push(
                <li className={`page-item ${acClass}`} key={index}>
                    <Button
                        className="page-link"
                        onClick={() => NextPage(lstPageRender[index])}
                    >
                        {lstPageRender[index]}
                    </Button>
                </li>
            );
        }
        if (
            lstPageRender &&
            lstPageRender.length > 1 &&
            lstPageRender[lstPageRender.length - 1] < totalPage
        ) {
            reder.push(
                <li className={`page-item `} key={-2}>
                    <Button className="page-link">...</Button>
                </li>
            );
        }
        return reder;
    };

    const DisplayPageNavigation = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        Tổng số {lstEntity.Count} bản ghi trên tổng số{' '}
                        {lstEntity.TotalPage} trang
                    </div>

                    <div className="col-sm-6 right">
                        <nav
                            aria-label="Page navigation "
                            className="tblHinet-pagin"
                        >
                            <ul className="pagination pagination-sm">
                                <li className="page-item">
                                    <Button
                                        className="page-link"
                                        onClick={() => NextPage(1)}
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                    </Button>
                                </li>
                                <RenderPage />
                                <li className="page-item">
                                    <Button
                                        className="page-link"
                                        onClick={() =>
                                            NextPage(lstEntity.TotalPage)
                                        }
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    let lstItem = [];
    const pageSiz = 20;
    let pageInd = 1;
    if (lstEntity.ListItem !== undefined) {
        lstItem = lstEntity.ListItem;
        pageInd = lstEntity.CurrentPage;
    }
    return (
        <>
            <div className="table-responsive">
                <table className="table table-hinetNew" id="dsTable">
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className="checkAll"
                                    onClick={(e) => CheckAllItem(e, 'dsTable')}
                                />
                            </th>
                            <th scope="col">#</th>
                            <th className="imgHinhAnhColAccount mw-image-avatar">
                                Ảnh
                            </th>
                            <th scope="col" className="widthColTableMedium">
                                Họ tên
                            </th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Lý do</th>
                            <th scope="col">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lstItem.length > 0 ? (
                            lstItem.map((item, key) => {
                                const rIndex =
                                    (pageInd - 1) * pageSiz + key + 1;
                                return (
                                    <tr
                                        key={key}
                                        onClick={(e) => CheckRowsHinetTable(e)}
                                    >
                                        <td>
                                            <input
                                                className="checkTd"
                                                type="checkbox"
                                                data-id={item.Id}
                                                onClick={(e) =>
                                                    CheckRowsHinetTable(e)
                                                }
                                            />
                                        </td>
                                        <th scope="row">{rIndex}</th>

                                        <td>
                                            {item.Avatar !== '' ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${item.Avatar}`}
                                                        onError={
                                                            NotFoundUserImage
                                                        }
                                                        alt=""
                                                        className="imgHinhAnhAccount img-thumbnail"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                        <td>
                                            <div className="tableBoxMain">
                                                <div className="tableBoxMain-label">
                                                    {item.FileDonDangKy !==
                                                    null ? (
                                                        <>
                                                            {item.HoTen}
                                                            <div>
                                                                <i className="fa fa-check" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>{item.HoTen}</>
                                                    )}
                                                </div>
                                                <div className="tableBoxMain-btnAction">
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            size="sm"
                                                            variant=""
                                                            className="dropdowTableBtn"
                                                        >
                                                            <i
                                                                className="fa fa-ellipsis-h"
                                                                aria-hidden="true"
                                                            />
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            {/* <Dropdown.Item
                                                                onClick={() =>
                                                                    onEditEntity(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-edit" />
                                                                </span>
                                                                <span>Sửa</span>
                                                            </Dropdown.Item> */}
                                                            {item.Status ===
                                                            HuyDangKyConstant.ChoTiepNhan ? (
                                                                <Dropdown.Item
                                                                    onClick={() =>
                                                                        onUpDonDK(
                                                                            item.Id
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="boxIcon">
                                                                        <i className="fas fa-envelope" />
                                                                    </span>
                                                                    <span>
                                                                        Tải đơn
                                                                        bản cứng
                                                                    </span>
                                                                </Dropdown.Item>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <ActionStatusRender
                                                                id={item.Id}
                                                                Cstatus={
                                                                    item.Status
                                                                }
                                                            />

                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    DeleteAction(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-times" />
                                                                </span>
                                                                <span>Xóa</span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    onOpenDetailModal(
                                                                        item.Id
                                                                    )
                                                                }
                                                            >
                                                                <span className="boxIcon">
                                                                    <i className="fas fa-info-circle" />
                                                                </span>
                                                                <span>
                                                                    Xem chi tiết
                                                                </span>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.StatusName}</td>
                                        <td>{item.TypeName}</td>
                                        <td>{item.LyDo}</td>
                                        <td>
                                            {CommonUtility.ShowDateVN(
                                                item.CreatedDate
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <NotDataToShow colNum={11} />
                        )}
                    </tbody>
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className="checkAll"
                                    onClick={(e) => CheckAllItem(e, 'dsTable')}
                                />
                            </th>
                            <th scope="col">#</th>
                            <th className="imgHinhAnhColAccount mw-image-avatar">
                                Ảnh
                            </th>
                            <th scope="col" className="widthColTableMedium">
                                Họ tên
                            </th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Lý do</th>
                            <th scope="col">Ngày tạo</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <DisplayPageNavigation />
        </>
    );
});
export default HuyDangkyTbl;
