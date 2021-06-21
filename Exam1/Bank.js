class Bank {

    constructor(loanAmount, interestRate) {
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
    }

    getMonthlyInstallment(loanTerm) {
        return (this.loanAmount * (1 + this.interestRate / 100)) / loanTerm
    }
}

module.exports = { Bank };