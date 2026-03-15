import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LoginScreen = ({ onGuest }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.logo}>✈️ TravelEasy</Text>
      <Text style={styles.subtitle}>여행을 더 쉽고 빠르게</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Google로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.guestButton} onPress={onGuest}>
        <Text style={styles.guestText}>로그인 없이 구경하기</Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff"
  },

  logo:{
    fontSize:32,
    fontWeight:"bold",
    marginBottom:10
  },

  subtitle:{
    fontSize:16,
    color:"#777",
    marginBottom:40
  },

  googleButton:{
    borderWidth:1,
    borderColor:"#ddd",
    padding:15,
    borderRadius:10,
    width:250,
    alignItems:"center",
    marginBottom:15
  },

  googleText:{
    fontWeight:"600"
  },

  guestButton:{
    padding:10
  },

  guestText:{
    color:"#666"
  }
});