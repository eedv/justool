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

function Details(props) {
  const {justDiscountPercent, justDiscount, ivaDiscount, invoiceTaxes, adminCharges, anfCharges, taxRate} = props;
  //const {adminCharges, anfCharges, taxRate} = this.props;
  return <>
      <TableRow>
        <CustomTableCell rowSpan={5} colSpan={1}>Detalles</CustomTableCell>
        <CustomTableCell rowSpan={2} colSpan={1}>Descuentos</CustomTableCell>
        <CustomTableCell>Descuento Just</CustomTableCell>
        <CustomTableCell align="left">{`${justDiscountPercent} %`}</CustomTableCell>
        <CustomTableCell align="left">{ccyFormat(justDiscount)}</CustomTableCell>
      </TableRow>
      <TableRow>
        <CustomTableCell>Descuento IVA</CustomTableCell>
        <CustomTableCell align="left">{`${10.5} %`}</CustomTableCell>
        <CustomTableCell align="left">{ccyFormat(ivaDiscount)}</CustomTableCell>
      </TableRow>
      <TableRow>
        <CustomTableCell rowSpan={3} colSpan={1}>Cargos e impuestos</CustomTableCell>
        <CustomTableCell>Cargos administrativos</CustomTableCell>
        <CustomTableCell align="left">{`${(adminCharges).toFixed(0)}`}</CustomTableCell>
        <CustomTableCell align="left">{ccyFormat(adminCharges)}</CustomTableCell>
      </TableRow>
      <TableRow>
        <CustomTableCell>Cargo por anfitriona</CustomTableCell>
        <CustomTableCell align="left">{`${(anfCharges).toFixed(0)}`}</CustomTableCell>
        <CustomTableCell align="left">{ccyFormat(anfCharges)}</CustomTableCell>
      </TableRow>
      <TableRow>
        <CustomTableCell>IIBB Provincial</CustomTableCell>
        <CustomTableCell align="left">{`${(taxRate).toFixed(0)} %`}</CustomTableCell>
        <CustomTableCell align="left">{ccyFormat(invoiceTaxes)}</CustomTableCell>
      </TableRow>
  </>
}

function SpanningTable(props) {
  const { classes, rows, taxRate, anfCharges = 0, adminCharges, onTableChange, min25Percent, min30Percent, showDetails} = props;
  let pvpSubtotal = subtotal(rows);

  const justDiscountPercent = pvpSubtotal >= min30Percent ? 30 : pvpSubtotal >= min25Percent ? 25 : 0;
  const justDiscount = (pvpSubtotal * justDiscountPercent) / 100;
  let invoiceSubtotal = pvpSubtotal - justDiscount;
  const ivaDiscount = invoiceSubtotal - (invoiceSubtotal / 1.105);
  invoiceSubtotal = invoiceSubtotal - ivaDiscount + anfCharges + adminCharges;

  const invoiceTaxes = taxRate * invoiceSubtotal / 100;

  const invoiceTotal = invoiceSubtotal + invoiceTaxes;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell></CustomTableCell>
            <CustomTableCell>Producto</CustomTableCell>
            <CustomTableCell align="left">Cantidad</CustomTableCell>
            <CustomTableCell align="left">Precio unitario</CustomTableCell>
            <CustomTableCell align="left">Subtotal</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <CustomTableCell>
                <IconButton
                  onClick={(e) => onTableChange('remove', {id: row.id})}
                  aria-label="Remueve un producto de la lista">
                  <DeleteIcon  fontSize="small"/>
                </IconButton>
              </CustomTableCell>
              <CustomTableCell>{row.name}</CustomTableCell>
              <CustomTableCell align="left">
                <TextField
                  type="number"
                  value={row.qty}
                  style={{width: 50}}
                  onChange={(e) => onTableChange('edit', {id: row.id, qty: e.target.value})
                  }>
                </TextField>
              </CustomTableCell>
              <CustomTableCell align="left">{ccyFormat(row.price)}</CustomTableCell>
              <CustomTableCell align="left">{ccyFormat(priceRow(row.price, row.qty))}</CustomTableCell>
            </TableRow>
          ))}
          <TableRow>
            <CustomTableCell colSpan={2}/>
            <CustomTableCell>Subtotal PvP</CustomTableCell>
            <CustomTableCell/>
            <CustomTableCell align="left">{ccyFormat(pvpSubtotal)}</CustomTableCell>
          </TableRow>
          {showDetails ? <Details
            justDiscountPercent={justDiscountPercent}
            justDiscount={justDiscount}
            ivaDiscount={ivaDiscount}
            invoiceTaxes={invoiceTaxes}
            {...props}
            ></Details> : null}

          <TableRow>
            <CustomTableCell rowSpan={3} colSpan={2}>Resumen</CustomTableCell>
            <CustomTableCell colSpan={2}>Total a pagar</CustomTableCell>
            <CustomTableCell align="left">{ccyFormat(invoiceTotal)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell colSpan={2}>Total a cobrar</CustomTableCell>
            <CustomTableCell align="left">{ccyFormat(pvpSubtotal)}</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell colSpan={2}>Ganancia potencial</CustomTableCell>
            <CustomTableCell align="left">{ccyFormat(pvpSubtotal - invoiceTotal)}</CustomTableCell>
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
