import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import {Button, Col, Modal, Row, label} from 'react-bootstrap';
import {Field, Form, Formik, useFormik, useFormikContex} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {
    DoiServerBaiBao,
    NhapDKHTExcel
    // NhapDKGhepThanExcel,
    // NhapDKGhepKhacExcel
} from '@app/services/TinhNangMoRongService';
import {toast} from 'react-toastify';

import AdminSecsionHead from '../AdminSecsionHead';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function isValidURL(string) {
    const test = `${string}/`; // luôn kết thúc url bằng "/"
    // bắt đầu với http: hoặc https: theo sau là "\\" hoặc "//"
    // port(không bắt buộc): bắt đầu với dấu hai chấm ":" và gồm 2-5 chữ số
    const local = RegExp(
        // localhost: "localhost"
        /^http(s)?:(\/\/|\\\\)localhost(:[0-9]{2,5})?\//gi
    ).test(test);
    const ip = RegExp(
        // địa chỉ ip: gồm 4 số trong khoảng {1,254}, phân cách bởi dấu Vd: 123.152.168.192
        /^http(s)?:(\/\/|\\\\)(((1[0-9]{0,2})|(2([0-4][0-9]?|5[0-4]?|[6-9])?)|([3-9][0-9]?))\.){3}((1[0-9]{0,2})|(2([0-4][0-9]?|5[0-4]?|[6-9])?)|([3-9][0-9]?))(:[0-9]{2,5})?\//gi
    ).test(test);
    const domain = RegExp(
        // tên miền: chỉ dùng chữ cái, và dấu -, phân cách bởi dấu Vd: abcd--dde.com.xyz
        /^http(s)?:(\/\/|\\\\)(www\.)?[a-z0-9-]{2,256}\.[a-z]{2,6}(\.[a-z]*)(:[0-9]{2,5})?\//gi
    ).test(test);
    const ketqua = local || ip || domain;
    return ketqua;
}

