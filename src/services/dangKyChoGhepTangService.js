import * as TypeActions from '@app/store/ActionType/DangKyChoGhepTangTypeAction';
import * as ActionTypesDtn from '@app/store/ActionType/ChoGhepDaTiepNhanTypeAction';
import * as ActionTypesCtn from '@app/store/ActionType/ChoGhepChoTiepNhanTypeAction';
import * as ActionTypesTc from '@app/store/ActionType/ChoGhepDaTuChoiTypeAction';
import * as ActionTypesHuy from '@app/store/ActionType/ChoGhepDaHuyTypeAction';

import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/CreateAdmin`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Thêm mới đăng ký chờ ghép tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return data;
};
export const OpenChangeStatusModalSV = (dispatch, id, status) => {
    fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.DANGKYCHOGHEPTANG_CHANGESTATUS_OPEN,
                    entityObj: json.Data,
                    statusNew: status
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
export const OpenEditModalSV = async (id, type) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                // dispatch({
                //     type: TypeActions.DANGKYCHOGHEPTANG_EDIT_OPEN,
                //     entityObj: json.Data,
                //     typeCreate: type
                // });
                return {
                    type: TypeActions.DANGKYCHOGHEPTANG_EDIT_OPEN,
                    entityObj: json.Data,
                    typeCreate: type
                };
            }
            toast.error(json.MessageError);
            return {};
        });
    return data;
};
export const LoadFileThanDK = (dispatch, Id) => {
    fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileDangKyPDF?Id=${Id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.LOAD_DANGKYCHOGHEPTANG_THAN_PDF,
                    FileThanDK: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const LoadFileKhacDK = (dispatch, Id) => {
    fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDangKyGTangKhacPDF?Id=${Id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.LOAD_DANGKYCHOGHEPTANG_KHAC_PDF,
                    FileKhacDK: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
export const LoadFileThanDKPDF = async (Id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileDangKyPDF?Id=${Id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json;
            }
            return json;
        });
    return data;
};

export const LoadFileKhacDKPDF = async (Id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDangKyGTangKhacPDF?Id=${Id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json;
            }
            return json;
        });
    return data;
};

export const EditNewEntityUser = async (obj) => {
    console.log(obj);
    const data = await fetch(
        `${Constant.PathServer}/api/HienVaGhep/EditChoGhep`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
    return data;
};

export const EditNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/Edit`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật đăng ký chờ ghép tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return data;
};

export const ChangeStatusNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/ChangeStatus`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Chuyển trạng thái thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};

export const LoadEntity = (dispatch, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/GetDanhSach`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(searchModel)
    })
        .then((response) => response.json())
        .then((json) => {
            CheckLogin(dispatch, json);
            dispatch({
                type: TypeActions.LOAD_DANGKYCHOGHEPTANG,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const LoadEntityDaTiepNhan = (dispatch, typeStatus, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(searchModel)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            CheckLogin(dispatch, json);
            dispatch({
                type: ActionTypesDtn.LOAD_CHOGHEP_DATIEPNHAN,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const LoadEntityDaTuChoi = (dispatch, typeStatus, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(searchModel)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            CheckLogin(dispatch, json);
            dispatch({
                type: ActionTypesTc.LOAD_CHOGHEP_DATUCHOI,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const LoadEntityDaHuy = (dispatch, typeStatus, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(searchModel)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            CheckLogin(dispatch, json);
            dispatch({
                type: ActionTypesHuy.LOAD_CHOGHEP_DAHUY,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const LoadEntityChoTiepNhan = async (coquan, typeStatus, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDanhSach?coquan=${coquan}&typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(searchModel)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
    return data;
};

export const GetDetailDto = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json.Data;
            }
            return null;
        });
    return data;
};

export const OpenDetailModalSV = async (id, type) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return {
                    Status: json.Status,
                    entityObj: json.Data,
                    typeCreate: type
                };
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};

export const OpenDetail = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
    return data;
};

export const DeleteEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/Delete?id=${id}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Xóa đăng ký hiến tạng thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
    // .then((response) => response.json())
    // .then((json) => {
    //     if (json.Status) {
    //         toast.success('Xóa đăng ký chờ ghép tạng thành công');
    //         dispatch({
    //             type: TypeActions.HASUPDATE_DANGKYCHOGHEPTANG,
    //             entityObj: json.Data
    //         });
    //     } else {
    //         toast.error(json.MessageError);
    //     }
    // });
};

export const SendMailThongBao = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/SendMail?id=${id}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Gửi email thông báo thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_DANGKYCHOGHEPTANG,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const SaveChangeStatus = (dispatch, objData) => {
    fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/ChangeStatus`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(objData)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Chuyển trạng thái thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_DANGKYCHOGHEPTANG,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteMultiEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/DeleteMulti?id=${id}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(id)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Xóa đăng ký hiến tạng thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
    // .then((response) => response.json())
    // .then((json) => {
    //     if (json.Status) {
    //         toast.success('Xóa đăng ký chờ ghép tạng thành công');
    //         dispatch({
    //             type: TypeActions.HASUPDATE_DANGKYCHOGHEPTANG,
    //             entityObj: json.Data
    //         });
    //     } else {
    //         toast.error(json.MessageError);
    //     }
    // });
};
export const InPhieuDKThan = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileDangKyGThan?id=${id}`,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Tạo file thành công');
            } else {
                toast.error(json.MessageError);
                return null;
            }
            return json;
        });
    return dt;
};
export const InPhieuDKTangKhac = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileDangKyGTangKhac?id=${id}`,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Tạo file thành công');
            } else {
                toast.error(json.MessageError);
                return null;
            }
            return json;
        });
    return dt;
};

// Thông báo xét nghiệm
export const OpenThongBaoXNModalSV = (dispatch, id, status) => {
    fetch(`${Constant.PathServer}/api/DangKyChoGhepThan/GetDtoById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.DANGKYCHOGHEPTANG_THONGBAOXN_OPEN,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
export const SaveThongBaoXN = (objData) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/SendMail`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(objData)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Gửi thông báo đến người đăng ký thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });

    return data;
};

export const SaveThongBaoXNMuti = (objData) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/SendMailMuti`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(objData)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Gửi thông báo đến người đăng ký thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });

    return data;
    // .then((response) => response.json())
    // .then((json) => {
    //     if (json.Status) {
    //         toast.success('Gửi thông báo đến người đăng ký thành công');
    //         dispatch({
    //             type: TypeActions.DANGKYCHOGHEPTANG_THONGBAOXNMUTI_SAVE
    //         });
    //     } else {
    //         toast.error(json.MessageError);
    //     }
    // });
};
export const SaveHSBanCung = (Obj) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/HSBanCungUpdate`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(Obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật đăng ký ghép tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });

    return data;
};

export const SaveLyDoOutDs = (Obj) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/SaveLyDoOutDS`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(Obj)
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật thành công lý do');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });

    return data;
};

export const InPhieuHuyDKThan = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileHuyDangKyThan?id=${id}`,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Tạo file thành công');
            } else {
                toast.error(json.MessageError);
                return null;
            }
            return json;
        });
    return dt;
};

export const InPhieuHuyDKTangKhac = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyChoGhepThan/GetFileHuyDangKyKhac?id=${id}`,
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Tạo file thành công');
            } else {
                toast.error(json.MessageError);
                return null;
            }
            return json;
        });
    return dt;
};
