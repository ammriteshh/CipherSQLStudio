const https = require('https');

const API_KEY = 'AIzaSyC-nSlYhmmG7J8Luwo33j_lYowIvHqz9Ew'; // Hardcoded for test
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            require('fs').writeFileSync('models.json', JSON.stringify(json, null, 2));
            console.log('Written to models.json');
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
