
import React from 'react';
import CustomTable from '../CustomTable';
import Autocomplete from '../Autocomplete';
import LocalStorage from '../LocalStorage';
import ConfigStore from '../ConfigStore';
import { Switch, FormGroup, FormControlLabel} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			productList: [],
			showDetails: false
		}
		this.config = ConfigStore.get('AppConfig'); // Default config
	}

	handleTableChange = (actionType, rowIndex, rowData) => {
		const {productList} = this.state;
		const products = this.state.products.slice();
		if(actionType === 'add') {
		  const product = productList.find((prod) => prod.name === rowData.name);
		  product.qty = 1;
		  product.isStock = false;
		  products.push(product);
		}
		else if(actionType === 'edit') {
		  Object.assign(products[rowIndex], rowData);
		}
		else if(actionType === 'remove') {
		  products.splice(rowIndex, 1);
		}
		this.setState({products});
		let orderData = {
			products,
			config: this.config,
			periodWeek: this.periodWeek
		}
		const {year, period, week} = this.props.match.params;
		fetch(`http://localhost:8501/orders/${year}/${period}/${week}`, {
			method: 'PATCH', // 'GET', 'PUT', 'DELETE', etc.
			body: JSON.stringify({ products}),
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
		})
		.then(response => response.json());
		console.log(this.periodWeek)
		LocalStorage.set(this.periodWeek, orderData)
	}

	componentWillMount() {
		const {year, period, week} = this.props.match.params;

		fetch(`http://localhost:8501/products?year=${year}&period=${period}&week=${week}`).then((res) => {
			return res.json()
		}).then((productData) => {
			if(productData) {
				this.setState({productList: productData.products});
			}
			else {
				this.setState({productLlist: null})
			}
		})

		fetch(`http://localhost:8501/orders/${year}/${period}/${week}`).then((res) => {
			return res.json()
		}).then((order) => {
			if(order && order[0]) {
				this.setState({...order[0]});
			}
			else {
				this.setState({status: 'No se encontró la semana o período'})
			}
		})
	}

	showStatus() {
		return <Typography component="span"  color="textPrimary">
			{this.state.status}
		</Typography>
	}

	showContent() {
		return (<React.Fragment>

			<Autocomplete
				suggestions={this.state.productList}
				labelValue="name"
				textTemplate="%{name} - %{size}"
				onChange={(name) => this.handleTableChange('add', null, {name})}
			></Autocomplete>
			<CustomTable
				rows={this.state.products}
				onTableChange={this.handleTableChange}
				min25Percent={this.config.min25Percent}
				min30Percent={this.config.min30Percent}
				anfCharges={this.config.anfCharges}
				adminCharges={this.config.adminCharges}
				showDetails={this.state.showDetails}
				taxrate={this.config.taxrate}
			/>
			<FormGroup >
				<FormControlLabel
					checked={this.state.showDetails}
					onChange={(e) => this.setState({showDetails: e.target.checked})}
					control={<Switch></Switch>}
					label="Mostrar detalles"
				>
				</FormControlLabel>
			</FormGroup>
		</React.Fragment>)
	}
	render() {
		return this.state.status ? this.showStatus() : this.showContent()
	}

}
export default OrderEditor;