import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface JoinChannelTestProps {
  channelId: string;
  onJoinChannel: (channelId: string) => void;
  onCheckStatus: (channelId: string) => void;
  isJoining?: boolean;
  isJoined?: boolean;
}

export const JoinChannelTest: React.FC<JoinChannelTestProps> = ({
  channelId,
  onJoinChannel,
  onCheckStatus,
  isJoining = false,
  isJoined = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>频道加入测试</Text>
      <Text style={styles.channelId}>频道ID: {channelId}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isJoining && styles.buttonDisabled]}
          onPress={() => onJoinChannel(channelId)}
          disabled={isJoining}
        >
          <Text style={styles.buttonText}>
            {isJoining ? '正在加入...' : '加入频道'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => onCheckStatus(channelId)}
        >
          <Text style={styles.buttonText}>检查状态</Text>
        </TouchableOpacity>
      </View>
      
      {isJoined && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>✅ 已加入频道</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  channelId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 4,
  },
  statusText: {
    color: '#2d5a2d',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 