
import React from 'react';
import CustomTable from '../CustomTable';
import Autocomplete from '../Autocomplete';
import LocalStorage from '../LocalStorage';

class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			order: []
		}
	}
	componentDidMount() {
		this.setState({order: LocalStorage.get('default')});
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
		const { productList, min25Percent, min30Percent, anfCharges, adminCharges, showDetails, taxRate} = this.props;

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
					showDetails={showDetails}
					taxRate={taxRate}
				/>
			</React.Fragment>
		);
	}

}
export default OrderEditor;