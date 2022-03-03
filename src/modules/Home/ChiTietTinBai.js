/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import {Container, Breadcrumb} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import * as Constant from '@app/Constant';
import * as CommonUtility from '@modules/Common/CommonUtility';
import DsTinMoi from '@modules/Home/DsTinMoi';
import {
    InlineReactionButtons,
    InlineShareButtons,
    StickyShareButtons,
    InlineFollowButtons
} from 'sharethis-reactjs';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from 'react-router-dom';

const ChiTietTinBai = () => {
    const {id} = useParams();

    // useEffect(() => {
    //     alert(id);
    //     // if (id !== initDataItem) {
    //     //     setinitDataItem(false);
    //     //     setidparam(id);
    //     // }
    //     // setidparam(id);
    //     InitData();
    // });
    function RenderData() {
        const [chitietTinBai, setChitiettinbai] = useState({});
        const [initDataItem, setinitDataItem] = useState(false);
        const InitData = () => {
            if (!initDataItem) {
                fetch(`${Constant.PathServer}/api/TinTuc/GetDtoById?id=${id}`)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.Status) {
                            setChitiettinbai(json.Data);
                        }
                    });
                setinitDataItem(true);
            }
        };
        InitData();
        return (
            <Container>
                <div className="row">
                    <div className="col-sm-12">
                        <Breadcrumb className="Breadcrumb">
                            <Breadcrumb.Item href="/">
                                Trang chủ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="#" className="activeLink">
                                {' '}
                                Tin tức
                            </Breadcrumb.Item>
                            {/* <Breadcrumb.Item active>Thông tin về chúng tôi</Breadcrumb.Item> */}
                        </Breadcrumb>
                    </div>
                    <div className=" col-sm-8">
                        <div className="text-noidung">
                            <div className="class-tieude-tintuc">
                                {chitietTinBai.Title}
                            </div>
                            <p className="ngay-chitiet">
                                <i className="far fa-clock" />{' '}
                                {CommonUtility.ShowDateVN(
                                    chitietTinBai.PublishTime
                                )}
                            </p>
                            <p className="text-p-tintuc">
                                {chitietTinBai.Description}
                            </p>
                        </div>
                        <InlineShareButtons
                            config={{
                                alignment: 'center', // alignment of buttons (left, center, right)
                                color: 'social', // set the color of buttons (social, white)
                                enabled: true, // show/hide buttons (true, false)
                                font_size: 16, // font size for the buttons
                                labels: 'cta', // button labels (cta, counts, null)
                                language: 'vi', // which language to use (see LANGUAGES)
                                networks: [
                                    // which networks to include (see SHARING NETWORKS)
                                    'messenger',
                                    'facebook',
                                    'twitter',
                                    'whatsapp',
                                    'linkedin',
                                    'zalo'
                                ],
                                padding: 12, // padding within buttons (INTEGER)
                                radius: 4, // the corner radius on each button (INTEGER)
                                show_total: true,
                                size: 40, // the size of each button (INTEGER)

                                // OPTIONAL PARAMETERS
                                // url: 'https://www.sharethis.com', // (defaults to current url)
                                // image: 'https://bit.ly/2CMhCMC', // (defaults to og:image or twitter:image)
                                url: `${Constant.PathServer}/ChiTietTinBai/${chitietTinBai.id}`,
                                image: `${Constant.PathServer}${chitietTinBai.ImageData}`,
                                description: chitietTinBai.description, // (defaults to og:description or twitter:description)
                                title: chitietTinBai.title // (defaults to og:title or twitter:title)
                                // message: 'custom email text', // (only for email sharing)
                                // subject: 'custom email subject', // (only for email sharing)
                                // username: 'custom twitter handle' // (only for twitter sharing)
                            }}
                        />
                        <div className="textNoiDungTinBai">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: chitietTinBai.Content
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="boxRightHeader">Tin mới</div>
                        <DsTinMoi />
                    </div>
                </div>
            </Container>
        );
    }

    return <RenderData />;
};

export default ChiTietTinBai;
