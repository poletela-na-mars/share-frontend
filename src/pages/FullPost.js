import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../redux/slices/auth';

import axios from '../axios';
import ReactMarkdown from 'react-markdown';

import { CommentsBlock, Post } from '../components';
import { ModalWindow } from '../components/ModalWindow/ModalWindow';

export const FullPost = () => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [lastComment, setLastComment] = useState({});
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);

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
            if (err.response.status === 404) {
                setErrorText('Статья не найдена. Проверьте url-адрес страницы.')
            } else {
                setErrorText('Ошибка при получении статьи.\nПерезагрузите страницу.');
            }
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
                items={(isLoading ? [...Array(2)] : data.comments).map((obj) => {
                    return {
                        user: {
                            fullName: obj.author,
                            avatarUrl: obj.avatarUrl,
                        },
                        text: obj.text,

                    };
                })}
                isLoading={false}
            >
                {isAuth && <ModalWindow author={userData.fullName} updateLastComment={updateLastComment} />}
            </CommentsBlock>
        </>
    );
};
