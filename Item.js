import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

export default class Item extends React.Component {
    render() {
        return (
            <View style={styles.container}>
              <TouchableOpacity
                 style={[styles.button, , this.props.done ? styles.doneButton : {}]}
                 onPress={this.props.onPress}
                 >
                <Text style={[styles.text, this.props.done ? styles.doneText : {}]}>
                  {this.props.text}
                </Text>
              </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start'
    },
    button: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginTop: 10,
        marginHorizontal: 10,
        padding: 5,
        height: 50
    },
    text: {
        color: '#8c8a8a',
        fontFamily: 'custom-font-regular',
        fontSize: 25
    },
    doneButton: {
        backgroundColor: '#eaeaea'
    },
    doneText: {
        color: '#afacac',
        textDecorationLine: 'line-through'
    }
});
