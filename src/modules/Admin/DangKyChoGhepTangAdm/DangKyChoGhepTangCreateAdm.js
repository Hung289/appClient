/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable dot-notation */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import * as LoadDiachi from '@modules/Common/LoadDiachi';
import $ from 'jquery';
import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import NotDataToShow from '@modules/Common/NotDataToShow';
import * as Constant from '@app/Constant';
import * as DangKyChoGhepConstant from '@modules/Common/DangKyChoGhepConstant';
import axios from 'axios';
import {NotFoundImage} from '@modules/Common/NotFound';
import TimePicker from 'react-time-picker';
import {
    Form,
    Input,
    DatePicker,
    Space,
    Radio,
    Select,
    Row,
    Col,
    layout,
    Layout,
    Upload,
    Button,
    Checkbox,
    Modal,
    InputNumber
} from 'antd';

// import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyChoGhepTangCreateAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const [typeCreate, settypeCreate] = useState('');
    const [IsOpenCoQuan, setIsOpenCoQuan] = useState('');
    const dataGiaDinh = useRef([]);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);
    const [NhomMauRh, setNhomMauRh] = useState([]);
    const [QHGD, setQHGD] = useState([]);
    const [Tinh, setTinh] = useState([]);
    const [TinhTT, setTinhTT] = useState([]);
    const dataGiaDinhEdit = useRef([]);
    const {
        OnLoadingAction,
        IsShowCreatePopup,
        setIsShowCreatePopup,
        onReloadPage
    } = props;
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };
    const onCreateEntity = (tintuc) => {
        OnLoadingAction(true);
        dangKyChoGhepTangService.CreateNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                setIsShowCreatePopup(false);
                setIsOpenCoQuan(false);
                onReloadPage();
            }
        });
    };
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
        DuLieuDanhMuc.GetDMbyCodeNhom('nhommaurh').then((rs) => {
            if (rs.Status) {
                setNhomMauRh(rs.Data);
            }
        });
        DuLieuDanhMuc.GetDMbyCodeNhom('quanhegiadinh').then((rs) => {
            if (rs.Status) {
                setQHGD(rs.Data);
            }
        });
        LoadDiachi.DaTaTinh().then((rs) => {
            if (rs.Status) {
                setTinh(rs.Data);
                setTinhTT(rs.Data);
            }
        });
    }, []);

    const DropDMNgheNghiep = () => {
        return NgheNghiep.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMNhomMau = () => {
        return NhomMau.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMNhomMauRh = () => {
        return NhomMauRh.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropDMQHGD = () => {
        return QHGD.map((item) => {
            return (
                <option value={item.Code} key={item.Code}>
                    {item.Name}
                </option>
            );
        });
    };
    const DropTinh = () => {
        return Tinh.map((item) => {
            return (
                <option value={item.MaTinh} key={item.MaTinh}>
                    {item.TenTinh}
                </option>
            );
        });
    };
    const DropTinhTT = () => {
        return TinhTT.map((item) => {
            return (
                <option value={item.MaHuyen} key={item.MaHuyen}>
                    {item.TenHuyen}
                </option>
            );
        });
    };
    const KhongBiNhiemCheck = () => {
        const NhiemCovid = document.querySelector('#NhiemCovid');
        const BiTruocTiem = document.querySelector('#BiTruocTiem');
        const BiSauTiem = document.querySelector('#BiSauTiem');
        const CoTrieuChung = document.querySelector('#CoTrieuChung');
        const TrieuChungNhe = document.querySelector('#TrieuChungNhe');
        const TrieuChungtrungBinh = document.querySelector(
            '#TrieuChungtrungBinh'
        );
        const NhapVien = document.querySelector('#NhapVien');
        const ThoMay = document.querySelector('#ThoMay');
        const ThoHFNC = document.querySelector('#ThoHFNC');
        const isChecked = NhiemCovid.parentElement.classList.contains(
            'ant-checkbox-checked'
        );
        if (isChecked !== true) {
            BiTruocTiem.parentElement.classList.add('ant-checkbox-disabled');
            BiTruocTiem.setAttribute('disabled', 'disabled');
            BiTruocTiem.parentElement.classList.remove('ant-checkbox-checked');
            BiSauTiem.parentElement.classList.add('ant-checkbox-disabled');
            BiSauTiem.setAttribute('disabled', 'disabled');
            BiSauTiem.parentElement.classList.remove('ant-checkbox-checked');
            CoTrieuChung.parentElement.classList.add('ant-checkbox-disabled');
            CoTrieuChung.setAttribute('disabled', 'disabled');
            CoTrieuChung.parentElement.classList.remove('ant-checkbox-checked');
            TrieuChungNhe.parentElement.classList.add('ant-checkbox-disabled');
            TrieuChungNhe.setAttribute('disabled', 'disabled');
            TrieuChungNhe.parentElement.classList.remove(
                'ant-checkbox-checked'
            );

            TrieuChungtrungBinh.parentElement.classList.add(
                'ant-checkbox-disabled'
            );
            TrieuChungtrungBinh.setAttribute('disabled', 'disabled');
            TrieuChungtrungBinh.parentElement.classList.remove(
                'ant-checkbox-checked'
            );

            NhapVien.parentElement.classList.add('ant-checkbox-disabled');
            NhapVien.setAttribute('disabled', 'disabled');
            NhapVien.parentElement.classList.remove('ant-checkbox-checked');
            ThoMay.parentElement.classList.add('ant-checkbox-disabled');
            ThoMay.setAttribute('disabled', 'disabled');
            ThoMay.parentElement.classList.remove('ant-checkbox-checked');
            ThoHFNC.parentElement.classList.add('ant-checkbox-disabled');
            ThoHFNC.setAttribute('disabled', 'disabled');
            ThoHFNC.parentElement.classList.remove('ant-checkbox-checked');
        } else {
            BiTruocTiem.parentElement.classList.remove('ant-checkbox-disabled');
            BiTruocTiem.removeAttribute('disabled');
            BiSauTiem.parentElement.classList.remove('ant-checkbox-disabled');
            BiSauTiem.removeAttribute('disabled');
            CoTrieuChung.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            CoTrieuChung.removeAttribute('disabled');
            TrieuChungNhe.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            TrieuChungNhe.removeAttribute('disabled');
            TrieuChungtrungBinh.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            TrieuChungtrungBinh.removeAttribute('disabled');
            NhapVien.parentElement.classList.remove('ant-checkbox-disabled');
            NhapVien.removeAttribute('disabled');
            ThoMay.parentElement.classList.remove('ant-checkbox-disabled');
            ThoMay.removeAttribute('disabled');
            ThoHFNC.parentElement.classList.remove('ant-checkbox-disabled');
            ThoHFNC.removeAttribute('disabled');
        }
    };
    const KhongBiViemGanCheck = () => {
        const khongBiViemGan = document.querySelector('#khongBiViemGan');
        const viemGanSieuViA = document.querySelector('#viemGanSieuViA');
        const viemGanSieuViB = document.querySelector('#viemGanSieuViB');
        const viemGanSieuViC = document.querySelector('#viemGanSieuViC');
        const truocHoacSauLocMau = document.querySelector(
            '#truocHoacSauLocMau'
        );

        const isChecked = khongBiViemGan.parentElement.classList.contains(
            'ant-checkbox-checked'
        );
        if (isChecked !== true) {
            viemGanSieuViA.parentElement.classList.add('ant-checkbox-disabled');
            viemGanSieuViA.parentElement.classList.remove(
                'ant-checkbox-checked'
            );
            viemGanSieuViA.setAttribute('disabled', 'disabled');
            viemGanSieuViB.parentElement.classList.add('ant-checkbox-disabled');
            viemGanSieuViB.parentElement.classList.remove(
                'ant-checkbox-checked'
            );
            viemGanSieuViB.setAttribute('disabled', 'disabled');
            viemGanSieuViC.parentElement.classList.add('ant-checkbox-disabled');
            viemGanSieuViC.parentElement.classList.remove(
                'ant-checkbox-checked'
            );
            viemGanSieuViC.setAttribute('disabled', 'disabled');

            truocHoacSauLocMau.querySelectorAll('.ant-radio').forEach((e) => {
                e.classList.remove('ant-radio-checked');
                e.classList.add('ant-radio-disabled');
                e.firstElementChild.setAttribute('disabled', 'disabled');
            });
        } else {
            viemGanSieuViA.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            viemGanSieuViA.removeAttribute('disabled');
            viemGanSieuViB.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            viemGanSieuViB.removeAttribute('disabled');
            viemGanSieuViC.parentElement.classList.remove(
                'ant-checkbox-disabled'
            );
            viemGanSieuViC.removeAttribute('disabled');

            truocHoacSauLocMau.querySelectorAll('.ant-radio').forEach((e) => {
                e.classList.remove('ant-radio-disabled');
                e.firstElementChild.removeAttribute('disabled');

                if (
                    e.parentElement.classList.contains(
                        'ant-radio-wrapper-checked'
                    )
                ) {
                    e.classList.add('ant-radio-checked');
                }
            });
        }
    };

    async function ChangeFileUpload(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(Arr[0]);
        });
        if (Arr[0] !== undefined) {
            FileSelected = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('Avatar');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('Avatar');
            image.src =
                'https://cidrapbusiness.org/wp-content/uploads/2017/10/noimage.gif';
            FileSelected = {current: null};
        }
    }
    async function ChangeFileUploadCMNDMT(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
        });
        if (Arr[0] !== undefined) {
            FileSelectedCMNDMT = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('ImgCMNDBNMatTruoc');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('ImgCMNDBNMatTruoc');
            image.src = '';
            FileSelectedCMNDMT = {current: null};
        }
    }
    async function ChangeFileUploadCMNDMs(event) {
        // eslint-disable-next-line prefer-destructuring
        const Arr = event.target.files;
        const dataOfFile = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (eventda) => {
                resolve(eventda.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            if (Arr[0] !== undefined) {
                reader.readAsDataURL(Arr[0]);
            }
        });
        if (Arr[0] !== undefined) {
            FileSelectedCMNDMs = {
                fileName: Arr[0].name,
                size: Arr[0].size,
                type: Arr[0].type,
                data: await dataOfFile.then((rs) => rs)
            };
            const image = document.getElementById('ImgCMNDBNMatSau');
            image.src = URL.createObjectURL(event.target.files[0]);
        } else {
            const image = document.getElementById('ImgCMNDBNMatSau');
            image.src = '';
            FileSelectedCMNDMs = {current: null};
        }
    }

    const RenderCreateQuanHeGiaDinh = () => {
        const [lstAnhChiEm, setLstAnhChiEm] = useState([{}]);
        const handleChange = (event, id) => {
            const {name} = event.target;
            const newItem = [...lstAnhChiEm];
            newItem[id] = {...newItem[id], [name]: event.target.value};
            setLstAnhChiEm(newItem);
            dataGiaDinh.current = lstAnhChiEm;
        };

        const DeleteItem = (ind) => {
            const newItem = [...lstAnhChiEm];
            newItem.splice(ind, 1);
            setLstAnhChiEm(newItem);
            dataGiaDinh.current = lstAnhChiEm;
            toast.info('Xóa thành công');
        };

        return (
            <div style={{width: '100%'}}>
                <Row>
                    <Button
                        type="primary"
                        size="sm"
                        onClick={() => {
                            const NewItem = [...lstAnhChiEm, {}];
                            setLstAnhChiEm(NewItem);
                        }}
                    >
                        <i className="fas fa-plus" /> Thêm anh/chị/em
                    </Button>
                </Row>
                {lstAnhChiEm.map((item, key) => {
                    return (
                        <Row key={key} gutter={[10, 5]}>
                            <Col
                                lg={{span: 22}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Row gutter={[10, 5]}>
                                    <Col
                                        lg={{span: 12}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            label="Họ và tên"
                                            className="my-label"
                                        >
                                            <Input
                                                id={`hoTenNguoiThan-${key}`}
                                                value={item.hoTenNguoiThan}
                                                name="hoTenNguoiThan"
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 4}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Quan hệ"
                                        >
                                            <Select
                                                defaultValue=""
                                                name="quanHeNguoiThan"
                                                onChange={(value) => {
                                                    const newItem = [
                                                        ...lstAnhChiEm
                                                    ];
                                                    newItem[key] = {
                                                        ...newItem[key],
                                                        quanHeNguoiThan: value
                                                    };
                                                    setLstAnhChiEm(newItem);
                                                }}
                                            >
                                                <Select.Option value="">
                                                    --Chọn--
                                                </Select.Option>

                                                {DropDMQHGD()}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 4}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Sinh Năm"
                                        >
                                            <InputNumber
                                                name="namSinhNguoiThan"
                                                min={1970}
                                                max={2022}
                                                style={{width: '100%'}}
                                                onChange={(value) => {
                                                    const newItem = [
                                                        ...lstAnhChiEm
                                                    ];
                                                    newItem[key] = {
                                                        ...newItem[key],
                                                        namSinhNguoiThan: value
                                                    };

                                                    setLstAnhChiEm(newItem);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 4}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Nhóm máu"
                                        >
                                            <Select
                                                defaultValue=""
                                                name="nhomMauNguoiThan"
                                                onChange={(value) => {
                                                    const newItem = [
                                                        ...lstAnhChiEm
                                                    ];
                                                    newItem[key] = {
                                                        ...newItem[key],
                                                        nhomMauNguoiThan: value
                                                    };
                                                    setLstAnhChiEm(newItem);
                                                }}
                                            >
                                                <Select.Option value="">
                                                    --Chọn--
                                                </Select.Option>

                                                {DropDMNhomMau()}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[10, 5]}>
                                    <Col
                                        lg={{span: 4}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Trình độ văn hóa"
                                        >
                                            <Input
                                                name="trinhDoVHNguoiThan"
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 8}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Địa chỉ thường trú"
                                        >
                                            <Input
                                                name="diaChiThuongTruNguoiThan"
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 4}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Số điện thoại"
                                        >
                                            <Input
                                                name="dienThoaiNguoiThan"
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        lg={{span: 8}}
                                        md={{span: 24}}
                                        sm={{span: 24}}
                                        xs={{span: 24}}
                                    >
                                        <Form.Item
                                            className="my-label"
                                            label="Lý do không hiển thị được"
                                        >
                                            <Input
                                                name="LyDoKhongHien"
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                lg={{span: 2}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <div>
                                    <Button
                                        type="danger"
                                        onClick={() => DeleteItem(key)}
                                    >
                                        <i className="fas fa-times" />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    );
                })}
            </div>
        );
    };

    function CreateModal() {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: '',
            quanhuyen: '',
            tinhtt: '',
            quanhuyentt: ''
        });
        const [Huyen, setHuyen] = useState([]);
        const [HuyenTT, setHuyenTT] = useState([]);
        const [Xa, setXa] = useState([]);
        const [XaTT, setXaTT] = useState([]);
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});

                LoadDiachi.DaTaQuanhuyen(value).then((rs) => {
                    if (rs.Status) {
                        setHuyen(rs.Data);
                    }
                });
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
                LoadDiachi.DaTaXaphuong(value).then((rs) => {
                    if (rs.Status) {
                        setXa(rs.Data);
                    }
                });
            } else if (name === 'tinhtt') {
                setloaddiachi({...loaddiachi, tinhtt: value, quanhuyentt: ''});
                LoadDiachi.DaTaQuanhuyen(value).then((rs) => {
                    if (rs.Status) {
                        setHuyenTT(rs.Data);
                    }
                });
            } else if (name === 'quanhuyentt') {
                setloaddiachi({...loaddiachi, quanhuyentt: value});
                LoadDiachi.DaTaXaphuong(value).then((rs) => {
                    if (rs.Status) {
                        setXaTT(rs.Data);
                    }
                });
            }
        }
        const DropQuanHuyen = () => {
            return Huyen.map((item) => {
                return (
                    <option value={item.MaHuyen} key={item.MaHuyen}>
                        {item.TenHuyen}
                    </option>
                );
            });
        };
        const DropXa = () => {
            return Xa.map((item) => {
                return (
                    <option value={item.MaXa} key={item.MaXa}>
                        {item.TenXa}
                    </option>
                );
            });
        };
        const DropHuyenTT = () => {
            return HuyenTT.map((item) => {
                return (
                    <option value={item.MaHuyen} key={item.MaHuyen}>
                        {item.TenHuyen}
                    </option>
                );
            });
        };
        const DropXaTT = () => {
            return XaTT.map((item) => {
                return (
                    <option value={item.MaXa} key={item.MaXa}>
                        {item.TenXa}
                    </option>
                );
            });
        };
        return (
            <>
                <Modal
                    visible={IsOpenCoQuan && typeCreate === 'than'}
                    onCancel={() => {
                        setIsShowCreatePopup(false);
                        setIsOpenCoQuan(false);
                    }}
                    title="Tạo mới đăng ký chờ ghép thận"
                    onOk={() => {
                        submitCreate();
                        // canhbaoErrorModal(formRef);
                    }}
                    width={1600}
                    zIndex={1040}
                    okText="Hoàn thành"
                    cancelText="Thoát"
                >
                    <Form
                        ref={formRef}
                        onFinish={(values) => {
                            // sua gia tri 3 checkbox viem gan sieu vi A B C
                            let values1 = values;
                            let CMNDtruoc = false;
                            let CMNDsau = false;
                            if (values.khongBiViemGan) {
                                values1.viemGanSieuViA = false;
                                values1.viemGanSieuViB = false;
                                values1.viemGanSieuViC = false;
                                values1.truocHoacSauLocMau = 0;
                            }
                            const ngaySinh =
                                values['ngaySinh'] !== ''
                                    ? values['ngaySinh'].format('DD-MM-YYYY')
                                    : '';
                            const NgayCapCMNDBN =
                                values['NgayCapCMNDBN'] !== ''
                                    ? values['NgayCapCMNDBN'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayPhatHienSuyThan =
                                values['ngayPhatHienSuyThan'] !== ''
                                    ? values['ngayPhatHienSuyThan'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayCTNTHoacKhamThamPhanBenhLy =
                                values['ngayCTNTHoacKhamThamPhanBenhLy'] !== ''
                                    ? values[
                                          'ngayCTNTHoacKhamThamPhanBenhLy'
                                      ].format('DD-MM-YYYY')
                                    : '';
                            const daGhepLan1Ngay =
                                values['daGhepLan1Ngay'] !== ''
                                    ? values['daGhepLan1Ngay'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayChayThanTroLai =
                                values['ngayChayThanTroLai'] !== ''
                                    ? values['ngayChayThanTroLai'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ctntHoacKhamThamPhan =
                                values['ctntHoacKhamThamPhan'] !== ''
                                    ? values['ctntHoacKhamThamPhan'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiLao =
                                values['thoiGianBiLao'] !== ''
                                    ? values['thoiGianBiLao'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiDaiThaoDuong =
                                values['thoiGianBiDaiThaoDuong'] !== ''
                                    ? values['thoiGianBiDaiThaoDuong'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiTangHuyetAp =
                                values['thoiGianBiTangHuyetAp'] !== ''
                                    ? values['thoiGianBiTangHuyetAp'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayThangPhauThuat =
                                values['ngayThangPhauThuat'] !== ''
                                    ? values['ngayThangPhauThuat'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui1 =
                                values['NgayTiemMui1'] !== ''
                                    ? values['NgayTiemMui1'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui2 =
                                values['NgayTiemMui2'] !== ''
                                    ? values['NgayTiemMui2'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui3 =
                                values['NgayTiemMui3'] !== ''
                                    ? values['NgayTiemMui3'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';

                            values1 = {
                                ...values,
                                ngaySinh,
                                NgayCapCMNDBN,
                                ngayPhatHienSuyThan,
                                ngayCTNTHoacKhamThamPhanBenhLy,
                                daGhepLan1Ngay,
                                ngayChayThanTroLai,
                                ctntHoacKhamThamPhan,
                                thoiGianBiLao,
                                thoiGianBiDaiThaoDuong,
                                thoiGianBiTangHuyetAp,
                                ngayThangPhauThuat,
                                NgayTiemMui1,
                                NgayTiemMui2,
                                NgayTiemMui3
                            };
                            const qhgdnew = dataGiaDinh.current
                                ? dataGiaDinh.current
                                : [];
                            const ObjSave = {
                                dangKyChoGhepThanCreateVM: {
                                    ...values1,
                                    typePhieuDKGhepTang: TypeBoPhanConstant.than
                                },
                                quanHeGiaDinhCreateVMs: qhgdnew
                            };
                            if (
                                FileSelected !== undefined &&
                                FileSelected.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgAvatar = FileSelected;
                            }

                            if (
                                FileSelectedCMNDMT !== undefined &&
                                FileSelectedCMNDMT.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgCMND1 = FileSelectedCMNDMT;
                                CMNDtruoc = true;
                            }

                            if (
                                FileSelectedCMNDMs !== undefined &&
                                FileSelectedCMNDMs.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgCMND2 = FileSelectedCMNDMs;
                                CMNDsau = true;
                            }

                            // kiem tra xem du 2 cmnd
                            if (CMNDtruoc && CMNDsau) {
                                onCreateEntity(ObjSave);
                            } else {
                                toast.error('Bạn thiếu ảnh CMND');
                            }
                        }}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            hoTenBN: '',
                            typePhieuDKGhepTang: '',
                            tinh: '',
                            xaphuong: '',
                            quanhuyen: '',
                            tinhtt: '',
                            xaphuongtt: '',
                            quanhuyentt: '',
                            gioiTinh: String(0),
                            ngaySinh: '',
                            nhomMau: '',
                            nhomMau1: '',
                            baoHiemYTe: '',
                            CMNDBN: '',
                            NgayCapCMNDBN: '',
                            NoiCapCMNDBN: '',
                            ngheNghiep: '',
                            ngheNhiepBoSung: '',
                            trinhDoVanHoa: '',
                            dienThoai: '',
                            dienThoai1: '',
                            diaChiThuongChu: '',
                            diaChiTamChu: '',
                            laConThuMay: '',
                            tinhTrangHonNhan: String(0),
                            hoTenVoChong: '',
                            dienThoaiVoChong: '',
                            coMayCon: '',
                            soConTrai: '',
                            soConGai: '',
                            lonNhatSinhNam: '',
                            nhoNhatSinhNam: '',
                            tienCanGiaDinh: '',
                            tienCanBanThan: '',
                            nguyenNhanSuyThan: '',
                            chuanDoanSuyThanGhep: '',
                            benhSu: '',
                            thuocTriViemGan: '',
                            sinhThietThan: String(0),
                            ketQuaSinhThietThan: '',
                            ngayPhatHienSuyThan: '',
                            ngayCTNTHoacKhamThamPhanBenhLy: '',
                            dieuTriViemGanTu: '',
                            CTNTVaoNgay: String(0),
                            soGioTrenLan: '',
                            soLanCTNTTuan: '',
                            chuKyThamPhan: '',
                            chuKyThamPhanTaiBV: '',
                            thamPhanBangMay: String(0),
                            thamPhanBangMayTaiBV: '',
                            truyenMau: String(0),
                            baoNhieuDonViMau: '',
                            thang: '',
                            nam: '',
                            benhVienTruyenMau: '',
                            daGhepLan1Ngay: '',
                            daGhepLan1TaiBV: '',
                            nguoiChoThan: '',
                            ngayChayThanTroLai: '',
                            chayThanTroLaiTaiBV: '',
                            ctntHoacKhamThamPhan: '',
                            ctntVaoNgayThuMay: '',
                            caCTNT: '',
                            chieuCao: '',
                            canNang: '',
                            nuocTieu24h: String(0),
                            soLuongNuocTieu24h: '',
                            thuocDangSuDungNgay: '',
                            thoiGianBiTangHuyetAp: '',
                            thuocTaoMau: '',
                            bacSiDieuTri: '',
                            dienThoaiBacSi: '',
                            viemGanSieuViA: false,
                            viemGanSieuViB: false,
                            viemGanSieuViC: false,
                            khongBiViemGan: false,
                            truocHoacSauLocMau: 0,
                            tangHuyetAp: String(0),
                            daiThaoDuong: String(0),
                            thoiGianBiDaiThaoDuong: '',
                            thuocDieuTriDaiThaoDuong: '',
                            tinhTrang: '',
                            laoPhoi: String(0),
                            hutThuoc: String(0),
                            dieuTrenNgay: '',
                            uongRuouBia: String(0),
                            soLanTuan: '',
                            soLuongLan: '',
                            benhKhac: '',
                            laoCoQuanKhac: '',
                            thoiGianBiLao: '',
                            thoiGianDieuTriAndNoiDieuTri: '',
                            namPhatHien: '',
                            dieuTriTaiBV: '',
                            thoiGianDieuTri: '',
                            thuocDieuTri: '',
                            daPhauThuat: String(0),
                            coPhauThuat: '',
                            tinhTrangHienTai: '',
                            ngayThangPhauThuat: '',
                            benhVienPhauThuat: '',
                            biBenhThan: String(0),
                            biBenhLao: String(0),
                            biDaiThaoDuong: String(0),
                            biTangHuyetAp: String(0),
                            biUngThu: String(0),
                            songCungDiaChi: 0,
                            biBenhKhac: '',
                            nguoiThanBiBenh: '',
                            thuNhapBenhNhan: '',
                            tinhTrangBenhNguoiThanHienTai: '',
                            thuNhapVoChongBenhNhan: '',
                            ngheNghiepVoChong: '',
                            thuNhapKhac: '',
                            tienChuanBiChoViecGhepThan: '',
                            khongCoNguoiNhan: false,
                            nguoiChoBiBenh: false,
                            nguoiChoKhongHoaHopMau: false,
                            lyDoKhac: '',
                            email: '',
                            NhiemCovid: false,
                            BiTruocTiem: false,
                            BiSauTiem: false,
                            CoTrieuChung: false,
                            TrieuChungNhe: false,
                            TrieuChungtrungBinh: false,
                            NhapVien: false,
                            ThoiGianNamVien: 0,
                            ThoMay: false,
                            ThoHFNC: false,
                            TiemVaccine: '',
                            NgayTiemMui1: '',
                            NgayTiemMui2: '',
                            PhanUng: '',
                            TiemVaccine2: '',
                            PhanUng2: '',
                            NgayTiemMui3: '',
                            TiemVaccine3: '',
                            PhanUng3: '',
                            maso: null
                        }}
                    >
                        <Form.Item hidden name="typePhieuDKGhepTang">
                            <Input name="typePhieuDKGhepTang" />
                        </Form.Item>

                        <Row>
                            <div className="solama">I. HÀNH CHÍNH:</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Họ và tên"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 kí tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng không nhập quá 255 kí tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Họ tên không được sử dụng ký tự đặc biệt hoặc số'
                                                );
                                            }
                                        })
                                    ]}
                                    name="hoTenBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="hoTen" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Giới tính"
                                    name="gioiTinh"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="gioiTinh"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="Ảnh thẻ">
                                    <Input
                                        type="file"
                                        name="ImageSrc"
                                        key="ImageSrc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img id="Avatar" alt="" />
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày sinh"
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
                                                    new Date() < new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ngày sinh vượt quá ngày hiện tại'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ngày sinh phải sau ngày 1 tháng 1 năm 1920'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    name="ngaySinh"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngaySinh"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhóm máu ABO"
                                    name="nhomMau"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNhomMau()}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhóm máu Rh"
                                    name="nhomMau1"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau1">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNhomMauRh()}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bảo hiểm y tế"
                                    name="baoHiemYTe"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[a-zA-Z0-9 ]*$/.test(
                                                        val.trim()
                                                    )
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số bảo hiểm y tế chỉ được sử dụng chữ cái và số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="baoHiemYTe" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="CMND/CCCD/Hộ chiếu"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 9,
                                            message: 'CMND phải có ít nhất 9 số'
                                        },
                                        {
                                            max: 12,
                                            message: 'CMND không được quá 12 số'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9 ]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'CMND chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="CMNDBN" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày cấp"
                                    rules={[
                                        {
                                            type: 'object'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ngày cấp vượt quá ngày hiện tại'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ngày cấp phải sau ngày 1 tháng 1 năm 1920'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    name="NgayCapCMNDBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayCapCMNDBN"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nơi cấp"
                                    name="NoiCapCMNDBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="NoiCapCMNDBN" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt trước"
                                >
                                    <Input
                                        type="file"
                                        name="ImgCMNDBNMatTruoc"
                                        key="ImgCMNDBNMatTruoc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUploadCMNDMT}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt sau"
                                >
                                    <Input
                                        type="file"
                                        name="ImgCMNDBNMatSau"
                                        key="ImgCMNDBNMatSau"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUploadCMNDMs}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="imgCMND"
                                    id="ImgCMNDBNMatTruoc"
                                    alt=""
                                />
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="imgCMND"
                                    id="ImgCMNDBNMatSau"
                                    alt=""
                                    onError={NotFoundImage}
                                />
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nghề nghiệp"
                                    name="ngheNghiep"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="ngheNghiep">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNgheNghiep()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nghề nghiệp ghi rõ"
                                    name="ngheNghiepBoSung"
                                >
                                    <Input name="ngheNhiepBoSung" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Trình độ văn hóa"
                                    name="trinhDoVanHoa"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="trinhDoVanHoa" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại"
                                    name="dienThoai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 10,
                                            message:
                                                'Vui lọng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9+.]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="dienThoai" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại khác"
                                    name="dienThoai1"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lọng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="dienThoai1" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Email"
                                    name="email"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                if (
                                                    isEmail.test(val) ||
                                                    val === '' ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Email không hợp lệ'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="email" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <label>Địa chỉ thường trú:</label>
                        </Row>
                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="tinh"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="tinh"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinh', value);
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropTinh()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="quanhuyen"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="quanhuyen"
                                        onChange={(value) => {
                                            onchangeloaddiachi(
                                                'quanhuyen',
                                                value
                                            );
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropQuanHuyen()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="xaphuong"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuong">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropXa()}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    className="my-label"
                                    label="Số nhà, phố, tổ dân phố /thôn / đội"
                                    name="diaChiThuongChu"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiThuongChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <label className="my-label">Địa chỉ tạm trú:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="tinhtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="tinhtt"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinhtt', value);
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropTinhTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="quanhuyentt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="quanhuyentt"
                                        onChange={(value) => {
                                            onchangeloaddiachi(
                                                'quanhuyentt',
                                                value
                                            );
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropHuyenTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="xaphuongtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuongtt">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropXaTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    className="my-label"
                                    label="Số nhà, phố, tổ dân phố /thôn / đội"
                                    name="diaChiTamChu"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiTamChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Gia đình: là con thứ mấy?"
                                    name="laConThuMay"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        name="laConThuMay"
                                        placeholder="VD: là con thứ 1 trong gia đình 2 con viết là 1/2"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hôn nhân"
                                    name="tinhTrangHonNhan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tinhTrangHonNhan"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Độc thân</Radio>
                                        <Radio value="1">Đã có gia đình</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Họ tên Vợ/Chồng"
                                    name="hoTenVoChong"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Họ tên không được sử dụng ký tự đặc biệt hoặc số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="hoTenVoChong" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại"
                                    name="dienThoaiVoChong"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lòng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="dienThoaiVoChong" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Có mấy con"
                                    name="coMayCon"
                                >
                                    <InputNumber
                                        name="coMayCon"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Trai"
                                    name="soConTrai"
                                >
                                    <InputNumber
                                        name="soConTrai"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Gái"
                                    name="soConGai"
                                    style={{width: '100%'}}
                                >
                                    <InputNumber
                                        name="soConGai"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Lớn nhất sinh năm"
                                    name="lonNhatSinhNam"
                                >
                                    <InputNumber
                                        name="lonNhatSinhNam"
                                        min={1990}
                                        max={3000}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhỏ nhất sinh năm"
                                    name="nhoNhatSinhNam"
                                >
                                    <InputNumber
                                        name="nhoNhatSinhNam"
                                        min={1990}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <div className="solama">
                                II. TÌNH TRẠNG BỆNH LÝ:
                            </div>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="1.Nguyên nhân dẫn đến suy thận mạn giai đoạn cuối"
                                    name="nguyenNhanSuyThan"
                                >
                                    <Input name="nguyenNhanSuyThan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="2.Chuẩn đoán về thận học trước đó: có sinh thiết thận"
                                    name="sinhThietThan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="sinhThietThan"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Kết quả sinh thiết"
                                    name="ketQuaSinhThietThan"
                                >
                                    <Input name="ketQuaSinhThietThan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="3.Phát hiện suy thận"
                                    name="ngayPhatHienSuyThan"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayPhatHienSuyThan"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Chạy thận nhân tạo/Thẩm phân phúc mạc từ"
                                    name="ngayCTNTHoacKhamThamPhanBenhLy"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayCTNTHoacKhamThamPhanBenhLy"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Số lần chạy thận một tuần"
                                    name="soLanCTNTTuan"
                                >
                                    <InputNumber
                                        style={{width: '100%'}}
                                        min={0}
                                        name="soLanCTNTTuan"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Vào ngày"
                                    name="CTNTVaoNgay"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="CTNTVaoNgay"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Chẵn</Radio>
                                        <Radio value="0">Lẻ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Số giờ một lần"
                                    name="soGioTrenLan"
                                >
                                    <Input name="soGioTrenLan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Chu kỳ thẩm phân phúc mạc(số lần/ngày)"
                                    name="chuKyThamPhan"
                                >
                                    <InputNumber
                                        name="chuKyThamPhan"
                                        min={1}
                                        max={10}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tại bệnh viện"
                                    name="chuKyThamPhanTaiBV"
                                >
                                    <Input name="chuKyThamPhanTaiBV" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thẩm phân phúc mạc bằng máy"
                                    name="thamPhanBangMay"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="thamPhanBangMay"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bệnh viện theo dõi"
                                    name="thamPhanBangMayTaiBV"
                                >
                                    <Input name="thamPhanBangMayTaiBV" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu"
                                    name="truyenMau"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="truyenMau"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bao nhiêu đơn vị máu"
                                    name="baoNhieuDonViMau"
                                >
                                    <InputNumber
                                        min={0}
                                        name="baoNhieuDonViMau"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu lần cuối"
                                    name="thang"
                                >
                                    <InputNumber
                                        name="thang"
                                        placeholder="vào tháng"
                                        min={1}
                                        max={12}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Năm"
                                    name="name"
                                >
                                    <InputNumber
                                        name="nam"
                                        min={1900}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu tại bệnh viện"
                                    name="benhVienTruyenMau"
                                >
                                    <Input name="benhVienTruyenMau" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Đã ghép thận lần 1 vào ngày"
                                    name="daGhepLan1Ngay"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="daGhepLan1Ngay"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tại bệnh viện"
                                    name="daGhepLan1TaiBV"
                                >
                                    <Input name="daGhepLan1TaiBV" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Người cho thận(Cha/mẹ/anh/chị/em?)"
                                    name="nguoiChoThan"
                                >
                                    <Input name="nguoiChoThan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày chạy thận nhân tạo trở lại"
                                    name="ngayChayThanTroLai"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayChayThanTroLai"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Chuẩn đoán suy chức năng thận ghép"
                                    name="chuanDoanSuyThanGhep"
                                >
                                    <Input name="chuanDoanSuyThanGhep" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày chạy thận nhân tạo/Thẩm phân phúc mạc"
                                    name="ctntHoacKhamThamPhan"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ctntHoacKhamThamPhan"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tại bệnh viện"
                                    name="chayThanTroLaiTaiBV"
                                >
                                    <Input name="chayThanTroLaiTaiBV" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>Số lượng nước tiểu/24 giờ</label>
                            </Col>

                            <Col
                                lg={{span: 2}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>
                                    <input
                                        type="radio"
                                        checked
                                        name="nuocTieu24h"
                                        value="0"
                                    />
                                    <div>Không</div>
                                </label>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>
                                    <input
                                        type="radio"
                                        name="nuocTieu24h"
                                        value="1"
                                    />
                                    &nbsp; Có(ml/24h)
                                </label>

                                <Input
                                    name="soLuongNuocTieu24h"
                                    placeholder="ml/24h"
                                />
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Chiều cao(cm)"
                                    name="chieuCao"
                                >
                                    <InputNumber
                                        name="chieuCao"
                                        min={1}
                                        max={300}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Cân nặng(kg)"
                                    name="canNang"
                                >
                                    <InputNumber
                                        name="canNang"
                                        min={1}
                                        max={300}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc đang sử dụng/ngày"
                                    name="thuocDangSuDungNgay"
                                >
                                    <Input.TextArea
                                        showCount
                                        maxLength={200}
                                        name="thuocDangSuDungNgay"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc tạo máu"
                                    name="thuocTaoMau"
                                >
                                    <Input name="thuocTaoMau" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bác sĩ điều trị"
                                    name="bacSiDieuTri"
                                >
                                    <Input name="bacSiDieuTri" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại bác sĩ"
                                    name="dienThoaiBacSi"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lòng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="dienThoaiBacSi" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                4. Bệnh lý kèm theo
                            </label>
                        </Row>

                        <Row gutter={[10, 0]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="khongBiViemGan"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="khongBiViemGan"
                                        id="khongBiViemGan"
                                        onClick={() => KhongBiViemGanCheck()}
                                    >
                                        Không bị viêm gan
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViA"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViA"
                                        id="viemGanSieuViA"
                                    >
                                        Viêm gan siêu vi A
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViB"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViB"
                                        id="viemGanSieuViB"
                                    >
                                        Viêm gan siêu vi B
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViC"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViC"
                                        id="viemGanSieuViC"
                                    >
                                        Viêm gan siêu vi C
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="truocHoacSauLocMau"
                            valuePropName="checked"
                        >
                            <Radio.Group name="truocHoacSauLocMau">
                                <Radio value="1">Viêm gan trước lọc máu</Radio>
                                <Radio value="2">Viêm gan sau lọc máu</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điều trị viêm gan từ lúc nào"
                                    name="dieuTriViemGanTu"
                                >
                                    <Input name="dieuTriViemGanTu" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 16}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị viêm gan"
                                    name="thuocTriViemGan"
                                >
                                    <Input name="thuocTriViemGan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="laoPhoi"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="laoPhoi"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">
                                            Không có tiền căn lao
                                        </Radio>
                                        <Radio value="1">Lao phổi</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="laoCoQuanKhac"
                                    label="Lao các cơ quan khác"
                                >
                                    <Input name="laoCoQuanKhac" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiLao"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiLao"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 16}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thời gian điều trị/Nơi điều trị"
                                    name="thoiGianDieuTriAndNoiDieuTri"
                                >
                                    <Input name="thoiGianDieuTriAndNoiDieuTri" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Đái tháo đường"
                                    name="daiThaoDuong"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daiThaoDuong"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiDaiThaoDuong"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiDaiThaoDuong"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị"
                                    name="thuocDieuTriDaiThaoDuong"
                                >
                                    <Input name="thuocDieuTriDaiThaoDuong" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tăng huyết áp"
                                    name="tangHuyetAp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tangHuyetAp"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiTangHuyetAp"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiTangHuyetAp"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị"
                                    name="thuocDieuTri"
                                >
                                    <Input name="thuocDieuTri" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Các bệnh khác"
                                    name="benhKhac"
                                >
                                    <Input name="benhKhac" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình hình hiện tại"
                                    name="tinhTrang"
                                >
                                    <Input name="tinhTrang" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label className="class-b">
                                5.Tiền căn ngoại khoa
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>Có phẫu thuật gì trước đó không</label>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="daPhauThuat"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daPhauThuat"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày tháng năm phẫu thuật"
                                    name="ngayThangPhauThuat"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayThangPhauThuat"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Phẫu thuật tại bệnh viện"
                                    name="benhVienPhauThuat"
                                >
                                    <Input name="benhVienPhauThuat" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nếu có thì bệnh gì"
                                    name="coPhauThuat"
                                >
                                    <Input name="coPhauThuat" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hiện tại"
                                    name="tinhTrangHienTai"
                                >
                                    <Input name="tinhTrangHienTai" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="uongRuouBia"
                                    label="6.Thói quen uống rượu"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="uongRuouBia"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Không</Radio>
                                        <Radio value="1">Có</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLanTuan"
                                    label="Số lần/Tuần"
                                >
                                    <InputNumber
                                        name="soLanTuan"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLuongLan"
                                    label="Số lượng trên tuần"
                                >
                                    <Input
                                        name="soLuongLan"
                                        placeholder="lít/chai/lon/ly"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="hutThuoc"
                                    label="7.Thói quen hút thuốc"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="hutThuoc"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Không</Radio>
                                        <Radio value="1">Có</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="dieuTrenNgay"
                                    label="Số điếu trên ngày"
                                >
                                    <InputNumber
                                        name="dieuTrenNgay"
                                        placeholder="Điếu/ngày"
                                        style={{width: '100%'}}
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                8. Tiền căn gia đình
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhThan"
                                    label="Bệnh thận"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhLao"
                                    label="Bệnh lao"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biBenhLao">
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biDaiThaoDuong"
                                    label="Đái tháo đường"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biDaiThaoDuong">
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biTangHuyetAp"
                                    label="Tăng huyết áp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biTangHuyetAp">
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biUngThu"
                                    label="Ung thư"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biUngThu">
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Bênh khác"
                                    name="biBenhKhac"
                                    className="my-label"
                                >
                                    <Input className="biBenhKhac" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="songCungDiaChi"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="songCungDiaChi">
                                        <Radio value="1">
                                            Sống cùng địa chỉ
                                        </Radio>
                                        <Radio value="0">
                                            Không cùng địa chỉ
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nếu có thì là ai"
                                    name="nguoiThanBiBenh"
                                >
                                    <Input name="nguoiThanBiBenh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hiện tại"
                                    name="tinhTrangBenhNguoiThanHienTai"
                                >
                                    <Input name="tinhTrangBenhNguoiThanHienTai" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <div
                                    className="class-b"
                                    style={{marginBottom: '0px'}}
                                >
                                    9. Tiền sử covid
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[10, 0]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="NhiemCovid"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="NhiemCovid"
                                        id="NhiemCovid"
                                        onClick={() => KhongBiNhiemCheck()}
                                    >
                                        Không bị nhiễm covid
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="BiTruocTiem"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="BiTruocTiem"
                                        id="BiTruocTiem"
                                    >
                                        Bị nhiễm trước tiêm
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="BiSauTiem"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="BiSauTiem" id="BiSauTiem">
                                        Bị nhiễm sau tiêm
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="CoTrieuChung"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="CoTrieuChung"
                                        id="CoTrieuChung"
                                    >
                                        Không có triệu chứng
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="TrieuChungNhe"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="TrieuChungNhe"
                                        id="TrieuChungNhe"
                                    >
                                        Triệu chứng nhẹ
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="TrieuChungtrungBinh"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="TrieuChungtrungBinh"
                                        id="TrieuChungtrungBinh"
                                    >
                                        Triệu chứng trung bình
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="NhapVien"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="NhapVien" id="NhapVien">
                                        Nhập viện
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Thời gian nằm viện(ngày)">
                                    <InputNumber
                                        name="ThoiGianNamVien"
                                        min={0}
                                        max={100}
                                        style={{width: '100%'}}
                                        defaultValue={0}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ThoMay"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="ThoMay" id="ThoMay">
                                        Thở máy
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ThoHFNC"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="ThoHFNC" id="ThoHFNC">
                                        Thở HFNC
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                10. Tiêm vaccine ngừa covid
                            </label>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine"
                                    label="Tiêm vaccine ngừa covid mũi 1"
                                >
                                    <Input name="TiemVaccine" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui1"
                                    label="Ngày tiêm mũi 1"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui1"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng"
                                    label="Phản ứng sau tiêm lần 1"
                                >
                                    <Input name="PhanUng" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine2"
                                    label="Tiêm vaccine ngừa covid mũi 2"
                                >
                                    <Input name="TiemVaccine2" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui2"
                                    label="Ngày tiêm mũi 2"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui2"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng2"
                                    label="Phản ứng sau tiêm lần 2"
                                >
                                    <Input name="PhanUng2" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine3"
                                    label="Tiêm vaccine ngừa covid mũi 3"
                                >
                                    <Input name="TiemVaccine3" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui3"
                                    label="Ngày tiêm mũi 3"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui3"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng3"
                                    label="Phản ứng sau tiêm lần 3"
                                >
                                    <Input name="PhanUng3" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">III. Kinh tế</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập của bệnh nhân"
                                    className="my-label"
                                    name="thuNhapBenhNhan"
                                >
                                    <Input
                                        name="thuNhapBenhNhan"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập của vợ hoặc chồng"
                                    className="my-label"
                                    name="thuNhapVoChongBenhNhan"
                                >
                                    <InputNumber
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/tháng"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Nghề nghiệp"
                                    className="my-label"
                                    name="ngheNghiepVoChong"
                                >
                                    <Input name="ngheNghiepVoChong" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập khác"
                                    className="my-label"
                                    name="thuNhapKhac"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapKhac"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tiền chuẩn bị cho việc ghép thận(có sẵn)"
                                    className="my-label"
                                    name="tienChuanBiChoViecGhepThan"
                                >
                                    <Input
                                        name="tienChuanBiChoViecGhepThan"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">
                                IV. Lý do đăng ký chờ ghép thận từ người hiến
                                chết não
                            </div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="khongCoNguoiNhan"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        id="khongCoNguoiNhan"
                                        name="khongCoNguoiNhan"
                                    >
                                        Không có người hiến thận
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="nguoiChoBiBenh"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        id="nguoiChoBiBenh"
                                        name="nguoiChoBiBenh"
                                    >
                                        Người hiến bị bệnh
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="nguoiChoKhongHoaHopMau"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="nguoiChoKhongHoaHopMau"
                                        id="nguoiChoKhongHoaHopMau"
                                    >
                                        Người hiến không hòa hợp nhóm máu
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="lyDoKhac"
                                    label="Lý do khác"
                                    className="my-label"
                                >
                                    <Input name="lyDoKhac" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <div className="solama">V. Quan hệ gia đình:</div>
                        </Row>
                        <Row>
                            <RenderCreateQuanHeGiaDinh />
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }

    function CreateModalTangKhac() {
        const CoQuanGhep = typeCreate;
        const [loaddiachi, setloaddiachi] = useState({
            tinh: '',
            quanhuyen: '',
            tinhtt: '',
            quanhuyentt: ''
        });
        const [Huyen, setHuyen] = useState([]);
        const [HuyenTT, setHuyenTT] = useState([]);
        const [Xa, setXa] = useState([]);
        const [XaTT, setXaTT] = useState([]);
        function onchangeloaddiachi(name, value) {
            if (name === 'tinh') {
                setloaddiachi({...loaddiachi, tinh: value, quanhuyen: ''});

                LoadDiachi.DaTaQuanhuyen(value).then((rs) => {
                    if (rs.Status) {
                        setHuyen(rs.Data);
                    }
                });
            } else if (name === 'quanhuyen') {
                setloaddiachi({...loaddiachi, quanhuyen: value});
                LoadDiachi.DaTaXaphuong(value).then((rs) => {
                    if (rs.Status) {
                        setXa(rs.Data);
                    }
                });
            } else if (name === 'tinhtt') {
                setloaddiachi({...loaddiachi, tinhtt: value, quanhuyentt: ''});
                LoadDiachi.DaTaQuanhuyen(value).then((rs) => {
                    if (rs.Status) {
                        setHuyenTT(rs.Data);
                    }
                });
            } else if (name === 'quanhuyentt') {
                setloaddiachi({...loaddiachi, quanhuyentt: value});
                LoadDiachi.DaTaXaphuong(value).then((rs) => {
                    if (rs.Status) {
                        setXaTT(rs.Data);
                    }
                });
            }
        }
        const DropQuanHuyen = () => {
            return Huyen.map((item) => {
                return (
                    <option value={item.MaHuyen} key={item.MaHuyen}>
                        {item.TenHuyen}
                    </option>
                );
            });
        };
        const DropXa = () => {
            return Xa.map((item) => {
                return (
                    <option value={item.MaXa} key={item.MaXa}>
                        {item.TenXa}
                    </option>
                );
            });
        };
        const DropHuyenTT = () => {
            return HuyenTT.map((item) => {
                return (
                    <option value={item.MaHuyen} key={item.MaHuyen}>
                        {item.TenHuyen}
                    </option>
                );
            });
        };
        const DropXaTT = () => {
            return XaTT.map((item) => {
                return (
                    <option value={item.MaXa} key={item.MaXa}>
                        {item.TenXa}
                    </option>
                );
            });
        };

        return (
            <>
                <Modal
                    visible={
                        IsOpenCoQuan &&
                        TypeBoPhanConstant.GetName(CoQuanGhep) !== '' &&
                        typeCreate !== 'than'
                    }
                    onCancel={() => {
                        setIsShowCreatePopup(false);
                        setIsOpenCoQuan(false);
                    }}
                    title={`Tạo mới đăng ký chờ ghép ${TypeBoPhanConstant.GetName(
                        CoQuanGhep
                    )}`}
                    onOk={() => {
                        submitCreate();
                        canhbaoErrorModal(formRef);
                    }}
                    width={1600}
                    zIndex={1040}
                >
                    <Form
                        onFinish={(values) => {
                            // sua gia tri 3 checkbox viem gan sieu vi A B C
                            let values1 = values;
                            let CMNDtruoc = false;
                            let CMNDsau = false;
                            if (values.khongBiViemGan) {
                                values1.viemGanSieuViA = false;
                                values1.viemGanSieuViB = false;
                                values1.viemGanSieuViC = false;
                                values1.truocHoacSauLocMau = 0;
                            }
                            const ngaySinh =
                                values['ngaySinh'] !== ''
                                    ? values['ngaySinh'].format('DD-MM-YYYY')
                                    : '';
                            const NgayCapCMNDBN =
                                values['NgayCapCMNDBN'] !== ''
                                    ? values['NgayCapCMNDBN'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayPhatHienSuyThan =
                                values['ngayPhatHienSuyThan'] !== ''
                                    ? values['ngayPhatHienSuyThan'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiLao =
                                values['thoiGianBiLao'] !== ''
                                    ? values['thoiGianBiLao'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiDaiThaoDuong =
                                values['thoiGianBiDaiThaoDuong'] !== ''
                                    ? values['thoiGianBiDaiThaoDuong'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const thoiGianBiTangHuyetAp =
                                values['thoiGianBiTangHuyetAp'] !== ''
                                    ? values['thoiGianBiTangHuyetAp'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const ngayThangPhauThuat =
                                values['ngayThangPhauThuat'] !== ''
                                    ? values['ngayThangPhauThuat'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui1 =
                                values['NgayTiemMui1'] !== ''
                                    ? values['NgayTiemMui1'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui2 =
                                values['NgayTiemMui2'] !== ''
                                    ? values['NgayTiemMui2'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';
                            const NgayTiemMui3 =
                                values['NgayTiemMui3'] !== ''
                                    ? values['NgayTiemMui3'].format(
                                          'DD-MM-YYYY'
                                      )
                                    : '';

                            values1 = {
                                ...values,
                                ngaySinh,
                                NgayCapCMNDBN,
                                ngayPhatHienSuyThan,
                                thoiGianBiLao,
                                thoiGianBiDaiThaoDuong,
                                thoiGianBiTangHuyetAp,
                                ngayThangPhauThuat,
                                NgayTiemMui1,
                                NgayTiemMui2,
                                NgayTiemMui3
                            };
                            const qhgdnew = dataGiaDinh.current
                                ? dataGiaDinh.current
                                : [];
                            const ObjSave = {
                                dangKyChoGhepThanCreateVM: {
                                    ...values1,
                                    typePhieuDKGhepTang: TypeBoPhanConstant.GetStyle(
                                        CoQuanGhep
                                    )
                                },
                                quanHeGiaDinhCreateVMs: qhgdnew
                            };
                            if (
                                FileSelected !== undefined &&
                                FileSelected.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgAvatar = FileSelected;
                            }

                            if (
                                FileSelectedCMNDMT !== undefined &&
                                FileSelectedCMNDMT.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgCMND1 = FileSelectedCMNDMT;
                                CMNDtruoc = true;
                            }

                            if (
                                FileSelectedCMNDMs !== undefined &&
                                FileSelectedCMNDMs.data
                            ) {
                                ObjSave.dangKyChoGhepThanCreateVM.imgCMND2 = FileSelectedCMNDMs;
                                CMNDsau = true;
                            }
                            // kiem tra xem du 2 cmnd
                            if (CMNDtruoc && CMNDsau) {
                                onCreateEntity(ObjSave);
                            } else {
                                toast.error('Bạn thiếu ảnh CMND');
                            }
                        }}
                        ref={formRef}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            hoTenBN: '',
                            tinh: '',
                            xaphuong: '',
                            quanhuyen: '',
                            tinhtt: '',
                            xaphuongtt: '',
                            quanhuyentt: '',
                            gioiTinh: String(0),
                            ngaySinh: '',
                            nhomMau: '',
                            nhomMau1: '',
                            baoHiemYTe: '',
                            CMNDBN: '',
                            NgayCapCMNDBN: '',
                            NoiCapCMNDBN: '',
                            ngheNghiep: '',
                            ngheNhiepBoSung: '',
                            trinhDoVanHoa: '',
                            dienThoai: '',
                            dienThoai1: '',
                            diaChiThuongChu: '',
                            diaChiTamChu: '',
                            laConThuMay: '',
                            tinhTrangHonNhan: String(0),
                            hoTenVoChong: '',
                            dienThoaiVoChong: '',
                            coMayCon: '',
                            soConTrai: '',
                            soConGai: '',
                            lonNhatSinhNam: '',
                            nhoNhatSinhNam: '',
                            // tienCanGiaDinh: '',
                            // tienCanBanThan: '',
                            nguyenNhanSuyThan: '',
                            // chuanDoanSuyThanGhep: '',
                            // benhSu: '',
                            thuocTriViemGan: '',
                            // sinhThietThan: String(0),
                            // ketQuaSinhThietThan: '',
                            ngayPhatHienSuyThan: '',
                            // ngayCTNTHoacKhamThamPhanBenhLy: '',
                            dieuTriViemGanTu: '',
                            // CTNTVaoNgay: String(0),
                            // soGioTrenLan: '',
                            // soLanCTNTTuan: '',
                            // chuKyThamPhan: '',
                            // chuKyThamPhanTaiBV: '',
                            // thamPhanBangMay: String(0),
                            // thamPhanBangMayTaiBV: '',
                            truyenMau: String(0),
                            baoNhieuDonViMau: '',
                            thang: null,
                            nam: null,
                            benhVienTruyenMau: '',
                            // daGhepLan1Ngay: '',
                            // daGhepLan1TaiBV: '',
                            // nguoiChoThan: '',
                            // ngayChayThanTroLai: '',
                            // chayThanTroLaiTaiBV: '',
                            // ctntHoacKhamThamPhan: '',
                            // ctntVaoNgayThuMay: '',
                            // caCTNT: '',
                            chieuCao: '',
                            canNang: '',
                            // nuocTieu24h: String(0),
                            // soLuongNuocTieu24h: '',
                            thuocDangSuDungNgay: '',
                            thoiGianBiTangHuyetAp: '',
                            thuocTaoMau: '',
                            bacSiDieuTri: '',
                            dienThoaiBacSi: '',
                            viemGanSieuViA: false,
                            truocHoacSauLocMau: 0,
                            tangHuyetAp: String(0),
                            daiThaoDuong: String(0),
                            thoiGianBiDaiThaoDuong: '',
                            thuocDieuTriDaiThaoDuong: '',
                            tinhTrang: '',
                            laoPhoi: String(0),
                            hutThuoc: String(0),
                            dieuTrenNgay: 0,
                            uongRuouBia: String(0),
                            soLanTuan: 0,
                            soLuongLan: '',
                            // benhKhac: '',
                            laoCoQuanKhac: '',
                            thoiGianBiLao: '',
                            thoiGianDieuTriAndNoiDieuTri: '',
                            // namPhatHien: '',
                            // dieuTriTaiBV: '',
                            // thoiGianDieuTri: '',
                            thuocDieuTri: '',
                            daPhauThuat: String(0),
                            coPhauThuat: '',
                            tinhTrangHienTai: '',
                            ngayThangPhauThuat: '',
                            benhVienPhauThuat: '',
                            biBenhThan: String(0),
                            biBenhLao: String(0),
                            biDaiThaoDuong: String(0),
                            biTangHuyetAp: String(0),
                            biUngThu: String(0),
                            songCungDiaChi: 0,
                            biBenhKhac: '',
                            nguoiThanBiBenh: '',
                            thuNhapBenhNhan: '',
                            tinhTrangBenhNguoiThanHienTai: '',
                            thuNhapVoChongBenhNhan: '',
                            ngheNghiepVoChong: '',
                            thuNhapKhac: '',
                            tienChuanBiChoViecGhepThan: '',
                            khongCoNguoiNhan: false,
                            nguoiChoBiBenh: false,
                            nguoiChoKhongHoaHopMau: false,
                            lyDoKhac: '',
                            choGhepBoPhan: TypeBoPhanConstant.GetStyle(
                                CoQuanGhep
                            ),
                            choGhepBenh: '',
                            choGhepBVDieuTri: '',
                            email: '',
                            NhiemCovid: false,
                            BiTruocTiem: false,
                            BiSauTiem: false,
                            CoTrieuChung: false,
                            TrieuChungNhe: false,
                            TrieuChungtrungBinh: false,
                            NhapVien: false,
                            ThoiGianNamVien: 0,
                            ThoMay: false,
                            ThoHFNC: false,
                            TiemVaccine: '',
                            NgayTiemMui1: '',
                            NgayTiemMui2: '',
                            PhanUng: '',
                            TiemVaccine2: '',
                            PhanUng2: '',
                            NgayTiemMui3: '',
                            TiemVaccine3: '',
                            PhanUng3: '',

                            maso: null
                        }}
                    >
                        <Row>
                            <Col span={24}>
                                <div className="pdk-hien-tieude">
                                    <div className="headerClientPage">
                                        ĐƠN ĐĂNG KÝ CHỜ GHÉP{' '}
                                        {TypeBoPhanConstant.GetName(CoQuanGhep)}{' '}
                                        TỪ NGƯỜI HIẾN CHẾT NÃO - NGỪNG TUẦN HOÀN
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">I. HÀNH CHÍNH:</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Họ và tên"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 kí tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng không nhập quá 255 kí tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Họ tên không được sử dụng ký tự đặc biệt hoặc số'
                                                );
                                            }
                                        })
                                    ]}
                                    name="hoTenBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="hoTenBN" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Giới tính"
                                    name="gioiTinh"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="gioiTinh"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="Ảnh thẻ">
                                    <Input
                                        type="file"
                                        name="ImageSrc"
                                        key="ImageSrc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUpload}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img id="Avatar" alt="" />
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày sinh"
                                    placeholder="Vui lòng chọn ngày"
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
                                                    new Date() < new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ngày sinh vượt quá ngày hiện tại'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ngày sinh phải sau ngày 1 tháng 1 năm 1920'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    name="ngaySinh"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngaySinh"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhóm máu ABO"
                                    name="nhomMau"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNhomMau()}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhóm máu Rh"
                                    name="nhomMau1"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau1">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNhomMauRh()}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bảo hiểm y tế"
                                    name="baoHiemYTe"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[a-zA-Z0-9 ]*$/.test(
                                                        val.trim()
                                                    )
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số bảo hiểm y tế chỉ được sử dụng chữ cái và số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="baoHiemYTe" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="CMND/CCCD/Hộ chiếu"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 9,
                                            message: 'CMND phải có ít nhất 9 số'
                                        },
                                        {
                                            max: 12,
                                            message: 'CMND không được quá 12 số'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9 ]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'CMND chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="CMNDBN" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày cấp"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ngày cấp vượt quá ngày hiện tại'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ngày cấp phải sau ngày 1 tháng 1 năm 1920'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    name="NgayCapCMNDBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayCapCMNDBN"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nơi cấp"
                                    name="NoiCapCMNDBN"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="NoiCapCMNDBN" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt trước"
                                >
                                    <Input
                                        type="file"
                                        name="ImgCMNDBNMatTruoc"
                                        key="ImgCMNDBNMatTruoc"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUploadCMNDMT}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt sau"
                                >
                                    <Input
                                        type="file"
                                        name="ImgCMNDBNMatSau"
                                        key="ImgCMNDBNMatSau"
                                        className="form-control img-padding"
                                        onChange={ChangeFileUploadCMNDMs}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="imgCMND"
                                    id="ImgCMNDBNMatTruoc"
                                    alt=""
                                />
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <img
                                    className="imgCMND"
                                    id="ImgCMNDBNMatSau"
                                    alt=""
                                    onError={NotFoundImage}
                                />
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nghề nghiệp"
                                    name="ngheNghiep"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="ngheNghiep">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>

                                        {DropDMNgheNghiep()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nghề nghiệp bổ xung"
                                    name="ngheNghiepBoSung"
                                >
                                    <Input name="ngheNghiepBoSung" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Trình độ văn hóa"
                                    name="trinhDoVanHoa"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="trinhDoVanHoa" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại"
                                    name="dienThoai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        },
                                        {
                                            min: 10,
                                            message:
                                                'Vui lọng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9+.]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="dienThoai" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại khác"
                                    name="dienThoai1"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lọng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng số'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="dienThoai1" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Email"
                                    name="email"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                const isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                if (
                                                    isEmail.test(val) ||
                                                    val === '' ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Email không hợp lệ'
                                                );
                                            }
                                        })
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="email" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <label className="my-label">Địa chỉ thường trú:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="tinh"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="tinh"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinh', value);
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropTinh()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="quanhuyen"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="quanhuyen"
                                        onChange={(value) => {
                                            onchangeloaddiachi(
                                                'quanhuyen',
                                                value
                                            );
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropQuanHuyen()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="xaphuong"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuong">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropXa()}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    className="my-label"
                                    label="Số nhà, phố, tổ dân phố /thôn / đội"
                                    name="diaChiThuongChu"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiThuongChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <label className="my-label">Địa chỉ tạm trú:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Tỉnh/Thành Phố"
                                    name="tinhtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="tinhtt"
                                        onChange={(value) => {
                                            onchangeloaddiachi('tinhtt', value);
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropTinhTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Quận/Huyện"
                                    name="quanhuyentt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select
                                        defaultValue=""
                                        name="quanhuyentt"
                                        onChange={(value) => {
                                            onchangeloaddiachi(
                                                'quanhuyentt',
                                                value
                                            );
                                        }}
                                    >
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropHuyenTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Xã/Phường"
                                    name="xaphuongtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuongtt">
                                        <Select.Option value="">
                                            --Chọn--
                                        </Select.Option>
                                        {DropXaTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    className="my-label"
                                    label="Số nhà, phố, tổ dân phố /thôn / đội"
                                    name="diaChiTamChu"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiTamChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Gia đình: là con thứ mấy?"
                                    name="laConThuMay"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        name="laConThuMay"
                                        placeholder="VD: là con thứ 1 trong gia đình 2 con viết là 1/2"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hôn nhân"
                                    name="tinhTrangHonNhan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tinhTrangHonNhan"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Độc thân</Radio>
                                        <Radio value="1">Đã có gia đình</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Họ tên Vợ/Chồng"
                                    name="hoTenVoChong"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui lòng nhập ít nhất 2 ký tự'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui lòng nhập không quá 255 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'Họ tên không được sử dụng ký tự đặc biệt hoặc số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="hoTenVoChong" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại"
                                    name="dienThoaiVoChong"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lòng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="dienThoaiVoChong" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Có mấy con"
                                    name="coMayCon"
                                >
                                    <InputNumber
                                        name="coMayCon"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Trai"
                                    name="soConTrai"
                                >
                                    <InputNumber
                                        name="soConTrai"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Gái"
                                    name="soConGai"
                                    style={{width: '100%'}}
                                >
                                    <InputNumber
                                        name="soConGai"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Lớn nhất sinh năm"
                                    name="lonNhatSinhNam"
                                >
                                    <InputNumber
                                        name="lonNhatSinhNam"
                                        min={1990}
                                        max={3000}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nhỏ nhất sinh năm"
                                    name="nhoNhatSinhNam"
                                >
                                    <InputNumber
                                        name="nhoNhatSinhNam"
                                        min={1990}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">
                                II. TÌNH TRẠNG BỆNH LÝ:
                            </div>
                        </Row>
                        <Row>
                            <label className="class-b">
                                1.Nguyên nhân dẫn đến bệnh hiện tại
                            </label>
                        </Row>
                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="nguyenNhanSuyThan"
                                >
                                    <Input name="nguyenNhanSuyThan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label className="class-b">
                                2.Phát hiện suy{' '}
                                {TypeBoPhanConstant.GetName(
                                    CoQuanGhep.CoQuanGhep
                                )}
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="ngayPhatHienSuyThan"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayPhatHienSuyThan"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu"
                                    name="truyenMau"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="truyenMau"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bao nhiêu đơn vị máu"
                                    name="baoNhieuDonViMau"
                                >
                                    <Input name="baoNhieuDonViMau" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 8}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu lần cuối"
                                    name="thang"
                                >
                                    <InputNumber
                                        name="thang"
                                        placeholder="vào tháng"
                                        min={1}
                                        max={12}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Năm"
                                    name="name"
                                >
                                    <InputNumber
                                        name="nam"
                                        min={1970}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Truyền máu tại bệnh viện"
                                    name="benhVienTruyenMau"
                                >
                                    <Input name="benhVienTruyenMau" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Chiều cao(cm)"
                                    name="chieuCao"
                                >
                                    <InputNumber
                                        name="chieuCao"
                                        min={1}
                                        max={300}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Cân nặng(kg)"
                                    name="canNang"
                                >
                                    <InputNumber
                                        name="canNang"
                                        min={1}
                                        max={300}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc đang sử dụng/ngày"
                                    name="thuocDangSuDungNgay"
                                >
                                    <Input.TextArea
                                        showCount
                                        maxLength={200}
                                        name="thuocDangSuDungNgay"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc tạo máu"
                                    name="thuocTaoMau"
                                >
                                    <Input name="thuocTaoMau" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Bác sĩ điều trị"
                                    name="bacSiDieuTri"
                                >
                                    <Input name="bacSiDieuTri" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điện thoại bác sĩ"
                                    name="dienThoaiBacSi"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui lòng nhập ít nhất 10 ký tự'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui lòng nhập không quá 12 ký tự'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    /^[0-9+.]*$/.test(val) ||
                                                    val === undefined ||
                                                    val === null
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'Số điện thoại chỉ được sử dụng chữ số'
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input name="dienThoaiBacSi" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                3. Bệnh lý kèm theo
                            </label>
                        </Row>

                        <Row gutter={[10, 0]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="khongBiViemGan"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="khongBiViemGan"
                                        id="khongBiViemGan"
                                    >
                                        Không bị viêm gan
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViA"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViA"
                                        id="viemGanSieuViA"
                                    >
                                        Viêm gan siêu vi A
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViB"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViB"
                                        id="viemGanSieuViB"
                                    >
                                        Viêm gan siêu vi B
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="viemGanSieuViC"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="viemGanSieuViC"
                                        id="viemGanSieuViC"
                                    >
                                        Viêm gan siêu vi C
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="truocHoacSauLocMau"
                            valuePropName="checked"
                        >
                            <Radio.Group name="truocHoacSauLocMau">
                                <Radio value="1">Viêm gan trước lọc máu</Radio>
                                <Radio value="2">Viêm gan sau lọc máu</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Điều trị viêm gan từ lúc nào"
                                    name="dieuTriViemGanTu"
                                >
                                    <Input name="dieuTriViemGanTu" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 16}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị viêm gan"
                                    name="thuocTriViemGan"
                                >
                                    <Input name="thuocTriViemGan" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="laoPhoi"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="laoPhoi"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">
                                            Không có tiền căn lao
                                        </Radio>
                                        <Radio value="1">Lao phổi</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="laoCoQuanKhac"
                                    label="Lao các cơ quan khác"
                                >
                                    <Input name="laoCoQuanKhac" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiLao"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiLao"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 16}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thời gian điều trị/Nơi điều trị"
                                    name="thoiGianDieuTriAndNoiDieuTri"
                                >
                                    <Input name="thoiGianDieuTriAndNoiDieuTri" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Đái tháo đường"
                                    name="daiThaoDuong"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daiThaoDuong"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiDaiThaoDuong"
                                    placeholder="Vui lòng chọn ngày"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiDaiThaoDuong"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị"
                                    name="thuocDieuTriDaiThaoDuong"
                                >
                                    <Input name="thuocDieuTriDaiThaoDuong" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tăng huyết áp"
                                    name="tangHuyetAp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tangHuyetAp"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Từ lúc nào"
                                    name="thoiGianBiTangHuyetAp"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiTangHuyetAp"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Thuốc điều trị"
                                    name="thuocDieuTri"
                                >
                                    <Input name="thuocDieuTri" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Các bệnh khác"
                                    name="benhKhac"
                                >
                                    <Input name="benhKhac" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình hình hiện tại"
                                    name="tinhTrang"
                                >
                                    <Input name="tinhTrang" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label className="class-b">
                                4.Tiền căn ngoại khoa
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>Có phẫu thuật gì trước đó không</label>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="daPhauThuat"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daPhauThuat"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ngày tháng năm phẫu thuật"
                                    name="ngayThangPhauThuat"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayThangPhauThuat"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Phẫu thuật tại bệnh viện"
                                    name="benhVienPhauThuat"
                                >
                                    <Input name="benhVienPhauThuat" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nếu có thì bệnh gì"
                                    name="coPhauThuat"
                                >
                                    <Input name="coPhauThuat" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hiện tại"
                                    name="tinhTrangHienTai"
                                >
                                    <Input name="tinhTrangHienTai" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                5.Thói quen uống rượu
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="uongRuouBia"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="uongRuouBia"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Không</Radio>
                                        <Radio value="1">Có</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLanTuan"
                                    label="Số lần/Tuần"
                                >
                                    <InputNumber
                                        name="soLanTuan"
                                        min={0}
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLuongLan"
                                    label="Số lượng trên tuần"
                                >
                                    <Input
                                        name="soLuongLan"
                                        placeholder="lít/chai/lon/ly"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="hutThuoc"
                                    label="7.Thói quen hút thuốc"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="hutThuoc"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Không</Radio>
                                        <Radio value="1">Có</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="dieuTrenNgay"
                                    label="Số điếu trên ngày"
                                >
                                    <InputNumber
                                        name="dieuTrenNgay"
                                        placeholder="Điếu/ngày"
                                        style={{width: '100%'}}
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                8. Tiền căn gia đình
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhThan"
                                    label="Bệnh thận"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhLao"
                                    label="Bệnh lao"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biDaiThaoDuong"
                                    label="Đái tháo đường"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biTangHuyetAp"
                                    label="Tăng huyết áp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biUngThu"
                                    label="Ung thư"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Bênh khác"
                                    name="biBenhKhac"
                                    className="my-label"
                                >
                                    <Input className="biBenhKhac" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="songCungDiaChi"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">
                                            Sống cùng địa chỉ
                                        </Radio>
                                        <Radio value="0">
                                            Không cùng địa chỉ
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Nếu có thì là ai"
                                    name="nguoiThanBiBenh"
                                >
                                    <Input name="nguoiThanBiBenh" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Tình trạng hiện tại"
                                    name="tinhTrangBenhNguoiThanHienTai"
                                >
                                    <Input name="tinhTrangBenhNguoiThanHienTai" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <div
                                    className="class-b"
                                    style={{marginBottom: '0px'}}
                                >
                                    9. Tiền sử covid
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[10, 0]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="NhiemCovid"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="NhiemCovid"
                                        id="NhiemCovid"
                                        onClick={() => KhongBiNhiemCheck()}
                                    >
                                        Không bị nhiễm covid
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="BiTruocTiem"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="BiTruocTiem"
                                        id="BiTruocTiem"
                                    >
                                        Bị nhiễm trước tiêm
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="BiSauTiem"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="BiSauTiem" id="BiSauTiem">
                                        Bị nhiễm sau tiêm
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="CoTrieuChung"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="CoTrieuChung"
                                        id="CoTrieuChung"
                                    >
                                        Không có triệu chứng
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="TrieuChungNhe"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="TrieuChungNhe"
                                        id="TrieuChungNhe"
                                    >
                                        Triệu chứng nhẹ
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="TrieuChungtrungBinh"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="TrieuChungtrungBinh"
                                        id="TrieuChungtrungBinh"
                                    >
                                        Triệu chứng trung bình
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="NhapVien"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="NhapVien" id="NhapVien">
                                        Nhập viện
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item label="Thời gian nằm viện(ngày)">
                                    <InputNumber
                                        name="ThoiGianNamVien"
                                        min={0}
                                        max={100}
                                        style={{width: '100%'}}
                                        defaultValue={0}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ThoMay"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="ThoMay" id="ThoMay">
                                        Thở máy
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ThoHFNC"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="ThoHFNC" id="ThoHFNC">
                                        Thở HFNC
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                10. Tiêm vaccine ngừa covid
                            </label>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine"
                                    label="Tiêm vaccine ngừa covid mũi 1"
                                >
                                    <Input name="TiemVaccine" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui1"
                                    label="Ngày tiêm mũi 1"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui1"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng"
                                    label="Phản ứng sau tiêm lần 1"
                                >
                                    <Input name="PhanUng" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine2"
                                    label="Tiêm vaccine ngừa covid mũi 2"
                                >
                                    <Input name="TiemVaccine2" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui2"
                                    label="Ngày tiêm mũi 2"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui2"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng2"
                                    label="Phản ứng sau tiêm lần 2"
                                >
                                    <Input name="PhanUng2" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="TiemVaccine3"
                                    label="Tiêm vaccine ngừa covid mũi 3"
                                >
                                    <Input name="TiemVaccine3" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="NgayTiemMui3"
                                    label="Ngày tiêm mũi 3"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui3"
                                        placeholder="Vui lòng chọn ngày"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="PhanUng3"
                                    label="Phản ứng sau tiêm lần 3"
                                >
                                    <Input name="PhanUng3" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">III. Kinh tế</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập của bệnh nhân"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapBenhNhan"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập của vợ hoặc chồng"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Nghề nghiệp"
                                    className="my-label"
                                >
                                    <Input name="ngheNghiepVoChong" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập khác"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapKhac"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Tiền chuẩn bị cho việc ghép thận(có sẵn)"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="tienChuanBiChoViecGhepThan"
                                        placeholder="vnd/tháng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">
                                IV. LÝ DO ĐĂNG KÝ CHỜ GHÉP
                                <p
                                    style={{
                                        textTransform: 'uppercase',
                                        display: 'inline'
                                    }}
                                >
                                    {' '}
                                    {TypeBoPhanConstant.GetName(
                                        CoQuanGhep.CoQuanGhep
                                    )}
                                </p>{' '}
                                TỪ NGƯỜI HIẾN CHẾT NÃO:
                            </div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="khongCoNguoiNhan"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        id="khongCoNguoiNhan"
                                        name="khongCoNguoiNhan"
                                    >
                                        Không có người hiến thận
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="nguoiChoBiBenh"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        id="nguoiChoBiBenh"
                                        name="nguoiChoBiBenh"
                                    >
                                        Người hiến bị bệnh
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 8}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="nguoiChoKhongHoaHopMau"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="nguoiChoKhongHoaHopMau"
                                        id="nguoiChoKhongHoaHopMau"
                                    >
                                        Người hiến không hòa hợp nhóm máu
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="lyDoKhac"
                                    label="Lý do khác"
                                    className="my-label"
                                >
                                    <Input name="lyDoKhac" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <div className="solama">V. Quan hệ gia đình:</div>
                        </Row>
                        <Row>{RenderCreateQuanHeGiaDinh()}</Row>
                        <Row>
                            <div className="solama">
                                VI. Cam kết đăng ký chờ ghép{' '}
                                {TypeBoPhanConstant.GetName(CoQuanGhep)} từ
                                người hiến chết não hay tim ngừng đập
                            </div>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <span>
                                    Hiện tôi bị bệnh{' '}
                                    <div
                                        style={{
                                            width: '150px',
                                            display: 'inline-table'
                                        }}
                                    >
                                        <Form.Item name="choGhepBenh">
                                            <Input name="choGhepBenh" />
                                        </Form.Item>
                                    </div>{' '}
                                    đang được điều trị tại{' '}
                                    <div
                                        style={{
                                            width: '150px',
                                            display: 'inline-table'
                                        }}
                                    >
                                        <Form.Item name="choGhepBVDieuTri">
                                            <Input name="choGhepBVDieuTri" />
                                        </Form.Item>
                                    </div>
                                    , có chỉ định ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)}.
                                    Tôi đã được các bác sĩ phụ trách giải thích
                                    rõ về các bước thực hiện đánh giá tình trạng
                                    sức khỏe chung, thực hiện quá trình tuyển
                                    chọn, thời gian chờ đợi, tác dụng phụ của
                                    thuốc ức chế miễn dịch điều trị sau ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)},
                                    chi phí ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)},
                                    chuẩn bị môi trường và cách sinh hoạt sau
                                    khi được ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)}.
                                    Tôi xin được đăng ký vào danh sách chờ ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)} từ
                                    người hiến chết não hay tim ngừng đập tại
                                    Bệnh viện Chợ Rẫy, tôi cam kết tuân thủ các
                                    quy định trong quá trình điều trị bệnh trước
                                    và sau ghép{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)}.
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }

    const LoadCreateModal = () => {
        const lst = [
            {
                ten: 'Thận',
                type: 'than'
            },
            {
                ten: 'Tim',
                type: 'tim'
            },
            {
                ten: 'Phổi',
                type: 'phoi'
            },
            {
                ten: 'Giác Mạc',
                type: 'giacmac'
            },
            {
                ten: 'Gan',
                type: 'gan'
            },
            {
                ten: 'Tuỵ',
                type: 'tuy'
            },
            {
                ten: 'Ruột',
                type: 'ruot'
            },
            {
                ten: 'Da',
                type: 'da'
            },
            {
                ten: 'Chi thể',
                type: 'chithe'
            }
        ];
        return (
            <Modal
                title="Chọn cơ quan đăng ký chờ ghép"
                visible={IsShowCreatePopup}
                onCancel={() => setIsShowCreatePopup(false)}
                zIndex={1039}
            >
                <div className="row">
                    {lst.map((item, key) => {
                        return (
                            <div
                                key={`${key}loadchoncoquan`}
                                className="col-sm-6"
                                style={{padding: '5px'}}
                            >
                                <Button
                                    className="btn btn-primary btn-sm btn-block"
                                    onClick={() => {
                                        settypeCreate(item.type);
                                        setIsOpenCoQuan(true);
                                    }}
                                >
                                    Tạo đăng ký chờ ghép {item.ten}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        );
    };
    return (
        <>
            <LoadCreateModal />
            <CreateModal />
            <CreateModalTangKhac />
        </>
    );
};

export default DangKyChoGhepTangCreateAdm;
