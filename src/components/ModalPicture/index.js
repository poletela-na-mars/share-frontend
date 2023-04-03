import { theme } from '../../theme';
import { Box, Fade, Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import styles from '../Post/Post.module.scss';

export const ModalPicture = ({ openPopup, closePopupHandler, src, title }) => {
    const styleBoxPopup = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'lg',
        bgcolor: 'background.paper',
        borderRadius: theme.shape.borderRadius,
        p: 4,
        outline: 'none',
        margin: '2%',
    };

    return (
        <Modal
            className='picture-popup'
            open={openPopup}
            onClose={closePopupHandler}
            closeAfterTransition
        >
            <Fade in={openPopup}>
                <Box sx={styleBoxPopup} className='picture-popup__paper'>
                    <div className={styles.closePicButton}>
                        <IconButton color='primary' onClick={closePopupHandler}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </div>
                    <Box component='div' className='picture-popup__container'
                         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <img src={src} alt={title} className={styles.imageFull} />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};
