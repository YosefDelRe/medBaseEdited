import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FileDetailsScreen = ({ route }) => {
    const { fileDetails } = route.params;

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
                <Ionicons name="document-text-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Nombre del archivo:</Text>
                <Text style={styles.text}>{fileDetails.fileName}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="folder-open-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>Ruta del archivo:</Text>
                <Text style={styles.text}>{fileDetails.filePath}</Text>
            </View>
            <View style={styles.detailCard}>
                <Ionicons name="link-outline" size={24} color="#5d7eeb" />
                <Text style={styles.label}>URL del archivo:</Text>
                <Text style={styles.text}>{fileDetails.fileUrl}</Text>
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
});

export default FileDetailsScreen;
