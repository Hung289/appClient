/* eslint-disable import/prefer-default-export */
export const NotFoundImage = (evt) => {
    const pathNotFound = '../../images/noimage.gif';
    evt.target.setAttribute(
        'src',
        'https://cidrapbusiness.org/wp-content/uploads/2017/10/noimage.gif'
    );
};
