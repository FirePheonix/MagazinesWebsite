import { Link } from "react-router-dom";
import { footerData } from "@/constants/Footer";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold">
            {footerData.agencyText.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </h2>
        </div>

        {/* Middle Section - Locations */}
        <div className="flex flex-col space-y-6">
          {footerData.locations.map((location, index) => (
            <div key={index}>
              <h3 className="text-sm font-bold">{location.city}</h3>
              <p>
                <a href={`mailto:${location.email}`} className="underline">
                  {location.email}
                </a>
                <br />
                {location.phone}
                <br />
                {location.address.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <Link
                to={location.mapLink}
                className="block mt-2 font-bold underline"
              >
                SEE ON MAP →
              </Link>
            </div>
          ))}
        </div>

        {/* Right Section - Newsletter & Socials */}
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-sm font-bold">{footerData.newsletter.text}</h3>
            <Link
              to={footerData.newsletter.link}
              className="block mt-2 font-bold underline"
            >
              {footerData.newsletter.linkText}
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold">FOLLOW US</h3>
            <div className="flex space-x-4 mt-2">
              {footerData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
