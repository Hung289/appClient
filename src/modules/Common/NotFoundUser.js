/* eslint-disable import/prefer-default-export */
import pathNotFoundAvatar from '../../images/AvatarUser.png';
import pathNotFoundCMND from '../../images/default-cmnd.png';

export const NotFoundUserImage = (evt) => {
    // const pathNotFound = '../../../images/AvatarUser.png';
    evt.target.setAttribute('src', pathNotFoundAvatar);
};

export const NotFoundCMNDImage = (evt) => {
    // const pathNotFound = '../../../images/AvatarUser.png';
    evt.target.setAttribute('src', pathNotFoundCMND);
};
