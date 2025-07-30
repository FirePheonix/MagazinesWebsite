import { createHashRouter } from "react-router-dom";

import MainPage from "@/pages/MainPage";
import About from "@/pages/About";
import Leadership from "@/pages/Leadership";
import OurContributions from "@/pages/OurContributions";
import VisionMission from "@/pages/VisionMission";

import FeaturedArticles from "@/pages/FeaturedArticles";
import Interviews from "@/pages/Interviews";
import Reviews from "@/pages/Reviews";
import SinglePostsPage from "@/pages/SinglePostPage"; // Import the SinglePostsPage component

import Projects from "@/pages/Projects";
import Achievements from "@/pages/Achievements";
import Experiences from "@/pages/Experience";

import Science from "@/pages/Science";
import History from "@/pages/History";
import Technology from "@/pages/Technology";

import Journals from "@/pages/Journals";
import Reports from "@/pages/Reports";
import EBooks from "@/pages/EBook";

import Photography from "@/pages/Photography";
import Poetry from "@/pages/Poetry";
import Artworks from "@/pages/Artworks";

import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import Write from "@/pages/Write";

const router = createHashRouter([
  { path: "/", element: <MainPage /> },

  // About Us
  { path: "/about", element: <About /> },
  { path: "/leadership", element: <Leadership /> },
  { path: "/our-contributions", element: <OurContributions /> },
  { path: "/vision-mission", element: <VisionMission /> },

  // Editor's Choice
  { path: "/featured-articles", element: <FeaturedArticles /> },
  { path: "/interviews", element: <Interviews /> },
  { path: "/reviews", element: <Reviews /> },
  { path: "/blog/:id", element: <SinglePostsPage /> }, // Add route for individual blog posts

  // Student Log
  { path: "/projects", element: <Projects /> },
  { path: "/achievements", element: <Achievements /> },
  { path: "/experiences", element: <Experiences /> },

  // Series
  { path: "/science", element: <Science /> },
  { path: "/history", element: <History /> },
  { path: "/technology", element: <Technology /> },

  // Publications
  { path: "/journals", element: <Journals /> },
  { path: "/reports", element: <Reports /> },
  { path: "/e-books", element: <EBooks /> },

  // Creative
  { path: "/photography", element: <Photography /> },
  { path: "/poetry", element: <Poetry /> },
  { path: "/artworks", element: <Artworks /> },

  // Contact
  { path: "/contact", element: <Contact /> },

  //Write Posts
  { path: "/write", element: <Write />},

  // Fallback
  { path: "*", element: <NotFound /> },
]);

export default router;