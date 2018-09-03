import { AppLoading, Font, SQLite } from 'expo';
import { Constants } from 'expo';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import Item from './Item';
import Header from './Header';
import Suggestion from './Suggestion';

const db = SQLite.openDatabase('db.db');

export default class App extends React.Component {

    state = {
        scrollEnabled: true,
        fontLoaded: false,
        buffer: null,
        items: [],
        delayedItems: [],
        suggestions: [],
        history: []
    }

    async componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists items (id integer primary key not null, value text, done int);'
            );
            tx.executeSql(
                'create table if not exists history (id integer primary key not null, value text, count int);'
            );
            tx.executeSql(
                'PRAGMA user_version',
                null,
                (tx, result) => {
                    if (result.rows.item(0).user_version == 0) {
                        tx.executeSql(
                            'alter table items ADD column delayed int',
                            null,
                            (tx, result) => {
                                tx.executeSql('PRAGMA user_version = 1;');
                            }
                        );
                    }
                }
            );
        }, null, this.update.bind(this));

        await Font.loadAsync({
            'custom-font-regular': require('./assets/fonts/Quicksand-Regular.ttf'),
            'custom-font-bold': require('./assets/fonts/Quicksand-Bold.ttf')
        });

        this.setState({ fontLoaded: true });
    }

    onPressItem(item) {
        let toggleDone = (i) => Object.assign(i, {done: (i.done == 0 ? 1 : 0)});
        this.setState({items: this.state.items.map((i) => i.id == item.id ? toggleDone(i) : i)});
    }

    onSwipeItem(item) {
        db.transaction(tx => {
            tx.executeSql('update items set delayed = ? where id = ?',
                          [!item.delayed ? 1 : 0, item.id]);
        }, null, this.update.bind(this));
    }

    deleteDone() {
        db.transaction(tx => {
            this.state.items.filter(i => i.done).forEach(i => {
                tx.executeSql('delete from items where id = ?', [i.id]);
            });
        }, null, this.update.bind(this));
    }

    onSubmitEditing() {
        if (this.state.buffer == null || this.state.buffer.trim() == '') return;

        this.addItem(this.state.buffer);
        this.setState({buffer:'', suggestions: []});
    }

    addItem(text) {
        db.transaction( tx => {
            tx.executeSql('insert into items (done, delayed, value) values (0, 0, ?)', [text]);
        }, null, this.update.bind(this));

        this.updateHistory(text);
    }

    updateHistory(text) {
        let update = (tx, text, oldCount) => {
            let count = oldCount + 1;
            tx.executeSql('update history set count = ? where value = ?', [count, text], this.update.bind(this));
        };

        let add = (tx, text) => {
            tx.executeSql('insert into history (value, count) values (?, 1)', [text], this.update.bind(this));
        };

        db.transaction( tx => {
            tx.executeSql('select id, count from history where value = ?',
                          [text],
                          (tx, {rows: { length, _array }}) => {
                              if (length) update(tx, text, _array[0].count);
                              else add(tx, text);
                          }, (_, error) => console.log('error???', error));
        });
    }

    autoComplete(text) {
        if (!text || text.length < 3) {
            this.setState({suggestions:[]});
        } else {
            let suggestions = this.state.history
                    .filter(i => i.value.startsWith(text))
                    .sort((a, b) => a.count - b.count)
                    .map(i => i.value);
            let size = suggestions.length;
            this.setState({suggestions:suggestions.slice(size > 3 ? size - 3 : 0)});
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

    update() {
        let app = this;
        db.transaction(tx => {
            tx.executeSql(
                `select * from items`,
                [],
                (_, { rows: { _array } }) => {
                    app.setState({ items: (_array || []) });
                }
            );
        });
        db.transaction(tx => {
            tx.executeSql(
                `select * from history`,
                [],
                (_, { rows: { _array } }) => {
                    app.setState({ history: (_array || []) });
                }
            );
        });
    }

    setScrollEnabled(enable) {
        this.setState({
           scrollEnabled: enable
        });
    }


    render() {
        if (!this.state.fontLoaded) return <AppLoading />;

        let nextItems = this.state.items.filter(i => !i.delayed).map(
            (item, ix) =>
                <Item
                  text={item.value}
                  done={item.done}
                  key={item.id}
                  setScrollEnabled={this.setScrollEnabled.bind(this)}
                  onPress={() => this.onPressItem(item)}
                  onSwipe={() => this.onSwipeItem(item)}
                  />
        );

        let delayedItems = this.state.items.filter(i => i.delayed == 1).map(
            (item, ix) =>
                <Item
                  text={item.value}
                  done={item.done}
                  key={item.id}
                  setScrollEnabled={this.setScrollEnabled.bind(this)}
                  onPress={() => this.onPressItem(item)}
                  onSwipe={() => this.onSwipeItem(item)}
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
                <ScrollView
                   style={{flex:1}}
                   scrollEnabled={this.state.scrollEnabled}
                   >
                  <View style={styles.list}>
                    {nextItems}
                  </View>
                  <View style={styles.divider}/>
                  <View style={styles.delayed_list}>
                    {delayedItems}
                  </View>
                </ScrollView>
                <View style={styles.suggestionsList}>
                  {suggestions}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                     autoFocus={true}
                     style={styles.input}
                     placeholder="Add a new item"
                     blurOnSubmit={false}
                     underlineColorAndroid="#397bce"
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
    divider: {
        height: 5,
        backgroundColor: '#e5e5e5',
        borderWidth: 1,
        borderColor: '#d1d1d1',
        borderRadius: 100
    },
    delayed_list: {
        paddingTop: 10
    },
    suggestionsList: {
        paddingLeft: 15,
        alignSelf: 'flex-start',
        backgroundColor: '#fff'
    },
    inputContainer: {
        height: 60,
        paddingBottom: 15,
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
