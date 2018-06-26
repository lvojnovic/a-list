import { AppLoading, Font } from 'expo';
import { Constants } from 'expo';
import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';

import Item from './Item';
import Header from './Header';

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

    onPressItem(index) {
        let toggleDone = (i) => Object.assign(i, {done:!i.done});
        this.setState({items: this.state.items.map((i, ix) => ix == index ? toggleDone(i) : i)});
    }

    deleteDone() {
        this.setState({items: this.state.items.filter(i => !i.done)});
    }

    onSubmitEditing() {
        this.setState({items: this.state.items.concat([{text:this.state.buffer, done:false}])});
        this.setState({buffer:''});
    }

    render() {
        if (!this.state.fontLoaded) return <AppLoading />;

        let items = this.state.items.map(
            (item, ix) =>
                <Item
                  text={item.text}
                  done={item.done}
                  key={ix}
                  onPress={() => this.onPressItem(ix)}
                  />
        );
        return (
            <View style={styles.container}>
              <Header
                text="A list"
                actionDisabled={!this.state.items.some(i => i.done)}
                doAction={this.deleteDone.bind(this)}
                />
              <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <View style={styles.list}>
                  {items}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                     style={styles.input}
                     placeholder="Add a new item"
                     value={this.state.buffer}
                     onChangeText={text => this.setState({buffer:text})}
                     onSubmitEditing={this.onSubmitEditing.bind(this)}
                    />
                </View>
              </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    list: {
        flex: 1
    },
    inputContainer: {
        height: 60,
        paddingBottom: 20
    },
    input: {
        flex: 1,
        padding: 5,
        height: 40,
        fontFamily: 'custom-font-regular',
        fontSize: 18
    }
});
