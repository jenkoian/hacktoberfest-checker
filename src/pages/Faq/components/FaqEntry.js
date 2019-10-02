import React from 'react';

const FaqEntry = ({ data }) => {
  console.log(data);
  return (
    <div className="pb-2 flex flex-wrap justify-left content-center rounded mx-auto my-5 overflow-hidden w-5/6 lg:w-1/2 ">
      <h2 className="text-orange">{data.question}</h2>
      <p className="text-white">{data.answer}</p>
    </div>
  );
};

export default FaqEntry;
