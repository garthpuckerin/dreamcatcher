/**
 * Quick Capture Screen
 *
 * Fast fragment/idea capture interface
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ApiService } from '../services/api';

interface Dream {
  id: string;
  title: string;
}

export default function QuickCaptureScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDream, setSelectedDream] = useState<string | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDreams, setLoadingDreams] = useState(true);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const response = await ApiService.getDreams();
      setDreams(response.filter((d: any) => d.status !== 'completed'));

      // Auto-select last active dream
      if (response.length > 0) {
        setSelectedDream(response[0].id);
      }
    } catch (error) {
      console.error('Failed to load dreams:', error);
    } finally {
      setLoadingDreams(false);
    }
  };

  const handleCapture = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please enter both title and content');
      return;
    }

    if (!selectedDream) {
      Alert.alert('No dream selected', 'Please select a dream');
      return;
    }

    setLoading(true);

    try {
      await ApiService.createFragment({
        dreamId: selectedDream,
        title: title.trim(),
        content: content.trim(),
        type: 'note',
      });

      Alert.alert('Success', 'Fragment captured!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture fragment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDreams) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Select Dream</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dreams.map((dream) => (
            <TouchableOpacity
              key={dream.id}
              style={[
                styles.dreamChip,
                selectedDream === dream.id && styles.dreamChipSelected,
              ]}
              onPress={() => setSelectedDream(dream.id)}
            >
              <Text
                style={[
                  styles.dreamChipText,
                  selectedDream === dream.id && styles.dreamChipTextSelected,
                ]}
              >
                {dream.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {dreams.length === 0 && (
          <Text style={styles.emptyText}>
            No active dreams. Create a dream first.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Quick thought..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind?"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.captureButton, loading && styles.captureButtonDisabled]}
        onPress={handleCapture}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.captureButtonText}>💭 Capture</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1a202c',
  },
  textArea: {
    minHeight: 150,
  },
  dreamChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    marginRight: 8,
  },
  dreamChipSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  dreamChipText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  dreamChipTextSelected: {
    color: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  captureButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
});
