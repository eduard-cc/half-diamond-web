This is the web UI for netpick, a toolkit for network recon and MITM attacks. The API's repository is available [here](https://github.com/eduard-cc/netpick-api).

![web UI screenshot](https://github.com/eduard-cc/netpick-api/blob/main/docs/media/screenshot.png?raw=true)

## Installation

### Using Docker

The easiest way to install netpick and its web UI is to use Docker.

```bash
docker pull eduardcc/netpick
docker run --privileged --net=host eduardcc/netpick
```

The web UI will run at `http://localhost:3000` and the API at `http://localhost:8000`.

**Note**: The API requires elevated privileges to function properly.

### Building from source

To build the application, make sure that you have Node.js and npm installed.

```bash
git clone https://github.com/eduard-cc/netpick-web.git
cd netpick-web
npm install
npm run build
npm run preview # for development, use `npm run dev`.
```
