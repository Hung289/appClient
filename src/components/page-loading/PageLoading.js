import React from 'react';
import classes from './PageLoading.module.scss';

const PageLoading = () => {
    return (
        <div className={classes.loading}>
            <span>H</span>
            <span>I</span>
            <span>N</span>
            <span>E</span>
            <span>T</span>
        </div>
    );
};

export default PageLoading;
