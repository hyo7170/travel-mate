import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ExchangRate from '../api/ExchangRate';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ExchangRate/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1, // Expand the ScrollView to fill the available space
  },
});

export default App;
