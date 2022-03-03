/* eslint-disable import/prefer-default-export */
export const ChoTiepNhan = 'ChoTiepNhan';
export const DaTiepNhan = 'DaTiepNhan';
export const TuChoi = 'TuChoi';
export const HuyDangKy = 'HuyDangKy';
export const HuyDonDK = 'HuyDonDK';
export const DaCoDonDK = 'DaCoDonDK';
export const DuaRaKhoiDS = 'DuaRaKhoiDS';
export const HoanThanh = 'HoanThanh';
export const TatCa = 'TatCa';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case TatCa:
            return 'Tất cả';
        case ChoTiepNhan:
            return 'Chờ tiếp nhận';
        case DaTiepNhan:
            return 'Đợi đơn đăng ký';
        case TuChoi:
            return 'Từ chối';
        case HuyDangKy:
            return 'Hủy bỏ đăng ký';
        case DaCoDonDK:
            return 'Đã có đơn đăng ký';
        case DuaRaKhoiDS:
            return 'Chờ điều trị';
        case HuyDonDK:
            return 'Hủy đơn đăng ký';
        case HoanThanh:
            return 'Danh sách chờ ghép';
        default:
            return '';
    }
};

export const GetStyle = (statusCode) => {
    switch (statusCode) {
        case ChoTiepNhan:
            return 'ChoTiepNhan';
        case DaTiepNhan:
            return 'DaTiepNhan';
        case HuyDonDK:
            return 'HuyDonDK';
        case HoanThanh:
            return 'HoanThanh';
        case DuaRaKhoiDS:
            return 'DuaRaKhoiDS';
        case TuChoi:
            return 'TuChoi';
        case HuyDangKy:
            return 'HuyDangKy';
        case DaCoDonDK:
            return 'DaCoDonDK';
        case TatCa:
            return 'TatCa';
        default:
            return '';
    }
};
