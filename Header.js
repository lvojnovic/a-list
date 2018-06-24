import { Constants } from 'expo';
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

export default class Header extends React.Component {
    render() {
        return (
            <View style={styles.container}>
              <Text style={styles.text}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 10,
        height: Constants.statusBarHeight + 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#397bce'
    },
    text: {
        color: 'white',
        fontFamily: 'custom-font-bold',
        fontSize: 28
    }
});
