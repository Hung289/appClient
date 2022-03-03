/* eslint-disable react/no-danger */
import React, {Component, useState, useEffect} from 'react';
import * as Constant from '@app/Constant';
import {toast} from 'react-toastify';
import * as hoiDapService from '@app/services/HoiDapService';
import {Container, Accordion, Row, Col, Card, Button} from 'react-bootstrap';

const CauHoiThuongGap = (props) => {
    const [lstItem, setlstItem] = useState([]);
    const [selectItem, setSelectItem] = useState(-1);

    const InitData = () => {
        if (lstItem.length === 0) {
            const amt = 5;
            fetch(
                `${Constant.PathServer}/api/HoiDap/GetListPublicAmount?amount=${amt}`
            )
                .then((response) => response.json())
                .then((json) => {
                    if (json.Status) {
                        setlstItem(json.Data);
                    } else {
                        toast.error(json.MessageError);
                    }
                });
        }
    };
    useEffect(() => {
        InitData();
    });
    const selectItemfunc = (idselect) => {
        let itemSel = idselect;
        if (itemSel === selectItem) {
            itemSel = -1;
        }
        setSelectItem(itemSel);
    };

    return (
        <>
            <div id="boxCauHoiThuongGap">
                <div className="headerBox" style={{color: '#212526'}}>
                    Câu hỏi thường gặp
                </div>

                <Container className="boxCauHoiPanel">
                    {lstItem.map((item, key) => {
                        return (
                            <div className="boxQuestionItem" key={key}>
                                <Button
                                    className="qBlock"
                                    onClick={() => selectItemfunc(key)}
                                >
                                    <span className="Quesion">
                                        {item.NoiDungCauHoi}
                                    </span>

                                    <span className="QIcon">
                                        {selectItem === key ? (
                                            <i className="fas fa-minus" />
                                        ) : (
                                            <i className="fas fa-plus" />
                                        )}
                                    </span>
                                </Button>
                                {selectItem === key ? (
                                    <div className="bAnswer">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item.TraLoiCauHoi
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    })}
                </Container>
            </div>
        </>
    );
};

export default CauHoiThuongGap;
