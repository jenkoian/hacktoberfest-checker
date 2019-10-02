import React from 'react';

const FaqEntry = data => (
  <div className="flex flex-wrap justify-center content-center">
    <h2 className="text-orange">{data.question}</h2>
    <p className="text-white">{data.answer}</p>
  </div>
);

export default FaqEntry