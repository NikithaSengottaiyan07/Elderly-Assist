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

const Mytasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      category: "Medication",
      tasks: [
        { id: "101", title: "Take Aspirin", time: "8:00 AM", completed: false },
        {
          id: "102",
          title: "Take Vitamin D",
          time: "12:00 PM",
          completed: true,
        },
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
        {
          id: "301",
          title: "Call Grandchildren",
          time: "5:00 PM",
          completed: true,
        },
        {
          id: "302",
          title: "Join Friends Online",
          time: "8:00 PM",
          completed: false,
        },
      ],
      progress: 50,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ category: "", title: "", time: "" });

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
      // Add the task to an existing category
      const updatedCategoryTasks = [
        ...category.tasks,
        {
          id: `${Date.now()}`, // Generate unique ID for each task
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
      // Create a new category if it doesn't exist
      const newCategory = {
        id: `${Date.now()}`, // Generate unique ID for each category
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

    // Reset modal state after adding the task
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
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <View>
                  <Text style={styles.categoryTitle}>{item.category}</Text>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${item.progress}%` }
                      ]} 
                    />
                  </View>
                </View>
                <Text style={styles.progressText}>{item.progress}% Complete</Text>
              </View>
              
              {item.tasks.map((task) => (
                <View key={task.id} style={styles.taskRow}>
                  <View style={styles.taskTimeContainer}>
                    <Ionicons name="time-outline" size={16} color="#64748b" />
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
                          task.completed && styles.statusButtonCompleted
                        ]}
                        onPress={() => toggleTaskCompletion(item.id, task.id)}
                      >
                        {task.completed ? (
                          <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        ) : (
                          <Ionicons name="radio-button-off" size={24} color="#64748b" />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteTask(item.id, task.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Task</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
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
    backgroundColor: "#f8fafc",
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  taskTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 90,
  },
  taskTime: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },
  taskTitleCompleted: {
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusButton: {
    marginRight: 12,
  },
  statusButtonCompleted: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3b82f6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  addTaskButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addTaskButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Mytasks;