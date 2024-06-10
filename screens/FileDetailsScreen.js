import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from "../database/firebase";

const FileDetailsScreen = ({ route }) => {
    const { fileId } = route.params;
    const [fileDetails, setFileDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchFileDetails = async () => {
            const docRef = db.collection('files').doc(fileId);
            try {
                const doc = await docRef.get();
                if (doc.exists) {
                    setFileDetails(doc.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error("Error fetching file details:", error);
            }
        };

        fetchFileDetails();
    }, [fileId]);

    if (!fileDetails) {
        return <Text>Cargando detalles del archivo...</Text>;
    }

    const handleFileOpen = () => {
        if (fileDetails.fileUrl) {
            Linking.openURL(fileDetails.fileUrl).catch(err => {
                console.error("Failed to open URL", err);
                setModalMessage("No se pudo abrir el archivo.");
                setModalVisible(true);
            });
        } else {
            setModalMessage("No hay archivo disponible.");
            setModalVisible(true);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="document-text-outline" size={30} color="#fff" />
                <Text style={styles.header}>Detalles del Archivo</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="business-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Clínica:</Text>
                <Text style={styles.text}>{fileDetails.clinic}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="calendar-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.text}>{fileDetails.date}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="person-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Doctor:</Text>
                <Text style={styles.text}>{fileDetails.doctor}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="clipboard-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Observaciones:</Text>
                <Text style={styles.text}>{fileDetails.observations}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="list-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.text}>{fileDetails.type}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleFileOpen}>
                <Text style={styles.buttonText}>Consultar Archivo</Text>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5d7eeb',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5d7eeb',
        marginLeft: 10,
        width: 120,
    },
    text: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#5d7eeb',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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

export default FileDetailsScreen;
