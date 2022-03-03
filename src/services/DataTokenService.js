import * as Constant from '@app/Constant';
import * as TypeActions from '@app/store/ActionType/DataTokenTypeAction';
import {toast} from 'react-toastify';

export async function GetDataByToken(dispatch) {
    const token = localStorage.getItem('token');
    const data = await fetch(
        `${Constant.PathServer}/api/AppUserManager/GetDataByToken?token=${token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
        .then((response) => response.json())
        .then((json) => {
            if (json.Status) {
                dispatch({
                    type: TypeActions.UPDATE_DATA_FROM_TOKEN,
                    value: json.Data
                });
            }
            // toast.error(json.MessageError);
        });
    return data;
}
export const x = '1';
