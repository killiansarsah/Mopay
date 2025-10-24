import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../state/AppContext';
import { spacing, colors } from '../theme/tokens';

const { width } = Dimensions.get('window');

export default function ReportsScreen({ navigation }) {
  const { transactions } = useContext(AppContext);
  const [selectedDateRange, setSelectedDateRange] = useState('Today');

  // Calculate metrics with realistic data
  const totalTransactions = transactions.length;
  const totalCommission = transactions.reduce((sum, t) => sum + (Number(t.amount || 0) * 0.025), 0); // 2.5% commission
  const avgTransactionValue = totalTransactions > 0 ? transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0) / totalTransactions : 0;
  
  // Mock data for charts (since we don't have historical data)
  const transactionTrends = 2345 + Math.floor(Math.random() * 500); // Random variation
  const commissionEarned = totalCommission > 0 ? totalCommission : 1234.56;
  const transactionTypes = 5432 + Math.floor(Math.random() * 1000);
  
  // Mock percentage changes
  const trendsChange = 5.2 + (Math.random() - 0.5) * 2; // +/- 1%
  const commissionChange = 8.1 + (Math.random() - 0.5) * 4; // +/- 2%
  const typesChange = 2.7 + (Math.random() - 0.5) * 1; // +/- 0.5%

  // Mock recent activities if no real transactions
  const mockActivities = [
    { type: 'cash_in', amount: 50.00, date: 'Oct 26, 2023', status: 'Completed' },
    { type: 'cash_out', amount: 120.00, date: 'Oct 25, 2023', status: 'Completed' },
    { type: 'bill_pay', amount: 75.50, date: 'Oct 25, 2023', status: 'Pending' },
    { type: 'cash_in', amount: 200.00, date: 'Oct 24, 2023', status: 'Completed' },
  ];
  
  const displayActivities = transactions.length > 0 ? transactions.slice(0, 4) : mockActivities;

  const dateRanges = ['Today', 'This Week', 'This Month', 'Custom'];

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download reports');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f5f7f8" />
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Reports & Analytics</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <MaterialIcons name="download" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Range Selector */}
        <View style={styles.dateRangeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRangeScroll}>
            {dateRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.dateRangeButton,
                  selectedDateRange === range && styles.dateRangeButtonActive
                ]}
                onPress={() => setSelectedDateRange(range)}
              >
                <Text style={[
                  styles.dateRangeText,
                  selectedDateRange === range && styles.dateRangeTextActive
                ]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metric Cards */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Transactions</Text>
            <Text style={styles.metricValue}>{totalTransactions.toLocaleString()}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Commission</Text>
            <Text style={styles.metricValue}>${totalCommission.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Avg. Transaction Value</Text>
            <Text style={styles.metricValue}>${avgTransactionValue.toFixed(2)}</Text>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Transaction Trends Line Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Transaction Trends</Text>
            <View style={styles.chartValueContainer}>
              <Text style={styles.chartValue}>{transactionTrends.toLocaleString()}</Text>
              <Text style={styles.chartChange}>+{trendsChange.toFixed(1)}%</Text>
            </View>
            <View style={styles.lineChartPlaceholder}>
              <MaterialIcons name="show-chart" size={48} color={colors.secondary} />
              <Text style={styles.placeholderText}>Transaction Trends Over Time</Text>
              <Text style={styles.placeholderSubtext}>Weekly data visualization</Text>
            </View>
            <View style={styles.chartLabels}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <Text key={day} style={styles.chartLabel}>{day}</Text>
              ))}
            </View>
          </View>

          {/* Commission Earned Bar Chart & Transaction Types Donut Chart */}
          <View style={styles.chartsRow}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Commission Earned</Text>
              <View style={styles.chartValueContainer}>
                <Text style={styles.chartValue}>${commissionEarned.toFixed(2)}</Text>
                <Text style={styles.chartChange}>+{commissionChange.toFixed(1)}%</Text>
              </View>
              <View style={styles.barChartPlaceholder}>
                <MaterialIcons name="bar-chart" size={48} color={colors.secondary} />
                <Text style={styles.placeholderText}>Commission Earnings</Text>
                <Text style={styles.placeholderSubtext}>Daily breakdown</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Transaction Types</Text>
              <View style={styles.chartValueContainer}>
                <Text style={styles.chartValue}>{transactionTypes.toLocaleString()}</Text>
                <Text style={styles.chartChange}>+{typesChange.toFixed(1)}%</Text>
              </View>
              <View style={styles.donutChartPlaceholder}>
                <MaterialIcons name="pie-chart" size={48} color={colors.primary} />
                <Text style={styles.placeholderText}>Transaction Distribution</Text>
                <Text style={styles.placeholderSubtext}>By payment type</Text>
              </View>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.legendText}>Cash In</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                  <Text style={styles.legendText}>Cash Out</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#d1d5db' }]} />
                  <Text style={styles.legendText}>Bill Pay</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {displayActivities.map((transaction, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <MaterialIcons
                    name={transaction.type === 'cash_in' ? 'call_received' : transaction.type === 'cash_out' ? 'call_made' : 'receipt_long'}
                    size={24}
                    color={transaction.type === 'cash_in' ? colors.primary : transaction.type === 'cash_out' ? '#ef4444' : '#eab308'}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>
                    {transaction.type === 'cash_in' ? 'Cash In' : transaction.type === 'cash_out' ? 'Cash Out' : 'Bill Payment'}
                  </Text>
                  <Text style={styles.activityDate}>{transaction.date || 'Recent'}</Text>
                </View>
                <View style={styles.activityAmount}>
                  <Text style={[
                    styles.amountText,
                    { color: transaction.type === 'cash_in' ? colors.secondary : colors.textLight }
                  ]}>
                    {transaction.type === 'cash_in' ? '+' : '-'}${transaction.amount ? Number(transaction.amount).toFixed(2) : '0.00'}
                  </Text>
                  <Text style={styles.activityStatus}>{transaction.status || 'Completed'}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textLight,
    textAlign: 'center',
  },
  downloadButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  dateRangeContainer: {
    backgroundColor: colors.backgroundLight,
    paddingVertical: spacing.md,
  },
  dateRangeScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dateRangeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: spacing.sm,
  },
  dateRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  dateRangeTextActive: {
    color: '#ffffff',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  chartsContainer: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  chartValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  chartValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  chartChange: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondary,
  },
  lineChartPlaceholder: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  barChartPlaceholder: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutChartPlaceholder: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  chartsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  activityList: {
    gap: spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  activityDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewAllButton: {
    width: '100%',
    backgroundColor: colors.primary + '33', // 20% opacity
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
