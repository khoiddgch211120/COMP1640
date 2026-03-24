import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementView,
  toggleVote,
  addComment
} from "../../redux/slices/ideaSlice";
import { ROLES } from "../../constants/roles";

const IdeaDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentAcademicYear } = useSelector(
    (state) => state.academicYear
  );

  const idea = useSelector((state) =>
    state.ideas.ideas.find((i) => i.id === id)
  );

  const [commentText, setCommentText] = useState("");

  /* =========================
     INCREASE VIEW
  ========================= */

  useEffect(() => {
    if (idea) {
      dispatch(incrementView(id));
    }
  }, [id, dispatch]);

  if (!idea) {
    return <div className="p-6">Idea not found</div>;
  }

  const score = idea.upvotes.length - idea.downvotes.length;

  /* =========================
     FINAL CLOSURE LOGIC
  ========================= */

  const commentClosed =
    currentAcademicYear &&
    new Date() > new Date(currentAcademicYear.finalClosureDate);

  /* =========================
     VOTE HANDLER
  ========================= */

  const handleVote = (type) => {

    if (!user || user.role !== ROLES.STAFF) return;

    if (idea.author?.id === user.id) {
      alert("You cannot vote your own idea");
      return;
    }

    dispatch(
      toggleVote({
        ideaId: id,
        userId: user.id,
        type
      })
    );
  };

  /* =========================
     COMMENT HANDLER
  ========================= */

  const handleComment = () => {

    if (!commentText.trim()) return;

    if (commentClosed) {
      alert("Comment period has closed");
      return;
    }

    dispatch(
      addComment({
        ideaId: id,
        comment: {
          userId: user.id,
          name: user.fullName,
          content: commentText,
          isAnonymous: false,
          createdAt: new Date().toISOString()
        }
      })
    );

    setCommentText("");
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="w-full space-y-8">

      {/* IDEA HEADER */}

      <div className="bg-white border rounded-2xl p-8 shadow-sm">

        <div className="flex justify-between items-start gap-6">

          <div>

            <h1 className="text-2xl font-semibold text-slate-800">
              {idea.title}
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              By {idea.isAnonymous ? "Anonymous" : idea.author.name}
            </p>

          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-medium
              ${
                score > 0
                  ? "bg-green-100 text-green-600"
                  : score < 0
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            ⭐ {score}
          </div>

        </div>

        {/* DESCRIPTION */}

        <p className="mt-6 text-slate-700 leading-relaxed">
          {idea.description}
        </p>

        {/* ATTACHMENTS */}

        {idea.attachments && idea.attachments.length > 0 && (

          <div className="mt-6">

            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Attachments
            </h3>

            <div className="space-y-2">

              {idea.attachments.map((file) => (

                <a
                  key={file.id}
                  href={file.url}
                  download
                  className="flex items-center gap-2 text-indigo-600 hover:underline text-sm"
                >
                  📎 {file.name}
                </a>

              ))}

            </div>

          </div>

        )}

        {/* STATS + VOTE */}

        <div className="mt-8 flex items-center justify-between border-t pt-6">

          <div className="flex gap-6 text-sm text-slate-600">
            <span>👁 {idea.views} views</span>
            <span>💬 {idea.comments.length} comments</span>
          </div>

          {user?.role === ROLES.STAFF && (

            <div className="flex gap-3">

              <button
                onClick={() => handleVote("up")}
                className="px-4 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
              >
                👍 Upvote
              </button>

              <button
                onClick={() => handleVote("down")}
                className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                👎 Downvote
              </button>

            </div>

          )}

        </div>

      </div>


      {/* COMMENTS */}

      <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-6">

        <div className="flex justify-between items-center">

          <h3 className="text-xl font-semibold text-slate-800">
            Comments
          </h3>

          {commentClosed && (
            <span className="text-xs font-medium px-3 py-1 bg-red-100 text-red-600 rounded-full">
              Comment Closed
            </span>
          )}

        </div>


        {/* COMMENT LIST */}

        {idea.comments.length === 0 && (
          <div className="text-slate-500 text-sm">
            No comments yet.
          </div>
        )}

        <div className="space-y-4">

          {idea.comments
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            )
            .map((c) => (

              <div
                key={c.id}
                className="border rounded-xl p-4 bg-slate-50"
              >

                <p className="text-sm font-medium text-slate-700">
                  {c.isAnonymous ? "Anonymous" : c.name}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {c.content}
                </p>

              </div>

            ))}

        </div>


        {/* COMMENT BOX */}

        {!commentClosed &&
          (user?.role === ROLES.STAFF ||
            user?.role === ROLES.QA_COORDINATOR) && (

            <div className="pt-4 border-t space-y-4">

              <textarea
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                rows="3"
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                placeholder="Write a comment..."
              />

              <div className="flex justify-end">

                <button
                  onClick={handleComment}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Post Comment
                </button>

              </div>

            </div>

          )}

      </div>

    </div>
  );
};

export default IdeaDetail;