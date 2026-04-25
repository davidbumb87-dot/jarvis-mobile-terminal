import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

const ADMIN_PROMPT = 'PS C:\\WINDOWS\\system32> ';
const COMMAND_DATABASE = [
  'Get-Process', 'tasklist', 'ipconfig', 'sfc /scannow', 
  'Get-Service', 'dir', 'ls', 'cd', 'echo', 
  'cls', 'clear', 'whoami', 'netstat', 'systeminfo', 'ping'
];

export default function App() {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Windows PowerShell' },
    { type: 'output', content: 'Copyright (C) Microsoft Corporation. All rights reserved.' },
    { type: 'output', content: 'Running in Administrator mode...' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const scrollViewRef = useRef();

  const handleCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', content: command }];

    let output = '';
    if (cmd.startsWith('ping ')) {
        output = `Pinging ${cmd.split(' ')[1]} with 32 bytes of data:\nReply from ${cmd.split(' ')[1]}: bytes=32 time<1ms TTL=128`;
    } else {
        switch (cmd) {
            case 'get-process':
            case 'tasklist':
                output = 'Image Name                     PID Session Name        Mem Usage\n========================= ======== ================ ===========\nSystem Idle Process              0 Services                   8 K\nSystem                           4 Services                 136 K\njarvis_core.exe               2048 Console               45,212 K';
                break;
            case 'ipconfig':
                output = 'Windows IP Configuration\n\nEthernet adapter Ethernet:\n   Connection-specific DNS Suffix  . : local\n   IPv4 Address. . . . . . . . . . . : 192.168.1.105\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1';
                break;
            case 'sfc /scannow':
                output = 'Beginning system scan. This process will take some time.\nBeginning verification phase of system scan.\nVerification 100% complete.\nWindows Resource Protection did not find any integrity violations.';
                break;
            case 'dir':
            case 'ls':
                output = ' Directory of C:\\WINDOWS\\system32\\\n\n25/04/2026  10:00 AM    <DIR>          .\n25/04/2026  10:00 AM    <DIR>          ..\n25/04/2026  10:11 AM            45,212 jarvis_core.exe\n25/04/2026  10:15 AM               124 config.sys';
                break;
            case 'whoami':
                output = 'desktop-jarvis\\administrator (David)';
                break;
            case 'cls':
            case 'clear':
                setHistory([]);
                setSuggestions([]);
                return;
            case '':
                break;
            default:
                output = `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`;
        }
    }

    if (output) {
      newHistory.push({ type: 'output', content: output });
    }
    setHistory(newHistory);
    setSuggestions([]);
  };

  const onInputChange = (text) => {
    setCurrentInput(text);
    if (text.length > 0) {
      const filtered = COMMAND_DATABASE.filter(c => 
        c.toLowerCase().startsWith(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
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
              {item.type === 'input' ? ADMIN_PROMPT : ''}{item.content}
            </Text>
          </View>
        ))}

        {/* Suggestions UI */}
        {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
                {suggestions.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.suggestionItem}
                        onPress={() => {
                            setCurrentInput(item);
                            setSuggestions([]);
                        }}
                    >
                        <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.promptText}>{ADMIN_PROMPT}</Text>
          <TextInput
            style={styles.input}
            value={currentInput}
            onChangeText={onInputChange}
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
    backgroundColor: '#0c0c0c',
    paddingTop: 40,
  },
  terminal: {
    flex: 1,
    paddingHorizontal: 12,
  },
  line: {
    marginBottom: 2,
  },
  inputText: {
    color: '#ffffff', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  outputText: {
    color: '#cccccc', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1e1e1e',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionItem: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    margin: 3,
  },
  suggestionText: {
    color: '#00D1FF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  promptText: {
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    padding: 0,
  },
});
