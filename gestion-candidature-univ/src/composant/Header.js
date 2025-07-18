import React, { useState } from 'react';
import { useSidebar } from "./context/SidebarContext";
import "./Header.css";
import { useUser } from './context/UserContext';
import ProfileDropdown from './ProfileDropdown';
import SearchButton from './SearchButton';
import { useSearch } from './context/SearchContext';

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { setSearchTerm } = useSearch();




  return (
    <header className="page-topbar" id="header">
      <div className="navbar navbar-fixed">
        <nav className="navbar-main navbar-color nav-collapsible sideNav-lock navbar-light">
          <div className="nav-wrapper">
            <div className="header-search-wrapper hide-on-med-and-down">
              <i className="material-icons">search</i>

              <span>
                <input onChange={(e) => setSearchTerm(e.target.value)}
                  className="header-search-input z-depth-2" type="text" name="Search" placeholder="Cherchez vous quelque chose" data-search="template-list" />
                <ul className="search-list collection display-none"></ul>


              </span>

   
            </div>

            <ul className="navbar-list">
              {/* Mobile search (toggle input) */}
              <SearchButton />

              {/* Profile menu dropdown */}
              <ProfileDropdown />
            </ul>



         




          </div>

        </nav>
      </div>


    </header>

  )
}
export default Header;