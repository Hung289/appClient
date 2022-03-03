import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    Modal,
    Button,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse,
    Tabs,
    Tab
} from 'react-bootstrap';
import * as CommonUtility from '@modules/Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const KQXetNghiemDetailAdm = (props) => {
    const {entityKQObj, setshowDetailKQModal, showDetailKQModal} = props;
    // console.log(entityKQObj);
    // console.log(showDetailKQModal);

    function DetailKQModal() {
        const [keytab, setKey] = useState('VGSVB');
        const renderCheckBox = (value) => {
            if (value === true || value === 1) {
                return <input type="checkbox" disabled checked />;
            }
            return <input type="checkbox" disabled />;
        };
        return (
            <>
                <Modal
                    show={showDetailKQModal}
                    dialogClassName="modal-90w"
                    onHide={() => setshowDetailKQModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết kết quả xét nghiệm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={keytab}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="VGSVB" title="I. Viêm gan siêu vi B">
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                I. Viêm gan siêu vi B
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Có bị viêm gan không
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanB
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Bị trước chạy thận nhân tạo
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanBTruocCTNT
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Bị sau chạy thận nhân tạo
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanBSauCTNT
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Có điều trị viêm gan
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanBCoDieuTri
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc đang sử dụng
                                            </dt>
                                            <dd className="col-sm-6">
                                                {
                                                    entityKQObj.ViemGanBThuocSuDung
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày bắt đầu điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBNgayBatDauDieuTri
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thời gian điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.ViemGanBThoiGianDieuTri
                                                }
                                                {' tháng'}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Ngày kết thúc điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBNgayKetThuDieuTri
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 1
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBAmTinhLan2
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 2
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBAmTinhLan2
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 3
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBAmTinhLan3
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                {' '}
                                                Ngày âm tính lần 4
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBAmTinhLan4
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 1
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBDuongTinhCopies1
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 2
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBDuongTinhCopies2
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 3
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBDuongTinhCopies3
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 4
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanBDuongTinhCopies4
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Đã hoàn tất lộ trình điều trị
                                                cách nay
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.ViemGanBHoanTatDieuTriCachNay
                                                }
                                                {' tháng'}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="VGSVC"
                                title="II. Viêm gan siêu vi C"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                II. Viêm gan siêu vi C
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Có bị viêm gan không
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanC
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Bị trước chạy thận nhân tạo
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanCTruocCTNT
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Bị sau chạy thận nhân tạo
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanCSauCTNT
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Có điều trị viêm gan
                                            </dt>
                                            <dd className="col-sm-2">
                                                {renderCheckBox(
                                                    entityKQObj.ViemGanCCoDieuTri
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc đang sử dụng
                                            </dt>
                                            <dd className="col-sm-6">
                                                {
                                                    entityKQObj.ViemGanCThuocSuDung
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày bắt đầu điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCNgayBatDauDieuTri
                                                )}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thời gian điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.ViemGanCThoiGianDieuTri
                                                }
                                                {' tháng'}
                                            </dd>
                                            <dt className="col-sm-2">
                                                Ngày kết thúc điều trị
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCNgayKetThuDieuTri
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 1
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan1
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 2
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan2
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 3
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan3
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                {' '}
                                                Ngày âm tính lần 4
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan4
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 5
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan5
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 6
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan6
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Ngày âm tính lần 7
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan7
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                {' '}
                                                Ngày âm tính lần 8
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCAmTinhLan8
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 1
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCDuongTinhCopies1
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 2
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCDuongTinhCopies2
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 3
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCDuongTinhCopies3
                                                )}
                                            </dd>
                                            <dt className="col-sm-1">
                                                Dương tính với số copies lần 4
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.ViemGanCDuongTinhCopies4
                                                )}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody1"
                                title="III. PRA và  Anti HLA antibody Lần 1"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                III. PRA và Anti HLA antibody
                                                Lần 1
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan1NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan1TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan1A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan1LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan1ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan1TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody2"
                                title="IV. PRA và  Anti HLA antibody Lần 2"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                IV. PRA và Anti HLA antibody Lần
                                                2
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan2NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan2TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan2A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan2LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan2ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan2TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody3"
                                title="V. PRA và  Anti HLA antibody Lần 3"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                V. PRA và Anti HLA antibody Lần
                                                3
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan3NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan3TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan3A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan3LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan3ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan3TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody4"
                                title="VI. PRA và  Anti HLA antibody Lần 4"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                VI. PRA và Anti HLA antibody Lần
                                                4
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan4NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan4TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan4A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan4LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan4ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan4TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody5"
                                title="VII. PRA và  Anti HLA antibody Lần 5"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                VII. PRA và Anti HLA antibody
                                                Lần 5
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan5NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan5TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan5A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan5LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan5ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan5TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody6"
                                title="VIII. PRA và  Anti HLA antibody Lần 6"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                VIII. PRA và Anti HLA antibody
                                                Lần 6
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan6NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan6TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan6A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan6LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan6ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan6TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab
                                eventKey="antibody7"
                                title="IX. PRA và  Anti HLA antibody Lần 7"
                            >
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                IX. PRA và Anti HLA antibody Lần
                                                7
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Ngày thực hiện
                                            </dt>
                                            <dd className="col-sm-2">
                                                {CommonUtility.ShowDateVN(
                                                    entityKQObj.AntibodyLan7NgayThucHien
                                                )}
                                            </dd>

                                            <dt className="col-sm-2">
                                                Tỷ lệ PRA
                                            </dt>
                                            <dd className="col-sm-2">
                                                {
                                                    entityKQObj.AntibodyLan7TiLePRA
                                                }
                                                {' %'}
                                            </dd>
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-2">
                                                {entityKQObj.AntibodyLan7A}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                ĐIều trị
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">
                                                Lọc huyết tương
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan7LocHuyetTuong
                                                }
                                            </dd>
                                            <dt className="col-sm-2">
                                                Thuốc UCMD
                                            </dt>
                                            <dd className="col-sm-4">
                                                {
                                                    entityKQObj.AntibodyLan7ThuocUCMD
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl>
                                            <dt className="col-sm-2">
                                                Theo dõi
                                            </dt>
                                            <dd className="col-sm-10">
                                                {
                                                    entityKQObj.AntibodyLan7TheoDoi
                                                }
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                            <Tab eventKey="HLA" title="X. HLA">
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-12">
                                                X. HLA
                                            </dt>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row">
                                            <dt className="col-sm-2">A</dt>
                                            <dd className="col-sm-10">
                                                {entityKQObj.HLAA}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-2">B</dt>
                                            <dd className="col-sm-10">
                                                {entityKQObj.HLAB}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-2">DRB1</dt>
                                            <dd className="col-sm-10">
                                                {entityKQObj.HLADRB1}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-2">DQA1</dt>
                                            <dd className="col-sm-10">
                                                {entityKQObj.HLADQA1}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <dl className="row ">
                                            <dt className="col-sm-2">DQB1</dt>
                                            <dd className="col-sm-10">
                                                {entityKQObj.HLADQB1}
                                            </dd>
                                        </dl>
                                    </ListGroupItem>
                                </ListGroup>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setshowDetailKQModal(false)}
                        >
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <>
            <DetailKQModal />
        </>
    );
};

export default KQXetNghiemDetailAdm;
