import LoadingModal from '@/components/modals/templates/LoadingModal.vue';
import { getUserId, setUserId } from '@/controllers/data-controller';
import ModalController from '@/controllers/modal-controller';
import axios from 'axios';
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
router.beforeEach(async (to, from, next) => {
    ModalController.open(LoadingModal);

    const playerId = getUserId();
    let response;

    if (!playerId) response = await axios.post('user');
    else {
        try {
            response = await axios.get(`user/${getUserId()}`);
        } catch (error) {
            console.error('Error fetching user:', error);
            response = await axios.post('user');
        }
    }

    const user = response.data as {
        id: string;
        name: string;
        createdAt: string;
    };

    console.log(response.data);

    setUserId(user.id);

    console.log('Navigating to:', to.name);

    ModalController.close();
    next();
});

export default router;
