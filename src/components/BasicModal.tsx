import * as React from 'react';
import {
    Box, Button, Typography, Modal, TextField,
    InputLabel, MenuItem, FormControl, Select
} from '@mui/material';
import axios from 'axios';
const style = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type IRegion = {
    id: string;
    name: string;
};

type BasicModalProps = {
    onSchoolCreated: () => void;
};

export default function BasicModal({ onSchoolCreated }: BasicModalProps) {
    const [open, setOpen] = React.useState(false);
    const [region, setRegion] = React.useState<IRegion | null>(null);
    const [regions, setRegions] = React.useState<IRegion[]>([]);
    const [schoolType, setSchoolType] = React.useState('');
    const [schoolTypes, setSchoolTypes] = React.useState<string[]>([]);
    const [name, setName] = React.useState('');
    const [edrpou, setEdrpou] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const isFormComplete = name !== '' && edrpou !== '' && region != null && schoolType !== '';

    React.useEffect(() => {
        axios.get<IRegion[]>('/api/regions')
            .then(res => setRegions(res.data))
            .catch(err => {
                console.error('Error:', err);
                setRegions([]);
            });

        axios.get<string[]>('/api/school-types')
            .then(res => setSchoolTypes(res.data))
            .catch(err => {
                console.error('Error:', err);
                setSchoolTypes([]);
            });
    }, []);

    const handleSubmit = () => {
        if (!region || !schoolType || !name || !edrpou) return;

        axios.post('/api/schools', {
            name,
            edrpou,
            type: schoolType,
            region,
            active: true
        }).then(() => {
            handleClose();
            setName('');
            setEdrpou('');
            setRegion(null);
            setSchoolType('');
        }).catch(err => {
            console.error('Ошибка при создании школы:', err);
        });
        onSchoolCreated();
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>Додати школу</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Add new school
                    </Typography>

                    <TextField
                        id="name"
                        label="Name"
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        id="edrpou"
                        label="EDRPOU"
                        variant="standard"
                        value={edrpou}
                        onChange={(e) => setEdrpou(e.target.value)}
                    />

                    <FormControl fullWidth variant="standard">
                        <InputLabel id="region-label">Region</InputLabel>
                        <Select
                            labelId="region-label"
                            id="region-select"
                            value={region?.id || ''}
                            onChange={(e) => {
                                const selected = regions.find(r => r.id === e.target.value);
                                if (selected) setRegion(selected);
                            }}
                        >
                            {regions.map((r) => (
                                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="standard">
                        <InputLabel id="school-type-label">School Type</InputLabel>
                        <Select
                            labelId="school-type-label"
                            id="school-type-select"
                            value={schoolType}
                            onChange={e => setSchoolType(e.target.value)}
                        >
                            {schoolTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" disabled={!isFormComplete} onClick={handleSubmit}>
                        ADD
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
