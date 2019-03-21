
import React from 'react';
import CustomTable from '../CustomTable';
import Autocomplete from '../Autocomplete';
import LocalStorage from '../LocalStorage';
import ConfigStore from '../ConfigStore';
import DataFetcher from '../DataFetcher';
import { Switch, FormGroup, FormControlLabel} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			productList: [],
			showDetails: false,
			config: ConfigStore.get('AppConfig') || {} // Default config
		}
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
		this.setState({products}, () => {
			DataFetcher.saveOrder(this.state);
			LocalStorage.set(this.periodWeek, this.state);
		});
	}

	componentWillMount() {

		DataFetcher.getProductList(this.props.match.params)
			.then((productList) => {
				this.setState({productList});
			});

		DataFetcher.getOrder(this.props.match.params)
			.then((order) => {
				if(order) {
					this.setState({...order});
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
				min25Percent={this.state.config.min25Percent}
				min30Percent={this.state.config.min30Percent}
				anfCharges={this.state.config.anfCharges}
				adminCharges={this.state.config.adminCharges}
				showDetails={this.state.showDetails}
				taxrate={this.state.config.taxrate}
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