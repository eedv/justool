export default {
	getWeek() {
		var target = new Date();
		var dayNr = (target.getDay() + 6) % 7;
		target.setDate(target.getDate() - dayNr + 3);
		var firstThursday = target.valueOf();
		target.setMonth(0, 1);
		if(target.getDay() != 4) {
			target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
		}
		return 1 + Math.ceil((firstThursday - target) / 604800000);

	},
	getMonth() {
		return new Date().getMonth() + 1;
	}
}