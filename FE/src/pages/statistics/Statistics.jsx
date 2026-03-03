import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { exportIdeasToCSV } from "../../utils/exportCSV";

const Statistics = () => {
  const ideas = useSelector((state) => state.ideas?.ideas || []);
  const academicYearState = useSelector(
    (state) => state.academicYear
  );

  const academicYears = academicYearState?.items || [];

  const [selectedYearId, setSelectedYearId] = useState("");

  useEffect(() => {
    if (academicYears.length > 0 && !selectedYearId) {
      setSelectedYearId(academicYears[0].id);
    }
  }, [academicYears]);

  const filteredIdeas = selectedYearId
    ? ideas.filter(
        (idea) => idea.academicYearId === selectedYearId
      )
    : [];

  const currentYear = academicYears.find(
    (y) => y.id === selectedYearId
  );

  const totalIdeas = filteredIdeas.length;

  const departmentStats = filteredIdeas.reduce(
    (acc, idea) => {
      const dept = idea.author?.department || "Unknown";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        System Statistics
      </h1>

      {academicYears.length === 0 ? (
        <p className="text-red-500">
          No Academic Years found.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Select Academic Year
            </label>

            <select
              value={selectedYearId}
              onChange={(e) =>
                setSelectedYearId(e.target.value)
              }
              className="border p-2 rounded w-full max-w-sm"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <p>
              Total Ideas:{" "}
              <strong>{totalIdeas}</strong>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              Ideas by Department:
            </h3>

            {Object.keys(departmentStats).length === 0 ? (
              <p className="text-gray-500">
                No ideas for this academic year.
              </p>
            ) : (
              Object.entries(departmentStats).map(
                ([dept, count]) => (
                  <p key={dept}>
                    {dept}: {count}
                  </p>
                )
              )
            )}
          </div>

          {filteredIdeas.length > 0 && currentYear && (
            <button
              onClick={() =>
                exportIdeasToCSV(
                  filteredIdeas,
                  currentYear.name
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Statistics;