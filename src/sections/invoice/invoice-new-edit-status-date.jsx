import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
// import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function InvoiceNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack spacing={2} direction={{ xs: 'column' }} sx={{ p: 3 }}>
      <Field.Text name="title_doc" label="Nomi" />
      <Field.Text name="come_from" label="Kelgan manzil" value={values.come_from} />
      <Field.Text name="resolution" label="Resolution" value={values.resolution} />
      {/* <Field.Select fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }}>
        {['paid', 'pending', 'overdue', 'draft'].map((option) => (
          <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
            {option}
          </MenuItem>
        ))}
      </Field.Select> */}
      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
        <Field.Text
          name="send_doc_number"
          label="Yuborilgan hujjat nomeri"
          value={values.send_doc_number}
        />
        <Field.DatePicker name="send_doc_date" label="Yuborilgan hujjat sanasi" />
      </Stack>
      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
        <Field.Text
          name="receive_doc_number"
          label="Kelgan hujjat nomeri"
          value={values.receive_doc_number}
        />
        <Field.DatePicker name="receive_doc_date" label="Kelgan hujjat sanasi" />
      </Stack>
      <Field.DatePicker name="after_date" label="Nazorat sanasi" />
    </Stack>
  );
}
