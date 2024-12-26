import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useFormContext, FormProvider } from 'react-hook-form';
import { Field } from 'src/components/hook-form';
import { findInvoice } from 'src/service';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { INVOICE_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';

import { useRouter } from 'src/routes/hooks';
import { InvoiceToolbar } from './invoice-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export function InvoiceDetails({ invoice }) {
  const router = useRouter();

  const { id: ParamId } = useParams();

  const [Edited, setEdited] = useState({});

  const findInvoices = useCallback(async () => {
    try {
      const { data } = await findInvoice(ParamId);
      setEdited(data.data);
    } catch (error) {
      console.error(error);
    }
  }, [ParamId]);

  useEffect(() => {
    if (ParamId) {
      findInvoices();
    }
  }, [ParamId, findInvoices]);

  const [currentStatus, setCurrentStatus] = useState(invoice?.status);

  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  return (
    <>
      {/* <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (currentStatus === 'paid' && 'success') ||
                (currentStatus === 'pending' && 'warning') ||
                (currentStatus === 'overdue' && 'error') ||
                'default'
              }
            >
              {currentStatus}
            </Label>
          </Stack> */}
      {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Hujjat nomi:
          </Typography>
          {Edited?.title_doc}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Rezolutsiya:
          </Typography>

          {Edited?.resolution}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Hujjat kelgan manzil
          </Typography>
          {Edited?.come_from}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Yuborilgan hujjat nomeri
          </Typography>
          {Edited.send_doc_number}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Yuborilgan hujjat sanasi
          </Typography>
          {fDate(Edited.send_doc_date)}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kelgan hujjat nomeri
          </Typography>
          {Edited.receive_doc_number}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kelgan hujjat sanasi
          </Typography>
          {fDate(Edited.receive_doc_date)}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kiritilgan sanasi
          </Typography>
          {fDate(Edited.before_date)}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nazorat sanasi
          </Typography>
          {fDate(Edited.after_date)}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Hujjat xolati
          </Typography>
          <div
            style={{
              color:
                Edited.event_id === 0
                  ? 'red'
                  : Edited.event_id === 1
                    ? 'yellow'
                    : Edited.event_id === 4
                      ? 'green'
                      : '',
            }}
          >
            {Edited.event}
          </div>
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nazoratga qoygan foydalanuvchi
          </Typography>
          {Edited.user_name}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Bajarilganlik xolati
          </Typography>
          {Edited.status ? 'Bajarilgan' : 'Bajarilmagan'}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Bajarilgan sanasi
          </Typography>
          {Edited.status_date ? fDate(Edited.status_date) : 'Bajarilmagan'}
        </Stack>
      </div> */}

      {/* <Stack spacing={2} direction={{ xs: 'column' }} sx={{ p: 3 }}>
            <FormProvider>
              <Field.Text name="title_doc" label="Nomi" />
            </FormProvider>
          </Stack> */}

      {/* <Stack spacing={2} direction={{ xs: 'column' }} sx={{ p: 3 }}>
            <Field.Text name="title_doc" label="Nomi" />
            <Field.Text name="come_from" label="Kelgan manzil" value={Edited.come_from} />
            <Field.Text name="resolution" label="Resolution" value={Edited.resolution} />


            <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
              <Field.Text
                name="send_doc_number"
                label="Yuborilgan hujjat nomeri"
                value={Edited.send_doc_number}
              />
              <Field.DatePicker name="send_doc_date" label="Yuborilgan hujjat sanasi" />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
              <Field.Text
                name="receive_doc_number"
                label="Kelgan hujjat nomeri"
                value={Edited.receive_doc_number}
              />
              <Field.DatePicker name="receive_doc_date" label="Kelgan hujjat sanasi" />
            </Stack>
            <Field.DatePicker name="after_date" label="Nazorat sanasi" />
          </Stack> */}

      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
    </>
  );
}
