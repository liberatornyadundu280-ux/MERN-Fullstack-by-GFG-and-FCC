class BankAccount {
  balance = 0;
  transactions = [];

  constructor(balance = 0, transactions = []) {
    this.balance = balance;
    this.transactions = transactions.length > 0 ? transactions : [];
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.transactions.push({
        type: "deposit",
        amount: amount,
        date: new Date(),
      });
      return `Successfully deposited $${amount}. New balance: $${this.balance}`;
    }
    return "Deposit amount must be greater than zero.";
  }
  withdraw(amount) {
    if (amount <= 0 || amount > this.balance) {
      return "Insufficient balance or invalid amount.";
    }
    this.balance -= amount;
    this.transactions.push({
      type: "withdraw",
      amount: amount,
      date: new Date(),
    });
    return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
  }
  checkBalance() {
    return `Current balance: $${this.balance}`;
  }
  get deposits() {
    return this.transactions.filter((t) => t.type === "deposit");
  }
  get withdrawals() {
    return this.transactions.filter((t) => t.type === "withdraw");
  }
  listAllDeposits() {
    let amounts = [];
    this.transactions.forEach((e) => {
      if (e.type === "deposit") {
        amounts.push(e.amount);
      }
    });
    return `Deposits: ${amounts.join(",")}`;
  }
  listAllWithdrawals() {
    let amounts = [];
    this.transactions.forEach((e) => {
      if (e.type === "withdraw") {
        amounts.push(e.amount);
      }
    });
    return `Withdrawals: ${amounts.join(",")}`;
  }

  // NEW FEATURE 1: Get total deposits and withdrawals
  getTotalDeposits() {
    return this.deposits.reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalWithdrawals() {
    return this.withdrawals.reduce((sum, t) => sum + t.amount, 0);
  }

  // NEW FEATURE 2: Apply interest to balance
  applyInterest(rate) {
    if (rate <= 0) {
      return "Interest rate must be greater than 0.";
    }
    const interest = this.balance * (rate / 100);
    this.balance += interest;
    this.transactions.push({
      type: "interest",
      amount: interest,
      date: new Date(),
    });
    return `Applied ${rate}% interest. Interest earned: $${interest.toFixed(
      2
    )}. New balance: $${this.balance.toFixed(2)}`;
  }

  // NEW FEATURE 3: Get detailed transaction history with dates
  getTransactionHistory() {
    if (this.transactions.length === 0) {
      return "No transactions yet.";
    }
    let history = "Transaction History:\n";
    this.transactions.forEach((t, index) => {
      const date = t.date ? t.date.toLocaleDateString() : "Unknown";
      history += `${index + 1}. ${t.type.toUpperCase()}: $${
        t.amount
      } on ${date}\n`;
    });
    return history;
  }

  // NEW FEATURE 4: Transfer money to another account
  transferTo(otherAccount, amount) {
    if (amount <= 0) {
      return "Transfer amount must be greater than 0.";
    }
    if (amount > this.balance) {
      return "Insufficient balance for transfer.";
    }
    this.balance -= amount;
    otherAccount.balance += amount;
    this.transactions.push({
      type: "transfer_out",
      amount: amount,
      date: new Date(),
      recipient: otherAccount,
    });
    otherAccount.transactions.push({
      type: "transfer_in",
      amount: amount,
      date: new Date(),
      sender: this,
    });
    return `Successfully transferred $${amount}. Your new balance: $${this.balance}. Recipient's new balance: $${otherAccount.balance}`;
  }

  // NEW FEATURE 5: Get complete account summary
  getAccountSummary() {
    const totalDeposits = this.getTotalDeposits();
    const totalWithdrawals = this.getTotalWithdrawals();
    return `
=== ACCOUNT SUMMARY ===
Current Balance: $${this.balance.toFixed(2)}
Total Transactions: ${this.transactions.length}
Total Deposits: $${totalDeposits.toFixed(2)} (${
      this.deposits.length
    } transactions)
Total Withdrawals: $${totalWithdrawals.toFixed(2)} (${
      this.withdrawals.length
    } transactions)
Net Change: $${(totalDeposits - totalWithdrawals).toFixed(2)}
=====================
    `;
  }

  // NEW FEATURE 6: Find largest transaction
  getLargestTransaction() {
    if (this.transactions.length === 0) {
      return "No transactions yet.";
    }
    const largest = this.transactions.reduce((max, t) =>
      t.amount > max.amount ? t : max
    );
    return `Largest transaction: ${largest.type.toUpperCase()} of $${
      largest.amount
    } on ${largest.date ? largest.date.toLocaleDateString() : "Unknown"}`;
  }

  // NEW FEATURE 7: Get balance history (balance after each transaction)
  getBalanceHistory() {
    if (this.transactions.length === 0) {
      return `Starting Balance: $${this.balance}`;
    }
    let history = `Starting Balance: $${(
      this.balance -
      this.getTotalDeposits() +
      this.getTotalWithdrawals()
    ).toFixed(2)}\n`;
    let runningBalance =
      this.balance - this.getTotalDeposits() + this.getTotalWithdrawals();

    this.transactions.forEach((t, index) => {
      if (
        t.type === "deposit" ||
        t.type === "transfer_in" ||
        t.type === "interest"
      ) {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      history += `After ${t.type} of $${t.amount}: $${runningBalance.toFixed(
        2
      )}\n`;
    });
    return history;
  }
}
let myAccount = new BankAccount(150, [
  { type: "deposit", amount: 50, date: new Date("2025-01-01") },
  { type: "deposit", amount: 30, date: new Date("2025-01-05") },
  { type: "withdraw", amount: 20, date: new Date("2025-01-10") },
  { type: "withdraw", amount: 15, date: new Date("2025-01-15") },
  { type: "withdraw", amount: 10, date: new Date("2025-01-20") },
]);

let secondAccount = new BankAccount(100);
let currentAccount = myAccount;

// ==================== UI FUNCTIONS ====================

function updateUI() {
  updateBalance();
  updateTransactionList();
  updateStats();
}

function updateBalance() {
  document.getElementById(
    "balanceDisplay"
  ).textContent = `$${currentAccount.balance.toFixed(2)}`;
}

function updateStats() {
  const totalDep = currentAccount.getTotalDeposits();
  const totalWith = currentAccount.getTotalWithdrawals();
  const netChange = totalDep - totalWith;

  document.getElementById(
    "totalDepositsDisplay"
  ).textContent = `$${totalDep.toFixed(2)}`;
  document.getElementById(
    "totalWithdrawalsDisplay"
  ).textContent = `$${totalWith.toFixed(2)}`;
  document.getElementById(
    "netChangeDisplay"
  ).textContent = `$${netChange.toFixed(2)}`;
}

function updateTransactionList() {
  const list = document.getElementById("transactionList");

  if (currentAccount.transactions.length === 0) {
    list.innerHTML = '<p class="empty-state">No transactions yet</p>';
    return;
  }

  list.innerHTML = currentAccount.transactions
    .slice()
    .reverse()
    .map((t) => {
      const date = t.date ? new Date(t.date).toLocaleDateString() : "Unknown";
      const amount = `$${t.amount.toFixed(2)}`;
      const icon =
        t.type === "deposit" ||
        t.type === "transfer_in" ||
        t.type === "interest"
          ? "+"
          : "-";

      return `
        <div class="transaction-item ${t.type}">
          <div class="transaction-info">
            <div class="transaction-type">${t.type.replace(/_/g, " ")}</div>
            <div class="transaction-date">${date}</div>
          </div>
          <div class="transaction-amount">${icon}${amount}</div>
        </div>
      `;
    })
    .join("");
}

function displayOutput(message) {
  const outputBox = document.getElementById("outputBox");
  outputBox.textContent = message;
}

function handleDeposit() {
  const amount = parseFloat(document.getElementById("depositAmount").value);

  if (isNaN(amount) || amount <= 0) {
    displayOutput("❌ Invalid amount. Please enter a positive number.");
    return;
  }

  const result = currentAccount.deposit(amount);
  displayOutput(`✅ ${result}`);
  document.getElementById("depositAmount").value = "";
  updateUI();
}

function handleWithdraw() {
  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if (isNaN(amount) || amount <= 0) {
    displayOutput("❌ Invalid amount. Please enter a positive number.");
    return;
  }

  const result = currentAccount.withdraw(amount);
  displayOutput(`${result.includes("Successfully") ? "✅" : "❌"} ${result}`);
  document.getElementById("withdrawAmount").value = "";
  updateUI();
}

function handleInterest() {
  const rate = parseFloat(document.getElementById("interestRate").value);

  if (isNaN(rate) || rate <= 0) {
    displayOutput("❌ Invalid rate. Please enter a positive number.");
    return;
  }

  const result = currentAccount.applyInterest(rate);
  displayOutput(`✅ ${result}`);
  updateUI();
}

function showAccountSummary() {
  const summary = currentAccount.getAccountSummary();
  displayOutput(summary);
}

function showLargestTransaction() {
  const largest = currentAccount.getLargestTransaction();
  displayOutput(largest);
}

function showTransactionHistory() {
  const history = currentAccount.getTransactionHistory();
  displayOutput(history);
}

function showBalanceHistory() {
  const history = currentAccount.getBalanceHistory();
  displayOutput(history);
}

function switchAccount() {
  const select = document.getElementById("accountSelect").value;
  currentAccount = select === "account1" ? myAccount : secondAccount;
  updateUI();
  displayOutput(`✅ Switched to ${select}`);
}

function clearAllData() {
  if (confirm("Are you sure? This will clear all transactions!")) {
    currentAccount.transactions = [];
    currentAccount.balance = 0;
    updateUI();
    displayOutput("✅ All data cleared!");
  }
}
