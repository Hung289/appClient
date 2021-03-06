/* eslint-disable dot-notation */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef} from 'react';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    NotFoundUserImage,
    NotFoundCMNDImage
} from '@modules/Common/NotFoundUser';
import * as LoadDiachi from '@modules/Common/LoadDiachi';

import * as DuLieuDanhMuc from '@app/services/duLieuDanhMucService';
import $ from 'jquery';

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
import moment from 'moment';
import {Link, useHistory} from 'react-router-dom';

import {toast} from 'react-toastify';
import * as dangKyChoGhepTangService from '@app/services/dangKyChoGhepTangService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {connect} from 'react-redux';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    DANGKYCHOGHEPTANG_CHANGESTATUS_CLOSE,
    DANGKYCHOGHEPTANG_CLOSE_VIEWDETAIL,
    DANGKYCHOGHEPTANG_CLOSE_VIEWEDIT,
    DANGKYCHOGHEPTANG_EDIT_CLOSE,
    DANGKYCHOGHEPTANG_SEARCH_SAVE,
    DANGKYCHOGHEPTANG_CLOSE_CREATE,
    DANGKYCHOGHEPTANG_OPEN_CREATE,
    DANGKYCHOGHEPTANG_THONGBAOXN_CLOSE
} from '@app/store/ActionType/DangKyChoGhepTangTypeAction';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';
import * as TypeBoPhanConstant from '@modules/Common/TypeBoPhanConstant';

