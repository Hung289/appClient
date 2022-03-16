/* eslint-disable import/prefer-default-export */
import React from 'react';
import {Select} from 'antd';

export const MoiTao = 'MoiTao';
export const DanhGiaNguyCo = 'DanhGiaNguyCo';
export const DangChoTuyenChon = 'DangChoTuyenChon';
export const DaXacDinh = 'DaXacDinh';
export const HoanThanh = 'HoanThanh';

export const GetName = (statusCode) => {
    switch (statusCode) {
        case MoiTao:
            return 'Mới tạo';
        case DanhGiaNguyCo:
            return 'Đánh giá nguy cơ';
        case DangChoTuyenChon:
            return 'Đang chờ tuyển chọn';
        case DaXacDinh:
            return 'Đã chọn người ghép';
        case HoanThanh:
            return 'Hoàn thành';
        default:
            return '';
    }
};

export const RenderDropdown = (selected) => {
    return (
        <>
            <Select.Option value={MoiTao}>Mới tạo</Select.Option>
            <Select.Option value={DanhGiaNguyCo}>
                Đánh giá nguy cơ
            </Select.Option>
            <Select.Option value={DangChoTuyenChon}>
                Đang chờ tuyển chọn
            </Select.Option>
            <Select.Option value={DaXacDinh}>Đã xác định</Select.Option>
            <Select.Option value={HoanThanh}>Hoàn thành</Select.Option>
        </>
    );
};
