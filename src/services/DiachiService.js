import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '@app/Constant';
import * as TypeActions from '../store/ActionType/DiachiTypeAction';

export function RenderDataTinh(dispatch) {
    fetch(`${Constant.PathServer}/api/TinhHuyenXa/GetDataTinh`)
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.LOAD_TINH,
                    value: json.Data
                });
            }
        });
}
export function RenderDropdownTisssnh(pro) {
    return '';
}
