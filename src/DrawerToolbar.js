import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import TextField from '@material-ui/core/TextField'
import { Switch } from '@material-ui/core';
const DrawerToolbar = (props) => {
	const {classes, configValues, onInputChange} = props;
	const drawerConfig = [
		{name: 'min25Percent', type: 'textfield', label: 'Min 25%'},
		{name: 'min30Percent', type: 'textfield', label: 'Min 30%'},
		{name: 'anfCharges', type: 'textfield', label: 'Cargo por anfitriona'},
		{name: 'adminCharges', type: 'textfield', label: 'Gastos administrativos'},
		{name: 'showDetails', type: 'switch', label: 'Mostrar detalles de factura'}
	  ]
	const getItem = (config) => {
		let item;
		if(config.type === 'textfield') {
			item = (<TextField
				label={config.label}
				value={configValues[config.name]}
				onChange={(e) => onInputChange(config.name, e.target.value)}
			/>)
		}
		else if(config.type === 'switch') {
			item = (<Switch
				checked={configValues[config.name]}
				onChange={(e) => onInputChange('showDetails', e.target.checked)}
				value="checkedA"
			></Switch>)
		}
		return item;
	}
	return (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{drawerConfig.map((config, index) => (
					<ListItem key={index}>
						{getItem(config)}
					</ListItem>
				))}
			</List>

		</div>
	);
}

export default DrawerToolbar;