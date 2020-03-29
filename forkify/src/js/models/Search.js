import axios from 'axios';
import { API_KEY } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);

        } catch (error) {
            console.log(error);
        }
    }
}


// API KEY: 238145fe0be9e8948e00e7e0d33ce770
// https://www.food2fork.com/api/search
