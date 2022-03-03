/* eslint-disable import/prefer-default-export */
import * as Constant from '@app/Constant';
import {toast} from 'react-toastify';

export const SaveImage = (objTinTuc) => {
    return fetch(`${Constant.PathServer}/api/CommonFile/PostImage`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
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
                return json;
                // eslint-disable-next-line no-else-return
            } else {
                toast.error(json.MessageError);
                return null;
            }
        });
};
