import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const mockListings = [
  {
    id: '1',
    title: 'Cheap Data Bundles',
    description: "It's affiliate data bundles, refer and earn commission directly to your withdrawal wallet.",
    category: 'data_bundles',
    price: 9.00,
    vendor: 'MTN Data Hub',
    vendorRating: 4.8,
    verified: true,
    featured: true,
    commission: 0.50
  },
  {
    id: '2',
    title: 'A1 Shop - SIM Cards',
    description: 'Get the best SIM cards with amazing deals. Registered and verified seller.',
    category: 'sim_cards',
    price: 5.00,
    vendor: 'A1 Shop',
    vendorRating: 4.9,
    verified: true,
    featured: true
  },
  {
    id: '3',
    title: 'Results Checker Service',
    description: 'Check your exam results instantly with our fast and reliable service.',
    category: 'services',
    price: 2.00,
    vendor: 'EduCheck GH',
    vendorRating: 4.7,
    verified: true,
    featured: false
  }
];

const categories = [
  { id: 'all', label: 'All', emoji: '🏪' },
  { id: 'data_bundles', label: 'Data', emoji: '📱' },
  { id: 'sim_cards', label: 'SIM Cards', emoji: '📞' },
  { id: 'phones', label: 'Phones', emoji: '📲' },
  { id: 'accessories', label: 'Accessories', emoji: '🎧' },
  { id: 'services', label: 'Services', emoji: '⚙️' }
];

const dataBundles = [
  { size: '1GB', price: 9.00, validity: '7 days' },
  { size: '2GB', price: 15.00, validity: '7 days' },
  { size: '3GB', price: 18.00, validity: '14 days' },
  { size: '5GB', price: 30.00, validity: '30 days' }
];

export default function MarketplaceScreen() {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [postListingOpen, setPostListingOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const ListingCard = ({ listing }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => {
        setSelectedListing(listing);
        setDetailsOpen(true);
      }}
    >
      {listing.featured && (
        <View style={styles.featuredBadge}>
          <MaterialIcons name="star" size={12} color="#FFF" />
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
      )}
      
      <Text style={[styles.cardTitle, { color: theme.text }]}>{listing.title}</Text>
      
      <View style={styles.badgeRow}>
        <View style={[styles.categoryBadge, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.badgeText}>{categories.find(c => c.id === listing.category)?.label}</Text>
        </View>
        {listing.verified && (
          <View style={[styles.verifiedBadge, { backgroundColor: '#10B981' }]}>
            <MaterialIcons name="verified" size={12} color="#FFF" />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        )}
      </View>

      <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
        {listing.description}
      </Text>

      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.vendorLabel, { color: theme.textSecondary }]}>Provider</Text>
          <View style={styles.vendorRow}>
            <Text style={[styles.vendorName, { color: theme.text }]}>{listing.vendor}</Text>
            <View style={styles.rating}>
              <MaterialIcons name="star" size={14} color="#FFC107" />
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{listing.vendorRating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Price</Text>
          <Text style={[styles.price, { color: '#3B82F6' }]}>GHS {listing.price.toFixed(2)}</Text>
        </View>
      </View>

      {listing.commission && (
        <View style={styles.commissionBanner}>
          <MaterialIcons name="trending-up" size={16} color="#10B981" />
          <Text style={styles.commissionText}>Earn GHS {listing.commission.toFixed(2)} commission per referral</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const CategoryTab = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
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
  );



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
            style={styles.searchInput}
            placeholder="Search listings..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryTab category={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredListings.length} listings found
        </Text>
        
        {filteredListings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setPostListingOpen(true)}
      >
        <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.fabGradient}>
          <MaterialIcons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Details Modal */}
      <Modal visible={detailsOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedListing?.title}</Text>
            <TouchableOpacity onPress={() => setDetailsOpen(false)}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedListing?.category === 'data_bundles' && (
              <View style={styles.bundlesGrid}>
                {dataBundles.map((bundle) => (
                  <TouchableOpacity
                    key={bundle.size}
                    style={[
                      styles.bundleCard,
                      { backgroundColor: theme.card },
                      selectedBundle === bundle.size && { backgroundColor: '#3B82F6' }
                    ]}
                    onPress={() => setSelectedBundle(bundle.size)}
                  >
                    <Text style={[styles.bundleSize, { color: theme.text }]}>{bundle.size}</Text>
                    <Text style={[styles.bundlePrice, { color: theme.text }]}>GHS {bundle.price}</Text>
                    <Text style={[styles.bundleValidity, { color: theme.textSecondary }]}>{bundle.validity}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.purchaseButton}
              onPress={() => {
                Alert.alert('Success', 'Purchase completed!');
                setDetailsOpen(false);
              }}
            >
              <Text style={styles.purchaseButtonText}>
                {selectedBundle ? `Purchase ${selectedBundle}` : 'Purchase'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
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
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
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
  content: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  vendorLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
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
    gap: 8,
  },
  commissionText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  bundlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  bundleCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bundleSize: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bundlePrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bundleValidity: {
    fontSize: 12,
  },
  purchaseButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});