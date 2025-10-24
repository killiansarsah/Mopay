import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NETWORKS } from '../state/MultiNetworkContext';

// API Configuration
const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Create axios instances for each network
const createNetworkClient = (networkId) => {
  const network = NETWORKS[networkId.toUpperCase()];

  return axios.create({
    baseURL: network.apiEndpoint,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'MoPay/1.0',
    },
  });
};

// API Service Class
export class MobileMoneyAPI {
  constructor(networkId) {
    this.networkId = networkId;
    this.client = createNetworkClient(networkId);
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      async (config) => {
        const authToken = await this.getAuthToken();
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }

        // Add API key if required
        const apiKey = await this.getApiKey();
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          await this.refreshAuthToken();
          // Retry the request
          return this.client.request(error.config);
        }

        if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
          // Retry logic for network errors
          return this.retryRequest(error);
        }

        return Promise.reject(error);
      }
    );
  }

  async getAuthToken() {
    try {
      return await SecureStore.getItemAsync(`${this.networkId}_auth_token`);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async getApiKey() {
    try {
      return await SecureStore.getItemAsync(`${this.networkId}_api_key`);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  async refreshAuthToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync(`${this.networkId}_refresh_token`);
      if (!refreshToken) return;

      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, newRefreshToken } = response.data;

      await SecureStore.setItemAsync(`${this.networkId}_auth_token`, accessToken);
      if (newRefreshToken) {
        await SecureStore.setItemAsync(`${this.networkId}_refresh_token`, newRefreshToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear tokens on refresh failure
      await this.clearAuthTokens();
    }
  }

  async clearAuthTokens() {
    await SecureStore.deleteItemAsync(`${this.networkId}_auth_token`);
    await SecureStore.deleteItemAsync(`${this.networkId}_refresh_token`);
  }

  async retryRequest(error, attempt = 1) {
    if (attempt >= API_CONFIG.RETRY_ATTEMPTS) {
      return Promise.reject(error);
    }

    await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));

    return this.client.request(error.config);
  }

  // Account Management Methods
  async authenticate(credentials) {
    try {
      const response = await this.client.post('/auth/login', credentials);

      const { accessToken, refreshToken, user } = response.data;

      await SecureStore.setItemAsync(`${this.networkId}_auth_token`, accessToken);
      await SecureStore.setItemAsync(`${this.networkId}_refresh_token`, refreshToken);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Authentication failed'
      };
    }
  }

  async getBalance(accountId) {
    try {
      const response = await this.client.get(`/accounts/${accountId}/balance`);
      return {
        success: true,
        balance: response.data.balance,
        currency: response.data.currency,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get balance'
      };
    }
  }

  async getTransactionHistory(accountId, params = {}) {
    try {
      const response = await this.client.get(`/accounts/${accountId}/transactions`, { params });
      return {
        success: true,
        transactions: response.data.transactions,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get transactions'
      };
    }
  }

  // Transaction Methods
  async sendMoney(fromAccountId, toPhoneNumber, amount, description = '') {
    try {
      const response = await this.client.post('/transactions/send', {
        fromAccountId,
        toPhoneNumber,
        amount,
        description,
        networkId: this.networkId,
      });

      return {
        success: true,
        transactionId: response.data.transactionId,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Transaction failed'
      };
    }
  }

  async cashIn(agentPhoneNumber, customerPhoneNumber, amount) {
    try {
      const response = await this.client.post('/transactions/cash-in', {
        agentPhoneNumber,
        customerPhoneNumber,
        amount,
        networkId: this.networkId,
      });

      return {
        success: true,
        transactionId: response.data.transactionId,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Cash-in failed'
      };
    }
  }

  async cashOut(agentPhoneNumber, customerPhoneNumber, amount) {
    try {
      const response = await this.client.post('/transactions/cash-out', {
        agentPhoneNumber,
        customerPhoneNumber,
        amount,
        networkId: this.networkId,
      });

      return {
        success: true,
        transactionId: response.data.transactionId,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Cash-out failed'
      };
    }
  }

  async buyAirtime(phoneNumber, amount) {
    try {
      const response = await this.client.post('/transactions/airtime', {
        phoneNumber,
        amount,
        networkId: this.networkId,
      });

      return {
        success: true,
        transactionId: response.data.transactionId,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Airtime purchase failed'
      };
    }
  }

  async payBill(billerId, accountNumber, amount, reference = '') {
    try {
      const response = await this.client.post('/transactions/pay-bill', {
        billerId,
        accountNumber,
        amount,
        reference,
        networkId: this.networkId,
      });

      return {
        success: true,
        transactionId: response.data.transactionId,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Bill payment failed'
      };
    }
  }

  // Utility Methods
  async checkTransactionStatus(transactionId) {
    try {
      const response = await this.client.get(`/transactions/${transactionId}/status`);
      return {
        success: true,
        status: response.data.status,
        details: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Status check failed'
      };
    }
  }

  async getSupportedBillers() {
    try {
      const response = await this.client.get('/billers');
      return {
        success: true,
        billers: response.data.billers,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get billers'
      };
    }
  }
}

// Factory function to create API instances
export const createMobileMoneyAPI = (networkId) => {
  return new MobileMoneyAPI(networkId);
};

// Multi-network API manager
export class MultiNetworkAPIManager {
  constructor() {
    this.apiInstances = {};
  }

  getAPI(networkId) {
    if (!this.apiInstances[networkId]) {
      this.apiInstances[networkId] = createMobileMoneyAPI(networkId);
    }
    return this.apiInstances[networkId];
  }

  async authenticateAllNetworks(credentials) {
    const results = {};

    for (const [networkId, network] of Object.entries(NETWORKS)) {
      const api = this.getAPI(network.id);
      results[network.id] = await api.authenticate(credentials[network.id]);
    }

    return results;
  }

  async getAllBalances(accountIds) {
    const results = {};

    for (const [networkId, accountId] of Object.entries(accountIds)) {
      if (accountId) {
        const api = this.getAPI(networkId);
        results[networkId] = await api.getBalance(accountId);
      }
    }

    return results;
  }
}