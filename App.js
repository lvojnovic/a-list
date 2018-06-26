import { AppLoading, Font } from 'expo';
import { Constants } from 'expo';
import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';

import Item from './Item';
import Header from './Header';
import Suggestion from './Suggestion';

export default class App extends React.Component {

    state = {
        fontLoaded: false,
        buffer: null,
        items: [],
        suggestions: []
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
        this.addItem(this.state.buffer);
        this.setState({buffer:'', suggestions: []});
    }

    addItem(text) {
        this.setState({items: this.state.items.concat([{text:text, done:false}])});
    }

    autoComplete(text) {
        if (!text || text.length < 3) {
            this.setState({suggestions:[]});
        } else {
            let suggestions = this.state.items
                    .filter(i => i.text.startsWith(text))
                    .map(i => i.text);
            let uniqueSuggestions = [...new Set(suggestions)];
            this.setState({suggestions:uniqueSuggestions});
        }
    }

    onChangeText(text) {
        this.setState({buffer:text});
        this.autoComplete(text);
    }

    onSuggestionSelect(text) {
        this.addItem(text);
        this.setState({suggestions:[], buffer:''});
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

        let suggestions = this.state.suggestions.map(
            (item, ix) =>
                <Suggestion
                  key={ix}
                  text={item}
                  onPress={() => this.onSuggestionSelect(item)}
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
                <View style={styles.suggestionsList}>
                  {suggestions}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                     style={styles.input}
                     placeholder="Add a new item"
                     value={this.state.buffer}
                     onChangeText={this.onChangeText.bind(this)}
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
    suggestionsList: {
        paddingLeft: 15,
        alignSelf: 'flex-start',
        backgroundColor: '#fff'
    },
    inputContainer: {
        height: 60,
        paddingBottom: 20,
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        padding: 5,
        height: 40,
        fontFamily: 'custom-font-regular',
        fontSize: 18
    }
});
