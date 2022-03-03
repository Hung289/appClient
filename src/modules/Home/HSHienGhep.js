/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {Row, Col, Button, Container, Breadcrumb} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import * as HuyDangKyConstant from '@modules/Common/HuyDangKyConstant';

import {NotFoundImage} from '@modules/Common/NotFound';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {Link, useHistory} from 'react-router-dom';
import {TOPHUTRACH_EDIT_SAVE} from '@app/store/ActionType/ToPhuTrachTypeAction';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';

const HSHienGhep = () => {
    const history = useHistory();
    const RenderDataMain = () => {
        const [dataDangKy, setdataDangKy] = useState({});
        const [initDataItem, setInitDataItem] = useState(false);
        const InitData = () => {
            if (!localStorage.getItem('token')) {
                history.push('/LoginUser');
            }
            if (!initDataItem) {
                fetch(`${Constant.PathServer}/api/HienVaGhep/GetInfoOfUser`, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                })
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.ErrorCode === 401) {
                            localStorage.removeItem('token');
                            history.push('/loginuser');
                        }
                        if (json.Status) {
                            setdataDangKy(json.Data);
                        }
                    });
                setInitDataItem(true);
            }
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
        const onInPhieuHuyHien = async (id) => {
            const dataInPhieu = await dangKyHienTangService.InPhieuHuyDK(id);
            if (dataInPhieu.Status) {
                const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
                downloadFile(pathDownload);
            }
        };
        const onInPhieuHuyGhepThan = async (id) => {
            const dataInPhieu = await dangKyChoGhepTangService.InPhieuHuyDKThan(
                id
            );
            if (dataInPhieu.Status) {
                const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
                downloadFile(pathDownload);
            }
        };
        const onInPhieuHuyGhepKhac = async (id) => {
            const dataInPhieu = await dangKyChoGhepTangService.InPhieuHuyDKTangKhac(
                id
            );
            if (dataInPhieu.Status) {
                const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
                downloadFile(pathDownload);
            }
        };
        const ShowDangKyHien = () => {
            let dataResult;
            if (dataDangKy != null && dataDangKy.phieuDangKyHienDtos != null) {
                dataResult = dataDangKy.phieuDangKyHienDtos.map((item) => {
                    return (
                        <div className="col-sm-3">
                            <div className="card cardCustom">
                                {item.Avatar !== '' ? (
                                    <img
                                        src={`${Constant.PathServer}${item.Avatar}`}
                                        alt=""
                                        onError={NotFoundUserImage}
                                        className="imgHinhAnhAccountLarge "
                                    />
                                ) : (
                                    <></>
                                )}
                                <div className="card-body">
                                    <div className="Hoten">{item.HoTen}</div>
                                    <div>Giới tính: {item.GioiTinhTxt}</div>
                                    <div>
                                        Ngày sinh:{' '}
                                        {CommonUtility.ShowDateVN(
                                            item.NgaySinh
                                        )}
                                    </div>
                                    {/* <div>
                                        Địa chỉ:{' '}
                                        {`${item.TenXa}, ${item.TenHuyen}, ${item.TenTinh}`}
                                    </div> */}
                                    <div>
                                        Trạng thái:{' '}
                                        <span
                                            className={`labelStatus HienTang ${DangKyHienMoTangConstant.GetStyle(
                                                item.Status
                                            )}`}
                                        >
                                            {DangKyHienMoTangConstant.GetName(
                                                item.Status
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        Ngày đăng ký:{' '}
                                        {CommonUtility.ShowDateVN(item.NgayDK)}
                                    </div>
                                    {item.HuyDangKyInfo ? (
                                        <div className="label label-warning red">
                                            Hủy đăng ký:{' '}
                                            {HuyDangKyConstant.GetName(
                                                item.HuyDangKyInfo.Status
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <div
                                        className="row center"
                                        style={{marginTop: '15px'}}
                                    >
                                        <div
                                            className="dropdown"
                                            style={{width: '100%'}}
                                        >
                                            <button
                                                className="btn btn-block btn-primary dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="fa fa-cogs" />{' '}
                                                Thao tác
                                            </button>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton"
                                            >
                                                {!item.HuyDangKyInfo &&
                                                    (item.Status ===
                                                        DangKyHienMoTangConstant.ChoTiepNhan ||
                                                        item.Status ===
                                                            DangKyHienMoTangConstant.TuChoi) && (
                                                        <Link
                                                            to={`/EditHienTangHome/${item.Id}`}
                                                            className="dropdown-item"
                                                        >
                                                            Cập nhật
                                                        </Link>
                                                    )}
                                                {(!item.HuyDangKyInfo ||
                                                    item.HuyDangKyInfo
                                                        .Status ===
                                                        HuyDangKyConstant.TuChoi) && (
                                                    <Link
                                                        to={`/CreateHuyDangKy/${item.Id}/DangKyHien`}
                                                        className="dropdown-item"
                                                    >
                                                        Hủy đăng ký
                                                    </Link>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        onInPhieuHuyHien(
                                                            item.Id
                                                        )
                                                    }
                                                    className="dropdown-item"
                                                >
                                                    <span>
                                                        In phiếu hủy đăng ký
                                                    </span>
                                                </Button>
                                                <Link
                                                    to={`/ChiTietDKHienTang/${item.Id}`}
                                                    className="dropdown-item"
                                                >
                                                    Xem Chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
            } else {
                dataResult = (
                    <div className="col-sm-12">
                        <i>Không có dữ liệu</i>
                    </div>
                );
            }
            return dataResult;
        };

        const ShowDangKyGhep = () => {
            let dataResult;
            if (
                dataDangKy != null &&
                dataDangKy.dangKyChoGhepThanDtos != null
            ) {
                dataResult = dataDangKy.dangKyChoGhepThanDtos.map((item) => {
                    return (
                        <div className="col-sm-3">
                            <div className="card cardCustom">
                                {item.Avatar !== '' ? (
                                    <img
                                        src={`${Constant.PathServer}${item.Avatar}`}
                                        alt=""
                                        onError={NotFoundUserImage}
                                        className="imgHinhAnhAccountLarge "
                                    />
                                ) : (
                                    <></>
                                )}
                                <div className="card-body">
                                    <div className="Hoten">{item.HoTenBN}</div>
                                    <div>Giới tính: {item.GioiTinhTxt}</div>
                                    <div>
                                        Ngày sinh:{' '}
                                        {CommonUtility.ShowDateVN(
                                            item.NgaySinh
                                        )}
                                    </div>
                                    {/* <div>
                                        Địa chỉ:{' '}
                                        {`${item.TenXa}, ${item.TenHuyen}, ${item.TenTinh}`}
                                    </div> */}
                                    <div>
                                        Trạng thái:{' '}
                                        <span
                                            className={`labelStatus HienTang ${DangKyChoGhepConstant.GetStyle(
                                                item.Status
                                            )}`}
                                        >
                                            {DangKyChoGhepConstant.GetName(
                                                item.Status
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        Ngày đăng ký:{' '}
                                        {CommonUtility.ShowDateVN(
                                            item.NgayDKHien
                                        )}
                                    </div>
                                    {item.HuyDangKyInfo ? (
                                        <div className="label label-warning red">
                                            Hủy đăng ký:{' '}
                                            {HuyDangKyConstant.GetName(
                                                item.HuyDangKyInfo.Status
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <div
                                        className="row center"
                                        style={{marginTop: '15px'}}
                                    >
                                        <div
                                            className="dropdown"
                                            style={{width: '100%'}}
                                        >
                                            <button
                                                className="btn btn-block btn-primary dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="fa fa-cogs" />{' '}
                                                Thao tác
                                            </button>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton"
                                            >
                                                {!item.HuyDangKyInfo &&
                                                    (item.Status ===
                                                        DangKyChoGhepConstant.ChoTiepNhan ||
                                                        item.Status ===
                                                            DangKyChoGhepConstant.TuChoi) && (
                                                        <Link
                                                            to={`/EditGhepTangHome/${item.Id}`}
                                                            className="dropdown-item"
                                                        >
                                                            Cập nhật
                                                        </Link>
                                                    )}
                                                {!item.HuyDangKyInfo && (
                                                    <Link
                                                        to={`/CreateHuyDangKy/${item.Id}/DangKyChoGhep`}
                                                        className="dropdown-item"
                                                    >
                                                        Hủy đăng ký
                                                    </Link>
                                                )}
                                                {item.TypePhieuDKGhepTang ===
                                                'than' ? (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                onInPhieuHuyGhepThan(
                                                                    item.Id
                                                                )
                                                            }
                                                            className="dropdown-item"
                                                        >
                                                            <span>
                                                                In phiếu hủy
                                                                đăng ký
                                                            </span>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                onInPhieuHuyGhepKhac(
                                                                    item.Id
                                                                )
                                                            }
                                                            className="dropdown-item"
                                                        >
                                                            <span>
                                                                In phiếu hủy
                                                                đăng ký
                                                            </span>
                                                        </Button>
                                                    </>
                                                )}

                                                <Link
                                                    to={`/ChiTietDKChoGhepTang/${item.Id}`}
                                                    className="dropdown-item"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
            } else {
                dataResult = (
                    <div className="col-sm-12">
                        <i>Không có dữ liệu</i>
                    </div>
                );
            }
            return dataResult;
        };

        InitData();
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="BoxShowDangKy">
                        <div className="TitleBox">
                            <span>Hồ sơ đăng ký hiến mô tạng</span>
                        </div>
                        <div className="ContentBoxDK">
                            <div className="row">
                                <ShowDangKyHien />
                            </div>
                        </div>
                    </div>
                    <div className="BoxShowDangKy">
                        <div className="TitleBox">
                            <span>Hồ sơ đăng ký chờ ghép mô tạng</span>
                        </div>
                        <div className="ContentBoxDK">
                            <div className="row">
                                <ShowDangKyGhep />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container>
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Quản lý đăng ký
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default HSHienGhep;
