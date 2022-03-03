/* eslint-disable import/prefer-default-export */

import $ from 'jquery';

export const CheckRowsHinetTable = (e) => {
    const parentTr = $(e.target).parents('tr');
    const table = $(e.target).parents('table');
    const checkbox = parentTr.find('td input.checkTd');
    const checkState = checkbox.prop('checked');
    if (checkState === true) {
        parentTr.removeClass('tdHighlight');
    } else {
        parentTr.addClass('tdHighlight');
    }
    checkbox.prop('checked', !checkState);

    // Kiểm tra xem có check ALL hay không
    let isAll = true;
    table.find('tr td input.checkTd').each(function () {
        const item = $(this);
        if (item.prop('checked') !== true) {
            isAll = false;
        }
    });
    table.find('tr th input.checkAll').prop('checked', isAll);
};

export const GetDsCheckedTableHinet = (tableId) => {
    const table = $(`table#${tableId}`);
    // eslint-disable-next-line prefer-const
    let DataArr = [];
    table.find('tr td input.checkTd').each(function () {
        const item = $(this);
        const checkValue = item.prop('checked');
        const checkId = item.attr('data-id');
        if (checkValue) {
            DataArr.push(checkId);
        }
    });

    return DataArr;
};

export const CheckAllItem = (eDom, tableId) => {
    const table = $(`table#${tableId}`);
    const checkAll = $(eDom.target).prop('checked');
    if (checkAll === true) {
        table.children('tbody').children('tr').addClass('tdHighlight');
    } else {
        table.children('tbody').children('tr').removeClass('tdHighlight');
    }

    table.find('tbody tr').each((it) => {
        const item = $(it);
        if (checkAll !== true) {
            item.removeClass('tdHighlight');
        } else {
            item.addClass('tdHighlight');
        }
    });
    table.find('tr th input.checkAll').prop('checked', checkAll);
    table.find('tr td input.checkTd').each(function () {
        const item = $(this);
        item.prop('checked', checkAll);
    });
};
export const removeCheckAllItem = (eDom, tableId) => {
    const table = $(`table#${tableId}`);
    const checkAll = $(eDom.target).prop('checked', false);
    table.children('tbody').children('tr').removeClass('tdHighlight');
    table.find('tbody tr').each((it) => {
        const item = $(this);
        item.removeClass('tdHighlight');
    });
    table.find('tr th input.checkAll').prop('checked', false);
    table.find('tr td input.checkTd').each(function () {
        const item = $(this);
        item.prop('checked', false);
    });
};
