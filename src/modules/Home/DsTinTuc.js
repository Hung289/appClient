import React, {Component, useState, useEffect} from 'react';
import {Container, Row, Col, Breadcrumb} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';
import Button from '@app/../node_modules/react-bootstrap/esm/Button';
import * as CommonUtility from '@modules/Common/CommonUtility';

const DsTinTuc = () => {
    const [lstItem, setlstItem] = useState({page: 1, data: []});
    const [initDataItem, setinitDataItem] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const amt = 10;

    const InitData = () => {
        if (!initDataItem) {
            fetch(
                `${Constant.PathServer}/api/TinTuc/GetPublish?amount=${amt}&page=${lstItem.page}`
            )
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        const lstData = [
                            ...lstItem.data,
                            ...json.Data.ListItem
                        ];
                        const NewObj = {
                            ...lstItem,
                            data: lstData
                        };
                        if (lstItem.page < json.Data.TotalPage) {
                            setIsLoadMore(true);
                        } else {
                            setIsLoadMore(false);
                        }
                        setlstItem(NewObj);
                    }
                });
        }
        setinitDataItem(true);
    };
    useEffect(() => {
        InitData();
    });

    const loadMore = () => {
        fetch(
            `${Constant.PathServer}/api/TinTuc/GetPublish?amount=${amt}&page=${
                lstItem.page + 1
            }`
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.Status) {
                    if (json.Data.ListItem.length > 0) {
                        const lstData = [
                            ...lstItem.data,
                            ...json.Data.ListItem
                        ];
                        const NewObj = {
                            page: json.Data.CurrentPage,
                            data: lstData
                        };

                        setlstItem(NewObj);
                        if (json.Data.CurrentPage < json.Data.TotalPage) {
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
            <div className="row">
                <div className="col-sm-12">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item href="/" className="activeLink">
                            {' '}
                            Tin tức
                        </Breadcrumb.Item>
                        {/* <Breadcrumb.Item active>Thông tin về chúng tôi</Breadcrumb.Item> */}
                    </Breadcrumb>
                </div>
            </div>

            {lstItem.data.map((item, key) => {
                const pathLink = `/ChiTietTinBai/${item.Id}`;
                return (
                    <Row className="class-timtuc" key={key}>
                        <Col md={3} sm={4}>
                            <img
                                src={`${Constant.PathServer}${item.ImageData}`}
                                onError={NotFoundImage}
                                alt=""
                                className="img-tintuc"
                            />
                        </Col>
                        <Col md={9} sm={8}>
                            <a href={pathLink}>
                                <div className="class-tieude-tintuc">
                                    {item.Title}
                                </div>
                            </a>
                            <p className="text-p-tintuc">{item.Description}</p>
                            <i className="far fa-clock" />
                            &nbsp;
                            <span>
                                {CommonUtility.ShowDateVN(item.PublishTime)}
                            </span>
                        </Col>
                    </Row>
                );
            })}

            <div className="row">
                {isLoadMore && (
                    <div className="col-sm-12 center loadMore">
                        <Button variant="success" onClick={() => loadMore()}>
                            <i className="fas fa-spinner" /> Tải thêm
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default DsTinTuc;
