import { useSelector } from "react-redux";
import { useMemo } from "react";

const CoordinatorDashboard = () => {

  const ideas = useSelector((state) => state.ideas.ideas);
  const user = useSelector((state) => state.auth.user);

  /* =========================
     FILTER IDEAS BY DEPARTMENT
  ========================= */

  const departmentIdeas = useMemo(() => {
    if (!user) return [];

    return ideas.filter(
      (idea) => idea.dept_id === user.dept_id
    );
  }, [ideas, user]);

  /* =========================
     STATISTICS
  ========================= */

  const totalIdeas = departmentIdeas.length;

  const totalComments = departmentIdeas.reduce(
    (total, idea) => total + idea.comments.length,
    0
  );

  const totalContributors = new Set(
    departmentIdeas.map((idea) => idea.author.id)
  ).size;

  const contributionPercent =
    ideas.length > 0
      ? ((departmentIdeas.length / ideas.length) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-8 w-full">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Department Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Statistics for your department
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total Ideas</p>
          <h3 className="text-2xl font-semibold mt-2">
            {totalIdeas}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Contributors</p>
          <h3 className="text-2xl font-semibold mt-2">
            {totalContributors}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total Comments</p>
          <h3 className="text-2xl font-semibold mt-2">
            {totalComments}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">
            Contribution %
          </p>

          <h3 className="text-2xl font-semibold mt-2">
            {contributionPercent}%
          </h3>
        </div>

      </div>

    </div>
  );
};

export default CoordinatorDashboard;