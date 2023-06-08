import {expect} from "chai";
import statement from "../../src/chapter01/refactor-statement.js";

describe("statement", () => {
    let plays = {
        "hamlet": {"name": "Hamlet", "type": "tragedy"},
        "as-like": {"name": "As You Like It", "type": "comedy"},
        "othello": {"name": "Othello", "type": "tragedy"}
    };
    let invoices = [{
        "customer": "BigCo", "performances": [{
            "playID": "hamlet", "audience": 55
        }, {
            "playID": "as-like", "audience": 35
        }, {
            "playID": "othello", "audience": 40
        }]
    }];

    it("should print statement", () => {
        let result = statement(invoices[0], plays);
        expect(result).to.equal(`Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
    });
});