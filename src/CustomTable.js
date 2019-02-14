import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `$ ${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(id, desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { id, desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

function SpanningTable(props) {
const { classes, rows, taxRate, anfCharges, adminCharges} = props;
const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = taxRate * invoiceSubtotal / 100;
const invoiceTotal =  invoiceSubtotal - invoiceTaxes - anfCharges - adminCharges;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio unitario</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={5} />
            <TableCell >Subtotal</TableCell>
            <TableCell colSpan={2} align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>Cargos administrativos</TableCell>
            <TableCell align="right">{`${(adminCharges).toFixed(0)}`}</TableCell>
            <TableCell align="right">{ccyFormat(adminCharges)}</TableCell>
          </TableRow>
		  <TableRow>
            <TableCell>Cargo por anfitriona</TableCell>
            <TableCell align="right">{`${(anfCharges).toFixed(0)}`}</TableCell>
            <TableCell align="right">{ccyFormat(anfCharges)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(taxRate).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
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
