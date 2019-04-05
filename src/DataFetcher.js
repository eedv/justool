const baseApi = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_API_DEV : process.env.REACT_APP_API_PROD
export default {
	async createOrder() {
		return await fetch(`${baseApi}/orders`, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
		})
		.then(response => response.json());
	},
	async saveOrder(year, period, week, updateData) {
		return fetch(`${baseApi}/orders/${year}/${period}/${week}`, {
			method: 'PATCH', // 'GET', 'PUT', 'DELETE', etc.
			body: JSON.stringify(updateData),
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
		})
		.then(response => response.json());
	},
	async getOrder(orderId) {

		let response = await fetch(`${baseApi}/orders/${orderId}`);
		let order = await response.json();
		return order ? order[0] : null;
	},
	async getOrders(query) {
		let orderFilter = '';
		for (const key in query) {
			if (query.hasOwnProperty(key) && query[key]) {
				orderFilter += `&${key}=${query[key]}`;
			}
		}
		orderFilter = orderFilter.replace(/&/, '')

		return await fetch(`${baseApi}/orders/?${orderFilter}`).then((res) => {
			return res.json();
		});
	},

	async getConfig() {
		return await fetch(`${baseApi}/config`).then((res) => {
			return res.json();
		})
	},
	async saveConfig(config) {
		return await fetch(`${baseApi}/config`, {
			method: 'PUT',
			body: JSON.stringify(config),
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
		})
		.then(response => response.json());
	},

	async getProductList(priceListId) {
		let response = await fetch(`${baseApi}/products/${priceListId}`);
		let productList = await response.json();
		return productList ? productList.products : null;
	}
}