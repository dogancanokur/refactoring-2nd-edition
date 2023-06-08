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
    let play = playFor(aPerformance);
    const calculator = createPerformanceCalculator(aPerformance, play);
    const result = Object.assign({}, aPerformance);
    result.play = play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}

class PerformanceCalculator {

    constructor(performance) {
        this.performance = performance;
        this.play = performance.play;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }

}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }

}

export const playFor = (perf) => {
    return plays[perf.playID];
};

export function createPerformanceCalculator(performance, play) {
    switch (playFor(performance).type) {
        case "tragedy":
            return new TragedyCalculator(performance, play);
        case "comedy":
            return new ComedyCalculator(performance, play);
        default:
            throw new Error(`unknown type: ${performance.play.type}`);
    }
}