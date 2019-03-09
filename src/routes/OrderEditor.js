
import React from 'react';
import CustomTable from '../CustomTable';
import Autocomplete from '../Autocomplete';
import LocalStorage from '../LocalStorage';
import { Switch, FormGroup, FormControlLabel} from '@material-ui/core';
class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			order: LocalStorage.get('default') || [],
			showDetails: false
		}
	}

	handleTableChange = (actionType, rowIndex, rowData) => {
		const {productList} = this.props;
		const order = this.state.order.slice();
		if(actionType === 'add') {
		  const product = productList.find((prod) => prod.name === rowData.name);
		  product.qty = 1;
		  product.isStock = false;
		  order.push(product);
		}
		else if(actionType === 'edit') {
		  Object.assign(order[rowIndex], rowData);
		}
		else if(actionType === 'remove') {
		  order.splice(rowIndex, 1);
		}
		this.setState({order});
		LocalStorage.set('default', order)
	}
	render() {
		const { productList, min25Percent, min30Percent, anfCharges, adminCharges, taxRate} = this.props;

		return (
			<React.Fragment>
				<Autocomplete
					suggestions={productList}
					labelValue="name"
					onChange={(name) => this.handleTableChange('add', null, {name})}
				></Autocomplete>
				<CustomTable
					rows={this.state.order}
					onTableChange={this.handleTableChange}
					min25Percent={min25Percent}
					min30Percent={min30Percent}
					anfCharges={anfCharges}
					adminCharges={adminCharges}
					showDetails={this.state.showDetails}
					taxRate={taxRate}
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
			</React.Fragment>
		);
	}

}
export default OrderEditor;