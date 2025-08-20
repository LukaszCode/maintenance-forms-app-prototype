// This screen contains the facilities check form

import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  fullName: string;
  email: string;
};

const FormScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    Alert.alert("Form Submitted", JSON.stringify(data));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <Controller
        control={control}
        name="fullName"
        rules={{ required: "Full Name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.fullName && (
        <Text style={styles.error}>{errors.fullName.message}</Text>
      )}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 15,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});
