import React from 'react';

const FaqEntry = ({ data }) => {
  return (
    <div className="faqs light-mode:text-hack-dark-title shadow-lg flex mb-6 p-4 break-words">
      <div className="pb-2 flex flex-wrap justify-left content-center rounded mx-auto my-5 overflow-hidden w-5/6 lg:w-100 ">
        <h3 className="text-hack-dark-title light-mode:text-hack-dark-title mb-4">
          {data.question}
        </h3>
        <p className="text-hack-fg light-mode:text-hack-fg overflow-auto">
          {data.answer}
        </p>
      </div>
    </div>
  );
};

export default FaqEntry;
