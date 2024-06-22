import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { domainList, subDomainList } from '../../../config';
import { useState } from 'react';

export default function IsAnsweredFilter({ handleSelect }) {
    const [answerStatus, setAnswerStatus] = useState('');

    function handleChange(ev) {
        setAnswerStatus(ev.target.value);

        handleSelect(ev.target.value);
    }

    return (
        <>
            <FormControl style={{ width: '23%', margin: '0 1rem' }}>
                <InputLabel id='answer-status-filter-label'>
                    Answer Status
                </InputLabel>
                <Select
                    labelId='answer-status-filter-label'
                    id='answer-status-filter'
                    label='Answer Status'
                    value={answerStatus}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Any Answer Status</MenuItem>
                    <MenuItem value='g'>Green</MenuItem>
                    <MenuItem value='r'>Red</MenuItem>
                    <MenuItem value='y'>Yellow</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}
