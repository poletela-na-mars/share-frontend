import { theme } from '../../theme';
import { Box, Fade, Modal } from '@mui/material';
import Button from '@mui/material/Button';

export const ModalWindow = ({ openPopup, closePopupHandler, actionHandler, text, error }) => {
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
        borderRadius: theme.shape.lightRoundedBorderRadius,
        whiteSpace: 'pre-wrap',
        outline: 'none',
        p: 4,
    };

    return (
        <Modal
            aria-labelledby='modal-question'
            className='selection-popup'
            open={openPopup}
            onClose={closePopupHandler}
            closeAfterTransition
        >
            <Fade in={openPopup}>
                <Box sx={styleBoxPopup} className='selection-popup__paper'>
                    <h3 className='selection-popup__question' id='modal-question'>{text}</h3>
                    <Box component='div' className='selection-popup__buttons-container'
                         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        {error
                            ? <Button className='selection-popup__yes-button'
                                // sx={{ marginLeft: '20px', marginRight: '20px' }}
                                      onClick={closePopupHandler}>
                                Закрыть
                            </Button>
                            : (
                                <>
                                    <Button className='selection-popup__yes-button'
                                            sx={{ marginLeft: '20px', marginRight: '20px' }}
                                            onClick={actionHandler}>
                                        Да
                                    </Button>
                                    <Button className='selection-popup__no-button'
                                            sx={{ marginLeft: '20px', marginRight: '20px' }}
                                            onClick={closePopupHandler}>
                                        Нет
                                    </Button>
                                </>
                            )}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};
