export const LIST_OF_EXAMS = [
  { id: 1, name: "Rohtak" },
  { id: 2, name: "GMAT" },
  { id: 3, name: "LSAT" },
  { id: 4, name: "SAT" },
  { id: 5, name: "ACT" },
  { id: 6, name: "TOEFL" },
  { id: 7, name: "IELTS" },
];

const EXAM_DETAILS = {
  1: {
    title: "Rohtak Certification Center",
    websiteLabel: "Rohtak Website",
    websiteHref: "#rohtak-website",
  },
  2: {
    title: "Graduate Management Admission Test (GMAT)",
    websiteLabel: "GMAT Website",
    websiteHref: "#gmat-website",
  },
  3: {
    title: "Law School Admission Test (LSAT)",
    websiteLabel: "LSAT Website",
    websiteHref: "#lsat-website",
  },
  4: {
    title: "Scholastic Assessment Test (SAT)",
    websiteLabel: "SAT Website",
    websiteHref: "#sat-website",
  },
  5: {
    title: "American College Testing (ACT)",
    websiteLabel: "ACT Website",
    websiteHref: "#act-website",
  },
  6: {
    title: "Test of English as a Foreign Language (TOEFL)",
    websiteLabel: "TOEFL Website",
    websiteHref: "#toefl-website",
  },
  7: {
    title: "International English Language Testing System (IELTS)",
    websiteLabel: "IELTS Website",
    websiteHref: "#ielts-website",
  },
};

export function getExamById(id) {
  const exam = LIST_OF_EXAMS.find((item) => String(item.id) === String(id));
  if (!exam) return null;

  const details = EXAM_DETAILS[exam.id] ?? {
    title: exam.name,
    websiteLabel: `${exam.name} Website`,
    websiteHref: `#${exam.name.toLowerCase()}-website`,
  };

  return { ...exam, ...details };
}
