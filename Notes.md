The reason you are seeing cached versions is likely because npm run deploy uploads a static bundle to Reddit's servers, which are heavily cached (CDNs). It can take a few minutes for a new "deployment" to actually show up for everyone, or even for you.

To prevent this and develop instantly, you should use the Playtest mode instead of deploying.

Run this command:

bash
npm run dev:devvit
(or devvit playtest)

This creates a live tunnel from your local machine to Reddit, so your changes appear instantly without caching. You only need to run npm run deploy when you are ready to publish a permanent version for others to play asynchronously.


It looks like you're getting that error because npm run dev:devvit tries to connect to a local server that isn't running.

The error ECONNREFUSED 127.0.0.1:3000 means it's looking for your app on port 3000, but nothing is there.

You likely need to run the all-in-one command that starts both the client builder AND the devvit environment.

Try this command instead:

bash
npm run dev:watch
This runs concurrently (from your 
package.json
), starting:

npm:dev:client (Vite build watcher)
npm:dev:server (Server build watcher)
npm:dev:devvit (The playtest tunnel)
This will ensure your code is actually being built/served so the devvit process can find it!