import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  Animated,
  Easing,
  ImageBackground,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const COLORS = {
  bg: '#0E0C0A',
  surface: 'rgba(255,255,255,0.9)',
  accent: '#DAA36E',
  text: '#1C1C1E',
  muted: '#7C818C',
  border: '#E5E2DD',
  success: '#22C55E',
  danger: '#EF4444',
};

const GRADIENTS = {
  main: ['#2C1F15', '#1B1512'],
  button: ['#DAA36E', '#C58B54'],
  secondary: ['#FFE0B2', '#E6B77F'],
};

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2400&auto=format&fit=crop';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [randomItem, setRandomItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('none');
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode]);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const fetchFullMenu = async () => {
    setLoading(true);
    setError('');
    setMode('list');
    try {
      const res = await fetch(`${BASE_URL}/menu`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error');
      setMenuItems(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandom = async () => {
    setLoading(true);
    setError('');
    setMode('random');
    try {
      const res = await fetch(`${BASE_URL}/menu/random`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Error');
      setRandomItem(json.data);
      setShowRandomModal(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (mode === 'list') await fetchFullMenu();
    else if (mode === 'random') await fetchRandom();
    setRefreshing(false);
  };

  const categoryStyle = (category = '') => {
    const key = category.toLowerCase();
    if (key.includes('hot')) return { icon: '☕', color: '#C4904F' };
    if (key.includes('cold')) return { icon: '🧊', color: '#0EA5E9' };
    if (key.includes('pastr')) return { icon: '🥐', color: '#F97316' };
    return { icon: '🍽️', color: COLORS.accent };
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const theme = categoryStyle(item.category);
    const isExpanded = expandedId === (item._id || item.name);
    return (
      <Pressable onPress={() => toggleExpand(item._id || item.name)}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
              borderLeftColor: theme.color,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 22 }}>{theme.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <LinearGradient
              colors={GRADIENTS.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.priceTag}
            >
              <Text style={styles.priceText}>Rs. {Number(item.price).toFixed(2)}</Text>
            </LinearGradient>
          </View>

          {isExpanded && (
            <View style={styles.cardExpanded}>
              <Text
                style={[
                  styles.stockText,
                  { color: item.inStock ? COLORS.success : COLORS.danger },
                ]}
              >
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
              <View style={styles.actionRow}>
                <LinearGradient
                  colors={GRADIENTS.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionText}>Add to Cart</Text>
                </LinearGradient>
                <Pressable style={styles.actionOutline}>
                  <Text style={[styles.actionTextOutline, { color: theme.color }]}>
                    Details
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: BG_IMAGE_URL }}
        resizeMode="cover"
        style={styles.bg}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />

        <BlurView intensity={80} tint="dark" style={styles.header}>
          <Text style={styles.title}>Coffee Club</Text>
          <Text style={styles.subtitle}>Brewed fresh. Curated for you.</Text>

          <View style={styles.buttonRow}>
            <LinearGradient
              colors={GRADIENTS.button}
              style={styles.modernButton}
            >
              <Pressable onPress={fetchFullMenu}>
                <Text style={styles.buttonText}>Full Menu</Text>
              </Pressable>
            </LinearGradient>

            <LinearGradient
              colors={GRADIENTS.secondary}
              style={styles.modernButton}
            >
              <Pressable onPress={fetchRandom}>
                <Text style={styles.buttonText}>Surprise Me ✨</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </BlurView>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        )}

        {!!error && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
            <Text style={styles.hint}>Check if your server is running at {BASE_URL}</Text>
          </View>
        )}

        {!loading && !error && mode === 'list' && (
          <Animated.FlatList
            data={menuItems}
            keyExtractor={(item) => item._id || item.name}
            renderItem={renderItem}
            contentContainerStyle={menuItems.length ? { padding: 16 } : styles.center}
            ListEmptyComponent={<Text style={styles.muted}>No items found.</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        <Modal
          visible={showRandomModal && !!randomItem}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRandomModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <Animated.View
              style={[
                styles.modalCard,
                { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>Your Surprise ☕</Text>
              <Text style={styles.modalItem}>{randomItem?.name}</Text>
              <Text style={styles.modalMeta}>{randomItem?.category}</Text>
              <Text style={styles.modalPrice}>
                Rs. {Number(randomItem?.price).toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.stockText,
                  { color: randomItem?.inStock ? COLORS.success : COLORS.danger },
                ]}
              >
                {randomItem?.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>

              <Pressable
                style={[styles.modernButton, { marginTop: 16 }]}
                onPress={() => setShowRandomModal(false)}
              >
                <Text style={styles.buttonText}>Nice!</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>

        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#E6E0D9',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 6,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modernButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  itemCategory: { color: COLORS.muted, fontSize: 13 },
  priceTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  priceText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cardExpanded: { marginTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  stockText: { fontWeight: '600', textAlign: 'left', marginBottom: 8 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  actionOutline: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  actionText: { color: '#fff', fontWeight: '700' },
  actionTextOutline: { fontWeight: '700' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  error: { color: COLORS.danger, fontWeight: '700', marginBottom: 6 },
  hint: { color: COLORS.muted, fontSize: 12 },
  muted: { color: COLORS.muted },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalItem: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  modalMeta: { textAlign: 'center', color: COLORS.muted, marginBottom: 4 },
  modalPrice: { textAlign: 'center', fontWeight: '700', fontSize: 16, marginBottom: 4 },
});
