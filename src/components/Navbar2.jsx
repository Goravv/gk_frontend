import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar2 = () => {
  const linkStyle = {
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#333',
    borderRadius: '4px',
    marginLeft: '10px',
    transition: 'background-color 0.3s',
  };

  const activeStyle = {
    backgroundColor: '#3888d8', // active background color
    color: 'white',
  };

  const hoverStyle = {
    backgroundColor: '#1871ca', // hover background color
    color: 'white',
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'flex-end', // aligns content to right
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      {[ 'Home', 'orderitem','Estimate','packing'].map((text) => (
        <NavLink
          key={text}
          to={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
          onMouseEnter={(e) => {
            if (!e.target.classList.contains('active')) {
              Object.assign(e.target.style, hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.classList.contains('active')) {
              Object.assign(e.target.style, {
                backgroundColor: 'transparent',
                color: '#333',
              });
            }
          }}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {text}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar2;
