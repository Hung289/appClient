import React, {Component, useState, useEffect} from 'react';
import {Carousel} from 'react-bootstrap';
import * as Constant from '@app/Constant';
import {NotFoundImage} from '@modules/Common/NotFound';

const BannerTop = (props) => {
    const [lstItem, setlstItem] = useState([]);
    const [initDataItem, setinitDataItem] = useState(false);
    const InitData = () => {
        if (initDataItem === false) {
            fetch(`${Constant.PathServer}/api/BannersHome/GetPublishBanner`)
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        setlstItem(json.Data);
                    }
                });
        }
        setinitDataItem(true);
    };
    useEffect(() => {
        InitData();
    });

    return (
        <>
            <Carousel>
                {lstItem.map((item) => {
                    return (
                        <Carousel.Item key={item.Id}>
                            <img
                                className="d-block w-100 bannertop"
                                src={`${Constant.PathServer}${item.ImageSrc}`}
                                onError={NotFoundImage}
                                alt=""
                            />
                        </Carousel.Item>
                    );
                })}
            </Carousel>
            {/* 
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/slide2.jpg"
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/slide2.jpg"
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel> 
            */}
        </>
    );
};

export default BannerTop;
