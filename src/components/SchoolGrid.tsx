import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

type IRegion = {
    id: string;
    name: string;
};

type ISchool = {
    id: string;
    name: string;
    edrpou: string;
    type: string;
    regionName: string;
    region: IRegion;
    active: boolean;
};

type Props = {
    refreshKey: number;
};

export default function SchoolGrid({ refreshKey }: Props) {
    const [rows, setRows] = useState<ISchool[]>([]);

    const handleDeactivation = (id: string) => {
        axios.patch(`/api/schools/${id}/deactivate`).then(() => {
            setRows(prevRows =>
                prevRows.map(row =>
                    row.id === id ? { ...row, active: false } : row
                )
            );
        }).catch(err => {
            console.error('Error:', err);
        });
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Назва', width: 300 },
        { field: 'edrpou', headerName: 'ЄДРПОУ', width: 250 },
        { field: 'type', headerName: 'Тип', width: 250 },
        { field: 'regionName', headerName: 'Регіон', width: 250 },
        { field: 'active', headerName: 'Активна', type: 'boolean', width: 100 },

        {
            field: 'deactivation',
            headerName: '',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                params.row.active && <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleDeactivation(params.row.id)}
                >
                    Деактивувати
                </Button>
            ),
        },
    ];

    useEffect(() => {
        axios
            .get<ISchool[]>('/api/schools')
            .then((response) => {
                const tempData = response.data.map(e => {
                    e.regionName = e.region?.name || '';
                    return e;
                });
                setRows(tempData);
            })
            .catch(() => {
                setRows([]);
            });
    }, [refreshKey]);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
