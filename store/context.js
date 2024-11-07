import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY_QUIZ, SPORT_QUIZ, CAPITALS_QUIZ, FILM_QUIZ } from '../data/quizData';
import { TRUE_HISTORY, TRUE_SPORT, TRUE_CAPITALS, TRUE_FILMS } from '../data/trueFalseQuiz';

const StoreContext = createContext();

const STORAGE_KEYS = {
  HISTORY: 'history_quiz',
  SPORT: 'sport_quiz',
  CAPITALS: 'capitals_quiz',
  FILM: 'film_quiz',
  TRUE_HISTORY: 'true_history_quiz',
  TRUE_SPORT: 'true_sport_quiz',
  TRUE_CAPITALS: 'true_capitals_quiz',
  TRUE_FILMS: 'true_films_quiz',
};

export function StoreProvider({ children }) {
  const [historyQuiz, setHistoryQuiz] = useState([]);
  const [sportQuiz, setSportQuiz] = useState([]);
  const [capitalsQuiz, setCapitalsQuiz] = useState([]);
  const [filmQuiz, setFilmQuiz] = useState([]);
  const [trueHistoryQuiz, setTrueHistoryQuiz] = useState([]);
  const [trueSportQuiz, setTrueSportQuiz] = useState([]);
  const [trueCapitalsQuiz, setTrueCapitalsQuiz] = useState([]);
  const [trueFilmsQuiz, setTrueFilmsQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize quizzes from AsyncStorage or default data
  useEffect(() => {
    const initializeQuizzes = async () => {
      try {
        // Try to get quizzes from AsyncStorage
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
        const storedSport = await AsyncStorage.getItem(STORAGE_KEYS.SPORT);
        const storedCapitals = await AsyncStorage.getItem(STORAGE_KEYS.CAPITALS);
        const storedFilm = await AsyncStorage.getItem(STORAGE_KEYS.FILM);
        const storedTrueHistory = await AsyncStorage.getItem(STORAGE_KEYS.TRUE_HISTORY);
        const storedTrueSport = await AsyncStorage.getItem(STORAGE_KEYS.TRUE_SPORT);
        const storedTrueCapitals = await AsyncStorage.getItem(STORAGE_KEYS.TRUE_CAPITALS);
        const storedTrueFilms = await AsyncStorage.getItem(STORAGE_KEYS.TRUE_FILMS);

        // Set history quiz
        if (storedHistory) {
          setHistoryQuiz(JSON.parse(storedHistory));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(HISTORY_QUIZ));
          setHistoryQuiz(HISTORY_QUIZ);
        }

        // Set sport quiz
        if (storedSport) {
          setSportQuiz(JSON.parse(storedSport));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.SPORT, JSON.stringify(SPORT_QUIZ));
          setSportQuiz(SPORT_QUIZ);
        }

        // Set capitals quiz
        if (storedCapitals) {
          setCapitalsQuiz(JSON.parse(storedCapitals));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.CAPITALS, JSON.stringify(CAPITALS_QUIZ));
          setCapitalsQuiz(CAPITALS_QUIZ);
        }

        // Set film quiz
        if (storedFilm) {
          setFilmQuiz(JSON.parse(storedFilm));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.FILM, JSON.stringify(FILM_QUIZ));
          setFilmQuiz(FILM_QUIZ);
        }

        if (storedTrueHistory) {
          setTrueHistoryQuiz(JSON.parse(storedTrueHistory));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRUE_HISTORY, JSON.stringify(TRUE_HISTORY));
          setTrueHistoryQuiz(TRUE_HISTORY);
        }

        if (storedTrueSport) {
          setTrueSportQuiz(JSON.parse(storedTrueSport));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRUE_SPORT, JSON.stringify(TRUE_SPORT));
          setTrueSportQuiz(TRUE_SPORT);
        }

        if (storedTrueCapitals) {
          setTrueCapitalsQuiz(JSON.parse(storedTrueCapitals));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRUE_CAPITALS, JSON.stringify(TRUE_CAPITALS));
          setTrueCapitalsQuiz(TRUE_CAPITALS);
        }

        if (storedTrueFilms) {
          setTrueFilmsQuiz(JSON.parse(storedTrueFilms));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRUE_FILMS, JSON.stringify(TRUE_FILMS));
          setTrueFilmsQuiz(TRUE_FILMS);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing quizzes:', error);
        setIsLoading(false);
      }
    };

    initializeQuizzes();
  }, []);

  // Update quiz data in AsyncStorage
  const updateQuiz = async (quizType, newData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS[quizType], JSON.stringify(newData));
      switch (quizType) {
        case 'HISTORY':
          setHistoryQuiz(newData);
          break;
        case 'SPORT':
          setSportQuiz(newData);
          break;
        case 'CAPITALS':
          setCapitalsQuiz(newData);
          break;
        case 'FILM':
          setFilmQuiz(newData);
          break;
        case 'TRUE_HISTORY':
          setTrueHistoryQuiz(newData);
          break;
        case 'TRUE_SPORT':
          setTrueSportQuiz(newData);
          break;
        case 'TRUE_CAPITALS':
          setTrueCapitalsQuiz(newData);
          break;
        case 'TRUE_FILMS':
          setTrueFilmsQuiz(newData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  // Get quiz data by type
  const getQuizByType = (type) => {
    switch (type) {
      case 'HISTORY':
        return historyQuiz;
      case 'SPORT':
        return sportQuiz;
      case 'CAPITALS':
        return capitalsQuiz;
      case 'FILM':
        return filmQuiz;
      case 'TRUE_HISTORY':
        return trueHistoryQuiz;
      case 'TRUE_SPORT':
        return trueSportQuiz;
      case 'TRUE_CAPITALS':
        return trueCapitalsQuiz;
      case 'TRUE_FILMS':
        return trueFilmsQuiz;
      default:
        return [];
    }
  };

  // Add function to update quiz score
  const updateQuizScore = async (quizType, newScore) => {
    try {
      // Get current quiz data
      const currentQuiz = getQuizByType(quizType);
      
      // Get existing scores or initialize empty array
      const scores = currentQuiz.scores || [];
      
      // Add new score with timestamp
      const scoreEntry = {
        score: newScore,
        total: currentQuiz.length,
        percentage: Math.round((newScore / currentQuiz.length) * 100),
        date: new Date().toISOString(),
      };

      // Add new score to beginning of array (most recent first)
      const updatedScores = [scoreEntry, ...scores].slice(0, 10); // Keep only last 10 scores
      
      // Create updated quiz data
      const updatedQuiz = {
        ...currentQuiz,
        scores: updatedScores,
      };

      // Save to AsyncStorage and update state
      await updateQuiz(quizType, updatedQuiz);

      console.log(`Score updated for ${quizType}:`, scoreEntry);
      return scoreEntry;
    } catch (error) {
      console.error('Error updating quiz score:', error);
      return null;
    }
  };

  // Add function to get quiz scores
  const getQuizScores = (quizType) => {
    const quiz = getQuizByType(quizType);
    return quiz.scores || [];
  };

  // Add function to get best score
  const getBestScore = (quizType) => {
    const scores = getQuizScores(quizType);
    if (scores.length === 0) return null;
    
    return scores.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    , scores[0]);
  };

  const storeValue = {
    historyQuiz,
    sportQuiz,
    capitalsQuiz,
    filmQuiz,
    trueHistoryQuiz,
    trueSportQuiz,
    trueCapitalsQuiz,
    trueFilmsQuiz,
    isLoading,
    updateQuiz,
    getQuizByType,
    updateQuizScore,
    getQuizScores,
    getBestScore,
  };

  return (
    <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
