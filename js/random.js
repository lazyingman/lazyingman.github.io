var posts = ["posts/697cb99d.html","posts/4a17b156.html"];
function toRandomPost() {
    pjax.loadUrl('/' + posts[Math.floor(Math.random() * posts.length)]);
}
;