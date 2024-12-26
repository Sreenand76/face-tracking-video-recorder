import './globals.css';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
      
        <link rel="icon" href="/favicon.png"></link>
        <title>Face Tracking Application</title>
      </head>
      <body>
        <main>{children}</main>
      </body>
    
    </html>
  );
};

export default Layout;
