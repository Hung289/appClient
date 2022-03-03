import * as TypeActions from '@app/store/ActionType/DangKyHienTangTypeAction';
import * as TypeActionsCho from '@app/store/ActionType/DangKyHienTangChoTiepNhanTypeAction';
import * as TypeActionsDa from '@app/store/ActionType/DangKyHienTangDaTiepNhanTypeAction';
import * as TypeActionsTuChoi from '@app/store/ActionType/DangKyHienTangTuChoiTypeAction';
import * as TypeActionshuy from '@app/store/ActionType/DangKyHienTangHuyDangKyTypeAction';
import {toast} from 'react-toastify';
import {CheckLogin} from '@modules/Common/CommonUtility';
import * as Constant from '@app/Constant';
// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = async (obj) => {
    console.log(obj);
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyHien/CreateAdmin`,
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
                toast.success('Thêm mới đăng ký hiến tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return data;
    // .then((response) => response.json())
    // .then((json) => {
    //     if (json.Status) {
    //         toast.success('Thêm mới đăng ký hiến tạng thành công');
    //         dispatch({
    //             type: TypeActions.HASUPDATE_DANGKYHIENTANG
    //         });
    //     } else {
    //         toast.error(json.MessageError);
    //     }
    // });
};

export const GetDetailDto = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyHien/GetById?id=${id}`,
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
            referrerPolicy: 'no-referrer'
        }
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

export const OpenEditModalSV = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyHien/GetById?id=${id}`
    )
        // fetch(`${Constant.PathServer}/api/DangKyHien/GetById?id=${id}`, {
        //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //     mode: 'cors', // no-cors, *cors, same-origin
        //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: 'same-origin', // include, *same-origin, omit
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //         // 'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     redirect: 'follow', // manual, *follow, error
        //     referrerPolicy: 'no-referrer'
        // })
        .then((response) => response.json())
        .then((json) => {
            // if (json.Status) {
            //     dispatch({
            //         type: TypeActions.DANGKYHIENTANG_EDIT_OPEN,
            //         entityObj: json.Data
            //     });
            // } else {
            //     toast.error(json.MessageError);
            // }
            if (json.Status) {
                return {
                    type: TypeActions.DANGKYHIENTANG_EDIT_OPEN,
                    entityObj: json.Data
                };
            }
            toast.error(json.MessageError);
            return {};
        });
    return data;
};
export const LoadFileDK = (dispatch, Id) => {
    fetch(`${Constant.PathServer}/api/DangKyHien/GetFileDangKyPDF?Id=${Id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.LOAD_DANGKYHIENTANG_FILE,
                    FileDK: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const LoadFileDKPDF = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyHien/GetFileDangKyPDF?Id=${id}`
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
    const data = await fetch(
        `${Constant.PathServer}/api/HienVaGhep/EditHienTang`,
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
    const data = await fetch(`${Constant.PathServer}/api/DangKyHien/Edit`, {
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
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật đăng ký hiến tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
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
    fetch(`${Constant.PathServer}/api/DangKyHien/GetDanhSach`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(searchModel)
    })
        .then((response) => response.json())
        .then((json) => {
            CheckLogin(dispatch, json);
            dispatch({
                type: TypeActions.LOAD_DANGKYHIENTANG,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const LoadEntityByType = async (typeStatus, objSearch) => {
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
        `${Constant.PathServer}/api/DangKyHien/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${localStorage.getItem('token')}`
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
export const LoadEntityByDaTiepNhan = (dispatch, typeStatus, objSearch) => {
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
        `${Constant.PathServer}/api/DangKyHien/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${localStorage.getItem('token')}`
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
                type: TypeActionsDa.LOAD_DANGKYHIENTANG_DATIEPNHAN,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};
export const LoadEntityByDaTuChoi = (dispatch, typeStatus, objSearch) => {
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
        `${Constant.PathServer}/api/DangKyHien/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${localStorage.getItem('token')}`
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
                type: TypeActionsTuChoi.LOAD_DANGKYHIENTANG_TUCHOI,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};
export const LoadEntityByHuyDangKy = (dispatch, typeStatus, objSearch) => {
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
        `${Constant.PathServer}/api/DangKyHien/GetDanhSach?typetrangthai=${typeStatus}`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${localStorage.getItem('token')}`
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
                type: TypeActionshuy.LOAD_DANGKYHIENTANG_HUYDANGKY,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const OpenDetailModalSV = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyHien/GetById?id=${id}`,
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
            referrerPolicy: 'no-referrer'
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json;
                // dispatch({
                //     type: TypeActions.DANGKYHIENTANG_OPEN_VIEWDETAIL,
                //     entityObj: json.Data
                // });
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};

export const DeleteEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyHien/Delete?id=${id}`,
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
};

export const InTheDangKy = async (dispatch, id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyHien/InTheDangKyHien?id=${id}`,
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
                toast.success('Tạo thẻ thành công');
            } else {
                toast.error(json.MessageError);
                return null;
            }
            return json;
        });
    return dt;
};

export const InPhieuDK = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyHien/GetFileDangKy?id=${id}`,
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
export const SaveChangeIsGuiThe = (objData) => {
    const data = fetch(`${Constant.PathServer}/api/DangKyHien/ChangeIsGuiThe`, {
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
            return json;
        });
    return data;
};
export const SaveChangeIsGuiTheMuti = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyHien/ChangeIsGuiTheMuti`,
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
            return json;
        });
    return data;
};

export const SaveChangeStatus = (dispatch, objData) => {
    fetch(`${Constant.PathServer}/api/DangKyHien/ChangeStatus`, {
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
                    type: TypeActions.HASUPDATE_DANGKYHIENTANG,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const ChangeStatusNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/DangKyHien/ChangeStatus`,
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
export const DeleteMultiEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyHien/DeleteMulti?id=${id}`,
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
    //         toast.success('Xóa đăng ký hiến tạng thành công');
    //         dispatch({
    //             type: TypeActions.HASUPDATE_DANGKYHIENTANG,
    //             entityObj: json.Data
    //         });
    //     } else {
    //         toast.error(json.MessageError);
    //     }
    // });
};

export const SaveHSBanCung = (Obj) => {
    const data = fetch(
        `${Constant.PathServer}/api/DangKyHien/HSBanCungUpdate`,
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
                toast.success('Cập nhật đăng ký hiến tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });

    return data;
};

export const InPhieuHuyDK = async (id) => {
    const dt = await fetch(
        `${Constant.PathServer}/api/DangKyHien/GetFileHuyDangKy?id=${id}`,
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
