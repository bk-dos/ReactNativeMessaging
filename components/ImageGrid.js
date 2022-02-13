import { Image, StyleSheet, TouchableOpacity } from "react-native";
import CameraRoll from 'expo-cameraroll'
//import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library';
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'

import Grid from "./Grid";
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";

const keyExtractor = ({uri}) => uri

const ImageGrid = ({onPressImage}) => {
  const [images, setImages] = useState(null)
  console.log('images: ', images)

  const renderItem = ({item, size, marginTop, marginLeft}) => {
    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop
    }

    return (
      <Image source={{uri: item.uri}} style={style} />
    )
  }

  useEffect(() => {
    const getPhotos = async () => {

      const {status} = await MediaLibrary.requestPermissionsAsync()

      if (status !== 'granted') {
        console.log('cameraroll permission denied')
        return
      }
      console.log('cameraroll permission OK')

      const media = await MediaLibrary.getAssetsAsync({
        first: 20,
        mediaType: 'photo'
      })

      //console.log(media.assets)

      const photos = await Promise.all(media.assets.map(async asset => {
        const photoInfo = await MediaLibrary.getAssetInfoAsync(asset)
        //console.log(photoInfo.uri)
        return {uri: photoInfo.uri}
      }))

      //console.log(photos)
      setImages([...photos])
    }
    getPhotos()
  }, [])

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}

Image.propTypes = {
  onPressImage: PropTypes.func
}

Image.propTypes = {
  onPressImage: () => {}
}

const styles = StyleSheet.create({
  image: {
    flex: 1
  }
})

export default ImageGrid