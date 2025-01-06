import { useState, useEffect, useMemo } from 'react';
import { z as zod } from 'zod';
import { useForm , Controller} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { resListRole } from 'src/service';
import { USER_STATUS_OPTIONS } from 'src/_mock';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  first_last_name: zod.string().min(1, { message: 'Name is required!' }),
  username: zod.string().min(1, { message: 'Name is required!' }),
  organization_name: zod.string().min(1, { message: 'Name is required!' }),
  otdel_name: zod.string().min(1, { message: 'Name is required!' }),
  role_name: zod.string().min(1, { message: 'State is required!' }),
  telefon: zod.string().min(1, { message: 'City is required!' }),
  is_active_flag: zod.string().min(1, { message: 'Address is required!' }),
  role_id: zod.string().min(1, { message: 'Zip code is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
 

  const defaultValues = useMemo(
    () => ({
      first_last_name: currentUser?.first_last_name || '',
      username: currentUser?.username || '',
      organization_name: currentUser?.organization_name || '',
      otdel_name: currentUser?.otdel_name || '',
      role_name: currentUser?.role_name || '',
      telefon: currentUser?.telefon || '',
      is_active_flag: currentUser?.is_active_flag || '',
      role_id: currentUser?.role_id || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('DATA');
    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

   const handleCreateAndSend = handleSubmit(async (data) => {
      console.log('DATA');
     
    });

   const [selectData, setSelectData] = useState([]);
    useEffect(() => {
      resListRole().then((response) => {
             setSelectData(response.data.dataList);
         });
       }, []);

     
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} >
        <DialogTitle> </DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
           Foydalanuvchi ma`lumotlarini o`zgartirish
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
           
            <Field.Select name="is_active_flag" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={String(status.value)} value={String(status.value)}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
   
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="first_last_name" label="Foydalanuvchi F.I.O si" />
            <Field.Text name="username" label="Foydalanuvchi login" />
            <Field.Text name="organization_name" label="Boshqarma nomi" />
            <Field.Text name="otdel_name" label="Bolim nomi" />
            <Field.Select name="role_id" label="Mansab" >
              {selectData.map((status) => (
                <MenuItem key={status.id} value={String(status.id)}>
                  {status.name_1}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="telefon" label="Telefon" />
            
         
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}  onClick={handleCreateAndSend}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
