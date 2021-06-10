const { Bank } = require('./Bank.js');
class BDO extends Bank {
    
    constructor(loanAmount) {
        super(loanAmount, 1.7);
        this.loanAmount = loanAmount;
    }

    getMonthlyInstallment(loanTerm) {
        return super.getMonthlyInstallment(loanTerm);
    }
}

module.exports = { BDO };