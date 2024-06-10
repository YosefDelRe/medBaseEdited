import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from "../database/firebase";
import { Ionicons } from '@expo/vector-icons';

const ConfigScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [userDetails, setUserDetails] = useState({
        name: '',
        curp: ''
    });
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doc = await db.collection('users').doc(userId).get();
                if (doc.exists) {
                    setUserDetails({
                        name: doc.data().name || '',
                        curp: doc.data().curp || ''
                    });
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleChangeText = (name, value) => {
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSave = async () => {
        try {
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();
            if (doc.exists) {
                await userRef.update({
                    name: userDetails.name,
                    curp: userDetails.curp
                });
                setModalMessage('Datos actualizados correctamente');
                setModalVisible(true);
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                setModalMessage('No se encontró el documento del usuario para actualizar.');
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error updating user data: ", error);
            setModalMessage('Error al actualizar los datos.');
            setModalVisible(true);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#8fbced', '#5d7eeb']}
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
        backgroundColor: 'white'
    },
    button: {
        width: '85%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 10,
        backgroundColor: '#486CE1'
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

export default ConfigScreen;
