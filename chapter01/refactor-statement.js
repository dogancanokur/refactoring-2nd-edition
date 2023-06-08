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

function htmlStatement(invoice) {
    return renderHtml(createStatementData(invoice));
}

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1><table><tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    for (let perf of data.performances) {
        result += `  <tr><td>${playFor(perf).name}</td><td>${perf.audience}</td>`;
        result += `<td>${getUsdFormat(createPerformanceCalculator(perf, playFor(perf)).amount / 100)}</td></tr>\n`;
    }
    result += `</table>
<p>Amount owed is <em>${getUsdFormat(data.totalAmount / 100)}</em></p>
<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}

console.log(htmlStatement(invoice[0]));