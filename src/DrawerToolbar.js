import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import TextField from '@material-ui/core/TextField'
const DrawerToolbar = (props) => {
	const {classes, ctrlConfig, onInputChange} = props;

	return (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{ctrlConfig.map((ctrl, index) => (
					<ListItem key={index}>
					<TextField label={ctrl.label} onChange={(e) => onInputChange(ctrl.name, e.target.value)}/>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export default DrawerToolbar;