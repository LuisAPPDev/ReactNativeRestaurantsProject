import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from "react-native"
import { Divider } from "react-native-elements"
import { withNavigation } from "react-navigation"

export default function Login() {
    
    return (
        <ScrollView>
            <Image
            source={require("../../../assets/img/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            />
            <View style={styles.viewContain}>
              <Text>Form Login...</Text>
                {/* <Text>Create account...</Text> */}
                <CreateAccount />
                
            </View>
            <Divider style={styles.divider}></Divider>
            <View style={styles.viewContain}>
                <Text>Login Facebook...</Text>
            </View>
        </ScrollView>
    )

}

function CreateAccount(props) {
    const { } = props
    
    return (
        <>
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?
        </Text>
        <Text style={styles.btnRegister}
        onPress={()=> console.log("Navegando al formulario de registro") }>
                Registrarte
        </Text>
            </>
    )
}

const styles = StyleSheet.create({

    logo: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    viewContain: {
        marginRight: 40,
        marginLeft:40
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight:10
    },
    btnRegister: {
        color: "#00a680",
      fontWeight:"bold"  

    },
    divider: {
        backgroundColor: "#00a680",
        margin:40
        
    }
})
