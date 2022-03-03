import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class AdminSecsionHead extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {ModuleName} = this.props;
        return (
            <>
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>{ModuleName}</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <Link to="/admin">Admin</Link>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {ModuleName}
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default AdminSecsionHead;
