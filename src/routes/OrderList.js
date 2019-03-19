import React from 'react';
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
		  orders: []
		}
	}

	componentDidMount() {
		fetch('http://localhost:8501/orders').then((res) => {
		  return res.json()
		}).then((orders) => {
		  this.setState({orders});
		})
	}

	createOrder() {
		return fetch('http://localhost:8501/orders', {
			method: 'POST',
			body: JSON.stringify(),
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
		})
		.then(response => response.json());
	  }

	render() {
		const {classes, match} = this.props;
		return (
			<>
				<Button variant="contained" color="default" onClick={this.createOrder}>Nuevo pedido</Button>
				<List className={classes.root}>

					{this.state.orders.map(order => (
						<ListItem button component={Link} to={`${match.url}/${order.year}/${order.period}/${order.week}`} key={order.periodWeek} alignItems="flex-start">
						<ListItemText
							primary={`Perìodo ${order.period}, semana ${order.week}`}

						/>
						</ListItem>
					))}
				</List>
			</>
		)
	}
}

export default withStyles(styles)(OrderList);