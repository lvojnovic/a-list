import { Constants } from 'expo';
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import BroomIcon from './BroomIcon';

export default class Header extends React.Component {
    render() {
        return (
            <View style={styles.container}>
              <Text style={styles.text}>{this.props.text}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.props.doAction}
                disabled={this.props.actionDisabled}
                >
                <BroomIcon color={this.props.actionDisabled ? '#adbfd6' : 'white'}/>
              </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        paddingHorizontal: 20,
        height: Constants.statusBarHeight + 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#397bce',
        flexDirection: 'row'
    },
    text: {
        color: 'white',
        fontFamily: 'custom-font-bold',
        fontSize: 28
    }
});
