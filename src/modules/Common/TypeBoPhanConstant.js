/* eslint-disable import/prefer-default-export */
export const tim = 'tim';
export const gan = 'gan';
export const than = 'than';
export const phoi = 'phoi';
export const giacmac = 'giacmac';
export const da = 'da';
export const tuy = 'tuy';
export const chithe = 'chithe';
export const ruot = 'ruot';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case tim:
            return 'Tim';
        case gan:
            return 'Gan';
        case than:
            return 'Thận';
        case phoi:
            return 'Phổi';
        case giacmac:
            return 'Giác mạc';
        case da:
            return 'Da';
        case tuy:
            return 'Tụy';
        case chithe:
            return 'Chi thể';
        case ruot:
            return 'Ruột';
        default:
            return '';
    }
};

export const GetStyle = (statusCode) => {
    switch (statusCode) {
        case tim:
            return 'tim';
        case gan:
            return 'gan';
        case than:
            return 'than';
        case phoi:
            return 'phoi';
        case giacmac:
            return 'giacmac';
        case da:
            return 'da';
        case tuy:
            return 'tuy';
        case chithe:
            return 'chithe';
        case ruot:
            return 'ruot';
        default:
            return '';
    }
};
