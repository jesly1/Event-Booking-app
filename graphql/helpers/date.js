exports.dateToString = (date) => {
    const parsedDate = new Date(date);  
    if (isNaN(parsedDate.getTime())) {
        return null;
    }
    return parsedDate.toISOString();
};
