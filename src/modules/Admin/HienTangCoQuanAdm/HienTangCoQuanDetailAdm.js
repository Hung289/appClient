/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as Constant from '@app/Constant';

import * as HienTangMoTangStatusConstant from '@modules/Common/HienTangMoTangStatusConstant';

import {
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    Typography,
    layout,
    Layout,
    Upload,
    Button,
    Drawer,
    Tabs,
    Checkbox,
    Descriptions
} from 'antd';

import * as CommonUtility from '@modules/Common/CommonUtility';

const {TabPane} = Tabs;

const {Title} = Typography;
const moment = require('moment');

const HienTangCoQuanDetailAdm = (props) => {
    const {
        entityObj,
        showDetailModal,
        onCloseEntityModal,
        setshowDetailModal
    } = props;

    useEffect(() => {
        console.log(entityObj);
    }, []);

    function CreateModal() {
        return (
            <>
                <Drawer
                    title="Chi tiết thông tin hiến mô tạng"
                    placement="right"
                    size="large"
                    onClose={() => setshowDetailModal(false)}
                    visible={showDetailModal}
                    extra={
                        // eslint-disable-next-line react/jsx-wrap-multilines
                        <Space>
                            <Button onClick={() => setshowDetailModal(false)}>
                                Đóng
                            </Button>
                        </Space>
                    }
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Thông tin cơ bản" key="1">
                            {entityObj !== null && (
                                <Row gutter={16}>
                                    <Col span={9}>
                                        <Descriptions
                                            title="Thông tin hiến tặng cơ quan"
                                            column={1}
                                            size="middle"
                                        >
                                            <Descriptions.Item label="Trạng thái">
                                                {HienTangMoTangStatusConstant.GetName(
                                                    entityObj.Status
                                                )}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Cơ quan hiến">
                                                {entityObj.TenCoQuan}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Ngày hiến">
                                                {CommonUtility.ShowDateVN(
                                                    entityObj.NgayHienTang
                                                )}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Ghi chú">
                                                {entityObj.GhiChu}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Col>
                                    <Col span={15}>
                                        {entityObj.phieuDangKyHien !==
                                            undefined && (
                                            <Descriptions
                                                title="Thông tin hồ sơ đăng ký hiến"
                                                column={2}
                                                size="middle"
                                            >
                                                <Descriptions.Item label="Ảnh">
                                                    {entityObj.phieuDangKyHien
                                                        .Avatar !== '' ? (
                                                        <>
                                                            <img
                                                                src={`${Constant.PathServer}${entityObj.phieuDangKyHien.Avatar}`}
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
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Họ và tên">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .HoTen
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Mã số ">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .MaSo
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Nhóm máu">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NhomMau
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Chiều cao">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .ChieuCao
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Cân nặng">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .ChieuCao
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Giới tính">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .GioiTinhTxt
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Ngày sinh">
                                                    {CommonUtility.ShowDateVN(
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NgaySinh
                                                    )}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Ngày đăng ký">
                                                    {CommonUtility.ShowDateVN(
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NgayDK
                                                    )}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Điện thoại">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .SoDienThoai
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Email">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .Email
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Địa chỉ thường trú">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .DiaChi
                                                    }
                                                    {entityObj.phieuDangKyHien
                                                        .TenXa
                                                        ? `,${entityObj.phieuDangKyHien.TenXa}`
                                                        : ''}

                                                    {entityObj.phieuDangKyHien
                                                        .TenHuyen
                                                        ? `, ${entityObj.phieuDangKyHien}`
                                                              .TenHuyen
                                                        : ''}

                                                    {entityObj.phieuDangKyHien
                                                        .TenTinh
                                                        ? `, ${entityObj.phieuDangKyHien}`
                                                              .TenTinh
                                                        : ''}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="CMND/CCCD/Hộ chiếu">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .SoCMND
                                                    }
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Nghề nghiệp">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NgheNghiep
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Nghề nghiệp bổ sung">
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NgheNhiepBoSung
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    span={2}
                                                    label="Nơi công tác(nếu có)"
                                                >
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .NoiCongTac
                                                    }
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    span={2}
                                                    label="Bộ phận cơ thể tình nguyện sẽ
                                                hiến sau khi qua đời"
                                                />
                                                <Descriptions.Item span={2}>
                                                    <table className="tablebophanhien">
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Than
                                                                    }
                                                                />
                                                                Thận
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Gan
                                                                    }
                                                                />
                                                                Gan
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .TuyTang
                                                                    }
                                                                />
                                                                Tụy tạng
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Tim
                                                                    }
                                                                />
                                                                Tim
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Phoi
                                                                    }
                                                                />
                                                                Phổi
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Ruot
                                                                    }
                                                                />
                                                                Ruột
                                                            </td>

                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Da
                                                                    }
                                                                />
                                                                Da
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .GiacMac
                                                                    }
                                                                />
                                                                Giác mạc
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .Xuong
                                                                    }
                                                                />
                                                                Chi thể
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .MachMau
                                                                    }
                                                                />
                                                                Mạch máu
                                                            </td>

                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .VanTim
                                                                    }
                                                                />
                                                                Van tim
                                                            </td>

                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        entityObj
                                                                            .phieuDangKyHien
                                                                            .ChiThe
                                                                    }
                                                                />
                                                                Chi thể
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Di nguyện về việc xử lý cơ thể
                                          sau khi hiến mô tạng"
                                                >
                                                    {
                                                        entityObj
                                                            .phieuDangKyHien
                                                            .DiNguyen
                                                    }
                                                    {entityObj.phieuDangKyHien
                                                        .DiNguyenKhac !== null
                                                        ? ', '
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .DiNguyenKhac !== null
                                                        ? entityObj
                                                              .phieuDangKyHien
                                                              .DiNguyenKhac
                                                        : ''}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        )}
                                    </Col>
                                </Row>
                            )}
                        </TabPane>
                        <TabPane tab="Lịch sử xử lý" key="2">
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
                        </TabPane>
                    </Tabs>
                </Drawer>
            </>
        );
    }
    return (
        <>
            <CreateModal />
        </>
    );
};

export default HienTangCoQuanDetailAdm;
