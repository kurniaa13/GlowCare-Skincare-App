import { Stack } from 'expo-router';
import { stackScreenOptions } from '@/styles';

// Codelab-1 Modul 3 (Character Explorer): nested Stack, struktur mengikuti modul.
export default function AnimeHunterLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Character Explorer' }} />
      <Stack.Screen name="search" options={{ title: 'Search Character' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Stack.Screen name="character/[id]" options={{ title: 'Character Detail' }} />
    </Stack>
  );
}
