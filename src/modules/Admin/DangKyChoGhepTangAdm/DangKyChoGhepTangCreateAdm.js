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
            toast.info('X??a th??nh c??ng');
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
                        <i className="fas fa-plus" /> Th??m anh/ch???/em
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
                                            label="H??? v?? t??n"
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
                                            label="Quan h???"
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
                                                    --Ch???n--
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
                                            label="Sinh N??m"
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
                                            label="Nh??m m??u"
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
                                                    --Ch???n--
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
                                            label="Tr??nh ????? v??n h??a"
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
                                            label="?????a ch??? th?????ng tr??"
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
                                            label="S??? ??i???n tho???i"
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
                                            label="L?? do kh??ng hi???n th??? ???????c"
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
                    title="T???o m???i ????ng k?? ch??? gh??p th???n"
                    onOk={() => {
                        submitCreate();
                        // canhbaoErrorModal(formRef);
                    }}
                    width={1600}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="Tho??t"
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
                                toast.error('B???n thi???u ???nh CMND');
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
                            <div className="solama">I. H??NH CH??NH:</div>
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
                                    label="H??? v?? t??n"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng kh??ng nh???p qu?? 255 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t ho???c s???'
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
                                    label="Gi???i t??nh"
                                    name="gioiTinh"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="gioiTinh"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">N???</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="???nh th???">
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
                                    label="Ng??y sinh"
                                    rules={[
                                        {
                                            type: 'object',
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ng??y sinh v?????t qu?? ng??y hi???n t???i'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Nh??m m??u ABO"
                                    name="nhomMau"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="Nh??m m??u Rh"
                                    name="nhomMau1"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau1">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="B???o hi???m y t???"
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
                                                    'S??? b???o hi???m y t??? ch??? ???????c s??? d???ng ch??? c??i v?? s???'
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
                                    label="CMND/CCCD/H??? chi???u"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 9,
                                            message: 'CMND ph???i c?? ??t nh???t 9 s???'
                                        },
                                        {
                                            max: 12,
                                            message: 'CMND kh??ng ???????c qu?? 12 s???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9 ]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'CMND ch??? ???????c s??? d???ng ch??? s???'
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
                                    label="Ng??y c???p"
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
                                                        'Ng??y c???p v?????t qu?? ng??y hi???n t???i'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    // eslint-disable-next-line prefer-promise-reject-errors
                                                    return Promise.reject(
                                                        'Ng??y c???p ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="N??i c???p"
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
                                    label="???nh CMND/CCCD m???t tr?????c"
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
                                    label="???nh CMND/CCCD m???t sau"
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
                                    label="Ngh??? nghi???p"
                                    name="ngheNghiep"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="ngheNghiep">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="Ngh??? nghi???p ghi r??"
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
                                    label="Tr??nh ????? v??n h??a"
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
                                    label="??i???n tho???i"
                                    name="dienThoai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 10,
                                            message:
                                                'Vui l???ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9+.]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng s???'
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
                                    label="??i???n tho???i kh??c"
                                    name="dienThoai1"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l???ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng s???'
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
                                                    'Email kh??ng h???p l???'
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
                            <label>?????a ch??? th?????ng tr??:</label>
                        </Row>
                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="T???nh/Th??nh Ph???"
                                    name="tinh"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropTinh()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Qu???n/Huy???n"
                                    name="quanhuyen"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropQuanHuyen()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="X??/Ph?????ng"
                                    name="xaphuong"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuong">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                    name="diaChiThuongChu"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiThuongChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <label className="my-label">?????a ch??? t???m tr??:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="T???nh/Th??nh Ph???"
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropTinhTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Qu???n/Huy???n"
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropHuyenTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="X??/Ph?????ng"
                                    name="xaphuongtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuongtt">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
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
                                    label="Gia ????nh: l?? con th??? m???y?"
                                    name="laConThuMay"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        name="laConThuMay"
                                        placeholder="VD: l?? con th??? 1 trong gia ????nh 2 con vi???t l?? 1/2"
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
                                    label="T??nh tr???ng h??n nh??n"
                                    name="tinhTrangHonNhan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tinhTrangHonNhan"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">?????c th??n</Radio>
                                        <Radio value="1">???? c?? gia ????nh</Radio>
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
                                    label="H??? t??n V???/Ch???ng"
                                    name="hoTenVoChong"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t ho???c s???'
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
                                    label="??i???n tho???i"
                                    name="dienThoaiVoChong"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???'
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
                                    label="C?? m???y con"
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
                                    label="G??i"
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
                                    label="L???n nh???t sinh n??m"
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
                                    label="Nh??? nh???t sinh n??m"
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
                                II. T??NH TR???NG B???NH L??:
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
                                    label="1.Nguy??n nh??n d???n ?????n suy th???n m???n giai ??o???n cu???i"
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
                                    label="2.Chu???n ??o??n v??? th???n h???c tr?????c ????: c?? sinh thi???t th???n"
                                    name="sinhThietThan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="sinhThietThan"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="K???t qu??? sinh thi???t"
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
                                    label="3.Ph??t hi???n suy th???n"
                                    name="ngayPhatHienSuyThan"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayPhatHienSuyThan"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ch???y th???n nh??n t???o/Th???m ph??n ph??c m???c t???"
                                    name="ngayCTNTHoacKhamThamPhanBenhLy"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayCTNTHoacKhamThamPhanBenhLy"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="S??? l???n ch???y th???n m???t tu???n"
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
                                    label="V??o ng??y"
                                    name="CTNTVaoNgay"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="CTNTVaoNgay"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Ch???n</Radio>
                                        <Radio value="0">L???</Radio>
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
                                    label="S??? gi??? m???t l???n"
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
                                    label="Chu k??? th???m ph??n ph??c m???c(s??? l???n/ng??y)"
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
                                    label="T???i b???nh vi???n"
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
                                    label="Th???m ph??n ph??c m???c b???ng m??y"
                                    name="thamPhanBangMay"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="thamPhanBangMay"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="B???nh vi???n theo d??i"
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
                                    label="Truy???n m??u"
                                    name="truyenMau"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="truyenMau"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Bao nhi??u ????n v??? m??u"
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
                                    label="Truy???n m??u l???n cu???i"
                                    name="thang"
                                >
                                    <InputNumber
                                        name="thang"
                                        placeholder="v??o th??ng"
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
                                    label="N??m"
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
                                    label="Truy???n m??u t???i b???nh vi???n"
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
                                    label="???? gh??p th???n l???n 1 v??o ng??y"
                                    name="daGhepLan1Ngay"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="daGhepLan1Ngay"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="T???i b???nh vi???n"
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
                                    label="Ng?????i cho th???n(Cha/m???/anh/ch???/em?)"
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
                                    label="Ng??y ch???y th???n nh??n t???o tr??? l???i"
                                    name="ngayChayThanTroLai"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayChayThanTroLai"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Chu???n ??o??n suy ch???c n??ng th???n gh??p"
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
                                    label="Ng??y ch???y th???n nh??n t???o/Th???m ph??n ph??c m???c"
                                    name="ctntHoacKhamThamPhan"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ctntHoacKhamThamPhan"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="T???i b???nh vi???n"
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
                                <label>S??? l?????ng n?????c ti???u/24 gi???</label>
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
                                    <div>Kh??ng</div>
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
                                    &nbsp; C??(ml/24h)
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
                                    label="Chi???u cao(cm)"
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
                                    label="C??n n???ng(kg)"
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
                                    label="Thu???c ??ang s??? d???ng/ng??y"
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
                                    label="Thu???c t???o m??u"
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
                                    label="B??c s?? ??i???u tr???"
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
                                    label="??i???n tho???i b??c s??"
                                    name="dienThoaiBacSi"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???'
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
                                4. B???nh l?? k??m theo
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
                                        Kh??ng b??? vi??m gan
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
                                        Vi??m gan si??u vi A
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
                                        Vi??m gan si??u vi B
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
                                        Vi??m gan si??u vi C
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="truocHoacSauLocMau"
                            valuePropName="checked"
                        >
                            <Radio.Group name="truocHoacSauLocMau">
                                <Radio value="1">Vi??m gan tr?????c l???c m??u</Radio>
                                <Radio value="2">Vi??m gan sau l???c m??u</Radio>
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
                                    label="??i???u tr??? vi??m gan t??? l??c n??o"
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
                                    label="Thu???c ??i???u tr??? vi??m gan"
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
                                            Kh??ng c?? ti???n c??n lao
                                        </Radio>
                                        <Radio value="1">Lao ph???i</Radio>
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
                                    label="Lao c??c c?? quan kh??c"
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiLao"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiLao"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Th???i gian ??i???u tr???/N??i ??i???u tr???"
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
                                    label="????i th??o ???????ng"
                                    name="daiThaoDuong"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daiThaoDuong"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiDaiThaoDuong"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiDaiThaoDuong"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Thu???c ??i???u tr???"
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
                                    label="T??ng huy???t ??p"
                                    name="tangHuyetAp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tangHuyetAp"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiTangHuyetAp"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiTangHuyetAp"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Thu???c ??i???u tr???"
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
                                    label="C??c b???nh kh??c"
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
                                    label="T??nh h??nh hi???n t???i"
                                    name="tinhTrang"
                                >
                                    <Input name="tinhTrang" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label className="class-b">
                                5.Ti???n c??n ngo???i khoa
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>C?? ph???u thu???t g?? tr?????c ???? kh??ng</label>
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
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Ng??y th??ng n??m ph???u thu???t"
                                    name="ngayThangPhauThuat"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayThangPhauThuat"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???u thu???t t???i b???nh vi???n"
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
                                    label="N???u c?? th?? b???nh g??"
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
                                    label="T??nh tr???ng hi???n t???i"
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
                                    label="6.Th??i quen u???ng r?????u"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="uongRuouBia"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Kh??ng</Radio>
                                        <Radio value="1">C??</Radio>
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
                                    label="S??? l???n/Tu???n"
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
                                    label="S??? l?????ng tr??n tu???n"
                                >
                                    <Input
                                        name="soLuongLan"
                                        placeholder="l??t/chai/lon/ly"
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
                                    label="7.Th??i quen h??t thu???c"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="hutThuoc"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Kh??ng</Radio>
                                        <Radio value="1">C??</Radio>
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
                                    label="S??? ??i???u tr??n ng??y"
                                >
                                    <InputNumber
                                        name="dieuTrenNgay"
                                        placeholder="??i???u/ng??y"
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
                                8. Ti???n c??n gia ????nh
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
                                    label="B???nh th???n"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="B???nh lao"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biBenhLao">
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="????i th??o ???????ng"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biDaiThaoDuong">
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??ng huy???t ??p"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biTangHuyetAp">
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Ung th??"
                                    valuePropName="checked"
                                >
                                    <Radio.Group name="biUngThu">
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="B??nh kh??c"
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
                                            S???ng c??ng ?????a ch???
                                        </Radio>
                                        <Radio value="0">
                                            Kh??ng c??ng ?????a ch???
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
                                    label="N???u c?? th?? l?? ai"
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
                                    label="T??nh tr???ng hi???n t???i"
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
                                    9. Ti???n s??? covid
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
                                        Kh??ng b??? nhi???m covid
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
                                        B??? nhi???m tr?????c ti??m
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
                                        B??? nhi???m sau ti??m
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
                                        Kh??ng c?? tri???u ch???ng
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
                                        Tri???u ch???ng nh???
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
                                        Tri???u ch???ng trung b??nh
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
                                        Nh???p vi???n
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
                                <Form.Item label="Th???i gian n???m vi???n(ng??y)">
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
                                        Th??? m??y
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
                                        Th??? HFNC
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                10. Ti??m vaccine ng???a covid
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
                                    label="Ti??m vaccine ng???a covid m??i 1"
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
                                    label="Ng??y ti??m m??i 1"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui1"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 1"
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
                                    label="Ti??m vaccine ng???a covid m??i 2"
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
                                    label="Ng??y ti??m m??i 2"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui2"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 2"
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
                                    label="Ti??m vaccine ng???a covid m??i 3"
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
                                    label="Ng??y ti??m m??i 3"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui3"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 3"
                                >
                                    <Input name="PhanUng3" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">III. Kinh t???</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nh???p c???a b???nh nh??n"
                                    className="my-label"
                                    name="thuNhapBenhNhan"
                                >
                                    <Input
                                        name="thuNhapBenhNhan"
                                        placeholder="vnd/th??ng"
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
                                    label="Thu nh???p c???a v??? ho???c ch???ng"
                                    className="my-label"
                                    name="thuNhapVoChongBenhNhan"
                                >
                                    <InputNumber
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/th??ng"
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
                                    label="Ngh??? nghi???p"
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
                                    label="Thu nh???p kh??c"
                                    className="my-label"
                                    name="thuNhapKhac"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapKhac"
                                        placeholder="vnd/th??ng"
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
                                    label="Ti???n chu???n b??? cho vi???c gh??p th???n(c?? s???n)"
                                    className="my-label"
                                    name="tienChuanBiChoViecGhepThan"
                                >
                                    <Input
                                        name="tienChuanBiChoViecGhepThan"
                                        placeholder="vnd/th??ng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">
                                IV. L?? do ????ng k?? ch??? gh??p th???n t??? ng?????i hi???n
                                ch???t n??o
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
                                        Kh??ng c?? ng?????i hi???n th???n
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
                                        Ng?????i hi???n b??? b???nh
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
                                        Ng?????i hi???n kh??ng h??a h???p nh??m m??u
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
                                    label="L?? do kh??c"
                                    className="my-label"
                                >
                                    <Input name="lyDoKhac" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <div className="solama">V. Quan h??? gia ????nh:</div>
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
                    title={`T???o m???i ????ng k?? ch??? gh??p ${TypeBoPhanConstant.GetName(
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
                                toast.error('B???n thi???u ???nh CMND');
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
                                        ????N ????NG K?? CH??? GH??P{' '}
                                        {TypeBoPhanConstant.GetName(CoQuanGhep)}{' '}
                                        T??? NG?????I HI???N CH???T N??O - NG???NG TU???N HO??N
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">I. H??NH CH??NH:</div>
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
                                    label="H??? v?? t??n"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng kh??ng nh???p qu?? 255 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t ho???c s???'
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
                                    label="Gi???i t??nh"
                                    name="gioiTinh"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="gioiTinh"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">N???</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="???nh th???">
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
                                    label="Ng??y sinh"
                                    placeholder="Vui l??ng ch???n ng??y"
                                    rules={[
                                        {
                                            type: 'object',
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ng??y sinh v?????t qu?? ng??y hi???n t???i'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ng??y sinh ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Nh??m m??u ABO"
                                    name="nhomMau"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="Nh??m m??u Rh"
                                    name="nhomMau1"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="nhomMau1">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="B???o hi???m y t???"
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
                                                    'S??? b???o hi???m y t??? ch??? ???????c s??? d???ng ch??? c??i v?? s???'
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
                                    label="CMND/CCCD/H??? chi???u"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 9,
                                            message: 'CMND ph???i c?? ??t nh???t 9 s???'
                                        },
                                        {
                                            max: 12,
                                            message: 'CMND kh??ng ???????c qu?? 12 s???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9 ]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'CMND ch??? ???????c s??? d???ng ch??? s???'
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
                                    label="Ng??y c???p"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                if (
                                                    new Date() < new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ng??y c???p v?????t qu?? ng??y hi???n t???i'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Ng??y c???p ph???i sau ng??y 1 th??ng 1 n??m 1920'
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="N??i c???p"
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
                                    label="???nh CMND/CCCD m???t tr?????c"
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
                                    label="???nh CMND/CCCD m???t sau"
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
                                    label="Ngh??? nghi???p"
                                    name="ngheNghiep"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="ngheNghiep">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="Ngh??? nghi???p b??? xung"
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
                                    label="Tr??nh ????? v??n h??a"
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
                                    label="??i???n tho???i"
                                    name="dienThoai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        },
                                        {
                                            min: 10,
                                            message:
                                                'Vui l???ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                if (/^[0-9+.]*$/.test(val)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng s???'
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
                                    label="??i???n tho???i kh??c"
                                    name="dienThoai1"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l???ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng s???'
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
                                                    'Email kh??ng h???p l???'
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

                        <label className="my-label">?????a ch??? th?????ng tr??:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="T???nh/Th??nh Ph???"
                                    name="tinh"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropTinh()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Qu???n/Huy???n"
                                    name="quanhuyen"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropQuanHuyen()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="X??/Ph?????ng"
                                    name="xaphuong"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuong">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
                                    name="diaChiThuongChu"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="diaChiThuongChu" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <label className="my-label">?????a ch??? t???m tr??:</label>

                        <Row className="form-diachithuongchu" gutter={[10, 5]}>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="T???nh/Th??nh Ph???"
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropTinhTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="Qu???n/Huy???n"
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
                                            --Ch???n--
                                        </Select.Option>
                                        {DropHuyenTT()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}}>
                                <Form.Item
                                    className="chitietdiachi"
                                    label="X??/Ph?????ng"
                                    name="xaphuongtt"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Select defaultValue="" name="xaphuongtt">
                                        <Select.Option value="">
                                            --Ch???n--
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
                                    label="S??? nh??, ph???, t??? d??n ph??? /th??n / ?????i"
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
                                    label="Gia ????nh: l?? con th??? m???y?"
                                    name="laConThuMay"
                                    rules={[]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input
                                        name="laConThuMay"
                                        placeholder="VD: l?? con th??? 1 trong gia ????nh 2 con vi???t l?? 1/2"
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
                                    label="T??nh tr???ng h??n nh??n"
                                    name="tinhTrangHonNhan"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tinhTrangHonNhan"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">?????c th??n</Radio>
                                        <Radio value="1">???? c?? gia ????nh</Radio>
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
                                    label="H??? t??n V???/Ch???ng"
                                    name="hoTenVoChong"
                                    rules={[
                                        {
                                            min: 2,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 2 k?? t???'
                                        },
                                        {
                                            max: 255,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 255 k?? t???'
                                        },
                                        () => ({
                                            validator(_, val) {
                                                const str = removeAscent(val);
                                                if (/^[a-zA-Z ]*$/.test(str)) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(
                                                    'H??? t??n kh??ng ???????c s??? d???ng k?? t??? ?????c bi???t ho???c s???'
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
                                    label="??i???n tho???i"
                                    name="dienThoaiVoChong"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???'
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
                                    label="C?? m???y con"
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
                                    label="G??i"
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
                                    label="L???n nh???t sinh n??m"
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
                                    label="Nh??? nh???t sinh n??m"
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
                                II. T??NH TR???NG B???NH L??:
                            </div>
                        </Row>
                        <Row>
                            <label className="class-b">
                                1.Nguy??n nh??n d???n ?????n b???nh hi???n t???i
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
                                2.Ph??t hi???n suy{' '}
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
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Truy???n m??u"
                                    name="truyenMau"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="truyenMau"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Bao nhi??u ????n v??? m??u"
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
                                    label="Truy???n m??u l???n cu???i"
                                    name="thang"
                                >
                                    <InputNumber
                                        name="thang"
                                        placeholder="v??o th??ng"
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
                                    label="N??m"
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
                                    label="Truy???n m??u t???i b???nh vi???n"
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
                                    label="Chi???u cao(cm)"
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
                                    label="C??n n???ng(kg)"
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
                                    label="Thu???c ??ang s??? d???ng/ng??y"
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
                                    label="Thu???c t???o m??u"
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
                                    label="B??c s?? ??i???u tr???"
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
                                    label="??i???n tho???i b??c s??"
                                    name="dienThoaiBacSi"
                                    rules={[
                                        {
                                            min: 10,
                                            message:
                                                'Vui l??ng nh???p ??t nh???t 10 k?? t???'
                                        },
                                        {
                                            max: 12,
                                            message:
                                                'Vui l??ng nh???p kh??ng qu?? 12 k?? t???'
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
                                                    'S??? ??i???n tho???i ch??? ???????c s??? d???ng ch??? s???'
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
                                3. B???nh l?? k??m theo
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
                                        Kh??ng b??? vi??m gan
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
                                        Vi??m gan si??u vi A
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
                                        Vi??m gan si??u vi B
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
                                        Vi??m gan si??u vi C
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="truocHoacSauLocMau"
                            valuePropName="checked"
                        >
                            <Radio.Group name="truocHoacSauLocMau">
                                <Radio value="1">Vi??m gan tr?????c l???c m??u</Radio>
                                <Radio value="2">Vi??m gan sau l???c m??u</Radio>
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
                                    label="??i???u tr??? vi??m gan t??? l??c n??o"
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
                                    label="Thu???c ??i???u tr??? vi??m gan"
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
                                            Kh??ng c?? ti???n c??n lao
                                        </Radio>
                                        <Radio value="1">Lao ph???i</Radio>
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
                                    label="Lao c??c c?? quan kh??c"
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiLao"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiLao"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Th???i gian ??i???u tr???/N??i ??i???u tr???"
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
                                    label="????i th??o ???????ng"
                                    name="daiThaoDuong"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="daiThaoDuong"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiDaiThaoDuong"
                                    placeholder="Vui l??ng ch???n ng??y"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiDaiThaoDuong"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Thu???c ??i???u tr???"
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
                                    label="T??ng huy???t ??p"
                                    name="tangHuyetAp"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="tangHuyetAp"
                                        defaultValue="0"
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??? l??c n??o"
                                    name="thoiGianBiTangHuyetAp"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoiGianBiTangHuyetAp"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Thu???c ??i???u tr???"
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
                                    label="C??c b???nh kh??c"
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
                                    label="T??nh h??nh hi???n t???i"
                                    name="tinhTrang"
                                >
                                    <Input name="tinhTrang" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label className="class-b">
                                4.Ti???n c??n ngo???i khoa
                            </label>
                        </Row>
                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <label>C?? ph???u thu???t g?? tr?????c ???? kh??ng</label>
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
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Ng??y th??ng n??m ph???u thu???t"
                                    name="ngayThangPhauThuat"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngayThangPhauThuat"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???u thu???t t???i b???nh vi???n"
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
                                    label="N???u c?? th?? b???nh g??"
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
                                    label="T??nh tr???ng hi???n t???i"
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
                                5.Th??i quen u???ng r?????u
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
                                        <Radio value="0">Kh??ng</Radio>
                                        <Radio value="1">C??</Radio>
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
                                    label="S??? l???n/Tu???n"
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
                                    label="S??? l?????ng tr??n tu???n"
                                >
                                    <Input
                                        name="soLuongLan"
                                        placeholder="l??t/chai/lon/ly"
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
                                    label="7.Th??i quen h??t thu???c"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="hutThuoc"
                                        defaultValue="0"
                                    >
                                        <Radio value="0">Kh??ng</Radio>
                                        <Radio value="1">C??</Radio>
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
                                    label="S??? ??i???u tr??n ng??y"
                                >
                                    <InputNumber
                                        name="dieuTrenNgay"
                                        placeholder="??i???u/ng??y"
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
                                8. Ti???n c??n gia ????nh
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
                                    label="B???nh th???n"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="B???nh lao"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="????i th??o ???????ng"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="T??ng huy???t ??p"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="Ung th??"
                                    valuePropName="checked"
                                >
                                    <Radio.Group>
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
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
                                    label="B??nh kh??c"
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
                                            S???ng c??ng ?????a ch???
                                        </Radio>
                                        <Radio value="0">
                                            Kh??ng c??ng ?????a ch???
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
                                    label="N???u c?? th?? l?? ai"
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
                                    label="T??nh tr???ng hi???n t???i"
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
                                    9. Ti???n s??? covid
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
                                        Kh??ng b??? nhi???m covid
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
                                        B??? nhi???m tr?????c ti??m
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
                                        B??? nhi???m sau ti??m
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
                                        Kh??ng c?? tri???u ch???ng
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
                                        Tri???u ch???ng nh???
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
                                        Tri???u ch???ng trung b??nh
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
                                        Nh???p vi???n
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
                                <Form.Item label="Th???i gian n???m vi???n(ng??y)">
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
                                        Th??? m??y
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
                                        Th??? HFNC
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <label
                                className="class-b"
                                style={{marginBottom: '0px'}}
                            >
                                10. Ti??m vaccine ng???a covid
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
                                    label="Ti??m vaccine ng???a covid m??i 1"
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
                                    label="Ng??y ti??m m??i 1"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui1"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 1"
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
                                    label="Ti??m vaccine ng???a covid m??i 2"
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
                                    label="Ng??y ti??m m??i 2"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui2"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 2"
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
                                    label="Ti??m vaccine ng???a covid m??i 3"
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
                                    label="Ng??y ti??m m??i 3"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="NgayTiemMui3"
                                        placeholder="Vui l??ng ch???n ng??y"
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
                                    label="Ph???n ???ng sau ti??m l???n 3"
                                >
                                    <Input name="PhanUng3" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">III. Kinh t???</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nh???p c???a b???nh nh??n"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapBenhNhan"
                                        placeholder="vnd/th??ng"
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
                                    label="Thu nh???p c???a v??? ho???c ch???ng"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/th??ng"
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
                                    label="Ngh??? nghi???p"
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
                                    label="Thu nh???p kh??c"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="thuNhapKhac"
                                        placeholder="vnd/th??ng"
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
                                    label="Ti???n chu???n b??? cho vi???c gh??p th???n(c?? s???n)"
                                    className="my-label"
                                >
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        name="tienChuanBiChoViecGhepThan"
                                        placeholder="vnd/th??ng"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <div className="solama">
                                IV. L?? DO ????NG K?? CH??? GH??P
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
                                T??? NG?????I HI???N CH???T N??O:
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
                                        Kh??ng c?? ng?????i hi???n th???n
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
                                        Ng?????i hi???n b??? b???nh
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
                                        Ng?????i hi???n kh??ng h??a h???p nh??m m??u
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
                                    label="L?? do kh??c"
                                    className="my-label"
                                >
                                    <Input name="lyDoKhac" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <div className="solama">V. Quan h??? gia ????nh:</div>
                        </Row>
                        <Row>{RenderCreateQuanHeGiaDinh()}</Row>
                        <Row>
                            <div className="solama">
                                VI. Cam k???t ????ng k?? ch??? gh??p{' '}
                                {TypeBoPhanConstant.GetName(CoQuanGhep)} t???
                                ng?????i hi???n ch???t n??o hay tim ng???ng ?????p
                            </div>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <span>
                                    Hi???n t??i b??? b???nh{' '}
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
                                    ??ang ???????c ??i???u tr??? t???i{' '}
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
                                    , c?? ch??? ?????nh gh??p{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)}.
                                    T??i ???? ???????c c??c b??c s?? ph??? tr??ch gi???i th??ch
                                    r?? v??? c??c b?????c th???c hi???n ????nh gi?? t??nh tr???ng
                                    s???c kh???e chung, th???c hi???n qu?? tr??nh tuy???n
                                    ch???n, th???i gian ch??? ?????i, t??c d???ng ph??? c???a
                                    thu???c ???c ch??? mi???n d???ch ??i???u tr??? sau gh??p{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)},
                                    chi ph?? gh??p{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)},
                                    chu???n b??? m??i tr?????ng v?? c??ch sinh ho???t sau
                                    khi ???????c gh??p{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)}.
                                    T??i xin ???????c ????ng k?? v??o danh s??ch ch??? gh??p{' '}
                                    {TypeBoPhanConstant.GetName(CoQuanGhep)} t???
                                    ng?????i hi???n ch???t n??o hay tim ng???ng ?????p t???i
                                    B???nh vi???n Ch??? R???y, t??i cam k???t tu??n th??? c??c
                                    quy ?????nh trong qu?? tr??nh ??i???u tr??? b???nh tr?????c
                                    v?? sau gh??p{' '}
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
                ten: 'Th???n',
                type: 'than'
            },
            {
                ten: 'Tim',
                type: 'tim'
            },
            {
                ten: 'Ph???i',
                type: 'phoi'
            },
            {
                ten: 'Gi??c M???c',
                type: 'giacmac'
            },
            {
                ten: 'Gan',
                type: 'gan'
            },
            {
                ten: 'Tu???',
                type: 'tuy'
            },
            {
                ten: 'Ru???t',
                type: 'ruot'
            },
            {
                ten: 'Da',
                type: 'da'
            },
            {
                ten: 'Chi th???',
                type: 'chithe'
            }
        ];
        return (
            <Modal
                title="Ch???n c?? quan ????ng k?? ch??? gh??p"
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
                                    T???o ????ng k?? ch??? gh??p {item.ten}
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
