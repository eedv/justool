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
import { TextField, Checkbox } from '@material-ui/core';


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
		padding: '4px 10px 4px 10px',
		minWidth: 50
	},
}))(TableCell);

function ccyFormat(num) {
	return `$ ${num.toFixed(2)}`;
}

function priceRow(price, qty) {
	return price * qty;
}

function Details(props) {
	const {justDiscountPercent, justDiscount, invoiceTaxes, adminCharges, anfCharges, taxrate} = props;

	return <>
			<TableRow>
				<CustomTableCell rowSpan={4} colSpan={2}>Detalles</CustomTableCell>
				<CustomTableCell rowSpan={1} colSpan={1}>Descuentos</CustomTableCell>
				<CustomTableCell>Descuento Just</CustomTableCell>
				<CustomTableCell align="left">{`${justDiscountPercent} %`}</CustomTableCell>
				<CustomTableCell align="left">{ccyFormat(justDiscount)}</CustomTableCell>
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
				<CustomTableCell align="left">{`${(taxrate).toFixed(0)} %`}</CustomTableCell>
				<CustomTableCell align="left">{ccyFormat(invoiceTaxes)}</CustomTableCell>
			</TableRow>
	</>
}

function SpanningTable(props) {
	const { classes, rows, onTableChange, showDetails, config} = props;

	const {totalPVP = 0, invoiceTotal = 0, profit = 0, stockPVP = 0, justDiscountPercent = 0, justDiscountAmmount = 0, invoiceTaxes = 0, investment = 0} = props.invoiceSummary;
	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<CustomTableCell></CustomTableCell>
						<CustomTableCell align="center">Stock</CustomTableCell>
						<CustomTableCell>Producto</CustomTableCell>
						<CustomTableCell align="left">Cantidad</CustomTableCell>
						<CustomTableCell align="left">Precio unitario</CustomTableCell>
						<CustomTableCell align="left">Subtotal</CustomTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, index) => (
						<TableRow key={`${row.productId}-${row.price}-${index}`}>
							<CustomTableCell>
								<IconButton
									onClick={(e) => onTableChange('remove', index, {})}
									aria-label="Remueve un producto de la lista">
									<DeleteIcon  fontSize="small"/>
								</IconButton>
							</CustomTableCell>
							<CustomTableCell align="center">
								<Checkbox
									checked={row.isStock}
									onChange={(e) => onTableChange('edit', index, {isStock: e.target.checked})}
								></Checkbox>
							</CustomTableCell>
							<CustomTableCell>{row.name}</CustomTableCell>
							<CustomTableCell align="left">
								<TextField
									type="number"
									value={row.qty}
									style={{width: 50}}
									onChange={(e) => onTableChange('edit', index, { qty: e.target.value})
									}>
								</TextField>
							</CustomTableCell>
							<CustomTableCell align="left">{ccyFormat(row.price)}</CustomTableCell>
							<CustomTableCell align="left">{ccyFormat(priceRow(row.price, row.qty))}</CustomTableCell>
						</TableRow>
					))}
					<TableRow>
						<CustomTableCell colSpan={3}/>
						<CustomTableCell>Total PvP (Productos de stock incluidos)</CustomTableCell>
						<CustomTableCell/>
						<CustomTableCell align="left">{ccyFormat(totalPVP)}</CustomTableCell>
					</TableRow>
					{showDetails ? <Details
						justDiscountPercent={justDiscountPercent}
						justDiscount={justDiscountAmmount}
						invoiceTaxes={invoiceTaxes}
						{...config}
						></Details> : null}
					<TableRow>
						<CustomTableCell rowSpan={4} colSpan={3}>Resumen</CustomTableCell>
						<CustomTableCell colSpan={2}>Total a pagar (Factura)</CustomTableCell>
						<CustomTableCell align="left">{ccyFormat(invoiceTotal)}</CustomTableCell>
					</TableRow>
					<TableRow>
						<CustomTableCell colSpan={2}>Ganancia potencial</CustomTableCell>
						<CustomTableCell align="left">{ccyFormat(profit)}</CustomTableCell>
					</TableRow>
					<TableRow>
						<CustomTableCell colSpan={2}>Inversion en stock</CustomTableCell>
						<CustomTableCell align="left">{ccyFormat(investment)}</CustomTableCell>
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
