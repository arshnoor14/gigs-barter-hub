export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 overflow-hidden ">

      <div className="md:flex md:items-center md:justify-between container mx-auto px-6">
        <div className="md:w-1/2 text-center md:text-left p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-snug">
            Gigs & Barter Hub <br /> <center> <strong></strong> </center>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-md">
            Your friendly space to find gigs, post your services, and even exchange skills. Let’s make work fun, flexible, and rewarding!
          </p>
        </div>
        <div className="md:w-1/2 p-6">
          <img
            src="https://internetincomejamaica.com/wp-content/uploads/2025/07/remote-work-routine-digital-lifestyle-thumbnail.png-768x409.png"
            alt="Hero Image"
            className="w-full h-full object-cover rounded-3xl shadow-xl"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="md:flex items-center mt-16 container mx-auto px-6">
        <div className="md:w-1/3 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 transform -rotate-90 tracking-wide">
          </h2>
        </div>
        <div className="md:w-2/3 p-6 text-gray-700 leading-relaxed space-y-4">
          <p>
            Gig & Barter Hub is here to connect talented individuals with exciting short-term projects. Whether you want to get paid or exchange skills, we make it easy and fun.
          </p>
          <p>
            Our mission is to build a vibrant community where creativity meets opportunity. From posting gigs to applying for projects, we give you the tools to grow, collaborate, and succeed.
          </p>
          <p>
            By fostering flexible, rewarding connections, we aim to empower everyone to share their skills and discover new possibilities.
          </p>
        </div>
      </div>

      <div className="md:flex items-center mt-16 container mx-auto px-6">
        <div className="md:w-1/2 p-6">
          <img
            src="https://blogheist.com/wp-content/uploads/2021/01/Writing-and-Translation-Fiverr-Design.png"
            alt="Community Image"
            className="w-full h-full object-cover rounded-3xl shadow-xl"
          />
        </div>
        <div className="md:w-1/2 p-6 flex items-center justify-center">
          <p className="text-gray-900 text-lg md:text-xl text-center md:text-left">
            Join our community to explore, share, and grow together. Gig & Barter Hub makes discovering opportunities joyful, easy, and vibrant.
          </p>
        </div>
      </div>

    </div>
  );
}
