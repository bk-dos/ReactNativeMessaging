import {Dimensions, FlatList, PixelRatio, StyleSheet} from 'react-native'
import PropTypes from 'prop-types';
import React from 'react';

const Grid = (props) => {
  const {data, keyExtractor, renderItem, numColumns, itemMargin} = props
  
  const renderGridItem = (info) => {
    const {width} = Dimensions.get('window')

    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns
    )

    const marginLeft = info.index % numColumns === 0 ? 0 : itemMargin

    const marginTop = info.index < numColumns ? 0 : itemMargin

    return renderItem({...info, size, marginLeft, marginTop})
  }

  return (
    <FlatList {...props} renderItem={renderGridItem} />
  )
}

Grid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  numColumns: PropTypes.number,
  itemMargin: PropTypes.number
}

Grid.defaultProps = {
  numColumns: 4,
  itemMargin: StyleSheet.hairlineWidth
}

export default Grid