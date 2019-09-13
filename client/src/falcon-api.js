import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.falconims.com'
});

export default instance;