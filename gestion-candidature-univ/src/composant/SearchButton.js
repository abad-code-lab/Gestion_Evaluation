import React, { useEffect, useState } from "react";
import { useSearch } from "./context/SearchContext";
import { Button } from "antd";

function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input-wrapper')) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Toggle search input visibility
  const toggleSearchInput = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  if (isSearchOpen) {
    return (
      <div 
        className={`test-li3 input-field search-input-wrapper`} 
        style={{
          // marginLeft: '10px',
          // backgroundColor: '#f0f0f0',
          // padding: '5px',
          // borderRadius: '5px',
          // width: '80vw',
          // maxWidth: '300px'
        }}
      >
        
            {/* <Button
              className="waves-block waves-light search-button" 
              onClick={toggleSearchInput}
            >
              <i className="material-icons">search</i>
            </Button> */}
          
        <input 
          type="search" 
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..." 
          className="search-box-sm mb-0"
          style={{
            borderRadius: '2px',
            border: '1px solid #ccc',
            padding: '35px',
            // backgroundColor: '#fff'
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="test-li2"> 
        <ul>
          {/* Search Button */}
          <li className="hide-on-large-only search-input-wrapper">
            <a 
              className="waves-block waves-light search-button" 
              onClick={toggleSearchInput}
            >
              <i className="material-icons">search</i>
            </a>
          </li>
        </ul>
      </div>
    );
  }
  }
  
export default SearchButton;
