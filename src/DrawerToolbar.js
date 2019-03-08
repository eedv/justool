import React from 'react';
import { HashRouter as Router, Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListItemText from '@material-ui/core/ListItemText';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField'
import { Switch } from '@material-ui/core';
const DrawerToolbar = (props) => {
	const {classes, configValues, onInputChange} = props;
	const drawerConfig = [
		{name: 'min25Percent', type: 'textfield', label: 'Min 25%'},
		{name: 'min30Percent', type: 'textfield', label: 'Min 30%'},
		{name: 'anfCharges', type: 'textfield', label: 'Cargo por anfitriona'},
		{name: 'adminCharges', type: 'textfield', label: 'Gastos administrativos'},
		{name: 'showDetails', type: 'switch', label: 'Mostrar detalles de factura'},
		{name: 'showProductList', type: 'button', label: 'Mostrar lista de precios', route: ''},
		{name: 'showCurrentOrder', type: 'button', label: 'Mostrar pedido', route: 'pedido'}
	  ]
	const MultiItem = (props) => {
		let item;
		if(props.type === 'textfield') {
			item = (
				<ListItem>
					<TextField
						type="number"
						label={props.label}
						value={configValues[props.name]}
						onChange={(e) => onInputChange(props.name, e.target.value)}
					/>
				</ListItem>
			)
		}
		else if(props.type === 'switch') {
			item = (
				<ListItem>
					<FormGroup >
						<FormControlLabel
							checked={configValues[props.name]}
							onChange={(e) => onInputChange('showDetails', e.target.checked)}
							control={<Switch></Switch>}
							label="Mostrar detalles"
						>
						</FormControlLabel>
					</FormGroup>
				</ListItem>
			)
		}
		else if(props.type === 'button') {
			item = <ListItem button component={Link} to={props.route} ><ListItemText primary={props.label} /></ListItem>
		}
		return item;
	}
	return (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<Router>
				<List>
					{drawerConfig.map((config, index) => (
						<MultiItem key={index} {...config}></MultiItem>
					))}
				</List>
			</Router>


		</div>
	);
}

export default DrawerToolbar;