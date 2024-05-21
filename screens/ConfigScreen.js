import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from "../database/firebase";
import { Ionicons } from '@expo/vector-icons';

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
        <LinearGradient
            colors={['#8fbced', '#5d7eeb']}  // Un azul más claro en el inicio que se fusiona con el azul de los botones
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangeEmailScreen')}>
                <Text style={styles.buttonText}>Cambiar Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangePasswordScreen')}>
                <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </LinearGradient>
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
        borderColor: '#5d7eeb',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white'  // Fondo blanco para los inputs para mejor contraste
    },
    button: {
        width: '85%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 10,
        backgroundColor: '#486CE1'  // Color sólido para los botones
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    saveButton: {
        flexDirection: 'row',
        width: '85%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#486CE1',
        marginBottom: 10
    }
});

export default ConfigScreen;
