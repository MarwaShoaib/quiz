import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { domainList, subDomainList } from '../../../config';
import { useState } from 'react';

export default function SubDomainFilter({ handleSelect }) {
    let subDomains = [];
    for (const domainId in subDomainList) {
        subDomains = subDomains.concat(subDomainList[domainId]);
    }

    const [subDomain, setSubDomain] = useState('');

    function handleChange(ev) {
        setSubDomain(ev.target.value);

        handleSelect(ev.target.value);
    }

    return (
        <>
            <FormControl style={{ width: '23%', margin: '0 1rem' }}>
                <InputLabel id='sub-domain-filter-label'>SubDomain</InputLabel>
                <Select
                    labelId='sub-domain-filter-label'
                    id='sub-domain-filter'
                    label='Sub Domain'
                    value={subDomain}
                    onChange={handleChange}
                >
                    <MenuItem value=''>All Sub Domains</MenuItem>
                    {subDomains.length > 0 &&
                        subDomains.map((subDomain) => (
                            <MenuItem key={subDomain.id} value={subDomain.id}>
                                {subDomain.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </>
    );
}
