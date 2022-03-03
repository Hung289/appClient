import * as DangKyChoGhepConstant from '@app/modules/Common/DangKyChoGhepConstant';

/* eslint-disable import/prefer-default-export */
export const ChoTiepNhan = 'ChoTiepNhan';
export const DaTiepNhan = 'DaTiepNhan';
export const TuChoi = 'TuChoi';
export const HuyDangKy = 'HuyDangKy';
export const HuyDonDK = 'HuyDonDK';
export const TatCa = 'TatCa';
export const HoanThanh = 'HoanThanh';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case ChoTiepNhan:
            return 'Chờ tiếp nhận';
        case DaTiepNhan:
            return 'Đợi đơn đăng ký';
        case TuChoi:
            return 'Từ chối';
        case HuyDonDK:
            return 'Hủy đơn đăng ký';
        case HoanThanh:
            return 'Hoàn thành';
        case TatCa:
            return 'Tất cả';
        case HuyDangKy:
            return 'Hủy bỏ';
        default:
            return 'Chờ tiếp nhận';
    }
};

export const GetStyle = (statusCode) => {
    switch (statusCode) {
        case ChoTiepNhan:
            return 'ChoTiepNhan';
        case DaTiepNhan:
            return 'DaTiepNhan';
        case TuChoi:
            return 'TuChoi';
        case HuyDonDK:
            return 'HuyDonDK';
        case TatCa:
            return 'TatCa';
        case HoanThanh:
            return 'HoanThanh';
        case HuyDangKy:
            return 'HuyDangKy';
        default:
            return 'ChoTiepNhan';
    }
};
