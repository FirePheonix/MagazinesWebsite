import React from 'react';

const ArtGallery = () => {
  const artworks = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop",
      title: "The feminine energy",
      date: "mdcxlii"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=1200&fit=crop",
      title: "The artist in studio",
      date: "mdcxlxvi"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&auto=format&q=80",
      title: "Titan as warrior monk",
      date: "mcxvll"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=1200&fit=crop&auto=format&q=80",
      title: "coming to a new life",
      date: "mdclx"
    }
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-screen flex">
        {artworks.map((artwork, index) => (
          <React.Fragment key={artwork.id}>
            <div className="relative w-1/4 h-screen overflow-hidden group cursor-pointer">
              <div className="relative w-full h-full">
                {/* Image */}
                <img 
                  src={artwork.image}
                  alt={artwork.title}
                  className="absolute w-full h-full object-cover scale-150 transition-transform duration-[2000ms] ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-100"
                />
                
                {/* Overlay */}
                <div className="absolute w-full h-full top-0 left-0 bg-[#dfdbd5] transition-all duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:-top-full"></div>
                
                {/* Content */}
                <div className="absolute w-full h-full flex flex-col justify-between items-center px-8 py-32 z-10 transition-colors duration-300 ease-[cubic-bezier(0.075,0.82,0.165,1)] text-black group-hover:text-white">
                  <div className="text-center">
                    <div className="text-4xl uppercase leading-[60px] font-serif">
                      {artwork.title}
                      <span className="block text-xl leading-[120%] font-sans mt-2">
                        {artwork.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-red-500 text-[150px] font-serif">
                    {artwork.id}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider - don't add after last item */}
            {index < artworks.length - 1 && (
              <div className="relative w-px h-screen bg-black bg-opacity-25"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArtGallery;