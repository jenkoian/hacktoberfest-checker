import React, { Fragment } from 'react';
import SiteTitle from '../../components/SiteTitle';
import faqData from './data.js';
import FaqEntry from './components/FaqEntry';

const Faq = () => (
  <Fragment>
    <SiteTitle>Hacktoberfest Checker</SiteTitle>
    <h1 className="text-white text-center text-4xl font-extrabold">F.A.Q.</h1>
    {faqData.map(data => (
        <FaqEntry data={data}></FaqEntry>
    ))}
  </Fragment>
);

export default Faq;
