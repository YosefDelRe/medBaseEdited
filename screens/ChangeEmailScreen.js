import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { auth, EmailAuthProvider } from "../database/firebase";

const ChangeEmailScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const reauthenticate = async (currentPassword) => {
        try {
            var user = auth.currentUser;
            var cred = EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(cred);
            return true;
        } catch (error) {
            setModalMessage('Re-autenticación fallada: ' + error.message);
            setModalVisible(true);
            return false;
        }
    };

    const sendVerificationEmail = async (newEmail) => {
        try {
            await auth.currentUser.verifyBeforeUpdateEmail(newEmail);
            setModalMessage('Correo de verificación enviado. Por favor revise su correo electrónico para verificar la nueva dirección antes de actualizar.');
            setModalVisible(true);
        } catch (error) {
            setModalMessage('Correo electrónico de verificación fallido: ' + error.message);
            setModalVisible(true);
        }
    };

    const handleChangeEmail = async () => {
        if (email === '' || confirmEmail === '' || password === '') {
            setModalMessage('Por favor, llene todos los campos');
            setModalVisible(true);
            return;
        }

        if (email !== confirmEmail) {
            setModalMessage('Los correos electrónicos no coinciden. Inténtalo de nuevo.');
            setModalVisible(true);
            return;
        }

        if (await reauthenticate(password)) {
            setModalMessage('Se ha enviado un correo con la confirmación de cambio, por favor, revise su correo para verificar la nueva dirección.');
            setModalVisible(true);
            await sendVerificationEmail(email);
            navigation.pop(2);
        } else {
            setModalMessage('Error de reautenticación, no se puede enviar el correo electrónico de verificación');
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cambiar Correo Electrónico</Text>
            <TextInput
                placeholder="Ingresar Nuevo Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Confirmar Nuevo Correo Electrónico"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Ingresar Contraseña Actual"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
                <Text style={styles.buttonText}>Guardar Email</Text>
            </TouchableOpacity>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#5d7eeb',
    },
    input: {
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#5d7eeb',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
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

export default ChangeEmailScreen;
