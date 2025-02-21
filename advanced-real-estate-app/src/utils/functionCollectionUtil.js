export const renderEffect = (text, time) => {
    let i = 0;
    const intervalId = setInterval(() => {
        if (i < text.length) {
            text.substring(0, i + 1);
            i++;
        } else {
            clearInterval(intervalId);
        }
    }, time);
    return () => clearInterval(intervalId);
};