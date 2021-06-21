const { Bank } = require('./Bank.js');
class Metrobank extends Bank {
    constructor(loanAmount) {
        super(loanAmount, 1.5);
        this.loanAmount = loanAmount;
    }

    getMonthlyInstallment(loanTerm) {
        return super.getMonthlyInstallment(loanTerm);
    }
}


module.exports = { Metrobank };