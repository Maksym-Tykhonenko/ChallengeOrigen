import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../../store/context';

const StackChallengeChoose = ({ navigation }) => {
  const { getQuizByType } = useStore();
  
  const quizOptions = [
    { name: 'History Quiz', type: 'HISTORY' },
    { name: 'Sport Quiz', type: 'SPORT' },
    { name: 'Capitals Quiz', type: 'CAPITALS' },
    { name: 'Film Quiz', type: 'FILM' }
  ];
  
  const [isDropping, setIsDropping] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  // Configure peg layout
  const ROWS = 4;
  const PEGS_PER_ROW = 6;
  const PEG_SPACING = screenWidth / (PEGS_PER_ROW + 1);
  const ROW_SPACING = (screenHeight - 80) / (ROWS + 1); // -250 to leave space for top and bottom

  // Generate peg positions
  const pegPositions = [];
  for (let row = 0; row < ROWS; row++) {
    const isOffset = row % 2 === 1;
    for (let peg = 0; peg < (isOffset ? PEGS_PER_ROW - 1 : PEGS_PER_ROW); peg++) {
      pegPositions.push({
        x: PEG_SPACING * (isOffset ? peg + 1.5 : peg + 1),
        y: ROW_SPACING * (row + 1),
      });
    }
  }

  const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const dropBall = () => {
    if (isDropping) return;
    
    setIsDropping(true);
    
    const startX = screenWidth / 2 - 10;
    let currentX = startX;
    let currentY = 0;
    
    // Reset ball position
    ballPosition.setValue({ x: currentX, y: currentY });
    
    // Choose random target index and store it
    const targetIndex = Math.floor(Math.random() * 4);
    setSelectedQuizIndex(targetIndex);
    
    // Calculate target X position based on index
    const quizWidth = screenWidth / 4;
    const targetX = (quizWidth * targetIndex) + (quizWidth / 2) - 10;
    
    const animations = [];
    const numberOfBounces = ROWS + 2;
    
    for (let i = 0; i < numberOfBounces; i++) {
      const progress = i / numberOfBounces;
      
      const bias = (targetX - currentX) * progress * 0.2;
      const randomFactor = (1 - progress) * PEG_SPACING * 0.8;
      const nextX = currentX + bias + (Math.random() - 0.5) * randomFactor;
      const nextY = (i + 1) * (screenHeight - 200) / numberOfBounces;
      
      animations.push(
        Animated.parallel([
          Animated.timing(ballPosition.x, {
            toValue: Math.max(PEG_SPACING, Math.min(screenWidth - PEG_SPACING, nextX)),
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ballPosition.y, {
            toValue: nextY,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      );
      
      currentX = nextX;
      currentY = nextY;
    }
    
    // Final snap animation
    animations.push(
      Animated.parallel([
        Animated.timing(ballPosition.x, {
          toValue: targetX,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(ballPosition.y, {
          toValue: screenHeight - 100,
          duration: 200,
          useNativeDriver: true,
        })
      ])
    );
    
    Animated.sequence(animations).start(() => {
      setTimeout(() => {
        setIsDropping(false);
        setSelectedQuizIndex(targetIndex);
        
        const selectedQuiz = quizOptions[targetIndex];
        const quizData = getQuizByType(selectedQuiz.type);
        
        console.log({
          finalX: targetX,
          screenWidth,
          finalQuizIndex: targetIndex,
          selectedQuiz: selectedQuiz.name,
          quizType: selectedQuiz.type,
          quizData: quizData
        });
        
        navigation.navigate('StackQuizScreen', {
          quizType: selectedQuiz.type,
          quizName: selectedQuiz.name
        });
      }, 200);
    });
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
    >
      <TouchableOpacity onPress={dropBall} style={styles.dropButton}>
        <LinearGradient
          colors={['#00b09b', '#96c93d']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>DROP BALL</Text>
        </LinearGradient>
      </TouchableOpacity>

      {pegPositions.map((peg, index) => (
        <View
          key={index}
          style={[
            styles.peg,
            {
              left: peg.x-10,
              top: peg.y,
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.ball,
          {
            transform: [
              { translateX: ballPosition.x },
              { translateY: ballPosition.y },
            ],
          },
        ]}
      />

      <View style={styles.quizContainer}>
        {quizOptions.map((quiz, index) => (
          <LinearGradient
            key={index}
            colors={selectedQuizIndex === index ? ['#FF512F', '#DD2476'] : ['#4776E6', '#8E54E9']}
            style={[
              styles.quizOption,
              selectedQuizIndex === index && styles.selectedQuiz
            ]}
          >
            <Text style={styles.quizText}>{quiz.name}</Text>
            <Text style={styles.indexText}>{index}</Text>
          </LinearGradient>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropButton: {
    alignSelf: 'center',
    marginTop: 80,
    zIndex: 1,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  peg: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ball: {
    width: 20,
    height: 20,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FF6666',
  },
  quizContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'space-around',
    zIndex: 1,
    paddingHorizontal: 10,
  },
  quizOption: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '23%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedQuiz: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  quizText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  indexText: {
    color: '#ffffff',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 5,
  },
});

export default StackChallengeChoose