import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';
import * as antd from 'antd';
import {SearchOutlined, DeleteOutlined} from '@ant-design/icons';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import axios from 'axios';
import {NotFoundImage} from '@modules/Common/NotFound';
import TimePicker from 'react-time-picker';
import {
    Modal,
    // Button,
    // Col,
    // Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Collapse
    // Tabs,
    // Tab
} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
// import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    DANGKYCHOGHEPTANG_SEARCH_SAVE,
    DANGKYCHOGHEPTANG_SEARCHTOGGLE
} from '@app/store/ActionType/DangKyChoGhepTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import {LayTypePhieuDKGhepTang, LayText} from '@modules/Home/PDKGhepCoQuanKhac';
import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

const DangKyChoGhepTangSearchAdm = React.memo((props) => {
    const {
        LoadEntityData,
        searchModel,
        setsearchModel,
        showSearchPanel,
        onSubmitSearchSave,
        typeStatus
    } = props;
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
        DatePicker,
        Pagination
    } = antd;
    const {Option} = Select;
    const {Column, ColumnGroup} = Table;
    const [form] = Form.useForm();

    const SearchSchema = Yup.object().shape({
        HoTenFilter: Yup.string().min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???'),
        GioiTinhFilter: Yup.number().nullable(),
        NgaySinhFromFilter: Yup.date().nullable(),
        NgaySinhToFilter: Yup.date().nullable(),
        SoDienThoaiFilter: Yup.string().min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???'),
        NgheNghiepFilter: Yup.string().min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???'),
        NhomMauFilter: Yup.string().nullable()
    });
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);

    useEffect(() => {
        DuLieuDanhMuc.GetDMbyCodeNhom('nghenghiep').then((rs) => {
            if (rs.Status) {
                setNgheNghiep(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('nhommau').then((rs) => {
            if (rs.Status) {
                setNhomMau(rs.Data);
            }
        });
        return () => {};
    }, []);
    const DropDMNgheNghiep = () => {
        return NgheNghiep.map((item) => {
            return <Option value={item.Code}>{item.Name}</Option>;
        });
    };
    const DropDMNhomMau = () => {
        return NhomMau.map((item) => {
            return <Option value={item.Code}>{item.Name}</Option>;
        });
    };
    const RenderFormSearch = () => {
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
                                    <strong>T??m ki???m</strong>
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
                                            LoadEntityData(objSearch);
                                            // onSubmitSearchSave(values);
                                        }}
                                        onFinishFailed={(errorInfo) => {
                                            notification.error({
                                                placement: 'bottomRight',
                                                message: 'C???nh b??o',
                                                description:
                                                    'Vui l??ng ki???m tra l???i d??? li???u nh???p'
                                            });
                                        }}
                                        autoComplete="off"
                                        // validationSchema={SearchSchema}
                                        // onSubmit={(values) => {
                                        //     const objSearch = {
                                        //         ...values,
                                        //         PageIndex:
                                        //             searchModel.PageIndex,
                                        //         PageSize: searchModel.PageSize
                                        //     };
                                        //     setsearchModel(objSearch);
                                        //     LoadEntityData(objSearch);
                                        // }}
                                    >
                                        <Row gutter={24}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="H??? t??n"
                                                    name="HoTenFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item label="Ng??y sinh">
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
                                                            placeholder="T??? ng??y"
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
                                                            placeholder="?????n ng??y"
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Gi???i t??nh"
                                                    name="GioiTinhFilter"
                                                >
                                                    <Select placeholder="T???t c???">
                                                        <Option value="">
                                                            T???t c???
                                                        </Option>
                                                        <Option value="1">
                                                            Nam
                                                        </Option>
                                                        <Option value="0">
                                                            N???
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="S??? ??i???n tho???i"
                                                    name="SoDienThoaiFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Ngh??? nghi???p"
                                                    name="NgheNghiepFilter"
                                                >
                                                    <Select placeholder="T???t c???">
                                                        <Option value="">
                                                            T???t c???
                                                        </Option>
                                                        {NgheNghiep.map(
                                                            (item) => {
                                                                return (
                                                                    <Option
                                                                        value={
                                                                            item.Code
                                                                        }
                                                                    >
                                                                        {
                                                                            item.Name
                                                                        }
                                                                    </Option>
                                                                );
                                                            }
                                                        )}
                                                        {/* <DropDMNgheNghiep /> */}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Nh??m m??u "
                                                    name="NhomMauFilter"
                                                >
                                                    <Select placeholder="T???t c???">
                                                        <Option value="">
                                                            T???t c???
                                                        </Option>
                                                        {NhomMau.map((item) => {
                                                            return (
                                                                <Option
                                                                    value={
                                                                        item.Code
                                                                    }
                                                                >
                                                                    {item.Name}
                                                                </Option>
                                                            );
                                                        })}
                                                        {/* <DropDMNhomMau /> */}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="M?? s???"
                                                    name="MaSoFilter"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* {({errors, touched}) => (
                                            <Form>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="HoTenFilter">
                                                                H??? t??n
                                                            </label>
                                                            <Field
                                                                name="HoTenFilter"
                                                                key="HoTenFilter"
                                                                className="form-control "
                                                            />

                                                            {errors.HoTenFilter &&
                                                            touched.HoTenFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.HoTenFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-8">
                                                            <label htmlFor="NgaySinhFromFilter">
                                                                Ng??y sinh
                                                            </label>
                                                            <div className="input-group">
                                                                <Field
                                                                    type="date"
                                                                    name="NgaySinhFromFilter"
                                                                    key="NgaySinhFromFilter"
                                                                    className="form-control "
                                                                />
                                                                {errors.NgaySinhFromFilter &&
                                                                touched.NgaySinhFromFilter ? (
                                                                    <>
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors.NgaySinhFromFilter
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : null}
                                                                <span className="input-group-text">
                                                                    ?????n
                                                                </span>
                                                                <Field
                                                                    type="date"
                                                                    name="NgaySinhToFilter"
                                                                    key="NgaySinhToFilter"
                                                                    className="form-control "
                                                                />
                                                                {errors.NgaySinhToFilter &&
                                                                touched.NgaySinhToFilter ? (
                                                                    <>
                                                                        <div className="invalid-feedback">
                                                                            {
                                                                                errors.NgaySinhToFilter
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="GioiTinhFilter">
                                                                Gi???i t??nh
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="GioiTinhFilter"
                                                                key="GioiTinhFilter"
                                                                className="form-control"
                                                            >
                                                                <option value="">
                                                                    --Ch???n--
                                                                </option>
                                                                <option value="1">
                                                                    Nam
                                                                </option>
                                                                <option value="0">
                                                                    N???
                                                                </option>
                                                            </Field>
                                                            {errors.GioiTinhFilter &&
                                                            touched.GioiTinhFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.GioiTinhFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="SoDienThoaiFilter">
                                                                S??? ??i???n tho???i
                                                            </label>
                                                            <Field
                                                                name="SoDienThoaiFilter"
                                                                key="SoDienThoaiFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.SoDienThoaiFilter &&
                                                            touched.SoDienThoaiFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.SoDienThoaiFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="NgheNghiepFilter">
                                                                Ngh??? nghi???p
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="NgheNghiepFilter"
                                                                key="NgheNghiepFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Ch???n--
                                                                </option>
                                                                <DropDMNgheNghiep />

                                                                
                                                            </Field>

                                                            {errors.NgheNghiepFilter &&
                                                            touched.NgheNghiepFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.NgheNghiepFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="NhomMauFilter">
                                                                Nh??m m??u ABO
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name="NhomMauFilter"
                                                                key="NhomMauFilter"
                                                                className="form-control "
                                                            >
                                                                <option value="">
                                                                    --Ch???n--
                                                                </option>
                                                                <DropDMNhomMau />
                                                               
                                                            </Field>

                                                            {errors.NhomMauFilter &&
                                                            touched.NhomMauFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.NhomMauFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="MaSoFilter">
                                                                M?? s???
                                                            </label>
                                                            <Field
                                                                name="MaSoFilter"
                                                                key="MaSoFilter"
                                                                className="form-control "
                                                            />
                                                            {errors.MaSoFilter &&
                                                            touched.MaSoFilter ? (
                                                                <>
                                                                    <div className="invalid-feedback">
                                                                        {
                                                                            errors.MaSoFilter
                                                                        }
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <Button
                                                            variant="success"
                                                            size="md"
                                                            type="submit"
                                                            className="button-action"
                                                        >
                                                            <i
                                                                className="fa fa-search"
                                                                aria-hidden="true"
                                                            />{' '}
                                                            T??m ki???m
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )} */}
                                        <Row>
                                            <Col
                                                span={24}
                                                style={{textAlign: 'right'}}
                                            >
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    T??m ki???m
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

export default DangKyChoGhepTangSearchAdm;
