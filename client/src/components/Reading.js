import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

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

const Reading = () => {
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const flipBook = useRef(null);

    const nextButtonClick = () => {
        flipBook.current.getPageFlip().flipNext();
    };

    const prevButtonClick = () => {
        flipBook.current.getPageFlip().flipPrev();
    };

    const onPage = (e) => {
        setPage(e.data);
    };

    useEffect(() => {
        setTotalPage(flipBook.current.getPageFlip().getPageCount());
    }, []);

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
                onFlip={onPage}
                className="book"
                ref={flipBook}
            >
                <PageCover>Tarot Log</PageCover>
                <Page number={1}>Lorem ipsum...</Page>
                <Page number={2}>Lorem ipsum...</Page>
                {/*...*/}
                <PageCover>THE END</PageCover>
            </HTMLFlipBook>

            <div className="container">
                <div>
                    <button type="button" onClick={prevButtonClick}>
                        Previous Entry
                    </button>

                    [<span>{page}</span> of <span>{totalPage}</span>]

                    <button type="button" onClick={nextButtonClick}>
                        Next Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reading;