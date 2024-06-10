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
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribeUser = db.collection('users').doc(userId).onSnapshot(doc => {
            if (doc.exists) {
                setUserDetails(doc.data());
            } else {
                console.log('No such document!');
            }
        });

        const fetchFiles = async () => {
            setLoading(true);
            const filesRef = db.collection('files').where('userId', '==', uid).orderBy('date', 'desc').limit(4);
        
            try {
                const snapshot = await filesRef.get();
                if (snapshot.empty) {
                    console.log("No matching documents.");
                    setLoading(false);
                    return;
                }
                const filesArray = snapshot.docs.map(doc => doc.data());
                console.log("Files loaded:", filesArray); // Loguear los datos cargados
                setFiles(filesArray);
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
            setLoading(false);
        };

        fetchFiles();

        return () => {
            unsubscribeUser();
        };
    }, [userId, uid]);

    const fetchMoreFiles = async () => {
        if (lastVisible && !loading) {
            setLoading(true);
            const filesRef = db.collection('files').where('userId', '==', uid)
                .orderBy('date', 'desc').startAfter(lastVisible).limit(4);
    
            try {
                const snapshot = await filesRef.get();
                const newFiles = snapshot.docs.map(doc => doc.data());
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            } catch (error) {
                console.error("Error fetching more files:", error);
            }
            setLoading(false);
        }
    };

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
            {lastVisible && (
                <Button
                    title="Cargar más"
                    onPress={fetchMoreFiles}
                    color="#5d7eeb"
                />
            )}
            {loading && <Text>Cargando...</Text>}
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
