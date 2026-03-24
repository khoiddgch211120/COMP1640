import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const IdeaList = () => {

  const ideas = useSelector((state) => state.ideas.ideas);
  const user = useSelector((state) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("latest");

  const ideasPerPage = 5;

  /* =========================
     FILTER BY DEPARTMENT
  ========================= */

  const departmentIdeas = useMemo(() => {

    if (!user) return ideas;

    if (user.role === "QA_COORDINATOR") {
      return ideas.filter(
        (idea) => idea.dept_id === user.dept_id
      );
    }

    return ideas;

  }, [ideas, user]);


  /* =========================
     SORT LOGIC
  ========================= */

  const sortedIdeas = useMemo(() => {

    let sorted = [...departmentIdeas];

    if (filter === "popular") {
      sorted.sort(
        (a, b) =>
          (b.upvotes.length - b.downvotes.length) -
          (a.upvotes.length - a.downvotes.length)
      );
    }

    if (filter === "views") {
      sorted.sort((a, b) => b.views - a.views);
    }

    if (filter === "latest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return sorted;

  }, [departmentIdeas, filter]);


  /* =========================
     PAGINATION
  ========================= */

  const indexOfLast = currentPage * ideasPerPage;
  const indexOfFirst = indexOfLast - ideasPerPage;

  const currentIdeas = sortedIdeas.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    sortedIdeas.length / ideasPerPage
  );


  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-8 w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Idea List
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Explore and manage submitted ideas
          </p>
        </div>

        <Link
          to="/submit-idea"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition"
        >
          + Submit Idea
        </Link>

      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total Ideas</p>

          <h3 className="text-2xl font-semibold mt-2">
            {departmentIdeas.length}
          </h3>
        </div>


        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Most Viewed</p>

          <h3 className="text-2xl font-semibold mt-2">
            {departmentIdeas.length > 0
              ? Math.max(...departmentIdeas.map(i => i.views))
              : 0}
          </h3>
        </div>


        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Highest Score</p>

          <h3 className="text-2xl font-semibold mt-2">
            {departmentIdeas.length > 0
              ? Math.max(
                  ...departmentIdeas.map(
                    i => i.upvotes.length - i.downvotes.length
                  )
                )
              : 0}
          </h3>
        </div>

      </div>


      {/* FILTER TABS */}

      <div className="flex gap-3">

        {[
          { key: "latest", label: "Latest" },
          { key: "popular", label: "Most Popular" },
          { key: "views", label: "Most Viewed" },
        ].map((item) => (

          <button
            key={item.key}

            onClick={() => {
              setFilter(item.key);
              setCurrentPage(1);
            }}

            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                filter === item.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            {item.label}
          </button>

        ))}

      </div>


      {/* EMPTY */}

      {currentIdeas.length === 0 && (

        <div className="bg-white rounded-xl p-12 text-center border shadow-sm text-slate-500">
          No ideas available.
        </div>

      )}


      {/* IDEA GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {currentIdeas.map((idea) => {

          const score =
            idea.upvotes.length - idea.downvotes.length;

          return (

            <div
              key={idea.id}
              className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all duration-200 group"
            >

              <Link to={`/ideas/${idea.id}`}>

                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                  {idea.title}
                </h3>

              </Link>


              <p className="text-sm text-slate-500 mt-2">
                By{" "}
                {idea.isAnonymous
                  ? "Anonymous"
                  : idea.author.name}
              </p>


              <div className="mt-5 flex items-center justify-between text-sm">

                <div className="flex gap-4 text-slate-600">

                  <span>👁 {idea.views}</span>

                  <span>💬 {idea.comments.length}</span>

                </div>


                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium
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

            </div>

          );
        })}

      </div>


      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2 pt-6">

          {Array.from({ length: totalPages }, (_, index) => (

            <button
              key={index}

              onClick={() => setCurrentPage(index + 1)}

              className={`w-10 h-10 rounded-lg text-sm font-medium transition
                ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white border text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {index + 1}
            </button>

          ))}

        </div>

      )}

    </div>
  );
};

export default IdeaList;