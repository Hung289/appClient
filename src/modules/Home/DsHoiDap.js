/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect, useRef} from 'react';
import {
    Container,
    Row,
    Button,
    Col,
    Breadcrumb,
    Modal,
    ListGroupItem,
    ListGroup,
    Card
} from 'react-bootstrap';
import {Formik, useFormik, Form, Field, useFormikContex} from 'formik';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import * as Constant from '@app/Constant';
import {toast} from 'react-toastify';
import * as CommonUtility from '@modules/Common/CommonUtility';
import * as Yup from 'yup';

const DsHoiDap = () => {
    const formRef = useRef();
    const [lstItem, setlstItem] = useState({page: 1, data: []});
    const [isLoadMore, setisLoadMore] = useState(false);
    const [initDataItem, setinitDataItem] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false);
    const [entityObj, setEntityObj] = useState(null);
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
    const [isOpenCreatelModal, setIsOpenCreatelModal] = useState(false);
    const [searchModel, setSearchModel] = useState({
        PageIndex: 1,
        PageSize: 20,
        NoiDungCauHoiFilter: '',
        IsPhatHanhFilter: 'On'
    });
    const InitData = () => {
        if (initDataItem === false) {
            fetch(
                // `${Constant.PathServer}/api/HoiDap/GetListPublicAmount?amount=${amt}&page=${lstItem.page}`
                `${Constant.PathServer}/api/HoiDap/GetDanhSach`,
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(searchModel)
                }
            )
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        const lstData = [...json.Data.ListItem];
                        const NewObj = {
                            ...lstItem,
                            data: lstData
                        };
                        setlstItem(NewObj);
                    }
                });
        }
        setinitDataItem(true);
    };
    useEffect(() => {
        InitData();
    }, [initDataItem]);

    const onCloseEntityModal = () => {
        setIsOpenDetailModal(false);
    };

    function DetailModal() {
        if (entityObj != null) {
            return (
                <>
                    <Modal
                        show={isOpenDetailModal}
                        size="lg"
                        onHide={() => onCloseEntityModal()}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Chi ti???t h???i ????p</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">H??? t??n</dt>
                                        <dd className="col-sm-4">
                                            {CommonUtility.DisplayString(
                                                entityObj.HoTen
                                            )}
                                        </dd>
                                        {/* <dt className="col-sm-2">??i???n tho???i</dt>
                                        <dd className="col-sm-4">
                                            {entityObj.DienThoai.length === 0
                                                ? `??ang c???p nh???t`
                                                : `${entityObj.DienThoai.substring(
                                                      0,
                                                      3
                                                  )}****${entityObj.DienThoai.substring(
                                                      entityObj.DienThoai
                                                          .length - 3,
                                                      3
                                                  )}`}
                                        </dd> */}
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">H???i</dt>
                                        <dd className="col-sm-10">
                                            {CommonUtility.DisplayString(
                                                entityObj.NoiDungCauHoi
                                            )}
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <dl className="row">
                                        <dt className="col-sm-2">????p</dt>
                                        <dd className="col-sm-10">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        entityObj.TraLoiCauHoi ===
                                                            null ||
                                                        entityObj.TraLoiCauHoi
                                                            .length === 0
                                                            ? '<p>??ang c???p nh???t</p>'
                                                            : entityObj.TraLoiCauHoi
                                                }}
                                            />
                                        </dd>
                                    </dl>
                                </ListGroupItem>
                            </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => onCloseEntityModal()}
                                style={{transition: 'none'}}
                            >
                                ????ng
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }
        return <div />;
    }

    const onOpenDetailModal = (id) => {
        fetch(`${Constant.PathServer}/api/HoiDap/GetDtoById?id=${id}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    setEntityObj(json.Data);
                    setIsOpenDetailModal(true);
                } else {
                    toast.error(json.MessageError);
                }
            });
    };

    const loadMore = () => {
        if (noMoreData !== true) {
            const objSearch = {
                ...searchModel
            };
            objSearch.PageIndex += 1;
            setSearchModel(objSearch);
            fetch(
                // `${Constant.PathServer}/api/HoiDap/GetListPublicAmount?amount=${amt}&page=${lstItem.page}`
                `${Constant.PathServer}/api/HoiDap/GetDanhSachPublic`,
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(objSearch)
                }
            )
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        if (json.Data.length > 0) {
                            const lstData = [
                                ...lstItem.data,
                                ...json.Data.ListItem
                            ];
                            const NewObj = {
                                ...lstItem,
                                data: lstData
                            };

                            setlstItem(NewObj);
                        } else {
                            setNoMoreData(true);
                        }
                    }
                });
        }
    };

    const onSubmitSearchSave = (query) => {
        const objSearch = {
            ...searchModel,
            ...query
        };
        objSearch.PageIndex = 1;
        setNoMoreData(false);
        setSearchModel(objSearch);
        fetch(
            // `${Constant.PathServer}/api/HoiDap/GetListPublicAmount?amount=${amt}&page=${lstItem.page}`
            `${Constant.PathServer}/api/HoiDap/GetDanhSachPublic`,
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(objSearch)
            }
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    const NewObj = {
                        page: json.Data.CurrentPage,
                        data: json.Data.ListItem
                    };
                    if (lstItem.CurrentPage < json.Data.TotalPage) {
                        setisLoadMore(true);
                    } else {
                        setisLoadMore(true);
                    }
                    setlstItem(NewObj);
                }
            });
    };

    const SearchSchema = Yup.object().shape({
        NoiDungCauHoiFilter: Yup.string().min(
            2,
            'Vui l??ng nh???p ??t nh???t 2 k?? t???'
        )
    });

    const RenderFormSearch = () => {
        return (
            <div
                className="row"
                style={{
                    marginBottom: '1rem'
                }}
            >
                <Col md={{span: 8}}>
                    <Formik
                        initialValues={{
                            NoiDungCauHoiFilter: searchModel.NoiDungCauHoiFilter
                        }}
                        validationSchema={SearchSchema}
                        onSubmit={(values) => {
                            onSubmitSearchSave(values);
                        }}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <Field
                                    name="NoiDungCauHoiFilter"
                                    key="NoiDungCauHoiFilter"
                                    className="form-control NoiDungCauHoiFilter"
                                    placeholder="C??u h???i..."
                                    autoComplete="off"
                                    style={{
                                        display: 'inline-block'
                                    }}
                                />
                                {errors.NoiDungCauHoiFilter &&
                                touched.NoiDungCauHoiFilter ? (
                                    <>
                                        <div className="invalid-feedback">
                                            {errors.NoiDungCauHoiFilter}
                                        </div>
                                    </>
                                ) : null}
                                <Button
                                    variant="success"
                                    size="md"
                                    type="submit"
                                    className="button-action button-timkiem"
                                    style={{
                                        marginRight: '0.5rem'
                                    }}
                                >
                                    <i
                                        className="fa fa-search"
                                        aria-hidden="true"
                                    />{' '}
                                    T??m ki???m
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
                <Col md={{span: 4}}>
                    <Button
                        variant="primary"
                        className="button-themmoi"
                        size="md"
                        style={{float: 'right'}}
                        onClick={() => setIsOpenCreatelModal(true)}
                    >
                        <i className="fa fa-plus" aria-hidden="true" />
                        Th??m m???i c??u h???i
                    </Button>
                </Col>
            </div>
        );
    };

    const RenderData = () => {
        if (lstItem.data.length > 0) {
            return (
                <>
                    {lstItem.data.map((item, key) => {
                        return (
                            <Row key={key}>
                                <Col
                                    md={{span: 12}}
                                    className=""
                                    onClick={() => onOpenDetailModal(item.Id)}
                                >
                                    <Col
                                        md={{span: 12}}
                                        className="class-hoidap"
                                    >
                                        <div className="border-class-hoidap">
                                            <div className="class-tieude-hoidap">
                                                <span>C??u h???i: </span>
                                                {item.NoiDungCauHoi}
                                            </div>
                                            <p>
                                                H???i b???i:{' '}
                                                {item.HoTen.length === 0
                                                    ? '??ang c???p nh???t'
                                                    : item.HoTen}
                                                {item.DienThoai.length === 0
                                                    ? ``
                                                    : ` - ${item.DienThoai.substring(
                                                          0,
                                                          3
                                                      )}****${item.DienThoai.substring(
                                                          item.DienThoai
                                                              .length - 3,
                                                          3
                                                      )}`}
                                            </p>
                                            <FontAwesomeIcon icon={faClock} />{' '}
                                            <span>
                                                {CommonUtility.ShowDateVN(
                                                    item.CreatedDate
                                                )}
                                            </span>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                        );
                    })}
                </>
            );
        }
        return (
            <Row>
                <Col md={{span: 12, offset: 0}}>
                    <div className="class-tieude-hoidap">
                        <span className="red">
                            Kh??ng t??m th???y c??u h???i ph?? h???p
                        </span>
                    </div>
                </Col>
            </Row>
        );
    };

    const SignupSchema = Yup.object().shape({
        noiDungCauHoi: Yup.string()
            .min(2, 'Vui l??ng nh???p ??t nh???t 2 k?? t???')
            .max(255, 'Vui l??ng nh???p kh??ng qu?? 255 k?? t???')
            .required('Vui l??ng nh???p th??ng tin n??y'),
        email: Yup.string().email('?????nh d???ng mail kh??ng h???p l???').nullable()
    });

    const onCreateEntity = (obj) => {
        fetch(`${Constant.PathServer}/api/HoiDap/Create`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    toast.success('Th??m m???i H???i ????p th??nh c??ng');
                    setIsOpenCreatelModal(false);
                    setinitDataItem(false);
                } else {
                    toast.error(json.MessageError);
                }
            });
    };

    function CreateModal() {
        const submitCreate = () => {
            if (formRef.current) {
                formRef.current.handleSubmit();
            }
        };
        return (
            <>
                <Modal
                    show={isOpenCreatelModal}
                    size="lg"
                    onHide={() => setIsOpenCreatelModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>T???o m???i h???i ????p</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formRef}
                            initialValues={{
                                hoTen: '',
                                dienThoai: '',
                                email: '',
                                noiDungCauHoi: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                onCreateEntity(values);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="noiDungCauHoi">
                                            C??u h???i
                                            <span className="red">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            rows={3}
                                            name="noiDungCauHoi"
                                            key="noiDungCauHoi"
                                            className="form-control "
                                        />
                                        {errors.noiDungCauHoi &&
                                        touched.noiDungCauHoi ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.noiDungCauHoi}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hoTen">H??? t??n</label>
                                        <Field
                                            name="hoTen"
                                            key="hoTen"
                                            className="form-control "
                                        />
                                        {errors.hoTen && touched.hoTen ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.hoTen}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dienThoai">
                                            ??i???n tho???i
                                        </label>
                                        <Field
                                            name="dienThoai"
                                            key="dienThoai"
                                            className="form-control "
                                        />
                                        {errors.dienThoai &&
                                        touched.dienThoai ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.dienThoai}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            name="email"
                                            key="email"
                                            className="form-control "
                                        />
                                        {errors.email && touched.email ? (
                                            <>
                                                <div className="invalid-feedback">
                                                    {errors.email}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            style={{transition: 'none'}}
                            onClick={() => setIsOpenCreatelModal(false)}
                        >
                            ????ng
                        </Button>
                        <Button variant="primary" onClick={submitCreate}>
                            G???i c??u h???i
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <>
            <Container>
                <div className="boder-margin">
                    <div className="row">
                        <div className="col-12">
                            <Breadcrumb className="Breadcrumb">
                                <Breadcrumb.Item href="/">
                                    Trang ch???
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    href="#"
                                    className="activeLink"
                                >
                                    {' '}
                                    H???i ????p
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                    <RenderFormSearch />
                    <DetailModal />
                    <CreateModal />
                    <div className="row">
                        <div className="col-sm-12">
                            <RenderData />
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col-sm-12 center"
                            style={{marginTop: '1.5rem'}}
                        >
                            <p>
                                {noMoreData === true ? '---Cu???i trang---' : ''}
                            </p>
                        </div>
                        <div className="col-sm-12 center loadMore">
                            {isLoadMore ?? (
                                <Button
                                    variant="success"
                                    onClick={() => loadMore()}
                                >
                                    <i className="fas fa-spinner" /> T???i th??m
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default DsHoiDap;
