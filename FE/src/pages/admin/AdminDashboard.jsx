import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const users = useSelector((state) => state.auth.users || []);
  const ideas = useSelector((state) => state.ideas.ideas || []);
  const { items, currentAcademicYear } = useSelector(
    (state) => state.academicYear
  );

  const totalUsers = users.length;
  const totalIdeas = ideas.length;
  const totalAcademicYears = items.length;

  /* ========================
     IDEAS PER DEPARTMENT
  ======================== */
  const departmentStats = {};

  ideas.forEach((idea) => {
    const dept = idea.author?.department || "Unknown";
    departmentStats[dept] =
      (departmentStats[dept] || 0) + 1;
  });

  /* ========================
     TOP 5 MOST POPULAR
  ======================== */
  const topIdeas = [...ideas]
    .sort(
      (a, b) =>
        b.upvotes.length - b.downvotes.length -
        (a.upvotes.length - a.downvotes.length)
    )
    .slice(0, 5);

  /* ========================
     ACADEMIC YEAR STATUS
  ======================== */
  const isClosed =
    currentAcademicYear &&
    new Date() >
      new Date(currentAcademicYear.closureDate);

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enterprise System Overview
        </p>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card title="Total Users" value={totalUsers} />
        <Card title="Total Ideas" value={totalIdeas} />
        <Card title="Academic Years" value={totalAcademicYears} />
        <Card
          title="Active Year Status"
          value={isClosed ? "Closed" : "Open"}
          highlight={isClosed ? "red" : "green"}
        />

      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-6 text-gray-700">
          Ideas per Department
        </h3>

        <div className="space-y-4">
          {Object.entries(departmentStats).map(
            ([dept, count]) => (
              <div key={dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{dept}</span>
                  <span>{count}</span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded">
                  <div
                    className="bg-indigo-600 h-3 rounded"
                    style={{
                      width: `${
                        (count / totalIdeas) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= TOP IDEAS ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-6 text-gray-700">
          Top 5 Most Popular Ideas
        </h3>

        {topIdeas.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No ideas submitted yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {topIdeas.map((idea) => {
              const score =
                idea.upvotes.length -
                idea.downvotes.length;

              return (
                <li
                  key={idea.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <span>{idea.title}</span>
                  <span className="font-semibold">
                    Score: {score}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
};

/* ========================
   CARD COMPONENT
======================== */
const Card = ({ title, value, highlight }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold mt-2 ${
          highlight === "red"
            ? "text-red-600"
            : highlight === "green"
            ? "text-green-600"
            : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AdminDashboard;