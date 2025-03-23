const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function main() {
    const transactions = await stripe.charges.list({
        limit: 100,
    }).then((res: any) => {
        let txs = res.data.filter((tx: any) => tx.refunded === false);

        // Create an object to track counts by amount
        const amountCounts: Record<number, number> = {};
        const totalTransactions = txs.length;

        // Count transactions by amount
        for (const transaction of txs) {
            const amount = transaction.amount / 100; // Convert from cents to dollars/main currency
            console.log(transaction.billing_details);
            amountCounts[amount] = (amountCounts[amount] || 0) + 1;
        }

        // Sort amounts numerically
        const sortedAmounts = Object.keys(amountCounts).map(Number).sort((a, b) => a - b);

        // Output transactions by frequency
        console.log('--------------------------------------------------');
        console.log('TRANSACTIONS BY FREQUENCY (MOST TO LEAST COMMON)');
        console.log('--------------------------------------------------');
        console.log('Amount | Count | Percentage of Total');
        console.log('--------------------------------------------------');

        // Sort by count (descending)
        const sortedByCount = sortedAmounts.sort((a, b) => amountCounts[b] - amountCounts[a]);

        for (const amount of sortedByCount) {
            const count = amountCounts[amount];
            const percentage = ((count / totalTransactions) * 100).toFixed(2);
            console.log(`$${amount.toFixed(2)} | ${count}     | ${percentage}%`);
        }

        console.log('--------------------------------------------------');
    });
}

main();