const dateFormatter = dateTime => {
  const date = new Date(dateTime);
  return date.toDateString();
};

export default dateFormatter;
