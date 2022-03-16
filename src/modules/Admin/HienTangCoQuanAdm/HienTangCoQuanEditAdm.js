/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';

import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import * as Constant from '@app/Constant';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import axios from 'axios';
import {Modal} from 'react-bootstrap';

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
    Checkbox,
    Descriptions
} from 'antd';

import * as hienTangCoQuanService from '@app/services/HienTangCoQuanService';

import * as CommonUtility from '@modules/Common/CommonUtility';

const {Title} = Typography;
const moment = require('moment');

const HienTangCoQuanEditAdm = (props) => {
    const {
        IsShowEditPopup,
        entityObj,
        onCloseEntityEditModal,
        OnLoadingAction,
        onReloadPage
    } = props;

    const onCreateEntity = (objCreate) => {
        OnLoadingAction(true);
        hienTangCoQuanService.EditNewEntity(objCreate).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditModal();
                onReloadPage();
            }
        });
    };
    useEffect(() => {}, []);

    function EditModal() {
        return (
            <>
                <Modal
                    show={IsShowEditPopup}
                    dialogClassName="modal-90w"
                    onHide={() => onCloseEntityEditModal()}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cập nhật thông tin hiến mô tạng
                        </Modal.Title>
                    </Modal.Header>
                    <Form
                        onFinish={onCreateEntity}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            Id: entityObj.Id,
                            IdNguoiHien: entityObj.IdNguoiHien,
                            CoQuanHien: entityObj.CoQuanHien,
                            NgayHienTang:
                                entityObj.NgayHienTang !== null
                                    ? moment(entityObj.NgayHienTang)
                                    : '',
                            Status: entityObj.Status,
                            GhiChu: entityObj.GhiChu
                        }}
                    >
                        <Modal.Body>
                            {entityObj !== null && (
                                <Row gutter={16}>
                                    <Col span={9}>
                                        <Title level={5}>
                                            Thông tin mô, tạng hiến
                                        </Title>
                                        <Form.Item hidden name="Status">
                                            <Input name="Status" />
                                        </Form.Item>
                                        <Form.Item hidden name="Id">
                                            <Input name="Id" />
                                        </Form.Item>
                                        <Form.Item hidden name="IdNguoiHien">
                                            <Input name="IdNguoiHien" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Cơ quan hiến"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Vui lòng nhập thông tin này'
                                                }
                                            ]}
                                            name="CoQuanHien"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                        >
                                            <Select
                                                defaultValue=""
                                                name="CoQuanHien"
                                            >
                                                {TypeBoPhanConstant.RenderDropdown()}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Ngày hiến"
                                            rules={[
                                                {
                                                    type: 'object',
                                                    required: true,
                                                    message:
                                                        'Vui lòng nhập thông tin này'
                                                },
                                                () => ({
                                                    validator(_, val) {
                                                        if (
                                                            new Date() <
                                                            new Date(val)
                                                        ) {
                                                            // eslint-disable-next-line prefer-promise-reject-errors
                                                            return Promise.reject(
                                                                'Ngày hiến vượt quá ngày hiện tại'
                                                            );
                                                        }
                                                        if (
                                                            new Date(
                                                                '1920-1-1'
                                                            ) > new Date(val)
                                                        ) {
                                                            // eslint-disable-next-line prefer-promise-reject-errors
                                                            return Promise.reject(
                                                                'Ngày hiến phải sau ngày 1 tháng 1 năm 1920'
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                            name="NgayHienTang"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                name="NgayHienTang"
                                                style={{width: '100%'}}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ghi chú"
                                            validateTrigger={[
                                                'onBlur',
                                                'onChange'
                                            ]}
                                            name="GhiChu"
                                        >
                                            <Input.TextArea name="GhiChu" />
                                        </Form.Item>
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
                                                        .TenXa !== null
                                                        ? ', '
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .TenXa !== null
                                                        ? entityObj
                                                              .phieuDangKyHien
                                                              .TenXa
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .TenHuyen !== null
                                                        ? ', '
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .TenHuyen !== null
                                                        ? entityObj
                                                              .phieuDangKyHien
                                                              .TenHuyen
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .TenTinh !== null
                                                        ? ', '
                                                        : ''}
                                                    {entityObj.phieuDangKyHien
                                                        .TenTinh !== null
                                                        ? entityObj
                                                              .phieuDangKyHien
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                                                                    checked={
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => onCloseEntityEditModal()}
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
            <EditModal />
        </>
    );
};

export default HienTangCoQuanEditAdm;
