import { createContext, useContext, useState } from 'react';
import { View, Text, Button } from 'react-native';

// Codelab-1 Modul 2: useContext (Dark Mode)
// <any> mengikuti soal codelab; value berisi { darkMode, setDarkMode }.
const ThemeContext = createContext<any>(null);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Home />
    </ThemeContext.Provider>
  );
}

// Home -> Profile -> UserCard -> UserName tidak meneruskan props sama sekali (tanpa prop drilling).
function Home() {
  return <Profile />;
}
function Profile() {
  return <UserCard />;
}
function UserCard() {
  return <UserName />;
}

function UserName() {
  const theme = useContext(ThemeContext);
  const darkMode = theme.darkMode;
  const setDarkMode = theme.setDarkMode;

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? 'black' : 'white' }}>
      <Text style={{ color: darkMode ? 'white' : 'black' }}>
        {darkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Button title="Toggle Theme" onPress={() => setDarkMode(!darkMode)} />
    </View>
  );
}
