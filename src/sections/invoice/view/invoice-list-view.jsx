import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';
import { sumBy } from 'src/utils/helper';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Snackbar, toast } from 'src/components/snackbar';
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

import { deleteInvoice, resList, statusInvoice } from 'src/service';
import { InvoiceAnalytic } from '../invoice-analytic';
import { InvoiceTableFiltersResult } from '../invoice-table-filters-result';
import { InvoiceTableRow } from '../invoice-table-row';
import { InvoiceTableToolbar } from '../invoice-table-toolbar';
// import InvoiceService from 'src/service';
// import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title_doc', label: 'Nomi' },
  { id: 'come_from', label: 'Kelgan manzil' },
  { id: 'resolution', label: 'Rezolyutsiya' },
  { id: 'before_date', label: 'Kiritilgan sana' },
  { id: 'after_date', label: 'Nazorat sana' },
  { id: 'status_date', label: 'Bajarilgan sana' },
  { id: 'event', label: 'Holat' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    resList().then((response) => {
      setTableData(response.data.dataList);
    });
  }, []);

  const filters = useSetState({
    name: '',
    service: [],
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.service.length > 0 ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) =>
    tableData.filter((item) => item.event_id === status && item.status !== 1).length;
  const getInvoiceLengthd = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.event_id === status),
      (invoice) => invoice.totalAmount
    );
  const getTotalAmountd = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;
  const getPercentByStatusd = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Ishlovdagi hujjatlar',
      color: 'default',
      count: tableData.length - getInvoiceLengthd(1),
    },
    {
      value: 4,
      label: '4 - kun va undan ortiq',
      color: 'success',
      count: getInvoiceLength(4),
    },
    {
      value: 1,
      label: '1 - 3  kun qolganlar',
      color: 'warning',
      count: getInvoiceLength(1),
    },
    {
      value: 0,
      label: 'Muddati tugagan',
      color: 'error',
      count: getInvoiceLength(0),
    },
    {
      value: 'Success',
      label: 'Bajarilganlar',
      color: 'default',
      count: getInvoiceLengthd(1),
    },
  ];

  const handleDeleteRow = useCallback(
    (id) => {
      deleteInvoice(id)
        .then((response) => {
          toast.success(response.data.data.message);
          const deleteRow = tableData.filter((row) => row.id !== id);
          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch(() => {
          toast.error('Ochirishda xatolik yuz berdi!');
        });
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );
  const handleStatusRow = useCallback(
    (id) => {
      statusInvoice(id).then((response) => {
        toast.success(response.data.data.message);
      })
      .catch(() => {
        toast.error('Tasdiqlashda xatolik yuz berdi!');
      });

      setTableData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, status: 1, status_date: Date.now() } : item))
      );
      router.push(paths.dashboard.invoice);
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

 const handleUserAddRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.adduser(id));
    },
    [router]
  );
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Hujjatlar"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: "Nazorat bo'limi", href: paths.dashboard.invoice.root },
            { name: 'Hujjatlar' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Yangi yaratish
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Ishlovdagi hujjatlar"
                total={tableData.length - getInvoiceLengthd(1)}
                percent={100}
                
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />
              <InvoiceAnalytic
                title="4 - kun va undan ortiq"
                total={getInvoiceLength(4)}
                percent={getPercentByStatus(4)}
               
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <InvoiceAnalytic
                title="1 - 3 kun qolganlar"
                total={getInvoiceLength(1)}
                percent={getPercentByStatus(1)}
                
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />
              <InvoiceAnalytic
                title="Muddati tugagan"
                total={getInvoiceLength(0)}
                percent={getPercentByStatus(0)}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              />
              <InvoiceAnalytic
                title="Bajarilganlar"
                total={getInvoiceLengthd(1)}
                percent={getPercentByStatusd(1)}
                
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <InvoiceTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: INVOICE_SERVICE_OPTIONS.map((option) => option.name) }}
          />
          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
          <Box sx={{ position: 'relative' }}>

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onStatusRow={() => handleStatusRow(row.id)}
                        onUserAddRow={() => handleUserAddRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.title_doc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.come_from.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.resolution.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.before_date.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.after_date.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.event.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.user_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter(
      (invoice) =>
        (invoice.event_id === status && invoice.status !== 1) ||
        (status === 'Success' && invoice.status === 1)
    );
  } else {
    inputData = inputData.filter((invoice) => invoice.status === 0);
  }

  console.log(inputData);

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.title_doc.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) =>
        fIsBetween(invoice.before_date, startDate, endDate)
      );
    }
  }

  return inputData;
}
