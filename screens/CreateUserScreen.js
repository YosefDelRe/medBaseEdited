import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { db, auth } from "../database/firebase";

const CreateUserScreen = ({ navigation }) => {
    const [state, setState] = useState({
        name: '',
        email: '',
        curp: '',
        password: ''
    });

    const handleChangeText = (name, value) => {
        setState({ ...state, [name]: value });
    };

    const saveNewUser = async () => {
        if (state.name === '' || state.email === '' || state.curp === '' || state.password === '') {
            alert('Por favor, completa todos los campos.');
        } else {
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(state.email, state.password);
                const user = userCredential.user;

                await db.collection('users').doc(state.curp).set({
                    id: user.uid,
                    name: state.name,
                    email: state.email,
                    curp: state.curp,
                    createdAt: new Date().toISOString(),
                    plan: "plan1",
                    role: "user"
                });

                await db.collection('users').doc(user.uid).set({
                    curp: state.curp
                });

                alert('Usuario registrado correctamente.');
                navigation.navigate('LoginScreen');
            } catch (error) {
                console.error("Error al registrar el usuario:", error);
                alert('Error al registrar usuario: ' + error.message);
            }
        }
    };
       

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#5d7eeb', '#8491ff']}
                style={styles.gradient}
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/icon2.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.logoText}>Crear Usuario</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="user" size={24} color="white" style={styles.icon} />
                    <TextInput 
                        placeholder="Nombre"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('name', value)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="mail" size={24} color="white" style={styles.icon} />
                    <TextInput 
                        placeholder="Email"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('email', value)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="file-text" size={24} color="white" style={styles.icon} />
                    <TextInput 
                        placeholder="CURP"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('curp', value)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="lock" size={24} color="white" style={styles.icon} />
                    <TextInput 
                        placeholder="Contraseña"
                        secureTextEntry={true}
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('password', value)}
                        style={styles.input}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={saveNewUser}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        padding: 30,
        justifyContent: 'center',
        minHeight: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100, 
        resizeMode: 'contain',
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputGroup: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: 'white',
        paddingBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#5d7eeb',
        fontSize: 16,
    }
});

export default CreateUserScreen;
