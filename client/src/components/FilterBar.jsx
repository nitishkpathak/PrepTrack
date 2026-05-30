function FilterBar({

  searchTerm,
  setSearchTerm,

  difficultyFilter,
  setDifficultyFilter,

  statusFilter,
  setStatusFilter,

}) {

  return (

    <div
      className="
        bg-gray-200
        dark:bg-gray-900

        border
        border-gray-300
        dark:border-gray-800

        p-5
        rounded-xl
        mb-8

        shadow-md

        transition
        duration-300
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >

        {/* Search */}
        <input

          type="text"

          placeholder="
            Search questions...
          "

          value={searchTerm}

          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }

          className="
            p-3
            rounded-lg

            bg-white
            dark:bg-gray-800

            text-black
            dark:text-white

            outline-none

            border
            border-gray-300
            dark:border-gray-700

            focus:border-blue-500

            transition
            duration-300
          "
        />

        {/* Difficulty */}
        <select

          value={difficultyFilter}

          onChange={(e) =>
            setDifficultyFilter(
              e.target.value
            )
          }

          className="
            p-3
            rounded-lg

            bg-white
            dark:bg-gray-800

            text-black
            dark:text-white

            outline-none
            cursor-pointer

            border
            border-gray-300
            dark:border-gray-700

            focus:border-blue-500

            transition
            duration-300
          "
        >

          <option value="">
            All Difficulty
          </option>

          <option value="Easy">
            Easy
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Hard">
            Hard
          </option>

        </select>

        {/* Status */}
        <select

          value={statusFilter}

          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }

          className="
            p-3
            rounded-lg

            bg-white
            dark:bg-gray-800

            text-black
            dark:text-white

            outline-none
            cursor-pointer

            border
            border-gray-300
            dark:border-gray-700

            focus:border-blue-500

            transition
            duration-300
          "
        >

          <option value="">
            All Status
          </option>

          <option value="Solved">
            Solved
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Revision">
            Revision
          </option>

        </select>

      </div>

    </div>
  );
}

export default FilterBar;