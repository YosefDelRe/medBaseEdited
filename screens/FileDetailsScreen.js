import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FileDetailsScreen = ({ route }) => {
    const { fileDetails } = route.params;

    const handleOpenFile = () => {
        if (fileDetails.fileUrl) {
            Linking.openURL(fileDetails.fileUrl).catch(err => {
                console.error("Failed to open URL", err);
                alert("No se pudo abrir el archivo.");
            });
        } else {
            alert("No hay archivo disponible.");
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
            <TouchableOpacity style={styles.button} onPress={handleOpenFile}>
                <Text style={styles.buttonText}>Consultar Archivo</Text>
            </TouchableOpacity>
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
});

export default FileDetailsScreen;
