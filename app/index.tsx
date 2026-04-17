import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useScanStore } from '@/store/useScanStore';
import type { ScanProductResponse } from '@/types/product';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const setProduct = useScanStore((state) => state.setProduct);

  const hasPermission = useMemo(() => permission?.granted ?? false, [permission]);

  const onBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (!data || isProcessing) {
        return;
      }

      setIsProcessing(true);
      setScanError(null);

      const { data: response, error } = await supabase.functions.invoke<ScanProductResponse>(
        'scan-product',
        {
          body: { barcode: data },
        },
      );

      if (error || !response) {
        setScanError(error?.message ?? 'Unable to fetch product details.');
        setIsProcessing(false);
        return;
      }

      const product = {
        ...response.product,
        barcode: response.product?.barcode ?? data,
        clean_score: response.clean_score ?? response.product?.clean_score,
        health: response.health ?? response.product?.health,
        sources: response.sources ?? response.product?.sources,
      };

      setProduct(product);
      router.push({ pathname: '/product/[barcode]', params: { barcode: product.barcode } });
      setIsProcessing(false);
    },
    [isProcessing, setProduct],
  );

  if (!permission) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.title}>Camera access is required</Text>
        <Text style={styles.subtitle}>
          Please allow camera permission to scan EAN13 and UPC product barcodes.
        </Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Camera Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'upc_a'] }}
          onBarcodeScanned={onBarcodeScanned}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.overlayText}>Align barcode inside frame</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.processingText}>Analyzing product...</Text>
          </View>
        ) : (
          <Text style={styles.footerText}>Try test barcode: 3017620422003</Text>
        )}

        {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    margin: 16,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  scanFrame: {
    width: '75%',
    height: 180,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  overlayText: {
    marginTop: 20,
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  footerText: {
    color: '#334155',
    textAlign: 'center',
  },
  processingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  processingText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
