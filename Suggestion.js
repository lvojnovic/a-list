import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

export default class Suggestion extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
              <Text style={styles.suggestion}>
                {this.props.text}
              </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    suggestion: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        fontFamily: 'custom-font-regular',
        fontSize: 16
    }
});
