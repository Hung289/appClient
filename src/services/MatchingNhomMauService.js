import {toast} from 'react-toastify';
import {CheckLogin} from '@modules/Common/CommonUtility';
import * as Constant from '@app/Constant';

// eslint-disable-next-line import/prefer-default-export
export const CreateNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/Create`,
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
                toast.success('Thêm mới thông tin hiến mô tạng thành công');
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return data;
};

export const InitDanhMuc = async () => {
    const data = await fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/InitDanhMuc`,
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
            toast.error('Không lấy được dữ liệu danh mục');
            return null;
        });
    return data;
};

export const GetDetailDto = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/GetById?id=${id}`,
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

export const EditNewEntity = async (obj) => {
    const data = await fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/Edit`,
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
                toast.success(
                    'Cập nhật cấu hình nguyên tắc truyền máu thành công'
                );
            } else {
                toast.error(json.MessageError);
            }
            return json;
        });
    return data;
};

export const LoadEntityByType = async (objSearch) => {
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
        `${Constant.PathServer}/api/MatchingNhomMau/GetDanhSach`,
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

export const OpenDetailModalSV = async (id) => {
    const data = await fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/GetById?id=${id}`,
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
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};

export const DeleteEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/Delete?id=${id}`,
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
                toast.success('Xóa cấu hình nguyên tắc truyền máu thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};

export const DeleteMultiEntity = async (id) => {
    const data = fetch(
        `${Constant.PathServer}/api/MatchingNhomMau/DeleteMulti?id=${id}`,
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
                toast.success('Xóa cấu hình nguyên tắc truyền máu thành công');
                return json;
            }
            toast.error(json.MessageError);
            return null;
        });
    return data;
};
