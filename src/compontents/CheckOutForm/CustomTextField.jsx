import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, TextField, Grid } from '@material-ui/core';

function CustomTextField({ name, label, required }) {
    const { control } = useFormContext();
    const isError = false;

    return (
        <Grid item xs={12} sm={6}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => <TextField {...field}
                    label={label}
                    fullWidth
                    required={required}
                    id="outlined-required"
                />}


            />
        </Grid>
    );
}

export default CustomTextField;
