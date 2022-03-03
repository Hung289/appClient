import * as TypeActions from '@app/store/ActionType/KQXetNghiemTypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = (obj) => {
    const data = fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/Create`,
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
export const OpenEditModalSV = (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/GetById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return {
                    type: TypeActions.KQXETNGHIEM_EDIT_OPEN,
                    entityKQObj: json.Data
                };
            }
            toast.error(json.MessageError);
            return {};
        });
    return data;
};

export const EditNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/Edit`,
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
    fetch(`${Constant.PathServer}/api/KetQuaXetNghieChoGhep/GetDanhSach`, {
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
                type: TypeActions.LOAD_KQXETNGHIEM,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const GetDetailDto = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/GetDtoById?id=${id}`
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

export const OpenDetailModalSV = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/GetByIdPhieuDK?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return {
                    Status: json.Status,
                    entityKQObj: json.Data
                };
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
    // fetch(
    //     `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/GetByIdPhieuDK?id=${id}`
    // )
    //     .then((response) => response.json())
    //     .then((json) => {
    //         if (json.Status) {
    //             dispatch({
    //                 type: TypeActions.KQXETNGHIEM_OPEN_VIEWDETAIL,
    //                 entityKQObj: json.Data,
    //                 showDetailKQModal: true
    //             });
    //         } else {
    //             toast.error(json.MessageError);
    //         }
    //     });
};

export const DeleteEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/Delete?id=${id}`,
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
            return json;
            // if (json.Status) {
            //     toast.success('Xóa đăng ký chờ ghép tạng thành công');
            //     dispatch({
            //         type: TypeActions.HASUPDATE_KQXETNGHIEM,
            //         entityKQObj: json.Data
            //     });
            // } else {
            //     toast.error(json.MessageError);
            // }
        });
    return data;
};

export const DeleteMultiEntity = (dispatch, id) => {
    fetch(
        `${Constant.PathServer}/api/KetQuaXetNghieChoGhep/DeleteMulti?id=${id}`,
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
                toast.success('Xóa đăng ký chờ ghép tạng thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_KQXETNGHIEM,
                    entityKQObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
