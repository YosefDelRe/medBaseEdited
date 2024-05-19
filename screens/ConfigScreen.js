import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from "../database/firebase";

const ConfigScreen = ({ route, navigation }) => {
    const userId = route.params.userId;

    const [userDetails, setUserDetails] = useState({
        name: '',
        curp: '',
        email: '',
        password: '' 
    });

    useEffect(() => {
        const fetchData = async () => {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                setUserDetails(doc.data());
            }
        };
        fetchData();
    }, [userId]);

    const handleChangeText = (name, value) => {
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSave = async () => {
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
            name: userDetails.name,
            curp: userDetails.curp
        });
        alert('Datos actualizados correctamente');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nombre"
                value={userDetails.name}
                onChangeText={(value) => handleChangeText('name', value)}
                style={styles.input}
            />
            <TextInput
                placeholder="CURP"
                value={userDetails.curp}
                onChangeText={(value) => handleChangeText('curp', value)}
                style={styles.input}
            />
            <View style={styles.inputWithButton}>
                <TextInput
                    value={userDetails.email}
                    editable={false}
                    style={[styles.input, styles.disabledInput]}
                />
                <Button
                    title="Cambiar"
                    onPress={() => navigation.navigate('ChangeEmailScreen')}
                />
            </View>
            <View style={styles.inputWithButton}>
                <TextInput
                    value="********"
                    editable={false}
                    style={[styles.input, styles.disabledInput]}
                />
                <Button
                    title="Cambiar"
                    onPress={() => navigation.navigate('ChangePasswordScreen')}
                />
            </View>
            <Button title="Guardar Cambios" onPress={handleSave} />
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
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#a1a1a1'
    },
    inputWithButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    }
});

export default ConfigScreen;
