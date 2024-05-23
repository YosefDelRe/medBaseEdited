import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth, EmailAuthProvider } from "../database/firebase"; 

const ChangeEmailScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');

    const reauthenticate = async (currentPassword) => {
        try {
            var user = auth.currentUser;
            var cred = EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(cred);
            //console.log("Re-autenticacion exitosa");
            return true;
        } catch (error) {
            //console.error("Error durante la re-autenticacion:", error);
            Alert.alert('Re-autenticacion fallada', error.message);
            return false;
        }
    };

    const sendVerificationEmail = async (newEmail) => {
        try {
            await auth.currentUser.verifyBeforeUpdateEmail(newEmail);
            Alert.alert('Verification Email Sent', 'Por favor revise su correo electrónico para verificar la nueva dirección antes de actualizar.');
        } catch (error) {
            console.error("Error enviado el correo de verificación:", error);
            Alert.alert('Correo electrónico de verificación fallido', error.message);
        }
    };

    const handleChangeEmail = async () => {
        
        if (email === '' || confirmEmail === '' || password === '') {
            Alert.alert('Por favor, llene todos los campos');
            return;
        }

        if (email !== confirmEmail) {
            Alert.alert('Error', 'Los correos electrónicos no coinciden. Inténtalo de nuevo.');
            return;
        }

        if (await reauthenticate(password)) {
            alert('Se ha enviado un correo con la confirmación de cambio, por favor, revise su correo para verificar la nueva dirección');
            await sendVerificationEmail(email);
            
            
            navigation.pop(2);
        } else {
            Alert.alert("Error de reautenticación, no se puede enviar el correo electrónico de verificación");
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
});

export default ChangeEmailScreen;
