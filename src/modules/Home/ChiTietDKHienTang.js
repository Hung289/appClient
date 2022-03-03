/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {
    Row,
    Col,
    Container,
    Breadcrumb,
    Tabs,
    Tab,
    ListGroup,
    ListGroupItem,
    Button
} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from 'react-router-dom';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';

const ChiTietDKHienTang = (props) => {
    const {id} = useParams();
    // const {onInPhieu} = props;
    const [FileDK, setFileDK] = useState({});
    const [entityObj, setEntityObj] = useState({});

    const downloadFile = (file) => {
        const element = document.createElement('a');
        element.setAttribute('href', file);
        element.setAttribute('download', '');

        element.style.display = 'none';

        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    };
    const onInPhieu = async () => {
        const dataInPhieu = await dangKyHienTangService.InPhieuDK(id);
        if (dataInPhieu.Status) {
            const pathDownload = `${Constant.PathServer}/${dataInPhieu.Data}`;
            downloadFile(pathDownload);
        }
    };
    useEffect(() => {
        dangKyHienTangService.GetDetailDto(id).then((dta) => {
            setEntityObj(dta);
        });
        dangKyHienTangService.LoadFileDKPDF(id).then((rs) => {
            if (rs.Status) {
                setFileDK(rs.Data);
            }
        });
    }, []);
    const RenderDataMain = () => {
        function DetailHoSo() {
            const [key, setKey] = useState('thongtincoban');
            return (
                <>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="thongtincoban" title="Thông tin cơ bản">
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
                                        <dt className="col-sm-1">Họ và tên</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Mã số bệnh nhân
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.MaSo}
                                        </dd>
                                        <dt className="col-sm-1">Giới tính</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.GioiTinhTxt}
                                        </dd>
                                        <dt className="col-sm-1">Ngày sinh</dt>
                                        <dd className="col-sm-1">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgaySinh
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            {' '}
                                            Điện thoại
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoDienThoai}
                                        </dd>
                                        <dt className="col-sm-1">
                                            {' '}
                                            Điện thoại Khác
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.soDienThoai1}
                                        </dd>
                                        <dt className="col-sm-1"> Email</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.Email}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            Địa chỉ thường trú
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChi}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Xã/ Phường:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXa}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Quận/ Huyện:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Tỉnh/T.Phố:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinh}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            Địa chỉ nhận thẻ ĐK
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiNhanTheDangKy}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Xã/ Phường:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXaNhanThe}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Quận/ Huyện:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyenNhanThe}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Tỉnh/T.Phố:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinhNhanThe}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Ảnh CMND mặt trước
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ImgCMNDMatTruoc !==
                                            null ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDMatTruoc}`}
                                                        alt=""
                                                        onError={
                                                            NotFoundCMNDImage
                                                        }
                                                        className="imgCMND"
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Ảnh CMND mặt sau
                                        </dt>
                                        <dd className="col-sm-4">
                                            {entityObj.ImgCMNDMatSau !==
                                            null ? (
                                                <>
                                                    <img
                                                        src={`${Constant.PathServer}${entityObj.ImgCMNDMatSau}`}
                                                        alt=""
                                                        onError={
                                                            NotFoundCMNDImage
                                                        }
                                                        className="imgCMND"
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
                                            {' '}
                                            Nghề nghiệp
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNghiep}
                                        </dd>
                                        <dt className="col-sm-2">
                                            {' '}
                                            Nghề nghiệp bổ sung
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNhiepBoSung}
                                        </dd>
                                        <dt className="col-sm-2">
                                            Nơi công tác(nếu có)
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NoiCongTac}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            CMND/CCCD/Hộ chiếu
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoCMND}
                                        </dd>

                                        <dt className="col-sm-2"> Ngày cấp</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayCap
                                            )}
                                        </dd>
                                        <dt className="col-sm-2"> Nơi cấp</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NoiCap}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Bộ phận cơ thể tình nguyện sẽ hiến
                                            sau khi chết
                                        </dt>
                                        <dd className="col-sm-10">
                                            <table className="tablebophanhien">
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Than
                                                            }
                                                        />
                                                        Thận
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Gan
                                                            }
                                                        />
                                                        Gan
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.TuyTang
                                                            }
                                                        />
                                                        Tụy tạng
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Tim
                                                            }
                                                        />
                                                        Tim
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Phoi
                                                            }
                                                        />
                                                        Phổi
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Ruot
                                                            }
                                                        />
                                                        Ruột
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Da
                                                            }
                                                        />
                                                        Da
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.GiacMac
                                                            }
                                                        />
                                                        Giác mạc
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Xuong
                                                            }
                                                        />
                                                        Xương
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.MachMau
                                                            }
                                                        />
                                                        Mạch máu
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.VanTim
                                                            }
                                                        />
                                                        Van tim
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.ChiThe
                                                            }
                                                        />
                                                        Chi thể
                                                    </td>
                                                </tr>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Di nguyện về việc xử lý cơ thể sau
                                            khi hiến mô tạng
                                        </dt>
                                        <dd className="col-sm-10">
                                            {entityObj.DiNguyen}
                                            {', '}
                                            {entityObj.DiNguyenKhac}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="PhieuPDF" title="Phiếu đăng ký PDF">
                            <div style={{padding: '10px', margin: '0 auto'}}>
                                <embed
                                    src={FileDK.PathPDF}
                                    width="100%"
                                    height="600px"
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="lichsuxuly" title="Lịch sử xử lý">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Người cập nhật</th>

                                        <th>Tiêu đề</th>
                                        <th>Nội dung</th>
                                        <th>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entityObj.historyContentDtos ? (
                                        entityObj.historyContentDtos.map(
                                            (itm) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {CommonUtility.ShowDateTimeVN(
                                                                itm.CreatedDate
                                                            )}
                                                        </td>
                                                        <td>{itm.CreatedBy}</td>
                                                        <td>{itm.Title}</td>
                                                        <td>{itm.Content}</td>
                                                        <td>{itm.Comment}</td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Tab>
                    </Tabs>
                </>
            );
        }
        return (
            <div className="row">
                <div className="col-sm-12">
                    <DetailHoSo />
                </div>
            </div>
        );
    };

    return (
        <Container>
            <div className="row">
                <div className="col-sm-8">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Thông tin chi tiết đăng ký hiến mô tạng
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm-4 boxMenuClient">
                    <Button
                        className="btn btn-success"
                        onClick={() => onInPhieu()}
                    >
                        <span className="boxIcon">
                            <i className="fas fa-download" />
                        </span>
                        <span>In phiếu đăng ký</span>
                    </Button>
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Quản lý hồ sơ
                    </Link>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default ChiTietDKHienTang;
