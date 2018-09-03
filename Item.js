import React from 'react';
import { Animated, Dimensions, PanResponder, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

const {width} = Dimensions.get('window');
const touchThreshold = 10;

export default class Item extends React.PureComponent {

    constructor(props) {
        super(props);

        this.gestureDelay = -10;
        this.scrollViewEnabled = true;

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (e, gestureState) => {
                const {dx, dy} = gestureState;

                return (Math.abs(dx) > touchThreshold) || (Math.abs(dy) > touchThreshold);
            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx > 10) {
                    this.setScrollViewEnabled(false);
                    let newX = gestureState.dx + this.gestureDelay;
                    position.setValue({x: newX, y: 0});
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < 150) {
                    Animated.timing(this.state.position, {
                        toValue: {x: 0, y: 0},
                        duration: 100
                    }).start(() => {
                        this.setScrollViewEnabled(true);
                    });
                } else {
                    Animated.timing(this.state.position, {
                        toValue: {x: width, y: 0},
                        duration: 50
                    }).start(() => {
                        this.props.onSwipe();
                        this.setScrollViewEnabled(true);
                    });
                }
            }
        });

        this.panResponder = panResponder;
        this.state = {position};
    }

    setScrollViewEnabled(enabled) {
        if (this.scrollViewEnabled !== enabled) {
            this.props.setScrollEnabled(enabled);
            this.scrollViewEnabled = enabled;
        }
    }

    render() {
        return (
            <View style={styles.container}>
              <Animated.View style={[this.state.position.getLayout()]} {...this.panResponder.panHandlers}>
                <View style={styles.hiddenCell} />
                <TouchableOpacity
                   style={[styles.button, this.props.done ? styles.doneButton : {}]}
                   onPress={this.props.onPress}
                   >
                  <Text style={[styles.text, this.props.done ? styles.doneText : {}]}>
                    {this.props.text}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingBottom: 10,
        marginLeft: -1*width
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginHorizontal: 10,
        height: 50,
        width: width,
        marginLeft: width
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
    },
    hiddenCell: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d8d8d8'
    }
});
