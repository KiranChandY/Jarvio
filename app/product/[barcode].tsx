import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useScanStore } from '@/store/useScanStore';
import type { HealthCondition, ProductData, ScanProductResponse } from '@/types/product';

const STATUS_META: Record<
  string,
  {
    label: string;
    icon: string;
    backgroundColor: string;
    textColor: string;
  }
> = {
  good: {
    label: 'Good',
    icon: '✅',
    backgroundColor: '#dcfce7',
    textColor: '#166534',
  },
  caution: {
    label: 'Caution',
    icon: '⚠️',
    backgroundColor: '#fef9c3',
    textColor: '#854d0e',
  },
  avoid: {
    label: 'Avoid',
    icon: '❌',
    backgroundColor: '#fee2e2',
    textColor: '#991b1b',
  },
};

export default function ProductScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const getProduct = useScanStore((state) => state.getProduct);
  const setProduct = useScanStore((state) => state.setProduct);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteProduct, setRemoteProduct] = useState<ProductData | null>(null);

  const product = useMemo(() => {
    if (!barcode) {
      return null;
    }

    return getProduct(barcode) ?? remoteProduct;
  }, [barcode, getProduct, remoteProduct]);

  const fetchProduct = useCallback(async () => {
    if (!barcode || product) {
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: functionError } = await supabase.functions.invoke<ScanProductResponse>(
      'scan-product',
      {
        body: { barcode },
      },
    );

    if (functionError || !data?.product) {
      setError(functionError?.message ?? 'Could not load product details.');
      setLoading(false);
      return;
    }

    const mergedProduct: ProductData = {
      ...data.product,
      barcode,
      clean_score: data.clean_score ?? data.product.clean_score,
      health: data.health ?? data.product.health,
      sources: data.sources ?? data.product.sources,
    };

    setProduct(mergedProduct);
    setRemoteProduct(mergedProduct);
    setLoading(false);
  }, [barcode, product, setProduct]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  const cleanScore = product?.clean_score ?? 0;
  const conditions = product?.health ?? [];

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to load product</Text>
        <Text style={styles.errorBody}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>No data found for barcode</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={product.image_url || 'https://placehold.co/512x512?text=No+Image'}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
          />

          <Text style={styles.productName}>{product.name ?? 'Unknown product'}</Text>
          <Text style={styles.brandName}>{product.brand ?? 'Unknown brand'}</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Clean Score</Text>
            <Text style={styles.scoreValue}>{Math.max(0, Math.min(cleanScore, 100))}</Text>
            <Text style={styles.scoreSubLabel}>out of 100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Conditions</Text>

          {conditions.length === 0 ? (
            <Text style={styles.emptyText}>No condition-specific guidance available.</Text>
          ) : (
            conditions.map((condition, index) => (
              <ConditionRow
                key={`${condition.condition}-${index}`}
                condition={condition}
                expanded={!!expanded[condition.condition]}
                onToggle={() =>
                  setExpanded((state) => ({
                    ...state,
                    [condition.condition]: !state[condition.condition],
                  }))
                }
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources</Text>
          {(product.sources ?? []).length === 0 ? (
            <Text style={styles.emptyText}>No sources provided.</Text>
          ) : (
            product.sources?.map((source, index) => (
              <Pressable
                key={`${source.url}-${index}`}
                style={styles.sourceLink}
                onPress={() => void Linking.openURL(source.url)}
              >
                <Text style={styles.sourceTitle}>{source.title || source.url}</Text>
                <Text style={styles.sourceUrl}>{source.url}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ConditionRow({
  condition,
  expanded,
  onToggle,
}: {
  condition: HealthCondition;
  expanded: boolean;
  onToggle: () => void;
}) {
  const status = STATUS_META[condition.status] ?? STATUS_META.caution;

  return (
    <View style={styles.conditionCard}>
      <View style={styles.conditionHeader}>
        <Text style={styles.conditionName}>{condition.condition}</Text>
        <View style={[styles.badge, { backgroundColor: status.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: status.textColor }]}>
            {status.icon} {status.label}
          </Text>
        </View>
      </View>

      {condition.details ? <Text style={styles.conditionDetails}>{condition.details}</Text> : null}

      {(condition.flagged_ingredients ?? []).length > 0 ? (
        <>
          <Pressable onPress={onToggle} style={styles.expandButton}>
            <Text style={styles.expandButtonText}>
              {expanded ? 'Hide flagged ingredients' : 'Show flagged ingredients'}
            </Text>
          </Pressable>

          {expanded ? (
            <View style={styles.ingredientList}>
              {condition.flagged_ingredients?.map((ingredient, index) => (
                <Text key={`${ingredient}-${index}`} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  productImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  brandName: {
    color: '#475569',
    fontSize: 15,
  },
  scoreContainer: {
    marginTop: 6,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#475569',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 54,
  },
  scoreSubLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyText: {
    color: '#64748b',
  },
  conditionCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  conditionName: {
    flex: 1,
    fontWeight: '600',
    color: '#0f172a',
    fontSize: 15,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  conditionDetails: {
    color: '#334155',
    fontSize: 13,
  },
  expandButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  expandButtonText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  ingredientList: {
    gap: 4,
  },
  ingredientItem: {
    color: '#334155',
    fontSize: 13,
  },
  sourceLink: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#eff6ff',
    gap: 3,
  },
  sourceTitle: {
    color: '#1e40af',
    fontWeight: '600',
  },
  sourceUrl: {
    color: '#1d4ed8',
    fontSize: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  errorBody: {
    marginTop: 8,
    color: '#b91c1c',
    textAlign: 'center',
  },
});
