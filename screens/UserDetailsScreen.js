import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { db } from "../database/firebase";

const UserDetailsScreen = ({ route, navigation }) => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        curp: ''
    });

    useEffect(() => {
        const userId = route.params.userId;
        const userRef = db.collection('users').doc(userId);

        const unsubscribe = userRef.onSnapshot(doc => {
            if (doc.exists) {
                setUserDetails(doc.data());
            } else {
                console.log('No such document!');
            }
        });

        return () => unsubscribe();
    }, [route.params.userId]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Bienvenido</Text>
            <Text>CURP: {userDetails.curp}</Text>
            <Text>Nombre: {userDetails.name}</Text>
            <Text>Email: {userDetails.email}</Text>
            <Button
                title="Configuración"
                onPress={() => navigation.navigate('ConfigScreen', { userId: route.params.userId })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default UserDetailsScreen;
