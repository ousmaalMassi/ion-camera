<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType } from '@capacitor/camera';
import { imageOutline, removeCircleOutline } from "ionicons/icons";
import {
    IonPage,
    IonContent,
    IonIcon,
    IonFab,
    IonFabButton,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonImg,
    IonButton,
} from "@ionic/vue";

const photoList = ref([] as any);
const directory = Directory.ExternalStorage;
const rootDir = "DCIM";

const takePhoto = async () => {
    const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        allowEditing: false,
        quality: 100,
        saveToGallery: true
    })
    addToList(image.path!)
}
const addToList = async (path: string) => {
    const name = path?.split("/").at(-1);
    if (name) {
        photoList.value.push({ name: name, data: await readPhoto(name) })
    }
}
const readPhoto = async (fileName: string) => {
    const file = await Filesystem.readFile({ path: `${rootDir}/${fileName}`, directory: directory })
    return `data:image/jpeg;base64,${file.data}`
}
const loadPhotos = async () => {
    const dir = await Filesystem.readdir({ path: rootDir, directory: directory })
    dir.files.forEach(async (element: any) => {
        if (element.type == "file") {
            addToList(element.name)
        }
    })
}
const deletePhoto = async (fileName: string) => {
    await Filesystem.deleteFile({ path: `${rootDir}/${fileName}`, directory: directory })
    photoList.value = photoList.value.filter((element: any) => element.name !== fileName)
}
onBeforeMount(() => {
    loadPhotos()
})
</script>

<template>
    <ion-page>
        <ion-content>
            <ion-grid>
                <ion-row v-if="photoList && photoList.length > 0">
                    <ion-col size="4" v-for="photo in photoList" :key="photo.name">
                        <ion-img :src="photo.data"></ion-img>
                        <ion-button color="danger" fill="clear" @click="deletePhoto(photo.name)">
                            <ion-icon slot="start" :icon="removeCircleOutline"></ion-icon>
                            <ion-label>remove</ion-label>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <div class="no-content" v-else>
                    <img src="/public/no-content.png" alt="" srcset="">
                </div>
            </ion-grid>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="takePhoto()">
                    <ion-icon :icon="imageOutline"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<style>
.no-content {
    display: grid;
    place-content: center;
    place-items: center;
}

ion-grid, .no-content {
    height: 100%;
}

img {
    width: 60%;
}
</style>