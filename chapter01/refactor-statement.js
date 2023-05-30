const invoice = [{
    customer: "BigCo", performances: [{
        playID: "hamlet", audience: 55,
    }, {
        playID: "as-like", audience: 35,
    }, {
        playID: "othello", audience: 40,
    },],
},];

const plays = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
};

function playFor(perf) {
    return plays[perf.playID];
}

function volumeCreditsFor(perf) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) {
        result += Math.floor(perf.audience / 5);
    }
    return result;
}

function getUsdFormat(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2,
    }).format(number);
}

function getTotalVolumeCredits(statementData) { // 3 for loop will affect performance. It is helpful to pay attention
    let totalVolumeCredits = 0;
    for (let perf of statementData.performances) {
        totalVolumeCredits += volumeCreditsFor(perf);
    }
    return totalVolumeCredits;
}

function getTotalAmount(statementData) {
    let totalAmount = 0;
    for (let perf of statementData.performances) {
        totalAmount += perf.amount;
    }
    return totalAmount;
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    return result;
}

function renderPlainText(data) {

    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        // print line for this order
        result += `  ${perf.play.name}: ${getUsdFormat(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${getUsdFormat(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;

    return result;
}

function createStatementData(invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = getTotalAmount(statementData);
    statementData.totalVolumeCredits = getTotalVolumeCredits(statementData);
    return statementData;
}

function statement(invoice) {
    return renderPlainText(createStatementData(invoice));
}

function amountFor(performance) {
    let thisAmount = 0;
    switch (performance.play.type) {
        case "tragedy":
            thisAmount = 40000;
            if (performance.audience > 30) {
                thisAmount += 1000 * (performance.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if (performance.audience > 20) {
                thisAmount += 10000 + 500 * (performance.audience - 20);
            }
            thisAmount += 300 * performance.audience;
            break;
        default:
            throw new Error(`unknown type: ${performance.play.type}`);
    }
    return thisAmount;
}

console.log(statement(invoice[0]));