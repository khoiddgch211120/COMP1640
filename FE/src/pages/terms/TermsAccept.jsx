import { useNavigate } from "react-router-dom";

const TermsAccept = () => {

  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("acceptedTerms", "true");
    navigate("/submit-idea");
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white rounded-xl shadow-sm">

      <h1 className="text-2xl font-semibold mb-4">
        Terms & Conditions
      </h1>

      <p className="text-gray-600 mb-6">
        By submitting ideas to the University Idea Management System,
        you agree to the following rules and policies.
      </p>

      <ul className="list-disc pl-6 text-gray-500 mb-6">
        <li>Ideas must be respectful and constructive</li>
        <li>No confidential information should be submitted</li>
        <li>Ideas may be reviewed by QA Coordinators</li>
        <li>Anonymous submission is allowed</li>
      </ul>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => navigate("/ideas")}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleAccept}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
        >
          I Agree
        </button>

      </div>

    </div>
  );
};

export default TermsAccept;
