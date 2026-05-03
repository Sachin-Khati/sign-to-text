import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} AI-based Sign language detector and tutor. All rights reserved. By SAHIN KHATI</p>
      </div>
    </footer>
  );
}
