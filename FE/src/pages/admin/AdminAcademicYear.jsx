import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAcademicYear,
  updateAcademicYear,
  setCurrentAcademicYear
} from "../../redux/slices/academicYearSlice";

const AdminAcademicYear = () => {
  const dispatch = useDispatch();

  const { items, currentAcademicYear } = useSelector(
    (state) => state.academicYear
  );

  const [newYear, setNewYear] = useState({
    name: "",
    closureDate: "",
    finalClosureDate: ""
  });

  const [editingId, setEditingId] = useState(null);

  /* =========================
     VALIDATION FUNCTION
  ========================= */
  const validateDates = (closure, finalClosure) => {
    if (!closure || !finalClosure) return false;

    const c = new Date(closure);
    const f = new Date(finalClosure);

    return f > c;
  };

  /* =========================
     ADD NEW YEAR
  ========================= */
  const handleAdd = () => {
    if (
      !newYear.name ||
      !validateDates(
        newYear.closureDate,
        newYear.finalClosureDate
      )
    ) {
      alert(
        "Invalid input. Final Closure must be after Closure Date."
      );
      return;
    }

    dispatch(
      addAcademicYear({
        id: Date.now().toString(),
        ...newYear
      })
    );

    setNewYear({
      name: "",
      closureDate: "",
      finalClosureDate: ""
    });
  };

  /* =========================
     UPDATE YEAR
  ========================= */
  const handleUpdate = (year) => {
    if (
      !validateDates(year.closureDate, year.finalClosureDate)
    ) {
      alert(
        "Final Closure must be after Closure Date."
      );
      return;
    }

    dispatch(updateAcademicYear(year));
    setEditingId(null);
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-6xl">
      <h1 className="text-2xl font-bold mb-8">
        Academic Year Management
      </h1>

      {/* ADD SECTION */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <input
          type="text"
          placeholder="Academic Year Name"
          className="border p-2 rounded"
          value={newYear.name}
          onChange={(e) =>
            setNewYear({ ...newYear, name: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={newYear.closureDate}
          onChange={(e) =>
            setNewYear({
              ...newYear,
              closureDate: e.target.value
            })
          }
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={newYear.finalClosureDate}
          onChange={(e) =>
            setNewYear({
              ...newYear,
              finalClosureDate: e.target.value
            })
          }
        />

        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white rounded px-4"
        >
          Add
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {items.map((year) => (
          <YearRow
            key={year.id}
            year={year}
            isActive={
              currentAcademicYear?.id === year.id
            }
            isEditing={editingId === year.id}
            onEdit={() => setEditingId(year.id)}
            onCancel={() => setEditingId(null)}
            onUpdate={handleUpdate}
            onSetActive={() =>
              dispatch(setCurrentAcademicYear(year))
            }
          />
        ))}
      </div>
    </div>
  );
};

/* =========================
   YEAR ROW COMPONENT
========================= */
const YearRow = ({
  year,
  isActive,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onSetActive
}) => {
  const [localYear, setLocalYear] = useState(year);

  return (
    <div
      className={`border p-5 rounded flex justify-between items-center ${
        isActive ? "border-green-500 bg-green-50" : ""
      }`}
    >
      <div className="space-y-2">
        <p className="font-semibold">{year.name}</p>

        {isEditing ? (
          <>
            <input
              type="date"
              value={localYear.closureDate}
              className="border p-1 rounded mr-2"
              onChange={(e) =>
                setLocalYear({
                  ...localYear,
                  closureDate: e.target.value
                })
              }
            />

            <input
              type="date"
              value={localYear.finalClosureDate}
              className="border p-1 rounded"
              onChange={(e) =>
                setLocalYear({
                  ...localYear,
                  finalClosureDate: e.target.value
                })
              }
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Closure: {year.closureDate}
            </p>
            <p className="text-sm text-gray-500">
              Final Closure: {year.finalClosureDate}
            </p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={() => onUpdate(localYear)}
              className="bg-indigo-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            {!isActive && (
              <button
                onClick={onSetActive}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                Set Active
              </button>
            )}

            {isActive && (
              <span className="text-green-600 font-semibold">
                Active
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAcademicYear;