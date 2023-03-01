import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../redux/slices/auth';

import axios from '../axios';
import ReactMarkdown from 'react-markdown';

import { Post } from '../components';
import { Index } from '../components';
import { CommentsBlock } from '../components';
import { ModalWindow } from '../components/ModalWindow/ModalWindow';

export const FullPost = () => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [lastComment, setLastComment] = useState({});
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);

    const [openPopup, setOpenPopup] = useState(false);
    const [errorText, setErrorText] = useState('');

    const openPopupHandler = () => {
        setOpenPopup(true);
    };

    const closePopupHandler = () => {
        setOpenPopup(false);
    };

    const updateLastComment = (value) => {
        setLastComment(value);
    };

    useEffect(() => {
        axios.get(`posts/${id}`).then((res) => {
            setData(res.data);
            setIsLoading(false);
        }).catch((err) => {
            console.error(err);
            setErrorText('Ошибка при получении статьи. Перезагрузите страницу.');
            openPopupHandler();
        });
    }, [id, lastComment]);

    if (isLoading) {
        return (
            <>
                <ModalWindow openPopup={openPopup}
                             closePopupHandler={closePopupHandler}
                             text={errorText}
                             error={true}
                />
                <Post isLoading={isLoading} />
            </>
        );
    }

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
                user={data.user}
                createdAt={data.createdAt}
                wasEdited={data.wasEdited}
                viewsCount={data.viewsCount}
                commentsCount={data.commentsCount}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock
                // items={[
                //     {
                //         user: {
                //             fullName: 'Вася Пупкин',
                //             avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                //         },
                //         text: 'Это тестовый комментарий 555555',
                //     },
                //     {
                //         user: {
                //             fullName: 'Иван Иванов',
                //             avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                //         },
                //         text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                //     },
                // ]}
                items={(isLoading ? [...Array(2)] : data.comments).map((obj) => {
                    return {
                        user: {
                            fullName: obj.author,
                            avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                        },
                        text: obj.text,

                    };
                })}
                isLoading={false}
            >
                {isAuth && <Index updateLastComment={updateLastComment} />}
            </CommentsBlock>
        </>
    );
};
