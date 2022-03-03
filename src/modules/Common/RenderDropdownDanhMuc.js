import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '@app/Constant';

const RenderDropdownDanhMuc = (pro) => {
    const [dataCateDM, setdataCateDM] = useState([]);
    const InitDataDom = () => {
        fetch(
            `${Constant.PathServer}/api/DMDulieuDanhmuc/GetDuLieuByCodeNhom?CodeNhom=${pro.code}`
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    setdataCateDM(json.Data);
                }
            });
    };
    useEffect(() => {
        InitDataDom();
    }, []);

    // InitDataDom();
    return dataCateDM.map((item, key) => {
        const keyData = `${pro.code}-${pro.field}-${key}`;
        // console.log(keyData);
        return (
            <option value={item.Code} key={keyData}>
                {item.Name}
            </option>
        );
    });
};

export default RenderDropdownDanhMuc;
