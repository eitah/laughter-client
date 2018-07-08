import LRU from 'lru-cache';

const cache = LRU({
    max: 500, // max size
    maxAge: 1000 * 60 * 60 // 1 hour
});

export default cache;