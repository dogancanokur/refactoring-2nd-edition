const plays = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
};

export default function createStatementData(invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = getTotalAmount(statementData);
    statementData.totalVolumeCredits = getTotalVolumeCredits(statementData);
    return statementData;

}

function getTotalVolumeCredits(statementData) { // 3 for loop will affect performance. It is helpful to pay attention
    return statementData.performances.reduce((total, performance) => total + performance.volumeCredits, 0);
}

function getTotalAmount(statementData) {
    return statementData.performances.reduce((total, performance) => total + performance.amount, 0);
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function volumeCreditsFor(perf) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) {
        result += Math.floor(perf.audience / 5);
    }
    return result;
}

function playFor(perf) {
    return plays[perf.playID];
}

export function amountFor(performance) {
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