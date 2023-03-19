import React from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'

const KeyboardingAvoidWrapper = ({children, dashboard}) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  }
});

export default KeyboardingAvoidWrapper
