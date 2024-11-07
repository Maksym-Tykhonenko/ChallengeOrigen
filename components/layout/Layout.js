import {StyleSheet, Text, View, ImageBackground} from 'react-native';

const Layout = ({children,styles}) => {
  return (
    <ImageBackground
      source={require('../../assets/image/back.png')}
      style={[styles,{flex: 1}]}>
      {children}
    </ImageBackground>
  );
};

export default Layout;

const styles = StyleSheet.create({});
