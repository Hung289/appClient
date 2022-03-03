/* eslint-disable import/prefer-default-export */
export const ChoTiepNhan = 'ChoTiepNhan';
export const DaTiepNhan = 'DaTiepNhan';
export const TuChoi = 'TuChoi';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case ChoTiepNhan:
            return 'Chờ tiếp nhận';
        case DaTiepNhan:
            return 'Tiếp nhận';
        case TuChoi:
            return 'Từ chối';
        default:
            return 'Chờ tiếp nhận';
    }
};
