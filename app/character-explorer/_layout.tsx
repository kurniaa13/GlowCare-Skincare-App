import { Stack } from 'expo-router';

export default function CharacterExplorerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F8E8EF',
        },
        headerTintColor: '#333333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Top Karakter' }}
      />
      <Stack.Screen
        name="search"
        options={{ title: 'Cari Karakter' }}
      />
      <Stack.Screen
        name="favorites"
        options={{ title: 'Karakter Favorit' }}
      />
      <Stack.Screen
        name="character/[id]"
        options={{ title: 'Detail Karakter' }}
      />
    </Stack>
  );
}