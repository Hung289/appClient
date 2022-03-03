// import * as TypeActions from '@app/store/ActionType/KQXetNghiemHLATypeAction';
import {toast} from 'react-toastify';
import * as Constant from '@app/Constant';
import * as UtilRequest from '@modules/Common/UtilRequest';
import {CheckLogin} from '@modules/Common/CommonUtility';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = async (obj) => {
    const dataRequst = await fetch(
        `${Constant.PathServer}/api/KQXetNghiemHLA/Create`,
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
                toast.success('Thêm mới danh mục thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return dataRequst;
};

export const OpenEditModalSV = (id) => {
    const dataRequst = fetch(
        `${Constant.PathServer}/api/KQXetNghiemHLA/GetById?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                return json;
            }
            toast.error(json.MessageError);
            return json;
        });

    return dataRequst;
};

export const EditNewEntity = async (obj) => {
    const dataRequst = await UtilRequest.RequestAuth(
        `${Constant.PathServer}/api/KQXetNghiemHLA/Edit`,
        'POST',
        obj
    ).then((rs) => {
        return rs;
    });
    return dataRequst;
};
export const GetKQXetNghiem = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/KQXetNghiemHLA/GetByIdPhieuDK?id=${id}`
    )
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
    return data;
};
export const LoadEntity = async (objSearch) => {
    const searchModel = {
        ...objSearch
    };
    if (objSearch == null || objSearch.PageIndex == null) {
        searchModel.PageIndex = 1;
    }
    if (objSearch == null || objSearch.PageSize == null) {
        searchModel.PageSize = 20;
    }
    const dataRequst = await UtilRequest.RequestAuth(
        `${Constant.PathServer}/api/KQXetNghiemHLA/GetDanhSach`,
        'POST',
        searchModel
    ).then((rs) => {
        return rs;
    });
    return dataRequst;
};

export const GetDetailById = async (id) => {
    const dataRequst = await UtilRequest.RequestAuth(
        `${Constant.PathServer}/api/KQXetNghiemHLA/GetDtoById?id=${id}`,
        'GET'
    ).then((rs) => {
        return rs;
    });
    return dataRequst;
};

export const DeleteEntity = async (id) => {
    const dataRequst = await UtilRequest.RequestAuth(
        `${Constant.PathServer}/api/KQXetNghiemHLA/Delete?id=${id}`,
        'POST',
        null
    ).then((rs) => {
        return rs;
    });
    return dataRequst;
};

export const DeleteMultiEntity = async (id) => {
    const dataRequst = await UtilRequest.RequestAuth(
        `${Constant.PathServer}/api/KQXetNghiemHLA/DeleteMulti?id=${id}`,
        'POST',
        null
    ).then((rs) => {
        return rs;
    });
    return dataRequst;
};
