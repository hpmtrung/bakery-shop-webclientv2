import { Grid } from '@mui/material';
import React from 'react';
import { ValidatedForm } from './ValidatedForm';
import { ValidatedInput } from './ValidatedInput';

// Use for Test only
const TestBoard = () => {
  return (
    <div>
      <ValidatedForm onSubmit={null} defaultValues={{ a: '', b: 'Readonly content', c: 'Disabled content', d: '5', e: '', f: 'text area' }}>
        <Grid container spacing={3}>
          <Grid container item xs={4} spacing={2}>
            <ValidatedInput name="a" type="text" label="Required" placeholder="..." rules={{ required: 'Not empty!' }} />
            <ValidatedInput name="b" type="text" label="Read Only" placeholder="..." readOnly />
            <ValidatedInput name="c" type="text" label="Disabled" placeholder="..." disabled />
            <ValidatedInput name="d" type="number" label="Number" placeholder="..." />
            <ValidatedInput name="e" type="password" label="Password" placeholder="..." />
            <ValidatedInput name="f" type="textarea" label="Area" placeholder="..." />
            <ValidatedInput name="f" type="textarea" label="Area" placeholder="..." maxRows={4} />
            <ValidatedInput name="f" type="textarea" label="Area" placeholder="..." rows={5} />
          </Grid>
          <Grid container item xs={4} spacing={2}>
            <ValidatedInput variant="filled" name="a" type="text" label="Required" placeholder="..." rules={{ required: 'Not empty!' }} />
            <ValidatedInput variant="filled" name="b" type="text" label="Read Only" placeholder="..." readOnly />
            <ValidatedInput variant="filled" name="c" type="text" label="Disabled" placeholder="..." disabled />
            <ValidatedInput variant="filled" name="d" type="number" label="Number" placeholder="..." />
            <ValidatedInput variant="filled" name="e" type="password" label="Password" placeholder="..." />
            <ValidatedInput variant="filled" name="f" type="textarea" label="Area" placeholder="..." />
            <ValidatedInput variant="filled" name="f" type="textarea" label="Area" placeholder="..." maxRows={4} />
            <ValidatedInput variant="filled" name="f" type="textarea" label="Area" placeholder="..." rows={5} />
          </Grid>
          <Grid container item xs={4} spacing={2}>
            <ValidatedInput variant="standard" name="a" type="text" label="Required" placeholder="..." rules={{ required: 'Not empty!' }} />
            <ValidatedInput variant="standard" name="b" type="text" label="Read Only" placeholder="..." readOnly />
            <ValidatedInput variant="standard" name="c" type="text" label="Disabled" placeholder="..." disabled />
            <ValidatedInput variant="standard" name="d" type="number" label="Number" placeholder="..." />
            <ValidatedInput variant="standard" name="e" type="password" label="Password" placeholder="..." />
            <ValidatedInput variant="standard" name="f" type="textarea" label="Area" placeholder="..." />
            <ValidatedInput variant="standard" name="f" type="textarea" label="Area" placeholder="..." maxRows={4} />
            <ValidatedInput variant="standard" name="f" type="textarea" label="Area" placeholder="..." rows={5} />
          </Grid>
        </Grid>
      </ValidatedForm>
    </div>
  );
};

export default TestBoard;
