import React, {useRef} from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from "react-native"
import { Divider } from "react-native-elements"
import { withNavigation } from "react-navigation"
import LoginForm from "../../components/Account/LoginForm"
import Toast from "react-native-easy-toast"
import LoginFacebook from "../../components/Account/LoginFacebook"


export default function Login(props) {
    const { navigation } = props
    const toastRef = useRef()

    return (
        <ScrollView>
            <Image
            source={require("../../../assets/img/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            />
            <View style={styles.viewContain}>
                <LoginForm toastRef={toastRef}/>
                {/* <Text>Create account...</Text> */}
                <CreateAccount navigation={navigation}/>
                
            </View>
            <Divider style={styles.divider}></Divider>
            <View style={styles.viewContain}>
                <LoginFacebook toastRef={toastRef} navigation={navigation}/>
            </View>
            <Toast ref={toastRef} position="center" opacity={0.5}/>
        </ScrollView>
    )

}

function CreateAccount(props) {
    const { navigation } = props
    
    return (
        <>
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?
        </Text>
        <Text style={styles.btnRegister}
                onPress={() => navigation.navigate("Register") }
        >
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
