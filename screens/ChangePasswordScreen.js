import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth, EmailAuthProvider } from "../database/firebase";

const ChangePasswordScreen = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const reauthenticate = async (currentPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await user.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            Alert.alert('Error', 'La contraseña actual es incorrecta.');
            return false;
        }
    };    

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
            return;
        }
        const reauthenticated = await reauthenticate(currentPassword);
        if (reauthenticated) {
            const user = auth.currentUser;
            try {
                await user.updatePassword(newPassword);
                Alert.alert('Contraseña actualizada', 'Tu contraseña ha sido actualizada exitosamente.');
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error', error.message);
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
});

export default ChangePasswordScreen;
