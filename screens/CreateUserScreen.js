import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Button } from "react-native";
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

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleChangeText = (name, value) => {
        setState({ ...state, [name]: value });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateCurp = (curp) => {
        const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
        console.log("CURP validation:", regex.test(curp)); // Añadir mensaje de consola
        return regex.test(curp);
    };

    const saveNewUser = async () => {
        if (state.name === '' || state.email === '' || state.curp === '' || state.password === '') {
            setModalMessage('Por favor, completa todos los campos.');
            setModalVisible(true);
        } else if (!validateEmail(state.email)) {
            setModalMessage('Correo inválido. Por favor, ingresa un correo válido.');
            setModalVisible(true);
        } else if (!validateCurp(state.curp)) {
            setModalMessage('CURP inválida. Por favor, ingresa una CURP válida.');
            setModalVisible(true);
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

                setModalMessage('Usuario registrado correctamente.');
                setModalVisible(true);
                setTimeout(() => {
                    navigation.navigate('LoginScreen');
                }, 2000);
            } catch (error) {
                console.error("Error al registrar el usuario:", error);
                setModalMessage('Error al registrar usuario: ' + error.message);
                setModalVisible(true);
            }
        }
    };

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
                    <Text style={styles.logoText}>Crear Usuario</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Feather name="user" size={24} color="white" style={styles.icon} />
                    <TextInput
                        placeholder="Nombre"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('name', value)}
                        style={styles.input}
                        value={state.name}
                    />
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
                    <Feather name="file-text" size={24} color="white" style={styles.icon} />
                    <TextInput
                        placeholder="CURP"
                        placeholderTextColor="white"
                        onChangeText={(value) => handleChangeText('curp', value)}
                        style={styles.input}
                        value={state.curp}
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
                <TouchableOpacity style={styles.button} onPress={saveNewUser}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Button
                            title="Cerrar"
                            onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </View>
            </Modal>
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
        marginBottom: 30
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10
    },
    inputGroup: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        color: 'white',
        paddingBottom: 10,
        fontSize: 16
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#5d7eeb',
        fontSize: 16
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default CreateUserScreen;
