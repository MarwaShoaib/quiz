import React from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './deleteModalContent.module.scss';

const DeleteModalContent = (props) => {
    const { handleClose, onDelete, title, message } = props ?? {
        handleClose: () => {},
        onDelete: () => {},
        title: 'Delete Question',
        message: 'Are you sure to delete this question?',
    };
    return (
        <div className={styles['modal-content']}>
            <div className={styles['delete-icon']}>
                <DeleteIcon color='error' fontSize='large' />
            </div>
            <h4>{title}</h4>
            <p>{message}</p>

            <div>
                <Button variant='outlined' onClick={handleClose}>
                    <ClearIcon />
                    <span>Cancel</span>
                </Button>
                <Button variant='contained' color='error' onClick={onDelete}>
                    <DeleteIcon />
                    <span>Confirm</span>
                </Button>
            </div>
        </div>
    );
};

export default DeleteModalContent;