const TinhNangMoRong = (props) => {
    const formRef = useRef();
    const [showModal, setshowModal] = useState('');
    const [resultAPI, setresultAPI] = useState('');
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    useEffect(() => {
        document.getElementsByClassName('nav-item has-treeview')[0].className +=
            ' menu-open';
    });
    const SignupSchema = Yup.object().shape({
        old_URL_SERVER: Yup.string()
            .test('is-url-valid', 'Địa chỉ (URL) không hợp lệ', (value) => {
                if (value !== undefined) {
                    if (isValidURL(value)) {
                        return true;
                    }
                }
                return false;
            })
            .test(
                'xxx',
                'Hãy thêm giao thức "http://" hoặc "https://"',
                (value) => {
                    if (value !== undefined) {
                        return (
                            value.startsWith('http://') ||
                            value.startsWith('https://') ||
                            value.startsWith('http:\\') ||
                            value.startsWith('https:\\')
                        );
                    }
                    return false;
                }
            ),
        new_URL_SERVER: Yup.string()
            .test('is-url-valid', 'Địa chỉ (URL) không hợp lệ', (value) => {
                if (value !== undefined) {
                    if (isValidURL(value)) {
                        return true;
                    }
                }
                return false;
            })
            .test(
                'xxx',
                'Hãy thêm giao thức "http://" hoặc "https://"',
                (value) => {
                    if (value !== undefined) {
                        return (
                            value.startsWith('http://') ||
                            value.startsWith('https://') ||
                            value.startsWith('http:\\') ||
                            value.startsWith('https:\\')
                        );
                    }
                    return false;
                }
            )
    });
    const ModalDoiServerBaiBao = () => {
        return (
            <Modal
                show={showModal === 'doiserverbaibao'}
                backdrop="static"
                size="md"
                animation="true"
                onHide={() => setshowModal('')}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thiết lập lại địa chỉ Server trong bài báo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            old_URL_SERVER: '',
                            new_URL_SERVER: ''
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            const obj = {
                                oldURL: values.old_URL_SERVER,
                                newURL: values.new_URL_SERVER
                            };
                            DoiServerBaiBao(obj);
                        }}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="old_URL_SERVER">
                                        Địa chỉ Server cũ (URL):
                                        <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        name="old_URL_SERVER"
                                        key="old_URL_SERVER"
                                        className="form-control"
                                    />
                                    {errors.old_URL_SERVER &&
                                    touched.old_URL_SERVER ? (
                                        <>
                                            <div className="invalid-feedback">
                                                {errors.old_URL_SERVER}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="new_URL_SERVER">
                                        Địa chỉ Server mới (URL):
                                        <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        name="new_URL_SERVER"
                                        key="new_URL_SERVER"
                                        className="form-control"
                                    />
                                    {errors.new_URL_SERVER &&
                                    touched.new_URL_SERVER ? (
                                        <>
                                            <div className="invalid-feedback">
                                                {errors.new_URL_SERVER}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setshowModal('')}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Thực hiện
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    const ModalNhapDKHTExcel = () => {
        const [fileselected, setfileselected] = useState('');
        function Change(event) {
            if (event.target.files[0] !== undefined) {
                if (
                    event.target.files[0].type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    setfileselected(event.target.files[0]);
                } else {
                    toast.error('File không đúng định dạng');
                    setfileselected(null);
                }
            } else {
                setfileselected(null);
            }
        }
        function submit() {
            if (fileselected) {
                const formdata = new FormData();
                formdata.append('file', fileselected);
                NhapDKHTExcel(formdata).then((response) =>
                    setresultAPI(response.Data)
                );
            } else {
                toast.error('Hãy chọn một file!');
            }
        }
        return (
            <Modal
                show={showModal === 'nhapdangkyhientangexcel'}
                backdrop="static"
                size="md"
                animation="true"
                onHide={() => setshowModal('')}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Lấy dữ liệu đăng ký hiến tạng từ Excel
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{border: '1px red dashed', margin: '5px'}}>
                        <div
                            style={{
                                textAlign: 'center',
                                position: 'relative',
                                margin: '5px',
                                minHeight: '100px'
                            }}
                        >
                            <label
                                className="custom-file-upload"
                                aria-hidden="true"
                            >
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".xls, .xlsx"
                                    onChange={Change}
                                />
                                <i className="fas fa-upload fa-2x" /> &nbsp;Chọn
                                file
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <p>
                            {' '}
                            <b>Tên File: </b>
                            {fileselected ? fileselected.name : ' ... '}
                        </p>
                        <p>
                            {' '}
                            <b>Kích thước: </b>
                            {fileselected ? fileselected.size : ' ... '} byte
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setshowModal('')}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => submit()}>
                        Tải lên
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    const ModalNhapDKGhepThanExcel = () => {
        const [fileselected, setfileselected] = useState('');
        function Change(event) {
            if (event.target.files[0] !== undefined) {
                if (
                    event.target.files[0].type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    setfileselected(event.target.files[0]);
                } else {
                    toast.error('File không đúng định dạng');
                    setfileselected(null);
                }
            } else {
                setfileselected(null);
            }
        }
        function submit() {
            if (fileselected) {
                const formdata = new FormData();
                formdata.append('file', fileselected);
                // NhapDKGhepThanExcel(formdata).then((response) =>
                //     setresultAPI(response.Data)
                // );
            } else {
                toast.error('Hãy chọn một file!');
            }
        }
        return (
            <Modal
                show={showModal === 'nhapdangkyghepthanexcel'}
                backdrop="static"
                size="md"
                animation="true"
                onHide={() => setshowModal('')}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Lấy dữ liệu chờ ghép thận từ Excel
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{border: '1px red dashed', margin: '5px'}}>
                        <div
                            style={{
                                textAlign: 'center',
                                position: 'relative',
                                margin: '5px',
                                minHeight: '100px'
                            }}
                        >
                            <label
                                className="custom-file-upload"
                                aria-hidden="true"
                            >
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".xls, .xlsx"
                                    onChange={Change}
                                />
                                <i className="fas fa-upload fa-2x" /> &nbsp;Chọn
                                file
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <p>
                            {' '}
                            <b>Tên File: </b>
                            {fileselected ? fileselected.name : ' ... '}
                        </p>
                        <p>
                            {' '}
                            <b>Kích thước: </b>
                            {fileselected ? fileselected.size : ' ... '} byte
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setshowModal('')}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => submit()}>
                        Tải lên
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    const ModalNhapDKGhepKhacExcel = () => {
        const [fileselected, setfileselected] = useState('');
        function Change(event) {
            if (event.target.files[0] !== undefined) {
                if (
                    event.target.files[0].type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    setfileselected(event.target.files[0]);
                } else {
                    toast.error('File không đúng định dạng');
                    setfileselected(null);
                }
            } else {
                setfileselected(null);
            }
        }
        function submit() {
            if (fileselected) {
                const formdata = new FormData();
                formdata.append('file', fileselected);
                // NhapDKGhepKhacExcel(formdata).then((response) =>
                //     setresultAPI(response.Data)
                // );
            } else {
                toast.error('Hãy chọn một file!');
            }
        }
        return (
            <Modal
                show={showModal === 'nhapdangkyghepkhacexcel'}
                backdrop="static"
                size="md"
                animation="true"
                onHide={() => setshowModal('')}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Lấy dữ liệu ghép cơ quan khác từ Excel
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{border: '1px red dashed', margin: '5px'}}>
                        <div
                            style={{
                                textAlign: 'center',
                                position: 'relative',
                                margin: '5px',
                                minHeight: '100px'
                            }}
                        >
                            <label
                                className="custom-file-upload"
                                aria-hidden="true"
                            >
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".xls, .xlsx"
                                    onChange={Change}
                                />
                                <i className="fas fa-upload fa-2x" /> &nbsp;Chọn
                                file
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <p>
                            {' '}
                            <b>Tên File: </b>
                            {fileselected ? fileselected.name : ' ... '}
                        </p>
                        <p>
                            {' '}
                            <b>Kích thước: </b>
                            {fileselected ? fileselected.size : ' ... '} byte
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setshowModal('')}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => submit()}>
                        Tải lên
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    const ItemDoiServerBaiBao = () => {
        return (
            <Col md={3} sm={4}>
                <div
                    style={{margin: '15px'}}
                    onClick={() => setshowModal('doiserverbaibao')}
                    aria-hidden="true"
                >
                    <div className="itemTinhNangMoRong">
                        <img
                            className="image"
                            src="/img/tinhnangmorong1.jpg"
                            alt=""
                        />

                        <div className="Tieude">Đổi địa chỉ Server</div>
                        <div className="Mota">
                            Sử dụng khi đổi Server sang địa chỉ mới - Thay đổi
                            địa chỉ Server của hình ảnh trong các bài báo
                        </div>
                    </div>
                </div>
            </Col>
        );
    };
    const ItemNhapDKHTExcel = () => {
        return (
            <Col md={3} sm={4}>
                <div
                    style={{margin: '15px'}}
                    onClick={() => setshowModal('nhapdangkyhientangexcel')}
                    aria-hidden="true"
                >
                    <div className="itemTinhNangMoRong">
                        <img
                            className="image"
                            src="/img/importexcel.png"
                            alt=""
                        />

                        <div className="Tieude">ĐK Hiến Tạng - Excel</div>
                        <div className="Mota">
                            Lấy dữ liệu bệnh nhân đăng ký hiến tạng từ file
                            Excel
                        </div>
                    </div>
                </div>
            </Col>
        );
    };
    const ItemNhapGhepThanExcel = () => {
        return (
            <Col md={3} sm={4}>
                <div
                    style={{margin: '15px'}}
                    onClick={() => setshowModal('nhapdangkyghepthanexcel')}
                    aria-hidden="true"
                >
                    <div className="itemTinhNangMoRong">
                        <img
                            className="image"
                            src="/img/importexcel.png"
                            alt=""
                        />

                        <div className="Tieude">ĐK Ghép Thận - Excel</div>
                        <div className="Mota">
                            Lấy dữ liệu bệnh nhân đăng ký hiến tạng từ file
                            Excel
                        </div>
                    </div>
                </div>
            </Col>
        );
    };
    const ItemNhapGhepKhacExcel = () => {
        return (
            <Col md={3} sm={4}>
                <div
                    style={{margin: '15px'}}
                    onClick={() => setshowModal('nhapdangkyghepkhacexcel')}
                    aria-hidden="true"
                >
                    <div className="itemTinhNangMoRong">
                        <img
                            className="image"
                            src="/img/importexcel.png"
                            alt=""
                        />

                        <div className="Tieude">ĐK Ghép Tạng Khác - Excel</div>
                        <div className="Mota">
                            Lấy dữ liệu bệnh nhân đăng ký hiến tạng từ file
                            Excel
                        </div>
                    </div>
                </div>
            </Col>
        );
    };
    const RenderDs = () => {
        return (
            <Row style={{padding: '20px'}}>
                {ItemDoiServerBaiBao()}
                {ItemNhapDKHTExcel()}
                {ItemNhapGhepKhacExcel()}
                {ItemNhapGhepThanExcel()}
                {ItemDoiServerBaiBao()}
            </Row>
        );
    };
    const Thongbaotrave = () => {
        if (resultAPI !== '') {
            const str = resultAPI.toString();
            const itemthongbao = str.split('*');
            const data = itemthongbao.map((item, key) => {
                if (item[0] === '-') {
                    return (
                        <div
                            key={key}
                            style={{
                                color: 'white',
                                padding: '5px',
                                borderRadius: '10px',
                                backgroundColor: 'red',
                                marginBottom: '5px'
                            }}
                        >
                            {item}
                            <br />
                        </div>
                    );
                }
                if (item[0] === '+') {
                    return (
                        <div
                            key={key}
                            style={{
                                color: 'white',
                                padding: '5px',
                                borderRadius: '10px',
                                backgroundColor: '#07af07',
                                marginBottom: '5px'
                            }}
                        >
                            {item}
                            <br />
                        </div>
                    );
                }
                if (item[0] === '/') {
                    return (
                        <div
                            key={key}
                            style={{
                                color: 'white',
                                padding: '5px',
                                borderRadius: '10px',
                                backgroundColor: '#4646ff',
                                marginBottom: '5px'
                            }}
                        >
                            {item}
                            <br />
                        </div>
                    );
                }
                return '';
            });
            return (
                <Modal
                    show
                    backdrop="static"
                    size="lg"
                    animation="true"
                    onHide={() => setresultAPI('')}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Kết quả lấy dữ liệu đăng ký hiến tạng từ Excel
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>{data}</div>
                    </Modal.Body>
                </Modal>
            );
        }
        return '';
    };

    return (
        <>
            <AdminSecsionHead ModuleName="Các tính năng mở rộng" />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header" />
                                <div className="card-body nopadding">
                                    <div className="tab-content">
                                        <RenderDs />
                                        <ModalDoiServerBaiBao />
                                        <ModalNhapDKHTExcel />
                                        <ModalNhapDKGhepThanExcel />
                                        <ModalNhapDKGhepKhacExcel />
                                        <Thongbaotrave />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TinhNangMoRong;
