<div align="center">
<h3 align="center">Option-Chainer</h3>

  <p align="center">
    Option-Chainer is an optimized open-source <a href="https://www.investopedia.com/terms/o/optionchain.asp">options-chain</a> visualizer.
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#built-with">Built with</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#license">License</a></li>
  </ol>

<!-- ABOUT THE PROJECT -->

## About The Project

Option-Chainer is an optimized open-source option-chain visualizer. Currently it is built to show `150 options`, `75 calls` and `75 puts` alongside with the `underlying`. In the currentl state of project, it meant to be used alongside the [options-socket](https://github.com/Sandstorm831/options_chain_socket) server which supplies the necessary dummy data. The Project uses [react-virtualized](https://github.com/bvaughn/react-virtualized) library to render the data on the screen efficiently without any lag and [shared-worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) to have a single point of connection between server and client for various tabs having seperate dedicated contexts and requests. The application is fully responsive without any layout shifts with data simultaneous coming in.
### Built With

[![Next][Next.js]][Next-url]
[![React][React.js]][React-url]
[![Socket.IO][Socket.io]][Socket-url]
[![TailWindCSS][tailwindcss]][tailwindcss-url]
[![NodeJS][nodejs]][nodejs-url]
[![TypeScript][typescript]][typescript-url]

## Prerequisites

To run the project in your local machine, you must have

- Node.js : [Volta recommended](https://volta.sh/)

## Installation

Once you finish installation Node.js, follow the commands to setup the project locally on your machine

1. clone the project
   ```sh
   git clone https://github.com/Sandstorm831/option_chain.git
   ```
2. enter the project
   ```sh
   cd option_chain
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

4. build the project

   ```sh
   npm run build
   ```

5. Start the server
   ```sh
    npm run start
   ```
This completes the set-up for this project, all the functionalities present in the application will now be live at `port: 3000`, except the data section will be empty for which you have to setup [options-socket server](https://github.com/Sandstorm831/options_chain_socket)

<!-- LICENSE -->


## License

Distributed under the GPL-3.0 license. See [LICENSE](./LICENSE) for more information.

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[Socket-url]: https://socket.io/
[nodejs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[tailwindcss]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwindcss-url]: https://tailwindcss.com/
