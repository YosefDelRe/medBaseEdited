import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { db, auth } from "../database/firebase";
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const handleChangeText = (name, value) => {
        setState({ ...state, [name]: value });
    };

    const loginUser = async () => {
        if (state.email === '' || state.password === '') {
            alert('Ingresa todos los datos');
        } else {
            try {
                const userCredential = await auth.signInWithEmailAndPassword(state.email, state.password);
                const user = userCredential.user;
    
                const userDoc = await db.collection('users').where('id', '==', user.uid).get();
                if (!userDoc.empty) {
                    const userData = userDoc.docs[0].data();
                    alert('Usuario autenticado');
                    navigation.navigate('UserDetailsScreen', { userId: userData.curp, uid: user.uid });
                } else {
                    alert('No se encontró el documento del usuario.');
                }
            } catch (error) {
                alert('Información Incorrecta');
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setState({ email: '', password: '' });
        }, [])
    );

    return (
        <LinearGradient
            colors={['#5d7eeb', '#8491ff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/icon2.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.logoText}>MedBase</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="mail" size={24} color="white" style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('email', value)}
                        style={styles.input}
                        value={state.email}
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
                        value={state.password}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={loginUser}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateUserScreens')}>
                        <Text style={styles.linkText}>Regístrate.</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        padding: 30
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
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    registerText: {
        color: 'white',
    },
    linkText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default LoginScreen;
