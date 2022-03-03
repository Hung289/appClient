import React, {useState, useRef, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import * as Yup from 'yup';
import * as AccountService from '@app/services/AccountServerService';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {removeAscent} from '@modules/Common/CommonUtility';
import ReactLoading from 'react-loading';
import {
    loadCaptchaEnginge,
    LoadCanvasTemplate,
    LoadCanvasTemplateNoReload,
    validateCaptcha
} from 'react-simple-captcha';
import {
    RenderDropdownTinh,
    RenderDropdownQuanhuyen,
    RenderDropdownXaphuong
} from '@modules/Common/LoadDiachi';

const Dangky = (props) => {
    let showHidePassword = useRef(false);
    const changeShowHidePassword = (bools) => {
        showHidePassword = bools;
    };
    const [isload, setisload] = useState(false);
    const [isDoneRegister, setisDoneRegister] = useState(false);
    const formRef = useRef();
    const history = useHistory();
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };
    useEffect(async () => {
        loadCaptchaEnginge(6);
        document.getElementById('reload_href').text = 'Đổi mã';
    }, []);
    const {onCreateAccount} = props;

    const SignupSchema = Yup.object().shape({
        // TENDANGNHAP: Yup.string()
        //     .trim()
        //     .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
        //     .max(255, 'Vui lòng nhập không quá 255 ký tự')
        //     .required('Vui lòng nhập thông tin này')
        //     .test('xxx', 'Tên đăng nhập phải sử dụng cả chữ cái', (val) => {
        //         if (val !== undefined) {
        //             for (let i = 0; i < val.length; i += 1) {
        //                 if (/^[a-zA-Z ]*$/.test(val[i])) {
        //                     return true;
        //                 }
        //             }
        //             return false;
        //         }
        //         return true;
        //     }),
        MATKHAU: Yup.string()
            .trim()
            .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('xxx', 'Mật khẩu phải sử dụng cả chữ cái và số', (val) => {
                let so = false;
                let chu = false;
                if (val !== undefined) {
                    for (let i = 0; i < val.length; i += 1) {
                        if (/^[a-zA-Z ]*$/.test(val[i])) {
                            chu = true;
                        } else if (/^[0-9]*$/.test(val[i])) {
                            so = true;
                        }
                    }
                    if (chu && so) {
                        return true;
                    }
                    return false;
                }
                return true;
            }),
        MATKHAU2: Yup.string()
            .trim()
            .min(6, 'Vui lòng nhập ít nhất 6 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('xxx', 'Mật khẩu phải sử dụng cả chữ cái và số', (val) => {
                let so = false;
                let chu = false;
                if (val !== undefined) {
                    for (let i = 0; i < val.length; i += 1) {
                        if (/^[a-zA-Z ]*$/.test(val[i])) {
                            chu = true;
                        } else if (/^[0-9]*$/.test(val[i])) {
                            so = true;
                        }
                    }
                    if (chu && so) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .test(
                'xxx',
                'Mật khẩu không trùng khớp',
                (val, test) => val === test.parent.MATKHAU
            ),
        NGAYSINH: Yup.string()
            .required('Vui lòng nhập thông tin này')
            .test(
                'len',
                'Ngày sinh vượt quá ngày hiện tại',
                (val) => new Date() > new Date(val)
            )
            .test(
                'len',
                'Ngày sinh phải sau ngày 1 tháng 1 năm 1920',
                (val) => new Date('1920-1-1') < new Date(val)
            ),
        // DIACHI: Yup.string()
        //     .test(
        //         'lxxen',
        //         'Địa chỉ không được sử dụng ký tự đặc biệt',
        //         (val) => {
        //             const str = removeAscent(val);
        //             return /^[a-zA-Z0-9-, ]*$/.test(str);
        //         }
        //     )
        //     .required('Vui lòng nhập thông tin này'),
        DIENTHOAI: Yup.string()
            .trim()
            .min(10, 'Vui lòng nhập ít nhất 10 ký tự')
            .max(12, 'Vui lòng nhập không quá 12 ký tự')
            .required('Vui lòng nhập thông tin này')
            .test('xxx', 'Số điện thoại chỉ được sử dụng chữ số', (val) =>
                /^[0-9]*$/.test(val)
            ),
        EMAIL: Yup.string()
            .email('Vui lòng nhập đúng định dạng email')
            .required('Vui lòng nhập thông tin này'),
        HO: Yup.string()
            .trim()
            .test(
                'lxxen',
                'Vui lòng không sử dụng số và ký tự đặc biệt',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này'),
        TEN: Yup.string()
            .trim()
            .test(
                'lxxen',
                'Vui lòng không sử dụng số và ký tự đặc biệt',
                (val) => {
                    const str = removeAscent(val);
                    return /^[a-zA-Z ]*$/.test(str);
                }
            )
            .min(2, 'Vui lòng nhập ít nhất 2 ký tự không phải khoảng trắng')
            .max(255, 'Vui lòng nhập không quá 255 ký tự')
            .required('Vui lòng nhập thông tin này')
        // TINH: Yup.string().required('Vui lòng nhập thông tin này'),
        // XAPHUONG: Yup.string().required('Vui lòng nhập thông tin này'),
        // QUANHUYEN: Yup.string().required('Vui lòng nhập thông tin này')
    });
    // document.getElementById('root').classList.remove('hold-transition');
    // document.getElementById('root').classList.remove('login-page');
    // document.getElementsByTagName('body')[0].style.backgroundColor = '#e9ecef';
    const RenderForm = () => {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: '',
            quanhuyen: ''
        });
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
            }
        }
        return (
            <Row className="boxdangky">
                <Col className="" md={12}>
                    <div className="">
                        <div className="Title-Login-Register center">
                            ĐĂNG KÝ TÀI KHOẢN NGƯỜI DÙNG
                        </div>
                        <div
                            className="font-size15"
                            style={{
                                textAlign: 'center',
                                marginTop: '10px',
                                marginRight: '10px',
                                color: 'red'
                            }}
                        >
                            <p>Email được sử dụng làm tên đăng nhập hệ thống</p>
                            {/* <Link className="" to="/LoginUser">
                                Đăng nhập
                            </Link> */}
                        </div>
                    </div>

                    <Row>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                // TENDANGNHAP: '',
                                MATKHAU: '',
                                MATKHAU2: '',
                                TRANGTHAI: String(1),
                                DIENTHOAI: '',
                                NGUOISUA: '',
                                HO: '',
                                TEN: '',
                                EMAIL: '',
                                DIACHI: '',
                                NGAYSINH: '',
                                GIOITINH: '1',
                                TINH: '',
                                XAPHUONG: '',
                                QUANHUYEN: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                const ObjSave = {
                                    ...values
                                };
                                const usercaptcha = document.getElementById(
                                    'NhapMaXacNhan'
                                ).value;

                                if (validateCaptcha(usercaptcha) === true) {
                                    if (values.MATKHAU === values.MATKHAU2) {
                                        setisload(true);
                                        // onCreateAccount(ObjSave);
                                        AccountService.DangKyTaiKhoan(
                                            ObjSave
                                        ).then((data) => {
                                            setisload(false);
                                            if (data.Status) {
                                                toast.success(
                                                    'Đăng ký tài khoản thành công'
                                                );
                                                setisDoneRegister(true);
                                                // setTimeout(() => {
                                                //     history.push('/LoginUser');
                                                // }, 3000);
                                            } else {
                                                toast.error(data.MessageError);
                                            }
                                        });
                                    } else {
                                        toast.error(
                                            'Vui lòng kiểm tra lại mật khẩu'
                                        );
                                    }
                                } else {
                                    toast.error('Bạn đã nhập sai mã xác nhận');
                                    document.getElementById(
                                        'NhapMaXacNhan'
                                    ).value = '';
                                }
                                // same shape as initial values
                            }}
                        >
                            {({errors, touched, setFieldValue}) => (
                                <Form className="col-md-12">
                                    <div className="form-row">
                                        {/* <div className="form-group col-sm-12">
                                            <label htmlFor="TENDANGNHAP">
                                                Tên đăng nhập
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="TENDANGNHAP"
                                                key="TENDANGNHAP"
                                                className="form-control "
                                            />
                                            {errors.TENDANGNHAP &&
                                            touched.TENDANGNHAP ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TENDANGNHAP}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div> */}
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="EMAIL">
                                                Email
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="EMAIL"
                                                key="EMAIL"
                                                className="form-control "
                                            />
                                            {errors.EMAIL && touched.EMAIL ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.EMAIL}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="DIENTHOAI">
                                                Điện thoại
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="DIENTHOAI"
                                                key="DIENTHOAI"
                                                className="form-control "
                                            />
                                            {errors.DIENTHOAI &&
                                            touched.DIENTHOAI ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.DIENTHOAI}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-sm-12">
                                            <label htmlFor="MATKHAU">
                                                Mật khẩu
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                // type={
                                                //     showHidePassword
                                                //         ? 'text'
                                                //         : 'password'
                                                // }
                                                type="password"
                                                name="MATKHAU"
                                                key="MATKHAU"
                                                className="form-control"
                                            />
                                            {/* <i
                                        aria-hidden="true"
                                        className="fas fa-eye icon "
                                        onClick={() =>
                                            changeShowHidePassword(
                                                !showHidePassword
                                            )
                                        }
                                    /> */}
                                            {errors.MATKHAU &&
                                            touched.MATKHAU ? (
                                                <div className="invalid-feedback">
                                                    {errors.MATKHAU}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-sm-12">
                                            <label htmlFor="MATKHAU2">
                                                Nhập lại mật khẩu
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                // type={
                                                //     showHidePassword
                                                //         ? 'text'
                                                //         : 'password'
                                                // }
                                                type="password"
                                                name="MATKHAU2"
                                                key="MATKHAU2"
                                                className="form-control"
                                            />
                                            {/* <i
                                        aria-hidden="true"
                                        className="fas fa-eye icon iconShowPassword"
                                        onClick={() =>
                                            changeShowHidePassword(
                                                !showHidePassword
                                            )
                                        }
                                    /> */}
                                            {errors.MATKHAU2 &&
                                            touched.MATKHAU2 ? (
                                                <div className="invalid-feedback">
                                                    {errors.MATKHAU2}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="HO">
                                                Họ{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="HO"
                                                key="HO"
                                                className="form-control "
                                            />
                                            {errors.HO && touched.HO ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.HO}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="TEN">
                                                Tên{' '}
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                name="TEN"
                                                key="TEN"
                                                className="form-control "
                                            />
                                            {errors.TEN && touched.TEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="NGAYSINH">
                                                Ngày sinh
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="NGAYSINH"
                                                key="NGAYSINH"
                                                className="form-control "
                                            />
                                            {errors.NGAYSINH &&
                                            touched.NGAYSINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.NGAYSINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="GIOITINH">
                                                Giới tính
                                            </label>
                                            <div
                                                role="group"
                                                aria-labelledby="my-radio-group"
                                            >
                                                <label
                                                    htmlFor
                                                    className="mgr15"
                                                >
                                                    <Field
                                                        type="radio"
                                                        name="GIOITINH"
                                                        value="1"
                                                    />{' '}
                                                    Nam
                                                </label>
                                                <label htmlFor>
                                                    <Field
                                                        type="radio"
                                                        name="GIOITINH"
                                                        value="0"
                                                    />{' '}
                                                    Nữ
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label htmlFor="diaChi">
                                            Địa Chỉ Thường Trú :
                                        </label>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="TINH"
                                                className="chitietdiachi"
                                            >
                                                Tỉnh/Thành Phố
                                                {/* <span className="red">*</span> */}
                                            </label>
                                            <Field
                                                as="select"
                                                name="TINH"
                                                key="TINH"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'tinh',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'TINH',
                                                        value
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {RenderDropdownTinh({
                                                    code: 'tinh'
                                                })}
                                            </Field>
                                            {errors.TINH && touched.TINH ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.TINH}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="QUANHUYEN"
                                                className="chitietdiachi"
                                            >
                                                Quận/Huyện
                                                {/* <span className="red">*</span> */}
                                            </label>
                                            <Field
                                                as="select"
                                                name="QUANHUYEN"
                                                key="QUANHUYEN"
                                                className="form-control "
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    onchangeloaddiachi(
                                                        'quanhuyen',
                                                        value
                                                    );
                                                    setFieldValue(
                                                        'QUANHUYEN',
                                                        value
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {loaddiachi.tinh !== '' ? (
                                                    <RenderDropdownQuanhuyen
                                                        code="quanhuyen"
                                                        data={loaddiachi.tinh}
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </Field>
                                            {errors.QUANHUYEN &&
                                            touched.QUANHUYEN ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.QUANHUYEN}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label
                                                htmlFor="XAPHUONG"
                                                className="chitietdiachi"
                                            >
                                                Xã/Phường
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="XAPHUONG"
                                                key="XAPHUONG"
                                                className="form-control "
                                            >
                                                <option value="">
                                                    --Chọn--
                                                </option>
                                                {loaddiachi.quanhuyen !== '' ? (
                                                    <RenderDropdownXaphuong
                                                        code="xaphuong"
                                                        data={
                                                            loaddiachi.quanhuyen
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </Field>
                                            {errors.XAPHUONG &&
                                            touched.XAPHUONG ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.XAPHUONG}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label
                                                htmlFor="DIACHI"
                                                className="chitietdiachi"
                                            >
                                                Số nhà, phố, tổ dân phố / thôn /
                                                đội
                                                {/* <span className="red">*</span> */}
                                            </label>
                                            <Field
                                                name="DIACHI"
                                                key="DIACHI"
                                                className="form-control "
                                            />
                                            {errors.DIACHI && touched.DIACHI ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.DIACHI}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="noiCap">
                                                Nhập xác nhận
                                                <span className="red">*</span>
                                            </label>
                                            <Field
                                                id="NhapMaXacNhan"
                                                name="NhapMaXacNhan"
                                                key="NhapMaXacNhan"
                                                className="form-control "
                                            />
                                            {errors.NhapMaXacNhan &&
                                            touched.NhapMaXacNhan ? (
                                                <>
                                                    <div className="invalid-feedback">
                                                        {errors.NhapMaXacNhan}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="noiCap">
                                                Mã xác nhận
                                            </label>
                                            <LoadCanvasTemplate />
                                        </div>
                                    </div>
                                    <div className="form-row center mgt15">
                                        <div className="col-sm-12">
                                            <Button
                                                className="btn-lg"
                                                variant="primary"
                                                type="submit"
                                                // onClick={submitCreate}
                                            >
                                                Hoàn thành
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                </Col>
            </Row>
        );
    };

    const RegisterDoneRender = () => {
        return (
            <div className="RegisterDoneRender">
                <h3 className="center">
                    Chúc mừng bạn đã đăng ký tài khoản thành công
                </h3>
                <h4 className="center">
                    Vui lòng xác nhận tài khoản theo hướng dẫn được gửi đến
                    email đã đăng ký
                </h4>
            </div>
        );
    };

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
            {isDoneRegister ? <RegisterDoneRender /> : <RenderForm />}
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onCreateAccount: (Account) => {
        AccountService.DangKyTaiKhoan(Account);
    }
});

export default connect(null, mapDispatchToProps)(Dangky);
