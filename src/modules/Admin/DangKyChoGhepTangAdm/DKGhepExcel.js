/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import React, {useState, useRef, useEffect, useMemo} from 'react';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import * as Yup from 'yup';
import {useTable, usePagination} from 'react-table';
import {Table, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {Link, useHistory} from 'react-router-dom';
import * as Constant from '@app/Constant';
import {
    NhapDKGhepThanTExcel,
    LuuDKGhepThanExcelTrue,
    XuatDKGhepThanExcelFalse
} from '@app/services/TinhNangMoRongService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem,
    removeCheckAllItem
} from '@modules/Common/TableCommon';
import ReactLoading from 'react-loading';
import * as CommonUtility from '@modules/Common/CommonUtility';
import AdminSecsionHead from '../AdminSecsionHead';
import 'routes/TableImportExcel.css';

export default function DKHienExcel() {
    const [resultAPI, setresultAPI] = useState('');
    const [isload, setisload] = useState(false);
    const SendExcel = () => {
        const [fileselected, setfileselected] = useState('');
        const formRef = useRef();
        function Change(event) {
            if (event.target.files[0] !== undefined) {
                if (
                    event.target.files[0].type ===
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    event.target.files[0].type === 'application/vnd.ms-excel'
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
        const SignupSchema = Yup.object().shape({});
        return (
            <Formik
                innerRef={formRef}
                initialValues={{
                    dongbatdau: 5,

                    HoTenBN: 1,
                    NgaySinh: 2,
                    NamSinh: 3,
                    GioiTinh: 6,

                    NhomMau: 7,
                    NhomMau1: 8,
                    ChieuCao: 9,
                    CanNang: 10,
                    chisoBMI: 11,
                    NgayDKHien: 12,

                    namphathienctnttrolai: 13,
                    NgayCTNTHoacKhamThamPhanBenhLy: 14,
                    nambatdaudieutri: 15,
                    sonamdieutrithaythe: 17,
                    CAPD: 18,

                    CTNTVaoNgay: 19,
                    // CTNT357: 21,
                    // CTNT247: 22,

                    CaCTNT: 23,
                    // Ca2: 24,
                    // Ca3: 25,
                    // Ca4: 26,

                    ChuKyThamPhanTaiBV: 28,
                    BacSiDieuTri: 29,
                    DienThoaiBacSi: 30,
                    NgheNghiep: 31,
                    NgheNhiepBoSung: 32,
                    DiaChiThuongChu: 33,

                    DienThoai: 34,
                    DienThoai1: 35,
                    BaoHiemYTe: 36,
                    ThuNhapBenhNhan: 37,
                    NuocTieu24h: 38,
                    SoLuongNuocTieu24h: 39,
                    ngoaitongquat: 40,
                    ngoaitietnieu: 41,
                    tiencanngoaikhoakhac: 42,

                    HutThuoc: 43,
                    DieuTrenNgay: 44,
                    UongRuouBia: 45,
                    SoLuongLan: 46,

                    NguyenNhanSuyThan: 47,
                    THA: 48,
                    benhlytimmach: 49,
                    DaiThaoDuong: 50,
                    ThuocDieuTriDaiThaoDuong: 51,
                    benhlyhethongduongtietnieu: 52,

                    ViemGanB: 53,
                    ViemGanBTruocCTNT: 54,
                    ViemGanBSauCTNT: 55,
                    ViemGanBCoDieuTri: 56,
                    ViemGanBThuocSuDung: 57,

                    ViemGanBNgayBatDauDieuTri: 58,
                    ViemGanBThoiGianDieuTri: 59,
                    ViemGanBNgayKetThuDieuTri: 60,

                    ViemGanBAmTinhLan1: 61,
                    ViemGanBAmTinhLan2: 62,
                    ViemGanBAmTinhLan3: 63,
                    ViemGanBAmTinhLan4: 64,

                    ViemGanBDuongTinhCopies1: 65,
                    ViemGanBDuongTinhCopies2: 66,
                    ViemGanBDuongTinhCopies3: 67,
                    ViemGanBDuongTinhCopies4: 68,
                    ViemGanBHoanTatDieuTriCachNay: 69,

                    ViemGanC: 70,
                    ViemGanCTruocCTNT: 71,
                    ViemGanCSauCTNT: 72,
                    ViemGanCCoDieuTri: 73,
                    ViemGanCThuocSuDung: 74,

                    ViemGanCNgayBatDauDieuTri: 75,
                    ViemGanCThoiGianDieuTri: 76,
                    ViemGanCNgayKetThuDieuTri: 77,

                    ViemGanCAmTinhLan1: 78,
                    ViemGanCAmTinhLan2: 79,
                    ViemGanCAmTinhLan3: 80,
                    ViemGanCAmTinhLan4: 81,

                    ViemGanCAmTinhLan5: 82,
                    ViemGanCAmTinhLan6: 83,
                    ViemGanCAmTinhLan7: 84,
                    ViemGanCAmTinhLan8: 85,

                    ViemGanCDuongTinhCopies1: 86,
                    ViemGanCDuongTinhCopies2: 87,
                    ViemGanCDuongTinhCopies3: 88,
                    ViemGanCDuongTinhCopies4: 89,

                    BiUngThu: 90,
                    phauthuat: 91,
                    hoatri: 92,
                    xatri: 93,
                    Truyenmau: 94,

                    BaoNhieuDonViMau: 95,
                    thoidiemtruyenmau: 96,

                    sanhconmaylan: 97,
                    sanhconlancuoivaonam: 98,
                    DaGhepLan1Ngay: 99,
                    NguoiChoThan: 100,

                    DaGhepLan1TaiBV: 101,
                    ChuanDoanSuyThanGhep: 102,
                    NgayChayThanTroLai: 103,
                    // lần 1
                    AntibodyLan1NgayThucHien: 104,
                    AntibodyLan1TiLePRA: 105,
                    AntibodyLan1TiLePRASau: 106,

                    AntibodyLan1A: 107,
                    AntibodyLan1B: 108,
                    AntibodyLan1DR: 109,
                    AntibodyLan1DQ: 110,
                    AntibodyLan1DP: 111,

                    AntibodyLan1LocHuyetTuong: 112,
                    AntibodyLan1ThuocUCMD: 113,
                    AntibodyLan1TheoDoi: 114,
                    // lần 2
                    AntibodyLan2NgayThucHien: 115,
                    AntibodyLan2TiLePRA: 116,
                    AntibodyLan2TiLePRASau: 117,

                    AntibodyLan2A: 118,
                    AntibodyLan2B: 119,
                    AntibodyLan2DR: 120,
                    AntibodyLan2DQ: 121,
                    AntibodyLan2DP: 122,

                    AntibodyLan2LocHuyetTuong: 123,
                    AntibodyLan2ThuocUCMD: 124,
                    AntibodyLan2TheoDoi: 125,

                    // lần 3

                    AntibodyLan3NgayThucHien: 126,
                    AntibodyLan3TiLePRA: 127,
                    AntibodyLan3TiLePRASau: 128,

                    AntibodyLan3A: 129,
                    AntibodyLan3B: 130,
                    AntibodyLan3DR: 131,
                    AntibodyLan3DQ: 132,
                    AntibodyLan3DP: 133,

                    AntibodyLan3LocHuyetTuong: 134,
                    AntibodyLan3ThuocUCMD: 135,
                    AntibodyLan3TheoDoi: 136,

                    // lần 4
                    AntibodyLan4NgayThucHien: 137,
                    AntibodyLan4TiLePRA: 138,
                    AntibodyLan4TiLePRASau: 139,

                    AntibodyLan4A: 140,
                    AntibodyLan4B: 141,
                    AntibodyLan4DR: 142,
                    AntibodyLan4DQ: 143,
                    AntibodyLan4DP: 144,

                    AntibodyLan4LocHuyetTuong: 145,
                    AntibodyLan4ThuocUCMD: 146,
                    AntibodyLan4TheoDoi: 147,

                    // lần 5
                    AntibodyLan5NgayThucHien: 148,
                    AntibodyLan5TiLePRA: 149,
                    AntibodyLan5TiLePRASau: 150,

                    AntibodyLan5A: 151,
                    AntibodyLan5B: 152,
                    AntibodyLan5DR: 153,
                    AntibodyLan5DQ: 154,
                    AntibodyLan5DP: 155,

                    AntibodyLan5LocHuyetTuong: 156,
                    AntibodyLan5ThuocUCMD: 157,
                    AntibodyLan5TheoDoi: 158,

                    // lần 6
                    AntibodyLan6NgayThucHien: 159,
                    AntibodyLan6TiLePRA: 160,
                    AntibodyLan6TiLePRASau: 161,

                    AntibodyLan6A: 162,
                    AntibodyLan6B: 163,
                    AntibodyLan6DR: 164,
                    AntibodyLan6DQ: 165,
                    AntibodyLan6DP: 166,

                    AntibodyLan6LocHuyetTuong: 167,
                    AntibodyLan6ThuocUCMD: 168,
                    AntibodyLan6TheoDoi: 169,

                    // lần 7
                    AntibodyLan7NgayThucHien: 170,
                    AntibodyLan7TiLePRA: 171,
                    AntibodyLan7TiLePRASau: 172,

                    AntibodyLan7A: 173,
                    AntibodyLan7B: 174,
                    AntibodyLan7DR: 175,
                    AntibodyLan7DQ: 176,
                    AntibodyLan7DP: 177,

                    AntibodyLan7LocHuyetTuong: 178,
                    AntibodyLan7ThuocUCMD: 179,
                    AntibodyLan7TheoDoi: 180,

                    HLAA: 181,
                    HLAB: 182,
                    HLADRB1: 183,
                    HLADQA1: 184,
                    HLADQB1: 185,
                    GhiChu: 186
                }}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    if (fileselected) {
                        const formdata = new FormData();
                        formdata.append('file', fileselected);

                        const cell = JSON.stringify(values);
                        formdata.append('cell', cell);
                        // values.map((item, key) => {
                        //     formdata.append(item.key, item.values);
                        //     return '';
                        // });
                        for (const key in values) {
                            if (key.values != null) {
                                formdata.append(key, values[key]);
                            }
                        }
                        setisload(true);
                        NhapDKGhepThanTExcel(formdata).then((response) => {
                            if (response.Status) {
                                if (response.Data !== null) {
                                    response.Data.DataTrue.forEach(
                                        (element) => {
                                            // eslint-disable-next-line no-param-reassign
                                            element.idrandom = Math.random();
                                            // eslint-disable-next-line no-param-reassign
                                            element.select = false;
                                        }
                                    );
                                }
                                if (response.Data !== null) {
                                    response.Data.DataFalse.forEach(
                                        (element) => {
                                            // eslint-disable-next-line no-param-reassign
                                            element.idrandom = Math.random();
                                            // eslint-disable-next-line no-param-reassign
                                            element.select = false;
                                        }
                                    );
                                }

                                setresultAPI(response.Data);
                            } else {
                                toast.error('Có lỗi xảy ra');
                            }
                            setisload(false);
                        });
                    } else {
                        toast.error('Hãy chọn một file!');
                    }
                }}
            >
                {({errors, touched}) => (
                    <Form>
                        <div
                            className="form-row"
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <div
                                style={{
                                    border: '2px red solid',
                                    padding: '10px',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <p>Chọn File Excel Đăng Ký chờ Ghép Thận</p>
                                <input
                                    type="file"
                                    accept=".xls, .xlsx"
                                    onChange={Change}
                                    style={{
                                        border: '1px red solid',
                                        padding: '10px',
                                        margin: '10px 10px 10px 10px'
                                    }}
                                />
                                <div>
                                    <p>
                                        {' '}
                                        <b>Tên File: </b>
                                        {fileselected
                                            ? fileselected.name
                                            : ' ... '}
                                    </p>
                                    <p>
                                        {' '}
                                        <b>Kích thước: </b>
                                        {fileselected
                                            ? fileselected.size
                                            : ' ... '}{' '}
                                        byte
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button
                                        size="md"
                                        type="submit"
                                        className="Button-action"
                                    >
                                        <i
                                            className="fa fa-upload"
                                            aria-hidden="true"
                                        />
                                        &nbsp;Tải lên
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <Table className="tablecell">
                                <tbody>
                                    <tr>
                                        <td
                                            colSpan={10}
                                            style={{fontSize: '20px'}}
                                        >
                                            Thông tin File Excel
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Thông tin chung</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="HoTenBN">
                                                Họ Tên
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HoTenBN"
                                                type="number"
                                            />
                                        </td>
                                        {/* <td>
                                            <label htmlFor="Ten">Tên</label>
                                        </td>
                                        <td>
                                            <Field name="Ten" type="number" />
                                        </td> */}
                                        <td>
                                            <label htmlFor="NgaySinh">
                                                Ngày sinh
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgaySinh"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NamSinh">
                                                Năm sinh
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NamSinh"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="GioiTinh">
                                                Giới tính
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="GioiTinh"
                                                type="number"
                                            />
                                        </td>

                                        <td>
                                            <label htmlFor="NhomMau">
                                                Nhóm máu ABO
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NhomMau"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="NhomMau1">
                                                Nhóm máu Rh
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NhomMau1"
                                                type="number"
                                            />
                                        </td>

                                        <td>
                                            <label htmlFor="ChieuCao">
                                                Chiều cao
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ChieuCao"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CanNang">
                                                Cân nặng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CanNang"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="chisoBMI">
                                                BMI
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="chisoBMI"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NgayDKHien">
                                                Ngày đăng ký
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgayDKHien"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="namphathienctnttrolai">
                                                Năm phát hiện CTNT lại
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="namphathienctnttrolai"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NgayCTNTHoacKhamThamPhanBenhLy">
                                                Thời gian bắt đầu CTNT-TPPM
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgayCTNTHoacKhamThamPhanBenhLy"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="nambatdaudieutri">
                                                Năm bắt đầu điều trị thay thế
                                                thận
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="nambatdaudieutri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="sonamdieutrithaythe">
                                                Số năm điều trị thay thế thận
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="sonamdieutrithaythe"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CAPD">CAPD</label>
                                        </td>
                                        <td>
                                            <Field name="CAPD" type="number" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Chạy thận nhân tạo</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="CTNTVaoNgay">
                                                CTNT vào ngày
                                                {/* (2,4,6 là 1; 3,5,7
                                                là 2; khác là 3) */}
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CTNTVaoNgay"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CaCTNT">
                                                Ca CTNT
                                                {/* (2,4,6 là 1; 3,5,7
                                                là 2; khác là 3) */}
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CaCTNT"
                                                type="number"
                                            />
                                        </td>
                                        {/* <td>
                                            <label htmlFor="CTNT357">
                                                CTNT thứ 3,5,7
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CTNT357"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CTNT247">
                                                CTNT thứ 2,4,7
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CTNT247"
                                                type="number"
                                            />
                                        </td> */}
                                    </tr>
                                    {/* <tr>
                                        <td>
                                            <label htmlFor="Ca1">Ca 1</label>
                                        </td>
                                        <td>
                                            <Field name="Ca1" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Ca2">Ca 2</label>
                                        </td>
                                        <td>
                                            <Field name="Ca2" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Ca3">Ca 3</label>
                                        </td>
                                        <td>
                                            <Field name="Ca3" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Ca4">Ca 4</label>
                                        </td>
                                        <td>
                                            <Field name="Ca4" type="number" />
                                        </td>
                                        <td />
                                        <td />
                                    </tr>
                                    */}
                                    <tr>
                                        <td colSpan={10}>Thông tin chi tiết</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ChuKyThamPhanTaiBV">
                                                Trung tâm CTNT-TPPM
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ChuKyThamPhanTaiBV"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="BacSiDieuTri">
                                                Bác sĩ điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="BacSiDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DienThoaiBacSi">
                                                Điện thoại bác sĩ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DienThoaiBacSi"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NgheNghiep">
                                                Nghề nghiệp
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgheNghiep"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NgheNhiepBoSung">
                                                Nghề nghiệp khác
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgheNhiepBoSung"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="DiaChiThuongChu">
                                                Địa chỉ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DiaChiThuongChu"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DienThoai">
                                                Điện thoại
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DienThoai"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DienThoai1">
                                                Điện thoại bổ xung
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DienThoai1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="BaoHiemYTe">
                                                Bảo hiểm y tế
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="BaoHiemYTe"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ThuNhapBenhNhan">
                                                Kinh tế
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ThuNhapBenhNhan"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="NuocTieu24h">
                                                Có nước tiểu không
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NuocTieu24h"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="SoLuongNuocTieu24h">
                                                Số lượng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="SoLuongNuocTieu24h"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            Tiền căn ngoại khoa
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ngoaitongquat">
                                                Ngoại tổng quát
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ngoaitongquat"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ngoaitietnieu">
                                                Ngoại tiết niệu
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ngoaitietnieu"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="tiencanngoaikhoakhac">
                                                Tiền căn ngoại khoa khác
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="tiencanngoaikhoakhac"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Tiền căn nội khoa</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="HutThuoc">
                                                Hút thuốc không?
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HutThuoc"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DieuTrenNgay">
                                                Số lượng điếu/ ngày
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DieuTrenNgay"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="UongRuouBia">
                                                Uống rượu bia không?
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="UongRuouBia"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="SoLuongLan">
                                                Số lượng lít/ ngày
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="SoLuongLan"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="NguyenNhanSuyThan">
                                                Nguyên nhân suy thận
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NguyenNhanSuyThan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="THA">THA</label>
                                        </td>
                                        <td>
                                            <Field name="THA" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="benhlytimmach">
                                                Bệnh lý tim mạch
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="benhlytimmach"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DaiThaoDuong">
                                                Bệnh lý đái tháo đường
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DaiThaoDuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ThuocDieuTriDaiThaoDuong">
                                                Thuốc điều trị đái tháo đường
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ThuocDieuTriDaiThaoDuong"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="benhlyhethongduongtietnieu">
                                                Bệnh lý hệ thống đường tiết niệu
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="benhlyhethongduongtietnieu"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            Xét nghiệm đánh giá tình trạng Viêm
                                            gan siêu vi B
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanB">
                                                Viêm gan siêu vi B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanB"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBTruocCTNT">
                                                Trước CTNT
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBTruocCTNT"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBSauCTNT">
                                                Sau CTNT
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBSauCTNT"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBCoDieuTri">
                                                Có điều trị viêm gan B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBCoDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBThuocSuDung">
                                                Thuốc sử dụng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBThuocSuDung"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanBNgayBatDauDieuTri">
                                                Ngày bắt đầu điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBNgayBatDauDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBThoiGianDieuTri">
                                                Thời gian điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBThoiGianDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBNgayKetThuDieuTri">
                                                Ngày kết thúc điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBNgayKetThuDieuTri"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanBAmTinhLan1">
                                                Âm tính lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBAmTinhLan1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBAmTinhLan2">
                                                Âm tính lần 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBAmTinhLan2"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBAmTinhLan3">
                                                Âm tính lần 3
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBAmTinhLan3"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBAmTinhLan4">
                                                Âm tính lần 4
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBAmTinhLan4"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanBDuongTinhCopies1">
                                                Dương tính với số copies lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBDuongTinhCopies1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBDuongTinhCopies2">
                                                Dương tính với số copies lần 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBDuongTinhCopies2"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBDuongTinhCopies3">
                                                Dương tính với số copies lần 3
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBDuongTinhCopies3"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBDuongTinhCopies4">
                                                Dương tính với số copies lần 4
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBDuongTinhCopies4"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanBHoanTatDieuTriCachNay">
                                                Hoàn tất lộ trình điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanBHoanTatDieuTriCachNay"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            Xét nghiệm đánh giá tình trạng Viêm
                                            gan siêu vi C
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanC">
                                                Viêm gan siêu vi C
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanC"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCTruocCTNT">
                                                Trước CTNT
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCTruocCTNT"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCSauCTNT">
                                                Sau CTNT
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCSauCTNT"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCCoDieuTri">
                                                Có điều trị viêm gan B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCCoDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCThuocSuDung">
                                                Thuốc sử dụng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCThuocSuDung"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanCNgayBatDauDieuTri">
                                                Ngày bắt đầu điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCNgayBatDauDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCThoiGianDieuTri">
                                                Thời gian điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCThoiGianDieuTri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCNgayKetThuDieuTri">
                                                Ngày kết thúc điều trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCNgayKetThuDieuTri"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan1">
                                                Âm tính lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan2">
                                                Âm tính lần 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan2"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan3">
                                                Âm tính lần 3
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan3"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan4">
                                                Âm tính lần 4
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan4"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan5">
                                                Âm tính lần 5
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan5"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan6">
                                                Âm tính lần 6
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan6"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan7">
                                                Âm tính lần 7
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan7"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCAmTinhLan8">
                                                Âm tính lần 8
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCAmTinhLan8"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="ViemGanCDuongTinhCopies1">
                                                Dương tính với số copies lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCDuongTinhCopies1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCDuongTinhCopies2">
                                                Dương tính với số copies lần 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCDuongTinhCopies2"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCDuongTinhCopies3">
                                                Dương tính với số copies lần 3
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCDuongTinhCopies3"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ViemGanCDuongTinhCopies4">
                                                Dương tính với số copies lần 4
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ViemGanCDuongTinhCopies4"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Thông tin khác</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="BiUngThu">
                                                Ung thư
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="BiUngThu"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="phauthuat">
                                                Phẫu thuật
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="phauthuat"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="hoatri">
                                                Hoá trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="hoatri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="xatri">
                                                Xạ trị
                                            </label>
                                        </td>
                                        <td>
                                            <Field name="xatri" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Truyenmau">
                                                Truyền máu
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Truyenmau"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="BaoNhieuDonViMau">
                                                Số lượng truyền máu
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="BaoNhieuDonViMau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="thoidiemtruyenmau">
                                                Thời điểm truyền máu
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="thoidiemtruyenmau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="sanhconmaylan">
                                                Sanh con mấy lần
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="sanhconmaylan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="sanhconlancuoivaonam">
                                                Thời điểm sanh con sau cùng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="sanhconlancuoivaonam"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DaGhepLan1Ngay">
                                                Đã ghép thận trước đó
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DaGhepLan1Ngay"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="NguoiChoThan">
                                                Người hiến tạng lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NguoiChoThan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DaGhepLan1TaiBV">
                                                Trung tâm ghép lần 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DaGhepLan1TaiBV"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="ChuanDoanSuyThanGhep">
                                                Nguyên nhân suy thận ghép
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="ChuanDoanSuyThanGhep"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NgayChayThanTroLai">
                                                Ngày chạy thận nhân tạo trở lại
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgayChayThanTroLai"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 1
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan1NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan1DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan1ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan1TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan1TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 2
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan2NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan2DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan2ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan2TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan2TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 3
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan3NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan3DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan3ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan3TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan3TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 4
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan4NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan4DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan4ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan4TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan4TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 5
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan5NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan5DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan5ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan5TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan5TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 6
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan6NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan6DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan6ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan6TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan6TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>
                                            PRA VÀ Anti HLA antibody Lần 7
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan7NgayThucHien">
                                                Ngày thực hiện
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7NgayThucHien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7TiLePRA">
                                                % PRA lớp 1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7TiLePRA"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7TiLePRASau">
                                                % PRA lớp 2
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7TiLePRASau"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7A">
                                                A
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7A"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7B">
                                                B
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7B"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan7DR">
                                                DR
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7DR"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7DQ">
                                                DQ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7DQ"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7DP">
                                                DP
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7DP"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7LocHuyetTuong">
                                                Lọc huyết tương
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7LocHuyetTuong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="AntibodyLan7ThuocUCMD">
                                                Thuốc UCMD
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7ThuocUCMD"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="AntibodyLan7TheoDoi">
                                                Theo dõi
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="AntibodyLan7TheoDoi"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>HLA</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="HLAA">A</label>
                                        </td>
                                        <td>
                                            <Field name="HLAA" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="HLAB">B</label>
                                        </td>
                                        <td>
                                            <Field name="HLAB" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="HLADRB1">
                                                DRB1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HLADRB1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="HLADQA1">
                                                DQA1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HLADQA1"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="HLADQB1">
                                                DQB1
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HLADQB1"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="GhiChu">
                                                Ghi Chú
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="GhiChu"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    };
    const renderNgayDK = (item) => {
        if (item !== null) {
            const date = new Date(item);
            const str = `${date.getDate()}-${
                date.getMonth() + 1
            }-${date.getFullYear()}`;
            return str;
        }
        return '';
    };
    const renderMessExcel = (item) => {
        const arrayError = item.split('-');
        const result = arrayError.map((error, keyy) => {
            return (
                <p style={{margin: '0px'}} key={`${`${item.MaSo}-${keyy}`}`}>
                    {error}
                </p>
            );
        });
        return result;
    };
    const renderResponse = (item) => {
        const result = item.replaceAll('-', '\n-');
        return result;
    };
    const downloadFile = (file) => {
        const element = document.createElement('a');
        element.setAttribute('href', file);
        element.setAttribute('download', '');

        element.style.display = 'none';

        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    };
    const renderCheckboxinTable = (value) => {
        if (value === true || value === 1) {
            return <input type="checkbox" checked readOnly />;
        }
        return <input type="checkbox" readOnly />;
    };
    const renderPhantraminTable = (value) => {
        // chuyen 0.1 => 10%
        return `${value * 100}%`;
    };
    const ResultExcelTrue = () => {
        const COLUMNS = [
            {
                Header: 'Thông tin chung',
                columns: [
                    {
                        Header: 'Họ tên',
                        accessor: 'HoTenBN'
                    },
                    {
                        Header: 'Ngày sinh',
                        accessor: 'NgaySinh',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Nhóm máu',
                        accessor: 'NhomMau'
                    },
                    {
                        Header: 'Nhóm máu Rh',
                        accessor: 'NhomMau1'
                    },
                    {
                        Header: 'Chiều cao',
                        accessor: 'ChieuCao'
                    },
                    {
                        Header: 'Cân nặng',
                        accessor: 'CanNang'
                    },
                    {
                        Header: 'BMI',
                        accessor: 'chisoBMI'
                    },
                    {
                        Header: 'Ngày ĐK hiến',
                        accessor: 'NgayDKHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Năm phát hiện CTNT trở lại',
                        accessor: 'namphathienctnttrolai'
                    },
                    {
                        Header: 'Thời gian bắt đầu CTNT/TPPM',
                        accessor: 'NgayCTNTHoacKhamThamPhanBenhLy',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Năm bắt đầu điều trị thay thế thận',
                        accessor: 'nambatdaudieutri'
                    },
                    {
                        Header: 'Số năm điều trị thay thế',
                        accessor: 'sonamdieutrithaythe'
                    },
                    {
                        Header: 'CAPD',
                        accessor: 'CAPD',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    }
                ]
            },
            {
                Header: 'Chạy thận nhân tạo',
                columns: [
                    {
                        Header: 'CTNT vào ngày',
                        accessor: 'CTNTVaoNgay'
                    },
                    {
                        Header: 'Ca CTNT',
                        accessor: 'CaCTNT'
                    }
                ]
            },
            {
                Header: 'Thông tin bổ sung',
                columns: [
                    {
                        Header: 'Trung tâm CTNT-TPPM',
                        accessor: 'ChuKyThamPhanTaiBV'
                    },
                    {
                        Header: 'Bác sĩ điều trị',
                        accessor: 'BacSiDieuTri'
                    },
                    {
                        Header: 'Điện thoại bác sĩ',
                        accessor: 'DienThoaiBacSi'
                    },
                    {
                        Header: 'Nghề nghiệp',
                        accessor: 'NgheNghiep'
                    },
                    {
                        Header: 'Nghề nghiệp bổ sung',
                        accessor: 'NgheNhiepBoSung'
                    },
                    {
                        Header: 'Địa chỉ',
                        accessor: 'DiaChiThuongChu'
                    },
                    {
                        Header: 'Điện thoại',
                        accessor: 'DienThoai'
                    },
                    {
                        Header: 'Điện thoại bổ xung',
                        accessor: 'DienThoai1'
                    },
                    {
                        Header: 'Bảo hiểm y tế',
                        accessor: 'BaoHiemYTe'
                    },
                    {
                        Header: 'Kinh tế',
                        accessor: 'ThuNhapBenhNhan'
                    },
                    {
                        Header: 'Lượng nước tiểu ',
                        accessor: 'SoLuongNuocTieu24h'
                    }
                ]
            },
            {
                Header: 'Tiền căn ngoại khoa',
                columns: [
                    {
                        Header: 'Ngoại tổng quát',
                        accessor: 'ngoaitongquat'
                    },
                    {
                        Header: 'Ngoại tiết niệu',
                        accessor: 'ngoaitietnieu'
                    },
                    {
                        Header: 'Khác',
                        accessor: 'tiencanngoaikhoakhac'
                    }
                ]
            },
            {
                Header: 'Tiền căn nội khoa',
                columns: [
                    {
                        Header: 'Hút thuốc (điếu/ ngày)',
                        accessor: 'DieuTrenNgay'
                    },
                    {
                        Header: 'Uống rượu bia (lít/ ngày)',
                        accessor: 'SoLuongLan'
                    },
                    {
                        Header: 'Nguyên nhân suy thận',
                        accessor: 'NguyenNhanSuyThan'
                    },
                    {
                        Header: 'THA',
                        accessor: 'THA',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Bệnh lý tim mạch',
                        accessor: 'benhlytimmach',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Đái tháo đường',
                        accessor: 'DaiThaoDuong',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Thuốc điều trị',
                        accessor: 'ThuocDieuTriDaiThaoDuong'
                    },
                    {
                        Header: 'Bệnh lý hệ thống đường tiết niệu',
                        accessor: 'benhlyhethongduongtietnieu',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    }
                ]
            },
            {
                Header: 'Viêm gan B',
                columns: [
                    {
                        Header: 'Viêm gan siêu vi B',
                        accessor: 'ViemGanB',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Trước chạy thận nhân tạo',
                        accessor: 'ViemGanBTruocCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Sau chạy thận nhân tạo',
                        accessor: 'ViemGanBSauCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Có điều trị hay không',
                        accessor: 'ViemGanBCoDieuTri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'thuốc đang dùng',
                        accessor: 'ViemGanBThuocSuDung'
                    },
                    {
                        Header: 'ngày bắt đầu điều trị',
                        accessor: 'ViemGanBNgayBatDauDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Điều trị bao lâu?(tháng)',
                        accessor: 'ViemGanBThoiGianDieuTri'
                    },
                    {
                        Header: 'Ngày kết thúc điều trị',
                        accessor: 'ViemGanBNgayKetThuDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 1',
                        accessor: 'ViemGanBAmTinhLan1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 2',
                        accessor: 'ViemGanBAmTinhLan2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 3',
                        accessor: 'ViemGanBAmTinhLan3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 4',
                        accessor: 'ViemGanBAmTinhLan4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 1',
                        accessor: 'ViemGanBDuongTinhCopies1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 2',
                        accessor: 'ViemGanBDuongTinhCopies2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 3',
                        accessor: 'ViemGanBDuongTinhCopies3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 4',
                        accessor: 'ViemGanBDuongTinhCopies4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Hoàn tất lộ trình điều trị',
                        accessor: 'ViemGanBHoanTatDieuTriCachNay',
                        Cell: ({cell: {value}}) => `${value} tháng`
                    }
                ]
            },
            {
                Header: 'Viêm gan C',
                columns: [
                    {
                        Header: 'Viêm gan siêu vi C',
                        accessor: 'ViemGanC',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Trước chạy thận nhân tạo',
                        accessor: 'ViemGanCTruocCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Sau chạy thận nhân tạo',
                        accessor: 'ViemGanCSauCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Có điều trị hay không',
                        accessor: 'ViemGanCCoDieuTri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'thuốc đang dùng',
                        accessor: 'ViemGanCThuocSuDung'
                    },
                    {
                        Header: 'ngày bắt đầu điều trị',
                        accessor: 'ViemGanCNgayBatDauDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Điều trị bao lâu?(tháng)',
                        accessor: 'ViemGanCThoiGianDieuTri'
                    },
                    {
                        Header: 'Ngày kết thúc điều trị',
                        accessor: 'ViemGanCNgayKetThuDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 1',
                        accessor: 'ViemGanCAmTinhLan1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 2',
                        accessor: 'ViemGanCAmTinhLan2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 3',
                        accessor: 'ViemGanCAmTinhLan3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 4',
                        accessor: 'ViemGanCAmTinhLan4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 5',
                        accessor: 'ViemGanCAmTinhLan5',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 6',
                        accessor: 'ViemGanCAmTinhLan6',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 7',
                        accessor: 'ViemGanCAmTinhLan7',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 8',
                        accessor: 'ViemGanCAmTinhLan8',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 1',
                        accessor: 'ViemGanCDuongTinhCopies1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 2',
                        accessor: 'ViemGanCDuongTinhCopies2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 3',
                        accessor: 'ViemGanCDuongTinhCopies3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 4',
                        accessor: 'ViemGanCDuongTinhCopies4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Hoàn tất lộ trình điều trị',
                        accessor: 'ViemGanCHoanTatDieuTriCachNay',
                        Cell: ({cell: {value}}) => `${value} tháng`
                    }
                ]
            },
            {
                Header: 'Thông tin khác',
                columns: [
                    {
                        Header: 'Ung thư',
                        accessor: 'BiUngThu',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Phẫu thuật',
                        accessor: 'phauthuat'
                    },
                    {
                        Header: 'Hoá trị',
                        accessor: 'hoatri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Xạ trị',
                        accessor: 'xatri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Truyền máu (Đơn vị)',
                        accessor: 'TruyenMau'
                    },
                    {
                        Header: 'Thời điểm truyền máu',
                        accessor: 'thoidiemtruyenmau',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Sanh con mấy lần',
                        accessor: 'sanhconmaylan'
                    },
                    {
                        Header: 'Thời điểm sanh con lần sau cùng (năm)',
                        accessor: 'sanhconlancuoivaonam'
                    },
                    {
                        Header: 'Đã có ghép thận trước đó',
                        accessor: 'DaGhepLan1Ngay',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Trung tâm ghép thận lần 1',
                        accessor: 'DaGhepLan1TaiBV'
                    },
                    {
                        Header: 'Nguyên nhân gây suy thận ghép',
                        accessor: 'ChuanDoanSuyThanGhep'
                    },
                    {
                        Header: 'Ngày trở lại thận nhân tạo',
                        accessor: 'NgayChayThanTroLai',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 1',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan1NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan1TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan1A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan1B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan1DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan1DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan1DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan1LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan1ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan1TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 2',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan2NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan2TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan2A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan2B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan2DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan2DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan2DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan2LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan2ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan2TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 3',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan3NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan3TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan3A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan3B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan3DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan3DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan3DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan3LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan3ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan3TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 4',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan4NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan4TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan4A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan4B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan4DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan4DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan4DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan4LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan4ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan4TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 5',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan5NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan5TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan5A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan5B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan5DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan5DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan5DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan5LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan5ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan5TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 6',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan6NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan6TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan6A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan6B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan6DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan6DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan6DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan6LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan6ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan6TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 7',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan7NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan7TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan7A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan7B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan7DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan7DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan7DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan7LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan7ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan7TheoDoi'
                    }
                ]
            },
            {
                Header: 'HLA',
                columns: [
                    {
                        Header: 'A',
                        accessor: 'HLAA'
                    },
                    {
                        Header: 'B',
                        accessor: 'HLAB'
                    },
                    {
                        Header: 'DRB1',
                        accessor: 'HLADRB1'
                    },
                    {
                        Header: 'DQA1',
                        accessor: 'HLADQA1'
                    },
                    {
                        Header: 'DQB1',
                        accessor: 'HLADQB1'
                    }
                ]
            },
            {
                Header: 'Ghi chú',
                accessor: 'GhiChu'
            }
        ];
        const columns = useMemo(() => COLUMNS, []);
        const [Data, setData] = useState([]);

        useEffect(() => {
            let obj = [];
            resultAPI.DataTrue.forEach((element) => {
                obj = [
                    ...obj,
                    {
                        ...element.Dangkyghep,
                        ...element.Xetnghiem,
                        idrandom: element.idrandom
                    }
                ];
            });
            setData(obj);
        }, []);
        const data = useMemo(() => Data, [Data]);

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            nextPage,
            previousPage,
            canPreviousPage,
            canNextPage,
            pageOptions,
            state,
            gotoPage,
            pageCount,
            setPageSize,
            prepareRow
        } = useTable(
            {
                columns,
                data,
                initialState: {pageIndex: 0}
            },
            usePagination
        );
        const {pageIndex, pageSize} = state;
        function saveDataTrue(e) {
            const listSendAPI = GetDsCheckedTableHinet('datathantrue');
            let obj = [];
            let newData = [];
            Data.forEach((element) => {
                if (listSendAPI.includes(`${element.idrandom}`)) {
                    obj = [
                        ...obj,
                        resultAPI.DataTrue.find(
                            (x) => x.idrandom === element.idrandom
                        )
                    ];
                } else {
                    newData = [...newData, element];
                }
            });
            if (obj.length > 0) {
                LuuDKGhepThanExcelTrue(obj).then((response) => {
                    if (response.Status) {
                        toast.success('Tạo mới hiến tạng thành công!');
                    } else {
                        toast.error(renderResponse(response.MessageError));
                    }
                    setData(newData);
                    removeCheckAllItem(e, 'datathantrue');
                });
            } else if (Data.length > 0) {
                toast.error('Hãy chọn ít nhất một hàng');
            } else {
                toast.info('Hiện bảng không có dữ liệu');
            }
        }
        return (
            <div className="table-datathantrue">
                <p>Danh sách thông tin hợp lệ ( {Data.length} )</p>
                <div style={{overflowX: 'scroll'}}>
                    <Table
                        {...getTableProps()}
                        id="datathantrue"
                        className=" table table-hinetNew"
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <th
                                        onClick={(e) =>
                                            CheckAllItem(e, 'datathantrue')
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkAll"
                                            onClick={(e) =>
                                                CheckAllItem(e, 'datathantrue')
                                            }
                                        />
                                    </th>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="checkTd"
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        onClick={(e) => CheckRowsHinetTable(e)}
                                    >
                                        <td>
                                            <input
                                                className="checkTd"
                                                type="checkbox"
                                                data-id={row.original.idrandom}
                                                onClick={(e) =>
                                                    CheckRowsHinetTable(e)
                                                }
                                            />
                                        </td>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <Button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </Button>{' '}
                    <Button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Quay lại
                    </Button>{' '}
                    <span>
                        Trang{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        Tiếp
                    </Button>{' '}
                    <Button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </Button>{' '}
                    <span>
                        | Đến trang:{' '}
                        <input
                            type="number"
                            min={0}
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const pageNumber = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                gotoPage(pageNumber);
                            }}
                            style={{width: '50px'}}
                        />
                    </span>{' '}
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50].map((pageSizes) => (
                            <option key={pageSizes} value={pageSizes}>
                                Hiển thị {pageSizes} dòng
                            </option>
                        ))}
                    </select>
                </div>
                <div className="save">
                    <Button onClick={(e) => saveDataTrue(e)}>
                        Lưu thông tin
                    </Button>
                </div>
            </div>
        );
    };
    const ResultExcelFalse = () => {
        const COLUMNS = [
            {
                Header: 'Thông tin chung',
                columns: [
                    {
                        Header: 'Nội dung báo lỗi',
                        accessor: 'MessExcel'
                    },
                    {
                        Header: 'Họ tên',
                        accessor: 'HoTenBN'
                    },
                    {
                        Header: 'Ngày sinh',
                        accessor: 'NgaySinh',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Nhóm máu',
                        accessor: 'NhomMau'
                    },
                    {
                        Header: 'Chiều cao',
                        accessor: 'ChieuCao'
                    },
                    {
                        Header: 'Cân nặng',
                        accessor: 'CanNang'
                    },
                    {
                        Header: 'BMI',
                        accessor: 'chisoBMI'
                    },
                    {
                        Header: 'Ngày ĐK hiến',
                        accessor: 'NgayDKHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Năm phát hiện CTNT trở lại',
                        accessor: 'namphathienctnttrolai'
                    },
                    {
                        Header: 'Thời gian bắt đầu CTNT/TPPM',
                        accessor: 'NgayCTNTHoacKhamThamPhanBenhLy',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Năm bắt đầu điều trị thay thế thận',
                        accessor: 'nambatdaudieutri'
                    },
                    {
                        Header: 'Số năm điều trị thay thế',
                        accessor: 'sonamdieutrithaythe'
                    },
                    {
                        Header: 'CAPD',
                        accessor: 'CAPD',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    }
                ]
            },
            {
                Header: 'Chạy thận nhân tạo',
                columns: [
                    {
                        Header: 'CTNT vào ngày',
                        accessor: 'CTNTVaoNgay'
                    },
                    {
                        Header: 'Ca CTNT',
                        accessor: 'CaCTNT'
                    }
                ]
            },
            {
                Header: 'Thông tin bổ sung',
                columns: [
                    {
                        Header: 'Trung tâm CTNT-TPPM',
                        accessor: 'ChuKyThamPhanTaiBV'
                    },
                    {
                        Header: 'Bác sĩ điều trị',
                        accessor: 'BacSiDieuTri'
                    },
                    {
                        Header: 'Điện thoại bác sĩ',
                        accessor: 'DienThoaiBacSi'
                    },
                    {
                        Header: 'Nghề nghiệp',
                        accessor: 'NgheNghiep'
                    },
                    {
                        Header: 'Nghề nghiệp bổ sung',
                        accessor: 'NgheNhiepBoSung'
                    },
                    {
                        Header: 'Địa chỉ',
                        accessor: 'DiaChiThuongChu'
                    },
                    {
                        Header: 'Điện thoại',
                        accessor: 'DienThoai'
                    },
                    {
                        Header: 'Điện thoại bổ xung',
                        accessor: 'DienThoai1'
                    },
                    {
                        Header: 'Bảo hiểm y tế',
                        accessor: 'BaoHiemYTe'
                    },
                    {
                        Header: 'Kinh tế',
                        accessor: 'ThuNhapBenhNhan'
                    },
                    {
                        Header: 'Lượng nước tiểu ',
                        accessor: 'SoLuongNuocTieu24h'
                    }
                ]
            },
            {
                Header: 'Tiền căn ngoại khoa',
                columns: [
                    {
                        Header: 'Ngoại tổng quát',
                        accessor: 'ngoaitongquat'
                    },
                    {
                        Header: 'Ngoại tiết niệu',
                        accessor: 'ngoaitietnieu'
                    },
                    {
                        Header: 'Khác',
                        accessor: 'tiencanngoaikhoakhac'
                    }
                ]
            },
            {
                Header: 'Tiền căn nội khoa',
                columns: [
                    {
                        Header: 'Hút thuốc (điếu/ ngày)',
                        accessor: 'DieuTrenNgay'
                    },
                    {
                        Header: 'Uống rượu bia (lít/ ngày)',
                        accessor: 'SoLuongLan'
                    },
                    {
                        Header: 'Nguyên nhân suy thận',
                        accessor: 'NguyenNhanSuyThan'
                    },
                    {
                        Header: 'THA',
                        accessor: 'THA',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Bệnh lý tim mạch',
                        accessor: 'benhlytimmach',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Đái tháo đường',
                        accessor: 'DaiThaoDuong',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Thuốc điều trị ',
                        accessor: 'ThuocDieuTriDaiThaoDuong'
                    },
                    {
                        Header: 'Bệnh lý hệ thống đường tiết niệu',
                        accessor: 'benhlyhethongduongtietnieu',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    }
                ]
            },
            {
                Header: 'Viêm gan B',
                columns: [
                    {
                        Header: 'Viêm gan siêu vi B',
                        accessor: 'ViemGanB',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Trước chạy thận nhân tạo',
                        accessor: 'ViemGanBTruocCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Sau chạy thận nhân tạo',
                        accessor: 'ViemGanBSauCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Có điều trị hay không',
                        accessor: 'ViemGanBCoDieuTri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'thuốc đang dùng',
                        accessor: 'ViemGanBThuocSuDung'
                    },
                    {
                        Header: 'ngày bắt đầu điều trị',
                        accessor: 'ViemGanBNgayBatDauDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Điều trị bao lâu?(tháng)',
                        accessor: 'ViemGanBThoiGianDieuTri'
                    },
                    {
                        Header: 'Ngày kết thúc điều trị',
                        accessor: 'ViemGanBNgayKetThuDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 1',
                        accessor: 'ViemGanBAmTinhLan1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 2',
                        accessor: 'ViemGanBAmTinhLan2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 3',
                        accessor: 'ViemGanBAmTinhLan3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 4',
                        accessor: 'ViemGanBAmTinhLan4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 1',
                        accessor: 'ViemGanBDuongTinhCopies1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 2',
                        accessor: 'ViemGanBDuongTinhCopies2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 3',
                        accessor: 'ViemGanBDuongTinhCopies3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 4',
                        accessor: 'ViemGanBDuongTinhCopies4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Hoàn tất lộ trình điều trị',
                        accessor: 'ViemGanBHoanTatDieuTriCachNay',
                        Cell: ({cell: {value}}) => `${value} tháng`
                    }
                ]
            },
            {
                Header: 'Viêm gan C',
                columns: [
                    {
                        Header: 'Viêm gan siêu vi C',
                        accessor: 'ViemGanC',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Trước chạy thận nhân tạo',
                        accessor: 'ViemGanCTruocCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Sau chạy thận nhân tạo',
                        accessor: 'ViemGanCSauCTNT',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Có điều trị hay không',
                        accessor: 'ViemGanCCoDieuTri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'thuốc đang dùng',
                        accessor: 'ViemGanCThuocSuDung'
                    },
                    {
                        Header: 'ngày bắt đầu điều trị',
                        accessor: 'ViemGanCNgayBatDauDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Điều trị bao lâu?(tháng)',
                        accessor: 'ViemGanCThoiGianDieuTri'
                    },
                    {
                        Header: 'Ngày kết thúc điều trị',
                        accessor: 'ViemGanCNgayKetThuDieuTri',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 1',
                        accessor: 'ViemGanCAmTinhLan1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 2',
                        accessor: 'ViemGanCAmTinhLan2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 3',
                        accessor: 'ViemGanCAmTinhLan3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 4',
                        accessor: 'ViemGanCAmTinhLan4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 5',
                        accessor: 'ViemGanCAmTinhLan5',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 6',
                        accessor: 'ViemGanCAmTinhLan6',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 7',
                        accessor: 'ViemGanCAmTinhLan7',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Âm tính lần 8',
                        accessor: 'ViemGanCAmTinhLan8',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 1',
                        accessor: 'ViemGanCDuongTinhCopies1',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 2',
                        accessor: 'ViemGanCDuongTinhCopies2',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 3',
                        accessor: 'ViemGanCDuongTinhCopies3',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Dương tính với copies lần 4',
                        accessor: 'ViemGanCDuongTinhCopies4',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header:
                            'Đã hoàn tất lộ trình điều trị cách nay ... tháng',
                        accessor: 'ViemGanCHoanTatDieuTriCachNay',
                        Cell: ({cell: {value}}) => `${value} tháng`
                    }
                ]
            },
            {
                Header: 'Thông tin khác',
                columns: [
                    {
                        Header: 'Ung thư',
                        accessor: 'BiUngThu',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Phẫu thuật',
                        accessor: 'phauthuat'
                    },
                    {
                        Header: 'Hoá trị',
                        accessor: 'hoatri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Xạ trị',
                        accessor: 'xatri',
                        Cell: ({cell: {value}}) => renderCheckboxinTable(value)
                    },
                    {
                        Header: 'Truyền máu (Đơn vị)',
                        accessor: 'TruyenMau'
                    },
                    {
                        Header: 'Thời điểm truyền máu',
                        accessor: 'thoidiemtruyenmau',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Sanh con mấy lần',
                        accessor: 'sanhconmaylan'
                    },
                    {
                        Header: 'Thời điểm sanh con lần sau cùng (năm)',
                        accessor: 'sanhconlancuoivaonam'
                    },
                    {
                        Header: 'Đã có ghép thận trước đó',
                        accessor: 'DaGhepLan1Ngay',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: 'Trung tâm ghép thận lần 1',
                        accessor: 'DaGhepLan1TaiBV'
                    },
                    {
                        Header: 'Nguyên nhân gây suy thận ghép',
                        accessor: 'ChuanDoanSuyThanGhep'
                    },
                    {
                        Header: 'Ngày trở lại thận nhân tạo',
                        accessor: 'NgayChayThanTroLai',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 1',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan1NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan1TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan1TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan1A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan1B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan1DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan1DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan1DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan1LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan1ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan1TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 2',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan2NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan2TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan2TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan2A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan2B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan2DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan2DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan2DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan2LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan2ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan2TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 3',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan3NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan3TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan3TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan3A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan3B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan3DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan3DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan3DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan3LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan3ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan3TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 4',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan4NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan4TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan4TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan4A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan4B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan4DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan4DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan4DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan4LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan4ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan4TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 5',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan5NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan5TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan5TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan5A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan5B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan5DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan5DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan5DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan5LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan5ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan5TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 6',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan6NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan6TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan6TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan6A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan6B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan6DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan6DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan6DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan6LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan6ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan6TheoDoi'
                    }
                ]
            },
            {
                Header: 'PRA VÀ  Anti HLA antibody Lần 7',
                columns: [
                    {
                        Header: 'Ngày thực hiện',
                        accessor: 'AntibodyLan7NgayThucHien',
                        Cell: ({cell: {value}}) =>
                            CommonUtility.ShowDateVN(value)
                    },
                    {
                        Header: '%PRA',
                        accessor: 'AntibodyLan7TiLePRA',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: '%PRA lớp 2',
                        accessor: 'AntibodyLan7TiLePRASau',
                        Cell: ({cell: {value}}) => renderPhantraminTable(value)
                    },
                    {
                        Header: 'A',
                        accessor: 'AntibodyLan7A'
                    },
                    {
                        Header: 'B',
                        accessor: 'AntibodyLan7B'
                    },
                    {
                        Header: 'DR',
                        accessor: 'AntibodyLan7DR'
                    },
                    {
                        Header: 'DQ',
                        accessor: 'AntibodyLan7DQ'
                    },
                    {
                        Header: 'DP',
                        accessor: 'AntibodyLan7DP'
                    },
                    {
                        Header: 'Lọc huyết tương',
                        accessor: 'AntibodyLan7LocHuyetTuong'
                    },
                    {
                        Header: 'Thuốc UCMD',
                        accessor: 'AntibodyLan7ThuocUCMD'
                    },
                    {
                        Header: 'Theo dõi',
                        accessor: 'AntibodyLan7TheoDoi'
                    }
                ]
            },
            {
                Header: 'HLA',
                columns: [
                    {
                        Header: 'A',
                        accessor: 'HLAA'
                    },
                    {
                        Header: 'B',
                        accessor: 'HLAB'
                    },
                    {
                        Header: 'DRB1',
                        accessor: 'HLADRB1'
                    },
                    {
                        Header: 'DQA1',
                        accessor: 'HLADQA1'
                    },
                    {
                        Header: 'DQB1',
                        accessor: 'HLADQB1'
                    }
                ]
            },
            {
                Header: 'Ghi Chú',
                accessor: 'GhiChu'
            }
        ];
        const columns = useMemo(() => COLUMNS, []);
        const [Data, setData] = useState([]);

        useEffect(() => {
            let obj = [];
            resultAPI.DataFalse.forEach((element) => {
                obj = [
                    ...obj,
                    {
                        ...element.Dangkyghep,
                        ...element.Xetnghiem,
                        idrandom: element.idrandom
                    }
                ];
            });
            setData(obj);
        }, []);
        const data = useMemo(() => Data, [Data]);

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            nextPage,
            previousPage,
            canPreviousPage,
            canNextPage,
            pageOptions,
            state,
            gotoPage,
            pageCount,
            setPageSize,
            prepareRow
        } = useTable(
            {
                columns,
                data,
                initialState: {pageIndex: 0}
            },
            usePagination
        );
        const {pageIndex, pageSize} = state;

        function saveDataFalse(e) {
            const listSendAPI = GetDsCheckedTableHinet('datathanfalse');
            let obj = [];
            let newData = [];
            Data.forEach((element) => {
                if (listSendAPI.includes(`${element.idrandom}`)) {
                    obj = [
                        ...obj,
                        resultAPI.DataFalse.find(
                            (x) => x.idrandom === element.idrandom
                        )
                    ];
                } else {
                    newData = [...newData, element];
                }
            });
            if (obj.length > 0) {
                XuatDKGhepThanExcelFalse(obj).then((response) => {
                    if (response.Status) {
                        toast.success('Tạo File thành công!');
                        const pathDownload = `${Constant.PathServer}/${response.Data}`;
                        downloadFile(pathDownload);
                    } else {
                        toast.error(renderResponse(response.MessageError));
                    }
                    setData(newData);
                    removeCheckAllItem(e, 'datathanfalse');
                });
            } else if (Data.length > 0) {
                toast.error('Hãy chọn ít nhất một hàng');
            } else {
                toast.info('Hiện bảng không có dữ liệu');
            }
        }
        return (
            <div className="table-datathanfalse">
                <p>Danh sách thông tin sai ( {Data.length} )</p>
                <div style={{overflowX: 'scroll'}}>
                    <Table
                        {...getTableProps()}
                        id="datathanfalse"
                        className=" table table-hinetNew"
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <th>
                                        <input
                                            type="checkbox"
                                            className="checkAll"
                                            onClick={(e) =>
                                                CheckAllItem(e, 'datathanfalse')
                                            }
                                        />
                                    </th>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="checkTd"
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        onClick={(e) => CheckRowsHinetTable(e)}
                                    >
                                        <td>
                                            <input
                                                className="checkTd"
                                                type="checkbox"
                                                data-id={row.original.idrandom}
                                                onClick={(e) =>
                                                    CheckRowsHinetTable(e)
                                                }
                                            />
                                        </td>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.column.id ===
                                                        'NgayDKHien' ||
                                                    cell.column.id ===
                                                        'NgayChayThanTroLai' ||
                                                    cell.column.id ===
                                                        'DaGhepLan1Ngay' ||
                                                    cell.column.id ===
                                                        'thoidiemtruyenmau' ||
                                                    cell.column.id ===
                                                        'NgayCTNTHoacKhamThamPhanBenhLy' ||
                                                    cell.column.id ===
                                                        'NgaySinh' ||
                                                    cell.column.id ===
                                                        'NgayCap' ? (
                                                        renderNgayDK(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
                                                    ) : cell.column.id ===
                                                      'MessExcel' ? (
                                                        renderMessExcel(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
                                                    ) : (cell.column.id ===
                                                          'BiDaiThaoDuong' ||
                                                          cell.column.id ===
                                                              'BiUngThu') &&
                                                      cell.value === 1 ? (
                                                        <input
                                                            type="checkbox"
                                                            checked
                                                            readOnly
                                                        />
                                                    ) : (cell.column.id ===
                                                          'BiDaiThaoDuong' ||
                                                          cell.column.id ===
                                                              'BiUngThu') &&
                                                      cell.value === 0 ? (
                                                        <input type="checkbox" />
                                                    ) : cell.value === true ? (
                                                        <input
                                                            type="checkbox"
                                                            checked
                                                            readOnly
                                                        />
                                                    ) : cell.value === false ? (
                                                        <input type="checkbox" />
                                                    ) : (
                                                        cell.render('Cell')
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {/* <td>
                                            <Button
                                                className="btn-nobg btn btn-sm"
                                                style={{borderColor: 'black'}}
                                            >
                                                <i className="fas fa-info-circle" />
                                                &nbsp;Xem chi tiết
                                            </Button>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <Button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {'<<'}
                    </Button>{' '}
                    <Button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Quay lại
                    </Button>{' '}
                    <span>
                        Trang{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        Tiếp
                    </Button>{' '}
                    <Button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </Button>{' '}
                    <span>
                        | Đến trang:{' '}
                        <input
                            type="number"
                            min={0}
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const pageNumber = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                gotoPage(pageNumber);
                            }}
                            style={{width: '50px'}}
                        />
                    </span>{' '}
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50].map((pageSizes) => (
                            <option key={pageSizes} value={pageSizes}>
                                Hiển thị {pageSizes} dòng
                            </option>
                        ))}
                    </select>
                </div>
                <div className="save">
                    <Button onClick={(e) => saveDataFalse(e)}>Tải xuống</Button>
                </div>
            </div>
        );
    };
    return (
        <>
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
            <AdminSecsionHead ModuleName="Nhập dữ liệu đăng ký chờ Ghép Thận từ file Excel" />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    {resultAPI === '' ? (
                                        <Link
                                            to="/admin/dangkychogheptang"
                                            className="btn btn-sm btn-nobg "
                                        >
                                            <i className="fas fa-reply" /> Quay
                                            trở lại
                                        </Link>
                                    ) : (
                                        <Button
                                            className="btn btn-sm btn-nobg "
                                            onClick={() => setresultAPI('')}
                                        >
                                            <i className="fas fa-reply" /> Quay
                                            trở lại
                                        </Button>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        {resultAPI === '' ? (
                                            <SendExcel />
                                        ) : (
                                            <>
                                                <ResultExcelTrue />
                                                <ResultExcelFalse />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
