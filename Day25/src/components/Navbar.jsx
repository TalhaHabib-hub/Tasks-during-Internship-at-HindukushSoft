import 'boxicons'
import "bootstrap/dist/css/bootstrap.min.css";
import  './Navbar.css'

import React from 'react'

function Navbar () {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navigationBar">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Task Manager
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <box-icon name='menu' className='box'></box-icon>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Months
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      this month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      previous
                    </a>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      next month
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">
                 <strike>will do later</strike> 
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                search
              </button>
            </form>
          </div>
        </div>
      </nav>
  )
}

export default  Navbar