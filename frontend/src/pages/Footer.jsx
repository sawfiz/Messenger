// Libraries
import React from 'react';

export default function Footer() {
  return (
    // With "fixed bottom-0" the Footer is taken out of the normal flow of the DOM and require
    // custom CSS, (e.g., padding-bottom on the <body>) to prevent overlap with other elements.
    <div className="fixed bottom-0 w-full bg-dark text-white text-sm h-5 flex justify-center">
      <p>Copyright © 2023 sawfiz</p>
    </div>
  );
}
