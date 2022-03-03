/* eslint-disable import/prefer-default-export */

export const RequestAuth = async (url, typeMethod, param) => {
    const token = localStorage.getItem('token');
    const data = await fetch(url, {
        method: typeMethod, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(param)
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.ErrorCode === 401) {
                // window.location.href = '/UnAuthor';
            }
            return json;
        });
    return data;
};
