import createStatementData, {createPerformanceCalculator, playFor} from './createStatementData.js';

const invoice = [{
    customer: "BigCo", performances: [{
        playID: "hamlet", audience: 55,
    }, {
        playID: "as-like", audience: 35,
    }, {
        playID: "othello", audience: 40,
    },],
},];

function getUsdFormat(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2,
    }).format(number);
}

function renderPlainText(data) {

    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        // print line for this order
        result += `  ${playFor(perf).name}: ${getUsdFormat(createPerformanceCalculator(perf, playFor(perf)).amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${getUsdFormat(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;

    return result;
}

function statement(invoice) {
    return renderPlainText(createStatementData(invoice));
}

console.log(statement(invoice[0]));