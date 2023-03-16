const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
};

export const dateFormatter = (dateString) => {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)} ${padTo2Digits(day)}.${padTo2Digits(month)}.${year}`;
};
