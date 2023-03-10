import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchRemovePost } from '../../redux/slices/posts';
import { dateFormatter } from '../../utils/dateFormatter';

import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { UserInfo } from '../UserInfo';
import { ModalPicture } from '../ModalPicture/ModalPicture';
import { PostSkeleton } from './Skeleton';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { Menu, MenuItem, styled, ThemeProvider } from '@mui/material';

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
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
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
    const isOpenedPostMenu = Boolean(anchorEl);

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

    const removePostHandler = () => {
        dispatch(fetchRemovePost({ id, imageUrl }));
        window.location.reload();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
                <ModalWindow openPopup={openSelectionPopup}
                             closePopupHandler={closeSelectionPopupHandler}
                             actionHandler={removePostHandler}
                             text='Вы действительно хотите удалить статью?'
                             error={false}
                />
                <ModalPicture openPopup={openPicture} closePopupHandler={closePictureHandler} src={imageUrl}
                              title={title} />
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
                            src={imageUrl}
                            alt={title}
                            onClick={() => setOpenPicture(true)}
                        />
                    ) : (<img
                        className={styles.image}
                        src={imageUrl}
                        alt={title}
                    />)
                )}
                <div className={styles.wrapper}>
                    <UserInfo {...user}
                              additionalText={wasEdited ?
                                  `${dateFormatter(createdAt)} (ред. ${dateFormatter(wasEdited)})` :
                                  dateFormatter(createdAt)} />
                    <div className={styles.indention}>
                        <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
                        </h2>
                        <ul className={styles.tags}>
                            {tags.map((name) => (
                                <li key={name}>
                                    #{name}
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
        </ThemeProvider>
    );
};
