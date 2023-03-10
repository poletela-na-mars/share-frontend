import { useState } from 'react';

import axios from '../../axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAuthMe } from '../../redux/slices/auth';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { ThemeProvider } from '@mui/material';

import styles from './AddComment.module.scss';
import { theme } from '../../theme';

export const AddComment = ({ updateLastComment, author }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [comment, setComment] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const [errorText, setErrorText] = useState('');

    const openPopupHandler = () => {
        setOpenPopup(true);
    };

    const closePopupHandler = () => {
        setOpenPopup(false);
    };

    //TODO - openPopupHandler не работает
    const onSubmit = async () => {
        try {
            const data = await dispatch(fetchAuthMe());

            const fields = {
                author: data.payload.fullName,
                text: comment,
            };

            setComment('');
            await axios.post(`/posts/${id}`, fields);
            updateLastComment(fields);
        } catch (err) {
            console.error(err);
            const errorMsg = `${err.response.data.reduce((fullMsg, d) => { return fullMsg + d.msg + '\n'}, '')}`;
            setErrorText(errorMsg);
            openPopupHandler();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.root}>
                <ModalWindow openPopup={openPopup}
                             closePopupHandler={closePopupHandler}
                             text={errorText}
                             error={true}
                />
                <Avatar
                    classes={{ root: styles.avatar }}
                    src={`/avatars/${author.charAt(0).toLowerCase()}.png`}
                />
                <div className={styles.form}>
                    <TextField
                        helperText={errorText}
                        error={Boolean(errorText)}
                        label='Комментарий'
                        variant='outlined'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxRows={10}
                        inputProps={{ maxLength: 100 }}
                        multiline
                        fullWidth
                        placeholder='Написать комментарий'
                    />
                    <Button onClick={onSubmit} variant='contained'>Отправить</Button>
                </div>
            </div>
        </ThemeProvider>
    );
};
