const { Bank } = require('./Bank.js');
class BPI extends Bank {
    
    constructor(loanAmount) {
        super(loanAmount, 1.2);
        this.loanAmount = loanAmount;
    }

    getMonthlyInstallment(loanTerm) {
        return super.getMonthlyInstallment(loanTerm);
    }
}

module.exports = { BPI };