import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setupPlayer, playBackgroundMusic } from '../../components/sound/setPlayer';
import Layout from '../../components/layout/Layout';

const StackWelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // Create rotating animation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    // Add music initialization
    const initMusic = async () => {
      await setupPlayer();
      await playBackgroundMusic();
    };
    initMusic();

    // Start all animations
    Animated.parallel([
      // Fade and slide animations
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Continuous rotation animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Navigate to TabNavigator after delay
    const timer = setTimeout(() => {
      navigation.replace('TabNavigator');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>

    {/* <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
      > */}
      <View style={styles.content}>
        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/animations/mexican.json')}
            autoPlay
            loop
            style={styles.animation}
            />
        </View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          >
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Mr. Blinko Education Quiz</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View 
          style={[
            styles.loadingContainer,
            { opacity: fadeAnim }
          ]}
          >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon 
              name="loading" 
              size={24} 
              color="#fff" 
              style={styles.loadingIcon} 
              />
          </Animated.View>
          <Animated.Text 
            style={[
              styles.loadingText,
              { opacity: fadeAnim }
            ]}
            >
            Loading amazing quizzes...
          </Animated.Text>
        </Animated.View>
      </View>

      {/* Optional: Add a pulsing effect to the background */}
      <Animated.View 
        style={[
          styles.pulseOverlay,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.1, 0]
            })
          }
        ]} 
        />
    {/* </LinearGradient> */}
        </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 400,
    height: 400,
    marginBottom: 30,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 42,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  loadingIcon: {
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pulseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
});

export default StackWelcomeScreen;