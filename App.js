import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

const J_PROMPT = 'jarvis@mobile:~$ ';

export default function App() {
  const [history, setHistory] = useState([
    { type: 'output', content: 'J.A.R.V.I.S. Mobile Terminal [Version 1.0.0]' },
    { type: 'output', content: '(c) 2026 Emergent Systems. All rights reserved.' },
    { type: 'output', content: 'Type "help" for a list of available commands.' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const scrollViewRef = useRef();

  const handleCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', content: command }];

    let output = '';
    switch (cmd) {
      case 'help':
        output = 'Available commands: help, clear, status, whoami, version, scan';
        break;
      case 'status':
        output = 'System: Online\nBattery: Optimized\nNetwork: Secure Encrypted';
        break;
      case 'whoami':
        output = 'Authenticated User: David\nAccess Level: Alpha-1';
        break;
      case 'version':
        output = 'J.A.R.V.I.S. Core v4.2.0-mobile';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'scan':
        output = 'Scanning local network... No threats detected. All systems green.';
        break;
      case '':
        break;
      default:
        output = `Command not found: ${cmd}. Type "help" for assistance.`;
    }

    if (output) {
      newHistory.push({ type: 'output', content: output });
    }
    setHistory(newHistory);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        style={styles.terminal}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {history.map((item, index) => (
          <View key={index} style={styles.line}>
            <Text style={item.type === 'input' ? styles.inputText : styles.outputText}>
              {item.type === 'input' ? J_PROMPT : ''}{item.content}
            </Text>
          </View>
        ))}
        <View style={styles.inputContainer}>
          <Text style={styles.promptText}>{J_PROMPT}</Text>
          <TextInput
            style={styles.input}
            value={currentInput}
            onChangeText={setCurrentInput}
            onSubmitEditing={(e) => {
              handleCommand(e.nativeEvent.text);
              setCurrentInput('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoFocus={true}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  terminal: {
    flex: 1,
    paddingHorizontal: 15,
  },
  line: {
    marginBottom: 4,
  },
  inputText: {
    color: '#00FF00', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  outputText: {
    color: '#00D1FF', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  promptText: {
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: '#00FF00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    padding: 0,
  },
});
