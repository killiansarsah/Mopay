import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../state/AppContext';
import { spacing, colors } from '../theme/tokens';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ReportsScreen({ navigation }) {
  const { theme } = useTheme();
  const { transactions } = useContext(AppContext);

  // Calculate metrics with realistic data
  const totalTransactions = transactions.length;
  const totalCommission = transactions.reduce((sum, t) => sum + (Number(t.amount || 0) * 0.025), 0); // 2.5% commission
  const avgTransactionValue = totalTransactions > 0 ? transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0) / totalTransactions : 0;
  
  const [selectedDateRange, setSelectedDateRange] = useState('This Week');
  
  // Dynamic data based on selected time period
  const getDataForPeriod = (period) => {
    switch (period) {
      case 'Today':
        return [
          { day: '6AM', short: '6AM', value: 15, color: '#3B82F6', transactions: 23, trend: '+5%' },
          { day: '9AM', short: '9AM', value: 25, color: '#8B5CF6', transactions: 45, trend: '+12%' },
          { day: '12PM', short: '12PM', value: 30, color: '#10B981', transactions: 67, trend: '+18%' },
          { day: '3PM', short: '3PM', value: 20, color: '#F59E0B', transactions: 34, trend: '+8%' },
          { day: '6PM', short: '6PM', value: 10, color: '#EF4444', transactions: 12, trend: '-2%' }
        ];
      case 'This Month':
        return [
          { day: 'Week 1', short: 'W1', value: 28, color: '#3B82F6', transactions: 1240, trend: '+15%' },
          { day: 'Week 2', short: 'W2', value: 32, color: '#8B5CF6', transactions: 1456, trend: '+22%' },
          { day: 'Week 3', short: 'W3', value: 25, color: '#10B981', transactions: 1123, trend: '+8%' },
          { day: 'Week 4', short: 'W4', value: 15, color: '#F59E0B', transactions: 876, trend: '-5%' }
        ];
      default: // This Week
        return [
          { day: 'Monday', short: 'Mon', value: 22, color: '#3B82F6', transactions: 187, trend: '+12%' },
          { day: 'Tuesday', short: 'Tue', value: 18, color: '#8B5CF6', transactions: 156, trend: '+8%' },
          { day: 'Wednesday', short: 'Wed', value: 15, color: '#10B981', transactions: 134, trend: '+5%' },
          { day: 'Thursday', short: 'Thu', value: 12, color: '#F59E0B', transactions: 98, trend: '-2%' },
          { day: 'Friday', short: 'Fri', value: 20, color: '#EF4444', transactions: 167, trend: '+15%' },
          { day: 'Saturday', short: 'Sat', value: 8, color: '#06B6D4', transactions: 89, trend: '+3%' },
          { day: 'Sunday', short: 'Sun', value: 5, color: '#84CC16', transactions: 45, trend: '-5%' }
        ];
    }
  };
  
  const currentData = getDataForPeriod(selectedDateRange);
  const totalCurrentTransactions = currentData.reduce((sum, item) => sum + item.transactions, 0);
  const commissionEarned = totalCurrentTransactions * 0.025;
  
  // Dynamic metrics
  const getMetrics = (period) => {
    switch (period) {
      case 'Today': return { change: 8.5, commissionChange: 6.2, average: Math.round(totalCurrentTransactions / currentData.length), label: 'Hourly Average' };
      case 'This Month': return { change: 18.3, commissionChange: 15.7, average: Math.round(totalCurrentTransactions / currentData.length), label: 'Weekly Average' };
      default: return { change: 15.8, commissionChange: 12.3, average: Math.round(totalCurrentTransactions / currentData.length), label: 'Daily Average' };
    }
  };
  
  const metrics = getMetrics(selectedDateRange);

  // Enhanced recent activities with better data
  const mockActivities = [
    { type: 'cash_in', amount: 250.00, date: '2 hours ago', status: 'Completed', phone: '024-123-4567', icon: 'trending-up' },
    { type: 'cash_out', amount: 120.00, date: '4 hours ago', status: 'Completed', phone: '055-987-6543', icon: 'trending-down' },
    { type: 'bill_pay', amount: 75.50, date: '6 hours ago', status: 'Pending', reference: 'ECG-2024-001', icon: 'receipt' },
    { type: 'airtime', amount: 25.00, date: '1 day ago', status: 'Completed', phone: '027-555-0123', icon: 'phone' },
    { type: 'cash_in', amount: 500.00, date: '1 day ago', status: 'Failed', phone: '020-444-5678', icon: 'trending-up' },
  ];
  
  const displayActivities = transactions.length > 0 ? transactions.slice(0, 5) : mockActivities;

  const dateRanges = [
    { label: 'Today', value: 'today', icon: 'today' },
    { label: 'This Week', value: 'week', icon: 'date-range' },
    { label: 'This Month', value: 'month', icon: 'calendar-month' },
    { label: 'Custom', value: 'custom', icon: 'tune' }
  ];

  const handleBack = () => {
    navigation.navigate('Home');
  };

  const handleDownload = () => {
    console.log('Download reports');
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} backgroundColor={theme.surface} />
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Reports & Analytics</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <MaterialIcons name="download" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        {/* Enhanced Date Range Selector */}
        <View style={[styles.dateRangeContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Time Period</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRangeScroll}>
            {dateRanges.map((range) => (
              <TouchableOpacity
                key={range.value}
                style={[
                  styles.dateRangeButton,
                  selectedDateRange === range.label && styles.dateRangeButtonActive
                ]}
                onPress={() => setSelectedDateRange(range.label)}
              >
                <MaterialIcons 
                  name={range.icon} 
                  size={18} 
                  color={selectedDateRange === range.label ? '#fff' : '#6B7280'} 
                  style={styles.dateRangeIcon}
                />
                <Text style={[
                  styles.dateRangeText,
                  selectedDateRange === range.label && styles.dateRangeTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Key Metric Cards */}
        <View style={[styles.metricsContainer, { backgroundColor: theme.background }]}>
          <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="trending-up" size={26} color="#fff" />
            </View>
            <Text style={styles.metricLabel}>{selectedDateRange} Transactions</Text>
            <Text style={styles.metricValue}>{totalCurrentTransactions.toLocaleString()}</Text>
            <Text style={styles.metricChange}>+{metrics.change}% from last period</Text>
          </LinearGradient>
          
          <LinearGradient colors={['#10B981', '#059669']} style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="wallet-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.metricLabel}>Total Commission</Text>
            <Text style={styles.metricValue}>GH₵{commissionEarned.toFixed(2)}</Text>
            <Text style={styles.metricChange}>+{metrics.commissionChange}% this period</Text>
          </LinearGradient>
          
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="analytics-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.metricLabel}>{metrics.label}</Text>
            <Text style={styles.metricValue}>{metrics.average}</Text>
            <Text style={styles.metricChange}>Transactions per day</Text>
          </LinearGradient>
        </View>

        {/* Enhanced Charts Section */}
        <View style={[styles.chartsContainer, { backgroundColor: theme.background }]}>
          {/* Weekly Bar Chart with Animation */}
          <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text }]}>{selectedDateRange} Transaction Distribution</Text>
                <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>{selectedDateRange === 'Today' ? 'Hourly' : selectedDateRange === 'This Month' ? 'Weekly' : 'Daily'} performance with trends</Text>
              </View>
              <View style={styles.chartActions}>
                <TouchableOpacity style={[styles.chartActionButton, { backgroundColor: theme.surface }]}>
                  <Ionicons name="download-outline" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.chartActionButton, { backgroundColor: theme.surface }]}>
                  <Ionicons name="share-outline" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Bar Chart */}
            <View style={[styles.barChartContainer, { backgroundColor: theme.card }]}>
              <View style={[styles.barChartGrid, { backgroundColor: theme.surface }]}>
                {currentData.map((item, index) => {
                  const maxTransactions = Math.max(...currentData.map(d => d.transactions));
                  const barHeightPercent = (item.transactions / maxTransactions) * 100;
                  
                  return (
                    <TouchableOpacity key={item.day} style={styles.barItem}>
                      {/* Value Display */}
                      <View style={styles.valueDisplay}>
                        <Text style={[styles.transactionValue, { color: theme.text }]}>{item.transactions}</Text>
                        <Text style={[styles.trendValue, { 
                          color: item.trend.includes('+') ? theme.success : theme.error 
                        }]}>{item.trend}</Text>
                      </View>
                      
                      {/* Animated Bar */}
                      <View style={[styles.barContainer, { backgroundColor: theme.border }]}>
                        <View style={[styles.animatedBar, {
                          height: `${barHeightPercent}%`,
                          backgroundColor: item.color
                        }]}>
                          {/* Activity Indicators */}
                          <View style={styles.activityIndicator1} />
                          <View style={styles.activityIndicator2} />
                          <View style={styles.activityIndicator3} />
                        </View>
                        
                        {/* Side Pulse Indicator */}
                        <View style={[styles.sideIndicator, { backgroundColor: item.color }]} />
                      </View>
                      
                      {/* Labels */}
                      <View style={styles.barLabels}>
                        <Text style={[styles.dayLabel, { color: theme.text }]}>{item.short}</Text>
                        <Text style={[styles.percentLabel, { color: theme.textSecondary }]}>{item.value}%</Text>
                      </View>
                      

                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Chart Summary */}
              <View style={[styles.chartSummaryCard, { backgroundColor: theme.card }]}>
                <View style={[styles.summaryGradient, { backgroundColor: theme.surface }]}>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryMetric}>
                      <Ionicons name="trending-up" size={20} color="#3B82F6" />
                      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Volume</Text>
                      <Text style={[styles.summaryValue, { color: theme.text }]}>{totalCurrentTransactions.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryMetric}>
                      <Ionicons name="star" size={20} color="#F59E0B" />
                      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Peak {selectedDateRange === 'Today' ? 'Hour' : selectedDateRange === 'This Month' ? 'Week' : 'Day'}</Text>
                      <Text style={[styles.summaryValue, { color: theme.text }]}>{currentData.reduce((max, item) => item.transactions > max.transactions ? item : max).short}</Text>
                    </View>
                    <View style={styles.summaryMetric}>
                      <Ionicons name="analytics" size={20} color="#10B981" />
                      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Growth</Text>
                      <Text style={[styles.summaryValue, { color: theme.success }]}>+{metrics.change}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Enhanced Line Chart */}
          <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.text }]}>Transaction Trends</Text>
                <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>Daily volume comparison</Text>
              </View>
              <View style={[styles.trendIndicator, { backgroundColor: theme.surface }]}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={[styles.trendText, { color: theme.success }]}>+{metrics.change}%</Text>
              </View>
            </View>
            
            <View style={[styles.lineChart, { backgroundColor: theme.surface }]}>
              {currentData.map((item, index) => (
                <View key={item.day} style={styles.linePoint}>
                  <View style={[styles.pointWrapper, { backgroundColor: theme.border }]}>
                    <View style={[styles.point, { backgroundColor: item.color }]} />
                    <View style={[styles.pointLine, { 
                      height: `${(item.transactions / Math.max(...currentData.map(d => d.transactions))) * 100}%`,
                      backgroundColor: item.color + '40'
                    }]} />
                  </View>
                  <Text style={[styles.pointLabel, { color: theme.textSecondary }]}>{item.short}</Text>
                  <Text style={[styles.pointValue, { color: theme.text }]}>{item.transactions}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Enhanced Recent Activity Section */}
        <View style={[styles.activityContainer, { backgroundColor: theme.background }]}>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: theme.text }]}>Recent Activity</Text>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface }]}>
              <Ionicons name="filter" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {displayActivities.map((transaction, index) => {
              const getActivityConfig = (type, status) => {
                const configs = {
                  cash_in: { color: '#10B981', bgColor: '#ECFDF5', icon: 'arrow-down-circle' },
                  cash_out: { color: '#EF4444', bgColor: '#FEF2F2', icon: 'arrow-up-circle' },
                  bill_pay: { color: '#F59E0B', bgColor: '#FFFBEB', icon: 'receipt-outline' },
                  airtime: { color: '#8B5CF6', bgColor: '#F3E8FF', icon: 'phone-portrait-outline' }
                };
                return configs[type] || configs.cash_in;
              };
              
              const config = getActivityConfig(transaction.type, transaction.status);
              const statusColor = transaction.status === 'Completed' ? '#10B981' : 
                                transaction.status === 'Pending' ? '#F59E0B' : '#EF4444';
              
              return (
                <TouchableOpacity key={index} style={[styles.activityItem, { backgroundColor: theme.card }]}>
                  <View style={[styles.activityIconContainer, { backgroundColor: config.bgColor }]}>
                    <Ionicons name={config.icon} size={24} color={config.color} />
                  </View>
                  
                  <View style={styles.activityContent}>
                    <View style={styles.activityMainInfo}>
                      <Text style={[styles.activityType, { color: theme.text }]}>
                        {transaction.type === 'cash_in' ? 'Cash In' : 
                         transaction.type === 'cash_out' ? 'Cash Out' : 
                         transaction.type === 'bill_pay' ? 'Bill Payment' : 'Airtime Purchase'}
                      </Text>
                      <Text style={[styles.activitySubInfo, { color: theme.textSecondary }]}>
                        {transaction.phone || transaction.reference || 'N/A'}
                      </Text>
                    </View>
                    
                    <View style={styles.activityMeta}>
                      <Text style={[styles.activityDate, { color: theme.textSecondary }]}>{transaction.date}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.activityAmount}>
                    <Text style={[styles.amountText, { color: config.color }]}>
                      {transaction.type === 'cash_in' ? '+' : '-'}GH₵{Number(transaction.amount).toFixed(2)}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity style={[styles.viewAllButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>View All Transactions</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: spacing.md,
  },
  dateRangeContainer: {
    backgroundColor: colors.backgroundLight,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateRangeScroll: {
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateRangeButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  dateRangeIcon: {
    marginRight: 8,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateRangeTextActive: {
    color: '#ffffff',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  chartsContainer: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartMenuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
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
  // Enhanced Bar Chart Styles
  chartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chartActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barChartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
  },
  barChartGrid: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 180,
    marginBottom: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  barItem: {
    alignItems: 'center',
    width: 40,
  },
  valueDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    minHeight: 35,
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'center',
  },
  trendValue: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  barContainer: {
    height: 120,
    width: 30,
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'visible',
  },
  animatedBar: {
    width: '100%',
    borderRadius: 15,
    position: 'relative',
    minHeight: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  activityIndicator1: {
    position: 'absolute',
    top: 8,
    right: 6,
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  activityIndicator2: {
    position: 'absolute',
    top: '50%',
    right: 6,
    marginTop: -3,
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  activityIndicator3: {
    position: 'absolute',
    bottom: 8,
    right: 6,
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  sideIndicator: {
    position: 'absolute',
    right: -4,
    top: '25%',
    width: 3,
    height: '50%',
    borderRadius: 2,
    opacity: 0.7,
  },
  barLabels: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'center',
  },
  percentLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  commissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commissionAmount: {
    fontSize: 10,
    fontWeight: '700',
  },
  chartSummaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryMetric: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  
  // Enhanced Line Chart Styles
  lineChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  linePoint: {
    alignItems: 'center',
    flex: 1,
  },
  pointWrapper: {
    height: 120,
    width: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  pointLine: {
    width: '100%',
    borderRadius: 3,
    minHeight: 4,
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pointLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 12,
  },
  pointValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    marginTop: 4,
  },
  // Enhanced Activity Styles
  activityContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityMainInfo: {
    marginBottom: 8,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activitySubInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activityAmount: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
