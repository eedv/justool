import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';


class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sum: 0,
			quantity: 0,
			price: 0
		}
	}
	onQuantityChange(qty) {
		let quantity = parseInt(qty);
		this.setState({
			quantity: parseInt(qty)
		});
		this.props.onChange(this.state.price * quantity);
	}
	onPriceChange(price) {
		let parsedPrice = parseFloat(price);
		this.setState({
			price: parsedPrice
		});
		this.props.onChange(parsedPrice * this.state.quantity);
	}
	render() {
		const numberInputProps = {min: 0};
		const sum = this.state.price * this.state.quantity;

		return (
			<div class="grid-row">

				<TextField fullWidth={false} variant="outlined" margin="normal" label={this.props.name}/>


				<TextField value={this.state.price} onChange={evt => this.onPriceChange(evt.currentTarget.value)}
					type="number" inputProps={numberInputProps}
					variant="outlined" margin="normal"  label='precio'/>

				<TextField variant="outlined" margin="normal" label='cantidad'
					onChange={evt => this.onQuantityChange(evt.currentTarget.value)}/>

				<TextField value={sum} type="number" inputProps={numberInputProps}
					variant="outlined" margin="normal"  label='subtotal'/>
				<IconButton
					onClick={() => this.props.removeProduct()}
					variant="contained"
					margin="normal"
					color="primary">
					<DeleteIcon></DeleteIcon>
				</IconButton>
			</div>
		)
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			products: [],
			total: 0
		}
	}
	handleClick() {
		const products = this.state.products;
		this.setState({
			products: products.concat([{name: 'product name', pvpCost: 0, key: Date.now()}]),
			total: this.state.total
		})
	}
	handleChange(evt) {
		let products = this.state.products.slice();
		products.find((item) => item.key === evt.key).pvpCost = parseFloat(evt.value || 0);
		this.setState({
			products: products
		});
	}
	removeItem(index) {
		let products =  this.state.products.slice();
		products.splice(products.findIndex((item) => item.key === index), 1);
		this.setState({
			products: products
		});
	}

	render() {
		const totalCost = this.state.products.reduce((prev, curr) => prev + curr.pvpCost, 0)
		const profitPercentage = totalCost >= 2200 ? 30 : (totalCost >= 1800) ? 20 : 0;
		const profit = totalCost * profitPercentage / 100;
		const products = this.state.products.map((product) => {
			return (
				<Product
					onChange={(evt) => this.handleChange({key: product.key, value: evt}) }
					removeProduct={(evt) => this.removeItem(product.key)}
					{...product} ></Product>
			)
		})


		return (
			<div>
				<Button onClick={() => this.handleClick()} variant="contained" color="primary">
				agregar producto
			</Button>
				<div class="grid-container">{products}</div>
				<div>
					<TextField value={totalCost} variant="outlined" margin="normal" label={this.props.name}/>
					<label>{profitPercentage} %</label>
					<TextField value={profit} variant="outlined" margin="normal" label={this.props.name}/>
				</div>
			</div>

		)
	}
}

ReactDOM.render(
	<Table></Table>,
	document.getElementById('root')
);