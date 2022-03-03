import RenderDropdownDanhMuc from '@modules/Common/RenderDropdownDanhMuc';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '@app/Constant';

export function RenderDropdownTinh(pro) {
    const [dataCateDM, setdataCateDM] = useState([]);
    const InitDataDom = () => {
        fetch(`${Constant.PathServer}/api/TinhHuyenXa/GetDataTinh`)
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
        const keyData = `${pro.code}-${key}`;
        // console.log(keyData);
        return (
            <option value={item.MaTinh} key={keyData}>
                {item.TenTinh}
            </option>
        );
    });
}

export function RenderDropdownQuanhuyen(pro) {
    const [dataCateDM, setdataCateDM] = useState([]);
    const [old, setold] = useState('');
    const InitDataDom = () => {
        fetch(
            `${Constant.PathServer}/api/TinhHuyenXa/GetDataHuyen?TinhId=${pro.data}`,
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            }
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    setdataCateDM(json.Data);
                }
            });
    };
    if (pro.data !== '' && old !== pro.data) {
        InitDataDom();
        setold(pro.data);
    }
    // InitDataDom();
    return dataCateDM.map((item, key) => {
        const keyData = `${pro.code}-${key}`;
        // console.log(keyData);
        return (
            <option value={item.MaHuyen} key={keyData}>
                {item.TenHuyen}
            </option>
        );
    });
}
export function RenderDropdownXaphuong(pro) {
    const [dataCateDM, setdataCateDM] = useState([]);
    const [old, setold] = useState('');
    const InitDataDom = () => {
        fetch(
            `${Constant.PathServer}/api/TinhHuyenXa/GetDataXa?HuyenId=${pro.data}`,
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            }
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    setdataCateDM(json.Data);
                }
            });
    };
    if (pro.data !== '' && old !== pro.data) {
        InitDataDom();
        setold(pro.data);
    }
    // InitDataDom();
    return dataCateDM.map((item, key) => {
        const keyData = `${pro.code}-${key}`;
        // console.log(keyData);
        return (
            <option value={item.MaXa} key={keyData}>
                {item.TenXa}
            </option>
        );
    });
}
