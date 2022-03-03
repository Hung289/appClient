/* eslint-disable import/prefer-default-export */
export const DaGuiThe = 'DaGuiThe';
export const ChuaGui = 'ChuaGui';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case DaGuiThe:
            return 'Đã gửi thẻ';
        case ChuaGui:
            return 'Chưa gửi thẻ';
        default:
            return 'N/A';
    }
};

export const GetStyle = (statusCode) => {
    switch (statusCode) {
        case DaGuiThe:
            return 'DaGuiThe';
        case ChuaGui:
            return 'ChuaGui';
        default:
            return '';
    }
};
