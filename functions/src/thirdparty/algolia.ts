import algoliasearch = require("algoliasearch");
const dotenv = require('dotenv');

dotenv.config();

const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_API_KEY!
);
const indexes: {[key:string]: algoliasearch.Index} = {};

export class Alagolia {
    public static getIndex(key: string): algoliasearch.Index {
        if (key in indexes)
            return indexes[key];
        
        const index = algolia.initIndex(key); 
        indexes[key] = index;
        return index;
    }
}



  