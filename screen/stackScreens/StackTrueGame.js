import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import Layout from '../../components/layout/Layout';

const AnswerButton = ({ onPress, text, disabled, isSelected, isCorrect, showAnswer }) => {
  let colors = ['#FF512F', '#DD2476'];
  let icon = null;
  
  if (showAnswer) {
    if (isCorrect) {
      colors = ['#00b09b', '#96c93d'];
      icon = 'check-circle';
    } else {
      colors = ['#FF512F', '#DD2476'];
      icon = 'close-circle';
    }
  } else if (isSelected) {
    colors = ['#f12711', '#f5af19'];
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={styles.answerButtonWrapper}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.answerButton}
      >
        <View style={styles.answerContent}>
          <Text style={styles.answerButtonText}>{text}</Text>
          {showAnswer && (
            <Icon 
              name={icon} 
              size={24} 
              color="#fff"
              style={styles.answerIcon}
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const BackgroundInfo = ({ text, onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.backgroundInfo,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.backgroundContent}>
        <Icon name="information" size={24} color="#fff" style={styles.infoIcon} />
        <Text style={styles.backgroundText}>{text}</Text>
      </View>
      
      <TouchableOpacity 
        onPress={onContinue}
        style={styles.continueButton}
      >
        <LinearGradient
          colors={['#00b09b', '#96c93d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.continueButtonGradient}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-right" size={20} color="#fff" style={styles.continueIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ResultButton = ({ onPress, colors, children }) => (
  <View style={styles.resultButtonShadow}>
    <TouchableOpacity onPress={onPress} style={styles.resultButtonTouch}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultButtonGradient}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const StackTrueGame = ({ route, navigation }) => {
  const { quizType, questions } = route.params;
  const { updateQuizScore, getBestScore } = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const introAnimation = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isCorrectAnimation, setIsCorrectAnimation] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowIntro(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectAnswer = async (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Show animation
    setIsCorrectAnimation(isCorrect);
    setShowAnimation(true);
    
    // Hide animation after 1.5s
    setTimeout(() => {
      setShowAnimation(false);
      // Only show background info for correct answers
      if (isCorrect) {
        setShowBackground(true);
      } else {
        // For wrong answers, automatically proceed after a short delay
        setTimeout(() => {
          handleNextQuestion();
        }, 1000);
      }
    }, 1500);
  };

  const handleNextQuestion = () => {
    setShowBackground(false);
    setShowAnswer(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnimation(false);
      setIsCorrectAnimation(true);
      
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      handleQuizComplete();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleQuizComplete = async () => {
    try {
      // Update the quiz score in storage
      await updateQuizScore(quizType, score);
      setShowResult(true);
    } catch (error) {
      console.error('Error saving quiz score:', error);
      setShowResult(true);
    }
  };

  if (showIntro) {
    return (
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}
      >
        <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
          <View style={styles.animationContainer}>
            <LottieView
              ref={introAnimation}
              source={require('../../assets/animations/quiz.json')}
              style={styles.introAnimation}
              autoPlay={true}
              loop={true}
              speed={0.5}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.introTitle}>True or False</Text>
          <Text style={styles.introSubtitle}>Get Ready!</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const bestScore = getBestScore(quizType);
    
    return (
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.resultScore}>Score: {score}/{questions.length}</Text>
            <Text style={styles.resultPercentage}>{percentage}%</Text>
            
            {bestScore && (
              <Text style={styles.bestScore}>
                Best Score: {bestScore.percentage}%
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <ResultButton
                onPress={restartQuiz}
                colors={['#4776E6', '#8E54E9']}
              >
                <View style={styles.buttonContent}>
                  <Icon name="restart" size={24} color="#fff" style={styles.optionIcon} />
                  <Text style={styles.buttonText}>Try Again</Text>
                </View>
              </ResultButton>

              <ResultButton
                onPress={() => navigation.goBack()}
                colors={['#FF512F', '#DD2476']}
              >
                <View style={styles.buttonContent}>
                  <Icon name="keyboard-return" size={24} color="#fff" style={styles.optionIcon} />
                  <Text style={styles.buttonText}>Return to Menu</Text>
                </View>
              </ResultButton>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <Layout>
<View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>

    {/* <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
      > */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          >
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.quizTitle}>{quizType.replace('TRUE_', '')}</Text>
              <Text style={styles.progress}>
                Question {currentQuestionIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.score}>Score: {score}</Text>
            </View>

            {showAnimation && (
              <View style={styles.animationOverlay}>
                <LottieView
                  ref={animationRef}
                  source={isCorrectAnimation ? 
                    require('../../assets/animations/correct.json') : 
                    require('../../assets/animations/wrong.json')
                  }
                  autoPlay
                  loop={false}
                  style={styles.resultAnimation}
                  />
              </View>
            )}

            <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
              <Text style={styles.question}>
                {questions[currentQuestionIndex].question}
              </Text>

              <View style={styles.answersContainer}>
                <AnswerButton
                  text="True"
                  onPress={() => !showAnswer && handleSelectAnswer(true)}
                  disabled={showAnswer}
                  isSelected={selectedAnswer === true}
                  isCorrect={questions[currentQuestionIndex].correctAnswer === true}
                  showAnswer={showAnswer}
                  />
                <AnswerButton
                  text="False"
                  onPress={() => !showAnswer && handleSelectAnswer(false)}
                  disabled={showAnswer}
                  isSelected={selectedAnswer === false}
                  isCorrect={questions[currentQuestionIndex].correctAnswer === false}
                  showAnswer={showAnswer}
                  />
              </View>
            </Animated.View>

            {showBackground && (
              <BackgroundInfo 
              text={questions[currentQuestionIndex].background}
              onContinue={handleNextQuestion}
              />
            )}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
          >
          <LinearGradient
            colors={['#FF512F', '#DD2476']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.returnButtonGradient}
            >
            <Icon name="keyboard-return" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    {/* </LinearGradient> */}
              </View>
            </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Space for return button
    minHeight: '100%',
    justifyContent: 'flex-start',
  },
  mainContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  quizTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progress: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  score: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    minHeight: 150, // Ensure minimum height for content
  },
  question: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  answersContainer: {
    gap: 15,
    paddingVertical: 10,
  },
  touchableWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  option: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
    marginRight: 10,
    textAlign: 'left',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedOption: {
    borderColor: '#fff',
  },
  correctOption: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  incorrectOption: {
    borderColor: '#FF5252',
    borderWidth: 3,
  },
  backgroundInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
  },
  backgroundContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backgroundText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  returnButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  returnButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Result screen styles
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultScore: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginTop: 20,
  },
  resultButtonShadow: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultButtonTouch: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  // Answer button specific styles
  answerButtonWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  answerButton: {
    padding: 20,
    borderRadius: 15,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  answerButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  answerIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 300,        // Increased size
    height: 300,       // Increased size
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introAnimation: {
    width: '100%',
    height: '100%',
  },
  introTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  introSubtitle: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  animationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  resultAnimation: {
    width: 200,
    height: 200,
  },
  bestScore: {
    fontSize: 24,
    color: '#FFD700',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default StackTrueGame;