import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./Bottomnav";

interface CategoryColors {
  bg: string;
  progress: string;
  border: string;
}

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface CategoryTask {
  id: string;
  category: string;
  tasks: Task[];
  progress: number;
}

const Mytasks = () => {
  const [tasks, setTasks] = useState<CategoryTask[]>([
    {
      id: "1",
      category: "Medication",
      tasks: [
        { id: "101", title: "Take Aspirin", time: "8:00 AM", completed: false },
        { id: "102", title: "Take Vitamin D", time: "12:00 PM", completed: true },
      ],
      progress: 50,
    },
    {
      id: "2",
      category: "Fitness",
      tasks: [
        { id: "201", title: "Morning Walk", time: "7:00 AM", completed: true },
        { id: "202", title: "Yoga Session", time: "6:00 PM", completed: false },
      ],
      progress: 60,
    },
    {
      id: "3",
      category: "Socialize",
      tasks: [
        { id: "301", title: "Call Grandchildren", time: "5:00 PM", completed: true },
        { id: "302", title: "Join Friends Online", time: "8:00 PM", completed: false },
      ],
      progress: 50,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ category: "", title: "", time: "" });

  const categoryColors: Record<string, CategoryColors> = {
    default: {
      bg: '#f0f9ff',
      progress: '#0284c7',
      border: '#e0f2fe'
    }
  };

  const getCategoryColor = (category: string): CategoryColors => {
    return categoryColors[category] || categoryColors.default;
  };

  const toggleTaskCompletion = (categoryId: string, taskId: string) => {
    const updatedTasks = tasks.map((category) => {
      if (category.id === categoryId) {
        const updatedCategoryTasks = category.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedCategoryTasks.filter(
          (task) => task.completed
        ).length;
        const progress = Math.round(
          (completedCount / updatedCategoryTasks.length) * 100
        );
        return { ...category, tasks: updatedCategoryTasks, progress };
      }
      return category;
    });
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (!newTask.category || !newTask.title || !newTask.time) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const category = tasks.find((cat) => cat.category === newTask.category);

    if (category) {
      const updatedCategoryTasks = [
        ...category.tasks,
        {
          id: `${Date.now()}`,
          title: newTask.title,
          time: newTask.time,
          completed: false,
        },
      ];
      const updatedCategory = {
        ...category,
        tasks: updatedCategoryTasks,
        progress: Math.round(
          (updatedCategoryTasks.filter((task) => task.completed).length /
            updatedCategoryTasks.length) *
            100
        ),
      };
      setTasks(
        tasks.map((cat) => (cat.id === category.id ? updatedCategory : cat))
      );
    } else {
      const newCategory = {
        id: `${Date.now()}`,
        category: newTask.category,
        tasks: [
          {
            id: `${Date.now()}`,
            title: newTask.title,
            time: newTask.time,
            completed: false,
          },
        ],
        progress: 0,
      };
      setTasks([...tasks, newCategory]);
    }

    setNewTask({ category: "", title: "", time: "" });
    setModalVisible(false);
  };

  const handleDeleteTask = (categoryId: string, taskId: string) => {
    const updatedTasks = tasks.map((category) => {
      if (category.id === categoryId) {
        const filteredTasks = category.tasks.filter(
          (task) => task.id !== taskId
        );
        const progress = Math.round(
          (filteredTasks.filter((task) => task.completed).length /
            (filteredTasks.length || 1)) *
            100
        );
        return { ...category, tasks: filteredTasks, progress };
      }
      return category;
    });

    setTasks(updatedTasks.filter((category) => category.tasks.length > 0));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.outerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>Track your daily activities</Text>
        </View>
        
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const categoryColors = getCategoryColor(item.category);
            return (
              <View style={[
                styles.categoryContainer,
                { 
                  backgroundColor: categoryColors.bg,
                  borderColor: categoryColors.border,
                  borderWidth: 1
                }
              ]}>
                <View style={styles.categoryHeader}>
                  <View>
                    <Text style={styles.categoryTitle}>{item.category}</Text>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${item.progress}%`,
                            backgroundColor: categoryColors.progress
                          }
                        ]} 
                      />
                    </View>
                  </View>
                  <Text style={[
                    styles.progressText,
                    { color: categoryColors.progress }
                  ]}>
                    {item.progress}% Complete
                  </Text>
                </View>
                
                {item.tasks.map((task) => (
                  <View key={task.id} style={[
                    styles.taskRow,
                    { borderBottomColor: categoryColors.border }
                  ]}>
                    <View style={styles.taskTimeContainer}>
                      <Ionicons name="time-outline" size={20} color="#4b5563" />
                      <Text style={styles.taskTime}>{task.time}</Text>
                    </View>
                    
                    <View style={styles.taskContent}>
                      <Text style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted
                      ]}>
                        {task.title}
                      </Text>
                      
                      <View style={styles.taskActions}>
                        <TouchableOpacity
                          style={[
                            styles.statusButton,
                            task.completed && {
                              backgroundColor: categoryColors.progress
                            }
                          ]}
                          onPress={() => toggleTaskCompletion(item.id, task.id)}
                        >
                          {task.completed ? (
                            <Ionicons name="checkmark-circle" size={28} color="#fff" />
                          ) : (
                            <Ionicons name="radio-button-off" size={28} color={categoryColors.progress} />
                          )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteTask(item.id, task.id)}
                        >
                          <Ionicons name="trash-outline" size={24} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          }}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Task</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={28} color="#4b5563" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  placeholder="Enter category name"
                  style={styles.input}
                  value={newTask.category}
                  onChangeText={(text) => setNewTask({ ...newTask, category: text })}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Task Title</Text>
                <TextInput
                  placeholder="What needs to be done?"
                  style={styles.input}
                  value={newTask.title}
                  onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput
                  placeholder="e.g., 8:00 AM"
                  style={styles.input}
                  value={newTask.time}
                  onChangeText={(text) => setNewTask({ ...newTask, time: text })}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={handleAddTask}
              >
                <Text style={styles.addTaskButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    padding: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 6,
  },
  listContainer: {
    padding: 20,
  },
  categoryContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryHeader: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 6,
    fontWeight: "500",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  taskTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  taskTime: {
    fontSize: 15,
    color: "#4b5563",
    marginLeft: 6,
    fontWeight: "500",
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 17,
    color: "#111827",
    flex: 1,
    fontWeight: "500",
  },
  taskTitleCompleted: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusButton: {
    padding: 4,
  },
  statusButtonCompleted: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
  },
  deleteButton: {
    padding: 6,
  },
  addButton: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#2563eb",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 6,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addTaskButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
  },
  addTaskButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Mytasks;