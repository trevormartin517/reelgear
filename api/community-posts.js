const { put, list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    async function loadPosts() {
        try {
            const { blobs } = await list({ prefix: 'community/index.json', token: process.env.BLOB_READ_WRITE_TOKEN });
            if (blobs.length === 0) return [];
            const response = await fetch(blobs[0].url);
            return await response.json();
        } catch (e) {
            console.error('loadPosts error:', e);
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
            console.error('GET error:', err);
            return res.status(500).json({ error: 'Failed to load posts' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, text, photo, date } = req.body;

            if (!name || !text) {
                return res.status(400).json({ error: 'Name and comment are required' });
            }

            let photoUrl = null;

            if (photo) {
                const matches = photo.match(/^data:(.+);base64,(.+)$/);
                if (!matches) {
                    return res.status(400).json({ error: 'Invalid photo format' });
                }
                const mimeType = matches[1];
                const base64Data = matches[2];

                if (base64Data.length > 2000000) {
                    return res.status(400).json({ error: 'Photo too large. Please use a smaller image.' });
                }

                const buffer = Buffer.from(base64Data, 'base64');
                const ext = mimeType.split('/')[1] || 'jpg';
                const filename = `community/photos/${Date.now()}.${ext}`;

                const blob = await put(filename, buffer, {
                    access: 'public',
                    contentType: mimeType,
                    token: process.env.BLOB_READ_WRITE_TOKEN,
                });

                photoUrl = blob.url;
            }

            const posts = await loadPosts();
            posts.unshift({ name, text, photo: photoUrl, date });
            if (posts.length > 50) posts.length = 50;
            await savePosts(posts);

            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('POST error:', err);
            return res.status(500).json({ error: 'Failed to save post' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
