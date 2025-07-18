// components/SearchBar.js
import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="nav-wrapper">
      <form id="navbarForm">
        <div className="input-field search-input-sm">
          <input
            className="search-box-sm mb-0"
            type="search"
            id="search"
            placeholder="Explorer les dossiers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label className="label-icon" htmlFor="search">
            <i className="material-icons search-sm-icon">search</i>
          </label>
          <i
            className="material-icons search-sm-close"
            onClick={() => setSearchTerm("")}
            style={{ cursor: "pointer" }}
          >
            close
          </i>
          <ul className="search-list collection search-list-sm display-none"></ul>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
