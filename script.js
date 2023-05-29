function addParticipant() {
    var row = document.createElement('tr');
    row.innerHTML = '<td><input type="text"></td><td><button onclick="removeRow(this)">삭제</button></td>';
    document.getElementById('participants').appendChild(row);
}

function addExpense() {
    var row = document.createElement('tr');
    row.innerHTML = '<td><input type="text"></td><td><input type="text"></td><td><button onclick="removeRow(this)">삭제</button></td>';
    document.getElementById('expenses').appendChild(row);
}

function removeRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function calculate() {
    var participants = Array.from(document.querySelectorAll('#participants input')).map(input => input.value);
    var expenses = Array.from(document.querySelectorAll('#expenses input')).reduce(function(result, input, index) {
        if (index % 2 == 0) {
            result.push({name: input.value, expense: 0});
        } else {
            result[result.length - 1].expense += parseInt(input.value);
        }
        return result;
    }, []);
    
    var total = expenses.reduce((sum, expense) => sum + expense.expense, 0);
    var average = total / participants.length;
    
    var balances = participants.map(function(name) {
        var balance = (expenses.find(expense => expense.name === name) || {expense: 0}).expense - average;
        return {name: name, balance: balance};
    });

    var payers = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    var payees = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    
    var transactions = [];

    while (payers.length > 0 && payees.length > 0) {
        var payer = payers[0];
        var payee = payees[0];

        var amount = Math.min(payer.balance, -payee.balance);

        transactions.push({from: payer.name, to: payee.name, amount: amount});

        payer.balance -= amount;
        payee.balance += amount;

        if (payer.balance <= 0) {
            payers.shift();
        }

        if (payee.balance >= 0) {
            payees.shift();
        }
    }

    transactions = transactions.map(transaction => {
        return {
            '수령자': transaction.from,
            '지불자': transaction.to,
            '금액': transaction.amount
        };
    });

    var outputText = transactions.map(transaction => {
        return `'${transaction.수령자}' (이)가 '${transaction.지불자}'에게 '${transaction.금액}' 만큼을 받습니다.`;
    }).join('\n');

    document.getElementById('output').textContent = outputText;
}
