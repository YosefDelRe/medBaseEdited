import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
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
            console.log("Re-authentication successful");
            return true;
        } catch (error) {
            console.error("Error during re-authentication:", error);
            Alert.alert('Re-authentication Failed', error.message);
            return false;
        }
    };

    const sendVerificationEmail = async (newEmail) => {
        try {
            await auth.currentUser.verifyBeforeUpdateEmail(newEmail);
            Alert.alert('Verification Email Sent', 'Please check your email to verify the new address before updating.');
        } catch (error) {
            console.error("Error sending verification email:", error);
            Alert.alert('Verification Email Failed', error.message);
        }
    };

    const handleChangeEmail = async () => {
        console.log("Attempt to update email to:", email);
        if (email === '' || confirmEmail === '' || password === '') {
            Alert.alert('Please enter all fields');
            return;
        }

        if (email !== confirmEmail) {
            Alert.alert('Error', 'The emails do not match. Please try again.');
            return;
        }

        if (await reauthenticate(password)) {
            await sendVerificationEmail(email);
            // Aquí podría ir lógica para confirmar que el correo ha sido verificado antes de llamar a updateEmail
            // Puede ser necesario manejar esto con un enlace de retorno o una verificación explícita por parte del usuario
            navigation.pop(2);
        } else {
            console.log("Re-authentication failed, unable to send verification email");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Change Email</Text>
            <TextInput
                placeholder="Enter new email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Confirm new email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Confirm your current password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
            />
            <Button
                title="Update Email"
                onPress={handleChangeEmail}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 20,
        marginBottom: 15,
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
    },
});

export default ChangeEmailScreen;
