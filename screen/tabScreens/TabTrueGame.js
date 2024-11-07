import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '../../store/context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../components/layout/Layout';

const QuizCard = ({title, icon, questions, colors, onPress, bestScore}) => (
  <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
    <LinearGradient
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <Icon name={icon} size={40} color="#fff" style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardInfo}>
        <View style={styles.questionInfo}>
          <Icon name="help-circle-outline" size={16} color="#fff" />
          <Text style={styles.questionCount}>{questions.length} Questions</Text>
        </View>
        {bestScore !== null && (
          <View style={styles.scoreInfo}>
            <Icon name="trophy" size={16} color="#FFD700" />
            <Text style={styles.bestScore}>{bestScore}%</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const TabTrueGame = () => {
  const navigation = useNavigation();
  const {
    trueHistoryQuiz,
    trueSportQuiz,
    trueCapitalsQuiz,
    trueFilmsQuiz,
    getBestScore,
  } = useStore();

  const quizCategories = [
    {
      title: 'History',
      icon: 'book-open-variant',
      questions: trueHistoryQuiz,
      type: 'TRUE_HISTORY',
      colors: ['#FF512F', '#DD2476'],
    },
    {
      title: 'Sports',
      icon: 'soccer',
      questions: trueSportQuiz,
      type: 'TRUE_SPORT',
      colors: ['#4776E6', '#8E54E9'],
    },
    {
      title: 'Capitals',
      icon: 'city',
      questions: trueCapitalsQuiz,
      type: 'TRUE_CAPITALS',
      colors: ['#00b09b', '#96c93d'],
    },
    {
      title: 'Films',
      icon: 'movie',
      questions: trueFilmsQuiz,
      type: 'TRUE_FILMS',
      colors: ['#f12711', '#f5af19'],
    },
  ];

  const handleQuizSelect = (quizType, questions) => {
    navigation.navigate('StackTrueGame', {
      quizType,
      questions,
    });
  };

  return (
    <Layout>
      {/* <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}> */}
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>True or False Quiz</Text>
            <View style={styles.cardsContainer}>
              {quizCategories.map(category => (
                <QuizCard
                  key={category.type}
                  title={category.title}
                  icon={category.icon}
                  questions={category.questions}
                  colors={category.colors}
                  bestScore={getBestScore(category.type)?.percentage || null}
                  onPress={() =>
                    handleQuizSelect(category.type, category.questions)
                  }
                />
              ))}
            </View>
            <View style={{height: 120}} />
          </ScrollView>
        </SafeAreaView>
      {/* </LinearGradient> */}
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
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  cardsContainer: {
    padding: 20,
    gap: 20,
  },
  cardWrapper: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  cardInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bestScore: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  questionCount: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

export default TabTrueGame;
