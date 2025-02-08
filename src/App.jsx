import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const usersPerPage = 5;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        let filteredData = response.data;

        if (search) {
          filteredData = filteredData.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        filteredData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });

        setUsers(filteredData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [search, sortOrder]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="search">Search Users:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleSortToggle} style={{ padding: "5px" }}>
          Sort
        </button>
      </div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div>
          <ul>
            {paginatedUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px",
                  fontWeight: currentPage === index + 1 ? "bold" : "normal",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
