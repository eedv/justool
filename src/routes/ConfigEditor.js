import React from 'react';
import { HashRouter as Router, Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListItemText from '@material-ui/core/ListItemText';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField'
import { Switch } from '@material-ui/core';
import ConfigStore from '../ConfigStore';

const config = [
	{name: 'min25Percent', type: 'textfield', label: 'Min 25%'},
	{name: 'min30Percent', type: 'textfield', label: 'Min 30%'},
	{name: 'anfCharges', type: 'textfield', label: 'Cargo por anfitriona'},
	{name: 'adminCharges', type: 'textfield', label: 'Gastos administrativos'},
	{name: 'taxrate', type: 'textfield', label: 'Ingresos Brutos'},
]
class ConfigEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...(ConfigStore.get() || {min25Percent: 0, min30Percent: 0, anfCharges:0, adminCharges:0, taxrate: 0})
		}
	}

	handleConfigChanges = (name, value) => {
		value = typeof value == 'string' ? Number(value) : value;
		this.setState({[name]: value})
		ConfigStore.set(this.state)
		//let config = Object.assign({}, this.state.configs, {[name]:value})
		//this.setState({configs: config});
	}

	getItem = (itemConfig, index) => {
		let item;
		if(itemConfig.type === 'textfield') {
			item = (
				<ListItem key={index}>
					<TextField
						type="number"
						label={itemConfig.label}
						value={this.state[itemConfig.name]}
						onChange={(e) => this.handleConfigChanges(itemConfig.name, e.target.value)}
					/>
				</ListItem>
			)
		}
		else if(itemConfig.type === 'switch') {
			item = (
				<ListItem key={index}>
					<FormGroup >
						<FormControlLabel
							checked={this.state[itemConfig.name]}
							onChange={(e) => this.handleConfigChanges('showDetails', e.target.checked)}
							control={<Switch></Switch>}
							label="Mostrar detalles"
						>
						</FormControlLabel>
					</FormGroup>
				</ListItem>
			)
		}
		else if(itemConfig.type === 'button') {
			item = <ListItem key={index} button component={Link} to={itemConfig.route} ><ListItemText primary={itemConfig.label} /></ListItem>
		}
		return item;
	}
	render() {
		return (
			<Router>
				<List>
					{config.map(this.getItem)}
				</List>
			</Router>
		)
	}

}

export default ConfigEditor;