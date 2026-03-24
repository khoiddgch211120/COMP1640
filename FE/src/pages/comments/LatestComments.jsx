
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const LatestComments = () => {
  const ideas = useSelector((state) => state.ideas.ideas);

  const [page, setPage] = useState(1);
  const commentsPerPage = 5;

  // lấy tất cả comment từ mọi idea
  const allComments = useMemo(() => {
    const comments = ideas.flatMap((idea) =>
      idea.comments.map((c) => ({
        ...c,
        ideaTitle: idea.title,
        ideaId: idea.id
      }))
    );

    return comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [ideas]);

  const indexOfLast = page * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;

  const currentComments = allComments.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(allComments.length / commentsPerPage);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">Latest Comments</h1>

      {currentComments.length === 0 && (
        <p className="text-gray-500">No comments available</p>
      )}

      <div className="space-y-4">
        {currentComments.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <p className="text-sm font-medium">
              {c.isAnonymous ? "Anonymous" : c.name}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {c.content}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Idea: {c.ideaTitle}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestComments;
