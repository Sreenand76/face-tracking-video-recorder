import React from 'react'

const NavBar = () => {
  return (
    <nav className=" py-4 px-3 md:px-6 bg-gray-50 shadow-black">
      <div className="flex items-center md:pl-5">

        {/* Logo with Gradient and Shadow */}
        <div className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <a href="/">FaceMotion Cam</a>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;






