import * as TypeActions from '@app/store/ActionType/TINHTypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

export const CreateNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/TINH/Create`, {
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
                toast.success('Thêm mới tỉnh thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINH
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const OpenEditModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/TINH/GetById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.TINH_EDIT_OPEN,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const EditNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/TINH/Edit`, {
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
                toast.success('Cập nhật tỉnh thành công');
                dispatch({
                    type: TypeActions.TINH_EDIT_SAVE
                });
            } else {
                toast.error(json.MessageError);
            }
        });
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
    fetch(`${Constant.PathServer}/api/TINH/GetData`, {
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
                type: TypeActions.LOAD_TINH,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const OpenDetailModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/TINH/GetById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.TINH_OPEN_VIEWDETAIL,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/TINH/Delete?id=${id}`, {
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
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Xóa tỉnh thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINH,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteMultiEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/TINH/DeleteMulti?id=${id}`, {
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
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Xóa tỉnh thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINH,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
