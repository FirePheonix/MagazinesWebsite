import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

const About = () => {
  return (
    <>
      <Header />
      <main className="w-[90%] max-w-5xl mx-auto py-12 text-gray-800">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are driven by innovation and dedicated to excellence. Our mission is to bring impactful ideas to life through design, technology, and strategy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque efficitur nisl in eros blandit, et porttitor leo blandit. Sed vel lorem sed turpis fermentum suscipit. Donec quis velit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent eu tortor nec metus tristique laoreet. Integer at dapibus risus, ac rhoncus lorem.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            Curabitur feugiat, orci nec tincidunt placerat, lacus arcu imperdiet justo, ac vulputate velit nisi a quam. Nam non mi id erat iaculis cursus. Etiam sit amet sapien et elit eleifend tristique. Fusce eget nisl nec libero iaculis mattis. Sed at magna a leo suscipit dignissim.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Maecenas vitae ligula sit amet nunc blandit finibus. Suspendisse potenti. Proin in porttitor nulla. Morbi et leo nec urna suscipit mattis. Ut a sodales mi, a posuere est. Nulla facilisi. Morbi id massa a nisl tincidunt egestas non sit amet sem. Suspendisse fermentum nunc sed luctus volutpat.
          </p>
        </section>

        <section className="bg-gray-100 rounded-xl p-8 mt-16">
          <h3 className="text-xl font-semibold mb-4">Join Our Journey</h3>
          <p className="text-gray-700 leading-relaxed">
            We believe in creating meaningful relationships with our clients and communities. If our values resonate with you, let's work together to make something amazing.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
