import React from 'react';

var inlineStyle = {
  display: 'none'
};

const FaqEntry = ({ data }) => {
  //console.log(data);
  return (
    <div className="faqs shadow-lg flex text-mid-grey mb-6 p-4 break-words">
      <div className="pb-2 flex flex-wrap justify-left content-center rounded mx-auto my-5 overflow-hidden w-5/6 lg:w-100 ">
        <h2 className="text-light-blue mb-4">{data.question}</h2>
        <p className="text-mid-grey">{data.answer}</p>
      </div>
    </div>
  );
};

export default FaqEntry;
