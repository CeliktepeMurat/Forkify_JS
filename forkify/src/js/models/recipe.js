import axios from 'axios';
import { API_KEY } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${API_KEY}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
            
        } catch (error) {
            console.log(error);
        }

    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        this.time = (Math.ceil(numIng / 3) * 15);
    }

    calcServing() {
        this.serving = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIgredients = this.ingredients.map(el => {
            // 1- Uniform the units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2- Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3- Parse ingredients into count, unit and ingredient

            // For example : "1 teaspoon instant yeast"    we have something like that
            // arrIng will be like that: ['1', 'teaspoon', 'instant', 'yeast']
            // findIndex method will loop through arrIng and will check that unitsShort array whether includes el2 (teaspoon, instant ...)or not
            // if it includes then it will returns position if it
            // if it doesn't include, it will return -1
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            if (unitIndex > -1) {
                // There is a unit and return position of it

                //Example: 4 1/2 cups ==> then arrCount will be [4, 1/2]
                //Example: 4 cups ==> then arrCount will be [4]
                // eval("4, 1/2") ==> 4.5
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                }
                else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                };

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } 
            else if (parseInt(arrIng[0], 10)) {
                // This means that there is no unit but first element of ingredient is a number
                // if its a number then it can parse it into integer otherwise it will return NaN
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                // There is No unit and number in 1st position  
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIgredients;
    }

    updateServing(type) {
        // Serving Ingredients
         const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServing / this.serving);
        });

        this.serving = newServing;
    }
}