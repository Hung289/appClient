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
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyHienGuiTheConstant from '@modules/Common/DangKyHienGuiTheConstant';
import axios from 'axios';
import {
    Modal,
    // Button,
    // Col,
    // Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';
import * as antd from 'antd';
import {SearchOutlined, DeleteOutlined} from '@ant-design/icons';
import * as antIcon from '@ant-design/icons';
import ReactLoading from 'react-loading';

import {Link, StaticRouter, useHistory} from 'react-router-dom';
// import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';

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
import AdminSecsionHead from '../AdminSecsionHead';

const {
    Drawer,
    Button,
    Space,
    Form,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Dropdown,
    Menu,
    Pagination,
    DatePicker
} = antd;
const {Option} = Select;
const {Column, ColumnGroup} = Table;

const DangKyHienSearchAdm = React.memo((props) => {
    const {
        LoadEntityData,
        searchModel,
        setsearchModel,
        showSearchPanel,
        typeStatus
    } = props;
    const [form] = Form.useForm();
    const SearchSchema = Yup.object().shape({
        HoTenFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        NgaySinhFromFilter: Yup.date().nullable(),
        NgaySinhToFilter: Yup.date().nullable(),
        GioiTinhFilter: Yup.number().nullable(),
        SoDienThoaiFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        NgheNghiepFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự'),
        SoCMNDFilter: Yup.string().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });
    const RenderDropdownData = (dataCateDM, code, field) => {
        return dataCateDM.map((item, key) => {
            const keyData = `${code}-${field}-${key}`;
            // console.log(keyData);
            return (
                <option value={item.Code} key={keyData}>
                    {item.Name}
                </option>
            );
        });
    };
    const [NgheNghiep, setNgheNghiep] = useState([]);

    useEffect(() => {
        DuLieuDanhMuc.GetDMbyCodeNhom('nghenghiep').then((rs) => {
            if (rs.Status) {
                setNgheNghiep(rs.Data);
            }
        });
        return () => {};
    }, [searchModel]);
    const DropDMNgheNghiep = () => {
        return NgheNghiep.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };

    const RenderFormSearch = () => {
        const colSize = 8;
        return (
            <section
                className={`content  ${
                    showSearchPanel ? 'show fade' : 'hidden'
                }`}
            >
                <div className="container-fluid mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <strong>Tìm kiếm</strong>
                                </Card.Header>
                                <Card.Body>
                                    <Form
                                        form={form}
                                        name="basic"
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                        initialValues={{remember: true}}
                                        onFinish={(values) => {
                                            const objSearch = {
                                                ...values,
                                                PageIndex:
                                                    searchModel.PageIndex,
                                                PageSize: searchModel.PageSize
                                            };
                                            setsearchModel(objSearch);
                                            LoadEntityData(
                                                typeStatus,
                                                objSearch
                                            );
                                        }}
                                        onFinishFailed={(errorInfo) => {
                                            notification.error({
                                                placement: 'bottomRight',
                                                message: 'Cảnh báo',
                                                description:
                                                    'Vui lòng kiểm tra lại dữ liệu nhập'
                                            });
                                        }}
                                        autoComplete="off"
                                    >
                                        <Row gutter={24}>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Họ tên"
                                                    name="HoTenFilter"
                                                    // rules={[
                                                    //     {
                                                    //         required: true,
                                                    //         message:
                                                    //             'Vui lòng nhập họ tên'
                                                    //     },
                                                    //     {
                                                    //         type: 'string',
                                                    //         min: 3,
                                                    //         message:
                                                    //             'Bạn cần nhập ít nhất 3 ký tự'
                                                    //     }
                                                    // ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item label="Ngày sinh">
                                                    <Form.Item
                                                        name="NgaySinhFromFilter"
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                            width:
                                                                'calc(50% - 8px)'
                                                        }}
                                                    >
                                                        <DatePicker
                                                            placeholder="Từ ngày"
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="NgaySinhToFilter"
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                            width:
                                                                'calc(50% - 8px)',
                                                            margin: '0 8px'
                                                        }}
                                                    >
                                                        <DatePicker
                                                            placeholder="Đến ngày"
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Giới tính"
                                                    name="GioiTinhFilter"
                                                >
                                                    <Select placeholder="Tất cả">
                                                        <Option value="">
                                                            Tất cả
                                                        </Option>
                                                        <Option value="1">
                                                            Nam
                                                        </Option>
                                                        <Option value="0">
                                                            Nữ
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Điện thoại"
                                                    name="SoDienThoaiFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="CCCD/Hộ chiếu"
                                                    name="SoCMNDFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={colSize}>
                                                <Form.Item
                                                    label="Mã số"
                                                    name="MaSoFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                span={24}
                                                style={{textAlign: 'right'}}
                                            >
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    Tìm kiếm
                                                </Button>
                                                <Button
                                                    style={{margin: '0 8px'}}
                                                    onClick={() => {
                                                        form.resetFields();
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
    return (
        <>
            <RenderFormSearch />
        </>
    );
});
export default DangKyHienSearchAdm;
