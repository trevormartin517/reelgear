const { put, list, head } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    async function loadPosts() {
        try {
            const { blobs } = await list({ 
                prefix: 'community/index.json', 
                token: process.env.BLOB_READ_WRITE_TOKEN 
            });
            if (blobs.length === 0) return [];
            // Use head to get a fresh download URL, then fetch it
            const freshBlob = await head(blobs[0].url, { token: process.env.BLOB_READ_WRITE_TOKEN });
            const response = await fetch(freshBlob.downloadUrl);
            return await response.json();
        } catch (e) {
            console.error('loadPosts error:', e);
            return [];
        }
    }

    async function savePosts(posts) {
        await put('community/index.json', JSON.stringify(posts), {
            access: 'private',
            contentType: 'application/json',
            allowOverwrite: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
    }

    if (req.method === 'GET') {
        try {
            const posts = await loadPosts();
            // Strip photo data for the list — photos are fetched separately
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

            // Store photo as base64 directly in the post — no separate file needed
            let photoData = null;
            if (photo) {
                const matches = photo.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches[2].length <= 2000000) {
                    photoData = photo; // keep as base64 data URL
                } else if (photo.length > 2000000) {
                    return res.status(400).json({ error: 'Photo too large. Please use a smaller image.' });
                }
            }

            const posts = await loadPosts();
            posts.unshift({ name, text, photo: photoData, date });
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
