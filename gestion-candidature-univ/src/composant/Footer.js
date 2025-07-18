import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const bodyStyle = {
    height: '100%',
    margin: 0,
    display: 'flex',
    flexDirection: 'column'
  };

  const contentStyle = {
    flex: 1,
    padding: '20px'
  };

  const footerStyle = {
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: '10px 0',
    textAlign: 'center',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    marginTop: 'auto'
  };

  return (
    <div style={bodyStyle}>
      <div style={contentStyle}>
        {/* Your main content goes here */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        
        <br />
        <br />
        <br />
      </div>
      <footer className="page-footer footer footer-light navbar-border navbar-shadow" style={footerStyle}>
        <div className="footer-copyright">
          <div className="container">
            <span>
              &copy; {currentYear}{" "}
              <a
                href="../../../../user/pixinvent/portfolio.html?ref=pixinvent"
                target="_blank"
                rel="noopener noreferrer"
              >
                BAOBAB
              </a>{" "}
              Tout Droit Reserve.
            </span>
           
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
