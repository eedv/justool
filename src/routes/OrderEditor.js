
import React from 'react';
import CustomTable from '../CustomTable';
import Autocomplete from '../Autocomplete';
import Autocomplete2 from '../Autocomplete2';
import LocalStorage from '../LocalStorage';
import ConfigStore from '../ConfigStore';
import DataFetcher from '../DataFetcher';
import { Switch, FormGroup, FormControlLabel, TextField} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Utils from '../Utils';

class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			productList: [],
			showDetails: false,
			notes: '',
			config: ConfigStore.get('AppConfig') || {}, // Default config,
			calculatedData: {}
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
		const calculatedData = Utils.getDeductionsAndProfit(products, this.state.config)
		this.setState({products, calculatedData}, () => {
			const {id} = this.state;
			DataFetcher.saveOrder(id, {products});
			LocalStorage.set(this.periodWeek, this.state);
		});
	}

	handleNoteChange = (event) => {
		this.setState({notes: event.target.value})
		const {id} = this.state;
		DataFetcher.saveOrder(id, {notes: event.target.value});
	}

	componentWillMount() {

		DataFetcher.getProductList(this.props.match.params.orderId)
			.then((productList) => {
				this.setState({productList});
			});

		DataFetcher.getOrder(this.props.match.params.orderId)
			.then((order) => {
				if(order) {
					this.setState({
						...order,
						calculatedData: Utils.getDeductionsAndProfit(order.products, order.config)
					});
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

			<Autocomplete2
				options={this.state.productList}
				labelValue="name"
				textTemplate="%{name} - %{size}"
				onChange={(item) => this.handleTableChange('add', null, item)}
			></Autocomplete2>
			<CustomTable
				rows={this.state.products}
				onTableChange={this.handleTableChange}
				calculatedData={this.state.calculatedData}
				config={this.state.config}
				showDetails={this.state.showDetails}
			/>
			<FormGroup >
				<FormControlLabel
					checked={this.state.showDetails}
					onChange={(e) => this.setState({showDetails: e.target.checked})}
					control={<Switch></Switch>}
					label="Mostrar detalles"
				>
				</FormControlLabel>
				<TextField
					id="notas-textarea"
					label="Notas"
					placeholder="Notas"
					multiline
					rows="10"
					margin="normal"
					variant="outlined"
					value={this.state.notes}
					onChange={this.handleNoteChange}
				/>
			</FormGroup>
		</React.Fragment>)
	}
	render() {
		return this.state.status ? this.showStatus() : this.showContent()
	}

}
export default OrderEditor;