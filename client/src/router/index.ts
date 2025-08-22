import { type RouterOptions, createRouter, createWebHistory } from 'vue-router';
import PlayPage from '../pages/PlayPage.vue';

export const PageName = {
    PLAY: 'play'
};

const routes = [
    {
        path: '/',
        name: PageName.PLAY,
        component: PlayPage
    }
];

const routerOptions = {
    history: createWebHistory(),
    routes
};

const router = createRouter(routerOptions as RouterOptions);

// Navigation guard to check authentication before each route
router.beforeEach((to, from, next) => {
    // Ensure there's an account before allowing access to the route
    console.log('Navigating to:', to.name);
    next();
});

export default router;
