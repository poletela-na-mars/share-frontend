import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchRemovePost } from '../../redux/slices/posts';
import { dateFormatter } from '../../utils/dateFormatter';

import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './Post.module.scss';

import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { ModalWindow } from '../ModalWindow/ModalWindow';

export const Post = ({
                         id,
                         title,
                         createdAt,
                         wasEdited,
                         imageUrl,
                         user,
                         viewsCount,
                         commentsCount,
                         tags,
                         children,
                         isFullPost,
                         isLoading,
                         isEditable,
                     }) => {
    const dispatch = useDispatch();
    const [openSelectionPopup, setOpenSelectionPopup] = useState(false);

    if (isLoading) {
        return <PostSkeleton />;
    }

    const removePostButtonClickHandler = () => {
        setOpenSelectionPopup(true);
    };

    const closeSelectionPopupHandler = () => {
        setOpenSelectionPopup(false);
    };


    //TODO - некорректная страница - страница с ошибкой (несущестсвующий уже тег, страный id статьи)
    const removePostHandler = () => {
        dispatch(fetchRemovePost({ id, imageUrl }));
        window.location.reload();
    };

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
            <ModalWindow openPopup={openSelectionPopup}
                         closePopupHandler={closeSelectionPopupHandler}
                         actionHandler={removePostHandler}
                         text='Вы действительно хотите удалить статью?'
                         error={false}
            />
            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${id}/edit`}>
                        <IconButton color='primary'>
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={removePostButtonClickHandler} color='secondary'>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            {imageUrl && (
                <img
                    className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
                    src={imageUrl}
                    alt={title}
                />
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user}
                          additionalText={wasEdited ? `${dateFormatter(createdAt)} (ред. ${dateFormatter(wasEdited)})` :
                              dateFormatter(createdAt)} />
                <div className={styles.indention}>
                    <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                        {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
                    </h2>
                    <ul className={styles.tags}>
                        {tags.map((name) => (
                            <li key={name}>
                                <Link to={`/tag/${name}`}>#{name}</Link>
                            </li>
                        ))}
                    </ul>
                    {children && <div className={styles.content}>{children}</div>}
                    <ul className={styles.postDetails}>
                        <li>
                            <EyeIcon />
                            <span>{viewsCount}</span>
                        </li>
                        <li>
                            <CommentIcon />
                            <span>{commentsCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

//TODO: -поправить верстку на мобильных устр-х
