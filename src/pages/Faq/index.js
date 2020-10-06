import React, { Fragment } from 'react';
import SiteTitle from '../../components/SiteTitle';
import faqData from './data.js';
import FaqEntry from './components/FaqEntry';

const Faq = () => (
  <Fragment>
    <SiteTitle />
    <h2 className="text-white text-center text-4xl font-extrabold">FAQS</h2>
    <div className="mx-auto w-5/6 lg:w-1/2 mb-4 mt-5">
      {faqData.map((data) => (
        <FaqEntry key={data.question} data={data}></FaqEntry>
      ))}
    </div>
  </Fragment>
);

export default Faq;
