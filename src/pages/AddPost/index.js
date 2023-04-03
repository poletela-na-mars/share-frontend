import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import '../../utils/stringMethods';
import { arrayBufferToBase64 } from '../../utils/arrayBufferToBase64';

import { ModalWindow } from '../../components';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import Container from '@mui/material/Container';
import 'easymde/dist/easymde.min.css';

import styles from './AddPost.module.scss';
import { theme } from '../../theme';
import { ThemeProvider } from '@mui/material';

function InvalidFileError(message) {
    this.name = 'InvalidFileError';
    this.message = message;
}

export const AddPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [oldImageUrl, setOldImageUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [image, setImage] = useState('');
    const [file, setFile] = useState('');
    const [objUrl, setObjUrl] = useState('');
    const inputFileRef = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openPopup, setOpenPopup] = useState(false);
    const [errorText, setErrorText] = useState('');

    const openPopupHandler = () => {
        setOpenPopup(true);
    };

    const closePopupHandler = () => {
        setOpenPopup(false);
    };

    const isEditing = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const targetFile = event.target.files[0];
            const createdObjUrl = URL.createObjectURL(targetFile);

            if (targetFile.type !== 'image/jpeg' && targetFile.type !== 'image/png') {
                throw new InvalidFileError('Недопустимый формат файла.');
            }

            const reFileName = /^[А-яёЁ a-zA-Z0-9_-]{1,80}\.[a-zA-Z]{1,8}$/;
            if (!reFileName.test(targetFile.name)) {
                throw new InvalidFileError('Недопустимое имя или расширение файла.');
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            const minSize = 5 * 1024;
            if (targetFile.size >= maxSize || targetFile.size <= minSize) {
                throw new InvalidFileError('Изображение слишком большое или слишком маленькое (должно быть не меньше 5 Кб и не больше 5 Мб).');
            }

            setFile(targetFile);
            setObjUrl(createdObjUrl);
            setImageUrl('');
            setImagePreview(createdObjUrl);
        } catch (err) {
            console.error(err);
            setErrorText(`${err.message}`);
            openPopupHandler();
        }
    };

    const onClickRemoveImage = () => {
        setImagePreview('');
        setImageUrl('');
        setImage('');
        setFile('');
        URL.revokeObjectURL(objUrl);
    };

    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    const uploadImage = async () => {
        if (file) {
            const formData = new FormData();
            console.log(file);
            formData.append('image', file);
            console.log(formData);
            const { data } = await axios.post('/uploads', formData);
            console.log(data);
            setImageUrl(`/uploads/${data.fileName}`);
            URL.revokeObjectURL(objUrl);

            return data;
        }

        return null;
    };

    const onSubmit = async () => {
        try {
            setIsSubmitting((prevState) => !prevState);
            const uploadData = await uploadImage();
            console.log(uploadData);

            const trimTags = () => {
                const splittedTags = tags.split(',');
                const trimmedTags = splittedTags.map((tag) => tag.trim());
                const filteredTags = trimmedTags.filter((tag) => tag !== '');
                return filteredTags.map((tag) => {
                        const idxOfHash = tag.indexOf('#');
                        if (idxOfHash >= 0) {
                            tag.replaceAt(idxOfHash, '');
                        }
                        const idxOfUnderscore = tag.indexOf('_');
                        if (idxOfUnderscore >= 0) {
                            tag.replaceAt(idxOfUnderscore, ' ');
                        }

                        return tag;
                    }
                );
            };

            const cleanTags = trimTags();

            const fields = {
                title,
                imageUrl: uploadData?.fileName === undefined ? '' : `/uploads/${uploadData.fileName}`,
                tags: cleanTags,
                text,
            };

            console.log('oldImage  ', oldImageUrl);
            console.log(fields.imageUrl);

            if (isEditing && oldImageUrl && oldImageUrl !== fields.imageUrl) {
                fields.oldImageUrl = oldImageUrl;
            }

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);

            const _id = isEditing ? id : data._id;

            setIsSubmitting((prevState) => !prevState);
            navigate(`/posts/${_id}`);
        } catch (err) {
            let errorMsg;
            if (err.response.data instanceof Array) {
                errorMsg = `Статья неверно оформлена:\n${err.response.data.reduce((fullMsg, d) => {
                    return fullMsg + d.msg + '\n'
                }, '')}`;
            } else {
                errorMsg = err.response.data.message;
            }

            setErrorText(errorMsg);
            openPopupHandler();
            setIsSubmitting((prevState) => !prevState);
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({ data }) => {
                setTitle(data.title);
                setText(data.text);
                const url = data.imageUrl;
                console.log(url);
                setOldImageUrl(url);
                setImageUrl(url);
                const dataTags = data.tags;
                const joinedTags = dataTags.join(',');
                setTags(joinedTags);
            }).catch((err) => {
                console.error(err);
                setErrorText('Ошибка при получении статьи.\nПерезагрузите страницу.');
                openPopupHandler();
            });
        }

        if (oldImageUrl) {
            axios.get(oldImageUrl).then((res) => {
                const base64Content = arrayBufferToBase64(res.data.file.data.data);
                setImage(`data:${res.data.file.contentType};base64,${base64Content}`);
            }).catch((err) => {
                console.error(err);
                //TODO - setErrorText
                // openPopupHandler();
            });
        }
    }, [id, oldImageUrl]);

    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                uniqueId: "UniqueID",
                delay: 1000,
            },
        }),
        [],
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ padding: 30 }}>
                <ModalWindow openPopup={openPopup}
                             closePopupHandler={closePopupHandler}
                             text={errorText}
                             error={true}
                />
                <Container disableGutters={true}>
                    <Button onClick={() => inputFileRef.current.click()} variant='outlined'>
                        Загрузить обложку
                    </Button>
                    <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
                    <Button disabled={!(imagePreview || imageUrl)} style={{ marginLeft: 8 }}
                            onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                </Container>
                {imagePreview ? <img className={styles.image} src={imagePreview} alt='Uploaded' />
                    : (image ?
                        <img className={styles.image} src={image}
                             alt='Uploaded' /> :
                        null)
                }
                <br />
                <br />
                <TextField
                    classes={{ root: styles.title }}
                    variant='standard'
                    placeholder='Заголовок статьи...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required={true}
                />
                <TextField
                    classes={{ root: styles.tags }}
                    variant='standard'
                    placeholder='react, tech, modern'
                    helperText='Теги'
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    fullWidth
                />
                <SimpleMDE
                    className={styles.editor}
                    value={text}
                    onChange={onChange}
                    options={options}
                />
                <div className={styles.buttons}>
                    <Button onClick={onSubmit} size='large' variant='contained' disabled={isSubmitting}>
                        {isEditing ? 'Сохранить' : 'Опубликовать'}
                    </Button>
                    <a href='/'>
                        <Button size='large'>Отмена</Button>
                    </a>
                </div>
            </Paper>
        </ThemeProvider>
    );
};
