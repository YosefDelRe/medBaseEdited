import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../database/firebase";

const CreateFilesScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [fileDetails, setFileDetails] = useState({
        clinic: '',
        date: '',
        doctor: '',
        fileName: '',
        filePath: '',
        fileUrl: '',
        observations: '',
        type: ''
    });

    const handleInputChange = (name, value) => {
        setFileDetails({ ...fileDetails, [name]: value });
    };

    const createFile = async () => {
        if (!fileDetails.clinic || !fileDetails.doctor || !fileDetails.observations) {
            alert("Por favor, completa todos los campos necesarios.");
            return;
        }
    
        try {
            console.log(userId);
            const newDocRef = db.collection('files').doc();
            await newDocRef.set({
                ...fileDetails,
                id: newDocRef.id,
                userId: userId
            });
            alert("Archivo creado con éxito.");
            navigation.goBack();
        } catch (error) {
            console.error("Error creando el archivo:", error);
            alert("Error al crear el archivo.");
        }
    };
    

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Clínica"
                onChangeText={(value) => handleInputChange('clinic', value)}
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha"
                onChangeText={(value2) => handleInputChange('date', value2)}
                style={styles.input}
            />
            <TextInput
                placeholder="Doctor"
                onChangeText={(value3) => handleInputChange('doctor', value3)}
                style={styles.input}
            />
            <TextInput
                placeholder="FileName"
                onChangeText={(value4) => handleInputChange('FileName', value4)}
                style={styles.input}
            />
            <TextInput
                placeholder="filePath"
                onChangeText={(value5) => handleInputChange('filePath', value5)}
                style={styles.input}
            />
            <TextInput
                placeholder="fileUrl"
                onChangeText={(value6) => handleInputChange('fileUrl', value6)}
                style={styles.input}
            />
            <TextInput
                placeholder="Observaciones "
                onChangeText={(value8) => handleInputChange('observations', value8)}
                style={styles.input}
            />
            <TextInput
                placeholder="Tipo"
                onChangeText={(value9) => handleInputChange('type', value9)}
                style={styles.input}
            />
            <Button title="Crear Archivo" onPress={createFile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    }
});

export default CreateFilesScreen;
