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

const HienTangCoQuanCreateAdm = (props) => {
    const formRef = useRef();
    const {
        setIsShowCreatePopup,
        IsShowCreatePopup,
        OnLoadingAction,
        onReloadPage,
        entityObj
    } = props;

    const onCreateEntity = (objCreate) => {
        OnLoadingAction(true);
        hienTangCoQuanService.CreateNewEntity(objCreate).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                setIsShowCreatePopup(false);
                onReloadPage();
            }
        });
    };
    useEffect(() => {}, []);

    function CreateModal() {
        return (
            <>
                <Modal
                    show={IsShowCreatePopup}
                    dialogClassName="modal-90w"
                    onHide={() => setIsShowCreatePopup(false)}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Tạo mới thông tin hiến mô tạng
                        </Modal.Title>
                    </Modal.Header>
                    <Form
                        onFinish={onCreateEntity}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            IdNguoiHien: entityObj.Id,
                            CoQuanHien: '',
                            NgayHienTang: '',
                            Status: HienTangMoTangStatusConstant.MoiTao,
                            GhiChu: ''
                        }}
                    >
                        <Modal.Body>
                            <Row gutter={16}>
                                <Col span={9}>
                                    <Title level={5}>
                                        Thông tin mô, tạng hiến
                                    </Title>
                                    <Form.Item hidden name="Status">
                                        <Input name="Status" />
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
                                        validateTrigger={['onBlur', 'onChange']}
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
                                                        new Date('1920-1-1') >
                                                        new Date(val)
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
                                        validateTrigger={['onBlur', 'onChange']}
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            name="NgayHienTang"
                                            style={{width: '100%'}}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Ghi chú"
                                        validateTrigger={['onBlur', 'onChange']}
                                        name="GhiChu"
                                    >
                                        <Input.TextArea name="GhiChu" />
                                    </Form.Item>
                                </Col>
                                <Col span={15}>
                                    <Descriptions
                                        title="Thông tin hồ sơ đăng ký hiến"
                                        column={2}
                                        size="middle"
                                    >
                                        <Descriptions.Item label="Ảnh">
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
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Họ và tên">
                                            {entityObj.HoTen}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mã số ">
                                            {entityObj.MaSo}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Giới tính">
                                            {entityObj.GioiTinhTxt}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày sinh">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgaySinh
                                            )}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Ngày đăng ký">
                                            {CommonUtility.ShowDateVN(
                                                entityObj.NgayDK
                                            )}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Điện thoại">
                                            {entityObj.SoDienThoai}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {entityObj.Email}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ thường trú">
                                            {entityObj.DiaChi}
                                            {entityObj.TenXa !== null
                                                ? ', '
                                                : ''}
                                            {entityObj.TenXa !== null
                                                ? entityObj.TenXa
                                                : ''}
                                            {entityObj.TenHuyen !== null
                                                ? ', '
                                                : ''}
                                            {entityObj.TenHuyen !== null
                                                ? entityObj.TenHuyen
                                                : ''}
                                            {entityObj.TenTinh !== null
                                                ? ', '
                                                : ''}
                                            {entityObj.TenTinh !== null
                                                ? entityObj.TenTinh
                                                : ''}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="CMND/CCCD/Hộ chiếu">
                                            {entityObj.SoCMND}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nghề nghiệp">
                                            {entityObj.NgheNghiep}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nghề nghiệp bổ sung">
                                            {entityObj.NgheNhiepBoSung}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            span={2}
                                            label="Nơi công tác(nếu có)"
                                        >
                                            {entityObj.NoiCongTac}
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
                                                        Chi thể
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
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="Di nguyện về việc xử lý cơ thể
                                          sau khi hiến mô tạng"
                                        >
                                            {entityObj.DiNguyen}
                                            {entityObj.DiNguyenKhac !== null
                                                ? ', '
                                                : ''}
                                            {entityObj.DiNguyenKhac !== null
                                                ? entityObj.DiNguyenKhac
                                                : ''}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="secondary"
                                onClick={() => setIsShowCreatePopup(false)}
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
            <CreateModal />
        </>
    );
};

export default HienTangCoQuanCreateAdm;
