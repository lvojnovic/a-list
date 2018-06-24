import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class BroomIcon extends React.Component {
  render() {
    return (
        <MaterialCommunityIcons name="broom" size={32} color={this.props.color || 'white'} />
    );
  }
}
