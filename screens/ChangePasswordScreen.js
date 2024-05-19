import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth, EmailAuthProvider } from "../database/firebase";

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
            <TextInput
                placeholder="Contraseña actual"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={styles.input}
            />
            <Button title="Guardar nueva contraseña" onPress={handleSavePassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '85%',
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    }
});

export default ChangePasswordScreen;
