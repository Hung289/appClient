/* eslint-disable react/jsx-wrap-multilines */
import React, {useState, useEffect, useRef} from 'react';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as antd from 'antd';
import * as antIcon from '@ant-design/icons';
import * as dangKyHienTangService from '@app/services/dangKyHienTangService';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';

const {
    Drawer,
    Button,
    Space,
    Form,
    Row,
    Col,
    Input,
    Radio,
    Select,
    notification,
    Descriptions,
    Table,
    Dropdown,
    Menu,
    Pagination
} = antd;
const {Option} = Select;
const {Column, ColumnGroup} = Table;

const UpdateHLAAdm = (props) => {
    const formRef = useRef();
    const hlaARef = useRef();
    const hlaBRef = useRef();
    const hlaDRB1Ref = useRef();
    const hlaDQA1Ref = useRef();
    const hlaDQB1Ref = useRef();

    const {
        onCloseEntityEditModal,
        entityObj,
        // onSaveEditEntity,
        IsShowEditPopup,
        showEditHLA,
        handleEditHLAClose,
        OnLoadingAction,
        onReloadPage
    } = props;

    const [form] = Form.useForm();

    const onSaveEditHLAEntity = (tintuc) => {
        OnLoadingAction(true);
        dangKyHienTangService.EditNewHLAEntity(tintuc).then((data) => {
            OnLoadingAction(false);
            if (data.Status) {
                handleEditHLAClose();
                onReloadPage();
            }
        });
    };
    hlaARef.current = entityObj.LstHLAA;
    hlaBRef.current = entityObj.LstHLAB;
    hlaDRB1Ref.current = entityObj.LstHLADRB1;
    hlaDQA1Ref.current = entityObj.LstHLADQA1;
    hlaDQB1Ref.current = entityObj.LstHLADQB1;
    useEffect(() => {}, []);

    function BoxUpdateHLA() {
        const onFinish = (values) => {
            // if (hlaARef.current.length === 0) {
            //     notification.error({
            //         placement: 'bottomRight',
            //         message: 'Cảnh báo',
            //         description: 'Vui lòng nhập đủ thông tin xét nghiệm HLAA'
            //     });
            // } else {
            //     toast.success('123');
            //     console.log(hlaARef.current);
            // }
            const ObjSave = {
                Id: entityObj.Id,
                LstHLAA: hlaARef.current,
                LstHLAB: hlaBRef.current,
                LstHLADRB1: hlaDRB1Ref.current,
                LstHLADQA1: hlaDQA1Ref.current,
                LstHLADQB1: hlaDRB1Ref.current
            };

            onSaveEditHLAEntity(ObjSave);
        };

        const onFinishFailed = (errorInfo) => {
            notification.error({
                placement: 'bottomRight',
                message: 'Cảnh báo',
                description: 'Vui lòng kiểm tra lại dữ liệu nhập'
            });
        };
        function RenderTags({tagHLASave, init}) {
            const [tagHLA, settagHLA] = React.useState(
                init !== null && init !== undefined ? init : []
            );
            return (
                <ReactTagInput
                    tags={tagHLA}
                    maxTags={10}
                    readOnly={false}
                    editable
                    removeOnBackspace
                    placeholder="Nhập và ấn Enter"
                    onChange={(newTags) => {
                        settagHLA(newTags);
                        tagHLASave(newTags);
                    }}
                    validator={(value) => {
                        const regstring = /^([0-9]{1,2})$|^([0-9]{2}:[0-9]{2})$/;
                        const isMatch = value.match(regstring);
                        if (!isMatch) {
                            toast.error('Vui lòng nhập đúng định dạng');
                        }
                        return isMatch;
                    }}
                />
            );
        }
        return (
            <>
                <Form
                    name="basic"
                    labelCol={{
                        span: 4
                    }}
                    wrapperCol={{
                        span: 16
                    }}
                    initialValues={{
                        Id: entityObj.Id,
                        HLAA: entityObj.HLAA,
                        HLAB: entityObj.HLAB,
                        HLADRB1: entityObj.HLADRB1,
                        HLADQA1: entityObj.HLADQA1,
                        HLADQB1: entityObj.HLADQB1
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item className="hide" name="Id" key="Id" />
                    <Form.Item label="HLA - A" name="HLAA" key="HLAA">
                        <RenderTags
                            tagHLASave={(item) => {
                                hlaARef.current = item;
                            }}
                            init={hlaARef.current}
                        />
                    </Form.Item>
                    <Form.Item label="HLA - B" name="HLAB" key="HLAB">
                        <RenderTags
                            tagHLASave={(item) => {
                                hlaBRef.current = item;
                            }}
                            init={hlaBRef.current}
                        />
                    </Form.Item>
                    <Form.Item label="HLA - DRB1" name="HLADRB1" key="HLADRB1">
                        <RenderTags
                            tagHLASave={(item) => {
                                hlaDRB1Ref.current = item;
                            }}
                            init={hlaDRB1Ref.current}
                        />
                    </Form.Item>
                    <Form.Item label="HLA - DQA1" name="HLADQA1" key="HLADQA1">
                        <RenderTags
                            tagHLASave={(item) => {
                                hlaDQA1Ref.current = item;
                            }}
                            init={hlaDQA1Ref.current}
                        />
                    </Form.Item>

                    <Form.Item label="HLA - DQB1" name="HLADQB1" key="HLADQB1">
                        <RenderTags
                            tagHLASave={(item) => {
                                hlaDQB1Ref.current = item;
                            }}
                            init={hlaDQB1Ref.current}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Hoàn thành
                        </Button>
                    </Form.Item>
                </Form>
            </>
        );
    }

    function EditHLAModal() {
        return (
            <>
                <Drawer
                    title="Cập nhật thông tin kết quả xét nghiệm người hiến"
                    placement="right"
                    size="large"
                    onClose={handleEditHLAClose}
                    visible={showEditHLA}
                    extra={
                        <Space>
                            <Button onClick={handleEditHLAClose}>Đóng</Button>
                        </Space>
                    }
                >
                    <div className="mrg10">
                        <BoxUpdateHLA />
                    </div>
                </Drawer>
            </>
        );
    }
    return (
        <>
            <EditHLAModal />
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditEntity: (id) => {
        dangKyHienTangService.OpenEditModalSV(dispatch, id);
    }
    // onCloseEntityEditModal: (id) => {
    //     dispatch({type: DANGKYCHOGHEPTANG_EDIT_CLOSE});
    // }
});
const mapStateToProps = (state) => ({
    lstEntity: state.dangkyhientang.lstEntity,
    IsUpdate: state.dangkyhientang.IsUpdate,
    // entityObj: state.dangkyhientang.entityObj,
    showDetailModal: state.dangkyhientang.showDetailModal,
    showEditModal: state.dangkyhientang.showEditModal,
    isInit: state.dangkyhientang.isInit,
    showChangeStatusModal: state.dangkyhientang.showChangeStatusModal,
    statusNew: state.dangkyhientang.statusNew,
    searchModel: state.dangkyhientang.searchModel
});
export default connect(mapStateToProps, mapDispatchToProps)(UpdateHLAAdm);
