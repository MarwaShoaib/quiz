import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { domainList } from '../../../config';
import { useState } from 'react';

export default function DomainFilter({ handleSelect }) {
    const [domain, setDomain] = useState('');

    function handleChange(ev) {
        setDomain(ev.target.value);

        handleSelect(ev.target.value);
    }

    return (
        <>
            <FormControl style={{ width: '23%' }}>
                <InputLabel id='domain-filter-label'>Domain</InputLabel>
                <Select
                    labelId='domain-filter-label'
                    id='domain-filter'
                    label='Domain'
                    value={domain}
                    onChange={handleChange}
                >
                    <MenuItem value=''>All Domains</MenuItem>
                    {domainList.length > 0 &&
                        domainList.map((domain) => (
                            <MenuItem key={domain.id} value={domain.id}>
                                {domain.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </>
    );
}
