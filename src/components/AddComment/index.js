import { useState } from 'react';

import axios from '../../axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAuthMe } from '../../redux/slices/auth';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { ModalWindow } from '../ModalWindow/ModalWindow';


export const Index = ({updateLastComment}) => {
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
            setErrorText('Ошибка при создании комментария. Перезагрузите страницу и попробуйте снова.');
            openPopupHandler();
        }
    };

    return (
        <>
            <ModalWindow openPopup={openPopup}
                         closePopupHandler={closePopupHandler}
                         text={errorText}
                         error={true}
            />
            <div className={styles.root}>
                <Avatar
                    classes={{ root: styles.avatar }}
                    src='https://mui.com/static/images/avatar/5.jpg'
                />
                <div className={styles.form}>
                    <TextField
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
                    <Button type='submit' onClick={onSubmit} variant='contained'>Отправить</Button>
                </div>
            </div>
        </>
    );
};
