import http from 'http';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config({ path: '../.env' });

const { CLIENT_SECRET, CLIENT_ID } = process.env;

export const server = http.createServer(async (req, res) => {
    const { url } = req;
    const code = url.split('=')[1];
    let accessToken;

    const tokenUrl = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:09644/login`;
    const token = await getAccessToken(tokenUrl);

    if (token.includes('access_token'))
        accessToken = token.split('=')[1]

    if (accessToken)
        sendTokenToClient(accessToken);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    }).end('<h4 align="center">You can now close your browser :)</h4>')

});

async function getAccessToken(tokenUrl) {
    return await fetch(tokenUrl).then(res => res.text())
}

async function sendTokenToClient(token) {
    await fetch(`http://localhost:09644?token=${token}`)
}

const PORT = process.env.PORT || 7439;
server.listen(`${PORT}`, () => {
    console.log('authenticating...')
})