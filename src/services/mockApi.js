const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const profile = {
  id: 'agent_001',
  name: 'Kwame Asante',
  phone: '+233241234567',
  email: 'kwame.asante@mopay.gh',
  location: 'Accra, Ghana',
  joined: '2023-01-05',
};

const sampleTransactions = Array.from({ length: 20 }).map((_, i) => ({
  id: `tx_${i + 1}`,
  type: ['Cash In', 'Cash Out', 'Airtime', 'Merchant'][i % 4],
  amount: Math.round((Math.random() * 500 + 5) * 100) / 100,
  phone: `+23324${100000 + i}`,
  status: ['Success', 'Pending', 'Failed'][i % 3],
  date: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}));

export default {
  async getProfile() {
    await wait(200);
    return profile;
  },
  async getTransactions() {
    await wait(300);
    return sampleTransactions;
  },
  async sendTransaction(tx) {
    await wait(400);
    const newTx = { id: `tx_${Date.now()}`, ...tx, date: new Date().toISOString(), status: 'Success' };
    sampleTransactions.unshift(newTx);
    return newTx;
  },
};
