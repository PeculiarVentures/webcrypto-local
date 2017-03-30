const subjectNames = {
  O: 'organization',
  CN: 'name',
  C: 'country',
  OU: 'organizationUnit',
  L: 'city',
  ST: 'region',
};

export default function decodeSubjectString(subjectString) {
  const subjectObj = {};
  const arrSubjects = subjectString.split(/, /g);
  arrSubjects.map((sbj) => {
    const arrSubject = sbj.split('=');
    const subjectName = subjectNames[arrSubject[0]];
    const subjectValue = arrSubject[1];
    subjectObj[subjectName] = subjectValue;
    return true;
  });
  return subjectObj;
}
