import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import React, {useState, useRef, useEffect} from 'react';

const ToolbarButton = ({title, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
)

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}

const Toolbar = ({onPressCamera, onPressLocation, onSubmit, onChangeFocus, isFocused}) => {
  const [text, setText] = useState('')
  const input = useRef()
  const prevIsFocused = useRef()

  useEffect(() => {
    if (isFocused !== prevIsFocused) {
      if (isFocused) {
        input.current.focus()
      } else {
        input.current.blur()
      }
    }
    prevIsFocused.current = isFocused
  })

  const handleChangeText = (newText) => {
    setText(newText)
  }

  const handleSubmitEditing = () => {
    if (!text) return

    onSubmit(text)
    setText('')
  }

  const handleFocus = () => {
    onChangeFocus(true)
  }

  const handleBlur = () => {
    onChangeFocus(false)
  }

  return (
    <View style={styles.toolbar}>
      <ToolbarButton title={'📷'} onPress={onPressCamera} />
      <ToolbarButton title={'📍'} onPress={onPressLocation} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='Type something!'
          blurOnSubmit={false}
          value={text}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}

          ref={input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </View>
  )
}

Toolbar.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  onChangeFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  onPressCamera: PropTypes.func,
  onPressLocation: PropTypes.func,
}

Toolbar.defaultProps = {
  onChangeFocus: () => {},
  onSubmit: () => {},
  onPressCamera: () => {},
  onPressLocation: () => {},
}

const styles = {
  toolbar: {
    flexDirection: 'row',
    alignItem: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: 'white',
  },
  button : {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: 'grey'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  input: {
    flex: 1,
    fontSize: 18
  }
}

export default Toolbar