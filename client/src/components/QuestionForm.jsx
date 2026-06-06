import React from "react";

function QuestionForm({
  editId,
  formData,
  setFormData,
  addMode,
  setAddMode,
  linkInput,
  setLinkInput,
  scraping,
  loading,
  handleParseLink,
  handleChange,
  handleSubmit,
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      const imgTag = `\n<img src="${base64String}" alt="${file.name || 'image'}" />\n`;
      setFormData({
        ...formData,
        notes: (formData.notes || "") + imgTag
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="question-form"
      className="
        bg-gray-200
        dark:bg-gray-800
        p-6
        rounded-xl
        mb-8
      "
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {editId ? "Update Question" : "Add Question"}
        </h2>
      </div>

      {/* Form Mode Tabs (Only show if not editing a question) */}
      {!editId && (
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setAddMode("manual");
              setLinkInput("");
              setFormData({
                title: "",
                topic: defaultPlatform,
                difficulty: "Easy",
                status: "Pending",
                notes: "",
                link: "",
              });
            }}
            className={`pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
              addMode === "manual"
                ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Manually Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAddMode("link");
              setLinkInput("");
              setFormData({
                title: "",
                topic: defaultPlatform,
                difficulty: "Easy",
                status: "Pending",
                notes: "",
                link: "",
              });
            }}
            className={`pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
              addMode === "link"
                ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Add via Link
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* URL Input and Done Button for Link mode */}
        {addMode === "link" && !formData.title && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              aria-label="Paste Problem URL"
              type="url"
              disabled={scraping}
              placeholder="Paste Link (LeetCode, GeeksforGeeks, etc.)"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="
                flex-1
                p-3
                rounded-lg
                bg-white
                dark:bg-gray-700
                text-black
                dark:text-white
                border
                border-gray-300
                dark:border-gray-600
                outline-none
                disabled:opacity-60
              "
            />
            <button
              type="button"
              disabled={scraping}
              onClick={handleParseLink}
              className={`
                px-6
                py-3
                rounded-lg
                text-white
                font-semibold
                transition-all
                ${
                  scraping
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }
              `}
            >
              {scraping ? "Fetching..." : "Done"}
            </button>
          </div>
        )}

        {/* Show Form fields if Manual mode OR Link mode with parsed title */}
        {(addMode === "manual" || (addMode === "link" && formData.title)) && (
          <>
            {addMode === "link" && !editId && (
              <button
                type="button"
                onClick={() => {
                  setLinkInput("");
                  setFormData({
                    title: "",
                    topic: defaultPlatform,
                    difficulty: "Easy",
                    status: "Pending",
                    notes: "",
                    link: "",
                  });
                }}
                className="text-red-600 dark:text-red-400 hover:underline text-sm text-left mb-2 cursor-pointer w-fit inline-flex items-center gap-1 font-medium"
              >
                &larr; Paste a different link
              </button>
            )}

            {/* Title */}
            <input
              aria-label="Question Title"
              type="text"
              name="title"
              placeholder="Question Title"
              value={formData.title}
              onChange={handleChange}
              className="
                p-3
                rounded-lg
                bg-white
                dark:bg-gray-700
                text-black
                dark:text-white
                border
                border-gray-300
                dark:border-gray-600
                outline-none
              "
            />

            {/* Topic / Platform Dropdown */}
            <select
              aria-label="Question Platform"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="
                p-3
                rounded-lg
                bg-white
                dark:bg-gray-700
                text-black
                dark:text-white
                border
                border-gray-300
                dark:border-gray-600
                outline-none
                cursor-pointer
              "
            >
              <option value="LeetCode">LeetCode</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="Codeforces">Codeforces</option>
              <option value="DSA">DSA / Other</option>
              {formData.topic && !["LeetCode", "GeeksforGeeks", "Codeforces", "DSA"].includes(formData.topic) && (
                <option value={formData.topic}>{formData.topic}</option>
              )}
            </select>

            {/* Difficulty */}
            <select
              id="difficulty"
              name="difficulty"
              aria-label="Select Difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="
                p-3
                rounded-lg
                bg-white
                dark:bg-gray-700
                text-black
                dark:text-white
                border
                border-gray-300
                dark:border-gray-600
                outline-none
                cursor-pointer
              "
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            {/* Problem Link (Hidden in manual add mode unless editing) */}
            {(addMode !== "manual" || editId) && (
              <input
                aria-label="Problem Link"
                type="text"
                name="link"
                placeholder="Problem Link"
                value={formData.link}
                onChange={handleChange}
                className="
                  p-3
                  rounded-lg
                  bg-white
                  dark:bg-gray-700
                  text-black
                  dark:text-white
                  border
                  border-gray-300
                  dark:border-gray-600
                  outline-none
                "
              />
            )}

            {/* Notes with Attach Image Option */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer transition">
                  📎 Attach Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                aria-label="Question Notes"
                name="notes"
                placeholder="Write your notes here... (HTML formatting and attached images are supported)"
                value={formData.notes}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="
                  p-3
                  rounded-lg
                  bg-white
                  dark:bg-gray-700
                  text-black
                  dark:text-white
                  border
                  border-gray-300
                  dark:border-gray-600
                  outline-none
                  min-h-[120px]
                "
              />
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className={`
                p-3
                rounded-lg
                transition-all
                text-white
                font-semibold
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }
              `}
            >
              {loading
                ? "Loading..."
                : editId
                ? "Update Question"
                : "Add Question"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default QuestionForm;
