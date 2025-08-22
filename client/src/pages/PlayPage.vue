<template>
    <div class="play-page">
        <h1>Main Page</h1>
        <Button @click="onClickDeleteAllUsers">Delete all Users</Button>
    </div>
</template>

<script lang="ts" setup>
import Button from '@/components/global/Button.vue';
import axios from 'axios';

function onClickDeleteAllUsers() {
    axios
        .delete('user/clear')
        .then(() => {
            console.log('All users deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting users:', error);
        });
}
</script>

<style lang="scss" scoped>
.play-page {
    border: 2px dashed red;
    padding: 2rem;
}
</style>
