export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        const data = await response.arrayBuffer(); // Handle binary data for images
        res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type as necessary
        res.send(Buffer.from(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the image' });
    }
}
