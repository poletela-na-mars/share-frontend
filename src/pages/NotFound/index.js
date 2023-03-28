import styles from './NotFound.module.scss';

export const NotFound = () => {
    return (
        <div className={styles.root}>
            <img src='/not-found.png' alt='Not found page' />
            <h1 className=''>
                404<br />
                Страница не найдена
            </h1>
            <p>Страница, на которую вы попали, не существует.<br />Проверьте правильность введенного адреса.</p>
        </div>
    );
};