import React, {Component, useState, useEffect} from 'react';
import {Container, Row, Col, Breadcrumb} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import Button from '@app/../node_modules/react-bootstrap/esm/Button';
import * as CommonUtility from '@modules/Common/CommonUtility';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from 'react-router-dom';

const DsTinNhom = () => {
    const [lstItem, setlstItem] = useState({page: 1, data: []});
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [initDataItem, setinitDataItem] = useState(false);
    const [Category, setCategory] = useState({});
    const {maNhom} = useParams();
    const amt = 10;

    const InitData = () => {
        if (!initDataItem) {
            fetch(
                `${Constant.PathServer}/api/TinTuc/GetDataByCategory?categoryCode=${maNhom}&page=${lstItem.page}`
            )
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        const lstData = [
                            ...lstItem.data,
                            ...json.Data.PageDataByCategory.ListItem
                        ];
                        const NewObj = {
                            ...lstItem,
                            data: lstData
                        };
                        setCategory(json.Data.Category);
                        setlstItem(NewObj);
                        if (
                            lstItem.page <
                            json.Data.PageDataByCategory.TotalPage
                        ) {
                            setIsLoadMore(true);
                        } else {
                            setIsLoadMore(false);
                        }
                    }
                });
        }
        setinitDataItem(true);
    };
    useEffect(() => {
        InitData();
    }, []);

    const loadMore = () => {
        fetch(
            `${Constant.PathServer}/api/TinTuc/GetPublish?amount=${amt}&page=${
                lstItem.page + 1
            }`
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    if (json.Data.length > 0) {
                        const lstData = [
                            ...lstItem.data,
                            ...json.Data.PageDataByCategory.ListItem
                        ];
                        const NewObj = {
                            ...lstItem,
                            data: lstData
                        };

                        setlstItem(NewObj);
                        if (
                            lstItem.page <
                            json.Data.PageDataByCategory.TotalPage
                        ) {
                            setIsLoadMore(true);
                        } else {
                            setIsLoadMore(false);
                        }
                    }
                }
            });
    };
    return (
        <Container>
            <div className="boder-margin">
                <Breadcrumb className="Breadcrumb">
                    <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item href="/" className="activeLink">
                        {' '}
                        {Category.Name}
                    </Breadcrumb.Item>
                    {/* <Breadcrumb.Item active>Thông tin về chúng tôi</Breadcrumb.Item> */}
                </Breadcrumb>

                {lstItem.data.map((item, key) => {
                    const pathLink = `/#/ChiTietTinBai/${item.Id}`;
                    return (
                        <div className="class-timtuc" key={key}>
                            <Row>
                                <Col md={3}>
                                    <img
                                        src={`${Constant.PathServer}${item.ImageData}`}
                                        onError={NotFoundImage}
                                        alt=""
                                        className="img-tintuc"
                                    />
                                </Col>
                                <Col md={9}>
                                    <a href={pathLink}>
                                        <div className="class-tieude-tintuc">
                                            {item.Title}
                                        </div>
                                    </a>
                                    <p className="text-p-tintuc">
                                        {item.Description}
                                    </p>
                                    <i className="far fa-clock" />
                                    &nbsp;
                                    <span>
                                        {CommonUtility.ShowDateVN(
                                            item.PublishTime
                                        )}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    );
                })}
                <div className="row">
                    {isLoadMore && (
                        <div className="col-sm-12 center">
                            <Button
                                variant="success"
                                onClick={() => loadMore()}
                            >
                                Tải thêm
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default DsTinNhom;
