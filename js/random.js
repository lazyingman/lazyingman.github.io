var posts = ["posts/697cb99d.html","posts/4a17b156.html","posts/fcbdffd2.html","posts/e2a091a6.html","posts/da523892.html","posts/20230502a.html"];
function toRandomPost() {
    pjax.loadUrl('/' + posts[Math.floor(Math.random() * posts.length)]);
}
;