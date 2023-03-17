import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

import { Post, TagsBlock } from '../components';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

export const Home = () => {
    const [tabValue, setTabValue] = useState(0);
    const [tag, setTag] = useState('');

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts, tags } = useSelector((state) => state.posts);

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    useEffect(() => {
            let sortQuery;
            let selectedTag;
            switch (tabValue) {
                case 0:
                    sortQuery = 'new';
                    break;
                case 1:
                    sortQuery = 'popular';
                    break;
                case 2:
                    sortQuery = 'tag';
                    break;
            }

            selectedTag = tag;
            dispatch(fetchPosts({ sortQuery, selectedTag }));
        }, [dispatch, tabValue, tag]
    );

    const changeSelectedTag = (value) => {
        setTag(value);
        setTabValue(2);
    };

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleTabValueChange = (e, tabValue) => {
        setTag('');
        setTabValue(tabValue);
    };

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={tabValue} onChange={handleTabValueChange} aria-label='tabs'>
                <Tab label='Новые' />
                <Tab label='Популярные' />
                <Tab label='По тегам' disabled={true} />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, idx) =>
                        isPostsLoading ? (
                            <Post key={idx} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                wasEdited={obj.wasEdited}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.commentsCount}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock
                        items={tags.items}
                        changeSelectedTag={changeSelectedTag}
                        tag={tag}
                        isLoading={isTagsLoading}
                    />
                </Grid>
            </Grid>
        </>
    );
};
