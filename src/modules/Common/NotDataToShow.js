import React, {Component} from 'react';

class NotDataToShow extends Component {
    render() {
        const {colNum} = {...this.props};
        return (
            <tr>
                <td colSpan={colNum} className="tdNotData">
                    Không có dữ liệu
                </td>
            </tr>
        );
    }
}

export default NotDataToShow;
