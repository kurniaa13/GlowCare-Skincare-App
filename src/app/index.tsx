import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { HeaderBanner } from '../../components/HeaderBanner';
import { ProductList } from '../../components/ProductList';
import { styles } from '../../constants/styles';
import { skincareData } from '../../types';

export default function Index() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <HeaderBanner />
      <ProductList products={skincareData} />

      <StatusBar style="dark" />
    </ScrollView>
  );
}
