import React from 'react';
import Mat from './Mat';
import BoPhanKhac from './BoPhanKhac';
import Tim from './Tim';
import Than from './Than';

const Icon = (props) => {
    switch (props.name) {
        case 'Mat':
            return <Mat {...props} />;
        case 'BoPhanKhac':
            return <BoPhanKhac {...props} />;
        case 'Tim':
            return <Tim {...props} />;
        case 'Than':
            return <Than {...props} />;
        default:
            return <div />;
    }
};

export default Icon;
