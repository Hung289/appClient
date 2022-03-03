import * as TypeActions from '@app/store/ActionType/CommonConfigTypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/Create`, {
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
                toast.success('Thêm mới cấu hình chung thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_COMMONCONFIG
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const OpenEditModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/GetById?id=${id}`, {
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
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.COMMONCONFIG_EDIT_OPEN,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const EditNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/Edit`, {
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
                toast.success('Cập nhật cấu hình chung thành công');
                dispatch({
                    type: TypeActions.COMMONCONFIG_EDIT_SAVE
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
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/GetDanhSach`, {
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
                type: TypeActions.LOAD_COMMONCONFIG,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const OpenDetailModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/GetById?id=${id}`, {
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
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.COMMONCONFIG_OPEN_VIEWDETAIL,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/Delete?id=${id}`, {
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
                toast.success('Xóa cấu hình chung thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_COMMONCONFIG,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteMultiEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/COMMONCONFIG/DeleteMulti?id=${id}`, {
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
                toast.success('Xóa nhóm thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_COMMONCONFIG,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
