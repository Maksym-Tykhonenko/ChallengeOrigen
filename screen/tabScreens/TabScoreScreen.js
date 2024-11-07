import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import {useStore} from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Layout from '../../components/layout/Layout';

const ScoreCard = ({quizType, name, colors}) => {
  const {getBestScore, getQuizScores} = useStore();
  const bestScore = getBestScore(quizType);
  const allScores = getQuizScores(quizType);
  const lastScore = allScores[0];

  return (
    <LinearGradient
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.scoreCard}>
      <Text style={styles.quizTitle}>{name}</Text>
      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Icon
            name="trophy"
            size={24}
            color="#FFD700"
            style={styles.scoreIcon}
          />
          <Text style={styles.scoreLabel}>Best Score</Text>
          <Text style={styles.scoreValue}>
            {bestScore ? `${bestScore.percentage}%` : '-'}
          </Text>
          <Text style={styles.scoreDate}>
            {bestScore ? new Date(bestScore.date).toLocaleDateString() : ''}
          </Text>
        </View>

        <View style={styles.scoreDivider} />

        <View style={styles.scoreItem}>
          <Icon
            name="clock-outline"
            size={24}
            color="#fff"
            style={styles.scoreIcon}
          />
          <Text style={styles.scoreLabel}>Last Score</Text>
          <Text style={styles.scoreValue}>
            {lastScore ? `${lastScore.percentage}%` : '-'}
          </Text>
          <Text style={styles.scoreDate}>
            {lastScore ? new Date(lastScore.date).toLocaleDateString() : ''}
          </Text>
        </View>

        <View style={styles.scoreDivider} />

        <View style={styles.scoreItem}>
          <Icon
            name="notebook-outline"
            size={24}
            color="#fff"
            style={styles.scoreIcon}
          />
          <Text style={styles.scoreLabel}>Total Games</Text>
          <Text style={styles.scoreValue}>{allScores.length}</Text>
          <Text style={styles.scoreDate}>
            {allScores.length > 0 ? 'Completed' : ''}
          </Text>
        </View>
      </View>

      {/* Recent Scores Section */}
      {allScores.length > 0 && (
        <View style={styles.recentScores}>
          <Text style={styles.recentTitle}>Recent Scores</Text>
          <View style={styles.scoresList}>
            {allScores.slice(0, 5).map((score, index) => (
              <View key={index} style={styles.recentScoreItem}>
                <Text style={styles.recentScoreText}>
                  {score.percentage}% ({score.score}/{score.total})
                </Text>
                <Text style={styles.recentScoreDate}>
                  {new Date(score.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const TabScoreScreen = () => {
  const quizTypes = [
    {name: 'History Quiz', type: 'HISTORY', colors: ['#FF512F', '#DD2476']},
    {name: 'Sport Quiz', type: 'SPORT', colors: ['#4776E6', '#8E54E9']},
    {name: 'Capitals Quiz', type: 'CAPITALS', colors: ['#00b09b', '#96c93d']},
    {name: 'Film Quiz', type: 'FILM', colors: ['#f12711', '#f5af19']},
  ];

  return (
    <Layout>
      {/* <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}> */}
        <SafeAreaView />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.screenTitle}>Quiz Scores</Text>
          <View style={styles.scoreCardsContainer}>
            {quizTypes.map((quiz, index) => (
              <ScoreCard
                key={index}
                quizType={quiz.type}
                name={quiz.name}
                colors={quiz.colors}
              />
            ))}
          </View>
        </ScrollView>
        <View style={{height: 120}}></View>
      {/* </LinearGradient> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  scoreCardsContainer: {
    padding: 20,
    gap: 20,
  },
  scoreCard: {
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quizTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreIcon: {
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoreDate: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoreDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  recentScores: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  scoresList: {
    gap: 8,
  },
  recentScoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentScoreText: {
    color: '#fff',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  recentScoreDate: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

export default TabScoreScreen;
