import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import styles from './TagsBlock.module.scss';

import { SideBlock } from '../SideBlock';
import { theme } from '../../theme';
import { nanoid } from '@reduxjs/toolkit';

//TODO - поиск по тегам
//TODO - фильтрация статей по тегам
export const TagsBlock = ({items, isLoading = true}) => {
    return (
        <SideBlock title='Теги'>
            <List
                className={styles.list}
                style={{maxHeight: 300, overflow: 'auto'}}
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '0.4em'
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        borderRadius: theme.shape.lightRoundedBorderRadius,
                    }
                }}
            >
                {(isLoading ? [...Array(5)] : items).filter((x, i, a) => a.indexOf(x) === i).map((name) => (
                    <a
                        style={{textDecoration: 'none', color: 'black'}}
                        href={`/tags/${name}`}
                        key={nanoid()}
                    >
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <TagIcon/>
                                </ListItemIcon>
                                {isLoading ? (
                                    <Skeleton width={100}/>
                                ) : (
                                    <ListItemText primary={name}/>
                                )}
                            </ListItemButton>
                        </ListItem>
                    </a>
                ))}
            </List>
        </SideBlock>
    );
};
