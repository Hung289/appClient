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
    NhapDKHTExcel,
    LuuDKHTExcelTrue,
    XuatDKHTExcelFalse
} from '@app/services/TinhNangMoRongService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem,
    removeCheckAllItem
} from '@modules/Common/TableCommon';
import ReactLoading from 'react-loading';
import AdminSecsionHead from '../AdminSecsionHead';

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
                    Masothe: 0,
                    NamDK: 1,
                    NgayDK: 2,
                    Ho: 3,
                    Ten: 4,
                    Namsinh: 5,
                    GioiTinh: 7,
                    SoDienThoai: 8,
                    Diachi: 9,
                    CMND: 11,
                    Ngaycap: 12,
                    Noicap: 13,
                    VienchucAndNhanvien: 14,
                    CongChuc: 15,
                    CongNhan: 16,
                    BuonbanAndKinhdoanh: 17,
                    Doanhnghiep: 18,
                    Loadongtudo: 19,
                    Noitro: 20,
                    Huutri: 21,
                    Ketoan: 22,
                    Nhanvienvanphong: 23,
                    Congan: 24,
                    Lamnong: 25,
                    Khac: 26,
                    Sinhvien: 27,
                    Phongvien: 28,
                    Laixe: 29,
                    Luatsu: 30,
                    Kysu: 31,
                    KOLS: 32,
                    Than: 33,
                    Gan: 34,
                    Tim: 35,
                    Phoi: 36,
                    Tuy: 37,
                    Ruot: 38,
                    Giacmac: 39,
                    Da: 40,
                    Vantim: 41,
                    Machmau: 42,
                    Chithe: 43,
                    HotroDuaveGiadinh: 44,
                    Hoatang: 45,
                    HoatangNguoinhaNhan: 46,
                    HoatangDuaTrocotveChuaNhaTho: 47,
                    DinguyenKhac: 48,
                    Ghichu: 49
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
                        NhapDKHTExcel(formdata).then((response) => {
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
                                <p>Chọn File Excel Hiến tạng</p>
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
                                            <label htmlFor="Masothe">
                                                Mã số thẻ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Masothe"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="NamDK">
                                                Năm đăng ký
                                            </label>
                                        </td>
                                        <td>
                                            <Field name="NamDK" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="NgayDK">
                                                Ngày đăng ký
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="NgayDK"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Ho">Họ</label>
                                        </td>
                                        <td>
                                            <Field name="Ho" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Ten">Tên</label>
                                        </td>
                                        <td>
                                            <Field name="Ten" type="number" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Namsinh">
                                                Năm sinh
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Namsinh"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="SoDienThoai">
                                                Số điện thoại
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="SoDienThoai"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Diachi">
                                                Địa chỉ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Diachi"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CMND">
                                                Số CMND
                                            </label>
                                        </td>
                                        <td>
                                            <Field name="CMND" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Ngaycap">
                                                Ngày cấp
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Ngaycap"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Noicap">
                                                Nơi cấp
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Noicap"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="dongbatdau">
                                                Dòng bắt đầu đọc
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="dongbatdau"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Nghề Nghiệp</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="VienchucAndNhanvien">
                                                Viên chức/ Nhân viên
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="VienchucAndNhanvien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CongChuc">
                                                Công chức
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CongChuc"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="CongNhan">
                                                Công nhân
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="CongNhan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="BuonbanAndKinhdoanh">
                                                Buôn bán/ Kinh doanh
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="BuonbanAndKinhdoanh"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Doanhnghiep">
                                                Doanh nghiệp/ Sale
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Doanhnghiep"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Loadongtudo">
                                                Lao động tự do
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Loadongtudo"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Noitro">
                                                Nội trợ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Noitro"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Huutri">
                                                Hưu trí
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Huutri"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Ketoan">
                                                Kế toán
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Ketoan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Nhanvienvanphong">
                                                Nhân viên văn phòng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Nhanvienvanphong"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Congan">
                                                Công an
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Congan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Lamnong">
                                                Làm nông
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Lamnong"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Khac">khác</label>
                                        </td>
                                        <td>
                                            <Field name="Khac" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Sinhvien">
                                                Sinh viên
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Sinhvien"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Phongvien">
                                                Phóng viên
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Phongvien"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Laixe">
                                                Lái xe
                                            </label>
                                        </td>
                                        <td>
                                            <Field name="Laixe" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Luatsu">
                                                Luật sư
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Luatsu"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Kysu">Kỹ sư</label>
                                        </td>
                                        <td>
                                            <Field name="Kysu" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="KOLS">KOLS</label>
                                        </td>
                                        <td>
                                            <Field name="KOLS" type="number" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Cơ Quan Hiến</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Than">Thận</label>
                                        </td>
                                        <td>
                                            <Field name="Than" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Gan">Gan</label>
                                        </td>
                                        <td>
                                            <Field name="Gan" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Tim">Tim</label>
                                        </td>
                                        <td>
                                            <Field name="Tim" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Phoi">Phổi</label>
                                        </td>
                                        <td>
                                            <Field name="Phoi" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Tuy">Tuỵ</label>
                                        </td>
                                        <td>
                                            <Field name="Tuy" type="number" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Ruot">Ruột</label>
                                        </td>
                                        <td>
                                            <Field name="Ruot" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Giacmac">
                                                Giác mạc
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Giacmac"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Da">Da</label>
                                        </td>
                                        <td>
                                            <Field name="Da" type="number" />
                                        </td>
                                        <td>
                                            <label htmlFor="Chithe">
                                                Chi thể
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Chithe"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={10}>Di nguyện</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="HotroDuaveGiadinh">
                                                Hỗ trợ đưa cơ thể về gia đình
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HotroDuaveGiadinh"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="Hoatang">
                                                Hỏa táng
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Hoatang"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="HoatangNguoinhaNhan">
                                                Hỏa táng người nhà nhận
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HoatangNguoinhaNhan"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="HoatangDuaTrocotveChuaNhaTho">
                                                Hỏa táng đưa tro cốt về chùa/nhà
                                                thờ
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="HoatangDuaTrocotveChuaNhaTho"
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="DinguyenKhac">
                                                Di nguyện khác
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="DinguyenKhac"
                                                type="number"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="Ghichu">
                                                Ghi chú
                                            </label>
                                        </td>
                                        <td>
                                            <Field
                                                name="Ghichu"
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
    const ResultExcelTrue = () => {
        const COLUMNS = [
            {
                Header: 'Mã số thẻ',
                accessor: 'MaSo'
            },
            {
                Header: 'Họ tên',
                accessor: 'HoTen'
            },
            {
                Header: 'Số CMND',
                accessor: 'SoCMND'
            },
            {
                Header: 'Ngày đăng ký',
                accessor: 'NgayDK'
            },
            {
                Header: 'Năm đăng ký',
                accessor: 'NamDK'
            },
            {
                Header: 'Nghề nghiệp',
                accessor: 'NgheNghiep'
            },
            {
                Header: 'Giới tính',
                accessor: 'GioiTinh'
            },
            {
                Header: 'Năm sinh',
                accessor: 'NamSinh'
            },
            {
                Header: 'Số điện thoại',
                accessor: 'SoDienThoai'
            },
            {
                Header: 'Địa chỉ thường trú',
                accessor: 'DiaChi'
            },
            {
                Header: 'Ngày cấp',
                accessor: 'NgayCap'
            },
            {
                Header: 'Nơi cấp',
                accessor: 'NoiCap'
            },
            {
                Header: 'Di nguyện',
                accessor: 'DiNguyen'
            },
            {
                Header: 'Di nguyện khác',
                accessor: 'DiNguyenKhac'
            },
            {
                Header: 'Thận',
                accessor: 'Than'
            },
            {
                Header: 'Gan',
                accessor: 'Gan'
            },
            {
                Header: 'Tim',
                accessor: 'Tim'
            },
            {
                Header: 'Phổi',
                accessor: 'Phoi'
            },
            {
                Header: 'Tuỵ',
                accessor: 'TuyTang'
            },
            {
                Header: 'Ruột',
                accessor: 'Ruot'
            },
            {
                Header: 'Giác mạc',
                accessor: 'GiacMac'
            },
            {
                Header: 'Da',
                accessor: 'Da'
            },
            {
                Header: 'Chi thể',
                accessor: 'Xuong'
            },
            {
                Header: 'Ghi chú',
                accessor: 'GhiChu'
            }
        ];
        const columns = useMemo(() => COLUMNS, []);
        const [Data, setData] = useState([]);

        useEffect(() => {
            setData(resultAPI.DataTrue);
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
            const listSendAPI = GetDsCheckedTableHinet('datatrue');
            let obj = [];
            let newData = [];
            Data.forEach((element) => {
                if (listSendAPI.includes(`${element.idrandom}`)) {
                    obj = [...obj, element];
                } else {
                    newData = [...newData, element];
                }
            });
            if (obj.length > 0) {
                LuuDKHTExcelTrue(obj).then((response) => {
                    if (response.Status) {
                        toast.success('Tạo mới hiến tạng thành công!');
                    } else {
                        toast.error(renderResponse(response.MessageError));
                    }
                    setData(newData);
                    removeCheckAllItem(e, 'datatrue');
                });
            } else if (Data.length > 0) {
                toast.error('Hãy chọn ít nhất một hàng');
            } else {
                toast.info('Hiện bảng không có dữ liệu');
            }
        }
        return (
            <div className="table-datatrue">
                <p>Danh sách thông tin hợp lệ ( {Data.length} )</p>
                <div style={{overflowX: 'scroll'}}>
                    <Table
                        {...getTableProps()}
                        id="datatrue"
                        className=" table table-hinetNew"
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <th
                                        onClick={(e) =>
                                            CheckAllItem(e, 'datatrue')
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkAll"
                                            onClick={(e) =>
                                                CheckAllItem(e, 'datatrue')
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
                                                    'NgayDK' ? (
                                                        renderNgayDK(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
                                                    ) : cell.column.id ===
                                                      'NgayCap' ? (
                                                        renderNgayDK(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
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
                Header: 'Mã số thẻ',
                accessor: 'MaSo'
            },
            {
                Header: 'Họ tên',
                accessor: 'HoTen'
            },
            {
                Header: 'Số CMND',
                accessor: 'SoCMND'
            },
            {
                Header: 'Ngày đăng ký',
                accessor: 'NgayDK'
            },
            {
                Header: 'Năm đăng ký',
                accessor: 'NamDK'
            },
            {
                Header: 'Nghề nghiệp',
                accessor: 'NgheNghiep'
            },
            {
                Header: 'Nội dung lỗi',
                accessor: 'MessExcel'
            },
            {
                Header: 'Giới tính',
                accessor: 'GioiTinh'
            },
            {
                Header: 'Năm sinh',
                accessor: 'NamSinh'
            },
            {
                Header: 'Số điện thoại',
                accessor: 'SoDienThoai'
            },
            {
                Header: 'Địa chỉ thường trú',
                accessor: 'DiaChi'
            },
            {
                Header: 'Ngày cấp',
                accessor: 'NgayCap'
            },
            {
                Header: 'Nơi cấp',
                accessor: 'NoiCap'
            },
            {
                Header: 'Di nguyện',
                accessor: 'DiNguyen'
            },
            {
                Header: 'Di nguyện khác',
                accessor: 'DiNguyenKhac'
            },
            {
                Header: 'Thận',
                accessor: 'Than'
            },
            {
                Header: 'Gan',
                accessor: 'Gan'
            },
            {
                Header: 'Tim',
                accessor: 'Tim'
            },
            {
                Header: 'Phổi',
                accessor: 'Phoi'
            },
            {
                Header: 'Tuỵ',
                accessor: 'TuyTang'
            },
            {
                Header: 'Ruột',
                accessor: 'Ruot'
            },
            {
                Header: 'Giác mạc',
                accessor: 'GiacMac'
            },
            {
                Header: 'Da',
                accessor: 'Da'
            },
            {
                Header: 'Chi thể',
                accessor: 'Xuong'
            },
            {
                Header: 'Ghi chú',
                accessor: 'GhiChu'
            }
        ];
        const columns = useMemo(() => COLUMNS, []);
        const [Data, setData] = useState([]);

        useEffect(() => {
            setData(resultAPI.DataFalse);
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
            const listSendAPI = GetDsCheckedTableHinet('datafalse');
            let obj = [];
            let newData = [];
            Data.forEach((element) => {
                if (listSendAPI.includes(`${element.idrandom}`)) {
                    obj = [...obj, element];
                } else {
                    newData = [...newData, element];
                }
            });
            if (obj.length > 0) {
                XuatDKHTExcelFalse(obj).then((response) => {
                    if (response.Status) {
                        toast.success('Tạo File thành công!');
                        const pathDownload = `${Constant.PathServer}/${response.Data}`;
                        downloadFile(pathDownload);
                    } else {
                        toast.error(renderResponse(response.MessageError));
                    }
                    setData(newData);
                    removeCheckAllItem(e, 'datafalse');
                });
            } else if (Data.length > 0) {
                toast.error('Hãy chọn ít nhất một hàng');
            } else {
                toast.info('Hiện bảng không có dữ liệu');
            }
        }
        return (
            <div className="table-datafalse">
                <p>Danh sách thông tin sai ( {Data.length} )</p>
                <div style={{overflowX: 'scroll'}}>
                    <Table
                        {...getTableProps()}
                        id="datafalse"
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
                                                CheckAllItem(e, 'datafalse')
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
                                                    'NgayDK' ? (
                                                        renderNgayDK(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
                                                    ) : cell.column.id ===
                                                      'NgayCap' ? (
                                                        renderNgayDK(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
                                                    ) : cell.value === true ? (
                                                        <input
                                                            type="checkbox"
                                                            checked
                                                            readOnly
                                                        />
                                                    ) : cell.value === false ? (
                                                        <input type="checkbox" />
                                                    ) : cell.column.id ===
                                                      'MessExcel' ? (
                                                        renderMessExcel(
                                                            cell.render('Cell')
                                                                .props.cell
                                                                .value
                                                        )
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
            <AdminSecsionHead ModuleName="Nhập dữ liệu hiến tạng từ file Excel" />
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="p-2 card-header">
                                    {resultAPI === '' ? (
                                        <Link
                                            to="/admin/dangkyhientang"
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
