import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { db, auth } from "../database/firebase";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const UserDetailsScreen = ({ route, navigation }) => {
    const { userId, uid } = route.params;
    const [files, setFiles] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        curp: ''
    });

    useEffect(() => {
        const userRef = db.collection('users').doc(userId);
        const filesRef = db.collection('files').where('userId', '==', uid);
    
        const unsubscribeUser = userRef.onSnapshot(doc => {
            if (doc.exists) {
                setUserDetails(doc.data());
            } else {
                console.log('No such document!');
            }
        });
    
        const unsubscribeFiles = filesRef.onSnapshot(snapshot => {
            const filesArray = [];
            snapshot.forEach(doc => {
                filesArray.push(doc.data());
            });
            setFiles(filesArray);
        });
    
        return () => {
            unsubscribeUser();
            unsubscribeFiles();
        };
    }, [userId, uid]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.log('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.upperContainer}>
                <Text style={styles.header}>Bienvenido {userDetails.name}</Text>
                <View style={styles.curpContainer}>
                    <Text style={styles.boldText}>CURP: {userDetails.curp}</Text>
                    <View style={styles.iconContainer}>
                        <MaterialIcons 
                            name="settings" 
                            size={24} 
                            color="white" 
                            onPress={() => navigation.navigate('ConfigScreen', { userId: userDetails.curp })}
                        />
                        <MaterialIcons 
                            name="exit-to-app" 
                            size={24} 
                            color="white" 
                            onPress={handleLogout}
                        />
                    </View>
                </View>
            </View>
            <Text style={styles.header}>Expedientes</Text>
            {files.map((file, index) => (
                <View key={index} style={styles.fileContainer}>
                    <View style={styles.fileRow}>
                        <MaterialIcons name="local-hospital" size={24} color="white" />
                        <Text style={styles.fileText}>Clínica: {file.clinic}</Text>
                    </View>
                    <View style={styles.fileRow}>
                        <FontAwesome name="user-md" size={24} color="white" />
                        <Text style={styles.fileText}>Doctor: {file.doctor}</Text>
                    </View>
                    <View style={styles.fileRow}>
                        <MaterialIcons name="description" size={24} color="white" />
                        <Text style={styles.fileText}>Observaciones: {file.observations}</Text>
                    </View>
                    <Button
                        title="Ver Detalles"
                        color="#5d7eeb"
                        onPress={() => navigation.navigate('FileDetailsScreen', { fileDetails: file })}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0'
    },
    upperContainer: {
        backgroundColor: '#a6c1ee',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a5588',
        marginBottom: 20,
    },
    curpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boldText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a5588'
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexGrow: 1
    },
    fileContainer: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#5d7eeb',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    fileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    fileText: {
        fontSize: 14,
        color: '#ffffff',
        marginLeft: 10
    }
});

export default UserDetailsScreen;
