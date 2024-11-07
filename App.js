import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StoreProvider} from './store/context';
import {
  TabUserProfile,
  TabChooseQuiz,
  TabSpinnerQuiz,
  TabScoreScreen,
  TabTrueGame,
} from './screen/tabScreens';
import {
  StackWelcomeScreen,
  StackChallengeChoose,
  StackQuizScreen,
  StackTrueGame,
} from './screen/stackScreens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  TouchableOpacity,
  Image,
  AppState,
  Text,
  Animated,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import {
  toggleBackgroundMusic,
  setupPlayer,
  pauseBackgroundMusic,
  playBackgroundMusic,
} from './components/sound/setPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const TabNavigator = () => {
  const [isPlayMusic, setIsPlayMusic] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isPlayMusic) {
        playBackgroundMusic();
      } else if (nextAppState === 'inactive' || nextAppState === 'background') {
        pauseBackgroundMusic();
      }
    });
    const initMusic = async () => {
      await setupPlayer();
      await playBackgroundMusic();
      setIsPlayMusic(true);
    };
    initMusic();

    return () => {
      subscription.remove();
      pauseBackgroundMusic();
    };
  }, []);

  const handlePlayMusicToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsPlayMusic(newState);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 15,
          backgroundColor: '#1a2a6c',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          // marginTop: 5,
          // marginBottom: 5,
        },
        tabBarActiveTintColor: '#fdbb2d',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="TabUserProfile"
        component={TabUserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="account" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabSpinnerQuiz"
        component={TabSpinnerQuiz}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="rotate-3d-variant" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabTrueGame"
        component={TabTrueGame}
        options={{
          tabBarLabel: 'True/False',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="check-circle-outline" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabScoreScreen"
        component={TabScoreScreen}
        options={{
          tabBarLabel: 'Scores',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="trophy" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name=" "
        component={EmptyComponent}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <TouchableOpacity onPress={handlePlayMusicToggle}>
              <Image
                source={require('./assets/icons/maracas.png')}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: isPlayMusic
                    ? '#fdbb2d'
                    : 'rgba(255, 255, 255, 0.6)',
                }}
              />
            </TouchableOpacity>
          ),
          tabBarLabel: 'Music',
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
            color: isPlayMusic ? '#fdbb2d' : 'rgba(255, 255, 255, 0.6)',
          },
        }}
        listeners={{tabPress: e => e.preventDefault()}}
      />
    </Tab.Navigator>
  );
};
const EmptyComponent = () => null;

function App() {
  ///////// Louder
  const [louderIsEnded, setLouderIsEnded] = useState(false);
  const appearingAnim = useRef(new Animated.Value(0)).current;
  const appearingSecondAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(appearingSecondAnim, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      }).start();
      //setLouderIsEnded(true);
    }, 3500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLouderIsEnded(true);
    }, 8000);
  }, []);

  return (
    <StoreProvider>
      <NavigationContainer>
        {!louderIsEnded ? (
          <View
            style={{
              position: 'relative',
              flex: 1,
              //backgroundColor: 'rgba(0,0,0)',
            }}>
            <Animated.Image
              source={require('./assets/image/loader1.png')}
              style={{
                //...props.style,
                opacity: appearingAnim,
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
            <Animated.Image
              source={require('./assets/image/loader2.png')}
              style={{
                //...props.style,
                opacity: appearingSecondAnim,
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
          </View>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade_from_bottom',
              animationDuration: 1000,
            }}>
            <Stack.Screen
              name="StackWelcomeScreen"
              component={StackWelcomeScreen}
            />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen
              name="StackChallengeChoose"
              component={StackChallengeChoose}
            />
            <Stack.Screen name="StackQuizScreen" component={StackQuizScreen} />
            <Stack.Screen name="StackTrueGame" component={StackTrueGame} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
