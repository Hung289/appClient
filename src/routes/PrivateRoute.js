import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({children, isLoggedIn, currentUser, ...rest}) => {
    return (
        <Route
            {...rest}
            render={({location}) =>
                isLoggedIn &&
                currentUser &&
                currentUser.typeUser === 'CanBoQuanLy' ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(PrivateRoute);
