import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Scan Product' }} />
        <Stack.Screen name="product/[barcode]" options={{ title: 'Product Result' }} />
      </Stack>
    </>
  );
}
