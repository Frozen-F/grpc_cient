// 下划线转驼峰
export const camelCase = (str:string = '') => {
  const camelCaseRegex = /[-_\s]+(.)?/g;
  return str.replace(camelCaseRegex, (match, char) => {
    return char ? char.toUpperCase() : '';
  });
};
