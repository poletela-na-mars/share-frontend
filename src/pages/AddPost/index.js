import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { theme } from '../../theme';

export const AddPost = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const inputFileRef = useRef(null);

    const isEditing = Boolean(id);

    console.log(id, isEditing);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const {data} = await axios.post('/upload', formData);
            setImageUrl(data.url);
        } catch (err) {
            console.error(err);
            //TODO - попап для ошибки
            alert('Ошибка при загрузке файла');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    const onSubmit = async () => {
        try {
            setLoading(true);

            //TODO - добавить error для неверных тегов, заголовка, текста
            const trimTags = () => {
                const splittedTags = tags.split(',');
                const trimmedTags =  splittedTags.map((tag) => tag.trim());
                return trimmedTags.filter((tag) => tag !== '');
            };

            const cleanTags = trimTags();

            const fields = {
                title,
                imageUrl,
                tags: cleanTags,
                text,
            };

            const {data} = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);

            console.log(id, isEditing);

            //TODO - добавить "последние изменения: время". Добавить в бэке поле "edited" - tr/f -> покажем строку в Post
            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`);
        } catch (err) {
            console.error(err);
            //TODO - попап для ошибки
            alert('Ошибка при создании статьи');
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({data}) => {
                setTitle(data.title);
                setText(data.text);
                setImageUrl(data.imageUrl);
                const dataTags = data.tags;
                const joinedTags = dataTags.join(',');
                setTags(joinedTags);
            }).catch((err) => {
                console.error(err);
                //TODO - попап с ошибкой
                alert('Ошибка при получении статьи')
            });
        }
    }, [id]);

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
        return <Navigate to='/'/>;
    }

    return (
        //TODO - уменьшить размер картинки
        //TODO - поправить верстку, когда есть картинка в посте
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant='outlined'>
                Загрузить обложку
            </Button>
            <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <>
                    <Button variant='contained' style={{marginLeft: 8, backgroundColor: theme.palette.primary.light}} onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt='Uploaded'/>
                </>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant='standard'
                placeholder='Заголовок статьи...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
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
                <Button onClick={onSubmit} size='large' variant='contained'>
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <a href='/'>
                    <Button size='large'>Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
