import React from 'react';
import { Link, Redirect} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DataFetcher from '../DataFetcher';
const styles = theme => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	  justifyContent: 'space-around',
	  overflow: 'hidden'
	}
  });
class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			orderCreated: {},
			error: ''
		}
	}

	componentDidMount() {
		DataFetcher.getOrders().then((orders) => {
		  this.setState({orders: orders.sort((a, b) => b.week - a.week)});
		});
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
			const {year, period, week} = this.state.orderCreated;
			return <Redirect to={`/pedidos/${year}/${period}/${week}`}></Redirect>
		}
		else {
			return (
				<>
					<Button variant="contained" color="default" onClick={() => this.createOrder()}>Nuevo pedido</Button>
					<List className={classes.root}>

						{this.state.orders.map(order => (
							<ListItem button component={Link} to={`${match.url}/${order.year}/${order.period}/${order.week}`} key={order.periodWeek} alignItems="flex-start">
							<ListItemText
								primary={`Perìodo ${order.period}, semana ${order.weekOfPeriod}`}

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