import * as TypeActions from '@app/store/ActionType/RoleTypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/Role/Create`, {
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
                toast.success('Thêm mới vai trò thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_ROLE
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const GetRoleOperaion = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/Role/GetRoleOperaion?id=${id}`,
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
            return json;
        });
    return data;
};

export const SaveRoleUser = async (obj) => {
    const data = await fetch(`${Constant.PathServer}/api/Role/SaveRoleUser`, {
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
            return json;
        });
    return data;
};

export const SaveOperationData = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/Role/SaveRoleOperation`,
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
export const OpenEditModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/Role/GetDtoById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.ROLE_EDIT_OPEN,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const EditNewEntity = (dispatch, obj) => {
    fetch(`${Constant.PathServer}/api/Role/Edit`, {
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
                toast.success('Cập nhật vai trò thành công');
                dispatch({
                    type: TypeActions.ROLE_EDIT_SAVE
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const LoadAllOfUser = (userId) => {
    const data = fetch(
        `${Constant.PathServer}/api/Role/GetRoleOfUser?id=${userId}`,
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
            // body: JSON.stringify(searchModel)
        }
    )
        .then((response) => response.json())
        .then((json) => {
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
    fetch(`${Constant.PathServer}/api/Role/GetDanhSach`, {
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
                type: TypeActions.LOAD_ROLE,
                allData: json.Data,
                searchModelaction: searchModel
            });
        });
};

export const OpenDetailModalSV = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/Role/GetDtoById?id=${id}`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.ROLE_OPEN_VIEWDETAIL,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/Role/Delete?id=${id}`, {
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
                toast.success('Xóa vai trò thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_ROLE,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};

export const DeleteMultiEntity = (dispatch, id) => {
    fetch(`${Constant.PathServer}/api/Role/DeleteMulti?id=${id}`, {
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
                toast.success('Xóa vai trò thành công');
                dispatch({
                    type: TypeActions.HASUPDATE_ROLE,
                    entityObj: json.Data
                });
            } else {
                toast.error(json.MessageError);
            }
        });
};
