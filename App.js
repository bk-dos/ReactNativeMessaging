//import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import React, {useState} from 'react';

import * as Location from 'expo-location'

import Status from './components/Status';
import {
  createTextMessage,
  createImageMessage,
  createLocationMessage
} from './utils/MessageUtils'
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';

export default function App() {
  const initialMessages = [
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    })
  ]

  const [messages, setMessages] = useState(initialMessages)
  const [fullscreenImageId, setFullscreenImageId] = useState(null)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleChangeFocus = (isFocused) => {
    setIsInputFocused(isFocused)
  }

  const handlePressToolbarCamera = () => {
    //
  }

  const handlePressToolbarLocation = async () => {
    try {
      console.log('checking permission')
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log(status)
        return
      }
      console.log('permission ok')

      console.log('getting position')
      const position = await Location.getCurrentPositionAsync()

      const newMessages = [
        createLocationMessage({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        ...messages
      ]
  
      setMessages(newMessages)
      console.log('messages set')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (text) => {
    const newMessages = [createTextMessage(text), ...messages]
    setMessages(newMessages)
  }

  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={handlePressMessage}
        />
      </View>
    )
  }

  const handlePressMessage = ({id, type}) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const updatedMessages = messages.filter(message => message.id !== id)
                setMessages(updatedMessages)
              }
            }
          ]
        )
        break
      case 'image':
        setIsInputFocused(false)
        setFullscreenImageId(id)
        break
      default:
        break
    }
  }

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null)
  }

  const renderFullscreenImage = () => {
    if (!fullscreenImageId) return null

    const image = messages.find(message => message.id === fullscreenImageId)

    if (!image) return null

    const {uri} = image

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{uri}} />
      </TouchableHighlight>
    )
  }

  const renderInputMethodEditor = () => {
    return (
      <View style={styles.inputMethodEditor}></View>
    )
  }

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={handlePressToolbarCamera}
          onPressLocation={handlePressToolbarLocation}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
      {renderFullscreenImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  }
});
