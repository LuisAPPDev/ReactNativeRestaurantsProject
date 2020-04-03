import React, {useState, useEffect} from 'react'
import { StyleSheet, ScrollView , View, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"


const widthScreen = Dimensions.get("window").width


export default function AddRestaurantForm(props) {
    
    const {navigation, setIsLoading, toastRef} = props
    const [imagesSelected, setImagesSelected] = useState([])
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")


    return (
        <ScrollView>
            <MainImage imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantName={setRestaurantName}
                setRestaurantDescription={setRestaurantDescription} />
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}/>


        </ScrollView>
    )
}


function MainImage(props) {
    const { imageRestaurant } = props
    
    return (
        <View style={styles.viewMainImage}>
            {imageRestaurant ? (
                <Image
                    source={{ uri: imageRestaurant }}
                    style={{ width: widthScreen, height:200 }}
                />
            ) : (
                    <Image
                        source={require("../../../assets/img/noimage.png")}
                        style={{width: widthScreen, height:200}}
                    
                    />
            )}
        </View>
    )

}

function UploadImage(props) {
    const {imagesSelected, setImagesSelected, toastRef} = props
    
    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status
        
        if (resultPermissionCamera === "denied") {
            toastRef.current.show("Debe aceptar los permisos de la galería",3000)

        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if (result.cancelled) {
                toastRef.current.show("Ha cerrado la galería sin seleccionar ninguna imagen",3000)
            } else {
                setImagesSelected([...imagesSelected,result.uri])
                
            }  
        }
    }

    const removeImage = image => {
        
        const arrayImages = imagesSelected

        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress:()=> setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                }
            ],
            {cancelable:false}
            
        )
    }
    
    return (
        <View style={styles.viewImages}>
            
            {imagesSelected.length < 5 &&
            <Icon
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
             }   
            {imagesSelected.map(imageRestaurant => (
            
                <Avatar
            key={imageRestaurant}
            onPress={()=>removeImage(imageRestaurant)}
            style={styles.miniatureStyle}
            source={{uri: imageRestaurant}}

        />

            ))}
            
        </View>
    )

}

function FormAdd(props) {
    const {setRestaurantAddress, setRestaurantDescription, setRestaurantName} = props
    return (
        
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: e => setRestaurantAddress(e.nativeEvent.text)
                }}
                onChange={() => console.log("Dirección del restaurante actualizado")}
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
            
        </View>

    )
}

const styles = StyleSheet.create({

    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight:10,
        height: 70,
        width: 70,
        backgroundColor:"#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight:10     
    },
    viewMainImage: {
        alignItems: "center",
        height: 200,
        marginBottom:20
    },
    viewForm: {
        marginLeft: 10,
        marginRight:10
    },
    input: {
        marginBottom:10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin:0
    }
})