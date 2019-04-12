export default {
	getWeek(d = new Date()) {
		// Copy date so don't modify original
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		// Set to nearest Thursday: current date + 4 - current day number
		// Make Sunday's day number 7
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		// Get first day of year
		var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		// Calculate full weeks to nearest Thursday
		var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
		// Return array of year and week number
		return weekNo;

	},
	getFourWeekMonth() {
		return Math.ceil(this.getWeek() / 4);
	},
	calculatePaidPrice(rows, justDiscountPercent) {
		return rows.map((row) => {
			row.paidPrice = (row.pvp * ((100 - justDiscountPercent) / 100)) / 1.105;
			return row;
		})
	},

	calculatePvP(rows) {
		return rows.map((row) => {
			row.pvp = row.price * row.qty;
			return row;
		})
	},

	getSum(rows, field) {
		return rows.reduce((sum, row) => sum + row[field], 0);
	},
	getDeductionsAndProfit(orderProducts, config) {
		const {taxrate, anfCharges, adminCharges, min25Percent, min30Percent} = config;
		const pvpSubtotals = this.calculatePvP(orderProducts);
		const totalPVP = this.getSum(pvpSubtotals, 'pvp');
		const justDiscountPercent = totalPVP >= min30Percent ? 30 : totalPVP >= min25Percent ? 25 : 0;

		const paidPrice = this.calculatePaidPrice(pvpSubtotals, justDiscountPercent);

		const justDiscountAmmount = (totalPVP * justDiscountPercent) / 100;

		const investment = this.getSum(paidPrice.filter(row => row.isStock), 'paidPrice');
		const stockPVP = this.getSum(pvpSubtotals.filter(row => row.isStock), 'pvp');
		const invoiceSubtotal = this.getSum(paidPrice, 'paidPrice') + anfCharges + adminCharges;

		const invoiceTaxes = taxrate * invoiceSubtotal / 100;

		const invoiceTotal = invoiceSubtotal + invoiceTaxes;

		const realPVP = totalPVP - stockPVP;
		const profit = totalPVP - stockPVP - invoiceTotal;

		return {
			totalPVP,
			realPVP,
			invoiceTotal,
			investment,
			profit,
			stockPVP,
			justDiscountPercent,
			justDiscountAmmount,
			invoiceTaxes
		}
	}
}