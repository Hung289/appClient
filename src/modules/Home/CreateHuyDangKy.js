import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import {NotFoundImage} from '@modules/Common/NotFound';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyHienMoTangConstant from '@modules/Common/DangKyHienMoTangConstant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';

import axios from 'axios';
import {
    Modal,
    Button,
    Col,
    Container,
    Row,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Card,
    Tabs,
    Tab
} from 'react-bootstrap';
import {Link, StaticRouter, useHistory, useParams} from 'react-router-dom';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as huyDangKyService from '@app/services/huyDangKyService';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {removeAscent, canhbaoErrorModal} from '@modules/Common/CommonUtility';
import ReactLoading from 'react-loading';

import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong,
    RenderTenTinh,
    RenderTenQuanhuyen,
    RenderTenXaphuong
} from '@modules/Common/LoadDiachi';

const CreateHuyDangKy = (props) => {
    const formCreateEntity = useRef(null);
    const [objDKHien, setobjDKHien] = useState({});
    const [objDKChoGhep, setobjDKChoGhep] = useState({});
    const formRef = useRef();
    const history = useHistory();
    const {id, typeData} = useParams();
    const [isload, setisload] = useState(false);
    const [IsDone, setIsDone] = useState({state: false, data: {}});
    useEffect(() => {
        if (typeData === 'DangKyHien') {
            dangKyHienTangService.GetDetailDto(id).then((x) => {
                setobjDKHien(x);
            });
        } else {
            dangKyChoGhepTangService.GetDetailDto(id).then((x) => {
                setobjDKChoGhep(x);
            });
        }

        return () => {};
    }, []);

    const SignupSchema = Yup.object().shape({
        IdDon: Yup.number().required('Vui lòng nhập thông tin này'),
        LyDo: Yup.string().trim().required('Vui lòng nhập thông tin này'),
        TypeDangKy: Yup.string().required('Vui lòng nhập thông tin này')
    });
    const RenderKetQua = () => {
        return (
            <div className="row">
                <div className="col-sm-12 ">
                    <div className="pdk-hien-tieude">
                        <div className="headerClientPage">
                            GỬI YÊU CẦU HỦY ĐƠN ĐĂNG KÝ THÀNH CÔNG
                        </div>
                    </div>
                    <div>
                        <div className="paddingleft10">
                            <div>
                                Hệ thống đã ghi nhận thông tin hủy đăng ký của
                                ông/bà
                            </div>
                            <div>
                                Hiện tại chúng tôi đang xử lý sẽ thông báo lại
                                kết quả với Ông/bà trong thời gian sớm nhất
                            </div>

                            <div>Trân trọng./.</div>
                            <div className="alert alert-warning">
                                <div>
                                    Để hoàn tất quy trình đăng ký vui lòng tải
                                    xuống đơn hủy đăng ký sau đó ký xác nhận và
                                    gửi tới địa chỉ sau:
                                </div>
                                <div>
                                    <ul>
                                        <li>
                                            <b>
                                                ĐƠN VỊ ĐIỀU PHỐI GHÉP CÁC BỘ
                                                PHẬN CƠ THỂ NGƯỜI BỆNH VIỆN CHỢ
                                                RẪY
                                            </b>
                                        </li>
                                        <li>
                                            Địa chỉ: 201B Nguyễn Chí Thanh,
                                            Phường 12, Quận 5, Hồ Chí Minh, Việt
                                            Nam
                                        </li>
                                        <li>
                                            Điện thoại trong giờ hành chính:
                                            (84-028) 38554137 – 1184 hay
                                            (84-028) 39560139 | Fax: (84-028)
                                            39560139
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ShowInfoPhieuDangKy = () => {
        return (
            <div className="alert alert-custom">
                <h4>Thông tin phiếu đăng ký hiến</h4>
                <div>
                    <table className="tblInfoData">
                        <tr>
                            <td rowSpan={5}>
                                {objDKHien.Avatar !== '' ? (
                                    <img
                                        src={`${Constant.PathServer}${objDKHien.Avatar}`}
                                        alt=""
                                        onError={NotFoundUserImage}
                                        className="imgHinhAnhAccountLarge "
                                    />
                                ) : (
                                    <></>
                                )}
                            </td>
                            <td>Họ Tên</td>
                            <td>{objDKHien.HoTen}</td>
                        </tr>
                        <tr>
                            <td>Giới tính</td>
                            <td>{objDKHien.GioiTinhTxt}</td>
                        </tr>
                        <tr>
                            <td> Ngày sinh</td>
                            <td>
                                {CommonUtility.ShowDateVN(objDKHien.NgaySinh)}
                            </td>
                        </tr>
                        <tr>
                            <td> Trạng thái</td>
                            <td>
                                <span
                                    className={`labelStatus HienTang ${DangKyHienMoTangConstant.GetStyle(
                                        objDKHien.Status
                                    )}`}
                                >
                                    {DangKyHienMoTangConstant.GetName(
                                        objDKHien.Status
                                    )}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td> Ngày đăng ký</td>
                            <td>
                                {CommonUtility.ShowDateVN(objDKHien.NgayDK)}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    };

    const ShowInfoChoGhep = () => {
        return (
            <div className="alert alert-custom">
                <h4>Thông tin phiếu đăng ký chờ ghép</h4>
                <div>
                    <table className="tblInfoData">
                        <tr>
                            <td rowSpan={5}>
                                {objDKChoGhep.Avatar !== '' ? (
                                    <img
                                        src={`${Constant.PathServer}${objDKChoGhep.Avatar}`}
                                        alt=""
                                        onError={NotFoundUserImage}
                                        className="imgHinhAnhAccountLarge "
                                    />
                                ) : (
                                    <></>
                                )}
                            </td>
                            <td>Họ Tên</td>
                            <td>{objDKChoGhep.HoTenBN}</td>
                        </tr>
                        <tr>
                            <td>Giới tính</td>
                            <td>{objDKChoGhep.GioiTinhTxt}</td>
                        </tr>
                        <tr>
                            <td> Ngày sinh</td>
                            <td>
                                {CommonUtility.ShowDateVN(
                                    objDKChoGhep.NgaySinh
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td> Trạng thái</td>
                            <td>
                                <span
                                    className={`labelStatus HienTang ${DangKyChoGhepConstant.GetStyle(
                                        objDKChoGhep.Status
                                    )}`}
                                >
                                    {DangKyChoGhepConstant.GetName(
                                        objDKChoGhep.Status
                                    )}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td> Ngày đăng ký</td>
                            <td>
                                {CommonUtility.ShowDateVN(objDKChoGhep.NgayDK)}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    };

    function EditModal() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };

        return (
            <Row>
                <Col md={12}>
                    <div className="">
                        <div className="Title-Login-Register center">
                            {typeData === 'DangKyHien' ? (
                                <>Gửi đơn hủy đăng ký hiến mô tạng</>
                            ) : (
                                <>Gửi đơn hủy đăng ký chờ ghép mô tạng</>
                            )}
                        </div>
                    </div>
                    <div>
                        {typeData === 'DangKyHien' ? (
                            <ShowInfoPhieuDangKy />
                        ) : (
                            <ShowInfoChoGhep />
                        )}
                    </div>
                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                IdDon: id,
                                TypeDangKy: typeData,
                                Status: 'ChoTiepNhan',
                                LyDo: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                // same shape as initial values

                                setisload(true);
                                huyDangKyService
                                    .CreateNewEntity(values)
                                    .then((itemdata) => {
                                        if (itemdata.Status === true) {
                                            toast.success(
                                                'Cập nhật đăng ký hiến tạng thành công'
                                            );
                                            setIsDone({state: true});
                                        } else {
                                            toast.error(itemdata.MessageError);
                                        }
                                        setisload(false);
                                    });
                            }}
                        >
                            {({errors, touched, values, setFieldValue}) => (
                                <Form ref={formCreateEntity} className="wid100">
                                    <Field
                                        type="hidden"
                                        name="IdDon"
                                        key="IdDon"
                                    />
                                    <Field
                                        type="hidden"
                                        name="TypeDangKy"
                                        key="TypeDangKy"
                                    />

                                    <div className="row">
                                        <div className="form-group wid100">
                                            <label
                                                className="control-label col-sm-12"
                                                htmlFor="LyDo"
                                            >
                                                Lý do hủy đăng ký{' '}
                                                <span className="red">*</span>
                                            </label>

                                            <div className="col-sm-12">
                                                <Field
                                                    as="textarea"
                                                    name="LyDo"
                                                    key="LyDo"
                                                    className="form-control "
                                                />
                                                {errors.LyDo && touched.LyDo ? (
                                                    <>
                                                        <div className="invalid-feedback">
                                                            {errors.LyDo}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                    <div className="center mgb15 mgt15">
                        {/* <Button
                            variant="secondary"
                            onClick={() => onCloseEntityEditModal()}
                        >
                            Đóng
                        </Button> */}
                        <Button
                            className="btn-lg"
                            variant="primary"
                            onClick={() => {
                                submitEdit();
                                canhbaoErrorModal(formRef);
                            }}
                        >
                            Hoàn thành
                        </Button>
                    </div>
                </Col>
            </Row>
        );
    }
    return (
        <Container>
            {isload ? (
                <div className="coverLoader">
                    <ReactLoading
                        className="loaderItem"
                        type="bars"
                        color="#2980b9"
                        height="100px"
                        width="100px"
                    />
                </div>
            ) : null}
            <div className="col-sm-12 boxMenuClient">
                {' '}
                <Link to="/hshienghep" className="btn btn-link btn-sm">
                    <i className="fas fa-reply" /> Quản lý hồ sơ
                </Link>
            </div>
            {IsDone.state ? <RenderKetQua /> : <EditModal />}
        </Container>
    );
};

export default CreateHuyDangKy;
