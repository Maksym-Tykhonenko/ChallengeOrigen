import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import Layout from '../../components/layout/Layout';

const USER_STORAGE_KEY = 'user_profile';

const TabUserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const registrationAnimation = useRef(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async newUser => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 500,
      maxWidth: 500,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', 'Error selecting image');
        return;
      }

      if (response.assets && response.assets[0]) {
        const newUser = {
          ...user,
          image: `data:image/jpeg;base64,${response.assets[0].base64}`,
        };
        saveUserProfile(newUser);
      }
    });
  };

  const handleEditName = () => {
    setTempName(user.name);
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      const newUser = {
        ...user,
        name: tempName.trim(),
      };
      saveUserProfile(newUser);
      setIsEditing(false);
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(USER_STORAGE_KEY);
              setUser({name: '', image: null});
            } catch (error) {
              console.error('Error deleting profile:', error);
            }
          },
        },
      ],
    );
  };

  const renderUserContent = () => {
    if (!user.name || !user.image) {
      return (
        <View style={styles.welcomeContainer}>
          {/* Registration Animation */}
          <View style={styles.registrationAnimationContainer}>
            <LottieView
              ref={registrationAnimation}
              source={require('../../assets/animations/registrationLock.json')}
              style={styles.registrationAnimation}
              autoPlay
              loop
              speed={0.8}
            />
          </View>
          <Icon
            name="account-plus"
            size={80}
            color="#fff"
            style={styles.welcomeIcon}
          />
          <Text style={styles.welcomeTitle}>Welcome to Quiz App!</Text>
          <Text style={styles.welcomeText}>
            Please add your photo and name to start tracking your achievements
          </Text>
        </View>
      );
    }

    return (
      <>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#4776E6', '#8E54E9']}
            style={styles.statsCard}>
            <View style={styles.statItem}>
              <Icon name="trophy" size={24} color="#FFD700" />
              <Text style={styles.statLabel}>Best Score</Text>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statSubtext}>History Quiz</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="gamepad-variant" size={24} color="#fff" />
              <Text style={styles.statLabel}>Total Games</Text>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statSubtext}>All Quizzes</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <LinearGradient
              colors={['#00b09b', '#96c93d']}
              style={styles.achievementCard}>
              <Icon name="school" size={32} color="#fff" />
              <Text style={styles.achievementTitle}>Quiz Master</Text>
              <Text style={styles.achievementDesc}>Complete 10 quizzes</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#f12711', '#f5af19']}
              style={styles.achievementCard}>
              <Icon name="star" size={32} color="#FFD700" />
              <Text style={styles.achievementTitle}>Perfect Score</Text>
              <Text style={styles.achievementDesc}>Get 100% in any quiz</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Delete Profile Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProfile}>
          <LinearGradient
            colors={['#FF512F', '#DD2476']}
            style={styles.deleteButtonGradient}>
            <Icon name="delete" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <Layout>
      {/* <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}> */}
        <ScrollView
          // style={styles.profileContainer}
          contentContainerStyle={styles.profileContainer}>
          {/* Profile Image Section */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePick}>
            {user.image ? (
              <Image source={{uri: user.image}} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="account" size={80} color="#fff" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Name Section */}
          <View style={styles.nameContainer}>
            {!isEditing ? (
              <View style={styles.nameDisplay}>
                <Text style={styles.nameText}>
                  {user.name || 'Add Your Name'}
                </Text>
                <TouchableOpacity onPress={handleEditName}>
                  <Icon name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveName}>
                  <Icon name="check" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {renderUserContent()}
          <View style={{height: 100}}></View>
        </ScrollView>
      {/* </LinearGradient> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
  },
  imageContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00b09b',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameContainer: {
    width: '100%',
    marginBottom: 30,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  nameText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    fontSize: 18,
    width: '70%',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#00b09b',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  deleteButton: {
    width: '80%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  statsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  statSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  achievementsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  achievementDesc: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    // padding: 10,
    // marginTop: 10,
  },
  welcomeIcon: {
    marginBottom: 20,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  registrationAnimationContainer: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registrationAnimation: {
    width: '100%',
    height: '100%',
  },
});

export default TabUserProfile;
