import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import * as Constant from '@app/Constant';
import * as Yup from 'yup';
import * as roleService from '@app/services/roleService';
import NotDataToShow from '@modules/Common/NotDataToShow';
import {
    CheckRowsHinetTable,
    GetDsCheckedTableHinet,
    CheckAllItem
} from '@modules/Common/TableCommon';
import {
    ROLE_CLOSE_VIEWDETAIL,
    ROLE_CLOSE_VIEWEDIT,
    ROLE_EDIT_CLOSE,
    ROLE_SEARCH_SAVE
} from '@app/store/ActionType/RoleTypeAction';
import {Button, Col, Dropdown, ListGroup, ListGroupItem} from 'react-bootstrap';
import {Field, Formik, useFormik, useFormikContex} from 'formik';
import {Link, useHistory} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {NotFoundImage} from '@modules/Common/NotFound';
import {removeAscent} from '@modules/Common/CommonUtility';
import axios from 'axios';
import {confirmAlert} from 'react-confirm-alert'; // Import
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {Card, Modal, Form, Input, Checkbox} from 'antd';
import moment from 'moment';
import * as antIcon from '@ant-design/icons';
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';

const AddOperation = React.memo((props) => {
    const {ShowAddRole, setShowAddRole, Userid, lstRole, lstRoleId} = props;

    const formRef = useRef();
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    useEffect(() => {
        return () => {};
    }, []);
    return (
        <>
            <Modal
                title="Thiết lập quyền cho vai trò"
                visible={ShowAddRole}
                onOk={submitCreate}
                onCancel={() => setShowAddRole(false)}
                width={1000}
                zIndex={1040}
                okText="Hoàn thành"
                cancelText="Đóng"
                // eslint-disable-next-line react/jsx-boolean-value
                destroyOnClose={true}
            >
                <Form
                    ref={formRef}
                    initialValues={{
                        RoleId: Userid,
                        operations: lstRoleId
                    }}
                    // validationSchema={SignupSchema}
                    onFinish={(values) => {
                        const ObjSave = {
                            ...values
                        };
                        roleService.SaveOperationData(ObjSave).then((x) => {
                            if (x.Status) {
                                setShowAddRole(false);
                                toast.success('Cập nhật quyền thành công');
                            } else {
                                toast.error(x.Message);
                            }
                        });
                    }}
                >
                    <Form.Item name="RoleId" hidden>
                        <Input name="RoleId" />
                    </Form.Item>

                    <Form.Item name="operations" defaultValue={lstRoleId}>
                        <Checkbox.Group>
                            <div className="form-group">
                                <label htmlFor="title">Thiết lập quyền</label>
                                <div
                                    role="group"
                                    aria-labelledby="checkbox-group"
                                >
                                    <div className="row">
                                        {lstRole.map((item, index) => {
                                            return (
                                                <div
                                                    className="col-sm-4"
                                                    key={index}
                                                >
                                                    <div
                                                        id="accordion"
                                                        style={{
                                                            marginBottom: '20px'
                                                        }}
                                                    >
                                                        <Card
                                                            hoverable
                                                            title={
                                                                // eslint-disable-next-line react/jsx-wrap-multilines
                                                                <Button
                                                                    className="btn btn-primary btn-sm"
                                                                    data-toggle="collapse"
                                                                    data-target={`#Clps${item.Id}`}
                                                                    aria-expanded="true"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    {
                                                                        item.NameModule
                                                                    }
                                                                </Button>
                                                            }
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            bodyStyle={{
                                                                padding:
                                                                    '5px 10px'
                                                            }}
                                                            headStyle={{
                                                                padding:
                                                                    '5px 10px'
                                                            }}
                                                        >
                                                            <div
                                                                id={`Clps${item.Id}`}
                                                                className="collapse show"
                                                                aria-labelledby={`headingOne${item.Id}`}
                                                                // data-parent="#accordion"
                                                            >
                                                                {item.LstOperation.map(
                                                                    (
                                                                        opr,
                                                                        ind
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    ind
                                                                                }
                                                                            >
                                                                                <Checkbox
                                                                                    value={
                                                                                        opr.Id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        opr.Name
                                                                                    }
                                                                                </Checkbox>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default AddOperation;
