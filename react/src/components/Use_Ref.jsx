import { useState, useEffect, useRef } from 'react';

export default function Use_Ref() {
  const inputRef = useRef(null);
  return (
    <div className="bg-white min-h-screen">
      <input  type="text" />
      <input ref={inputRef} type="email" />
      <button onClick={() => inputRef.current.focus()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Focus Input
      </button>
    </div>
  );
}