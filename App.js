import { AppLoading, Font } from 'expo';
import { Constants } from 'expo';
import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';

import Item from './Item';

export default class App extends React.Component {

    state = {
        fontLoaded: false,
        buffer: null,
        items: []
    }

    async componentDidMount() {
        await Font.loadAsync({
            'custom-font-regular': require('./assets/fonts/Quicksand-Regular.ttf'),
            'custom-font-bold': require('./assets/fonts/Quicksand-Bold.ttf')
        });

        this.setState({ fontLoaded: true });
    }

    removeItem(indexToRemove) {
        this.setState({items: this.state.items.filter((i, ix) => ix != indexToRemove)});
    }

    render() {
        if (!this.state.fontLoaded) return <AppLoading />;

        let items = this.state.items.map((item, ix) => {
            return ( <Item text={item} key={ix} onPress={() => this.removeItem(ix)}/>);
        });
        return (
            <View style={styles.container}>
              <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <View style={styles.list}>
                  {items}
                </View>
                <View style={styles.input}>
                  <TextInput
                     style={{
                         flex: 1,
                         padding: 5,
                         height: 40,
                         fontFamily: 'custom-font-regular',
                         fontSize: 18
                     }}
                     placeholder="Add a new item"
                     value={this.state.buffer}
                     onChangeText={text => this.setState({buffer:text})}
                     onSubmitEditing={() => {
                         this.setState({items: this.state.items.concat([this.state.buffer])});
                         this.setState({buffer:''});
                     }}
                    />
                </View>
              </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    list: {
        flex: 1
    },
    input: {
        height: 40
    }
});