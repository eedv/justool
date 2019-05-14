import React from 'react';
import { Link, Redirect} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {Button, Select, MenuItem, List, ListItem, ListItemText, FormControl, InputLabel} from '@material-ui/core'
import DataFetcher from '../DataFetcher';
import {uniq} from 'lodash';
const styles = theme => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	  overflow: 'hidden'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});
class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			orderCreated: {},
			periodFilters: [],
			periodFilterSelected: '',
			yearFilters: [],
			yearFilterSelected: '',
			error: ''
		}
	}

	componentWillMount() {
		DataFetcher.getOrders({}).then((orders) => {
		  	this.setState({
				yearFilters: uniq(orders.map((period) => period.year)),
				periodFilters: uniq(orders.map((period) => period.period)),
				orders: orders.sort((a, b) => b.week - a.week)
			});
		});
	}

	handleFilterSelection = (event) => {
		this.setState({[`${event.target.name}FilterSelected`]: event.target.value}, () => {
			DataFetcher.getOrders({year: this.state.yearFilterSelected, period: this.state.periodFilterSelected}).then((orders) => {
				this.setState({orders: orders.sort((a, b) => b.weekOfPeriod - a.weekOfPeriod)});
			});
		})

	}

	createOrder() {
		DataFetcher.createOrder()
			.then((order) => {
				return this.setState({
					orderCreated: order
				})
			})

	}

	render() {
		const {classes, match} = this.props;
		if(this.state.orderCreated.year) {
			const {id} = this.state.orderCreated;
			return <Redirect to={`/pedidos/${id}`}></Redirect>
		}
		else {
			return (
				<>
				<form  className={classes.root}>
				<FormControl  className={classes.formControl} >
					<Button variant="contained" color="default" onClick={() => this.createOrder()}>Nuevo pedido</Button>
				</FormControl>
					<FormControl  className={classes.formControl} >
						<InputLabel htmlFor="year-simple">Año</InputLabel>
						<Select
							value={this.state.yearFilterSelected}
							onChange={this.handleFilterSelection}
							inputProps={{
								name: 'year',
								id: 'year-simple',
							}}
						>
						{this.state.yearFilters.map((filter, index) => <MenuItem key={index} value={filter}>{filter}</MenuItem>)}
						</Select>
					</FormControl>
					<FormControl  className={classes.formControl} >
						<InputLabel htmlFor="period-simple">Período</InputLabel>
						<Select
							value={this.state.periodFilterSelected}
							onChange={this.handleFilterSelection}
							inputProps={{
								name: 'period',
								id: 'period-simple',
							}}
						>
						{this.state.periodFilters.map((filter, index) => <MenuItem key={index} value={filter}>{filter}</MenuItem>)}
						</Select>
					</FormControl>
				</form>
					<List className={classes.root}>

						{this.state.orders.map(order => (
							<ListItem button component={Link} to={`${match.url}/${order.id}`} key={order.id} alignItems="flex-start">
								<ListItemText
									primary={`Perìodo ${order.period}, semana ${order.weekOfPeriod} - PVP: $ ${order.invoiceSummary.totalPVP || 0}`}

								/>
							</ListItem>
						))}
					</List>
				</>
			)
		}
	}
}

export default withStyles(styles)(OrderList);