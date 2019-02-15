import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextField } from '@material-ui/core';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    padding: '4px 24px 4px 24px',
  },
  body: {
    fontSize: 14,
    padding: '4px 24px 4px 24px',
    minWidth: 50
  },
}))(TableCell);

function ccyFormat(num) {
  return `$ ${num.toFixed(2)}`;
}

function priceRow(price, qty) {
  return price * qty;
}

function subtotal(items) {
  return items.reduce((sum, row) => sum + (row.price * row.qty), 0);
}

function SpanningTable(props) {
  const { classes, rows, taxRate, anfCharges, adminCharges, onTableChange, min25Percent, min30Percent, showDetails} = props;
  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = taxRate * invoiceSubtotal / 100;

  const justDiscountPercent = invoiceSubtotal >= min30Percent ? 30 : invoiceSubtotal >= min25Percent ? 25 : 0;
  const justDiscount = (invoiceSubtotal * justDiscountPercent) / 100;
  const ivaDiscount = (invoiceSubtotal - justDiscount) - (invoiceSubtotal - justDiscount) / 1.105;
  const invoiceTotal = invoiceSubtotal - justDiscount - ivaDiscount + invoiceTaxes + anfCharges + adminCharges;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell></CustomTableCell>
            <CustomTableCell>Producto</CustomTableCell>
            <CustomTableCell align="right">Cantidad</CustomTableCell>
            <CustomTableCell align="right">Precio unitario</CustomTableCell>
            <CustomTableCell align="right">Subtotal</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row._id}>
              <CustomTableCell>
                <IconButton
                  onClick={(e) => onTableChange('remove', {_id: row._id})}
                  aria-label="Remueve un producto de la lista">
                  <DeleteIcon  fontSize="small"/>
                </IconButton>
              </CustomTableCell>
              <CustomTableCell>{row.name}</CustomTableCell>
              <CustomTableCell align="right">
                <TextField
                  type="number"
                  value={row.qty}
                  style={{width: 50}}
                  onChange={(e) => onTableChange('edit', {_id: row._id, qty: e.target.value})
                  }>
                </TextField>
              </CustomTableCell>
              <CustomTableCell align="right">{ccyFormat(row.price)}</CustomTableCell>
              <CustomTableCell align="right">{ccyFormat(priceRow(row.price, row.qty))}</CustomTableCell>
            </TableRow>
          ))}
          <TableRow>
            <CustomTableCell rowSpan={9} colSpan={2}/>
            <CustomTableCell>Subtotal</CustomTableCell>
            <CustomTableCell colSpan={2} align="right">{ccyFormat(invoiceSubtotal)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell>Descuento Just</CustomTableCell>
            <CustomTableCell align="right">{`${justDiscountPercent} %`}</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(justDiscount)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell>Descuento IVA</CustomTableCell>
            <CustomTableCell align="right">{`${10.5} %`}</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(ivaDiscount)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell>Cargos administrativos</CustomTableCell>
            <CustomTableCell align="right">{`${(adminCharges).toFixed(0)}`}</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(adminCharges)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell>Cargo por anfitriona</CustomTableCell>
            <CustomTableCell align="right">{`${(anfCharges).toFixed(0)}`}</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(anfCharges)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell>IIBB Provincial</CustomTableCell>
            <CustomTableCell align="right">{`${(taxRate).toFixed(0)} %`}</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(invoiceTaxes)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell colSpan={2}>Total a pagar</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(invoiceTotal)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell colSpan={2}>Total a cobrar</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(invoiceSubtotal)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell colSpan={2}>Ganancia potencial</CustomTableCell>
            <CustomTableCell align="right">{ccyFormat(invoiceSubtotal - invoiceTotal)}</CustomTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

SpanningTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpanningTable);
