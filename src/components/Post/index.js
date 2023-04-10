import { useEffect, useState } from 'react';
import axios from 'axios';

import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchRemovePost } from '../../redux/slices/posts';
import { dateFormatter } from '../../utils/dateFormatter';
import { arrayBufferToBase64 } from '../../utils/arrayBufferToBase64';

import { UserInfo } from '../UserInfo';
import { ModalPicture } from '../ModalPicture';
import { PostSkeleton } from './PostSkeleton';
import { ModalWindow } from '../ModalWindow';

import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Menu, MenuItem, styled, ThemeProvider } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import styles from './Post.module.scss';
import { theme } from '../../theme';

const StyledPostMenu = styled((props) => (
    <Menu
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(1),
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px' +
            ' -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
    },
}));

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
    const [openPicture, setOpenPicture] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [image, setImage] = useState('');

    useEffect(() => {
        if (imageUrl) {
            axios.get(imageUrl).then((res) => {
                const base64Content = arrayBufferToBase64(res.data.file.data.data);
                setImage(`data:${res.data.file.contentType};base64,${base64Content}`);
            }).catch((err) => {
                console.error(err);
                //TODO - setErrorText
                // openPopupHandler();
            });
        }
    }, [imageUrl]);
    
    const isOpenedPostMenu = Boolean(anchorEl);

    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    if (isLoading) {
        return <PostSkeleton />;
    }

    const removePostButtonClickHandler = () => {
        setOpenSelectionPopup(true);
    };

    const closeSelectionPopupHandler = () => {
        setOpenSelectionPopup(false);
    };

    const closePostMenuHandler = () => {
        setAnchorEl(null);
    };

    const closePictureHandler = () => {
        setOpenPicture(false);
    };

    const removePostHandler = async () => {
        await dispatch(fetchRemovePost({ id, imageUrl }));
        window.location.reload();
    };

    return (
        <ThemeProvider theme={theme}>
            <ModalWindow openPopup={openSelectionPopup}
                         closePopupHandler={closeSelectionPopupHandler}
                         actionHandler={removePostHandler}
                         text='Вы действительно хотите удалить статью?'
                         error={false}
            />
            <ModalPicture openPopup={openPicture} closePopupHandler={closePictureHandler} src={image}
                          title={title} />
            <div ref={ref} className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
                {isEditable && (
                    <div className={styles.editButtons}>
                        <IconButton
                            color='primary'
                            aria-controls={isOpenedPostMenu ? 'basic-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={isOpenedPostMenu ? 'true' : undefined}
                            onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <MoreVertOutlinedIcon />
                        </IconButton>
                        <StyledPostMenu
                            id='post-menu'
                            anchorEl={anchorEl}
                            open={isOpenedPostMenu}
                            onClose={closePostMenuHandler}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button'
                            }}
                        >
                            <MenuItem component={Link} to={`/posts/${id}/edit`}>Редактировать</MenuItem>
                            <MenuItem onClick={removePostButtonClickHandler}>Удалить</MenuItem>
                        </StyledPostMenu>
                    </div>
                )}
                {imageUrl && (isFullPost ? (
                        <img
                            className={clsx(styles.image, styles.minImageFullPost)}
                            src={image}
                            alt={title}
                            onClick={() => setOpenPicture(true)}
                        />
                    ) : inView
                        ? <img
                            className={styles.image}
                            src={image}
                            alt={title}
                        />
                        : <Skeleton variant='rectangular' width='100%' height={300} />
                )}
                <div className={styles.wrapper}>
                    {inView
                        ? <UserInfo {...user}
                                    additionalText={wasEdited ?
                                        `${dateFormatter(createdAt)} (ред. ${dateFormatter(wasEdited)})` :
                                        dateFormatter(createdAt)} />
                        : <div className={styles.skeletonUser}>
                            <Skeleton
                                variant='circular'
                                width={40}
                                height={40}
                                style={{ marginRight: 10 }}
                            />
                            <div className={styles.skeletonUserDetails}>
                                <Skeleton variant='text' width={60} height={20} />
                                <Skeleton variant='text' width={100} height={15} />
                            </div>
                        </div>
                    }
                    <div className={styles.indention}>
                        <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                            {isFullPost ? title : inView
                                ? <Link to={`/posts/${id}`}>{title}</Link>
                                : <Skeleton variant='text' width='80%' height={45} />
                            }
                        </h2>
                        <ul className={styles.tags}>
                            {inView
                                ? tags.map((name) => (
                                    <li key={name}>
                                        #{name}
                                    </li>
                                ))
                                : <div className={styles.skeletonTags}>
                                    <Skeleton variant='text' width={40} height={30} />
                                    <Skeleton variant='text' width={40} height={30} />
                                    <Skeleton variant='text' width={40} height={30} />
                                </div>
                            }
                        </ul>
                        {children && <div className={styles.content}>{children}</div>}
                        {inView
                            ? (
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
                            )
                            : (
                                <div className={styles.skeletonDetails}>
                                    <Skeleton variant='text' width={38} height={35} />
                                    <Skeleton variant='text' width={38} height={35} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};
