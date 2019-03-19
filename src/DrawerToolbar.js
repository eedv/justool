import React from 'react';
import { HashRouter as Router, Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup';
import { Switch, TextField } from '@material-ui/core';
import { Settings as Settingsicon, ViewList as ListIcon, Assignment as OrderIcon} from '@material-ui/icons'
const DrawerToolbar = (props) => {
	const {configValues, onInputChange} = props;
	const drawerConfig = [
		{name: 'showProductList', type: 'button', label: 'Lista de precios', icon: ListIcon ,route: '/'},
		{name: 'showOrderList', type: 'button', label: 'Pedidos', icon: OrderIcon, route: '/pedidos'},
		{name: 'showConfigEditor', type: 'button', label: 'Configuraciòn', icon: Settingsicon , route: '/config'}
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
			item = (
				<ListItem button component={Link} to={props.route} >
					{props.icon ? (<ListItemIcon><props.icon /></ListItemIcon>) : null}
					<ListItemText primary={props.label} />
				</ListItem>
			)
		}
		return item;
	}
	return (
		<div>
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