import cache from './cache';

export default async function twitterHandleSearch(search) {
    try {
        if (search) {
            if (cache.get(search)) {
                return cache.get(search)
            }
            const url = `http://localhost:4000/twitter/user/search?username=${search}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`getResults from twitter user search for string ${search} failed with status ${response.status}`)
            }
            let json = await
            response.json();
            const users = json.users;
            cache.set(search, users);
            return users;
        }
        throw new Error('No search provided to twitterHandleSearch');
    }
    catch (e) {
        console.error(e && e.message);
        return [];
    }
}
