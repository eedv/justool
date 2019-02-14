import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import TextField from '@material-ui/core/TextField'
const DrawerToolbar = (props) => {
	const {classes, configValues, onInputChange} = props;
	const drawerConfig = [
		{name: 'min25Percent', type: 'textfield', label: 'Min 25%'},
		{name: 'min30Percent', type: 'textfield', label: 'Min 30%'},
		{name: 'anfCharges', type: 'textfield', label: 'Cargo por anfitriona'},
		{name: 'adminCharges', type: 'textfield', label: 'Gastos administrativos'}
	  ]
	return (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{drawerConfig.map((config, index) => (
					<ListItem key={index}>
					<TextField
						label={config.label}
						value={configValues[config.name]}
						onChange={(e) => onInputChange(config.name, e.target.value)}/>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export default DrawerToolbar;