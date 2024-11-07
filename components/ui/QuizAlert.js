import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const QuizAlert = ({ visible, quizName, onStartQuiz, onSpinAgain, onClose }) => {
    return (
        <Modal
          transparent
          visible={visible}
          animationType="fade"
          onRequestClose={onClose}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#2c3e50', '#3498db']}
              style={styles.alertContainer}
            >
              <Text style={styles.title}>Quiz Selected!</Text>
              <Text style={styles.quizName}>{quizName}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onStartQuiz} style={styles.buttonWrapper}>
                  <LinearGradient
                    colors={['#00b09b', '#96c93d']}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>START QUIZ</Text>
                  </LinearGradient>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={onSpinAgain} style={styles.buttonWrapper}>
                  <LinearGradient
                    colors={['#FF512F', '#DD2476']}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>SPIN AGAIN</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      );
}

export default QuizAlert

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertContainer: {
      width: width * 0.8,
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
    quizName: {
      fontSize: 20,
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      gap: 10,
    },
    buttonWrapper: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
    },button: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    });