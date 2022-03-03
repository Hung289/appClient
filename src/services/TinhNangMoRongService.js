/* eslint-disable import/prefer-default-export */
import * as Constant from '@app/Constant';
import {toast} from 'react-toastify';
import React, {useState, useEffect, useRef} from 'react';

export const DoiServerBaiBao = (obj) => {
    return (
        fetch(`${Constant.PathServer}/api/TinhNangMoRong/UpdateURLServer`, {
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
            body: JSON.stringify({old_URL: obj.oldURL, new_URL: obj.newURL})
        })
            // ?oldurl=${obj.oldURL}&newurl=${obj.newURL}
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    toast.success(json.Data);
                } else {
                    toast.error(json.MessageError);
                }
            })
    );
};
export function NhapDKHTExcel(formdata) {
    return (
        fetch(`${Constant.PathServer}/api/TinhNangMoRong/ExcelDKHT`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: formdata
        })
            // ?oldurl=${obj.oldURL}&newurl=${obj.newURL}
            .then((response) => response.json())
    );
}
export function LuuDKHTExcelTrue(obj) {
    return fetch(`${Constant.PathServer}/api/dangkyhien/SaveImport`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(obj)
    }).then((response) => response.json());
}
export function XuatDKHTExcelFalse(obj) {
    return fetch(`${Constant.PathServer}/api/dangkyhien/ExportDKHTExcelFalse`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(obj)
    }).then((response) => response.json());
}
export function NhapDKGhepThanTExcel(formdata) {
    return (
        fetch(`${Constant.PathServer}/api/TinhNangMoRong/ExcelDKGhepThan`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                Accept: 'application/json'
                // Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: formdata
        })
            // ?oldurl=${obj.oldURL}&newurl=${obj.newURL}
            .then((response) => response.json())
    );
}
export function LuuDKGhepThanExcelTrue(obj) {
    return fetch(`${Constant.PathServer}/api/dangkychoghepthan/SaveImport`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(obj)
    }).then((response) => response.json());
}
export function XuatDKGhepThanExcelFalse(obj) {
    return fetch(
        `${Constant.PathServer}/api/dangkychoghepthan/ExportDKGhepThanExcelFalse`,
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        }
    ).then((response) => response.json());
}
// export function NhapDKGhepThanExcel(obj) {
//     return fetch(
//         `${Constant.PathServer}/api/dangkychoghepthan/ExportDKHTExcelFalse`,
//         {
//             method: 'POST', // *GET, POST, PUT, DELETE, etc.
//             mode: 'cors', // no-cors, *cors, same-origin
//             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//             credentials: 'same-origin', // include, *same-origin, omit
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             },
//             redirect: 'follow', // manual, *follow, error
//             referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//             body: JSON.stringify(obj)
//         }
//     ).then((response) => response.json());
// }
