import { StyleSheet, Text, View, TouchableOpacity, Animated, ScrollView,SafeAreaView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import Layout from '../../components/layout/Layout';


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

const StackQuizScreen = ({ route, navigation }) => {
  const { quizType, quizName } = route.params;
  const { getQuizByType, updateQuizScore ,getBestScore} = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showBackground, setShowBackground] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const introAnimation = useRef(null);

  useEffect(() => {
    const quizData = getQuizByType(quizType);
    setQuestions(quizData);

    // Start intro animation immediately
    // if (introAnimation.current) {
    //   introAnimation.current.play(0, 120); // Play from frame 0 to 120 (adjust based on your animation)
    // }

    // Hide intro after animation
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
    }, 3000); // Increased to 3s to ensure animation completes

    return () => clearTimeout(timer);
  }, [quizType]);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  const handleSelectOption = (option) => {
    if (!showAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      setSelectedAnswer(option);
      setShowAnswer(true);
      
      const isCorrect = option === currentQuestion.correctOption;
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
        setShowBackground(true); // Show background info
        // Don't automatically proceed to next question
      } else {
        // If wrong answer, proceed after delay
        setTimeout(() => {
          handleNextQuestion();
        }, 1500);
      }
    }
  };

  const handleNextQuestion = () => {
    fadeOut(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowBackground(false);
        setShowAnswer(false);
        setSelectedAnswer(null);
      } else {
        handleQuizComplete();
      }
    });
  };

  const getOptionStyle = (option) => {
    if (!showAnswer) {
      return selectedAnswer === option ? styles.selectedOption : null;
    }
    
    if (option === questions[currentQuestionIndex].correctOption) {
      return styles.correctOption;
    }
    
    if (selectedAnswer === option && option !== questions[currentQuestionIndex].correctOption) {
      return styles.incorrectOption;
    }
    
    return styles.disabledOption;
  };

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleQuizComplete = async () => {
    setShowResult(true);
    const scoreResult = await updateQuizScore(quizType, score);
    console.log('Score saved:', scoreResult);
  };

  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading quiz...</Text>
      </View>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            
            <Icon
              name={percentage >= 70 ? 'trophy' : 'medal'}
              size={60}
              color="#FFD700"
              style={[styles.optionIcon, { marginBottom: 20 }]}
            />
            
            <Text style={styles.resultScore}>
              Your Score: {score}/{questions.length}
            </Text>
            <Text style={styles.resultPercentage}>
              {percentage}%
            </Text>
            
            <Text style={styles.bestScore}>
              Best Score: {getBestScore(quizType)?.percentage || 0}%
            </Text>
            
            <View style={styles.buttonContainer}>
              <ResultButton
                onPress={restartQuiz}
                colors={['#00b09b', '#96c93d']}
              >
                <View style={styles.buttonContent}>
                  <Icon name="reload" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Try Again</Text>
                </View>
              </ResultButton>
              
              <ResultButton
                onPress={() => navigation.goBack()}
                colors={['#FF512F', '#DD2476']}
              >
                <View style={styles.buttonContent}>
                  <Icon name="arrow-left" size={24} color="#fff"  />
                  <Text style={styles.buttonText}>Back to Spinner</Text>
                </View>
              </ResultButton>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  if (showIntro) {
    return (
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}
      >
        <Animated.View 
          style={[
            styles.introContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.animationContainer}>
            <LottieView
              ref={introAnimation}
              source={require('../../assets/animations/quiz.json')}
              style={styles.introAnimation}
              autoPlay={true}  // Changed to true
              loop={true}      // Changed to true for continuous animation
              speed={0.5}        // Normal speed
              resizeMode="cover"
            />
          </View>
          <Text style={styles.introTitle}>{quizName}</Text>
          <Text style={styles.introSubtitle}>Get Ready!</Text>
        </Animated.View>
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
      <SafeAreaView/>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        >
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.quizName}>{quizName}</Text>
            <Text style={styles.progress}>
              Question {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <Text style={styles.score}>Score: {score}</Text>
          </View>

          <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
            <Text style={styles.question}>
              {questions[currentQuestionIndex].question}
            </Text>

            <View style={styles.optionsContainer}>
              {questions[currentQuestionIndex].options.map((option, index) => {
                const isCorrect = option === questions[currentQuestionIndex].correctOption;
                const isSelected = selectedAnswer === option;
                
                return (
                  <OptionButton
                  key={index}
                  option={option}
                  index={index}
                  onPress={() => handleSelectOption(option)}
                  disabled={showAnswer}
                  style={[getOptionStyle(option)]}
                  showAnswer={showAnswer && (isCorrect || isSelected)}
                  isCorrect={isCorrect}
                  />
                );
              })}
            </View>
          </Animated.View>

          {showBackground && questions[currentQuestionIndex].background && (
            <BackgroundInfo 
            text={questions[currentQuestionIndex].background}
            onContinue={handleNextQuestion}
            />
          )}
        </View>
      </ScrollView>
        <View style={{ height:80 }}></View>

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
    {/* </LinearGradient> */}
            </View>
          </Layout>
  );
};

const OptionButton = ({ option, index, onPress, style, disabled, showAnswer, isCorrect }) => {
  return (
    <View style={[styles.shadowContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={styles.touchableWrapper}
      >
        <LinearGradient
          colors={getOptionColors(index)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.option}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>
              {String.fromCharCode(65 + index)}. {option}
            </Text>
            {showAnswer && (
              <Icon
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={32}
                color={isCorrect ? '#4CAF50' : '#FF5252'}
                style={styles.optionIcon}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const getOptionColors = (index) => {
  const colorSets = [
    ['#FF512F', '#DD2476'], // Red-Pink
    ['#4776E6', '#8E54E9'], // Blue-Purple
    ['#00b09b', '#96c93d'], // Green
    ['#f12711', '#f5af19'], // Orange
  ];
  return colorSets[index % colorSets.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Add padding for return button
  },
  mainContent: {
    flex: 1,
    minHeight: '100%',
  },
  header: {
    marginBottom: 30,
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  progress: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  question: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 20,
  },
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    paddingRight: 10,
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
  optionIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultScore: {
    fontSize: 26,
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
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 25,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loading: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
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
  disabledOption: {
    opacity: 0.6,
  },
  resultButtonShadow: {
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 8,
  },
  resultButtonTouch: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    minWidth: 220,
    alignItems: 'center',
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
    marginTop: 2,
  },
  backgroundText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    alignSelf: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueIcon: {
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
    zIndex: 1000, // Ensure button stays on top
   
  },
  returnButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  
  },
  bestScore: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
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
});

export default StackQuizScreen;