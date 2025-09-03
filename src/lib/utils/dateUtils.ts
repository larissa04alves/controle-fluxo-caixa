export const getCurrentMonth = (): string => {
    return String(new Date().getMonth() + 1);
};

export const getCurrentYear = (): string => {
    return String(new Date().getFullYear());
};

export const getDefaultMonthFilter = (): string => {
    return getCurrentMonth();
};
