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
                        <Tab eventKey="thongtincoban" title="Th??ng tin c?? b???n">
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">???nh</dt>
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
                                        <dt className="col-sm-1">H??? v?? t??n</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.HoTen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            M?? s??? b???nh nh??n
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.MaSo}
                                        </dd>
                                        <dt className="col-sm-1">Gi???i t??nh</dt>
                                        <dd className="col-sm-1">
                                            {entityObj.GioiTinhTxt}
                                        </dd>
                                        <dt className="col-sm-1">Ng??y sinh</dt>
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
                                            ??i???n tho???i
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoDienThoai}
                                        </dd>
                                        <dt className="col-sm-1">
                                            {' '}
                                            ??i???n tho???i Kh??c
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
                                            ?????a ch??? th?????ng tr??
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChi}
                                        </dd>
                                        <dt className="col-sm-1">
                                            X??/ Ph?????ng:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXa}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Qu???n/ Huy???n:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyen}
                                        </dd>
                                        <dt className="col-sm-1">
                                            T???nh/T.Ph???:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenTinh}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-1">
                                            ?????a ch??? nh???n th??? ??K
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.DiaChiNhanTheDangKy}
                                        </dd>
                                        <dt className="col-sm-1">
                                            X??/ Ph?????ng:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenXaNhanThe}
                                        </dd>
                                        <dt className="col-sm-1">
                                            Qu???n/ Huy???n:
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.TenHuyenNhanThe}
                                        </dd>
                                        <dt className="col-sm-1">
                                            T???nh/T.Ph???:
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
                                            ???nh CMND m???t tr?????c
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
                                            ???nh CMND m???t sau
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
                                            Ngh??? nghi???p
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNghiep}
                                        </dd>
                                        <dt className="col-sm-2">
                                            {' '}
                                            Ngh??? nghi???p b??? sung
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NgheNhiepBoSung}
                                        </dd>
                                        <dt className="col-sm-2">
                                            N??i c??ng t??c(n???u c??)
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NoiCongTac}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            CMND/CCCD/H??? chi???u
                                        </dt>
                                        <dd className="col-sm-2">
                                            {entityObj.SoCMND}
                                        </dd>

                                        <dt className="col-sm-2"> Ng??y c???p</dt>
                                        <dd className="col-sm-2">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayCap
                                            )}
                                        </dd>
                                        <dt className="col-sm-2"> N??i c???p</dt>
                                        <dd className="col-sm-2">
                                            {entityObj.NoiCap}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            B??? ph???n c?? th??? t??nh nguy???n s??? hi???n
                                            sau khi ch???t
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
                                                        Th???n
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
                                                        T???y t???ng
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
                                                        Ph???i
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.Ruot
                                                            }
                                                        />
                                                        Ru???t
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
                                                        Gi??c m???c
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
                                                        X????ng
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                entityObj.MachMau
                                                            }
                                                        />
                                                        M???ch m??u
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
                                                        Chi th???
                                                    </td>
                                                </tr>
                                            </table>
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">
                                            Di nguy???n v??? vi???c x??? l?? c?? th??? sau
                                            khi hi???n m?? t???ng
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
                        <Tab eventKey="PhieuPDF" title="Phi???u ????ng k?? PDF">
                            <div style={{padding: '10px', margin: '0 auto'}}>
                                <embed
                                    src={FileDK.PathPDF}
                                    width="100%"
                                    height="600px"
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="lichsuxuly" title="L???ch s??? x??? l??">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Th???i gian</th>
                                        <th>Ng?????i c???p nh???t</th>

                                        <th>Ti??u ?????</th>
                                        <th>N???i dung</th>
                                        <th>Ghi ch??</th>
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
                                                Kh??ng c?? d??? li???u
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
                        <Breadcrumb.Item href="/">Trang ch???</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Th??ng tin chi ti???t ????ng k?? hi???n m?? t???ng
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
                        <span>In phi???u ????ng k??</span>
                    </Button>
                    <Link to="/hshienghep" className="btn btn-link btn-sm">
                        <i className="fas fa-reply" /> Qu???n l?? h??? s??
                    </Link>
                </div>
            </div>
            <RenderDataMain />
        </Container>
    );
};

export default ChiTietDKHienTang;
