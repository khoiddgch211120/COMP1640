import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIdea } from "../../redux/slices/ideaSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";

const SubmitIdea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { currentAcademicYear } = useSelector(
    (state) => state.academicYear
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    isAnonymous: false
  });

  /* =========================
     CLOSURE LOGIC
  ========================= */

  const isClosed =
    currentAcademicYear &&
    new Date() > new Date(currentAcademicYear.closureDate);

  /* =========================
     ROLE PROTECTION
  ========================= */

  if (!user || user.role !== ROLES.STAFF) {
    return (
      <div className="w-full bg-white p-8 rounded-2xl shadow-sm border text-red-600 font-semibold">
        Access Denied
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="w-full bg-white p-8 rounded-2xl shadow-sm border text-red-600 font-semibold">
        Submission period has ended.
      </div>
    );
  }

  /* =========================
     SUBMIT HANDLER
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Title and Description are required!");
      return;
    }

    dispatch(
      addIdea({
        title: form.title,
        description: form.description,
        category: form.category,
        isAnonymous: form.isAnonymous,
        author: {
          id: user.id,
          name: user.fullName,
          department: user.department
        },
        academicYearId: currentAcademicYear?.id
      })
    );

    navigate("/ideas");
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Submit Idea
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your innovation with the organization
        </p>
      </div>

      {/* ACADEMIC YEAR STATUS */}
      <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Academic Year</p>
          <p className="font-medium text-slate-700">
            {currentAcademicYear?.name || "Not Selected"}
          </p>
        </div>

        <div
          className={`px-4 py-1.5 rounded-full text-xs font-medium
            ${
              isClosed
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }
          `}
        >
          {isClosed ? "Closed" : "Open"}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* FORM */}
        <div className="xl:col-span-2 bg-white border rounded-2xl p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Idea Title
              </label>
              <input
                type="text"
                placeholder="Enter idea title"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                rows="5"
                placeholder="Describe your idea in detail..."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="Teaching">Teaching</option>
                <option value="Facilities">Facilities</option>
                <option value="System">System</option>
              </select>
            </div>

            {/* ANONYMOUS */}
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isAnonymous: e.target.checked
                  })
                }
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm text-slate-600">
                Submit as Anonymous
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/ideas")}
                className="px-5 py-2.5 rounded-lg border text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition"
              >
                Submit Idea
              </button>
            </div>

          </form>

        </div>

        {/* GUIDELINES PANEL */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">
            Submission Guidelines
          </h3>
          <ul className="text-sm text-slate-500 space-y-3">
            <li>• Provide a clear and concise title</li>
            <li>• Describe benefits and impact</li>
            <li>• Select the correct category</li>
            <li>• Submit before closure date</li>
          </ul>
        </div>

      </div>

    </div>
  );
};

export default SubmitIdea;