const dateFormater = dateTime => {
  const date = new Date(dateTime);
  return date.toDateString();
};

export default dateFormater;
