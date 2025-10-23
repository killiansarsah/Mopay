import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const faqs = [
  {
    q: 'How do I reset my PIN?',
    a: "You can reset your PIN through the 'Profile' section of the app. Look for the 'Security' settings and follow the instructions to set a new PIN.",
  },
  {
    q: 'What are the transaction limits?',
    a: "Transaction limits vary based on your agent level. You can find detailed information about your specific limits in the 'Account Limits' section under 'Profile'.",
  },
  {
    q: 'How to handle a failed transaction?',
    a: "If a transaction fails, first check your transaction history for the status. If the funds have been debited but not received, please contact our support team with the transaction ID.",
  },
];

export default function SupportScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(-1);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7f8' }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarIcon} onPress={() => navigation?.goBack?.()}>
          <MaterialIcons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Help & Support</Text>
        <View style={styles.topBarIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchIconWrap}>
            <MaterialIcons name="search" size={24} color="#9ca3af" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs and articles"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Contact Options */}
        <View style={styles.cardsWrap}>
          {/* Live Chat */}
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Live Chat with an Expert <View style={styles.dot} /></Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={styles.dot} />
                <Text style={styles.cardDesc}>Get instant help from our team</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Start Chat</Text>
              <MaterialIcons name="chat-bubble" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Call Support */}
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Call Support</Text>
              <Text style={styles.cardDesc}>Speak to a support agent</Text>
            </View>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Call Now</Text>
              <MaterialIcons name="phone" size={20} color="#222" />
            </TouchableOpacity>
          </View>
          {/* Email Us */}
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Email Us</Text>
              <Text style={styles.cardDesc}>We'll get back to you within 24 hours</Text>
            </View>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Send Email</Text>
              <MaterialIcons name="mail" size={20} color="#222" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={{ paddingHorizontal: 4, marginTop: 12 }}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, i) => (
            <View key={i} style={styles.faqCard}>
              <TouchableOpacity style={styles.faqSummary} onPress={() => setOpen(open === i ? -1 : i)}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <MaterialIcons
                  name="expand-more"
                  size={24}
                  color="#9ca3af"
                  style={{ transform: [{ rotate: open === i ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
              {open === i && (
                <View style={styles.faqAWrap}>
                  <Text style={styles.faqA}>{faq.a}</Text>
                  <View style={styles.faqFeedbackRow}>
                    <Text style={styles.faqFeedbackText}>Was this helpful?</Text>
                    <TouchableOpacity style={styles.faqFeedbackBtn}><MaterialIcons name="thumb-up" size={18} color="#22c55e" /></TouchableOpacity>
                    <TouchableOpacity style={styles.faqFeedbackBtn}><MaterialIcons name="thumb-down" size={18} color="#ef4444" /></TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Knowledge Base Button */}
        <TouchableOpacity style={styles.kbBtn}>
          <Text style={styles.kbBtnText}>Explore our Knowledge Base</Text>
          <MaterialIcons name="menu-book" size={22} color="#068cf9" />
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="question-answer" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  topBarIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#222',
    paddingRight: 40,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    height: 48,
  },
  searchIconWrap: {
    backgroundColor: '#f3f4f6',
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#222',
    fontSize: 16,
    paddingLeft: 8,
    height: 48,
  },
  cardsWrap: {
    gap: 12,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    gap: 12,
  },
  cardTitle: {
    color: '#222',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  cardDesc: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginLeft: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#068cf9',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    gap: 6,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    gap: 6,
  },
  secondaryBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
  },
  faqTitle: {
    color: '#222',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 8,
    marginLeft: 4,
  },
  faqCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQ: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
  },
  faqAWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  faqA: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 0,
  },
  faqFeedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  faqFeedbackText: {
    color: '#6b7280',
    fontSize: 13,
    marginRight: 4,
  },
  faqFeedbackBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  kbBtnText: {
    color: '#068cf9',
    fontWeight: '700',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f59e42',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
