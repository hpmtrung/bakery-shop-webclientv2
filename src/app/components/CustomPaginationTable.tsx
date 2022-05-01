import {
  Paper,
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableContainer,
  TableContainerProps,
  TableContainerTypeMap,
  TableFooter,
  TableHead,
  TableHeadProps,
  TablePagination,
  TableProps,
  TableRow,
  TableRowProps,
} from '@mui/material';
import TablePaginationActions from 'src/app/components/TablePaginationActions';
import React from 'react';

export interface CustomTableRowProps {
  rowProps?: TableRowProps;
  cells: { content: React.ReactNode; cellProps?: TableCellProps }[];
}

export interface CustomTableProps {
  tableProps?: TableProps;
  tableContainerProps?: TableContainerProps;
  head: { headerProps?: TableHeadProps; row: CustomTableRowProps };
  body: { bodyProps?: TableBodyProps; rows: CustomTableRowProps[] };
  pagination: { page: number; rowsPerPage: number; totalRows: number };
  handleChangePage: (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  disabledPagination?: boolean;
  rowHeight?: number;
}

const CustomPaginationTable = (props: CustomTableProps) => {
  const {
    tableContainerProps = { component: Paper, elevation: 0 },
    tableProps = { sx: { width: '100%' } },
    head,
    body,
    pagination: { page, rowsPerPage, totalRows },
    handleChangePage,
    handleChangeRowsPerPage,
    rowsPerPageOptions = [5, 10],
    disabledPagination = false,
    rowHeight = 5,
  } = props;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRows) : 0;

  let paginationProps: any = {
    SelectProps: {
      inputProps: {
        'aria-label': 'rows per page',
      },
    },
  };
  if (disabledPagination) {
    paginationProps = {
      SelectProps: {
        inputProps: {
          'aria-label': 'rows per page',
        },
        disabled: disabledPagination,
      },
      backIconButtonProps: {
        disabled: disabledPagination,
      },
      nextIconButtonProps: {
        disabled: disabledPagination,
      },
    };
  }

  return (
    <TableContainer {...tableContainerProps}>
      <Table {...tableProps}>
        <TableHead {...head.headerProps}>
          <TableRow>
            {head.row.cells.map((cell, index) => (
              <TableCell key={index} {...cell.cellProps}>
                {cell.content || ''}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody {...body.bodyProps}>
          {body.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} {...row.rowProps}>
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} {...cell.cellProps}>
                  {cell.content || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: rowHeight * emptyRows }}>
              <TableCell colSpan={12} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              colSpan={12}
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              {...paginationProps}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CustomPaginationTable;
