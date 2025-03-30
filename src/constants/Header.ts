export interface NavItem {
  label: string;
  link: string;
  dropdown?: string[]; // Optional dropdown menu
}

export const navigationData: NavItem[] = [
  { label: "HOME", link: "/" },
  {
    label: "ABOUT US",
    link: "/about",
    dropdown: ["Leadership", "Our Contributions", "Vision & Mission"],
  },
  {
    label: "EDITOR'S CHOICE",
    link: "/editors-choice",
    dropdown: ["Featured Articles", "Interviews", "Reviews"],
  },
  {
    label: "STUDENT LOG",
    link: "/student-log",
    dropdown: ["Projects", "Achievements", "Experiences"],
  },
  {
    label: "SERIES",
    link: "/series",
    dropdown: ["Science", "History", "Technology"],
  },
  {
    label: "PUBLICATIONS",
    link: "/publications",
    dropdown: ["Journals", "Reports", "E-Books"],
  },
  {
    label: "CREATIVE",
    link: "/creative",
    dropdown: ["Photography", "Poetry", "Artworks"],
  },
  {
    label: "CONTACT US",
    link: "/contact",
    dropdown: ["Support", "Feedback", "Partnership"],
  },
];
