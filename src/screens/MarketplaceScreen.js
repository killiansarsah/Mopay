import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const mockListings = [
  {
    id: 'listing-001',
    title: 'Cheap Data Bundles',
    description: "It's affiliate data bundles, refer someone and earn commission directly to your withdrawal wallet when registered.",
    category: 'bundles',
    price: 4.50,
    vendor: 'fredooaXXXX',
    rating: 4.0,
    reviews: 2,
    views: 369,
    date: '11-Oct-2025',
    priceList: '1GB = 4.50gh, 2GB = 9.00gh, 3GB = 11.00gh, 4GB = 18.00gh, 5GB = 21.00gh'
  },
  {
    id: 'listing-002',
    title: 'AFA REGISTRATION AVAILABLE @2GHC',
    description: 'AFA REGISTRATION AVAILABLE @2GHC. CALL 0544080650. 5GB PLUS 80CALL MINUTES(VALID FOR 2DAYS) AVAILABLE @9GHC NOTE DELIVERY IS INSTANT NO DELAY',
    category: 'afa_bundle',
    price: 2.0,
    vendor: 'addgab544@gmail.com',
    rating: 3.3,
    reviews: 2,
    views: 190,
    date: '30-Jan-2025',
    contact: '0544080650'
  },
  {
    id: 'listing-003',
    title: 'AFA bundle registration available',
    description: 'AFA BUNDLE registration and data packages available with affordable prices.',
    category: 'afa_bundle',
    price: 4.0,
    vendor: 'mongojoXXXX',
    rating: 3.9,
    reviews: 4,
    views: 425,
    date: '29-May-2025'
  },
  {
    id: 'listing-004',
    title: 'BUY YOUR AFFORDABLE DATA OF ALL NETWORK FROM US AND AFA REGISTRATION AVAILABLE',
    description: 'FAST DELIVERY 🚚 - Get affordable data bundles for all networks with AFA registration services.',
    category: 'bundles',
    price: 4.0,
    vendor: 'amataimXXXX',
    rating: 4.2,
    reviews: 8,
    views: 312,
    date: '02-Apr-2025'
  },
  {
    id: 'listing-005',
    title: 'Data Bundle Packages',
    description: 'Dstv subscription is available with low prices as well on the site. 5GB = 21.00gh, 6GB = 25.00gh, 8GB = 35.00gh, 10GB = 40.00gh',
    category: 'bundles',
    price: 21.00,
    vendor: 'bestdatagh.co',
    rating: 4.0,
    reviews: 2,
    views: 369,
    date: '15-Oct-2025'
  }
];

const categories = [
  { id: 'all', label: 'All', emoji: '🏪' },
  { id: 'shop', label: 'Shop', emoji: '🛒' },
  { id: 'sim', label: 'SIM', emoji: '📞' },
  { id: 'phone', label: 'Phone', emoji: '📱' },
  { id: 'result_checker', label: 'Result Checker', emoji: '📋' },
  { id: 'afa_bundle', label: 'AFA Bundle', emoji: '📦' },
  { id: 'bundles', label: 'Bundles', emoji: '🎁' }
];

export default function MarketplaceScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const formatCurrency = (amount) => `GHS ${amount.toFixed(2)}`;

  const getCategoryColor = (category) => {
    const colors = {
      shop: '#3B82F6',
      sim: '#10B981',
      phone: '#8B5CF6',
      result_checker: '#F59E0B',
      afa_bundle: '#EF4444',
      bundles: '#06B6D4'
    };
    return colors[category] || '#6B7280';
  };

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const ListingCard = ({ listing }) => (
    <TouchableOpacity 
      style={[styles.listingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => Alert.alert('Listing Details', `${listing.title}\n\nPrice: ${formatCurrency(listing.price)}\nProvider: ${listing.vendor}\nDate: ${listing.date}`)}
    >
      <Text style={[styles.listingTitle, { color: theme.text }]}>{listing.title}</Text>
      
      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: '#4CAF50' }]}>Price: {formatCurrency(listing.price)}</Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>Date: {listing.date}</Text>
      </View>
      
      <Text style={[styles.providerText, { color: theme.textSecondary }]}>Provider: {listing.vendor}</Text>
      
      {listing.category === 'bundles' && (
        <Text style={[styles.categoryLabel, { color: theme.text }]}>{listing.category.toUpperCase()}</Text>
      )}
      
      <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={3}>{listing.description}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{listing.rating}/5</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{listing.reviews}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Views</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{listing.views}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>MARKET</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="notifications" size={22} color={theme.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="person" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialIcons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search listings..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton, 
                { backgroundColor: theme.card },
                activeCategory === category.id && { backgroundColor: '#3B82F6' }
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={[
                styles.categoryLabel, 
                { color: theme.textSecondary },
                activeCategory === category.id && { color: '#FFF' }
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      <ScrollView style={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.marketInfo}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>Your telecom service provider is always the best and safest choice for help with SIM and other service-related needs. For other needs, use the ratings and reviews here to find a trustworthy provider.</Text>
        </View>
        
        {sortedListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>No listings found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          sortedListings.map(listing => <ListingCard key={listing.id} listing={listing} />)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => Alert.alert('Post Listing', 'Create a new listing')}
      >
        <MaterialIcons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  listingsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 14,
    marginVertical: 16,
  },
  marketInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  listingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  providerText: {
    fontSize: 12,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  providerLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: '500',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  commissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  commissionText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  dateText: {
    fontSize: 12,
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});