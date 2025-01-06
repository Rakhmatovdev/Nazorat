import { useCallback, useEffect, useState } from 'react';
import { useFormContext,useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack'; 
import { Field } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';

import {
  emptyRows,
  getComparator,
  rowInPage,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { getUserList,addUserToDocument } from 'src/service';
 


// ----------------------------------------------------------------------

export function InvoiceNewEditAddress() {
  const { watch } = useFormContext();
  const values = watch();

  const [tableData, setTableData] = useState([]);
 
  useEffect(() => {
    getUserList().then((response) => {
      setTableData(response.data);
    });
  }, []);

  
  return (
    <>
      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
      <table border="1" cellPadding="10" style={{ width: '100%', margin: '20px 0', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Foydalanuvchi</th>
          <th>Bolim</th>
       
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.first_last_name}</td>
            <td>{row.organization_name}</td>
        
          </tr>
        ))}
      </tbody>
    </table>
       </Stack>
        <Stack spacing={2} direction={{ xs: 'column' }} sx={{ p: 3 }}>
      <Field.Text name="title_doc" label="Nomi" />
      <Field.Text name="come_from" label="Kelgan manzil" value={values.come_from} />
      <Field.Text name="resolution" label="Resolution" value={values.resolution} />
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

      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
      <Field.DatePicker name="after_date" label="Nazorat sanasi" />
        <Field.Text
          name="event"
          label="Nazorat holati"
          value={values.event}
        />
      </Stack>

      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
      <Field.DatePicker name="before_date" label="Kiritilgan sana" />
        <Field.Text
          name="event"
          label="Nazoratga kiritgan foydalanuvchi"
          value={values.user_name}
        />
      </Stack>
      <Stack spacing={2} direction={{ xs: 'row' }} sx={{}}>
      
        <Field.Text
          name="event"
          label="Bajarilganlik holati"
          value={values.status ?  'Bajarilgan' : 'Bajarilmagan' }
        />
        <Field.DatePicker name="status_date" label="Bajarilgan sana" />
      </Stack>
    
 
</Stack>
 </>
  );
}

 

