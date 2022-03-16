/* eslint-disable import/prefer-default-export */

import {toast} from 'react-toastify';
import * as ActionTypes from '../../store/actions';

const moment = require('moment');

export const ShowDateVN = (date) => {
    if (date != null) {
        return moment(date).format('DD/MM/YYYY');
    }
    return '';
};

export const ShowYearVN = (date) => {
    if (date != null) {
        return moment(date).format('YYYY');
    }
    return '';
};

export const GetTypeFile = (props) => {
    const {path} = props;
    if (!path || path === '') {
        return 0;
    }
    const extension = path.split('.').pop();
    if (extension === 'pdf') {
        return 2;
    }
    const lstExtImg = ['png', 'jpg', 'jpeg'];
    if (lstExtImg.indexOf(extension) > -1) {
        return 1;
    }
    return extension;
};

export const ShowDateTimeVN = (date) => {
    if (date != null) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }
    return '';
};
export const GetListPageGen = (total, current) => {
    const ListPageGen = [];
    if (total < 5) {
        for (let index = 0; index < total; index += 1) {
            ListPageGen.push(index + 1);
        }
    } else {
        if (current - 2 > 0) {
            ListPageGen.push(current - 2);
            ListPageGen.push(current - 1);
        } else {
            for (let index = 0; index < current; index += 1) {
                const indxNum = current - index;
                if (indxNum > 0 && indxNum !== current) {
                    ListPageGen.push(indxNum);
                }
            }
        }
        ListPageGen.push(current);
        if (total - current > 2) {
            ListPageGen.push(current + 1);
            ListPageGen.push(current + 2);
        } else {
            for (let index = 0; index < total - current; index += 1) {
                ListPageGen.push(current + index + 1);
            }
        }
    }
    return ListPageGen;
};

export const GetYear = (date) => {
    if (date != null) {
        return moment(date).format('YYYY');
    }
    return 0;
};

export const DisplayString = (content) => {
    if (content === null || content.length === 0) {
        return 'Đang cập nhật';
    }
    return content;
};

export const GetDateSetField = (date) => {
    if (date != null) {
        return moment(date).format('YYYY-MM-DD');
    }
    return '';
};

export const CheckLogin = (dispatch, data) => {
    if (data.ErrorCode === 401) {
        dispatch({type: ActionTypes.LOGOUT_USER});
    }
};
export const ChuyenGiaTien = (num) => {
    if (Number.isNaN(+num)) {
        return 'Không phải số';
    }
    const str = String(num);
    let str2 = '';
    for (let i = str.length - 1; i >= 0; i -= 1) {
        if ((str.length - i - 1) % 3 === 0) {
            str2 += '.';
        }
        str2 += str[i];
    }
    return str2.substring(1, str2.length).split('').reverse().join('');
};
export const removeAscent = (str1) => {
    // bỏ dấu trong tiếng việt(dùng kiểm tra trong form)
    let str = str1;
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
};
export const stringToDMY = (string) => {
    // chuyen doi string sang kieu date(day,month,year)
    if (string === null || string === '') {
        return '';
    }
    const date = new Date(string);
    let newstring = `${date.getFullYear()}-`;
    newstring +=
        date.getMonth() < 9
            ? `0${date.getMonth() + 1}-`
            : `${date.getMonth() + 1}-`;
    newstring +=
        date.getDate() < 9 ? `0${date.getDate()}` : `${date.getDate()}`;
    return newstring;
};
export function canhbaoError(errors) {
    if (
        errors &&
        Object.keys(errors).length !== 0 &&
        errors.constructor === Object
    ) {
        toast.error('Vui lòng kiểm tra lại thông tin!');
    }
}
export function canhbaoErrorModal(modal) {
    const {errors} = modal.current;
    if (
        errors &&
        Object.keys(errors).length !== 0 &&
        errors.constructor === Object
    ) {
        toast.error('Vui lòng kiểm tra lại thông tin!');
    }
}

export const RenderGioiTinh = (gt) => {
    switch (gt) {
        case 0:
            return 'Nữ';
        case 1:
            return 'Nam';
        default:
            return '';
    }
};

export const LamTronDiem = (gt) => {
    return parseFloat(gt).toFixed(3);
};
