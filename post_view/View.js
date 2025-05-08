window.addEventListener("DOMContentLoaded", () => {
  const postId = localStorage.getItem("viewPostId");
  const postList = JSON.parse(localStorage.getItem("postList") || "[]");
  const post = postList[postId];

  const contentContainer = document.querySelector(".post-content");
  const usernameEl = document.querySelector(".username");
  const dateEl = document.querySelector(".post-date");
  const heartCount = document.querySelector(".interactions span:nth-child(1)");
  const commentCount = document.querySelector(
    ".interactions span:nth-child(2)"
  );
  const commentInput = document.querySelector(".comment-input");
  const commentsContainer = document.querySelector(".comments");
  const backButton = document.querySelector(".back-button");

  function renderPost() {
    contentContainer.innerHTML = `
      <strong>[${post.subject}] ${post.category}</strong><br />
      ${post.question}<br />
      정답: ${post.answer || "O"}
    `;

    usernameEl.textContent = post.writer || "이은주";
    dateEl.textContent = post.time || "날짜 없음";

    heartCount.textContent = `❤️ ${post.likes}`;
    commentCount.textContent = `💬 ${post.comments?.length || 0}`;

    renderComments();
  }

  function renderComments() {
    commentsContainer.innerHTML = "";

    post.comments?.forEach((comment, index) => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";
      commentDiv.innerHTML = `
        <p><strong>${comment.username}</strong> (${comment.date})</p>
        <p>${comment.content}</p>
        <button class="delete-comment" data-index="${index}">삭제</button>
      `;
      commentsContainer.appendChild(commentDiv);
    });
  }

  // 댓글 삭제 이벤트
  commentsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-comment")) {
      const commentIndex = e.target.dataset.index;
      if (confirm("댓글을 삭제하시겠습니까?")) {
        post.comments.splice(commentIndex, 1);
        postList[postId] = post;
        localStorage.setItem("postList", JSON.stringify(postList));
        renderPost();
      }
    }
  });

  // 댓글 추가 이벤트
  commentInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && commentInput.value.trim()) {
      const newComment = {
        username: "익명 사용자",
        date: new Date().toLocaleString("ko-KR", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        content: commentInput.value.trim(),
      };

      if (!post.comments) post.comments = [];
      post.comments.push(newComment);
      postList[postId] = post;
      localStorage.setItem("postList", JSON.stringify(postList));
      commentInput.value = "";
      renderPost();
    }
  });

  backButton.addEventListener("click", () => {
    window.history.back();
  });

  renderPost();
});
