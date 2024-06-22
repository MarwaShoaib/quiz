import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { domainList, languageList } from '../../../config';
import { useState } from 'react';

export default function LanguageFilter({ handleSelect }) {
    const [lang, setLang] = useState('');

    function handleChange(ev) {
        setLang(ev.target.value);

        handleSelect(ev.target.value);
    }

    return (
        <>
            <FormControl style={{ width: '23%' }}>
                <InputLabel id='langugae-filter-label'>Language</InputLabel>
                <Select
                    labelId='langugae-filter-label'
                    id='langugae-filter'
                    label='Language'
                    value={lang}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Any Language</MenuItem>
                    {languageList.length > 0 &&
                        languageList.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </>
    );
}
