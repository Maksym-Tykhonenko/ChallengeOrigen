import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useStore} from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import QuizAlert from '../../components/ui/QuizAlert';
import Layout from '../../components/layout/Layout';

const {width} = Dimensions.get('window');
const SPINNER_SIZE = width * 0.8;

const TabSpinnerQuiz = ({navigation}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const {getQuizByType} = useStore();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizOptions = [
    {name: 'History\nQuiz', type: 'HISTORY', colors: ['#FF512F', '#DD2476']},
    {name: 'Sport\nQuiz', type: 'SPORT', colors: ['#4776E6', '#8E54E9']},
    {name: 'Capitals\nQuiz', type: 'CAPITALS', colors: ['#00b09b', '#96c93d']},
    {name: 'Film\nQuiz', type: 'FILM', colors: ['#f12711', '#f5af19']},
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const rotations = Math.floor(Math.random() * 3) + 3;
    const extraDegrees = Math.floor(Math.random() * 4) * 90 + 45;
    const finalRotation = rotations * 360 + extraDegrees;

    const selectedIndex = (3 - Math.floor((extraDegrees - 45) / 90)) % 4;

    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: finalRotation - 100,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: finalRotation,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSpinning(false);
      setSelectedQuiz(quizOptions[selectedIndex]);
      setShowAlert(true);
    });
  };

  const handleStartQuiz = () => {
    setShowAlert(false);
    navigation.navigate('StackQuizScreen', {
      quizType: selectedQuiz.type,
      quizName: selectedQuiz.name.replace('\n', ' '),
    });
  };

  const handleSpinAgain = () => {
    setShowAlert(false);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Layout styles={styles.container}>
      {/* <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}> */}
        <View style={styles.spinnerContainer}>
          <Animated.View
            style={[styles.spinner, {transform: [{rotate: spin}]}]}>
            {quizOptions.map((quiz, index) => (
              <LinearGradient
                key={index}
                colors={quiz.colors}
                style={[
                  styles.spinnerQuarter,
                  {transform: [{rotate: `${index * 90}deg`}]},
                ]}>
                <Text
                  style={[styles.quarterText, {transform: [{rotate: '45deg'}]}]}
                  numberOfLines={2}
                  adjustsFontSizeToFit>
                  {quiz.name}
                </Text>
              </LinearGradient>
            ))}
          </Animated.View>
          <View style={styles.centerPoint} />
          <View style={styles.pointerContainer}>
            <View style={styles.pointer} />
          </View>
        </View>

        <TouchableOpacity
          onPress={spinWheel}
          disabled={isSpinning}
          style={styles.spinButton}>
          <LinearGradient
            colors={isSpinning ? ['#666', '#999'] : ['#00b09b', '#96c93d']}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <QuizAlert
          visible={showAlert}
          quizName={selectedQuiz?.name.replace('\n', ' ')}
          onStartQuiz={handleStartQuiz}
          onSpinAgain={handleSpinAgain}
          onClose={() => setShowAlert(false)}
        />
      {/* </LinearGradient> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  spinner: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinnerQuarter: {
    position: 'absolute',
    width: SPINNER_SIZE / 2,
    height: SPINNER_SIZE / 2,
    left: SPINNER_SIZE / 2,
    transformOrigin: '0% 100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quarterText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 22,
    width: SPINNER_SIZE / 3,
    textAlign: 'center',
    position: 'absolute',
    left: -SPINNER_SIZE / 120,
    top: SPINNER_SIZE / 6,
  },
  centerPoint: {
    width: 22,
    height: 22,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    position: 'absolute',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointerContainer: {
    position: 'absolute',
    top: -20,
    width: 20,
    height: 40,
    alignItems: 'center',
    zIndex: 2,
  },
  pointer: {
    width: 20,
    height: 40,
    backgroundColor: '#FF4444',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6666',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinButton: {
    alignSelf: 'center',
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TabSpinnerQuiz;
