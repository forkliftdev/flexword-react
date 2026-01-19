/** @jsx Devvit.createElement */
import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: 'Create FlexWord Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const subreddit = await context.reddit.getCurrentSubreddit();
    await context.reddit.submitPost({
      title: 'FlexWord Challenge',
      subredditName: subreddit.name,
      // Matches backgroundDark (#121212) from your app_colors.dart
      preview: (
        <vstack height="100%" width="100%" alignment="middle center" backgroundColor="#121212">
          <text size="large" weight="bold" color="#E0E0E0">FLEXWORD</text>
          <spacer size="small" />
          <text color="#007ACC">Loading...</text>
        </vstack>
      ),
    });
    context.ui.showToast('FlexWord post created!');
  },
});

Devvit.addCustomPostType({
  name: 'FlexWord',
  height: 'tall',
  render: (context) => {
    return (
      <blocks height="tall">
        <webview
          id="flexword-webview"
          url="index.html"
          onMessage={(msg) => console.log(msg)}
        />
      </blocks>
    );
  },
});


export default Devvit;