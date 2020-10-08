import React from 'react';

const FaqEntry = ({ data }) => {
  return (
    <div className="faqs light-mode:text-dark-blue shadow-lg flex mb-6 p-4 break-words">
      <div className="pb-2 flex flex-wrap justify-left content-center rounded mx-auto my-5 overflow-hidden w-5/6 lg:w-100 ">
        <h3 className="text-light-blue light-mode:text-dark-blue mb-4">
          {data.question}
        </h3>
        <p className="text-mid-grey light-mode:text-dark-grey overflow-auto">
          {data.answer}
        </p>
      </div>
    </div>
  );
};

export default FaqEntry;
