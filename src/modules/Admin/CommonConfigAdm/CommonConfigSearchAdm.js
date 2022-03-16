import React, {useState, useEffect, useRef} from 'react';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {NotFoundImage} from '@modules/Common/NotFound';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Constant from '@app/Constant';
import axios from 'axios';
import {Modal, Dropdown, ListGroup, ListGroupItem} from 'react-bootstrap';
import {Card, notification, Form, Button, Row, Col, Input} from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {Formik, useFormik, Field, useFormikContex} from 'formik';
import {toast} from 'react-toastify';
import * as CommonConfigSerivce from '@app/services/CommonConfigService';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {COMMONCONFIG_SEARCH_SAVE} from '@app/store/ActionType/CommonConfigTypeAction';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const CommonConfigSearchAdm = (props) => {
    const {IsShowSearch, searchModel, onSubmitSearchSave} = props;
    const [form] = Form.useForm();
    const SearchSchema = Yup.object().shape({
        name: Yup.string().trim().min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    });

    const RenderFormSearch = () => {
        return (
            <section
                className={`content  ${IsShowSearch ? 'show fade' : 'hidden'}`}
            >
                <div className="container-fluid  mrb-10px">
                    <div className="row">
                        <div className="col-md-12">
                            <Card title="Tìm kiếm">
                                <Form
                                    form={form}
                                    name="basic"
                                    labelCol={{span: 8}}
                                    wrapperCol={{span: 16}}
                                    initialValues={{remember: true}}
                                    layout="vertical"
                                    onFinish={(values) => {
                                        onSubmitSearchSave(values);
                                    }}
                                    onFinishFailed={(errorInfo) => {
                                        notification.error({
                                            placement: 'bottomRight',
                                            message: 'Cảnh báo',
                                            description:
                                                'Vui lòng kiểm tra lại dữ liệu nhập'
                                        });
                                    }}
                                    autoComplete="off"
                                >
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Tên nhóm"
                                                name="Name"
                                                rules={[
                                                    {
                                                        min:
                                                            'Vui lòng nhập ít nhất 2 ký tự'
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            span={24}
                                            style={{textAlign: 'left'}}
                                        >
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                Tìm kiếm
                                            </Button>
                                            <Button
                                                style={{margin: '0 8px'}}
                                                onClick={() => {
                                                    form.resetFields();
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <>
            <RenderFormSearch />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    LoadEntityData: (objSearch) => {
        CommonConfigSerivce.LoadEntity(dispatch, objSearch);
    },
    onSubmitSearchSave: (objSearch) => {
        dispatch({type: COMMONCONFIG_SEARCH_SAVE, searchModel: objSearch});
    }
});
const mapStateToProps = (state) => ({
    lstEntity: state.commonConfig.lstEntity,
    IsUpdate: state.commonConfig.IsUpdate,
    isInit: state.commonConfig.isInit,
    searchModel: state.commonConfig.searchModel,
    IsShowSearch: state.commonConfig.IsShowSearch
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonConfigSearchAdm);
