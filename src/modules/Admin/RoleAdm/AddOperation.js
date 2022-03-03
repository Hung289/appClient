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
import {
    Button,
    Card,
    Col,
    Dropdown,
    ListGroup,
    ListGroupItem,
    Modal
} from 'react-bootstrap';
import {Field, Form, Formik, useFormik, useFormikContex} from 'formik';
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
import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu';

const AddOperation = React.memo((props) => {
    const {ShowAddRole, setShowAddRole, Userid, lstRole, lstRoleId} = props;

    const formRef = useRef();
    const submitCreate = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    useEffect(() => {
        return () => {};
    }, []);
    // const SignupSchema = Yup.object().shape({
    //     Name: Yup.string()
    //         .trim()
    //         .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    //         .max(255, 'Vui lòng nhập không quá 255 ký tự')
    //         .required('Vui lòng nhập thông tin này')
    //         .test(
    //             'len',
    //             'Thông tin này chỉ được sử dụng chữ cái và số',
    //             (val) => {
    //                 const str = removeAscent(val);
    //                 return /^[a-zA-Z0-9 ]*$/.test(str);
    //             }
    //         ),
    //     Code: Yup.string()
    //         .trim()
    //         .min(2, 'Vui lòng nhập ít nhất 2 ký tự')
    //         .required('Vui lòng nhập thông tin này')
    //         .test(
    //             'len',
    //             'Thông tin này chỉ được sử dụng chữ cái và số',
    //             (val) => /^[a-zA-Z0-9 ]*$/.test(val)
    //         )
    // });
    const MyCheckbox = ({field, form, label, ...rest}) => {
        const {name, value: formikValue} = field;
        const {setFieldValue} = form;

        const handleChange = (event) => {
            const values = formikValue || [];
            const index = values.indexOf(rest.value);
            if (index === -1) {
                values.push(rest.value);
            } else {
                values.splice(index, 1);
            }
            setFieldValue(name, values);
        };

        return (
            <label>
                <input
                    type="checkbox"
                    onChange={handleChange}
                    checked={formikValue.indexOf(rest.value) !== -1}
                    {...rest}
                />{' '}
                <span> {label}</span>
            </label>
        );
    };
    return (
        <>
            <Modal
                show={ShowAddRole}
                size="lg"
                onHide={() => setShowAddRole(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thiết lập quyền cho vai trò</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            RoleId: Userid,
                            operations: lstRoleId
                        }}
                        // validationSchema={SignupSchema}
                        onSubmit={(values) => {
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
                        {({errors, touched}) => (
                            <Form>
                                <Field type="hidden" name="Id" key="Id" />
                                <div className="form-group">
                                    <label htmlFor="title">
                                        Thiết lập quyền
                                    </label>
                                    <div
                                        role="group"
                                        aria-labelledby="checkbox-group"
                                    >
                                        <div className="row">
                                            {lstRole.map((item) => {
                                                return (
                                                    <div className="col-sm-4">
                                                        <div id="accordion">
                                                            <div className="card">
                                                                <div
                                                                    className="card-header"
                                                                    id={`headingOne${item.Id}`}
                                                                >
                                                                    <h5 className="mb-0">
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
                                                                    </h5>
                                                                </div>

                                                                <div
                                                                    id={`Clps${item.Id}`}
                                                                    className="collapse show"
                                                                    aria-labelledby={`headingOne${item.Id}`}
                                                                    // data-parent="#accordion"
                                                                >
                                                                    <div className="card-body">
                                                                        {item.LstOperation.map(
                                                                            (
                                                                                opr
                                                                            ) => {
                                                                                return (
                                                                                    <div>
                                                                                        <Field
                                                                                            component={
                                                                                                MyCheckbox
                                                                                            }
                                                                                            name="operations"
                                                                                            value={
                                                                                                opr.Id
                                                                                            }
                                                                                            label={
                                                                                                opr.Name
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowAddRole(false)}
                    >
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={submitCreate}>
                        Hoàn thành
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default AddOperation;
