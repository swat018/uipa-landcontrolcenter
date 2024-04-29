<template>
<v-container class="justify-center bg-background">
    <v-row class="flex-column justify-center">
        <v-col class="text-center text-h1 notfound text-background">404</v-col>
        <v-col class="text-center text-h4">페이지를 찾을 수 없습니다</v-col>
        <v-col class="text-center text-h4"><v-btn href="/" class="text-decoration-none bg-btn">홈으로 이동하기</v-btn></v-col>
    </v-row>
</v-container>
</template>

<script>
export default {

}
</script>

<style>
.notfound {
    font-size: 220px;
    letter-spacing: 10px;
    margin: 0px;
    font-weight: 700;
    text-shadow: 2px 2px 0px #c9c9c9, -2px -2px 0px #c9c9c9;
}
</style>