import AdminSecsionHead from '../AdminSecsionHead';
import {
    ChuyenGiaTien,
    removeAscent,
    canhbaoErrorModal
} from '../../Common/CommonUtility';
import DangKyChoGhepTangCreateAdm from './DangKyChoGhepTangCreateAdm';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const DangKyChoGhepTangEditAdm = (props) => {
    const formCreateEntity = useRef(null);
    const formRef = useRef();
    let FileSelected = useRef();
    let FileSelectedCMNDMT = useRef(null);
    let FileSelectedCMNDMs = useRef(null);
    const dataGiaDinh = useRef([]);
    const [NgheNghiep, setNgheNghiep] = useState([]);
    const [NhomMau, setNhomMau] = useState([]);
    const [NhomMauRh, setNhomMauRh] = useState([]);
    const [Tinh, setTinh] = useState([]);
    const [TinhTT, setTinhTT] = useState([]);
    const [QHGD, setQHGD] = useState([]);

    const dataGiaDinhEdit = useRef([]);
    const {
        typeCreate,
        onCloseEntityEditModal,
        entityObj,
        // onSaveEditEntity,
        IsShowEditPopup,
        OnLoadingAction,
        onReloadPage
    } = props;

    const onSaveEditEntity = (tintuc) => {
        OnLoadingAction(true);
        dangKyChoGhepTangService.EditNewEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                onCloseEntityEditModal();
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
        const isChecked = $('#NhiemCovid').prop('checked');
        if (isChecked === true) {
            $('#BiTruocTiem').prop('checked', false);
            $('#BiSauTiem').prop('checked', false);
            $('#CoTrieuChung').prop('checked', false);
            $('#TrieuChungNhe').prop('checked', null);
            $('#TrieuChungtrungBinh').prop('checked', null);
            $('#NhapVien').prop('checked', null);
            $('#ThoMay').prop('checked', null);
            $('#ThoHFNC').prop('checked', null);
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

    const RenderEditQuanHeGiaDinh = () => {
        const [lstAnhChiEm, setLstAnhChiEm] = useState(entityObj.QhGd);
        useEffect(() => {
            dataGiaDinhEdit.current = entityObj.QhGd;
        }, []);
        const handleChange = (event, id) => {
            const {name} = event.target;
            const newItem = [...lstAnhChiEm];
            newItem[id] = {...newItem[id], [name]: event.target.value};
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
        };

        const DeleteItem = (ind) => {
            const newItem = [...lstAnhChiEm];
            newItem.splice(ind, 1);
            setLstAnhChiEm(newItem);
            dataGiaDinhEdit.current = lstAnhChiEm;
            toast.info('X??a th??nh c??ng');
        };
        return (
            <div style={{width: '100%'}}>
                <div>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            const NewItem = [...lstAnhChiEm, {}];

                            setLstAnhChiEm(NewItem);
                        }}
                    >
                        <i className="fas fa-plus" /> Th??m th??ng tin quan h??? gia
                        ????nh
                    </Button>
                </div>
                {lstAnhChiEm &&
                    lstAnhChiEm.map((item, key) => {
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
                                                label="?????a ch??? th?????ng ch??"
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

    function EditModal() {
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.Tinh === null ? '' : entityObj.Tinh,
            quanhuyen: entityObj.QuanHuyen === null ? '' : entityObj.QuanHuyen,
            tinhtt: entityObj.Tinhtt === null ? '' : entityObj.Tinhtt,
            quanhuyentt:
                entityObj.QuanHuyentt === null ? '' : entityObj.QuanHuyentt
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
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    visible={
                        IsShowEditPopup &&
                        entityObj.TypePhieuDKGhepTang ===
                            TypeBoPhanConstant.than
                    }
                    onCancel={() => onCloseEntityEditModal()}
                    width={1600}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="Tho??t"
                    title="C???p nh???t ????ng k?? ch??? gh??p Th???n"
                >
                    <Form
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            id: entityObj.Id,
                            typePhieuDKGhepTang: entityObj.TypePhieuDKGhepTang,
                            hoTenBN: entityObj.HoTenBN,
                            tinh: entityObj.Tinh,
                            xaphuong: entityObj.XaPhuong,
                            quanhuyen: entityObj.QuanHuyen,
                            tinhtt: entityObj.Tinhtt,
                            xaphuongtt: entityObj.XaPhuongtt,
                            quanhuyentt: entityObj.QuanHuyentt,
                            gioiTinh: String(entityObj.GioiTinh),
                            ngaySinh:
                                entityObj.NgaySinh !== null
                                    ? moment(entityObj.NgaySinh)
                                    : '',
                            nhomMau: entityObj.NhomMau,
                            nhomMau1: entityObj.NhomMau1,
                            baoHiemYTe: entityObj.BaoHiemYTe,
                            CMNDBN: entityObj.CMNDBN,
                            NgayCapCMNDBN:
                                entityObj.NgayCapCMNDBN !== null
                                    ? moment(entityObj.NgayCapCMNDBN)
                                    : '',
                            NoiCapCMNDBN: entityObj.NoiCapCMNDBN,
                            ngheNghiep: entityObj.NgheNghiep,
                            ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                            trinhDoVanHoa: entityObj.TrinhDoVanHoa,
                            dienThoai: entityObj.DienThoai,
                            dienThoai1: entityObj.DienThoai1,
                            diaChiThuongChu: entityObj.DiaChiThuongChu,
                            diaChiTamChu: entityObj.DiaChiTamChu,
                            laConThuMay: entityObj.LaConThuMay,
                            tinhTrangHonNhan: String(
                                entityObj.TinhTrangHonNhan
                            ),
                            hoTenVoChong: entityObj.HoTenVoChong,
                            dienThoaiVoChong: entityObj.DienThoaiVoChong,
                            coMayCon: entityObj.CoMayCon,
                            soConTrai: entityObj.SoConTrai,
                            soConGai: entityObj.SoConGai,
                            lonNhatSinhNam: entityObj.LonNhatSinhNam,
                            nhoNhatSinhNam: entityObj.NhoNhatSinhNam,
                            tienCanGiaDinh: entityObj.TienCanGiaDinh,
                            tienCanBanThan: entityObj.TienCanBanThan,
                            nguyenNhanSuyThan: entityObj.NguyenNhanSuyThan,
                            chuanDoanSuyThanGhep:
                                entityObj.ChuanDoanSuyThanGhep,
                            benhSu: entityObj.BenhSu,
                            thuocTriViemGan: entityObj.ThuocTriViemGan,
                            sinhThietThan: String(entityObj.SinhThietThan),
                            ketQuaSinhThietThan: entityObj.KetQuaSinhThietThan,
                            ngayPhatHienSuyThan:
                                entityObj.NgayPhatHienSuyThan !== null
                                    ? moment(entityObj.NgayPhatHienSuyThan)
                                    : '',
                            ngayCTNTHoacKhamThamPhanBenhLy:
                                entityObj.NgayCTNTHoacKhamThamPhanBenhLy !==
                                undefined
                                    ? moment(
                                          entityObj.NgayCTNTHoacKhamThamPhanBenhLy
                                      )
                                    : '',
                            dieuTriViemGanTu: entityObj.DieuTriViemGanTu,
                            CTNTVaoNgay: String(entityObj.CTNTVaoNgay),
                            soGioTrenLan:
                                entityObj.SoGioTrenLan !== null
                                    ? entityObj.SoGioTrenLan
                                    : '',
                            soLanCTNTTuan:
                                entityObj.SoLanCTNTTuan !== null
                                    ? entityObj.SoLanCTNTTuan
                                    : '',
                            chuKyThamPhan:
                                entityObj.ChuKyThamPhan !== null
                                    ? entityObj.ChuKyThamPhan
                                    : '',
                            chuKyThamPhanTaiBV:
                                entityObj.ChuKyThamPhanTaiBV !== null
                                    ? entityObj.ChuKyThamPhanTaiBV
                                    : '',
                            thamPhanBangMay: String(entityObj.ThamPhanBangMay),
                            thamPhanBangMayTaiBV:
                                entityObj.ThamPhanBangMayTaiBV,
                            truyenMau: String(entityObj.TruyenMau),
                            baoNhieuDonViMau: entityObj.BaoNhieuDonViMau,
                            thang:
                                entityObj.Thang !== null ? entityObj.Thang : '',
                            nam: entityObj.Nam !== null ? entityObj.Nam : '',
                            benhVienTruyenMau: entityObj.BenhVienTruyenMau,
                            daGhepLan1Ngay:
                                entityObj.DaGhepLan1Ngay !== null
                                    ? moment(entityObj.DaGhepLan1Ngay)
                                    : '',
                            daGhepLan1TaiBV: entityObj.DaGhepLan1TaiBV,
                            nguoiChoThan: entityObj.NguoiChoThan,
                            ngayChayThanTroLai:
                                entityObj.NgayChayThanTroLai !== null
                                    ? moment(entityObj.NgayChayThanTroLai)
                                    : '',
                            chayThanTroLaiTaiBV: entityObj.ChayThanTroLaiTaiBV,
                            ctntHoacKhamThamPhan:
                                entityObj.CTNTHoacKhamThamPhan !== null
                                    ? moment(entityObj.CTNTHoacKhamThamPhan)
                                    : '',
                            ctntVaoNgayThuMay: entityObj.CTNTVaoNgayThuMay,
                            caCTNT: entityObj.CaCTNT,
                            chieuCao: entityObj.ChieuCao,
                            canNang: entityObj.CanNang,
                            nuocTieu24h: String(entityObj.NuocTieu24h),
                            soLuongNuocTieu24h: entityObj.SoLuongNuocTieu24h,
                            thuocDangSuDungNgay: entityObj.ThuocDangSuDungNgay,
                            thoiGianBiTangHuyetAp:
                                entityObj.ThoiGianBiTangHuyetAp !== null
                                    ? moment(entityObj.ThoiGianBiTangHuyetAp)
                                    : '',
                            thuocTaoMau: entityObj.ThuocTaoMau,
                            bacSiDieuTri: entityObj.BacSiDieuTri,
                            dienThoaiBacSi: entityObj.DienThoaiBacSi,
                            khongBiViemGan: entityObj.KhongBiViemGan,
                            viemGanSieuViA: entityObj.ViemGanSieuViA,
                            viemGanSieuViB: entityObj.ViemGanSieuViB,
                            viemGanSieuViC: entityObj.ViemGanSieuViC,
                            truocHoacSauLocMau: String(
                                entityObj.TruocHoacSauLocMau
                            ),
                            tangHuyetAp: String(entityObj.TangHuyetAp),
                            daiThaoDuong: String(entityObj.DaiThaoDuong),
                            thoiGianBiDaiThaoDuong:
                                entityObj.ThoiGianBiDaiThaoDuong !== null
                                    ? moment(entityObj.ThoiGianBiDaiThaoDuong)
                                    : '',
                            thuocDieuTriDaiThaoDuong:
                                entityObj.ThuocDieuTriDaiThaoDuong,
                            tinhTrang: entityObj.TinhTrang,
                            laoPhoi: String(entityObj.LaoPhoi),
                            hutThuoc: String(entityObj.HutThuoc),
                            dieuTrenNgay:
                                entityObj.DieuTrenNgay !== null
                                    ? entityObj.DieuTrenNgay
                                    : '',
                            uongRuouBia: String(entityObj.UongRuouBia),
                            soLanTuan:
                                entityObj.SoLanTuan !== null
                                    ? entityObj.SoLanTuan
                                    : '',
                            soLuongLan: entityObj.SoLuongLan,
                            benhKhac: entityObj.BenhKhac,
                            laoCoQuanKhac: entityObj.LaoCoQuanKhac,
                            thoiGianBiLao:
                                entityObj.ThoiGianBiLao !== null
                                    ? moment(entityObj.ThoiGianBiLao)
                                    : '',
                            thoiGianDieuTriAndNoiDieuTri:
                                entityObj.ThoiGianDieuTriAndNoiDieuTri,
                            namPhatHien: entityObj.NamPhatHien,
                            dieuTriTaiBV: entityObj.DieuTriTaiBV,
                            thoiGianDieuTri: entityObj.ThoiGianDieuTri,
                            thuocDieuTri: entityObj.ThuocDieuTri,
                            daPhauThuat: String(entityObj.DaPhauThuat),
                            coPhauThuat: entityObj.CoPhauThuat,
                            tinhTrangHienTai: entityObj.TinhTrangHienTai,
                            ngayThangPhauThuat:
                                entityObj.NgayThangPhauThuat !== null
                                    ? moment(entityObj.NgayThangPhauThuat)
                                    : '',
                            benhVienPhauThuat: entityObj.BenhVienPhauThuat,
                            biBenhThan: String(entityObj.BiBenhThan),
                            biBenhLao: String(entityObj.BiBenhLao),
                            biDaiThaoDuong: String(entityObj.BiDaiThaoDuong),
                            biTangHuyetAp: String(entityObj.BiTangHuyetAp),
                            biUngThu: String(entityObj.BiUngThu),
                            songCungDiaChi: String(entityObj.SongCungDiaChi),
                            biBenhKhac: entityObj.BiBenhKhac,
                            nguoiThanBiBenh: entityObj.NguoiThanBiBenh,
                            thuNhapBenhNhan: entityObj.ThuNhapBenhNhan,
                            tinhTrangBenhNguoiThanHienTai:
                                entityObj.TinhTrangBenhNguoiThanHienTai,
                            thuNhapVoChongBenhNhan:
                                entityObj.ThuNhapVoChongBenhNhan,
                            ngheNghiepVoChong: entityObj.NgheNghiepVoChong,
                            thuNhapKhac: entityObj.ThuNhapKhac,
                            tienChuanBiChoViecGhepThan:
                                entityObj.TienChuanBiChoViecGhepThan,
                            khongCoNguoiNhan: entityObj.KhongCoNguoiNhan,
                            nguoiChoBiBenh: entityObj.NguoiChoBiBenh,
                            nguoiChoKhongHoaHopMau:
                                entityObj.NguoiChoKhongHoaHopMau,
                            lyDoKhac: entityObj.LyDoKhac,
                            email: entityObj.Email,
                            maso: entityObj.MaSo,
                            ghichu: entityObj.GhiChu,
                            namsinh: entityObj.NamSinh,
                            ngaydkhien:
                                entityObj.NgayDKHien !== null
                                    ? moment(entityObj.NgayDKHien)
                                    : '',
                            namdk: entityObj.NamDK,
                            thoigianbhyt: entityObj.thoigianBHYT,
                            chisobmi: entityObj.chisoBMI,
                            nambatdaudieutri: entityObj.nambatdaudieutri,
                            sonamdieutrithaythe: entityObj.sonamdieutrithaythe,
                            CAPD: entityObj.CAPD,
                            sanhconlancuoivaonam:
                                entityObj.sanhconlancuoivaonam,
                            sanhconmaylan: entityObj.sanhconmaylan,
                            benhlyhethongduongtietnieu:
                                entityObj.benhlyhethongduongtietnieu,
                            benhlytimmach: entityObj.benhlytimmach,
                            THA: entityObj.THA,
                            tiencanngoaikhoakhac:
                                entityObj.tiencanngoaikhoakhac,
                            ngoaitietnieu: entityObj.ngoaitietnieu,
                            ngoaitongquat: entityObj.ngoaitongquat,
                            thoidiemtruyenmau:
                                entityObj.thoidiemtruyenmau !== null
                                    ? moment(entityObj.thoidiemtruyenmau)
                                    : '',
                            namphathienctnttrolai:
                                entityObj.namphathienctnttrolai,
                            hoatri: entityObj.hoatri,
                            xatri: entityObj.xatri,
                            phauthuat: entityObj.phauthuat,
                            NhiemCovid: entityObj.NhiemCovid,
                            BiTruocTiem: entityObj.BiTruocTiem,
                            BiSauTiem: entityObj.BiSauTiem,
                            CoTrieuChung: entityObj.CoTrieuChung,
                            TrieuChungNhe: entityObj.TrieuChungNhe,
                            TrieuChungtrungBinh: entityObj.TrieuChungtrungBinh,
                            NhapVien: entityObj.NhapVien,
                            ThoiGianNamVien: entityObj.ThoiGianNamVien,
                            ThoMay: entityObj.ThoMay,
                            ThoHFNC: entityObj.ThoHFNC,
                            TiemVaccine: entityObj.TiemVaccine,
                            NgayTiemMui1:
                                entityObj.NgayTiemMui1 !== null
                                    ? moment(entityObj.NgayTiemMui1)
                                    : '',
                            NgayTiemMui2:
                                entityObj.NgayTiemMui2 !== null
                                    ? moment(entityObj.NgayTiemMui2)
                                    : '',
                            PhanUng: entityObj.PhanUng,
                            TiemVaccine2: entityObj.TiemVaccine2,
                            PhanUng2: entityObj.PhanUng2,
                            NgayTiemMui3:
                                entityObj.NgayTiemMui3 !== null
                                    ? moment(entityObj.NgayTiemMui3)
                                    : '',
                            TiemVaccine3: entityObj.TiemVaccine3,
                            PhanUng3: entityObj.PhanUng3
                        }}
                    >
                        <Form.Item name="id" hidden>
                            <Input name="id" id="id" type="hidden" />
                        </Form.Item>
                        <Form.Item name="typePhieuDKGhepTang" hidden="true">
                            <Input
                                name="typePhieuDKGhepTang"
                                id="typePhieuDKGhepTang"
                                type="hidden"
                            />
                        </Form.Item>

                        <Row>
                            <div className="solama">I. H??NH CH??NH:</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
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
                                        }
                                    ]}
                                    name="hoTenBN"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="hoTenBN" />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="M?? s??? b???nh nh??n"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    name="maso"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="maso" />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    className="my-label"
                                    label="Gi???i t??nh"
                                    name="gioiTinh"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="gioiTinh"
                                        defaultValue={
                                            entityObj.GioiTinh !== undefined
                                                ? String(entityObj.GioiTinh)
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">Nam</Radio>
                                        <Radio value="0">N???</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="???nh">
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
                                <Form.Item
                                    label="???nh th??? c??"
                                    className="my-label"
                                >
                                    <div>
                                        <>
                                            <img
                                                className="imgHinhAnhAccount"
                                                src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                alt=""
                                                onError={NotFoundUserImage}
                                            />
                                        </>
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="???nh th??? m???i"
                                    className="my-label"
                                >
                                    <img id="Avatar" alt="" />
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="baoHiemYTe" />
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
                                    label="Ng??y ????ng k??"
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
                                    name="ngaydkhien"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngaydkhien"
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
                                    label="Th???i gian ????ng k?? BHYT"
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
                                                        'Th???i gian ????ng k?? v?????t qu?? ng??y hi???n t???i'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Th???i gian ????ng k?? ph???i sau ng??y 1 th??ng 1 n??m 1920'
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    name="thoigianbhyt"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoigianbhyt"
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
                                    label="CMND/CCCD/H??? chi???u"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t tr?????c c??"
                                >
                                    <img
                                        className="imgCMND"
                                        src={`${Constant.PathServer}/${entityObj.ImgCMNDBNMatTruoc}`}
                                        alt=""
                                        onError={NotFoundImage}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t tr?????c m???i"
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatTruoc"
                                        alt=""
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t sau c??"
                                >
                                    <img
                                        className="imgCMND"
                                        alt=""
                                        src={`${Constant.PathServer}/${entityObj.ImgCMNDBNMatSau}`}
                                        onError={NotFoundImage}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t sau m???i"
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatSau"
                                        alt=""
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
                                <Form.Item
                                    className="my-label"
                                    label="Ngh??? nghi???p"
                                    name="ngheNghiep"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                        }
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
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
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
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
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
                                        min={1920}
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
                                        min={1920}
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
                                    <Input name="soLanCTNTTuan" />
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
                                    name="nam"
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
                                <Form.Item
                                    label="S??? l?????ng n?????c ti???u/24 gi???"
                                    className="my-label"
                                />
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
                                        max={800}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 6}}
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
                                md={{span: 6}}
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
                                md={{span: 12}}
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
                                md={{span: 6}}
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
                                md={{span: 6}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <label>C?? ph???u thu???t g?? tr?????c ???? kh??ng</label>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 6}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLanTuan"
                                    label="S??? l???n/Tu???n"
                                >
                                    <InputNumber
                                        name="soLanTuan"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 6}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhThan"
                                    label="B???nh th???n"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="biBenhThan"
                                        defaultValue={
                                            entityObj.BiBenhThan !== undefined
                                                ? String(entityObj.BiBenhThan)
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhLao"
                                    label="B???nh lao"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biDaiThaoDuong"
                                    label="????i th??o ???????ng"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biTangHuyetAp"
                                    label="T??ng huy???t ??p"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="biTangHuyetAp"
                                        defaultValue={
                                            entityObj.BiTangHuyetAp !==
                                            undefined
                                                ? String(
                                                      entityObj.BiTangHuyetAp
                                                  )
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biUngThu"
                                    label="Ung th??"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="biUngThu"
                                        defaultValue={
                                            entityObj.BiUngThu !== undefined
                                                ? String(entityObj.BiUngThu)
                                                : String(0)
                                        }
                                    >
                                        <Radio value="1">C??</Radio>
                                        <Radio value="0">Kh??ng</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="songCungDiaChi"
                                    valuePropName="checked"
                                >
                                    <Radio.Group
                                        name="songCungDiaChi"
                                        defaultValue={
                                            entityObj.SongCungDiaChi !==
                                            undefined
                                                ? String(
                                                      entityObj.SongCungDiaChi
                                                  )
                                                : String(0)
                                        }
                                    >
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                    9. Th??ng tin b??? sung
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="chisobmi"
                                    label="Ch??? s??? BMI (%)"
                                >
                                    <InputNumber
                                        name="chisobmi"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="nambatdaudieutri"
                                    label="N??m b???t ?????u ??i???u tr???"
                                >
                                    <InputNumber
                                        name="nambatdaudieutri"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="sonamdieutrithaythe"
                                    label="S??? n??m ??i???u tr??? thay th???"
                                >
                                    <InputNumber
                                        name="sonamdieutrithaythe"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="sanhconmaylan"
                                    label="Sanh con l???n m???y"
                                >
                                    <InputNumber
                                        name="sanhconmaylan"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="sanhconlancuoivaonam"
                                    label="Sanh con l???n cu???i v??o n??m"
                                >
                                    <InputNumber
                                        name="sanhconlancuoivaonam"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ngoaitongquat"
                                    label="Ngo???i t???ng qu??t"
                                >
                                    <Input name="ngoaitongquat" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="ngoaitietnieu"
                                    label="Ngo???i ti???t ni???u"
                                >
                                    <Input name="ngoaitietnieu" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="tiencanngoaikhoakhac"
                                    label="Ti???n c??n ngo???i khoa kh??c"
                                >
                                    <Input name="tiencanngoaikhoakhac" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="thoidiemtruyenmau"
                                    label="Th???i ??i???m truy???n m??u"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoidiemtruyenmau"
                                        placeholder="Vui l??ng ch???n ng??y"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 4}}
                                sm={{span: 8}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="namphathienctnttrolai"
                                    label="N??m ph??t hi???n CTNT tr??? l???i"
                                >
                                    <InputNumber
                                        name="namphathienctnttrolai"
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Th??ng tin ph???u thu???t"
                                    name="phauthuat"
                                >
                                    <Input name="phauthuat" />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="xatri"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="xatri" id="xatri">
                                        X??? tr???
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="hoatri"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="hoatri" id="hoatri">
                                        H??a tr???
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="benhlyhethongduongtietnieu"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="benhlyhethongduongtietnieu"
                                        id="benhlyhethongduongtietnieu"
                                    >
                                        B???nh l?? h??? th???ng ???????ng ti???t ni???u
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="benhlytimmach"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        name="benhlytimmach"
                                        id="benhlytimmach"
                                    >
                                        B???nh l?? tim m???ch
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="THA"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="THA" id="THA">
                                        THA
                                    </Checkbox>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    name="CAPD"
                                    style={{marginBottom: '0px'}}
                                    valuePropName="checked"
                                >
                                    <Checkbox name="CAPD" id="CAPD">
                                        CAPD
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
                                <div
                                    className="class-b"
                                    style={{marginBottom: '0px'}}
                                >
                                    10. Ti???n s??? covid
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[10, 0]}>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                11. Ti??m vaccine ng???a covid
                            </label>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 8}}
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nh???p c???a v??? ho???c ch???ng"
                                    className="my-label"
                                >
                                    <Input
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/th??ng"
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nh???p kh??c"
                                    className="my-label"
                                >
                                    <Input
                                        name="thuNhapKhac"
                                        placeholder="vnd/th??ng"
                                    />
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 12}}
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Ti???n chu???n b??? cho vi???c gh??p th???n(c?? s???n)"
                                    className="my-label"
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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

                        <div className="col-md-12 no-padding">
                            <div className="solama">V. QUAN H??? GIA ????NH:</div>
                            {RenderEditQuanHeGiaDinh()}
                        </div>

                        <Row>
                            <div className="solama">
                                VI. Cam k???t ????ng k?? ch??? gh??p th???n t??? ng?????i hi???n
                                ch???t n??o hay tim ng???ng ?????p
                            </div>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                Hi???n t??i b??? b???nh suy th???n m???n giai ??o???n cu???i
                                ??ang ph???i l???c m??u ?????nh k???, c?? ch??? ?????nh gh??p
                                th???n. T??i ???? ???????c c??c b??c s?? ph??? tr??ch gi???i
                                th??ch r?? v??? c??c b?????c th???c hi???n ????nh gi?? t??nh
                                tr???ng s???c kh???e chung, th???c hi???n qu?? tr??nh tuy???n
                                ch???n, th???i gian ch??? ?????i, t??c d???ng ph??? c???a thu???c
                                ???c ch??? mi???n d???ch ??i???u tr??? sau gh??p th???n, chi ph??
                                gh??p th???n, chu???n b??? m??i tr?????ng v?? c??ch sinh ho???t
                                sau khi ???????c gh??p th???n???.. T??i xin ???????c ????ng k??
                                v??o danh s??ch ch??? gh??p th???n t??? ng?????i hi???n ch???t
                                n??o hay tim ng???ng ?????p t???i B???nh vi???n Ch??? R???y, t??i
                                cam k???t tu??n th??? c??c quy ?????nh trong qu?? tr??nh
                                ??i???u tr??? b???nh tr?????c v?? sau gh??p th???n.
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
    function EditModalKhac() {
        const submitEdit = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        const [loaddiachi, setloaddiachi] = useState({
            tinh: entityObj.Tinh === null ? '' : entityObj.Tinh,
            quanhuyen: entityObj.QuanHuyen === null ? '' : entityObj.QuanHuyen,
            tinhtt: entityObj.Tinhtt === null ? '' : entityObj.Tinhtt,
            quanhuyentt:
                entityObj.QuanHuyentt === null ? '' : entityObj.QuanHuyentt
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
                        IsShowEditPopup &&
                        entityObj.TypePhieuDKGhepTang !==
                            TypeBoPhanConstant.than
                    }
                    onCancel={() => onCloseEntityEditModal()}
                    width={1600}
                    zIndex={1040}
                    okText="Ho??n th??nh"
                    cancelText="Tho??t"
                    title={`C???p nh???t ????ng k?? ch??? gh??p  ${TypeBoPhanConstant.GetName(
                        entityObj.TypePhieuDKGhepTang
                    )}`}
                >
                    <Form
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        layout="vertical"
                        initialValues={{
                            id: entityObj.Id,
                            typePhieuDKGhepTang: entityObj.TypePhieuDKGhepTang,
                            hoTenBN: entityObj.HoTenBN,
                            tinh: entityObj.Tinh,
                            xaphuong: entityObj.XaPhuong,
                            quanhuyen: entityObj.QuanHuyen,
                            tinhtt: entityObj.Tinhtt,
                            xaphuongtt: entityObj.XaPhuongtt,
                            quanhuyentt: entityObj.QuanHuyentt,
                            gioiTinh: String(entityObj.GioiTinh),
                            ngaySinh:
                                entityObj.NgaySinh !== null
                                    ? moment(entityObj.NgaySinh)
                                    : '',
                            nhomMau: entityObj.NhomMau,
                            nhomMau1: entityObj.NhomMau1,
                            baoHiemYTe: entityObj.BaoHiemYTe,
                            CMNDBN: entityObj.CMNDBN,
                            NgayCapCMNDBN:
                                entityObj.NgayCapCMNDBN !== null
                                    ? moment(entityObj.NgayCapCMNDBN)
                                    : '',
                            NoiCapCMNDBN: entityObj.NoiCapCMNDBN,
                            ngheNghiep: entityObj.NgheNghiep,
                            ngheNhiepBoSung: entityObj.NgheNhiepBoSung,
                            trinhDoVanHoa: entityObj.TrinhDoVanHoa,
                            dienThoai: entityObj.DienThoai,
                            dienThoai1: entityObj.DienThoai1,
                            diaChiThuongChu: entityObj.DiaChiThuongChu,
                            diaChiTamChu: entityObj.DiaChiTamChu,
                            laConThuMay: entityObj.LaConThuMay,
                            tinhTrangHonNhan: String(
                                entityObj.TinhTrangHonNhan
                            ),
                            hoTenVoChong: entityObj.HoTenVoChong,
                            dienThoaiVoChong: entityObj.DienThoaiVoChong,
                            coMayCon: entityObj.CoMayCon,
                            soConTrai: entityObj.SoConTrai,
                            soConGai: entityObj.SoConGai,
                            lonNhatSinhNam: entityObj.LonNhatSinhNam,
                            nhoNhatSinhNam: entityObj.NhoNhatSinhNam,
                            nguyenNhanSuyThan: entityObj.NguyenNhanSuyThan,
                            thuocTriViemGan: entityObj.ThuocTriViemGan,
                            ngayPhatHienSuyThan:
                                entityObj.NgayPhatHienSuyThan !== null
                                    ? moment(entityObj.NgayPhatHienSuyThan)
                                    : '',
                            dieuTriViemGanTu: entityObj.DieuTriViemGanTu,
                            truyenMau: String(entityObj.TruyenMau),
                            baoNhieuDonViMau: entityObj.BaoNhieuDonViMau,
                            thang:
                                entityObj.Thang !== null ? entityObj.Thang : '',
                            nam: entityObj.Nam !== null ? entityObj.Nam : '',
                            benhVienTruyenMau: entityObj.BenhVienTruyenMau,
                            chieuCao: entityObj.ChieuCao,
                            canNang: entityObj.CanNang,
                            thuocDangSuDungNgay: entityObj.ThuocDangSuDungNgay,
                            thoiGianBiTangHuyetAp:
                                entityObj.ThoiGianBiTangHuyetAp !== null
                                    ? moment(entityObj.ThoiGianBiTangHuyetAp)
                                    : '',
                            thuocTaoMau: entityObj.ThuocTaoMau,
                            bacSiDieuTri: entityObj.BacSiDieuTri,
                            dienThoaiBacSi: entityObj.DienThoaiBacSi,
                            viemGanSieuViA: entityObj.ViemGanSieuViA,
                            truocHoacSauLocMau: String(
                                entityObj.TruocHoacSauLocMau
                            ),
                            tangHuyetAp: String(entityObj.TangHuyetAp),
                            daiThaoDuong: String(entityObj.DaiThaoDuong),
                            thoiGianBiDaiThaoDuong:
                                entityObj.ThoiGianBiDaiThaoDuong !== null
                                    ? moment(entityObj.ThoiGianBiDaiThaoDuong)
                                    : '',
                            thuocDieuTriDaiThaoDuong:
                                entityObj.ThuocDieuTriDaiThaoDuong,
                            tinhTrang: entityObj.TinhTrang,
                            laoPhoi: String(entityObj.LaoPhoi),
                            hutThuoc: String(entityObj.HutThuoc),
                            dieuTrenNgay:
                                entityObj.DieuTrenNgay !== null
                                    ? entityObj.DieuTrenNgay
                                    : '',
                            uongRuouBia: String(entityObj.UongRuouBia),
                            soLanTuan:
                                entityObj.SoLanTuan !== null
                                    ? entityObj.SoLanTuan
                                    : '',
                            soLuongLan: entityObj.SoLuongLan,
                            laoCoQuanKhac: entityObj.LaoCoQuanKhac,
                            thoiGianBiLao:
                                entityObj.ThoiGianBiLao !== null
                                    ? moment(entityObj.ThoiGianBiLao)
                                    : '',
                            thoiGianDieuTriAndNoiDieuTri:
                                entityObj.ThoiGianDieuTriAndNoiDieuTri,

                            thuocDieuTri: entityObj.ThuocDieuTri,
                            daPhauThuat: String(entityObj.DaPhauThuat),
                            coPhauThuat: entityObj.CoPhauThuat,
                            tinhTrangHienTai: entityObj.TinhTrangHienTai,
                            ngayThangPhauThuat:
                                entityObj.NgayThangPhauThuat !== null
                                    ? moment(entityObj.NgayThangPhauThuat)
                                    : '',
                            benhVienPhauThuat: entityObj.BenhVienPhauThuat,
                            biBenhThan: String(entityObj.BiBenhThan),
                            biBenhLao: String(entityObj.BiBenhLao),
                            biDaiThaoDuong: String(entityObj.BiDaiThaoDuong),
                            biTangHuyetAp: String(entityObj.BiTangHuyetAp),
                            biUngThu: String(entityObj.BiUngThu),
                            songCungDiaChi: String(entityObj.SongCungDiaChi),
                            biBenhKhac: entityObj.BiBenhKhac,
                            nguoiThanBiBenh: entityObj.NguoiThanBiBenh,
                            thuNhapBenhNhan: entityObj.ThuNhapBenhNhan,
                            tinhTrangBenhNguoiThanHienTai:
                                entityObj.TinhTrangBenhNguoiThanHienTai,
                            thuNhapVoChongBenhNhan:
                                entityObj.ThuNhapVoChongBenhNhan,
                            ngheNghiepVoChong: entityObj.NgheNghiepVoChong,
                            thuNhapKhac: entityObj.ThuNhapKhac,
                            tienChuanBiChoViecGhepThan:
                                entityObj.TienChuanBiChoViecGhepThan,
                            khongCoNguoiNhan: entityObj.KhongCoNguoiNhan,
                            nguoiChoBiBenh: entityObj.NguoiChoBiBenh,
                            nguoiChoKhongHoaHopMau:
                                entityObj.NguoiChoKhongHoaHopMau,
                            lyDoKhac: entityObj.LyDoKhac,
                            choGhepBenh: TypeBoPhanConstant.GetName(
                                entityObj.TypePhieuDKGhepTang
                            ),
                            choGhepBVDieuTri: entityObj.ChoGhepBVDieuTri,
                            email: entityObj.Email,
                            NhiemCovid: entityObj.NhiemCovid,
                            BiTruocTiem: entityObj.BiTruocTiem,
                            BiSauTiem: entityObj.BiSauTiem,
                            CoTrieuChung: entityObj.CoTrieuChung,
                            TrieuChungNhe: entityObj.TrieuChungNhe,
                            TrieuChungtrungBinh: entityObj.TrieuChungtrungBinh,
                            NhapVien: entityObj.NhapVien,
                            ThoiGianNamVien: entityObj.ThoiGianNamVien,
                            ThoMay: entityObj.ThoMay,
                            ThoHFNC: entityObj.ThoHFNC,
                            TiemVaccine: entityObj.TiemVaccine,
                            NgayTiemMui1:
                                entityObj.NgayTiemMui1 !== null
                                    ? moment(entityObj.NgayTiemMui1)
                                    : '',
                            NgayTiemMui2:
                                entityObj.NgayTiemMui2 !== null
                                    ? moment(entityObj.NgayTiemMui2)
                                    : '',
                            PhanUng: entityObj.PhanUng,
                            TiemVaccine2: entityObj.TiemVaccine2,
                            PhanUng2: entityObj.PhanUng2,
                            NgayTiemMui3:
                                entityObj.NgayTiemMui3 !== null
                                    ? moment(entityObj.NgayTiemMui3)
                                    : '',
                            TiemVaccine3: entityObj.TiemVaccine3,
                            PhanUng3: entityObj.PhanUng3,

                            maso: entityObj.MaSo
                        }}
                    >
                        <Form.Item name="id" hidden>
                            <Input name="id" id="id" type="hidden" />
                        </Form.Item>
                        <Form.Item name="typePhieuDKGhepTang" hidden="true">
                            <Input
                                name="typePhieuDKGhepTang"
                                id="typePhieuDKGhepTang"
                                type="hidden"
                            />
                        </Form.Item>

                        <Row>
                            <div className="solama">I. H??NH CH??NH:</div>
                        </Row>

                        <Row gutter={[10, 5]}>
                            <Col
                                lg={{span: 4}}
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
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="M?? s??? b???nh nh??n"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui l??ng nh???p th??ng tin n??y'
                                        }
                                    ]}
                                    name="maso"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <Input name="maso" />
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
                                lg={{span: 4}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="???nh">
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
                                <Form.Item
                                    label="???nh th??? c??"
                                    className="my-label"
                                >
                                    <div>
                                        <>
                                            <img
                                                className="imgHinhAnhAccount"
                                                src={`${Constant.PathServer}${entityObj.Avatar}`}
                                                alt=""
                                                onError={NotFoundUserImage}
                                            />
                                        </>
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="???nh th??? m???i"
                                    className="my-label"
                                >
                                    <img id="Avatar" alt="" />
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
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t tr?????c c??"
                                >
                                    <img
                                        className="imgCMND"
                                        src={`${Constant.PathServer}/${entityObj.ImgCMNDBNMatTruoc}`}
                                        alt=""
                                        onError={NotFoundImage}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t tr?????c m???i"
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatTruoc"
                                        alt=""
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t sau c??"
                                >
                                    <img
                                        className="imgCMND"
                                        alt=""
                                        src={`${Constant.PathServer}/${entityObj.ImgCMNDBNMatSau}`}
                                        onError={NotFoundImage}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="???nh CMND/CCCD m???t sau m???i"
                                >
                                    <img
                                        className="imgCMND"
                                        id="ImgCMNDBNMatSau"
                                        alt=""
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
                                        min={1920}
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
                                        min={1920}
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
                                    entityObj.TypePhieuDKGhepTang
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
                                    name="nam"
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
                                        max={800}
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
                                    label="6.Th??i quen h??t thu???c"
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
                                7. Ti???n c??n gia ????nh
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
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="biTangHuyetAp"
                                        defaultValue={
                                            entityObj.BiTangHuyetAp !==
                                            undefined
                                                ? String(
                                                      entityObj.BiTangHuyetAp
                                                  )
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="biUngThu"
                                        defaultValue={
                                            entityObj.BiUngThu !== undefined
                                                ? String(entityObj.BiUngThu)
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="songCungDiaChi"
                                        defaultValue={
                                            entityObj.SongCungDiaChi !==
                                            undefined
                                                ? String(
                                                      entityObj.SongCungDiaChi
                                                  )
                                                : String(0)
                                        }
                                    >
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
                                    8. Ti???n s??? covid
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
                                9. Ti??m vaccine ng???a covid
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
                                        entityObj.TypePhieuDKGhepTang
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
                        <div className="col-md-12 no-padding">
                            <div className="solama">V. QUAN H??? GIA ????NH:</div>
                            {RenderEditQuanHeGiaDinh()}
                        </div>
                        <Row>
                            <div className="solama">
                                VI. Cam k???t ????ng k?? ch??? gh??p th???n t??? ng?????i hi???n
                                ch???t n??o hay tim ng???ng ?????p
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
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    . T??i ???? ???????c c??c b??c s?? ph??? tr??ch gi???i
                                    th??ch r?? v??? c??c b?????c th???c hi???n ????nh gi?? t??nh
                                    tr???ng s???c kh???e chung, th???c hi???n qu?? tr??nh
                                    tuy???n ch???n, th???i gian ch??? ?????i, t??c d???ng ph???
                                    c???a thu???c ???c ch??? mi???n d???ch ??i???u tr??? sau gh??p{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    , chi ph?? gh??p{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    , chu???n b??? m??i tr?????ng v?? c??ch sinh ho???t sau
                                    khi ???????c gh??p{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    . T??i xin ???????c ????ng k?? v??o danh s??ch ch???
                                    gh??p{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}{' '}
                                    t??? ng?????i hi???n ch???t n??o hay tim ng???ng ?????p t???i
                                    B???nh vi???n Ch??? R???y, t??i cam k???t tu??n th??? c??c
                                    quy ?????nh trong qu?? tr??nh ??i???u tr??? b???nh tr?????c
                                    v?? sau gh??p{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    .
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }

    const RenderGioiTinh = (gt) => {
        switch (gt) {
            case 0:
                return 'N???';
            case 1:
                return 'Nam';
            default:
                return '';
        }
    };

    return (
        <>
            <EditModal />
            <EditModalKhac />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditEntity: (id) => {
        dangKyChoGhepTangService.OpenEditModalSV(dispatch, id);
    }
    // onCloseEntityEditModal: (id) => {
    //     dispatch({type: DANGKYCHOGHEPTANG_EDIT_CLOSE});
    // }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkychogheptang.lstEntity,
    IsUpdate: state.dangkychogheptang.IsUpdate,
    // entityObj: state.dangkychogheptang.entityObj,
    showDetailModal: state.dangkychogheptang.showDetailModal,
    showEditModal: state.dangkychogheptang.showEditModal,
    showCreateModal: state.dangkychogheptang.showCreateModal,
    isInit: state.dangkychogheptang.isInit,
    showChangeStatusModal: state.dangkychogheptang.showChangeStatusModal,
    searchModel: state.dangkychogheptang.searchModel,
    statusNew: state.dangkychogheptang.statusNew,
    showThongBaoXNModal: state.dangkychogheptang.showThongBaoXNModal,
    typeCreate: state.dangkychogheptang.typeCreate
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DangKyChoGhepTangEditAdm);
