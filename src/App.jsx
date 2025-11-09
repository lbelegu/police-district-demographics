import { useState } from 'react'

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Police District Demographics</h1>
      <div className="space-x-4">
        <a href="#" className="hover:text-blue-400">Home</a>
        <a href="#" className="hover:text-blue-400">About</a>
        <a href="#" className="hover:text-blue-400">Upload</a>
      </div>
    </nav>
  );
}

function MapPlaceholder() {
  return (
    <div className="flex items-center justify-center bg-gray-100 text-gray-500 h-[70vh]">
      <p>Map visualization will go here (Leaflet)</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Police District Demographics</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <MapPlaceholder />
      </main>
      <Footer />
    </div>
  );
}
