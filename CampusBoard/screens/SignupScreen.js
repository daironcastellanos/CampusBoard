import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth functions
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

// Validation schema for the signup form
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [image, setImage] = useState(null); // State for storing selected image

  // Function to handle image selection, moved inside the component
  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // Function to handle user signup
  const handleSignUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is successfully signed up and logged in
        console.log("User signed up: ", userCredential.user);
        // TODO: Here you might want to upload the image to Firebase Storage and link it to the user's profile
        navigation.navigate('Login'); // Navigate to the Login screen after successful signup
      })
      .catch((error) => {
        console.error("Signup error: ", error.message);
        Alert.alert("Signup error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={({ email, password }) => handleSignUp(email, password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Name"
              style={styles.input}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Email"
              style={styles.input}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={styles.input}
            />
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <Button title="Pick an Image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            
            <Button onPress={handleSubmit} title="Sign Up" />
          </View>
        )}
      </Formik>
      <Button
        title="Already have an account? Log In"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

// Styles for the signup screen, including styles for the image
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  image: {
    width: 100, // You can adjust the size as needed
    height: 100,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default SignupScreen;
