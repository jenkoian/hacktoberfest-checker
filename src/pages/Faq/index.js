import React from 'react';
import SiteTitle from 'components/SiteTitle';
import faqData from './data.js';
import FaqEntry from './components/FaqEntry';

const Faq = () => (
  <>
    <SiteTitle />
    <h2 className="text-4xl font-extrabold text-center text-hack-fg light-mode:text-hack-dark-title">
      FAQS
    </h2>
    <div className="w-5/6 mx-auto mt-5 mb-4 lg:w-1/2">
      {faqData.map((data) => (
        <FaqEntry key={data.question} data={data}></FaqEntry>
      ))}
    </div>
  </>
);

export default Faq;
