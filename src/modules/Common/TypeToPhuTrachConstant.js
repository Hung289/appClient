/* eslint-disable import/prefer-default-export */
export const PhuTrachHien = 'PhuTrachHien';
export const ToChoGhepThan = 'ToChoGhepThan';
export const ToChoGhepTim = 'ToChoGhepTim';
export const ToChoGhepGan = 'ToChoGhepGan';
export const ToChoGhepPhoi = 'ToChoGhepPhoi';
export const ToChoGhepGiacMac = 'ToChoGhepGiacMac';
export const ToChoGhepTuy = 'ToChoGhepTuy';
export const ToChoGhepRuot = 'ToChoGhepRuot';
export const ToChoGhepDa = 'ToChoGhepDa';
export const ToChoGhepChiThe = 'ToChoGhepChiThe';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case PhuTrachHien:
            return 'Tiếp nhận đăng ký hiến';
        case ToChoGhepThan:
            return 'Tiếp nhận chờ ghép thận';
        case ToChoGhepTim:
            return 'Tiếp nhận chờ ghép tim';
        case ToChoGhepGan:
            return 'Tiếp nhận chờ ghép gan';
        case ToChoGhepPhoi:
            return 'Tiếp nhận chờ ghép phổi';
        case ToChoGhepGiacMac:
            return 'Tiếp nhận chờ ghép giác mạc';
        case ToChoGhepTuy:
            return 'Tiếp nhận chờ ghép tụy';
        case ToChoGhepRuot:
            return 'Tiếp nhận chờ ghép ruột';
        case ToChoGhepDa:
            return 'Tiếp nhận chờ ghép da';
        case ToChoGhepChiThe:
            return 'Tiếp nhận chờ ghép chi thể';

        default:
            return 'N/A';
    }
};
