import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { createInvoice, findInvoice, updateInvoice } from 'src/service';
import { z as zod } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { fIsAfter } from 'src/utils/format-time';
import { Form } from 'src/components/hook-form';
import { InvoiceNewEditAddress } from './invoice-new-edit-address';
// ----------------------------------------------------------------------

export const NewInvoiceSchema = zod
  .object({
    title_doc: zod.string(),
    come_from: zod.string(),
    resolution: zod.string(),
    send_doc_number: zod.string(),
    send_doc_date: zod.string(),
    receive_doc_number: zod.string(),
    receive_doc_date: zod.string(),
    after_date: zod.string(),
  })
  .refine((data) => !fIsAfter(data.createDate, data.dueDate), {
    message: 'Due date cannot be earlier than create date!',
    path: ['dueDate'],
  });
// ----------------------------------------------------------------------


export function InvoiceDetails({ invoice }) {
 const router = useRouter();

  const { id: ParamId } = useParams();

  const [Edited, setEdited] = useState({});

  const loadingSend = useBoolean();

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

  const defaultValues = useMemo(
    () => ({
      title_doc: Edited?.title_doc || '',
      come_from: Edited?.come_from || '',
      resolution: Edited?.resolution || '',
      send_doc_number: Edited?.send_doc_number || '',
      send_doc_date: Edited?.send_doc_date || '',
      receive_doc_number: Edited?.receive_doc_number || '',
      receive_doc_date: Edited?.receive_doc_date || '',
      after_date: Edited?.after_date || '',
      event: Edited?.event || '',
      event_id: Edited?.event_id || '',
      before_date: Edited?.before_date || '',
      user_name: Edited?.user_name || '',
      status: Edited?.status || '',
      status_date : Edited?.status_date  || '',
    }),
    [Edited]
  );
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (Edited) {
      reset(defaultValues);
    }
  }, [Edited, defaultValues, reset]);


  
  return (
    <>
     <Form methods={methods}>
      <Card>
         <InvoiceNewEditAddress />  
      </Card>
 
    </Form>
    </>
  );
}
