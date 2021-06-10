const { BDO } = require('./BDO.js');
const { BPI } = require('./BPI.js');
const { Metrobank } = require('./Metrobank.js');


class LoanCalculator {

    constructor(bankName, loanAmount, loanTerm){
        this.bankName = bankName;
        this.loanAmount = loanAmount;
        this.loanTerm = loanTerm;
        this.setBank(bankName);
    }

    getMonthlyInstallment() {
        return this.bank.getMonthlyInstallment(this.loanTerm);
    }

    setBank() {
        if (this.bankName === "BDO") {
            this.bank = new BDO(this.loanAmount);
        } else if (this.bankName === "BPI") {
            this.bank = new BPI(this.loanAmount);
        } else if (this.bankName === "Metrobank") {
            this.bank = new Metrobank(this.loanAmount);
        }
    }
}

const length = process.argv.length;
let bankName;
let loanAmount;
let loanTerm;
for (let i = 0; i < length; i++) {
    const arg = process.argv[i];
    if (arg.indexOf('bankName') > 0) {
        bankName = arg.substring(arg.indexOf('=') + 1);
    } else if (arg.indexOf('loanAmount') > 0) {
        loanAmount = arg.substring(arg.indexOf('=') + 1);
    } else if (arg.indexOf('loanTerm') > 0) {
        loanTerm = arg.substring(arg.indexOf('=') + 1);
    }
}

if (bankName != undefined && loanAmount != undefined && loanTerm != undefined) {
    const loanCalculator = new LoanCalculator(bankName, loanAmount, loanTerm);
    console.log(loanCalculator.bank);
    console.log(loanCalculator.getMonthlyInstallment());
}
