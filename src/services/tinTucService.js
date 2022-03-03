import * as TypeActions from '@app/store/ActionType/TinTucTypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewTinTuc = (dispatch, objTinTuc) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/Create`, {
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
        body: JSON.stringify(objTinTuc)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Thêm mới tin tức thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINTUC
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const OpenEditModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/GetById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.TINTUC_EDIT_OPEN,
                    tintucObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const EditNewTinTuc = (dispatch, objTinTuc) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/Edit`, {
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
        body: JSON.stringify(objTinTuc)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật tin tức thành công');
                dispatch({
                    type: TypeActions.TINTUC_EDIT_SAVE
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const LoadTinTuc = (dispatch, objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    fetch(`${Constant.PathServer}/api/ManageTinTuc/GetData`, {
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
                type: TypeActions.LOAD_TINTUC,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const OpenDetailModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/GetById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.TINTUC_OPEN_VIEWDETAIL,
                    tintucObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteTinTuc = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/Delete?id=${id}`, {
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
                toast.success('Xóa tin tức thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINTUC,
                    tintucObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteMultiEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/ManageTinTuc/DeleteMulti?id=${id}`, {
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
                toast.success('Xóa tin tức thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_TINTUC,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const GetCategory = (dispatch) => {
    fetch(`${Constant.PathServer}/api/CategoryNews/Index`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.TINTUC_GET_CATEGORY,
                    lstCatetory: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const GetOnlyDataCategory = () => {
    return fetch(`${Constant.PathServer}/api/CategoryNews/Index`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json.Data;
            }
            return null;
        });
};

export const CreateOnlyNewTinTuc = (objTinTuc) => {
    return fetch(`${Constant.PathServer}/api/ManageTinTuc/Create`, {
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
        body: JSON.stringify(objTinTuc)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Thêm mới tin tức thành công');
                return json.Data;
            }
            toast.error(json.MessageError);
            return null;
        });
};
export const EditOnlyTinTuc = (objTinTuc) => {
    return fetch(`${Constant.PathServer}/api/ManageTinTuc/Edit`, {
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
        body: JSON.stringify(objTinTuc)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                toast.success('Cập nhật tin tức thành công');
                return json.Data;
            }
            toast.error(json.MessageError);
            return null;
        });
};
