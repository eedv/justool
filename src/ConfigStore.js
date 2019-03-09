import LocalStorage from './LocalStorage';
export default {
	get() {
		return LocalStorage.get('AppConfig')
	},
	set(config) {
		config.timeStamp = Date.now();
		LocalStorage.set('AppConfig', config);
	}
}