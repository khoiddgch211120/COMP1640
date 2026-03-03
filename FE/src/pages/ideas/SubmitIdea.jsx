import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIdea } from "../../redux/slices/ideaSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";

const SubmitIdea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    isAnonymous: false
  });

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
        }
      })
    );

    navigate("/ideas");
  };

  // Extra safety check
  if (user.role !== ROLES.STAFF) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">Submit Idea</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-3 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          rows="4"
          className="w-full border p-3 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="w-full border p-3 rounded"
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={(e) =>
              setForm({ ...form, isAnonymous: e.target.checked })
            }
          />
          Submit as Anonymous
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Idea
        </button>

      </form>
    </div>
  );
};

export default SubmitIdea;