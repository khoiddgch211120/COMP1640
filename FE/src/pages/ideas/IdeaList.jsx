import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

const IdeaList = () => {
  const ideas = useSelector((state) => state.ideas.ideas);

  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const indexOfLast = currentPage * ideasPerPage;
  const indexOfFirst = indexOfLast - ideasPerPage;
  const currentIdeas = ideas.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(ideas.length / ideasPerPage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Idea List</h1>

      {currentIdeas.map((idea) => (
        <div
          key={idea.id}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          <Link to={`/ideas/${idea.id}`}>
            <h3 className="text-lg font-semibold hover:text-blue-600">
              {idea.title}
            </h3>
          </Link>

          <p className="text-gray-600">
            By: {idea.isAnonymous ? "Anonymous" : idea.author.name}
          </p>

          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>Views: {idea.views}</span>
            <span>
              Score: {idea.upvotes.length - idea.downvotes.length}
            </span>
            <span>Comments: {idea.comments.length}</span>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IdeaList;