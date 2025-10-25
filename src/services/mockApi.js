const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const profile = {
  id: 'agent_001',
  name: 'Killian Sarsah',
  phone: '+233241234567',
  email: 'killian.sarsah@mopay.gh',
  location: 'Accra, Ghana',
  joined: '2023-01-05',
};

// Ghanaian network prefixes
const networkPrefixes = {
  MTN: ['024', '054', '055', '059'],
  AirtelTigo: ['027', '057', '026', '056'],
  Vodafone: ['020', '050', '023', '053']
};

const transactionTypes = ['cash_in', 'cash_out', 'send_money', 'buy_airtime', 'pay_bills'];
const statuses = ['Success', 'Pending', 'Failed'];

// Generate realistic Ghanaian phone numbers
const generatePhoneNumber = () => {
  const networks = Object.keys(networkPrefixes);
  const network = networks[Math.floor(Math.random() * networks.length)];
  const prefix = networkPrefixes[network][Math.floor(Math.random() * networkPrefixes[network].length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return { phone: `${prefix}${suffix}`, network };
};

// Realistic Ghanaian transaction amounts
const generateAmount = (type) => {
  const ranges = {
    cash_in: [10, 2000],
    cash_out: [5, 1500],
    send_money: [5, 500],
    buy_airtime: [1, 100],
    pay_bills: [20, 800]
  };
  const [min, max] = ranges[type] || [5, 500];
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

const sampleTransactions = Array.from({ length: 250 }).map((_, i) => {
  const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const { phone, network } = generatePhoneNumber();
  const amount = generateAmount(type);
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const hoursAgo = Math.floor(Math.random() * 720); // Up to 30 days ago
  
  return {
    id: `tx_${(i + 1).toString().padStart(3, '0')}`,
    type,
    amount,
    phone,
    network,
    status,
    date: new Date(Date.now() - hoursAgo * 1000 * 60 * 60).toISOString(),
    commission: Math.round(amount * 0.025 * 100) / 100, // 2.5% commission
    reference: type === 'pay_bills' ? `BILL${Math.floor(Math.random() * 100000)}` : null
  };
});

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