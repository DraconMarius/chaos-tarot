import React, { useState, useEffect } from 'react';
import { Button, Container, Box, TextField } from '@mui/material'
import styled from '@emotion/styled'
import HTMLFlipBook from "react-pageflip";
const PageCover = React.forwardRef((props, ref) => {
    return (
        <div className="page page-cover" ref={ref} data-density="hard">
            <div className="page-content">
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="page" ref={ref}>
            <div className="page-content">
                <h2 className="page-header">Page header - {props.number}</h2>
                <div className="page-image"></div>
                <div className="page-text">{props.children}</div>
                <div className="page-footer">{props.number + 1}</div>
            </div>
        </div>
    );
});

class ReadingBook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            totalPage: 0,
        };
    }

    nextButtonClick = () => {
        this.flipBook.getPageFlip().flipNext();
    };

    prevButtonClick = () => {
        this.flipBook.getPageFlip().flipPrev();
    };

    onPage = (e) => {
        this.setState({
            page: e.data,
        });
    };

    componentDidMount() {
        this.setState({
            totalPage: this.flipBook.getPageFlip().getPageCount(),
        });
    }

    render() {
        return (
            <div>
                <HTMLFlipBook
                    width={550}
                    height={733}
                    size="stretch"
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={this.onPage}
                    onChangeOrientation={this.onChangeOrientation}
                    onChangeState={this.onChangeState}
                    className="demo-book"
                    ref={(el) => (this.flipBook = el)}
                >

                    <PageCover>Reading</PageCover>
                    {this.props.logData.map((log, index) => (
                        <Page key={index} number={index + 1}>
                            <img src={log.image} alt={log.title} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }} />
                            <p>{log.text}</p>
                        </Page>
                    ))}
                    <PageCover>THE END</PageCover>

                </HTMLFlipBook>

                <div className="container centered">
                    <div>

                        <button type="button" onClick={this.prevButtonClick}>
                            Previous page
                        </button>

                        [<span>{this.state.page}</span> of
                        <span>{this.state.totalPage}</span>]

                        <button type="button" onClick={this.nextButtonClick}>
                            Next page
                        </button>

                    </div>
                    <div>

                        State: <i>{this.state.state}</i>, orientation: <i>{this.state.orientation}</i>

                    </div>
                </div>
            </div>
        );
    }
}


const Reading = ({ logData }) => {
    const [selected, setSelected] = useState(0);
    console.log(logData)
    const [logs, setLogs] = useState()



    return (
        <div className="container">
            {(!logData) ? (
                "Error: please refresh to try again OR no reading yet"
            ) : (
                <>
                    <ReadingBook logData={logData} />
                    {logData.map((log, index) => (
                        <div className="page" key={index}>
                            <div className="page-content">
                                <img src={log.cards[0].image} alt={log.cards[0].description} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }} />
                                <p>{log.note}</p>
                            </div>
                        </div>
                    ))}
                </>
            )}

        </div >
    );
};


export default Reading;