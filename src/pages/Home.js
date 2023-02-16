import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { dateFormatter } from '../utils/dateFormatter';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { CommentsBlock, Post, TagsBlock } from '../components';

//TODO - убрать обводку на статье при просмотре

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const {posts, tags} = useSelector((state) => state.posts);

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    useEffect(() => {
            dispatch(fetchPosts());
            dispatch(fetchTags());
        }, [dispatch]
    );

    return (
        <>
            <Tabs style={{marginBottom: 15}} value={0} aria-label='basic tabs example'>
                <Tab label='Новые'/>
                <Tab label='Популярные'/>
                {/*TODO - функциональность "Популярные"*/}
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, idx) =>
                        isPostsLoading ? (
                            <Post key={idx} isLoading={true}/>
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                                user={obj.user}
                                createdAt={dateFormatter(obj.createdAt)}
                                viewsCount={obj.viewsCount}
                                commentsCount={3}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading}/>
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};

//TODO - выделение ссылок и статей - сменить цвет
