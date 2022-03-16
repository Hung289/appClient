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
            toast.info('Xóa thành công');
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
                        <i className="fas fa-plus" /> Thêm thông tin quan hệ gia
                        đình
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
                                                label="Địa chỉ thường chú"
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
                    okText="Hoàn thành"
                    cancelText="Thoát"
                    title="Cập nhật đăng ký chờ ghép Thận"
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
                            <div className="solama">I. HÀNH CHÍNH:</div>
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
                                    label="Họ và tên"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Mã số bệnh nhân"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Giới tính"
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
                                        <Radio value="0">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col
                                lg={{span: 4}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="Ảnh">
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
                                    label="Ảnh thẻ cũ"
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
                                    label="Ảnh thẻ mới"
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
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
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Ngày đăng ký"
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
                                    name="ngaydkhien"
                                    validateTrigger={['onBlur', 'onChange']}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="ngaydkhien"
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
                                    label="Thời gian đăng ký BHYT"
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
                                                        'Thời gian đăng ký vượt quá ngày hiện tại'
                                                    );
                                                }

                                                if (
                                                    new Date('1920-1-1') >
                                                    new Date(val)
                                                ) {
                                                    return Promise.reject(
                                                        'Thời gian đăng ký phải sau ngày 1 tháng 1 năm 1920'
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
                                    label="CMND/CCCD/Hộ chiếu"
                                    name="CMNDBN"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Ngày cấp"
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt trước cũ"
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
                                    label="Ảnh CMND/CCCD mặt trước mới"
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
                                    label="Ảnh CMND/CCCD mặt sau cũ"
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
                                    label="Ảnh CMND/CCCD mặt sau mới"
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
                                    label="Nghề nghiệp"
                                    name="ngheNghiep"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Điện thoại"
                                    name="dienThoai"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Điện thoại khác"
                                    name="dienThoai1"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                                'Vui lòng nhập thông tin này'
                                        }
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
                                        }
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                    label="Nhỏ nhất sinh năm"
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
                                <Form.Item
                                    label="Số lượng nước tiểu/24 giờ"
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                            Không có tiền căn lao
                                        </Radio>
                                        <Radio value="1">Lao phổi</Radio>
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
                                    label="Lao các cơ quan khác"
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
                                md={{span: 12}}
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
                                md={{span: 6}}
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
                                md={{span: 6}}
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
                                md={{span: 12}}
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
                                md={{span: 6}}
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
                                md={{span: 6}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <label>Có phẫu thuật gì trước đó không</label>
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                md={{span: 6}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 6}}
                                sm={{span: 6}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="soLanTuan"
                                    label="Số lần/Tuần"
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    name="biBenhThan"
                                    label="Bệnh thận"
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                    label="Bệnh lao"
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                    label="Đái tháo đường"
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                    label="Tăng huyết áp"
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                    label="Ung thư"
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
                                        <Radio value="1">Có</Radio>
                                        <Radio value="0">Không</Radio>
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
                                    label="Bênh khác"
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
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
                                    9. Thông tin bổ sung
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
                                    label="Chỉ số BMI (%)"
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
                                    label="Năm bắt đầu điều trị"
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
                                    label="Số năm điều trị thay thế"
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
                                    label="Sanh con lần mấy"
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
                                    label="Sanh con lần cuối vào năm"
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
                                    label="Ngoại tổng quát"
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
                                    label="Ngoại tiết niệu"
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
                                    label="Tiền căn ngoại khoa khác"
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
                                    label="Thời điểm truyền máu"
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        name="thoidiemtruyenmau"
                                        placeholder="Vui lòng chọn ngày"
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
                                    label="Năm phát hiện CTNT trở lại"
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
                                    label="Thông tin phẫu thuật"
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
                                        Xạ trị
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
                                        Hóa trị
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
                                        Bệnh lý hệ thống đường tiết niệu
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
                                        Bệnh lý tim mạch
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
                                    10. Tiền sử covid
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
                                        Không bị nhiễm covid
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
                                        Bị nhiễm trước tiêm
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
                                        Bị nhiễm sau tiêm
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
                                        Không có triệu chứng
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
                                        Triệu chứng nhẹ
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
                                        Triệu chứng trung bình
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
                                        Thở máy
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
                                11. Tiêm vaccine ngừa covid
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
                                    label="Tiêm vaccine ngừa covid mũi 1"
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 8}}
                                sm={{span: 12}}
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
                                md={{span: 12}}
                                sm={{span: 12}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    label="Thu nhập của vợ hoặc chồng"
                                    className="my-label"
                                >
                                    <Input
                                        name="thuNhapVoChongBenhNhan"
                                        placeholder="vnd/tháng"
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
                                    label="Nghề nghiệp"
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
                                    label="Thu nhập khác"
                                    className="my-label"
                                >
                                    <Input
                                        name="thuNhapKhac"
                                        placeholder="vnd/tháng"
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
                                    label="Tiền chuẩn bị cho việc ghép thận(có sẵn)"
                                    className="my-label"
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
                                        Không có người hiến thận
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
                                        Người hiến bị bệnh
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

                        <div className="col-md-12 no-padding">
                            <div className="solama">V. QUAN HỆ GIA ĐÌNH:</div>
                            {RenderEditQuanHeGiaDinh()}
                        </div>

                        <Row>
                            <div className="solama">
                                VI. Cam kết đăng ký chờ ghép thận từ người hiến
                                chết não hay tim ngừng đập
                            </div>
                            <Col
                                lg={{span: 24}}
                                md={{span: 24}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                Hiện tôi bị bệnh suy thận mạn giai đoạn cuối
                                đang phải lọc máu định kỳ, có chỉ định ghép
                                thận. Tôi đã được các bác sĩ phụ trách giải
                                thích rõ về các bước thực hiện đánh giá tình
                                trạng sức khỏe chung, thực hiện quá trình tuyển
                                chọn, thời gian chờ đợi, tác dụng phụ của thuốc
                                ức chế miễn dịch điều trị sau ghép thận, chi phí
                                ghép thận, chuẩn bị môi trường và cách sinh hoạt
                                sau khi được ghép thận….. Tôi xin được đăng ký
                                vào danh sách chờ ghép thận từ người hiến chết
                                não hay tim ngừng đập tại Bệnh viện Chợ Rẫy, tôi
                                cam kết tuân thủ các quy định trong quá trình
                                điều trị bệnh trước và sau ghép thận.
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
                    okText="Hoàn thành"
                    cancelText="Thoát"
                    title={`Cập nhật đăng ký chờ ghép  ${TypeBoPhanConstant.GetName(
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
                            <div className="solama">I. HÀNH CHÍNH:</div>
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
                                lg={{span: 4}}
                                md={{span: 8}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Mã số bệnh nhân"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng nhập thông tin này'
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
                                lg={{span: 4}}
                                md={{span: 16}}
                                sm={{span: 24}}
                                xs={{span: 24}}
                            >
                                <Form.Item className="my-label" label="Ảnh">
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
                                    label="Ảnh thẻ cũ"
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
                                    label="Ảnh thẻ mới"
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
                                lg={{span: 6}}
                                md={{span: 6}}
                                sm={{span: 12}}
                                xs={{span: 12}}
                            >
                                <Form.Item
                                    className="my-label"
                                    label="Ảnh CMND/CCCD mặt trước cũ"
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
                                    label="Ảnh CMND/CCCD mặt trước mới"
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
                                    label="Ảnh CMND/CCCD mặt sau cũ"
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
                                    label="Ảnh CMND/CCCD mặt sau mới"
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
                                    label="Nhỏ nhất sinh năm"
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
                                    label="6.Thói quen hút thuốc"
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
                                7. Tiền căn gia đình
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
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="biBenhLao"
                                        defaultValue={
                                            entityObj.BiBenhLao !== undefined
                                                ? String(entityObj.BiBenhLao)
                                                : String(0)
                                        }
                                    >
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
                                    <Radio.Group
                                        name="biUngThu"
                                        defaultValue={
                                            entityObj.BiUngThu !== undefined
                                                ? String(entityObj.BiUngThu)
                                                : String(0)
                                        }
                                    >
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
                                    8. Tiền sử covid
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
                                9. Tiêm vaccine ngừa covid
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
                                        entityObj.TypePhieuDKGhepTang
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
                        <div className="col-md-12 no-padding">
                            <div className="solama">V. QUAN HỆ GIA ĐÌNH:</div>
                            {RenderEditQuanHeGiaDinh()}
                        </div>
                        <Row>
                            <div className="solama">
                                VI. Cam kết đăng ký chờ ghép thận từ người hiến
                                chết não hay tim ngừng đập
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
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    . Tôi đã được các bác sĩ phụ trách giải
                                    thích rõ về các bước thực hiện đánh giá tình
                                    trạng sức khỏe chung, thực hiện quá trình
                                    tuyển chọn, thời gian chờ đợi, tác dụng phụ
                                    của thuốc ức chế miễn dịch điều trị sau ghép{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    , chi phí ghép{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    , chuẩn bị môi trường và cách sinh hoạt sau
                                    khi được ghép{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}
                                    . Tôi xin được đăng ký vào danh sách chờ
                                    ghép{' '}
                                    {TypeBoPhanConstant.GetName(
                                        entityObj.TypePhieuDKGhepTang
                                    )}{' '}
                                    từ người hiến chết não hay tim ngừng đập tại
                                    Bệnh viện Chợ Rẫy, tôi cam kết tuân thủ các
                                    quy định trong quá trình điều trị bệnh trước
                                    và sau ghép{' '}
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
                return 'Nữ';
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
