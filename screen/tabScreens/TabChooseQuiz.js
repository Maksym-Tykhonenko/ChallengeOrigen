import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const TabChooseQuiz = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('StackChallengeChoose')}>
        <Text>TabChooseQuiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabChooseQuiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
