import type { ComponentProps } from 'react';
import type { Stack } from 'expo-router';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

// Tampilan header Stack dipakai bersama oleh root layout dan nested layout (docs).
export const stackScreenOptions: StackScreenOptions = {
  headerStyle: { backgroundColor: '#FFF1F2' },
  headerTintColor: '#881337',
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: '#FFF1F2' },
};
