import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Button } from 'react-native';
import { auth, EmailAuthProvider } from "../database/firebase";

const ChangePasswordScreen = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const reauthenticate = async (currentPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await user.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            setModalMessage('La contraseña actual es incorrecta.');
            setModalVisible(true);
            return false;
        }
    };    

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            setModalMessage('Las contraseñas nuevas no coinciden.');
            setModalVisible(true);
            return;
        }
        const reauthenticated = await reauthenticate(currentPassword);
        if (reauthenticated) {
            const user = auth.currentUser;
            try {
                await user.updatePassword(newPassword);
                setModalMessage('Tu contraseña ha sido actualizada exitosamente.');
                setModalVisible(true);
                setTimeout(() => {
                    navigation.pop(2);
                }, 2000);
            } catch (error) {
                setModalMessage(error.message);
                setModalVisible(true);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cambiar Contraseña</Text>
            <TextInput
                placeholder="Contraseña actual"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={styles.input}
            />
            <TextInput
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
            />
            <TextInput
                placeholder="Confirmar nueva contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
                <Text style={styles.buttonText}>Guardar nueva contraseña</Text>
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
        alignSelf: 'center',
    },
    input: {
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        width: '100%',
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

export default ChangePasswordScreen;
