const { put, list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(200).end();

    async function loadPosts() {
        try {
            const { blobs } = await list({ 
                prefix: 'community/index.json', 
                token: process.env.BLOB_READ_WRITE_TOKEN 
            });
            if (blobs.length === 0) return [];
            const response = await fetch(blobs[0].url + '?t=' + Date.now());
            return await response.json();
        } catch (e) {
            console.error('loadPosts error:', e.message);
            return [];
        }
    }

    async function savePosts(posts) {
        await put('community/index.json', JSON.stringify(posts), {
            access: 'public',
            contentType: 'application/json',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
    }

    if (req.method === 'GET') {
        try {
            const posts = await loadPosts();
            return res.status(200).json({ posts });
        } catch (err) {
            console.error('GET error:', err.message);
            return res.status(500).json({ error: 'Failed to load posts' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, text, photo, date } = req.body;
            if (!name || !text) return res.status(400).json({ error: 'Name and comment are required' });

            let photoData = null;
            if (photo) {
                const matches = photo.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches[2].length <= 2000000) {
                    photoData = photo;
                } else if (photo.length > 2000000) {
                    return res.status(400).json({ error: 'Photo too large.' });
                }
            }

            const posts = await loadPosts();
            posts.unshift({ name, text, photo: photoData, date });
            if (posts.length > 50) posts.length = 50;
            await savePosts(posts);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('POST error:', err.message);
            return res.status(500).json({ error: 'Failed to save post' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
