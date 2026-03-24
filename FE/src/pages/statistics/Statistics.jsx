import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { exportIdeasToCSV } from "../../utils/exportCSV";

const Statistics = () => {

  const ideas = useSelector((state) => state.ideas?.ideas || []);

  const academicYearState = useSelector(
    (state) => state.academicYear
  );

  const academicYears = academicYearState?.items || [];

  const [selectedYearId, setSelectedYearId] = useState("");

  /* =========================
     AUTO SELECT YEAR
  ========================= */

  useEffect(() => {
    if (academicYears.length > 0 && !selectedYearId) {
      setSelectedYearId(academicYears[0].id);
    }
  }, [academicYears]);


  /* =========================
     FILTER IDEAS
  ========================= */

  const filteredIdeas = useMemo(() => {

    if (!selectedYearId) return [];

    return ideas.filter(
      (idea) => idea.academicYearId === selectedYearId
    );

  }, [ideas, selectedYearId]);


  const currentYear = academicYears.find(
    (y) => y.id === selectedYearId
  );


  /* =========================
     TOTAL IDEAS
  ========================= */

  const totalIdeas = filteredIdeas.length;


  /* =========================
     DEPARTMENT STATS
  ========================= */

  const departmentStats = filteredIdeas.reduce(
    (acc, idea) => {

      const dept = idea.dept_id || "Unknown";

      acc[dept] = (acc[dept] || 0) + 1;

      return acc;

    },
    {}
  );


  /* =========================
     MOST VIEWED
  ========================= */

  const mostViewed = filteredIdeas.reduce(
    (max, idea) => (idea.views > (max?.views || 0) ? idea : max),
    null
  );


  /* =========================
     MOST POPULAR
  ========================= */

  const mostPopular = filteredIdeas.reduce((max, idea) => {

    const score =
      idea.upvotes.length - idea.downvotes.length;

    const maxScore =
      max?.upvotes?.length - max?.downvotes?.length || 0;

    return score > maxScore ? idea : max;

  }, null);


  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-8 w-full">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          System Statistics
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Overview of idea contributions
        </p>
      </div>


      {/* SELECT YEAR */}

      <div className="bg-white p-6 rounded-xl border shadow-sm">

        <label className="block text-sm font-medium mb-2">
          Select Academic Year
        </label>

        <select
          value={selectedYearId}
          onChange={(e) =>
            setSelectedYearId(e.target.value)
          }
          className="border rounded-lg px-3 py-2 w-full max-w-sm"
        >

          {academicYears.map((year) => (

            <option key={year.id} value={year.id}>
              {year.name}
            </option>

          ))}

        </select>

      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">
            Total Ideas
          </p>
          <h3 className="text-2xl font-semibold mt-2">
            {totalIdeas}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">
            Most Viewed Idea
          </p>

          <h3 className="text-lg font-semibold mt-2">
            {mostViewed?.title || "N/A"}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">
            Most Popular Idea
          </p>

          <h3 className="text-lg font-semibold mt-2">
            {mostPopular?.title || "N/A"}
          </h3>
        </div>

      </div>


      {/* IDEAS BY DEPARTMENT */}

      <div className="bg-white p-6 rounded-xl border shadow-sm">

        <h3 className="font-semibold mb-4">
          Ideas by Department
        </h3>

        {Object.keys(departmentStats).length === 0 ? (

          <p className="text-slate-500">
            No ideas for this academic year.
          </p>

        ) : (

          <div className="space-y-2">

            {Object.entries(departmentStats).map(
              ([dept, count]) => (

                <div
                  key={dept}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>{dept}</span>
                  <span className="font-medium">
                    {count}
                  </span>
                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* EXPORT CSV */}

      {filteredIdeas.length > 0 && currentYear && (

        <button
          onClick={() =>
            exportIdeasToCSV(
              filteredIdeas,
              currentYear.name
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Export CSV
        </button>

      )}

    </div>
  );
};

export default Statistics;