import React from "react"
import { StyleSheet, View, ScrollView, Text, Image } from "react-native"
import {Button} from "react-native-elements"
import {withNavigation} from "react-navigation"

function UserGuest(props) {
    const { navigation } = props;
    return (
    
        <ScrollView style={styles.viewBody} centerContent={true}>

            <Image
                source={require("../../../assets/img/original.jpg")}
                style={styles.images}
                resizeMode="contain"
            />
            <Text style={styles.title}>Consulta tu perfil de Top Tenedores</Text>
            <Text style={styles.description}>
                ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores
                restaurantes de una manera sencilla, vota cual te ha gustado más y
                comenta como ha sido tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    title="Ver tu perfil"
                    onPress={()=> navigation.navigate("Login")}
                >
                </Button>
            </View>
        </ScrollView>
)

}

export default withNavigation(UserGuest)

const styles = StyleSheet.create({

    viewBody: {
        marginLeft: 30,
        marginRight:30
    },
    images: {
        height: 300,
        width: "100%",
        marginTop:40
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        textAlign: "center",
        marginBottom: 10
    },
    description: {
        textAlign: "center",
        marginBottom:20
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        
        width: "70%"

    }


})