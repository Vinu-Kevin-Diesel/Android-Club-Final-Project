import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
  Button,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ico from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff'};
let randomHex = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');
  const [editingItem, setEditingItem] = React.useState(0);
  
  

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input a Task');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
    Keyboard.dismiss();
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const editItem = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        setTextInput(item.task);
        setEditingItem(item.id);
      }

    });
  };

  const updateItem = () => {
    
    const newTodosItem = todos.map(item => 
      item.id === editingItem ? 
      {id: item.id, task: textInput} : item
    ); 
    Keyboard.dismiss()
    setTodos(newTodosItem);
    setTextInput('');
    setEditingItem(0);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              color: randomHex(),
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
        {!todo?.completed && (
        <TouchableOpacity
          onPress={() => editItem(todo.id)}>
          <View style={styles.editIcon}>
          <Ico name="note" size={20} color="white" />
          </View>
        </TouchableOpacity>
         )}
      </View>
    );
  };
  return (
    <ImageBackground 
        source={require('./logo.jpg')} 
        style={styles.bgimage}>
    <SafeAreaView
      style={{
        flex: 1,
      
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 35,
            color: COLORS.primary,
            textAlign: 'center',
          }}>
          A TODO APP
        </Text>
        <Icon name="delete" size={25} color="red" onPress={clearAllTodos} />
        
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Type a New Task"
            color= '#1f145c'
            onChangeText={text => setTextInput(text)}
          />
        </View>
       
        <Button onPress={editingItem === 0 ? addTodo : updateItem}
        title={editingItem === 0 ? "Add" : "UPDATE"}
        color='#1f145c'
        >
        <View style={styles.iconContainer}>
        </View>
        </Button>
        
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgimage: {
    flex: 1,    
    resizeMode: "center",
    justifyContent: "center",
    width:'100%',
    height:'100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 70,
    backgroundColor: '#ffffff',
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    borderColor: '#1f145c',
    borderWidth: 2,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 20,
    borderRadius: 7,
    marginVertical: 10,
    
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  editIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;
