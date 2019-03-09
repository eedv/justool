export default {
	set(key, data) {
		data = JSON.stringify(data);
		window.localStorage.setItem(key, data);
	},
	get(key) {
		let data = window.localStorage.getItem(key);
		return typeof data == 'string' ? JSON.parse(data) : null;
	},
	clear() {
		window.localStorage.clear();
	},
	remove(key) {
		window.localStorage.removeItem(key);
	}
}