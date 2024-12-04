import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./Bottomnav";

interface Medication {
  id: string;
  name: string;
  time: string;
  days: number;
  startDate: string;
}

const MedicationPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [markedDates, setMarkedDates] = useState<{
    [date: string]: { marked: boolean };
  }>({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCloseForm = () => {
    setShowAddForm(false);
    setNewMedication({});
  };

  const addMedication = () => {
    if (
      newMedication.name &&
      newMedication.time &&
      newMedication.days &&
      selectedDate
    ) {
      const medication: Medication = {
        id: `${Date.now()}`,
        name: newMedication.name,
        time: newMedication.time,
        days: newMedication.days,
        startDate: selectedDate,
      };

      setMedications((prev) => [...prev, medication]);
      markMedicationDates(selectedDate, newMedication.days);
      setNewMedication({});
      setShowAddForm(false);
      Alert.alert("Success", "Medication added successfully!");
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const markMedicationDates = (startDate: string, duration: number) => {
    const updatedMarkedDates = { ...markedDates };
    const start = new Date(startDate);

    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const formattedDate = currentDate.toISOString().split("T")[0];
      updatedMarkedDates[formattedDate] = { marked: true };
    }

    setMarkedDates(updatedMarkedDates);
  };

  const deleteMedication = (id: string) => {
    const medicationToDelete = medications.find((med) => med.id === id);
    if (medicationToDelete) {
      const updatedMarkedDates = { ...markedDates };
      const start = new Date(medicationToDelete.startDate);

      for (let i = 0; i < medicationToDelete.days; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const formattedDate = currentDate.toISOString().split("T")[0];
        delete updatedMarkedDates[formattedDate];
      }

      setMarkedDates(updatedMarkedDates);
    }

    setMedications((prev) => prev.filter((med) => med.id !== id));
    Alert.alert("Success", "Medication deleted successfully!");
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>My Medications</Text>

        <View style={styles.calendarCard}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#4682B4",
              },
            }}
            theme={{
              selectedDayBackgroundColor: "#4682B4",
              dotColor: "#4682B4",
              todayTextColor: "#4682B4",
            }}
          />
        </View>

        <View style={styles.medicationListContainer}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.medicationItem}>
                <View style={styles.medicationHeader}>
                  <Text style={styles.medicationName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => deleteMedication(item.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.medicationDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#666"
                    />
                    <Text style={styles.detailText}>
                      {item.days} days from {item.startDate}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.formWrapper}>
            <ScrollView style={styles.formContainer}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  onPress={handleCloseForm}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#4682B4" />
                </TouchableOpacity>
                <Text style={styles.formTitle}>Add New Medication</Text>
                <View style={styles.placeholder} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medication Name</Text>
                <TextInput
                  placeholder="Enter medication name"
                  style={styles.input}
                  value={newMedication.name}
                  onChangeText={(text) =>
                    setNewMedication({ ...newMedication, name: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#4682B4" />
                  <Text style={styles.timePickerText}>
                    {newMedication.time || "Select Time"}
                  </Text>
                </TouchableOpacity>
              </View>

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) {
                      const hours = selectedDate.getHours();
                      const minutes = selectedDate.getMinutes();
                      const time = `${hours % 12 || 12}:${minutes
                        .toString()
                        .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
                      setNewMedication({ ...newMedication, time });
                    }
                  }}
                />
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (days)</Text>
                <TextInput
                  placeholder="Enter number of days"
                  style={styles.input}
                  keyboardType="numeric"
                  value={newMedication.days?.toString()}
                  onChangeText={(text) =>
                    setNewMedication({ ...newMedication, days: parseInt(text) })
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={addMedication}
              >
                <Text style={styles.submitButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  medicationListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  medicationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  medicationDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4682B4',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  formWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 12,
  },
  timePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4682B4',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#4682B4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  flatListContainer: {
    paddingBottom: 16,
  },
});

export default MedicationPage;